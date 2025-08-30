import axios from 'axios';

/**
 * RAWG API Service - Complete Implementation
 * 
 * RAWG is a comprehensive gaming database API that provides:
 * - Game information, screenshots, and videos
 * - Platform and genre data
 * - Release dates and ratings
 * - Search and filtering capabilities
 * - Advanced sorting and pagination
 * 
 * OFFICIAL DOCUMENTATION: https://rawg.io/apidocs
 * API BASE URL: https://api.rawg.io/api
 * 
 * ⚠️  IMPORTANT: The accessToken variable contains the RAWG API key.
 *     DO NOT change or remove this token as it's required for API functionality.
 */

// RAWG API Access Token - DO NOT CHANGE OR REMOVE
const accessToken = '8e59bea6409848d5992b40629a0399fc';

// Log the access token for verification (remove in production if needed)
console.log('🔑 RAWG API Access Token loaded:', accessToken ? '✅ Valid' : '❌ Missing');

// RAWG API Configuration
const RAWG_CONFIG = {
  BASE_URL: 'https://api.rawg.io/api',
  API_KEY: accessToken,
  TIMEOUT: 30000, // 30 seconds for better reliability
  MAX_PAGE_SIZE: 100, // Increased to 100 items per page
};

// Create axios instance for RAWG with proper configuration
const api = axios.create({
  baseURL: RAWG_CONFIG.BASE_URL,
  timeout: RAWG_CONFIG.TIMEOUT,
  params: {
    key: RAWG_CONFIG.API_KEY,
  },
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Enhanced request/response interceptors for debugging and error handling
api.interceptors.request.use(
  (config) => {
    console.log('🚀 RAWG API Request:', {
      url: config.url,
      method: config.method,
      params: config.params,
      baseURL: config.baseURL,
      timestamp: new Date().toISOString()
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
      url: response.config.url,
      dataLength: response.data ? (response.data.results ? response.data.results.length : 'Single item') : 'No data',
      totalCount: response.data?.count || 'N/A',
      timestamp: new Date().toISOString()
    });
    return response;
  },
  (error) => {
    console.error('❌ RAWG API Response Error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data,
      timestamp: new Date().toISOString()
    });
    return Promise.reject(error);
  }
);

/**
 * Enhanced error handler for RAWG API
 */
const handleRAWGError = (error, context = 'API call') => {
  let errorMessage = 'An unexpected error occurred';
  let errorCode = 'UNKNOWN_ERROR';
  
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        errorMessage = 'Invalid request parameters';
        errorCode = 'BAD_REQUEST';
        break;
      case 401:
        errorMessage = 'API key is invalid or expired';
        errorCode = 'UNAUTHORIZED';
        break;
      case 403:
        errorMessage = 'Access forbidden - check API key permissions';
        errorCode = 'FORBIDDEN';
        break;
      case 404:
        errorMessage = 'Requested resource not found';
        errorCode = 'NOT_FOUND';
        break;
      case 429:
        errorMessage = 'Rate limit exceeded - please try again later';
        errorCode = 'RATE_LIMIT';
        break;
      case 500:
        errorMessage = 'RAWG server error - please try again later';
        errorCode = 'SERVER_ERROR';
        break;
      default:
        errorMessage = `Server error (${status})`;
        errorCode = `HTTP_${status}`;
    }
    
    if (data?.detail) {
      errorMessage += `: ${data.detail}`;
    }
  } else if (error.request) {
    // Request was made but no response received
    errorMessage = 'No response from RAWG API - check your internet connection';
    errorCode = 'NO_RESPONSE';
  } else {
    // Something else happened
    errorMessage = error.message || 'Network or configuration error';
    errorCode = 'NETWORK_ERROR';
  }
  
  const enhancedError = new Error(`${context}: ${errorMessage}`);
  enhancedError.code = errorCode;
  enhancedError.originalError = error;
  
  return enhancedError;
};

/**
 * Test RAWG API connectivity and validate API key
 */
