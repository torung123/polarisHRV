/**
 * ./routes/api.js
 * This is where you'll set up any REST api endpoints you plan on using.
 */
const express = require('express');
const Shop = require('../models/Shop');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.sendStatus(200);
});

module.exports = router;
