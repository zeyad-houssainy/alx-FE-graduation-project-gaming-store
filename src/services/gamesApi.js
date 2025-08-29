import axios from 'axios';
import { API_CONFIG, isAPIEnabled, getAPITimeout } from '../config/api';
import * as cheapsharkApi from './cheapsharkApi';

/**
 * GAMING STORE API Service
 * 
 * CORS SOLUTION: This service uses local fallback data by default to avoid CORS issues
 * when making requests from the browser to external APIs like RAWG.
 * 
 * CONFIGURATION:
 * - Set USE_API = false (default) to use local data (recommended for development)
 * - Set USE_API = true to attempt API calls (may cause CORS errors in browser)
 * 
 * WHY CORS HAPPENS:
 * - RAWG API doesn't support CORS for browser requests
 * - This is a security feature that prevents malicious websites from accessing APIs
 * - Server-to-server requests don't have this limitation
 * 
 * ALTERNATIVE SOLUTIONS:
 * 1. Use a CORS proxy service (not recommended for production)
 * 2. Build a backend server to proxy API calls
 * 3. Use local data (current implementation - most reliable)
 * 
 * LOCAL DATA FEATURES:
 * - 20+ high-quality games with realistic data
 * - Full search, filtering, and sorting support
 * - Pagination support
 * - No API rate limits or CORS issues
 */

// Configuration
const USE_API = isAPIEnabled();