export const testRAWGConnectivity = async () => {
  try {
    console.log('🔌 Testing RAWG API connectivity...');
    
    const startTime = Date.now();
    const response = await api.get('/games', {
      params: {
        page_size: 1,
        ordering: '-rating'
      }
    });
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    if (response.status === 200 && response.data) {
      console.log('✅ RAWG API is accessible!');
      return {
        success: true,
        message: 'API is accessible and responding',
        totalGames: response.data.count,
        sampleGame: response.data.results?.[0],
        apiKey: RAWG_CONFIG.API_KEY ? 'Valid' : 'Missing',
        responseTime: `${responseTime}ms`,
        apiVersion: 'v1',
        lastChecked: new Date().toISOString()
      };
    } else {
      throw new Error('Unexpected response format');
    }
  } catch (error) {
    const enhancedError = handleRAWGError(error, 'Connectivity test');
    console.error('❌ RAWG API connectivity test failed:', enhancedError);
    
    return {
      success: false,
      message: enhancedError.message,
      error: enhancedError.message,
      code: enhancedError.code,
      lastChecked: new Date().toISOString()
    };
  }
};

/**
 * Get RAWG API status and health check
 */
export const getRAWGStatus = async () => {
  try {
    const startTime = Date.now();
    const response = await api.get('/games', {
      params: {
        page_size: 1
      }
    });
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    return {
      status: 'healthy',
      responseTime: `${responseTime}ms`,
      apiVersion: 'v1',
      totalGames: response.data?.count || 'Unknown',
      lastChecked: new Date().toISOString(),
      apiKey: RAWG_CONFIG.API_KEY ? 'Valid' : 'Missing',
      endpoints: {
        games: `${RAWG_CONFIG.BASE_URL}/games`,
        platforms: `${RAWG_CONFIG.BASE_URL}/platforms`,
        genres: `${RAWG_CONFIG.BASE_URL}/genres`,
        stores: `${RAWG_CONFIG.BASE_URL}/stores`
      }
    };
  } catch (error) {
    const enhancedError = handleRAWGError(error, 'Status check');
    return {
      status: 'unhealthy',
      error: enhancedError.message,
      code: enhancedError.code,
      lastChecked: new Date().toISOString(),
      apiKey: RAWG_CONFIG.API_KEY ? 'Valid' : 'Missing'
    };
  }
};

/**
 * Transform RAWG game data to our app structure
 */
