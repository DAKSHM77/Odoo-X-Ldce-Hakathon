import axiosInstance from './axiosInstance';

/**
 * Send trip data to backend POST /api/trips
 * @param {Object} tripData
 * @returns {Promise<Object>} API response data containing { success: true, trip: savedTrip }
 */
export async function createTripApi(tripData) {
  const response = await axiosInstance.post('/trips', tripData);
  return response.data;
}

/**
 * Fetch all trips from backend GET /api/trips
 * @returns {Promise<Object>} API response data containing { success: true, trips: [...] }
 */
export async function fetchTripsApi() {
  const response = await axiosInstance.get('/trips');
  return response.data;
}