// Enhanced fallback data with more games and better structure
const fallbackGames = [
  {
    id: 1,
    name: "Cyberpunk 2077",
    background_image: "/assets/images/featured-game-1.jpg",
    rating: 4.2,
    price: 59.99,
    platforms: ["PC", "PS5", "Xbox Series X"],
    genre: "RPG",
    released: "2020-12-10",
    description: "An open-world action-adventure story set in Night City, a megalopolis obsessed with power, glamour and body modification."
  },
  {
    id: 2,
    name: "Elden Ring",
    background_image: "/assets/images/featured-game-2.jpg",
    rating: 4.8,
    price: 69.99,
    platforms: ["PC", "PS5", "Xbox Series X"],
    genre: "Action RPG",
    released: "2022-02-25",
    description: "An action role-playing game developed by FromSoftware and published by Bandai Namco Entertainment."
  },
  {
    id: 3,
    name: "God of War Ragnarök",
    background_image: "/assets/images/featured-game-3.jpg",
    rating: 4.7,
    price: 69.99,
    platforms: ["PS5", "PS4"],
    genre: "Action-Adventure",
    released: "2022-11-09",
    description: "An action-adventure game developed by Santa Monica Studio and published by Sony Interactive Entertainment."
  },
  {
    id: 4,
    name: "Red Dead Redemption 2",
    background_image: "/assets/images/featured-game-4.jpg",
    rating: 4.6,
    price: 49.99,
    platforms: ["PC", "PS4", "Xbox One"],
    genre: "Action-Adventure",
    released: "2018-10-26",
    description: "An action-adventure game developed and published by Rockstar Games."
  },
  {
    id: 5,
    name: "The Witcher 3: Wild Hunt",
    background_image: "/assets/images/latest-game-1.jpg",
    rating: 4.9,
    price: 39.99,
    platforms: ["PC", "PS4", "Xbox One", "Nintendo Switch"],
    genre: "RPG",
    released: "2015-05-19",
    description: "An action role-playing game with a third-person perspective."
  },
  {
    id: 6,
    name: "Grand Theft Auto V",
    background_image: "/assets/images/latest-game-2.jpg",
    rating: 4.5,
    price: 29.99,
    platforms: ["PC", "PS4", "Xbox One", "PS5", "Xbox Series X"],
    genre: "Action-Adventure",
    released: "2013-09-17",
    description: "An action-adventure game developed by Rockstar North."
  },
  {
    id: 7,
    name: "Minecraft",
    background_image: "/assets/images/latest-game-3.jpg",
    rating: 4.7,
    price: 26.95,
    platforms: ["PC", "PS4", "Xbox One", "Nintendo Switch"],
    genre: "Sandbox",
    released: "2011-11-18",
    description: "A 3D sandbox game that has no specific goals to accomplish."
  },
  {
    id: 8,
    name: "Fortnite",
    background_image: "/assets/images/shop-img-1.jpg",
    rating: 4.3,
    price: 0,
    platforms: ["PC", "PS4", "Xbox One", "Nintendo Switch"],
    genre: "Battle Royale",
    released: "2017-07-25",
    description: "A free-to-play battle royale game developed and published by Epic Games."
  },
  {
    id: 9,
    name: "Final Fantasy XVI",
    background_image: "/assets/images/featured-game-1.jpg",
    rating: 4.6,
    price: 69.99,
    platforms: ["PS5"],
    genre: "RPG",
    released: "2023-06-22",
    description: "A new chapter in the Final Fantasy series featuring epic battles and a compelling story."
  },
  {
    id: 10,
    name: "Call of Duty: Modern Warfare III",
    background_image: "/assets/images/featured-game-2.jpg",
    rating: 4.1,
    price: 69.99,
    platforms: ["PC", "PS5", "Xbox Series X", "PS4", "Xbox One"],
    genre: "FPS",
    released: "2023-11-10",
    description: "The latest installment in the Call of Duty franchise with intense multiplayer action."
  },
  {
    id: 11,
    name: "FIFA 24",
    background_image: "/assets/images/featured-game-3.jpg",
    rating: 4.3,
    price: 59.99,
    platforms: ["PC", "PS5", "Xbox Series X", "PS4", "Xbox One", "Nintendo Switch"],
    genre: "Sports",
    released: "2023-09-29",
    description: "The latest edition of the world's most popular football simulation game."
  },
  {
    id: 12,
    name: "Assassin's Creed Mirage",
    background_image: "/assets/images/featured-game-4.jpg",
    rating: 4.4,
    price: 49.99,
    platforms: ["PC", "PS5", "Xbox Series X", "PS4", "Xbox One"],
    genre: "Action-Adventure",
    released: "2023-10-05",
    description: "Return to the roots of the Assassin's Creed series with this stealth-focused adventure."
  },
  {
    id: 13,
    name: "Baldur's Gate 3",
    background_image: "/assets/images/latest-game-1.jpg",
    rating: 4.9,
    price: 59.99,
    platforms: ["PC", "PS5"],
    genre: "RPG",
    released: "2023-08-03",
    description: "A critically acclaimed role-playing game with deep storytelling and tactical combat."
  },
  {
    id: 14,
    name: "Spider-Man 2",
    background_image: "/assets/images/latest-game-2.jpg",
    rating: 4.7,
    price: 69.99,
    platforms: ["PS5"],
    genre: "Action-Adventure",
    released: "2023-10-20",
    description: "Swing through New York as Spider-Man in this epic superhero adventure."
  },
  {
    id: 15,
    name: "Super Mario Bros. Wonder",
    background_image: "/assets/images/latest-game-3.jpg",
    rating: 4.8,
    price: 59.99,
    platforms: ["Nintendo Switch"],
    genre: "Platformer",
    released: "2023-10-20",
    description: "A new 2D Mario adventure with innovative gameplay mechanics and stunning visuals."
  },
  {
    id: 16,
    name: "Counter-Strike 2",
    background_image: "/assets/images/shop-img-1.jpg",
    rating: 4.5,
    price: 0,
    platforms: ["PC"],
    genre: "FPS",
    released: "2023-09-27",
    description: "The latest evolution of the world's most popular tactical shooter game."
  },
  {
    id: 17,
    name: "Resident Evil 4 Remake",
    background_image: "/assets/images/featured-game-1.jpg",
    rating: 4.7,
    price: 59.99,
    platforms: ["PC", "PS5", "PS4", "Xbox Series X"],
    genre: "Survival Horror",
    released: "2023-03-24",
    description: "A complete remake of the classic survival horror game with modern graphics and gameplay."
  },
  {
    id: 18,
    name: "Street Fighter 6",
    background_image: "/assets/images/featured-game-2.jpg",
    rating: 4.4,
    price: 59.99,
    platforms: ["PC", "PS5", "PS4", "Xbox Series X"],
    genre: "Fighting",
    released: "2023-06-02",
    description: "The latest entry in the legendary fighting game franchise with new mechanics and characters."
  },
  {
    id: 19,
    name: "Diablo IV",
    background_image: "/assets/images/featured-game-3.jpg",
    rating: 4.3,
    price: 69.99,
    platforms: ["PC", "PS5", "PS4", "Xbox Series X", "Xbox One"],
    genre: "Action RPG",
    released: "2023-06-06",
    description: "Return to the world of Sanctuary in this dark action role-playing game."
  },
  {
    id: 20,
    name: "Zelda: Tears of the Kingdom",
    background_image: "/assets/images/featured-game-4.jpg",
    rating: 4.9,
    price: 59.99,
    platforms: ["Nintendo Switch"],
    genre: "Action-Adventure",
    released: "2023-05-12",
    description: "Explore the vast world of Hyrule in this epic adventure with new abilities and challenges."
  }
];

