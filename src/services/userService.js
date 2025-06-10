import trae from 'trae';

const API_BASE = process.env.REACT_APP_API_URL || '/api';

// Create a new instance of trae with base configuration
const api = trae.create({
  baseUrl: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.after((response) => {
  if (!response || !response.data) {
    throw new Error('Invalid response format');
  }
  return response.data;
}, (error) => {
  console.error('API Error:', error);
  const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
  throw new Error(errorMessage);
});

/**
 * Fetch user details by ID
 * @param {string} userId - The ID of the user to fetch
 * @returns {Promise<Object>} The user details
 */
export const getUserDetails = (userId) => {
  return api.get(`/user/${userId}`)
    .catch(err => {
      console.error('Error fetching user details:', err);
      throw err;
    });
};

// For backward compatibility
export const getUserById = getUserDetails;

// Export other user-related API calls here
export default {
  getUserDetails,
  getUserById, // Keep for backward compatibility
};