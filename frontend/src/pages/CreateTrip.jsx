import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import CitySearchBar from '../components/search/CitySearchBar';
import ActivityPicker from '../components/trip/ActivityPicker';
import { useTrip } from '../hooks/useTrip';
import { createTripApi } from '../api/tripApi';
import { Calendar, Tag, Sparkles } from 'lucide-react';

export default function CreateTrip() {
  const navigate = useNavigate();
  const { createTrip } = useTrip();

  const [tripName, setTripName] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedSuggestions, setSelectedSuggestions] = useState([]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleToggleSuggestion = (suggestion) => {
    setSelectedSuggestions((prev) => {
      const exists = prev.some((item) => item.id === suggestion.id);
      if (exists) {
        return prev.filter((item) => item.id !== suggestion.id);
      } else {
        return [...prev, suggestion];
      }
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!tripName.trim()) {
      newErrors.tripName = 'Trip name is required.';
    }

    if (!selectedCity) {
      newErrors.selectedCity = 'Please select a place/destination.';
    }

    if (!startDate) {
      newErrors.startDate = 'Start date is required.';
    }

    if (!endDate) {
      newErrors.endDate = 'End date is required.';
    } else if (startDate && new Date(endDate) < new Date(startDate)) {
      newErrors.endDate = 'End date cannot be before start date.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (validateForm()) {
      setIsSubmitting(true);

      const tripData = {
        tripName: tripName.trim(),
        selectedCity: selectedCity.name,
        cityDetails: selectedCity,
        startDate,
        endDate,
        selectedSuggestions: selectedSuggestions.map((s) => ({
          id: s.id,
          title: s.title,
          category: s.category
        }))
      };

      try {
        // Attempt backend API persistence
        const response = await createTripApi(tripData);

        if (response && response.success && response.trip) {
          // Update activeTrip in context with backend-persisted object (_id replaced temp ID)
          createTrip(response.trip);
        } else {
          // Fallback to local memory state if API response shape varies
          createTrip(tripData);
        }

        navigate('/itinerary-builder');
      } catch (err) {
        console.warn('Backend API submission warning:', err?.response?.data?.message || err.message);
        // Fallback to in-memory TripContext so UI remains fully functional even if backend is offline
        createTrip(tripData);
        navigate('/itinerary-builder');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="create-trip-page">
      <Navbar />

      <main className="create-trip-container">
        <header className="page-header">
          <div className="badge-pill">
            <Sparkles size={14} /> Plan Your Journey
          </div>
          <h1 className="page-title">Plan a new trip</h1>
          <p className="page-subtitle">
            Set your trip details, pick your target destination, select dates, and choose top activities to get started.
          </p>
        </header>

        {serverError && (
          <div className="field-error" style={{ marginBottom: '16px', fontSize: '0.95rem' }}>
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="trip-form-card" noValidate>
          <div className="form-section-header">
            <h2>Trip Details</h2>
            <p className="form-section-subtitle">Enter your itinerary core information</p>
          </div>

          <div className="form-grid">
            {/* Trip Name */}
            <div className="form-group">
              <label htmlFor="tripName" className="form-label">
                Trip Name <span className="required-star">*</span>
              </label>
              <div className={`input-wrapper ${errors.tripName ? 'has-error' : ''}`}>
                <Tag className="input-icon" size={18} />
                <input
                  id="tripName"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Summer in Paris"
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              {errors.tripName && <span className="field-error">{errors.tripName}</span>}
            </div>

            {/* Select a Place (City Search Bar) */}
            <div className="form-group">
              <CitySearchBar
                selectedCity={selectedCity}
                onSelectCity={setSelectedCity}
                error={errors.selectedCity}
              />
            </div>

            {/* Start Date */}
            <div className="form-group">
              <label htmlFor="startDate" className="form-label">
                Start Date <span className="required-star">*</span>
              </label>
              <div className={`input-wrapper ${errors.startDate ? 'has-error' : ''}`}>
                <Calendar className="input-icon" size={18} />
                <input
                  id="startDate"
                  type="date"
                  className="form-input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              {errors.startDate && <span className="field-error">{errors.startDate}</span>}
            </div>

            {/* End Date */}
            <div className="form-group">
              <label htmlFor="endDate" className="form-label">
                End Date <span className="required-star">*</span>
              </label>
              <div className={`input-wrapper ${errors.endDate ? 'has-error' : ''}`}>
                <Calendar className="input-icon" size={18} />
                <input
                  id="endDate"
                  type="date"
                  className="form-input"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              {errors.endDate && <span className="field-error">{errors.endDate}</span>}
            </div>
          </div>

          {/* Suggestions Section */}
          <ActivityPicker
            selectedSuggestions={selectedSuggestions}
            onToggleSuggestion={handleToggleSuggestion}
          />

          <div className="form-actions">
            <button type="submit" className="submit-trip-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Trip...' : 'Create Trip'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
