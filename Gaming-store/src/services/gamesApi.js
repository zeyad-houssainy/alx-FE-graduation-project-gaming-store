import axios from 'axios';

// Using RAWG API for gaming data (free tier available)
const API_BASE_URL = 'https://api.rawg.io/api';
const API_KEY = 'd6c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0'; // This is a placeholder key

// Fallback data in case API fails
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
    platforms: ["PC", "PS4", "Xbox One", "Nintendo Switch", "Mobile"],
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
    platforms: ["PC", "PS4", "Xbox One", "Nintendo Switch", "Mobile"],
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
  }
];

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// API functions
export const fetchGames = async (page = 1, pageSize = 20, search = '', genre = '', platform = '') => {
  try {
    const params = {
      key: API_KEY,
      page,
      page_size: pageSize,
      ordering: '-rating',
    };

    if (search) params.search = search;
    if (genre) params.genres = genre;
    if (platform) params.platforms = platform;

    const response = await api.get('/games', { params });
    
    // Transform API data to match our structure
    const transformedGames = response.data.results.map(game => ({
      id: game.id,
      name: game.name,
      background_image: game.background_image || game.background_image_additional || '/assets/images/placeholder.jpg',
      rating: game.rating,
      price: Math.floor(Math.random() * 70) + 19.99, // Random price for demo
      platforms: game.platforms?.map(p => p.platform.name) || ['PC'],
      genre: game.genres?.[0]?.name || 'Action',
      released: game.released,
      description: game.description || 'No description available.',
    }));

    return {
      games: transformedGames,
      count: response.data.count,
      next: response.data.next,
      previous: response.data.previous,
    };
  } catch (error) {
    console.warn('API call failed, using fallback data:', error.message);
    
    // Filter fallback data based on search, genre, and platform
    let filteredGames = [...fallbackGames];
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredGames = filteredGames.filter(game => 
        game.name.toLowerCase().includes(searchLower) ||
        game.description.toLowerCase().includes(searchLower) ||
        game.genre.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply genre filter
    if (genre) {
      filteredGames = filteredGames.filter(game => 
        game.genre.toLowerCase() === genre.toLowerCase()
      );
    }
    
    // Apply platform filter
    if (platform) {
      filteredGames = filteredGames.filter(game => 
        game.platforms.some(p => p.toLowerCase().includes(platform.toLowerCase()))
      );
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
  }
};

export const fetchGameById = async (id) => {
  try {
    const response = await api.get(`/games/${id}`, {
      params: { key: API_KEY }
    });

    const game = response.data;
    return {
      id: game.id,
      name: game.name,
      background_image: game.background_image || game.background_image_additional || '/assets/images/placeholder.jpg',
      rating: game.rating,
      price: Math.floor(Math.random() * 70) + 19.99,
      platforms: game.platforms?.map(p => p.platform.name) || ['PC'],
      genre: game.genres?.[0]?.name || 'Action',
      released: game.released,
      description: game.description || 'No description available.',
      website: game.website,
      metacritic: game.metacritic,
      screenshots: game.short_screenshots?.map(s => s.image) || [],
    };
  } catch (error) {
    console.warn('API call failed, using fallback data:', error.message);
    // Return fallback game if API fails
    return fallbackGames.find(game => game.id === parseInt(id)) || fallbackGames[0];
  }
};

export const fetchGenres = async () => {
  try {
    const response = await api.get('/genres', {
      params: { key: API_KEY }
    });
    return response.data.results;
  } catch (error) {
    console.warn('API call failed, using fallback genres:', error.message);
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
    ];
  }
};

export const fetchPlatforms = async () => {
  try {
    const response = await api.get('/platforms', {
      params: { key: API_KEY }
    });
    return response.data.results;
  } catch (error) {
    console.warn('API call failed, using fallback platforms:', error.message);
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
