import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Globe, LogOut, User, Menu, X, Map } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white mr-2">
            <Globe size={18} />
          </div>
          <span className="brand-text">GlobeTrotter</span>
        </Link>

        <div className="navbar-links">
          {isAuthenticated && (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/itinerary" className="nav-link">Itinerary</Link>
              <Link to="/my-trips" className="nav-link">My Trips</Link>
            </>
          )}
        </div>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-greeting">
                <User size={16} style={{ marginRight: '6px' }} />
                {user?.name || 'Explorer'}
              </span>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                <LogOut size={16} style={{ marginRight: '4px' }} />
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-primary btn-sm">
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
