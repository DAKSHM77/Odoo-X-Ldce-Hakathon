const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/odoo_hackathon',
  JWT_SECRET: process.env.JWT_SECRET || 'supersecretkey123_odoo_hackathon_2026',
  NODE_ENV: process.env.NODE_ENV || 'development',
};
