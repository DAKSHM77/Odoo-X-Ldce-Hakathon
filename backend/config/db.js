const mongoose = require('mongoose');
const { MONGO_URI } = require('./env');

const connectDB = async () => {
  if (!MONGO_URI) {
    console.error('FATAL ERROR: MONGO_URI environment variable is not defined.');
    return false;
  }

  try {
    mongoose.set('bufferCommands', false);
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`MongoDB Connection Warning: ${error.message}`);
    return false;
  }
};

module.exports = connectDB;
