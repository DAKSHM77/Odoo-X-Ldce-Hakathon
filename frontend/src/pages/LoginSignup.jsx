import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, User, Eye, EyeOff, Compass, ArrowRight } from 'lucide-react';
import '../styles/auth.css';

export const LoginSignup = () => {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formError) setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    try {
      if (isLoginTab) {
        if (!formData.email || !formData.password) {
          setFormError('Please fill in all required fields');
          setIsSubmitting(false);
          return;
        }
        await login(formData.email, formData.password);
      } else {
        if (!formData.name || !formData.email || !formData.password) {
          setFormError('Please fill in all required fields');
          setIsSubmitting(false);
          return;
        }
        if (formData.password.length < 6) {
          setFormError('Password must be at least 6 characters long');
          setIsSubmitting(false);
          return;
        }
        await register(formData.name, formData.email, formData.password);
      }
      navigate('/dashboard');
    } catch (err) {
      setFormError(err.message || 'An error occurred during authentication');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-backdrop-gradient" />
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo-badge">
            <Compass size={28} className="auth-logo-icon" />
          </div>
          <h2>{isLoginTab ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="auth-subtitle">
            {isLoginTab
              ? 'Sign in to access your itinerary and trips'
              : 'Join Odoo Travel to plan unforgettable adventures'}
          </p>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${isLoginTab ? 'active' : ''}`}
            onClick={() => {
              setIsLoginTab(true);
              setFormError('');
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab ${!isLoginTab ? 'active' : ''}`}
            onClick={() => {
              setIsLoginTab(false);
              setFormError('');
            }}
          >
            Sign Up
          </button>
        </div>

        {formError && <div className="auth-error-banner">{formError}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLoginTab && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-icon-wrapper">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required={!isLoginTab}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-icon-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-icon-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-auth-submit"
          >
            {isSubmitting ? (
              <span className="spinner-sm">Processing...</span>
            ) : (
              <>
                {isLoginTab ? 'Sign In' : 'Create Account'}
                <ArrowRight size={18} style={{ marginLeft: '8px' }} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLoginTab ? "Don't have an account?" : 'Already have an account?'}
            <button
              type="button"
              className="auth-switch-link"
              onClick={() => {
                setIsLoginTab(!isLoginTab);
                setFormError('');
              }}
            >
              {isLoginTab ? ' Sign Up' : ' Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
