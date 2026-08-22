const mongoose = require('mongoose');
const Trip = require('../models/Trip');

/**
 * @desc    Create a new trip
 * @route   POST /api/trips
 * @access  Public
 */
const createTrip = async (req, res) => {
  try {
    const { tripName, selectedCity, cityDetails, startDate, endDate, selectedSuggestions } = req.body || {};

    // 1. Validation: required fields
    if (!tripName || typeof tripName !== 'string' || !tripName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Trip name is required.'
      });
    }

    if (!selectedCity || typeof selectedCity !== 'string' || !selectedCity.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Selected city is required.'
      });
    }

    if (!startDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date is required.'
      });
    }

    if (!endDate) {
      return res.status(400).json({
        success: false,
        message: 'End date is required.'
      });
    }

    // 2. Validation: date order
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid start date or end date format.'
      });
    }

    if (end < start) {
      return res.status(400).json({
        success: false,
        message: 'End date cannot be earlier than start date.'
      });
    }

    const payload = {
      tripName: tripName.trim(),
      selectedCity: selectedCity.trim(),
      cityDetails: cityDetails || {},
      startDate: start,
      endDate: end,
      selectedSuggestions: Array.isArray(selectedSuggestions) ? selectedSuggestions : []
    };

    // 3. Save to MongoDB if connected, else fallback to constructed object
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        const newTrip = new Trip(payload);
        const savedTrip = await newTrip.save();
        return res.status(201).json({
          success: true,
          trip: savedTrip
        });
      } catch (dbErr) {
        console.warn('MongoDB write error:', dbErr.message);
      }
    }

    // Fallback response if MongoDB is offline or disconnected
    const fallbackTrip = {
      _id: `trip_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return res.status(201).json({
      success: true,
      trip: fallbackTrip
    });
  } catch (error) {
    console.error('Error creating trip FULL:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create trip due to a server error.',
      errorDetails: error.message || String(error)
    });
  }
};

/**
 * @desc    Get all trips
 * @route   GET /api/trips
 * @access  Public
 */
const getTrips = async (req, res) => {
  try {
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      const trips = await Trip.find().sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        trips
      });
    }
    return res.status(200).json({
      success: true,
      trips: []
    });
  } catch (error) {
    console.error('Error fetching trips:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch trips due to a server error.'
    });
  }
};

module.exports = {
  createTrip,
  getTrips
};