const transformRAWGGame = (rawgGame) => {
  return {
    id: rawgGame.id,
    name: rawgGame.name,
    background_image: rawgGame.background_image || 
                     rawgGame.short_screenshots?.[0]?.image || 
                     '/assets/images/featured-game-1.jpg',
    rating: rawgGame.rating || 0,
    rating_top: rawgGame.rating_top || 5,
    metacritic: rawgGame.metacritic || null,
    playtime: rawgGame.playtime || 0,
    released: rawgGame.released,
    tba: rawgGame.tba || false,
    updated: rawgGame.updated,
    platforms: rawgGame.platforms?.map(p => p.platform.name) || [],
    genres: rawgGame.genres?.map(g => g.name) || [],
    stores: rawgGame.stores?.map(s => s.store.name) || [],
    tags: rawgGame.tags?.map(t => t.name) || [],
    esrb_rating: rawgGame.esrb_rating?.name || null,
    short_screenshots: rawgGame.short_screenshots?.map(s => s.image) || [],
    description: rawgGame.description || 
                 rawgGame.description_raw || 
                 `Explore ${rawgGame.name} - a fantastic gaming experience.`,
    website: rawgGame.website || null,
    developers: rawgGame.developers?.map(d => d.name) || [],
    publishers: rawgGame.publishers?.map(p => p.name) || [],
    // Mock pricing since RAWG doesn't provide pricing data
    price: Math.floor(Math.random() * 60) + 20,
    originalPrice: Math.floor(Math.random() * 60) + 20,
    cheapestPrice: Math.floor(Math.random() * 60) + 20,
    // Additional RAWG-specific fields
    slug: rawgGame.slug,
    dominant_color: rawgGame.dominant_color,
    added: rawgGame.added,
    added_by_status: rawgGame.added_by_status,
    requirements: rawgGame.requirements,
    parent_platforms: rawgGame.parent_platforms?.map(p => p.platform.name) || [],
    clip: rawgGame.clip?.clip || null,
    movies_count: rawgGame.movies_count || 0,
    creators_count: rawgGame.creators_count || 0,
    achievements_count: rawgGame.achievements_count || 0,
    parent_achievements_count: rawgGame.parent_achievements_count || 0,
    reddit_url: rawgGame.reddit_url,
    reddit_name: rawgGame.reddit_name,
    reddit_description: rawgGame.reddit_description,
    reddit_logo: rawgGame.reddit_logo,
    reddit_count: rawgGame.reddit_count || 0,
    twitch_count: rawgGame.twitch_count || 0,
    youtube_count: rawgGame.youtube_count || 0,
    reviews_text_count: rawgGame.reviews_text_count || 0,
    ratings_count: rawgGame.ratings_count || 0,
    suggestions_count: rawgGame.suggestions_count || 0,
    alternative_names: rawgGame.alternative_names || [],
    metacritic_url: rawgGame.metacritic_url,
    parents_count: rawgGame.parents_count || 0,
    additions_count: rawgGame.additions_count || 0,
    game_series_count: rawgGame.game_series_count || 0,
    user_game: rawgGame.user_game || null,
    reviews_count: rawgGame.reviews_count || 0,
    saturated_color: rawgGame.saturated_color,
    screenshots_count: rawgGame.screenshots_count || 0,
    tags_count: rawgGame.tags_count || 0,
    esrb_rating_id: rawgGame.esrb_rating?.id || null,
    esrb_rating_slug: rawgGame.esrb_rating?.slug || null,
  };
};

/**
 * Fetch games with comprehensive filtering and search capabilities
 * @param {Object} options - Search and filter options
 * @param {string} options.search - Search term
 * @param {number} options.page - Page number (1-based)
 * @param {number} options.pageSize - Items per page (max 40)
 * @param {string} options.ordering - Sort option
 * @param {Array} options.platforms - Platform IDs to filter by
 * @param {Array} options.genres - Genre IDs to filter by
 * @param {string} options.dates - Date range filter (YYYY-MM-DD,YYYY-MM-DD)
 * @param {number} options.metacritic - Minimum Metacritic score
 * @param {Array} options.tags - Tag IDs to filter by
 * @param {Array} options.publishers - Publisher IDs to filter by
 * @param {Array} options.developers - Developer IDs to filter by
 * @param {Array} options.stores - Store IDs to filter by
 * @param {string} options.creators - Creator name to filter by
 * @param {string} options.rating - Rating filter (1,2,3,4,5)
 * @param {boolean} options.updated - Show only updated games
 * @param {boolean} options.owned - Show only owned games
 * @param {boolean} options.retired - Show retired games
 * @param {boolean} options.achievements - Show games with achievements
 * @param {boolean} options.achievements_hidden - Show games with hidden achievements
 * @param {boolean} options.achievements_iconic - Show games with iconic achievements
 * @param {boolean} options.achievements_rare - Show games with rare achievements
 */
