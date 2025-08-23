import axios from 'axios';

/**
 * BoardGameGeek (BGG) API Service
 * 
 * BGG is the world's largest board game database and community:
 * - Board games, card games, and tabletop RPGs
 * - User ratings and reviews
 * - Game mechanics and categories
 * - Expansions and related games
 * - Community-driven content
 * 
 * OFFICIAL DOCUMENTATION: https://boardgamegeek.com/wiki/page/BGG_XML_API2
 * API BASE URL: https://boardgamegeek.com/xmlapi2
 * 
 * ⚠️  IMPORTANT: BGG API is XML-based and doesn't require an API key
 *     It's free to use but has rate limiting (be respectful)
 */

// BGG API Configuration
const BGG_CONFIG = {
  BASE_URL: 'https://boardgamegeek.com/xmlapi2',
  TIMEOUT: 30000, // 30 seconds for better reliability
  RATE_LIMIT_DELAY: 1000, // 1 second delay between requests to be respectful
};

// Create axios instance for BGG with proper configuration
const api = axios.create({
  baseURL: BGG_CONFIG.BASE_URL,
  timeout: BGG_CONFIG.TIMEOUT,
  headers: {
    'Accept': 'application/xml, text/xml, */*',
    'User-Agent': 'Gaming-Store-App/1.0 (https://github.com/your-repo)',
  },
});

