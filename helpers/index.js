const HaravanAPI = require('shopify-node-api');
const config = require('../config');
const crypto = require('crypto');
/**
 * A file full of helper functions that I found useful for building haravan apps.
 */
module.exports = {
  /**
   * openSession - Opens a Shopify Session which allows Shopify API calls.
   * @param {string} shop - The name of the shop object you want to open a new session for.
   * @returns {object} An active haravan session with access to the API and such.
   */
  openSession(shop) {
    return new HaravanAPI({
      shop: shop.haravan_domain,
      haravan_api_key: config.HARAVAN_API_KEY,
      haravan_shared_secret: config.HARAVAN_SHARED_SECRET,
      access_token: shop.accessToken,
    });
  },

  /**
   * buildWebhook()
   * @param {String} topic - The topic of the webhook you wish to create
   * @param {String} address - The URL you want the webhook data sent to
   * @param {HaravanAPI} shop - HaravanAPI instance for the Shop you're creating the webhook for
   * @param {function} callback - A callback url for when the request is complete
   * @returns function or false if unsuccesful.
   */
  buildWebhook(topic = '', address = `${config.APP_URI}/webhook/`, shop = {}, callback) {
    if (topic.length === 0) {
      return false;
    } else if (address.length === 0) {
      return false;
    } else if (typeof shop !== 'object') {
      return false;
    } else if (typeof callback !== 'function') {
      return false;
    }
    const data = {
      webhook: {
        topic,
        address,
        format: 'json',
      },
    };
    shop.post('/admin/webhooks.json', data, (err, response, headers) => {
      if (err) {
        if (typeof callback === 'function') {
          return callback(err, response, headers);
        }
        return false;
      }
      return typeof callback === 'function' ? callback(null, response, headers) : true;
    });
    return typeof callback === 'function' ? callback('Could not create webhook', null, null) : false;
  },

  generateNonce(bits = 64) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';

    for (let i = 0; i < bits; i += 1) {
      text += possible.charAt(Math.floor(Math.random() * bits));
    }
    return text;
  },

  verifyHmac(data, hmac) {
    if (!hmac) {
      return false;
    } else if (!data || typeof data !== 'object') {
      return false;
    }

    const sharedSecret = config.HARAVAN_SHARED_SECRET;
    const calculatedSignature = crypto.createHmac('sha256', sharedSecret).update(data).digest('hex');
    return calculatedSignature === hmac;
  },

  verifyOAuth(params) {
    if (!params.signature) {
      return false;
    }

    var signature = params['signature'],
        calculated_signature = '';

    var signer = crypto.createHmac('sha256',config.HARAVAN_SHARED_SECRET);
    if(params['code']) calculated_signature = 'code=' + params['code'];
    calculated_signature += 'shop=' + params['shop'] + 'timestamp=' + params['timestamp'];

    var hash = signer.update(calculated_signature).digest('hex');

    return (hash === signature);


    // const signature = query.signature;
    // const sharedSecret = config.HARAVAN_SHARED_SECRET;
    // delete query.signature;
    // const sortedQuery = Object.keys(query).map(key => `${key}=${Array(query[key]).join(',')}`).sort().join('&');
    // const calculatedSignature = crypto.createHmac('sha256', sharedSecret).update(sortedQuery).digest('hex');
    // console.log(calculatedSignature);
    // console.log(signature);
    // if (calculatedSignature === signature) {
    //   return true;
    // }

    // return false;
  },
};