export const fetchGames = async (options = {}) => {
  try {
    console.log('🎮 Starting RAWG API call with options:', options);
    
    const {
      search = '',
      page = 1,
      pageSize = 100,
      ordering = '-rating,-metacritic,-added',
      platforms = [],
      genres = [],
      dates = '2021-01-01,2025-12-31', // Focus on recent games (2021-2025)
      metacritic = 70, // Focus on games with good ratings
      tags = [],
      publishers = [],
      developers = [],
      stores = [],
      creators = '',
      rating = '4.0,5.0', // Focus on highly rated games
      updated = false,
      owned = false,
      retired = false,
      achievements = false,
      achievements_hidden = false,
      achievements_iconic = false,
      achievements_rare = false
    } = options;

    // Validate and sanitize parameters
    const validatedPageSize = Math.min(Math.max(1, pageSize), RAWG_CONFIG.MAX_PAGE_SIZE);
    const validatedPage = Math.max(1, page);

    // Build query parameters according to RAWG API specification
    const params = {
      page: validatedPage,
      page_size: validatedPageSize,
      ordering: ordering,
      dates: dates, // Always include date filter for recent games
      metacritic: metacritic, // Always include metacritic filter for quality
      rating: rating, // Always include rating filter for popular games
    };
    
    // Add optional parameters only if they have values
    if (search.trim()) params.search = search.trim();
    if (platforms.length > 0) {
      // Filter to only include desired platforms: PC, PlayStation, Xbox, Nintendo
      const desiredPlatformIds = ['1', '2', '3', '7']; // PC, PlayStation, Xbox, Nintendo
      const filteredPlatforms = platforms.filter(p => desiredPlatformIds.includes(p.toString()));
      if (filteredPlatforms.length > 0) {
        params.platforms = filteredPlatforms.join(',');
      }
    } else {
      // Default to only include desired platforms: PC, PlayStation, Xbox, Nintendo
      // PC: 1, PlayStation: 2, Xbox: 3, Nintendo: 7
      // We want: PC (1), PlayStation (2), Xbox (3), Nintendo (7)
      params.platforms = '1,2,3,7'; // PC, PlayStation, Xbox, Nintendo
    }
    
    // Always exclude unwanted platforms to ensure they don't appear in results
    // Web: 34, 37, Android: 4, iOS: 8, Linux: 6, Gameboy: 5, Mobile: 21
    params.exclude_platforms = '4,5,6,8,21,34,37';
    
    if (genres.length > 0) params.genres = genres.join(',');
    if (tags.length > 0) params.tags = tags.join(',');
    if (publishers.length > 0) params.publishers = publishers.join(',');
    if (developers.length > 0) params.developers = developers.join(',');
    if (stores.length > 0) params.stores = stores.join(',');
    if (creators.trim()) params.creators = creators.trim();
    if (updated) params.updated = 'true';
    if (owned) params.owned = 'true';
    if (retired) params.retired = 'true';
    if (achievements) params.achievements = 'true';
    if (achievements_hidden) params.achievements_hidden = 'true';
    if (achievements_iconic) params.achievements_iconic = 'true';
    if (achievements_rare) params.achievements_rare = 'true';

    console.log('🔍 RAWG API params:', params);
    console.log('🌐 API URL:', `${RAWG_CONFIG.BASE_URL}/games`);

    const response = await api.get('/games', { params });
    
    console.log('📊 Raw RAWG response:', response.data);
    
    if (!response.data || !response.data.results) {
      console.warn('⚠️ RAWG API returned invalid data format:', response.data);
      throw new Error('Invalid data format from RAWG API');
    }
    
    // Transform RAWG data to match our app structure
    const transformedGames = response.data.results.map(transformRAWGGame);

    console.log('🔄 Transformed games:', transformedGames);

    const result = {
      games: transformedGames,
      count: response.data.count,
      next: response.data.next ? validatedPage + 1 : null,
      previous: response.data.previous ? validatedPage - 1 : null,
      totalPages: Math.ceil(response.data.count / validatedPageSize),
      currentPage: validatedPage,
      pageSize: validatedPageSize,
      apiInfo: {
        source: 'RAWG API',
        version: 'v1',
        timestamp: new Date().toISOString(),
        totalResults: response.data.count,
        filters: {
          includedPlatforms: 'PC, PlayStation, Xbox, Nintendo',
          excludedPlatforms: 'Web (34,37), Android (4), iOS (8), Linux (6), Gameboy (5), Mobile (21)',
          minMetacritic: metacritic,
          minRating: rating.split(',')[0],
          dateRange: dates
        }
      }
    };

    console.log('🎯 Final result:', result);
    return result;
    
  } catch (error) {
    const enhancedError = handleRAWGError(error, 'Fetch games');
    console.error('💥 RAWG API error:', enhancedError);
    
    // Return fallback data if API fails
    console.log('🔄 Using fallback data due to API failure');
    return getFallbackGames(options);
  }
};

