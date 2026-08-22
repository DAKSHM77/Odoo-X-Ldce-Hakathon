const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

// 1. Load environment variables before accessing process.env
dotenv.config()

// 2. Import database connection helper
const connectDB = require('./config/db')

// 3. Initialize Express server
const app = express()

// 4. Connect to MongoDB
connectDB()

// 5. Middleware
app.use(cors())
app.use(express.json())

// 6. Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'GlobeTrotter API server is running' })
})

// 7. Start server listening
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
