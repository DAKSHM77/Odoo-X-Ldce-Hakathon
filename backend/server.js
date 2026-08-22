const express = require('express');
const cors = require('cors');
const { PORT } = require('./config/env');
const connectDB = require('./config/db');
const tripRoutes = require('./routes/tripRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'GlobeTrotter Backend API is active and running.'
  });
});

// API Routes
app.use('/api/trips', tripRoutes);

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Keep process active
setInterval(() => {}, 1000 * 60 * 60);

// Start Express Server
const server = app.listen(PORT, () => {
  console.log(`GlobeTrotter Backend Server running on port ${PORT}`);
  connectDB();
});

// Prevent process from exiting on uncaught errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
