import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { Mail, Lock, Eye, EyeOff, Globe, AlertCircle } from 'lucide-react';
import './auth.css';

/**
 * Login page — /login
 * GlobeTrotter authentication — compact centered card
 */
const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (apiError) setApiError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);
    setApiError('');
    try {
      await login(formData.email.trim(), formData.password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setApiError(err.message || 'Sign in failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="gt-auth-page">
      {/* Subtle dot-grid background */}
      <div className="gt-auth-bg" aria-hidden="true" />

      <div className="gt-auth-card gt-login-card">
        {/* Brand */}
        <div className="gt-brand">
          <div className="gt-brand-icon" aria-hidden="true">
            <Globe size={22} strokeWidth={1.5} />
          </div>
          <span className="gt-brand-name">GlobeTrotter</span>
        </div>

        {/* Circular travel visual */}
        <div className="gt-login-avatar" aria-hidden="true">
          <Globe size={36} strokeWidth={1} />
        </div>

        <div className="gt-card-heading">
          <h1 className="gt-heading">Welcome back</h1>
          <p className="gt-subheading">Sign in to continue planning your next adventure.</p>
        </div>

        {/* API error */}
        {apiError && (
          <div className="gt-api-error" role="alert">
            <AlertCircle size={16} aria-hidden="true" />
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="gt-form" noValidate>
          {/* Email */}
          <div className="gt-field">
            <label htmlFor="login-email" className="gt-label">
              Email address
            </label>
            <div className={`gt-input-wrap ${errors.email ? 'gt-input-error' : ''}`}>
              <Mail size={17} className="gt-input-icon" aria-hidden="true" />
              <input
                type="email"
                id="login-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                className="gt-input gt-input-padded"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'login-email-error' : undefined}
              />
            </div>
            {errors.email && (
              <span id="login-email-error" className="gt-field-error" role="alert">
                {errors.email}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="gt-field">
            <div className="gt-label-row">
              <label htmlFor="login-password" className="gt-label">
                Password
              </label>
              {/* Forgot password — prepared for future integration */}
              <button
                type="button"
                className="gt-forgot-link"
                onClick={() => {/* Future: navigate to /forgot-password */}}
              >
                Forgot password?
              </button>
            </div>
            <div className={`gt-input-wrap ${errors.password ? 'gt-input-error' : ''}`}>
              <Lock size={17} className="gt-input-icon" aria-hidden="true" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="login-password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
                className="gt-input gt-input-padded gt-input-padded-right"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'login-password-error' : undefined}
              />
              <button
                type="button"
                className="gt-pw-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {errors.password && (
              <span id="login-password-error" className="gt-field-error" role="alert">
                {errors.password}
              </span>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="gt-btn-primary"
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <span className="gt-spinner-text">
                <span className="gt-spinner" aria-hidden="true" />
                Signing in…
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="gt-auth-switch">
          New to GlobeTrotter?{' '}
          <Link to="/register" className="gt-auth-link">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
