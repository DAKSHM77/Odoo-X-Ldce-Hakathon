const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb+srv://yashbaraiya420_db_user:MXrVZlnJ6gq6dMeA@cluster0.2up74ak.mongodb.net/odoo_hackathon?retryWrites=true&w=majority&appName=Cluster0',
  JWT_SECRET: process.env.JWT_SECRET || 'supersecretkey123_odoo_hackathon_2026',
  NODE_ENV: process.env.NODE_ENV || 'development',
};
