import axiosInstance from './axiosInstance';

export const loginApi = async (email, password) => {
  const response = await axiosInstance.post('/auth/login', { email, password });
  return response.data;
};

// Accepts full GlobeTrotter registration payload object
export const registerApi = async (registrationData) => {
  const response = await axiosInstance.post('/auth/register', registrationData);
  return response.data;
};

export const logoutApi = async () => {
  const response = await axiosInstance.post('/auth/logout');
  return response.data;
};

export const getProfileApi = async () => {
  const response = await axiosInstance.get('/auth/me');
  return response.data;
};
