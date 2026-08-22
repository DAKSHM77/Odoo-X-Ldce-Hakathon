import { Link, useLocation } from 'react-router-dom';
import { Compass, PlusCircle, Map, User, Sparkles } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Compass },
    { path: '/my-trips', label: 'My Trips', icon: Map },
    { path: '/create-trip', label: 'Create Trip', icon: PlusCircle },
  ];

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <Link to="/create-trip" className="navbar-brand">
          <div className="brand-icon-wrapper">
            <Sparkles className="brand-icon" size={22} />
          </div>
          <span className="brand-name">GlobeTrotter</span>
        </Link>

        <nav className="navbar-links" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="navbar-actions">
          <div className="user-avatar" title="User Profile">
            <User size={18} />
          </div>
        </div>
      </div>
    </header>
  );
}
