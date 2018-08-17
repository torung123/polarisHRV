const express = require('express');
const Shop = require('../models/Shop');
const Haravan = require('shopify-node-api');
const config = require('../config');
const generateNonce = require('../helpers').generateNonce;
const buildWebhook = require('../helpers').buildWebhook;

const router = express.Router();

// @route   GET  /install/?shop=[tên shop]
// @desc    cài đặt shop
// @access  public
router.get('/', (req, res) => {
  const shopName = `${req.query.shop}.myharavan.com`;
  const nonce = generateNonce();
  const query = Shop.findOne({ haravan_domain: shopName }).exec();

  const shopAPI = new Haravan({
    shop: shopName,
    haravan_api_key: config.HARAVAN_API_KEY,
    haravan_shared_secret: config.HARAVAN_SHARED_SECRET,
    haravan_scope: config.APP_SCOPE,
    redirect_uri: `${config.APP_URI}/install/callback`,
    nonce
  });
  const redirectURI = shopAPI.buildAuthURL();

  query.then((response) => {
    let save;
    const shop = response;
    if (!shop) {
      save = new Shop({ haravan_domain: shopName, name: req.query.shop, nonce }).save();
    } else {
      shop.haravan_domain = shopName;
      shop.name = req.query.shop;
      shop.nonce = nonce;
      save = shop.save();
    }
    return save.then(() => res.redirect(redirectURI));
  });
});

// @route    GET /install/callback?shop=[giá trị]&timestamp=[giá trị]&code=[giá trị]
// @desc     link sau khi cài hoặc vào shop 
// @access   public
router.get('/callback', (req, res) => {
  const params = req.query;
  const query = Shop.findOne({ haravan_domain: params.shop }).exec();
  query.then((result) => {
    const shop = result;
    const shopAPI = new Haravan({
      shop: params.shop,
      haravan_api_key: config.HARAVAN_API_KEY,
      haravan_shared_secret: config.HARAVAN_SHARED_SECRET,
      redirect_uri: `${config.APP_URI}/install/callback`,
      code: params.code,
      verbose: false
      // nonce: shop.nonce
    });
    // console.log(shopAPI);
    shopAPI.exchange_temporary_token(params, (error, data) => {
      if (error) {
        console.log(error);
        res.redirect('/error');
      }
      shop.accessToken = data.access_token;
      shop.isActive = true;
      shop.save((saveError) => {
        if (saveError) {
          console.log('Cannot save shop: ', saveError);
          res.redirect('/error');
        }
        if (config.HARAVAN_API_KEY) {
          res.redirect(`https://${shop.haravan_domain}/admin/app#/embed/${config.HARAVAN_API_KEY}`);
        } else {
          res.redirect(`https://${shop.haravan_domain}/admin/app#/list`);
        }
      });
    });
  });
});

module.exports = router;
