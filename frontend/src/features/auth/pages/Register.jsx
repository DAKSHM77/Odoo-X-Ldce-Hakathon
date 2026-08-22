import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { Eye, EyeOff, Globe, Camera, AlertCircle, User } from 'lucide-react';
import './auth.css';

/**
 * Register page — /register
 * GlobeTrotter new account creation — wider card, two-column desktop layout
 */
const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    city: '',
    country: '',
    additionalInformation: '',
    password: '',
    confirmPassword: '',
  });
  const [profilePhoto, setProfilePhoto] = useState(null);       // base64 data URI
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(''); // object URL for display
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const photoInputRef = useRef(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview via object URL
    setProfilePhotoPreview(URL.createObjectURL(file));

    // Convert to base64 for sending to API (no external storage needed now)
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const e = {};

    if (!formData.firstName.trim()) e.firstName = 'First name is required';
    if (!formData.lastName.trim()) e.lastName = 'Last name is required';

    if (!formData.email.trim()) {
      e.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      e.email = 'Please enter a valid email address';
    }

    if (formData.phoneNumber.trim() && !/^\+?[\d\s\-().]{7,15}$/.test(formData.phoneNumber.trim())) {
      e.phoneNumber = 'Please enter a valid phone number';
    }

    if (!formData.city.trim()) e.city = 'City is required';
    if (!formData.country.trim()) e.country = 'Country is required';

    if (!formData.password) {
      e.password = 'Password is required';
    } else if (formData.password.length < 6) {
      e.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      e.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      e.confirmPassword = 'Passwords do not match';
    }

    return e;
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
      const { confirmPassword, ...rest } = formData;
      await register({
        ...rest,
        profilePhoto: profilePhoto || '',
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setApiError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="gt-auth-page gt-register-page">
      <div className="gt-auth-bg" aria-hidden="true" />

      <div className="gt-auth-card gt-register-card">
        {/* Brand */}
        <div className="gt-brand">
          <div className="gt-brand-icon" aria-hidden="true">
            <Globe size={22} strokeWidth={1.5} />
          </div>
          <span className="gt-brand-name">GlobeTrotter</span>
        </div>

        <div className="gt-card-heading">
          <h1 className="gt-heading">Create your account</h1>
          <p className="gt-subheading">Start building unforgettable journeys with GlobeTrotter.</p>
        </div>

        {/* Profile photo upload */}
        <div className="gt-photo-section">
          <button
            type="button"
            className="gt-photo-btn"
            onClick={() => photoInputRef.current?.click()}
            aria-label="Upload profile photo (optional)"
          >
            {profilePhotoPreview ? (
              <img
                src={profilePhotoPreview}
                alt="Profile preview"
                className="gt-photo-preview"
              />
            ) : (
              <div className="gt-photo-placeholder">
                <User size={30} strokeWidth={1.5} />
              </div>
            )}
            <div className="gt-photo-overlay" aria-hidden="true">
              <Camera size={16} />
            </div>
          </button>
          <span className="gt-photo-label">Photo (optional)</span>
          <input
            ref={photoInputRef}
            type="file"
            id="register-photo"
            name="profilePhoto"
            accept="image/png, image/jpeg, image/webp"
            onChange={handlePhotoChange}
            className="gt-visually-hidden"
            aria-label="Choose profile photo"
          />
        </div>

        {/* API error */}
        {apiError && (
          <div className="gt-api-error" role="alert">
            <AlertCircle size={16} aria-hidden="true" />
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="gt-form" noValidate>
          {/* Row 1: First Name | Last Name */}
          <div className="gt-form-row">
            <div className="gt-field">
              <label htmlFor="reg-firstName" className="gt-label">First Name <span className="gt-required" aria-hidden="true">*</span></label>
              <input
                type="text"
                id="reg-firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Jane"
                autoComplete="given-name"
                className={`gt-input ${errors.firstName ? 'gt-input-error-border' : ''}`}
                aria-invalid={!!errors.firstName}
                aria-describedby={errors.firstName ? 'err-firstName' : undefined}
              />
              {errors.firstName && <span id="err-firstName" className="gt-field-error" role="alert">{errors.firstName}</span>}
            </div>
            <div className="gt-field">
              <label htmlFor="reg-lastName" className="gt-label">Last Name <span className="gt-required" aria-hidden="true">*</span></label>
              <input
                type="text"
                id="reg-lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Smith"
                autoComplete="family-name"
                className={`gt-input ${errors.lastName ? 'gt-input-error-border' : ''}`}
                aria-invalid={!!errors.lastName}
                aria-describedby={errors.lastName ? 'err-lastName' : undefined}
              />
              {errors.lastName && <span id="err-lastName" className="gt-field-error" role="alert">{errors.lastName}</span>}
            </div>
          </div>

          {/* Row 2: Email | Phone */}
          <div className="gt-form-row">
            <div className="gt-field">
              <label htmlFor="reg-email" className="gt-label">Email Address <span className="gt-required" aria-hidden="true">*</span></label>
              <input
                type="email"
                id="reg-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                autoComplete="email"
                className={`gt-input ${errors.email ? 'gt-input-error-border' : ''}`}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'err-email' : undefined}
              />
              {errors.email && <span id="err-email" className="gt-field-error" role="alert">{errors.email}</span>}
            </div>
            <div className="gt-field">
              <label htmlFor="reg-phone" className="gt-label">Phone Number</label>
              <input
                type="tel"
                id="reg-phone"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                autoComplete="tel"
                className={`gt-input ${errors.phoneNumber ? 'gt-input-error-border' : ''}`}
                aria-invalid={!!errors.phoneNumber}
                aria-describedby={errors.phoneNumber ? 'err-phone' : undefined}
              />
              {errors.phoneNumber && <span id="err-phone" className="gt-field-error" role="alert">{errors.phoneNumber}</span>}
            </div>
          </div>

          {/* Row 3: City | Country */}
          <div className="gt-form-row">
            <div className="gt-field">
              <label htmlFor="reg-city" className="gt-label">City <span className="gt-required" aria-hidden="true">*</span></label>
              <input
                type="text"
                id="reg-city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Mumbai"
                autoComplete="address-level2"
                className={`gt-input ${errors.city ? 'gt-input-error-border' : ''}`}
                aria-invalid={!!errors.city}
                aria-describedby={errors.city ? 'err-city' : undefined}
              />
              {errors.city && <span id="err-city" className="gt-field-error" role="alert">{errors.city}</span>}
            </div>
            <div className="gt-field">
              <label htmlFor="reg-country" className="gt-label">Country <span className="gt-required" aria-hidden="true">*</span></label>
              <input
                type="text"
                id="reg-country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="India"
                autoComplete="country-name"
                className={`gt-input ${errors.country ? 'gt-input-error-border' : ''}`}
                aria-invalid={!!errors.country}
                aria-describedby={errors.country ? 'err-country' : undefined}
              />
              {errors.country && <span id="err-country" className="gt-field-error" role="alert">{errors.country}</span>}
            </div>
          </div>

          {/* Additional Information — full width */}
          <div className="gt-field">
            <label htmlFor="reg-additional" className="gt-label">Additional Information</label>
            <textarea
              id="reg-additional"
              name="additionalInformation"
              value={formData.additionalInformation}
              onChange={handleChange}
              placeholder="Tell us about your travel interests, preferred destinations, or anything else…"
              rows={4}
              className="gt-textarea"
            />
          </div>

          {/* Row 4: Password | Confirm Password */}
          <div className="gt-form-row">
            <div className="gt-field">
              <label htmlFor="reg-password" className="gt-label">Password <span className="gt-required" aria-hidden="true">*</span></label>
              <div className={`gt-input-wrap ${errors.password ? 'gt-input-error' : ''}`}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="reg-password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                  className="gt-input gt-input-padded-right"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'err-password' : undefined}
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
              {errors.password && <span id="err-password" className="gt-field-error" role="alert">{errors.password}</span>}
            </div>
            <div className="gt-field">
              <label htmlFor="reg-confirm-password" className="gt-label">Confirm Password <span className="gt-required" aria-hidden="true">*</span></label>
              <div className={`gt-input-wrap ${errors.confirmPassword ? 'gt-input-error' : ''}`}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="reg-confirm-password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  autoComplete="new-password"
                  className="gt-input gt-input-padded-right"
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={errors.confirmPassword ? 'err-confirmPassword' : undefined}
                />
                <button
                  type="button"
                  className="gt-pw-toggle"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.confirmPassword && <span id="err-confirmPassword" className="gt-field-error" role="alert">{errors.confirmPassword}</span>}
            </div>
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
                Creating account…
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p className="gt-auth-switch">
          Already have an account?{' '}
          <Link to="/login" className="gt-auth-link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