// Note: We now use CheapShark API directly through the cheapsharkApi service

// API functions
export const fetchGames = async (page = 1, pageSize = 60, search = '', genre = [], platform = [], sortBy = 'relevance') => {
  // If API is disabled, use local data directly
  if (!USE_API) {
    console.log('Using local game data (API disabled to avoid CORS issues)');
    return getLocalGames(page, pageSize, search, genre, platform, sortBy);
  }

  try {
    console.log('🎮 Fetching games from CheapShark API...');
    
    // Use CheapShark API for real-time game prices
    const cheapsharkOptions = {
      search: search,
      page: page,
      pageSize: pageSize,
      sortBy: sortBy,
      stores: [], // Can be extended to filter by specific stores
      maxPrice: null, // Can be extended to filter by price range
      minPrice: null,
      steamRating: null,
      metacritic: null,
    };

    const result = await cheapsharkApi.fetchGames(cheapsharkOptions);
    
    console.log(`✅ CheapShark API: Found ${result.count} games`);
    return result;
    
  } catch (error) {
    console.warn('CheapShark API call failed, using local fallback data:', error.message);
    return getLocalGames(page, pageSize, search, genre, platform, sortBy);
  }
};

// Helper function to get local games with filtering and pagination
const getLocalGames = (page = 1, pageSize = 60, search = '', genre = [], platform = [], sortBy = 'relevance') => {
  // Filter fallback data based on search, genre, and platform
  let filteredGames = [...fallbackGames];
  
  // Apply search filter
  if (search) {
    const searchLower = String(search).toLowerCase();
    filteredGames = filteredGames.filter(game => 
      String(game.name || '').toLowerCase().includes(searchLower) ||
      String(game.description || '').toLowerCase().includes(searchLower) ||
      String(game.genre || '').toLowerCase().includes(searchLower)
    );
  }
  
  // Apply genre filter (multiple genres)
  if (genre && genre.length > 0) {
    filteredGames = filteredGames.filter(game => 
      genre.some(g => {
        // Ensure both values are strings before comparing
        const gameGenre = String(game.genre || '').toLowerCase();
        const filterGenre = String(g || '').toLowerCase();
        return gameGenre === filterGenre;
      })
    );
  }
  
  // Apply platform filter (multiple platforms)
  if (platform && platform.length > 0) {
    filteredGames = filteredGames.filter(game => 
      platform.some(p => game.platforms.some(gamePlatform => {
        // Ensure both values are strings before comparing
        const gamePlatformStr = String(gamePlatform || '').toLowerCase();
        const filterPlatform = String(p || '').toLowerCase();
        return gamePlatformStr.includes(filterPlatform);
      }))
    );
  }
  
  // Apply sorting to fallback data
  switch (sortBy) {
    case 'name-asc':
      filteredGames.sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
      break;
    case 'name-desc':
      filteredGames.sort((a, b) => String(b.name || '').localeCompare(String(a.name || '')));
      break;
    case 'price-low':
      filteredGames.sort((a, b) => (a.price || 0) - (b.price || 0));
      break;
    case 'price-high':
      filteredGames.sort((a, b) => (b.price || 0) - (a.price || 0));
      break;
    case 'rating':
      filteredGames.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    default: // relevance - keep original order
      break;
  }
  
  // Apply pagination
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedGames = filteredGames.slice(startIndex, endIndex);
  
  return {
    games: paginatedGames,
    count: filteredGames.length,
    next: endIndex < filteredGames.length ? page + 1 : null,
    previous: page > 1 ? page - 1 : null,
  };
};

export const fetchGameById = async (id) => {
  // If API is disabled, use local data directly
  if (!USE_API) {
    console.log('Using local game data (API disabled to avoid CORS issues)');
    const localGame = fallbackGames.find(game => game.id === parseInt(id));
    if (localGame) {
      return {
        ...localGame,
        website: null,
        metacritic: null,
        screenshots: [localGame.background_image],
      };
    }
    // Return first game if ID not found
    return {
      ...fallbackGames[0],
      website: null,
      metacritic: null,
      screenshots: [fallbackGames[0].background_image],
    };
  }

  try {
    console.log(`🎮 Fetching game details from CheapShark API for ID: ${id}`);
    
    // Use CheapShark API for real-time game details
    const game = await cheapsharkApi.fetchGameById(id);
    
    console.log(`✅ CheapShark API: Found game "${game.name}"`);
    return game;
    
  } catch (error) {
    console.warn('CheapShark API call failed, using local fallback data:', error.message);
    // Return fallback game if API fails
    const localGame = fallbackGames.find(game => game.id === parseInt(id));
    if (localGame) {
      return {
        ...localGame,
        website: null,
        metacritic: null,
        screenshots: [localGame.background_image],
      };
    }
    return {
      ...fallbackGames[0],
      website: null,
      metacritic: null,
      screenshots: [fallbackGames[0].background_image],
    };
  }
};

