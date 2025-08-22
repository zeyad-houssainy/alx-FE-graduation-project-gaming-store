/**
 * API Configuration for GAMING STORE
 * 
 * This file contains all API-related configuration settings.
 * Modify these values to change how the app behaves.
 */

export const API_CONFIG = {
  // Set to false to avoid CORS issues (recommended for development)
  // Set to true to attempt API calls (may cause CORS errors in browser)
  USE_API: false,
  
  // RAWG API Configuration
  RAWG: {
    BASE_URL: 'https://api.rawg.io/api',
    API_KEY: 'd6c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0', // Replace with your actual API key
    TIMEOUT: 10000, // 10 seconds
  },
  
  // Local Data Configuration
  LOCAL: {
    ENABLED: true, // Always true as fallback
    GAMES_COUNT: 20, // Number of games in local data
    FEATURES: ['Search', 'Filter', 'Sort', 'Pagination'],
  },
  
  // CORS Proxy Configuration (alternative solution)
  CORS_PROXY: {
    ENABLED: false, // Not recommended for production
    URL: 'https://cors-anywhere.herokuapp.com/', // Example proxy
  }
};

// Helper function to check if API is enabled
export const isAPIEnabled = () => API_CONFIG.USE_API;

// Helper function to get API base URL
export const getAPIBaseURL = () => API_CONFIG.RAWG.BASE_URL;

// Helper function to get API key
export const getAPIKey = () => API_CONFIG.RAWG.API_KEY;

// Helper function to get timeout
export const getAPITimeout = () => API_CONFIG.RAWG.TIMEOUT;

// Export default config
export default API_CONFIG;