/**
 * Fetch a specific game by ID with full details
 * @param {string|number} gameId - Game ID from RAWG
 */
export const fetchGameById = async (gameId) => {
  try {
    console.log(`🎮 Fetching game details for ID: ${gameId}`);
    
    const response = await api.get(`/games/${gameId}`);

    if (response.data) {
      const transformedGame = transformRAWGGame(response.data);
      console.log('✅ Game details fetched successfully:', transformedGame.name);
      return transformedGame;
    }
    
    throw new Error('Game not found');
  } catch (error) {
    const enhancedError = handleRAWGError(error, `Fetch game ${gameId}`);
    console.error('RAWG API error:', enhancedError);
    throw enhancedError;
  }
};

/**
 * Fetch all available platforms with enhanced data
 */
export const fetchPlatforms = async () => {
  try {
    console.log('🖥️ Fetching platforms from RAWG API...');
    
    const response = await api.get('/platforms', {
      params: {
        page_size: 50 // Get more platforms
      }
    });
    
    // Filter to only include desired platforms: PC, PlayStation, Xbox, Nintendo
    const desiredPlatformIds = ['1', '2', '3', '7']; // PC, PlayStation, Xbox, Nintendo
    const filteredPlatforms = response.data.results.filter(platform => 
      desiredPlatformIds.includes(platform.id.toString())
    );
    
    const platforms = filteredPlatforms.map(platform => ({
      id: platform.id,
      name: platform.name,
      slug: platform.slug,
      games_count: platform.games_count,
      image_background: platform.image_background,
      year_start: platform.year_start,
      year_end: platform.year_end,
      // Additional platform details
      description: platform.description,
      image: platform.image,
      games: platform.games || [],
      parent_platform: platform.parent_platform,
      platforms: platform.platforms || [],
      requirements: platform.requirements || {},
    }));
    
    console.log(`✅ Fetched ${platforms.length} platforms from RAWG (only PC, PlayStation, Xbox, Nintendo)`);
    return platforms;
  } catch (error) {
    const enhancedError = handleRAWGError(error, 'Fetch platforms');
    console.error('RAWG platforms API error:', enhancedError);
    return [];
  }
};

/**
 * Fetch all available genres with enhanced data
 */
export const fetchGenres = async () => {
  try {
    console.log('🎭 Fetching genres from RAWG API...');
    
    const response = await api.get('/genres', {
      params: {
        page_size: 50 // Get more genres
      }
    });
    
    const genres = response.data.results.map(genre => ({
      id: genre.id,
      name: genre.name,
      slug: genre.slug,
      games_count: genre.games_count,
      image_background: genre.image_background,
      // Additional genre details
      description: genre.description,
      games: genre.games || [],
      subgenres: genre.subgenres || [],
      parent_genres: genre.parent_genres || [],
    }));
    
    console.log(`✅ Fetched ${genres.length} genres from RAWG`);
    return genres;
  } catch (error) {
    const enhancedError = handleRAWGError(error, 'Fetch genres');
    console.error('RAWG genres API error:', enhancedError);
    return [];
  }
};

/**
 * Fetch all available stores
 */
export const fetchStores = async () => {
  try {
    console.log('🏪 Fetching stores from RAWG API...');
    
    const response = await api.get('/stores', {
      params: {
        page_size: 50
      }
    });
    
    const stores = response.data.results.map(store => ({
      id: store.id,
      name: store.name,
      slug: store.slug,
      games_count: store.games_count,
      image_background: store.image_background,
      // Additional store details
      description: store.description,
      domain: store.domain,
      games: store.games || [],
    }));
    
    console.log(`✅ Fetched ${stores.length} stores from RAWG`);
    return stores;
  } catch (error) {
    const enhancedError = handleRAWGError(error, 'Fetch stores');
    console.error('RAWG stores API error:', enhancedError);
    return [];
  }
};

