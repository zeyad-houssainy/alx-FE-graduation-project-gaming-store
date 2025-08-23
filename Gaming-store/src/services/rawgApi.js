import axios from 'axios';

/**
 * RAWG API Service
 * 
 * RAWG is a comprehensive gaming database API that provides:
 * - Game information, screenshots, and videos
 * - Platform and genre data
 * - Release dates and ratings
 * - Search and filtering capabilities
 * 
 * DOCUMENTATION: https://rawg.io/apidocs
 */

// RAWG API Configuration
const RAWG_CONFIG = {
  BASE_URL: 'https://api.rawg.io/api',
  API_KEY: 'c542e67aec3a4340908f9de9e86038af', // Free tier API key
  TIMEOUT: 15000, // 15 seconds
};

// Create axios instance for RAWG
const api = axios.create({
  baseURL: RAWG_CONFIG.BASE_URL,
  timeout: RAWG_CONFIG.TIMEOUT,
  params: {
    key: RAWG_CONFIG.API_KEY,
  },
});

// Add request/response interceptors for debugging
api.interceptors.request.use(
  (config) => {
    console.log('🚀 RAWG API Request:', {
      url: config.url,
      method: config.method,
      params: config.params,
      baseURL: config.baseURL
    });
    return config;
  },
  (error) => {
    console.error('❌ RAWG API Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('✅ RAWG API Response:', {
      status: response.status,
      dataLength: response.data ? (response.data.results ? response.data.results.length : 'Single item') : 'No data',
      url: response.config.url,
      totalCount: response.data?.count || 'N/A'
    });
    return response;
  },
  (error) => {
    console.error('❌ RAWG API Response Error:', {
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
 * Test function to verify RAWG API connectivity
 */
export const testRAWGConnectivity = async () => {
  try {
    console.log('🔌 Testing RAWG API connectivity...');
    
    // Test with a simple endpoint
    const response = await api.get('/games', {
      params: {
        page_size: 1,
        ordering: '-rating'
      }
    });
    
    if (response.status === 200 && response.data) {
      console.log('✅ RAWG API is accessible!');
      return {
        success: true,
        message: 'API is accessible',
        totalGames: response.data.count,
        sampleGame: response.data.results?.[0],
        apiKey: RAWG_CONFIG.API_KEY ? 'Valid' : 'Missing'
      };
    } else {
      throw new Error('Unexpected response format');
    }
  } catch (error) {
    console.error('❌ RAWG API connectivity test failed:', error);
    
    // Check if it's an API key issue
    if (error.response?.status === 401) {
      return {
        success: false,
        message: 'API key invalid or expired',
        error: error.message
      };
    }
    
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
 * @param {string} options.ordering - Sort option
 * @param {Array} options.platforms - Platform IDs to filter by
 * @param {Array} options.genres - Genre IDs to filter by
 * @param {string} options.dates - Date range filter
 * @param {number} options.metacritic - Minimum Metacritic score
 */
export const fetchGames = async (options = {}) => {
  try {
    console.log('🎮 Starting RAWG API call with options:', options);
    
    const {
      search = '',
      page = 1,
      pageSize = 20,
      ordering = '-rating',
      platforms = [],
      genres = [],
      dates = '',
      metacritic = null
    } = options;

    // Build query parameters
    const params = {
      page: page,
      page_size: pageSize,
      ordering: ordering,
    };
    
    if (search) params.search = search;
    if (platforms.length > 0) params.platforms = platforms.join(',');
    if (genres.length > 0) params.genres = genres.join(',');
    if (dates) params.dates = dates;
    if (metacritic !== null) params.metacritic = metacritic;

    console.log('🔍 RAWG API params:', params);
    console.log('🌐 API URL:', `${RAWG_CONFIG.BASE_URL}/games`);

    const response = await api.get('/games', { params });
    
    console.log('📊 Raw RAWG response:', response.data);
    
    if (!response.data || !response.data.results) {
      console.warn('⚠️ RAWG API returned invalid data format:', response.data);
      throw new Error('Invalid data format from RAWG API');
    }
    
    // Transform RAWG data to match our app structure
    const transformedGames = response.data.results.map(game => ({
      id: game.id,
      name: game.name,
      background_image: game.background_image || game.short_screenshots?.[0]?.image || '/assets/images/featured-game-1.jpg',
      rating: game.rating || 0,
      rating_top: game.rating_top || 5,
      metacritic: game.metacritic || null,
      playtime: game.playtime || 0,
      released: game.released,
      tba: game.tba || false,
      updated: game.updated,
      platforms: game.platforms?.map(p => p.platform.name) || [],
      genres: game.genres?.map(g => g.name) || [],
      stores: game.stores?.map(s => s.store.name) || [],
      tags: game.tags?.map(t => t.name) || [],
      esrb_rating: game.esrb_rating?.name || null,
      short_screenshots: game.short_screenshots?.map(s => s.image) || [],
      description: game.description || `Explore ${game.name} - a fantastic gaming experience.`,
      website: game.website || null,
      developers: game.developers?.map(d => d.name) || [],
      publishers: game.publishers?.map(p => p.name) || [],
      price: Math.floor(Math.random() * 60) + 20, // Mock price since RAWG doesn't provide pricing
      originalPrice: Math.floor(Math.random() * 60) + 20,
      cheapestPrice: Math.floor(Math.random() * 60) + 20,
    }));

    console.log('🔄 Transformed games:', transformedGames);

    const result = {
      games: transformedGames,
      count: response.data.count,
      next: response.data.next ? page + 1 : null,
      previous: response.data.previous ? page - 1 : null,
      totalPages: Math.ceil(response.data.count / pageSize),
    };

    console.log('🎯 Final result:', result);
    return result;
    
  } catch (error) {
    console.error('💥 RAWG API error:', error);
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
 * Fetch a specific game by ID
 * @param {string} gameId - Game ID from RAWG
 */
export const fetchGameById = async (gameId) => {
  try {
    const response = await api.get(`/games/${gameId}`);

    if (response.data) {
      const game = response.data;
      return {
        id: game.id,
        name: game.name,
        background_image: game.background_image || game.short_screenshots?.[0]?.image || '/assets/images/featured-game-1.jpg',
        rating: game.rating || 0,
        rating_top: game.rating_top || 5,
        metacritic: game.metacritic || null,
        playtime: game.playtime || 0,
        released: game.released,
        tba: game.tba || false,
        updated: game.updated,
        platforms: game.platforms?.map(p => p.platform.name) || [],
        genres: game.genres?.map(g => g.name) || [],
        stores: game.stores?.map(s => s.store.name) || [],
        tags: game.tags?.map(t => t.name) || [],
        esrb_rating: game.esrb_rating?.name || null,
        short_screenshots: game.short_screenshots?.map(s => s.image) || [],
        description: game.description || `Explore ${game.name} - a fantastic gaming experience.`,
        website: game.website || null,
        developers: game.developers?.map(d => d.name) || [],
        publishers: game.publishers?.map(p => p.name) || [],
        price: Math.floor(Math.random() * 60) + 20,
        originalPrice: Math.floor(Math.random() * 60) + 20,
        cheapestPrice: Math.floor(Math.random() * 60) + 20,
      };
    }
    
    throw new Error('Game not found');
  } catch (error) {
    console.error('RAWG API error:', error);
    throw new Error('Failed to fetch game details');
  }
};

/**
 * Fetch all available platforms
 */
export const fetchPlatforms = async () => {
  try {
    const response = await api.get('/platforms');
    return response.data.results.map(platform => ({
      id: platform.id,
      name: platform.name,
      slug: platform.slug,
      games_count: platform.games_count,
      image_background: platform.image_background,
      year_start: platform.year_start,
      year_end: platform.year_end,
    }));
  } catch (error) {
    console.error('RAWG platforms API error:', error);
    return [];
  }
};

/**
 * Fetch all available genres
 */
export const fetchGenres = async () => {
  try {
    const response = await api.get('/genres');
    return response.data.results.map(genre => ({
      id: genre.id,
      name: genre.name,
      slug: genre.slug,
      games_count: genre.games_count,
      image_background: genre.image_background,
    }));
  } catch (error) {
    console.error('RAWG genres API error:', error);
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
        search: searchTerm,
        page_size: options.pageSize || 20,
        ordering: options.ordering || '-rating',
        ...options
      }
    });

    return response.data.results.map(game => ({
      id: game.id,
      name: game.name,
      background_image: game.background_image || game.short_screenshots?.[0]?.image || '/assets/images/featured-game-1.jpg',
      rating: game.rating || 0,
      rating_top: game.rating_top || 5,
      metacritic: game.metacritic || null,
      released: game.released,
      platforms: game.platforms?.map(p => p.platform.name) || [],
      genres: game.genres?.map(g => g.name) || [],
      price: Math.floor(Math.random() * 60) + 20,
    }));
  } catch (error) {
    console.error('RAWG search API error:', error);
    return [];
  }
};

/**
 * Fallback games data when RAWG API fails
 */
const getFallbackGames = (options) => {
  const fallbackGames = [
    {
      id: 'fallback-1',
      name: 'Cyberpunk 2077',
      background_image: '/assets/images/featured-game-1.jpg',
      rating: 4.2,
      rating_top: 5,
      metacritic: 87,
      playtime: 0,
      released: '2020-12-10',
      tba: false,
      updated: '2023-12-01',
      platforms: ['PC', 'PlayStation 4', 'Xbox One'],
      genres: ['RPG', 'Action', 'Open World'],
      stores: ['Steam', 'GOG', 'Epic Games'],
      tags: ['Cyberpunk', 'Open World', 'RPG'],
      esrb_rating: 'Mature',
      short_screenshots: ['/assets/images/featured-game-1.jpg'],
      description: 'An open-world action-adventure story set in Night City.',
      website: 'https://www.cyberpunk.net',
      developers: ['CD Projekt Red'],
      publishers: ['CD Projekt'],
      price: 59.99,
      originalPrice: 59.99,
      cheapestPrice: 59.99,
    },
    {
      id: 'fallback-2',
      name: 'Elden Ring',
      background_image: '/assets/images/featured-game-2.jpg',
      rating: 4.8,
      rating_top: 5,
      metacritic: 96,
      playtime: 0,
      released: '2022-02-25',
      tba: false,
      updated: '2023-12-01',
      platforms: ['PC', 'PlayStation 4', 'PlayStation 5', 'Xbox One', 'Xbox Series X'],
      genres: ['Action RPG', 'Souls-like', 'Open World'],
      stores: ['Steam', 'PlayStation Store', 'Xbox Store'],
      tags: ['Dark Fantasy', 'Open World', 'Souls-like'],
      esrb_rating: 'Teen',
      short_screenshots: ['/assets/images/featured-game-2.jpg'],
      description: 'An action role-playing game developed by FromSoftware.',
      website: 'https://en.bandainamcoent.eu/elden-ring',
      developers: ['FromSoftware'],
      publishers: ['Bandai Namco Entertainment'],
      price: 69.99,
      originalPrice: 69.99,
      cheapestPrice: 69.99,
    },
    {
      id: 'fallback-3',
      name: 'God of War Ragnarök',
      background_image: '/assets/images/featured-game-3.jpg',
      rating: 4.7,
      rating_top: 5,
      metacritic: 94,
      playtime: 0,
      released: '2022-11-09',
      tba: false,
      updated: '2023-12-01',
      platforms: ['PlayStation 4', 'PlayStation 5'],
      genres: ['Action-Adventure', 'Hack and Slash'],
      stores: ['PlayStation Store'],
      tags: ['Norse Mythology', 'Action', 'Adventure'],
      esrb_rating: 'Mature',
      short_screenshots: ['/assets/images/featured-game-3.jpg'],
      description: 'An action-adventure game developed by Santa Monica Studio.',
      website: 'https://godofwar.playstation.com',
      developers: ['Santa Monica Studio'],
      publishers: ['Sony Interactive Entertainment'],
      price: 69.99,
      originalPrice: 69.99,
      cheapestPrice: 69.99,
    }
  ];

  // Filter by search term if provided
  let filteredGames = fallbackGames;
  if (options.search) {
    const searchLower = options.search.toLowerCase();
    filteredGames = fallbackGames.filter(game => 
      game.name.toLowerCase().includes(searchLower) ||
      game.description.toLowerCase().includes(searchLower) ||
      game.genres.some(g => g.toLowerCase().includes(searchLower))
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

// Export default for convenience
export default {
  testRAWGConnectivity,
  fetchGames,
  fetchGameById,
  fetchPlatforms,
  fetchGenres,
  searchGames,
};
