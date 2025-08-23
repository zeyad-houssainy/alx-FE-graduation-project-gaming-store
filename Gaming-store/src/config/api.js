/**
 * API Configuration for GAMING STORE
 * 
 * This file contains all API-related configuration settings.
 * Modify these values to change how the app behaves.
 */

export const API_CONFIG = {
  // Set to false to avoid CORS issues (recommended for development)
  // Set to true to attempt API calls (may cause CORS errors in browser)
  USE_API: true, // Changed to true to enable CheapShark API
  
  // CheapShark API Configuration (Primary - No CORS issues!)
  CHEAPSHARK: {
    BASE_URL: 'https://www.cheapshark.com/api/1.0',
    TIMEOUT: 10000, // 10 seconds
    FEATURES: ['Real-time prices', 'Store comparisons', 'Price history', 'Deals tracking'],
  },
  
  // RAWG API Configuration (Fallback)
  RAWG: {
    BASE_URL: 'https://api.rawg.io/api',
    API_KEY: '28849ae8cd824c84ae3af5da501b0d67', // User provided API key
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

// Helper function to get CheapShark API base URL (Primary)
export const getAPIBaseURL = () => API_CONFIG.CHEAPSHARK.BASE_URL;

// Helper function to get CheapShark API key (not needed for CheapShark)
export const getAPIKey = () => null; // CheapShark doesn't require API key

// Helper function to get timeout
export const getAPITimeout = () => API_CONFIG.CHEAPSHARK.TIMEOUT;

// Export default config
export default API_CONFIG;