/**
 * Get platform ID by name with fuzzy matching
 * @param {string} platformName - Platform name to search for
 * @param {Array} platforms - Array of platform objects from fetchPlatforms
 */
export const getPlatformIdByName = (platformName, platforms) => {
  if (!platformName || !platforms || platforms.length === 0) return null;
  
  const searchName = platformName.toLowerCase().trim();
  
  // Exact match first
  let platform = platforms.find(p => 
    p.name.toLowerCase() === searchName
  );
  
  // Fuzzy match if exact not found
  if (!platform) {
    platform = platforms.find(p => 
      p.name.toLowerCase().includes(searchName) ||
      searchName.includes(p.name.toLowerCase())
    );
  }
  
  // Partial match for common abbreviations
  if (!platform) {
    const commonAbbreviations = {
      'ps4': 'PlayStation 4',
      'ps5': 'PlayStation 5',
      'xbox': 'Xbox One',
      'xboxs': 'Xbox Series X',
      'pc': 'PC',
      'switch': 'Nintendo Switch',
      'mobile': 'iOS',
      'ios': 'iOS',
      'android': 'Android'
    };
    
    const expandedName = commonAbbreviations[searchName];
    if (expandedName) {
      platform = platforms.find(p => 
        p.name.toLowerCase() === expandedName.toLowerCase()
      );
    }
  }
  
  return platform ? platform.id : null;
};

/**
 * Get genre ID by name with fuzzy matching
 * @param {string} genreName - Genre name to search for
 * @param {Array} genres - Array of genre objects from fetchGenres
 */
export const getGenreIdByName = (genreName, genres) => {
  if (!genreName || !genres || genres.length === 0) return null;
  
  const searchName = genreName.toLowerCase().trim();
  
  // Exact match first
  let genre = genres.find(g => 
    g.name.toLowerCase() === searchName
  );
  
  // Fuzzy match if exact not found
  if (!genre) {
    genre = genres.find(g => 
      g.name.toLowerCase().includes(searchName) ||
      searchName.includes(g.name.toLowerCase())
    );
  }
  
  // Partial match for common abbreviations
  if (!genre) {
    const commonAbbreviations = {
      'rpg': 'Role-Playing',
      'fps': 'Shooter',
      'tps': 'Shooter',
      'action': 'Action',
      'adventure': 'Adventure',
      'strategy': 'Strategy',
      'simulation': 'Simulation',
      'sports': 'Sports',
      'racing': 'Racing',
      'puzzle': 'Puzzle',
      'indie': 'Indie',
      'casual': 'Casual'
    };
    
    const expandedName = commonAbbreviations[searchName];
    if (expandedName) {
      genre = genres.find(g => 
        g.name.toLowerCase() === expandedName.toLowerCase()
      );
    }
  }
  
  return genre ? genre.id : null;
};

/**
 * Search for games with advanced filtering
 * @param {string} searchTerm - Search query
 * @param {Object} options - Additional search options
 */
export const searchGames = async (searchTerm, options = {}) => {
  try {
    console.log(`🔍 Searching for games: "${searchTerm}"`);
    
    // Build search parameters with platform filtering
    const params = {
      search: searchTerm,
      page_size: options.pageSize || 100,
      ordering: options.ordering || '-rating',
      platforms: '1,2,3,7', // Only PC, PlayStation, Xbox, Nintendo
      exclude_platforms: '4,5,6,8,21,34,37', // Exclude Web, Android, iOS, Linux, Gameboy, Mobile
      ...options
    };
    
    const response = await api.get('/games', { params });

    const transformedGames = response.data.results.map(transformRAWGGame);
    
    console.log(`✅ Search completed: ${transformedGames.length} results for "${searchTerm}" (only PC, PlayStation, Xbox, Nintendo)`);
    return transformedGames;
  } catch (error) {
    const enhancedError = handleRAWGError(error, `Search games: "${searchTerm}"`);
    console.error('RAWG search API error:', enhancedError);
    return [];
  }
};

