const mongoose = require('mongoose')

/**
 * Connects to MongoDB Atlas using Mongoose and process.env.MONGO_URI.
 * Logs only safe status messages; never logs connection credentials or URIs.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB connected successfully: ${conn.connection.host}`)
  } catch (error) {
    console.error('MongoDB connection failed:', error.message)
    process.exit(1)
  }
}

module.exports = connectDB
