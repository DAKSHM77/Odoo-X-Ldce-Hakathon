const mongoose = require('mongoose');

const cityDetailsSchema = new mongoose.Schema(
  {
    id: { type: String, trim: true },
    name: { type: String, trim: true },
    country: { type: String, trim: true },
    tagline: { type: String, trim: true }
  },
  { _id: false }
);

const suggestionSchema = new mongoose.Schema(
  {
    id: { type: String, trim: true },
    title: { type: String, trim: true },
    category: { type: String, trim: true }
  },
  { _id: false }
);

const tripSchema = new mongoose.Schema(
  {
    tripName: {
      type: String,
      required: [true, 'Trip name is required'],
      trim: true
    },
    selectedCity: {
      type: String,
      required: [true, 'Selected city is required'],
      trim: true
    },
    cityDetails: {
      type: cityDetailsSchema,
      default: {}
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    },
    selectedSuggestions: {
      type: [suggestionSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Trip', tripSchema);