/**
 * Enhanced function for fetching games with proper filter handling
 * This function converts filter names to IDs and makes the API call
 * @param {Object} options - Filter options
 * @param {string} options.search - Search term
 * @param {number} options.page - Page number
 * @param {number} options.pageSize - Items per page
 * @param {string} options.sortBy - Sort option
 * @param {Array} options.selectedGenre - Array of genre names
 * @param {Array} options.selectedPlatform - Array of platform names
 */
export const fetchGamesWithFilters = async (options = {}) => {
  try {
    console.log('🎮 Starting RAWG API call with filter names:', options);
    
    const {
      search = '',
      page = 1,
      pageSize = 60,
      sortBy = 'relevance',
      selectedGenre = [],
      selectedPlatform = []
    } = options;

    // First, fetch platforms and genres to get their IDs
    const [platformsData, genresData] = await Promise.all([
      fetchPlatforms(),
      fetchGenres()
    ]);

    // Convert filter names to IDs with better error handling
    const platformIds = selectedPlatform
      .map(name => getPlatformIdByName(name, platformsData))
      .filter(id => id !== null);
    
    const genreIds = selectedGenre
      .map(name => getGenreIdByName(name, genresData))
      .filter(id => id !== null);

    console.log('🔄 Converted filters:', {
      originalPlatforms: selectedPlatform,
      platformIds,
      originalGenres: selectedGenre,
      genreIds
    });

    // Map sortBy to RAWG ordering parameter
    const orderingMap = {
      'rating': '-rating',
      'released': '-released',
      'name-asc': 'name',
      'name-desc': '-name',
      'metacritic': '-metacritic',
      'added': '-added',
      'updated': '-updated',
      'relevance': '-rating' // Default to rating for relevance
    };

    // Build query parameters for RAWG API
    const params = {
      page: page,
      page_size: pageSize,
      ordering: orderingMap[sortBy] || orderingMap.relevance,
      dates: '2020-01-01,2025-12-31', // Focus on recent games (2020-2025)
      metacritic: 70, // Focus on games with good ratings
      rating: '4.0,5.0', // Focus on highly rated games
    };
    
    if (search) params.search = search;
    if (platformIds.length > 0) {
      // Filter to only include desired platforms
      const desiredPlatformIds = ['1', '2', '3', '7']; // PC, PlayStation, Xbox, Nintendo
      const filteredPlatformIds = platformIds.filter(id => desiredPlatformIds.includes(id.toString()));
      if (filteredPlatformIds.length > 0) {
        params.platforms = filteredPlatformIds.join(',');
      }
    } else {
      // Default to only include desired platforms: PC, PlayStation, Xbox, Nintendo
      params.platforms = '1,2,3,7'; // PC, PlayStation, Xbox, Nintendo
    }
    
    // Always exclude unwanted platforms to ensure they don't appear in results
    // Web: 34, 37, Android: 4, iOS: 8, Linux: 6, Gameboy: 5, Mobile: 21
    params.exclude_platforms = '4,5,6,8,21,34,37';
    
    if (genreIds.length > 0) params.genres = genreIds.join(',');

    console.log('🔍 RAWG API params:', params);
    console.log('🌐 API URL:', `${RAWG_CONFIG.BASE_URL}/games`);

    const response = await api.get('/games', { params });
    
    console.log('📊 Raw RAWG response:', response.data);
    
    if (!response.data || !response.data.results) {
      console.warn('⚠️ RAWG API returned invalid data format:', response.data);
      throw new Error('Invalid data format from RAWG API');
    }
    
    // Transform RAWG data to match our app structure
    const transformedGames = response.data.results.map(transformRAWGGame);

    console.log('🔄 Transformed games:', transformedGames);

    const result = {
      games: transformedGames,
      count: response.data.count,
      next: response.data.next ? page + 1 : null,
      previous: response.data.previous ? page - 1 : null,
      totalPages: Math.ceil(response.data.count / pageSize),
      currentPage: page,
      pageSize: pageSize,
      appliedFilters: {
        search,
        genres: selectedGenre,
        platforms: selectedPlatform,
        sortBy,
        genreIds,
        platformIds
      },
      apiInfo: {
        source: 'RAWG API',
        version: 'v1',
        timestamp: new Date().toISOString(),
        totalResults: response.data.count
      }
    };

    console.log('🎯 Final result:', result);
    return result;
    
  } catch (error) {
    const enhancedError = handleRAWGError(error, 'Fetch games with filters');
    console.error('💥 RAWG API error:', enhancedError);
    
    // Return fallback data if API fails
    console.log('🔄 Using fallback data due to API failure');
    return getFallbackGames(options);
  }
};

