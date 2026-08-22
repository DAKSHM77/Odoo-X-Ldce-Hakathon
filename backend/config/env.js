const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file in backend directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/globetrotter';

module.exports = {
  PORT,
  MONGO_URI
};
