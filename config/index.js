const env = process.env.NODE_ENV;
const production = require('./production');
const development = require('./development');

// You should put any global variables in here.
const config = {
  HARAVAN_API_KEY: process.env.HARAVAN_API_KEY || '',
  HARAVAN_SHARED_SECRET: process.env.HARAVAN_SHARED_SECRET || '',
  APP_NAME: process.env.APP_NAME || 'Doke-App',
  // APP_STORE_NAME: 'Doke App',
  APP_SCOPE: 'read_products,write_products,read_customers,write_customers',
  DATABASE_NAME: 'doke-app',
};

if (env !== 'PRODUCTION') {
  module.exports = Object.assign({}, config, development);
} else {
  module.exports = Object.assign({}, config, production);
}