/**
 * Get game screenshots for a specific game
 * @param {string|number} gameId - Game ID from RAWG
 */
export const fetchGameScreenshots = async (gameId) => {
  try {
    console.log(`📸 Fetching screenshots for game ID: ${gameId}`);
    
    const response = await api.get(`/games/${gameId}/screenshots`);
    
    if (response.data && response.data.results) {
      const screenshots = response.data.results.map(screenshot => ({
        id: screenshot.id,
        image: screenshot.image,
        width: screenshot.width,
        height: screenshot.height,
        is_deleted: screenshot.is_deleted || false
      }));
      
      console.log(`✅ Fetched ${screenshots.length} screenshots for game ${gameId}`);
      return screenshots;
    }
    
    return [];
  } catch (error) {
    const enhancedError = handleRAWGError(error, `Fetch screenshots for game ${gameId}`);
    console.error('RAWG screenshots API error:', enhancedError);
    return [];
  }
};

/**
 * Get game movies/trailers for a specific game
 * @param {string|number} gameId - Game ID from RAWG
 */
export const fetchGameMovies = async (gameId) => {
  try {
    console.log(`🎬 Fetching movies for game ID: ${gameId}`);
    
    const response = await api.get(`/games/${gameId}/movies`);
    
    if (response.data && response.data.results) {
      const movies = response.data.results.map(movie => ({
        id: movie.id,
        name: movie.name,
        preview: movie.preview,
        data: movie.data,
        preview_data: movie.preview_data
      }));
      
      console.log(`✅ Fetched ${movies.length} movies for game ${gameId}`);
      return movies;
    }
    
    return [];
  } catch (error) {
    const enhancedError = handleRAWGError(error, `Fetch movies for game ${gameId}`);
    console.error('RAWG movies API error:', enhancedError);
    return [];
  }
};

/**
 * Get game achievements for a specific game
 * @param {string|number} gameId - Game ID from RAWG
 */
export const fetchGameAchievements = async (gameId) => {
  try {
    console.log(`🏆 Fetching achievements for game ID: ${gameId}`);
    
    const response = await api.get(`/games/${gameId}/achievements`);
    
    if (response.data && response.data.results) {
      const achievements = response.data.results.map(achievement => ({
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        image: achievement.image,
        percent: achievement.percent
      }));
      
      console.log(`✅ Fetched ${achievements.length} achievements for game ${gameId}`);
      return achievements;
    }
    
    return [];
  } catch (error) {
    const enhancedError = handleRAWGError(error, `Fetch achievements for game ${gameId}`);
    console.error('RAWG achievements API error:', enhancedError);
    return [];
  }
};

/**
 * Fallback games data when RAWG API fails
 */
const getFallbackGames = (options) => {
  console.log('🔄 Using fallback games data');
  
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
      currentPage: options.page || 1,
      pageSize: options.pageSize || 60,
      apiInfo: {
        source: 'Fallback Data',
        reason: 'RAWG API unavailable',
        timestamp: new Date().toISOString()
      }
    };
};

// Export default for convenience
export default {
  testRAWGConnectivity,
  getRAWGStatus,
  fetchGames,
  fetchGameById,
  fetchPlatforms,
  fetchGenres,
  fetchStores,
  searchGames,
  fetchGamesWithFilters,
  fetchGameScreenshots,
  fetchGameMovies,
  fetchGameAchievements,
  getPlatformIdByName,
  getGenreIdByName,
};
