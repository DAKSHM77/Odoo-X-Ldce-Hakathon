import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { useTrip } from '../hooks/useTrip';
import { MapPin, Calendar, PlusCircle, AlertCircle, Sparkles, CheckCircle } from 'lucide-react';

export default function ItineraryBuilder() {
  const { activeTrip } = useTrip();

  const formatDate = (dateVal) => {
    if (!dateVal) return '';
    if (typeof dateVal === 'string') {
      return dateVal.split('T')[0];
    }
    if (dateVal instanceof Date) {
      return dateVal.toISOString().split('T')[0];
    }
    return String(dateVal);
  };

  return (
    <div className="itinerary-builder-page">
      <Navbar />

      <main className="itinerary-container">
        {!activeTrip ? (
          <div className="no-trip-card">
            <div className="no-trip-icon">
              <AlertCircle size={48} />
            </div>
            <h2>No trip created yet</h2>
            <p>Please fill out the Create Trip form to start building your itinerary.</p>
            <Link to="/create-trip" className="create-trip-link-btn">
              <PlusCircle size={18} />
              <span>Go to Create Trip</span>
            </Link>
          </div>
        ) : (
          <div className="itinerary-content">
            {/* Trip Summary Section */}
            <section className="trip-summary-card">
              <div className="summary-header">
                <div>
                  <div className="badge-pill">
                    <Sparkles size={14} /> Active Trip Overview
                  </div>
                  <h1 className="trip-title">{activeTrip.tripName}</h1>
                  {(activeTrip._id || activeTrip.id) && (
                    <span className="temp-id-tag">ID: {activeTrip._id || activeTrip.id}</span>
                  )}
                </div>
                <Link to="/create-trip" className="edit-trip-link">
                  Edit Details
                </Link>
              </div>

              <div className="summary-grid">
                <div className="summary-item">
                  <MapPin className="summary-icon" size={20} />
                  <div>
                    <span className="summary-label">Selected City</span>
                    <span className="summary-value">{activeTrip.selectedCity}</span>
                  </div>
                </div>

                <div className="summary-item">
                  <Calendar className="summary-icon" size={20} />
                  <div>
                    <span className="summary-label">Start Date</span>
                    <span className="summary-value">{formatDate(activeTrip.startDate)}</span>
                  </div>
                </div>

                <div className="summary-item">
                  <Calendar className="summary-icon" size={20} />
                  <div>
                    <span className="summary-label">End Date</span>
                    <span className="summary-value">{formatDate(activeTrip.endDate)}</span>
                  </div>
                </div>
              </div>

              {/* Selected Suggestions */}
              {activeTrip.selectedSuggestions && activeTrip.selectedSuggestions.length > 0 && (
                <div className="selected-activities-section">
                  <h3>Selected Places / Activities ({activeTrip.selectedSuggestions.length})</h3>
                  <div className="activity-tags-list">
                    {activeTrip.selectedSuggestions.map((item) => (
                      <div key={item.id || item.title} className="activity-tag">
                        <CheckCircle size={14} className="check-icon" />
                        <span>{item.title}</span>
                        {item.category && <span className="category-subtag">{item.category}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Itinerary Builder Placeholder Workspace */}
            <section className="itinerary-placeholder-card">
              <h2>Itinerary Builder Workspace</h2>
              <p>Trip data has been successfully saved to MongoDB and loaded into Itinerary Builder.</p>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
