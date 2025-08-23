import axios from 'axios';
import { getAPIBaseURL, getAPITimeout } from '../config/api';

/**
 * CHEAPSHARK API Service
 * 
 * CheapShark is a free API that provides real-time game prices and deals
 * from multiple online stores. No API key required!
 * 
 * FEATURES:
 * - Real-time game prices from multiple stores
 * - Price comparison across different retailers
 * - Deal tracking and notifications
 * - Store information and ratings
 * - No CORS issues (works directly in browser)
 * - No rate limits or API keys required
 * 
 * DOCUMENTATION: https://apidocs.cheapshark.com/
 */

// Create axios instance for CheapShark
const api = axios.create({
  baseURL: getAPIBaseURL(),
  timeout: getAPITimeout(),
});

// Add request/response interceptors for debugging
api.interceptors.request.use(
  (config) => {
    console.log('🚀 CheapShark API Request:', {
      url: config.url,
      method: config.method,
      params: config.params,
      baseURL: config.baseURL
    });
    return config;
  },
  (error) => {
    console.error('❌ CheapShark API Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('✅ CheapShark API Response:', {
      status: response.status,
      dataLength: response.data ? response.data.length : 'No data',
      url: response.config.url
    });
    return response;
  },
  (error) => {
    console.error('❌ CheapShark API Response Error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

/**
 * Test function to verify API connectivity
 */
export const testAPIConnectivity = async () => {
  try {
    console.log('🔌 Testing CheapShark API connectivity...');
    
    // Test with a simple endpoint
    const response = await api.get('/stores');
    
    if (response.status === 200 && response.data) {
      console.log('✅ CheapShark API is accessible!');
      return {
        success: true,
        message: 'API is accessible',
        storesCount: response.data.length,
        sampleStore: response.data[0]
      };
    } else {
      throw new Error('Unexpected response format');
    }
  } catch (error) {
    console.error('❌ CheapShark API connectivity test failed:', error);
    
    // Check if it's a network/CORS issue
    if (error.message.includes('Network Error') || error.message.includes('CORS')) {
      return {
        success: false,
        message: 'Network/CORS error - API may be blocked by browser',
        error: error.message
      };
    }
    
    // Check if it's a timeout
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return {
        success: false,
        message: 'Request timeout - API may be slow or unreachable',
        error: error.message
      };
    }
    
    return {
      success: false,
      message: 'API test failed',
      error: error.message
    };
  }
};

/**
 * Fetch games with search, filtering, and pagination
 * @param {Object} options - Search options
 * @param {string} options.search - Search term
 * @param {number} options.page - Page number
 * @param {number} options.pageSize - Items per page
 * @param {string} options.sortBy - Sort option
 * @param {Array} options.stores - Store IDs to filter by
 * @param {number} options.maxPrice - Maximum price filter
 * @param {number} options.minPrice - Minimum price filter
 * @param {number} options.steamRating - Minimum Steam rating
 * @param {number} options.metacritic - Minimum Metacritic score
 * @param {boolean} options.steamAppID - Filter by Steam App ID
 * @param {boolean} options.title - Exact title match
 * @param {boolean} options.limit - Limit results
 * @param {boolean} options.exact - Exact match
 */
export const fetchGames = async (options = {}) => {
  try {
    console.log('🎮 Starting CheapShark API call with options:', options);
    
    const {
      search = '',
      page = 1,
      pageSize = 20,
      sortBy = 'relevance',
      stores = [],
      maxPrice = null,
      minPrice = null,
      steamRating = null,
      metacritic = null,
      steamAppID = null,
      title = null,
      limit = null,
      exact = false
    } = options;

    // Build query parameters
    const params = {};
    
    if (search) params.title = search;
    if (stores.length > 0) params.stores = stores.join(',');
    if (maxPrice !== null) params.upperPrice = maxPrice;
    if (minPrice !== null) params.lowerPrice = minPrice;
    if (steamRating !== null) params.steamRating = steamRating;
    if (metacritic !== null) params.metacritic = metacritic;
    if (steamAppID !== null) params.steamAppID = steamAppID;
    if (title !== null) params.title = title;
    if (limit !== null) params.limit = limit;
    if (exact) params.exact = 1;

    console.log('🔍 CheapShark API params:', params);
    console.log('🌐 API URL:', `${getAPIBaseURL()}/games`);

    // CheapShark doesn't support pagination directly, so we'll handle it manually
    const response = await api.get('/games', { params });
    
    console.log('📊 Raw CheapShark response:', response.data);
    
    if (!response.data || !Array.isArray(response.data)) {
      console.warn('⚠️ CheapShark API returned invalid data format:', response.data);
      throw new Error('Invalid data format from CheapShark API');
    }
    
    // Transform CheapShark data to match our app structure
    const transformedGames = response.data.map(game => ({
      id: game.gameID,
      name: game.external,
      background_image: game.thumb || '/assets/images/featured-game-1.jpg',
      rating: game.steamRatingPercent ? game.steamRatingPercent / 20 : 4.0, // Convert to 5-star scale
      price: game.cheapest ? parseFloat(game.cheapest) : 0,
      originalPrice: game.cheapest ? parseFloat(game.cheapest) : 0,
      cheapestPrice: game.cheapest ? parseFloat(game.cheapest) : 0,
      cheapestStore: game.cheapestDealID,
      platforms: ['PC'], // CheapShark primarily focuses on PC games
      genre: 'Action', // Default genre
      released: null, // CheapShark doesn't provide release dates
      description: `Best price: $${game.cheapest || 'N/A'} on Steam`,
      steamAppID: game.steamAppID,
      metacritic: game.metacriticScore,
      steamRating: game.steamRatingPercent,
      dealCount: game.dealCount || 0,
      cheapestDealID: game.cheapestDealID,
    }));

    console.log('🔄 Transformed games:', transformedGames);

    // Apply sorting
    let sortedGames = [...transformedGames];
    switch (sortBy) {
      case 'name-asc':
        sortedGames.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sortedGames.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-low':
        sortedGames.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        sortedGames.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'rating':
        sortedGames.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'relevance':
      default:
        // Keep original order (CheapShark relevance)
        break;
    }

    // Apply pagination manually
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedGames = sortedGames.slice(startIndex, endIndex);

    const result = {
      games: paginatedGames,
      count: transformedGames.length,
      next: endIndex < transformedGames.length ? page + 1 : null,
      previous: page > 1 ? page - 1 : null,
      totalPages: Math.ceil(transformedGames.length / pageSize),
    };

    console.log('🎯 Final result:', result);
    return result;
    
  } catch (error) {
    console.error('💥 CheapShark API error:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    
    // Return fallback data if API fails
    console.log('🔄 Using fallback data due to API failure');
    return getFallbackGames(options);
  }
};

/**
 * Fallback games data when CheapShark API fails
 */
const getFallbackGames = (options) => {
  const fallbackGames = [
    {
      id: 'fallback-1',
      name: 'Cyberpunk 2077',
      background_image: '/assets/images/featured-game-1.jpg',
      rating: 4.2,
      price: 59.99,
      originalPrice: 59.99,
      cheapestPrice: 59.99,
      cheapestStore: 'steam',
      platforms: ['PC'],
      genre: 'RPG',
      released: '2020-12-10',
      description: 'An open-world action-adventure story set in Night City.',
      steamAppID: '1091500',
      metacritic: 87,
      steamRating: 84,
      dealCount: 1,
      cheapestDealID: 'fallback-deal-1',
    },
    {
      id: 'fallback-2',
      name: 'Elden Ring',
      background_image: '/assets/images/featured-game-2.jpg',
      rating: 4.8,
      price: 69.99,
      originalPrice: 69.99,
      cheapestPrice: 69.99,
      cheapestStore: 'steam',
      platforms: ['PC'],
      genre: 'Action RPG',
      released: '2022-02-25',
      description: 'An action role-playing game developed by FromSoftware.',
      steamAppID: '1245620',
      metacritic: 96,
      steamRating: 96,
      dealCount: 1,
      cheapestDealID: 'fallback-deal-2',
    },
    {
      id: 'fallback-3',
      name: 'God of War Ragnarök',
      background_image: '/assets/images/featured-game-3.jpg',
      rating: 4.7,
      price: 69.99,
      originalPrice: 69.99,
      cheapestPrice: 69.99,
      cheapestStore: 'steam',
      platforms: ['PC'],
      genre: 'Action-Adventure',
      released: '2022-11-09',
      description: 'An action-adventure game developed by Santa Monica Studio.',
      steamAppID: '1593500',
      metacritic: 94,
      steamRating: 94,
      dealCount: 1,
      cheapestDealID: 'fallback-deal-3',
    },
    {
      id: 'fallback-4',
      name: 'Red Dead Redemption 2',
      background_image: '/assets/images/featured-game-4.jpg',
      rating: 4.6,
      price: 49.99,
      originalPrice: 49.99,
      cheapestPrice: 49.99,
      cheapestStore: 'steam',
      platforms: ['PC'],
      genre: 'Action-Adventure',
      released: '2018-10-26',
      description: 'An action-adventure game developed and published by Rockstar Games.',
      steamAppID: '1174180',
      metacritic: 93,
      steamRating: 93,
      dealCount: 1,
      cheapestDealID: 'fallback-deal-4',
    },
    {
      id: 'fallback-5',
      name: 'The Witcher 3: Wild Hunt',
      background_image: '/assets/images/latest-game-1.jpg',
      rating: 4.9,
      price: 39.99,
      originalPrice: 39.99,
      cheapestPrice: 39.99,
      cheapestStore: 'steam',
      platforms: ['PC'],
      genre: 'RPG',
      released: '2015-05-19',
      description: 'An action role-playing game with a third-person perspective.',
      steamAppID: '292030',
      metacritic: 93,
      steamRating: 93,
      dealCount: 1,
      cheapestDealID: 'fallback-deal-5',
    },
    {
      id: 'fallback-6',
      name: 'Grand Theft Auto V',
      background_image: '/assets/images/latest-game-2.jpg',
      rating: 4.5,
      price: 29.99,
      originalPrice: 29.99,
      cheapestPrice: 29.99,
      cheapestStore: 'steam',
      platforms: ['PC'],
      genre: 'Action-Adventure',
      released: '2013-09-17',
      description: 'An action-adventure game developed by Rockstar North.',
      steamAppID: '271590',
      metacritic: 96,
      steamRating: 96,
      dealCount: 1,
      cheapestDealID: 'fallback-deal-6',
    }
  ];

  // Filter by search term if provided
  let filteredGames = fallbackGames;
  if (options.search) {
    const searchLower = options.search.toLowerCase();
    filteredGames = fallbackGames.filter(game => 
      game.name.toLowerCase().includes(searchLower) ||
      game.description.toLowerCase().includes(searchLower) ||
      game.genre.toLowerCase().includes(searchLower)
    );
  }

  // Apply pagination
  const startIndex = (options.page - 1) * options.pageSize;
  const endIndex = startIndex + options.pageSize;
  const paginatedGames = filteredGames.slice(startIndex, endIndex);

  return {
    games: paginatedGames,
    count: filteredGames.length,
    next: endIndex < filteredGames.length ? options.page + 1 : null,
    previous: options.page > 1 ? options.page - 1 : null,
    totalPages: Math.ceil(filteredGames.length / options.pageSize),
  };
};

/**
 * Fetch a specific game by ID
 * @param {string} gameId - Game ID from CheapShark
 */
export const fetchGameById = async (gameId) => {
  try {
    const response = await api.get(`/games`, {
      params: { id: gameId }
    });

    if (response.data && response.data.length > 0) {
      const game = response.data[0];
      return {
        id: game.gameID,
        name: game.external,
        background_image: game.thumb || '/assets/images/featured-game-1.jpg',
        rating: game.steamRatingPercent ? game.steamRatingPercent / 20 : 4.0,
        price: game.cheapest ? parseFloat(game.cheapest) : 0,
        originalPrice: game.cheapest ? parseFloat(game.cheapest) : 0,
        cheapestPrice: game.cheapest ? parseFloat(game.cheapest) : 0,
        cheapestStore: game.cheapestDealID,
        platforms: ['PC'],
        genre: 'Action',
        released: null,
        description: `Best price: $${game.cheapest || 'N/A'} on Steam`,
        steamAppID: game.steamAppID,
        metacritic: game.metacriticScore,
        steamRating: game.steamRatingPercent,
        dealCount: game.dealCount || 0,
        cheapestDealID: game.cheapestDealID,
        website: null,
        screenshots: [game.thumb || '/assets/images/featured-game-1.jpg'],
      };
    }
    
    throw new Error('Game not found');
  } catch (error) {
    console.error('CheapShark API error:', error);
    throw new Error('Failed to fetch game details');
  }
};

/**
 * Fetch all available stores
 */
export const fetchStores = async () => {
  try {
    const response = await api.get('/stores');
    return response.data.map(store => ({
      id: store.storeID,
      name: store.storeName,
      icon: `https://www.cheapshark.com${store.images.icon}`,
      banner: `https://www.cheapshark.com${store.images.banner}`,
      isActive: store.isActive === 1,
    }));
  } catch (error) {
    console.error('CheapShark stores API error:', error);
    return [];
  }
};

/**
 * Fetch deals for a specific game
 * @param {string} gameId - Game ID
 */
export const fetchGameDeals = async (gameId) => {
  try {
    const response = await api.get(`/games`, {
      params: { id: gameId }
    });

    if (response.data && response.data.length > 0) {
      const game = response.data[0];
      return {
        gameId: game.gameID,
        deals: game.deals || [],
        cheapestPrice: game.cheapest ? parseFloat(game.cheapest) : 0,
        cheapestStore: game.cheapestDealID,
        dealCount: game.dealCount || 0,
      };
    }
    
    return { deals: [], cheapestPrice: 0, cheapestStore: null, dealCount: 0 };
  } catch (error) {
    console.error('CheapShark deals API error:', error);
    return { deals: [], cheapestPrice: 0, cheapestStore: null, dealCount: 0 };
  }
};

/**
 * Fetch multiple deals with filtering
 * @param {Object} options - Filter options
 */
export const fetchDeals = async (options = {}) => {
  try {
    const {
      storeID = null,
      pageNumber = 0,
      pageSize = 20,
      sortBy = 'Deal Rating',
      lowerPrice = null,
      upperPrice = null,
      metacritic = null,
      steamRating = null,
      steamAppID = null,
      title = null,
      exact = false,
      AAA = null,
      onSale = null,
    } = options;

    const params = {};
    
    if (storeID !== null) params.storeID = storeID;
    if (pageNumber !== null) params.pageNumber = pageNumber;
    if (pageSize !== null) params.pageSize = pageSize;
    if (sortBy !== null) params.sortBy = sortBy;
    if (lowerPrice !== null) params.lowerPrice = lowerPrice;
    if (upperPrice !== null) params.upperPrice = upperPrice;
    if (metacritic !== null) params.metacritic = metacritic;
    if (steamRating !== null) params.steamRating = steamRating;
    if (steamAppID !== null) params.steamAppID = steamAppID;
    if (title !== null) params.title = title;
    if (exact !== null) params.exact = exact;
    if (AAA !== null) params.AAA = AAA;
    if (onSale !== null) params.onSale = onSale;

    const response = await api.get('/deals', { params });
    
    return response.data.map(deal => ({
      id: deal.dealID,
      gameId: deal.gameID,
      title: deal.title,
      salePrice: parseFloat(deal.salePrice),
      normalPrice: parseFloat(deal.normalPrice),
      savings: parseFloat(deal.savings),
      thumb: deal.thumb,
      storeID: deal.storeID,
      steamAppID: deal.steamAppID,
      releaseDate: deal.releaseDate,
      lastChange: deal.lastChange,
      dealRating: deal.dealRating,
      isOnSale: deal.isOnSale === '1',
    }));
  } catch (error) {
    console.error('CheapShark deals API error:', error);
    return [];
  }
};

/**
 * Search for games with advanced filtering
 * @param {string} searchTerm - Search query
 * @param {Object} options - Additional search options
 */
export const searchGames = async (searchTerm, options = {}) => {
  try {
    const response = await api.get('/games', {
      params: {
        title: searchTerm,
        limit: options.limit || 20,
        exact: options.exact || false,
        ...options
      }
    });

    return response.data.map(game => ({
      id: game.gameID,
      name: game.external,
      background_image: game.thumb || '/assets/images/featured-game-1.jpg',
      rating: game.steamRatingPercent ? game.steamRatingPercent / 20 : 4.0,
      price: game.cheapest ? parseFloat(game.cheapest) : 0,
      cheapestPrice: game.cheapest ? parseFloat(game.cheapest) : 0,
      cheapestStore: game.cheapestDealID,
      platforms: ['PC'],
      genre: 'Action',
      released: null,
      description: `Best price: $${game.cheapest || 'N/A'}`,
      steamAppID: game.steamAppID,
      metacritic: game.metacriticScore,
      steamRating: game.steamRatingPercent,
      dealCount: game.dealCount || 0,
    }));
  } catch (error) {
    console.error('CheapShark search API error:', error);
    return [];
  }
};

/**
 * Get price alerts for a game
 * @param {string} gameId - Game ID
 * @param {string} email - Email for price alerts
 */
export const setPriceAlert = async (gameId, email) => {
  try {
    const response = await api.post('/alerts', {
      action: 'set',
      email: email,
      gameID: gameId,
    });
    return response.data;
  } catch (error) {
    console.error('CheapShark price alert API error:', error);
    throw new Error('Failed to set price alert');
  }
};

/**
 * Get historical price data for a game
 * @param {string} gameId - Game ID
 * @param {string} storeId - Store ID
 */
export const getPriceHistory = async (gameId, storeId) => {
  try {
    const response = await api.get(`/games`, {
      params: { 
        id: gameId,
        storeID: storeId
      }
    });
    
    if (response.data && response.data.length > 0) {
      const game = response.data[0];
      return {
        gameId: game.gameID,
        storeId: storeId,
        currentPrice: game.cheapest ? parseFloat(game.cheapest) : 0,
        historicalPrices: game.deals || [],
      };
    }
    
    return { currentPrice: 0, historicalPrices: [] };
  } catch (error) {
    console.error('CheapShark price history API error:', error);
    return { currentPrice: 0, historicalPrices: [] };
  }
};

// Export default for convenience
export default {
  fetchGames,
  fetchGameById,
  fetchStores,
  fetchGameDeals,
  fetchDeals,
  searchGames,
  setPriceAlert,
  getPriceHistory,
};