// Enhanced request/response interceptors for debugging and error handling
api.interceptors.request.use(
  (config) => {
    console.log('🎲 BGG API Request:', {
      url: config.url,
      method: config.method,
      params: config.params,
      baseURL: config.baseURL,
      timestamp: new Date().toISOString()
    });
    return config;
  },
  (error) => {
    console.error('❌ BGG API Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('✅ BGG API Response:', {
      status: response.status,
      url: response.config.url,
      contentType: response.headers['content-type'],
      dataLength: response.data ? response.data.length : 'No data',
      timestamp: new Date().toISOString()
    });
    return response;
  },
  (error) => {
    console.error('❌ BGG API Response Error:', {
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
 * Enhanced error handler for BGG API
 */
const handleBGGError = (error, context = 'API call') => {
  let errorMessage = 'An unexpected error occurred';
  let errorCode = 'UNKNOWN_ERROR';
  
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 429:
        errorMessage = 'Rate limit exceeded. Please wait before making another request.';
        errorCode = 'RATE_LIMIT_EXCEEDED';
        break;
      case 503:
        errorMessage = 'BGG service temporarily unavailable. Please try again later.';
        errorCode = 'SERVICE_UNAVAILABLE';
        break;
      case 404:
        errorMessage = 'Game not found in BGG database.';
        errorCode = 'GAME_NOT_FOUND';
        break;
      default:
        errorMessage = `BGG API error: ${status} ${error.response.statusText}`;
        errorCode = `HTTP_${status}`;
    }
  } else if (error.request) {
    // Request was made but no response received
    errorMessage = 'No response from BGG API. Please check your internet connection.';
    errorCode = 'NO_RESPONSE';
  } else {
    // Something else happened
    errorMessage = error.message || 'An unexpected error occurred';
    errorCode = 'REQUEST_ERROR';
  }
  
  console.error(`❌ BGG API Error in ${context}:`, {
    errorCode,
    errorMessage,
    originalError: error.message,
    timestamp: new Date().toISOString()
  });
  
  return {
    success: false,
    error: errorMessage,
    errorCode,
    timestamp: new Date().toISOString()
  };
};

/**
 * Parse XML response from BGG API
 */
const parseXMLResponse = (xmlString) => {
  try {
    // Simple XML parsing for basic data extraction
    // In production, you might want to use a proper XML parser
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    
    // Check for parsing errors
    const parseError = xmlDoc.getElementsByTagName('parsererror');
    if (parseError.length > 0) {
      throw new Error('XML parsing failed');
    }
    
    return xmlDoc;
  } catch (error) {
    console.error('❌ XML Parsing Error:', error);
    throw new Error('Failed to parse BGG API response');
  }
};

/**
 * Extract game data from BGG XML response
 */
const extractGameData = (gameElement) => {
  try {
    const getAttribute = (element, attr) => element.getAttribute(attr) || '';
    const getTextContent = (element, tag) => {
      const el = element.getElementsByTagName(tag)[0];
      return el ? el.textContent.trim() : '';
    };
    
    const getArrayContent = (element, tag) => {
      const elements = element.getElementsByTagName(tag);
      return Array.from(elements).map(el => el.textContent.trim());
    };
    
    return {
      id: getAttribute(gameElement, 'id'),
      name: getTextContent(gameElement, 'name'),
      yearPublished: getTextContent(gameElement, 'yearpublished'),
      description: getTextContent(gameElement, 'description'),
      minPlayers: getTextContent(gameElement, 'minplayers'),
      maxPlayers: getTextContent(gameElement, 'maxplayers'),
      playingTime: getTextContent(gameElement, 'playingtime'),
      minPlayTime: getTextContent(gameElement, 'minplaytime'),
      maxPlayTime: getTextContent(gameElement, 'maxplaytime'),
      minAge: getTextContent(gameElement, 'minage'),
      categories: getArrayContent(gameElement, 'category'),
      mechanics: getArrayContent(gameElement, 'mechanic'),
      designers: getArrayContent(gameElement, 'designer'),
      artists: getArrayContent(gameElement, 'artist'),
      publishers: getArrayContent(gameElement, 'publisher'),
      expansions: getArrayContent(gameElement, 'expansion'),
      rating: getTextContent(gameElement, 'average'),
      weight: getTextContent(gameElement, 'averageweight'),
      rank: getTextContent(gameElement, 'rank'),
      thumbnail: getTextContent(gameElement, 'thumbnail'),
      image: getTextContent(gameElement, 'image'),
    };
  } catch (error) {
    console.error('❌ Game Data Extraction Error:', error);
    return null;
  }
};

/**
 * Search for games in BGG database
 */
export const searchBGGGames = async (query, options = {}) => {
  try {
    const {
      exact = false,
      type = 'boardgame',
      limit = 20
    } = options;
    
    const params = {
      query: query.trim(),
      type,
      limit: Math.min(limit, 100), // BGG max is 100
    };
    
    if (exact) {
      params.exact = 1;
    }
    
    console.log('🔍 BGG Search Request:', { query, params });
    
    const response = await api.get('/search', { params });
    
    if (response.status === 200 && response.data) {
      const xmlDoc = parseXMLResponse(response.data);
      const games = xmlDoc.getElementsByTagName('item');
      
      const results = Array.from(games).map(game => {
        const gameData = extractGameData(game);
        if (gameData) {
          return {
            ...gameData,
            // Add estimated price (BGG doesn't provide pricing)
            price: Math.floor(Math.random() * 40) + 15, // $15-$55 range
            originalPrice: Math.floor(Math.random() * 40) + 15,
            cheapestPrice: Math.floor(Math.random() * 40) + 15,
            // Add platform info for consistency
            platforms: ['Tabletop'],
            // Add genre from categories
            genres: gameData.categories || [],
            // Add description fallback
            description: gameData.description || `Explore ${gameData.name}`,
            // Add background image
            background_image: gameData.image || gameData.thumbnail || '/assets/images/featured-game-1.jpg',
          };
        }
        return null;
      }).filter(Boolean);
      
      console.log(`✅ BGG Search Results: ${results.length} games found`);
      
      return {
        success: true,
        games: results,
        total: results.length,
        query,
        timestamp: new Date().toISOString()
      };
    }
    
    throw new Error('Invalid response from BGG API');
    
  } catch (error) {
    return handleBGGError(error, 'searchBGGGames');
  }
};

/**
 * Get detailed game information by ID
 */
export const getBGGGameById = async (gameId) => {
  try {
    console.log(`🎲 BGG Game Details Request: ${gameId}`);
    
    const params = {
      id: gameId,
      stats: 1, // Include statistics
    };
    
    const response = await api.get('/thing', { params });
    
    if (response.status === 200 && response.data) {
      const xmlDoc = parseXMLResponse(response.data);
      const gameElement = xmlDoc.getElementsByTagName('item')[0];
      
      if (gameElement) {
        const gameData = extractGameData(gameElement);
        
        if (gameData) {
          console.log(`✅ BGG Game Details: ${gameData.name}`);
          
          return {
            success: true,
            game: {
              ...gameData,
              // Add estimated price
              price: Math.floor(Math.random() * 40) + 15,
              originalPrice: Math.floor(Math.random() * 40) + 15,
              cheapestPrice: Math.floor(Math.random() * 40) + 15,
              // Add platform info
              platforms: ['Tabletop'],
              // Add genre from categories
              genres: gameData.categories || [],
              // Add description fallback
              description: gameData.description || `Explore ${gameData.name}`,
              // Add background image
              background_image: gameData.image || gameData.thumbnail || '/assets/images/featured-game-1.jpg',
            },
            timestamp: new Date().toISOString()
          };
        }
      }
      
      throw new Error('Game not found in BGG database');
    }
    
    throw new Error('Invalid response from BGG API');
    
  } catch (error) {
    return handleBGGError(error, 'getBGGGameById');
  }
};

/**
 * Get popular board games
 */
export const getPopularBGGGames = async (limit = 20) => {
  try {
    console.log(`🔥 BGG Popular Games Request: ${limit} games`);
    
    // BGG doesn't have a direct "popular" endpoint, so we'll use a search with common terms
    const popularTerms = ['Catan', 'Ticket to Ride', 'Pandemic', 'Carcassonne', 'Settlers of Catan'];
    const allGames = [];
    
    for (const term of popularTerms) {
      const searchResult = await searchBGGGames(term, { limit: Math.ceil(limit / popularTerms.length) });
      if (searchResult.success && searchResult.games) {
        allGames.push(...searchResult.games);
      }
      
      // Be respectful with rate limiting
      await new Promise(resolve => setTimeout(resolve, BGG_CONFIG.RATE_LIMIT_DELAY));
    }
    
    // Remove duplicates and limit results
    const uniqueGames = allGames.filter((game, index, self) => 
      index === self.findIndex(g => g.id === game.id)
    ).slice(0, limit);
    
    console.log(`✅ BGG Popular Games: ${uniqueGames.length} games found`);
    
    return {
      success: true,
      games: uniqueGames,
      total: uniqueGames.length,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    return handleBGGError(error, 'getPopularBGGGames');
  }
};

/**
 * Get games by category/mechanic
 */
export const getBGGGamesByCategory = async (category, limit = 20) => {
  try {
    console.log(`🏷️ BGG Category Games Request: ${category} (${limit} games)`);
    
    // Search for games with the category in the name or description
    const searchResult = await searchBGGGames(category, { limit });
    
    if (searchResult.success && searchResult.games) {
      // Filter games that actually have the category
      const filteredGames = searchResult.games.filter(game => 
        game.categories && game.categories.some(cat => 
          cat.toLowerCase().includes(category.toLowerCase())
        )
      );
      
      console.log(`✅ BGG Category Games: ${filteredGames.length} games found for ${category}`);
      
      return {
        success: true,
        games: filteredGames,
        total: filteredGames.length,
        category,
        timestamp: new Date().toISOString()
      };
    }
    
    return {
      success: false,
      error: 'No games found for this category',
      category,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    return handleBGGError(error, 'getBGGGamesByCategory');
  }
};

/**
 * Test BGG API connectivity
 */
export const testBGGConnectivity = async () => {
  try {
    console.log('🧪 Testing BGG API connectivity...');
    
    // Try to get a popular game as a connectivity test
    const testResult = await searchBGGGames('Catan', { limit: 1 });
    
    if (testResult.success && testResult.games && testResult.games.length > 0) {
      const sampleGame = testResult.games[0];
      
      console.log('✅ BGG API connectivity test successful');
      
      return {
        success: true,
        message: 'BGG API is accessible and responding',
        sampleGame: {
          id: sampleGame.id,
          name: sampleGame.name,
          yearPublished: sampleGame.yearPublished,
          rating: sampleGame.rating,
        },
        note: 'BGG API is working - free access confirmed'
      };
    }
    
    throw new Error('No test data received from BGG API');
    
  } catch (error) {
    return handleBGGError(error, 'testBGGConnectivity');
  }
};

/**
 * Get BGG API statistics
 */
export const getBGGStats = async () => {
  try {
    console.log('📊 Getting BGG API statistics...');
    
    // Get some popular games to estimate database size
    const popularResult = await getPopularBGGGames(50);
    
    if (popularResult.success) {
      return {
        success: true,
        totalGames: 'Millions+ (BGG has extensive database)',
        apiType: 'XML-based REST API',
        rateLimit: 'Respectful usage recommended',
        features: [
          'Board games and card games',
          'User ratings and reviews',
          'Game mechanics and categories',
          'Expansions and related games',
          'Community-driven content'
        ],
        sampleGames: popularResult.games.slice(0, 3).map(game => ({
          name: game.name,
          yearPublished: game.yearPublished,
          rating: game.rating
        })),
        timestamp: new Date().toISOString()
      };
    }
    
    throw new Error('Failed to get BGG statistics');
    
  } catch (error) {
    return handleBGGError(error, 'getBGGStats');
  }
};

// Export all functions
export default {
  searchBGGGames,
  getBGGGameById,
  getPopularBGGGames,
  getBGGGamesByCategory,
  testBGGConnectivity,
  getBGGStats,
};
