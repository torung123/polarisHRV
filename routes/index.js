const express = require('express');
const verifyOAuth = require('../helpers').verifyOAuth;
const mongoose = require('mongoose');
const config = require('../config');

const Shop = mongoose.model('Shop');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  const query = Object.keys(req.query).map((key) => `${key}=${req.query[key]}`).join('&');
  if (req.query.shop) {
    Shop.findOne({ haravan_domain: req.query.shop, isActive: true }, (err, shop) => {
      if (!shop) {
        return res.redirect(`/install/?${query}`);
      }
      if (verifyOAuth(req.query)) {
        return res.render('app', {
          title: 'Shopify Node App',
          apiKey: config.HARAVAN_API_KEY,
          shop: shop.haravan_domain,
        });
      }
      return res.render('app', {
        title: 'Shopify Node App',
        apiKey: config.HARAVAN_API_KEY,
        shop: req.query.shop,
      });
    });
  } else {
    return res.render('app', {
      title: 'Haravan App',
      apiKey: config.HARAVAN_API_KEY,
      shop: 'doke-apps.myharavan.com',
    });
  }
});

router.get('/error', (req, res) => res.render('error', { message: 'Something went wrong!' }));

module.exports = router;
