import { createContext, useState, useEffect } from 'react';
import { loginApi, registerApi, logoutApi, getProfileApi } from '../api/authApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const userData = await getProfileApi();
          setUser(userData);
        } catch (err) {
          console.error('Failed to restore user session:', err);
          _clearAuth();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [token]);

  const _clearAuth = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const data = await loginApi(email, password);
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser({
        _id: data._id,
        firstName: data.firstName,
        lastName: data.lastName,
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        city: data.city,
        country: data.country,
        additionalInformation: data.additionalInformation,
        profilePhoto: data.profilePhoto,
        role: data.role,
      });
      setLoading(false);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  // register accepts the full GlobeTrotter registration payload
  const register = async (registrationData) => {
    setError(null);
    setLoading(true);
    try {
      const data = await registerApi(registrationData);
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser({
        _id: data._id,
        firstName: data.firstName,
        lastName: data.lastName,
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        city: data.city,
        country: data.country,
        additionalInformation: data.additionalInformation,
        profilePhoto: data.profilePhoto,
        role: data.role,
      });
      setLoading(false);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      if (token) await logoutApi();
    } catch (_) {
      // Silently ignore logout API errors — always clear local state
    }
    _clearAuth();
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
