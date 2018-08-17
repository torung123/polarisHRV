const mongoose = require('mongoose');
const Counter = require('./Counter');


const Shop = mongoose.Schema({
  shopId: Number,
  haravan_domain: String, // Haravan domain without the .myharavan.com on the end.
  name: String,
  domain: String,
  supportEmail: String,
  nonce: String,
  accessToken: String,
  isActive: { type: Boolean, default: false },
});

module.exports = mongoose.model('Shop', Shop);
