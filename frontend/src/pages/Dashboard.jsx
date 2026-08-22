import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Compass, Map, Plus, Calendar, DollarSign } from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1.5rem' }}>
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
        }}
      >
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
          Hello, {user?.name || 'Explorer'}! 👋
        </h1>
        <p style={{ color: '#94a3b8' }}>
          Welcome to your GlobeTrotter Travel Hub. Start planning your next dream itinerary.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <div style={cardStyle}>
          <Compass size={32} color="#6366f1" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Create New Trip</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem' }}>
            Build custom travel routes, set stopovers, and invite friends.
          </p>
          <Link to="/itinerary" className="btn btn-primary btn-sm" style={{ gap: '0.375rem' }}>
            <Plus size={16} /> Plan Trip
          </Link>
        </div>

        <div style={cardStyle}>
          <Map size={32} color="#ec4899" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>My Itineraries</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem' }}>
            View and edit all your saved trip itineraries and schedules.
          </p>
          <Link to="/itinerary" className="btn btn-outline btn-sm">
            Explore Itineraries
          </Link>
        </div>

        <div style={cardStyle}>
          <DollarSign size={32} color="#10b981" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Budget Calculator</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem' }}>
            Track total expenses, stay within budget, and estimate costs.
          </p>
          <Link to="/itinerary" className="btn btn-outline btn-sm">
            View Budget
          </Link>
        </div>
      </div>
    </div>
  );
};

const cardStyle = {
  background: 'rgba(30, 41, 59, 0.6)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '16px',
  padding: '1.5rem',
  transition: 'transform 0.2s',
};

export default Dashboard;
