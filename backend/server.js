const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { PORT } = require('./config/env');
const authRoutes = require('./routes/authRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running smoothly' });
});

// Routes
app.use('/api/auth', authRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
});