export const fetchGenres = async () => {
  // If API is disabled, use local data directly
  if (!USE_API) {
    console.log('Using local genre data (API disabled to avoid CORS issues)');
    return [
      { id: 1, name: 'Action' },
      { id: 2, name: 'Adventure' },
      { id: 3, name: 'RPG' },
      { id: 4, name: 'Action RPG' },
      { id: 5, name: 'Action-Adventure' },
      { id: 6, name: 'Strategy' },
      { id: 7, name: 'Sports' },
      { id: 8, name: 'Racing' },
      { id: 9, name: 'Puzzle' },
      { id: 10, name: 'Indie' },
      { id: 11, name: 'Sandbox' },
      { id: 12, name: 'Battle Royale' },
      { id: 13, name: 'FPS' },
      { id: 14, name: 'Platformer' },
      { id: 15, name: 'Survival Horror' },
      { id: 16, name: 'Fighting' },
    ];
  }

  try {
    // Since we're using local data by default, this won't execute
    // but keeping the structure for future API integration
    console.log('API call attempted but using local data instead');
    throw new Error('API disabled - using local data');
  } catch (error) {
    console.warn('API call failed, using local fallback genres:', error.message);
    return [
      { id: 1, name: 'Action' },
      { id: 2, name: 'Adventure' },
      { id: 3, name: 'RPG' },
      { id: 4, name: 'Action RPG' },
      { id: 5, name: 'Action-Adventure' },
      { id: 6, name: 'Strategy' },
      { id: 7, name: 'Sports' },
      { id: 8, name: 'Racing' },
      { id: 9, name: 'Puzzle' },
      { id: 10, name: 'Indie' },
      { id: 11, name: 'Sandbox' },
      { id: 12, name: 'Battle Royale' },
      { id: 13, name: 'FPS' },
      { id: 14, name: 'Platformer' },
      { id: 15, name: 'Survival Horror' },
      { id: 16, name: 'Fighting' },
    ];
  }
};

export const fetchPlatforms = async () => {
  // If API is disabled, use local data directly
  if (!USE_API) {
    console.log('Using local platform data (API disabled to avoid CORS issues)');
    return [
      { id: 1, name: 'PC' },
      { id: 2, name: 'PlayStation 5' },
      { id: 3, name: 'Xbox Series X' },
      { id: 4, name: 'Nintendo Switch' },
      { id: 5, name: 'PlayStation 4' },
      { id: 6, name: 'Xbox One' },
    ];
  }

  try {
    // Since we're using local data by default, this won't execute
    // but keeping the structure for future API integration
    console.log('API call attempted but using local data instead');
    throw new Error('API disabled - using local data');
  } catch (error) {
    console.warn('API call failed, using local fallback platforms:', error.message);
    return [
      { id: 1, name: 'PC' },
      { id: 2, name: 'PlayStation 5' },
      { id: 3, name: 'Xbox Series X' },
      { id: 4, name: 'Nintendo Switch' },
      { id: 5, name: 'PlayStation 4' },
      { id: 6, name: 'Xbox One' },
    ];
  }
};

// Log current configuration on service load
console.log(`🎮 GAMING STORE API Service loaded:`);
console.log(`   - API Enabled: ${USE_API ? '✅ Yes' : '❌ No (using local data)'}`);
console.log(`   - CORS Issues: ${USE_API ? '✅ Avoided (CheapShark)' : '✅ Avoided'}`);
console.log(`   - Data Source: ${USE_API ? 'CheapShark API (Real-time prices)' : 'Local Fallback Data'}`);
console.log(`   - Games Available: ${fallbackGames.length} high-quality games (fallback)`);
console.log(`   - Features: Search, Filter, Sort, Pagination, Real-time prices, Store comparison`);
console.log(`   - CheapShark Benefits: No API key, No CORS, Real-time deals, Multiple stores`);
