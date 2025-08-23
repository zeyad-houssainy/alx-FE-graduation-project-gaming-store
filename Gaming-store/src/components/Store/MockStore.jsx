import React, { useState, useEffect } from 'react';
import GameCard from './GameCard';

export default function MockStore() {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  // Mock game data
  const mockGames = [
    {
      id: 'mock-1',
      name: 'Cyberpunk 2077',
      background_image: '/assets/images/featured-game-1.jpg',
      rating: 4.2,
      price: 59.99,
      originalPrice: 59.99,
      cheapestPrice: 59.99,
      platforms: ['PC', 'PlayStation 4', 'Xbox One'],
      genre: 'RPG',
      released: '2020-12-10',
      description: 'An open-world action-adventure story set in Night City.',
      metacritic: 87,
      developers: ['CD Projekt Red'],
      publishers: ['CD Projekt'],
    },
    {
      id: 'mock-2',
      name: 'Elden Ring',
      background_image: '/assets/images/featured-game-2.jpg',
      rating: 4.8,
      price: 69.99,
      originalPrice: 69.99,
      cheapestPrice: 69.99,
      platforms: ['PC', 'PlayStation 4', 'PlayStation 5', 'Xbox One', 'Xbox Series X'],
      genre: 'Action RPG',
      released: '2022-02-25',
      description: 'An action role-playing game developed by FromSoftware.',
      metacritic: 96,
      developers: ['FromSoftware'],
      publishers: ['Bandai Namco Entertainment'],
    },
    {
      id: 'mock-3',
      name: 'God of War Ragnarök',
      background_image: '/assets/images/featured-game-3.jpg',
      rating: 4.7,
      price: 69.99,
      originalPrice: 69.99,
      cheapestPrice: 69.99,
      platforms: ['PlayStation 4', 'PlayStation 5'],
      genre: 'Action-Adventure',
      released: '2022-11-09',
      description: 'An action-adventure game developed by Santa Monica Studio.',
      metacritic: 94,
      developers: ['Santa Monica Studio'],
      publishers: ['Sony Interactive Entertainment'],
    },
    {
      id: 'mock-4',
      name: 'Red Dead Redemption 2',
      background_image: '/assets/images/featured-game-4.jpg',
      rating: 4.6,
      price: 49.99,
      originalPrice: 49.99,
      cheapestPrice: 49.99,
      platforms: ['PC', 'PlayStation 4', 'Xbox One'],
      genre: 'Action-Adventure',
      released: '2018-10-26',
      description: 'An action-adventure game developed and published by Rockstar Games.',
      metacritic: 93,
      developers: ['Rockstar Games'],
      publishers: ['Rockstar Games'],
    },
    {
      id: 'mock-5',
      name: 'The Witcher 3: Wild Hunt',
      background_image: '/assets/images/latest-game-1.jpg',
      rating: 4.9,
      price: 39.99,
      originalPrice: 39.99,
      cheapestPrice: 39.99,
      platforms: ['PC', 'PlayStation 4', 'Xbox One', 'Nintendo Switch'],
      genre: 'RPG',
      released: '2015-05-19',
      description: 'An action role-playing game with a third-person perspective.',
      metacritic: 93,
      developers: ['CD Projekt Red'],
      publishers: ['CD Projekt'],
    },
    {
      id: 'mock-6',
      name: 'Grand Theft Auto V',
      background_image: '/assets/images/latest-game-2.jpg',
      rating: 4.5,
      price: 29.99,
      originalPrice: 29.99,
      cheapestPrice: 29.99,
      platforms: ['PC', 'PlayStation 4', 'PlayStation 5', 'Xbox One', 'Xbox Series X'],
      genre: 'Action-Adventure',
      released: '2013-09-17',
      description: 'An action-adventure game developed by Rockstar North.',
      metacritic: 96,
      developers: ['Rockstar North'],
      publishers: ['Rockstar Games'],
    },
    {
      id: 'mock-7',
      name: 'Minecraft',
      background_image: '/assets/images/latest-game-3.jpg',
      rating: 4.8,
      price: 26.95,
      originalPrice: 26.95,
      cheapestPrice: 26.95,
      platforms: ['PC', 'PlayStation 4', 'Xbox One', 'Nintendo Switch', 'Mobile'],
      genre: 'Sandbox',
      released: '2011-11-18',
      description: 'A 3D sandbox game that has no specific goals to accomplish.',
      metacritic: 93,
      developers: ['Mojang Studios'],
      publishers: ['Mojang Studios'],
    },
    {
      id: 'mock-8',
      name: 'Fortnite',
      background_image: '/assets/images/shop-img-1.jpg',
      rating: 4.3,
      price: 0,
      originalPrice: 0,
      cheapestPrice: 0,
      platforms: ['PC', 'PlayStation 4', 'PlayStation 5', 'Xbox One', 'Xbox Series X', 'Nintendo Switch', 'Mobile'],
      genre: 'Battle Royale',
      released: '2017-07-25',
      description: 'A free-to-play battle royale game with building mechanics.',
      metacritic: 78,
      developers: ['Epic Games'],
      publishers: ['Epic Games'],
    }
  ];

  // Available genres and platforms for filtering
  const genres = ['All', 'RPG', 'Action RPG', 'Action-Adventure', 'Sandbox', 'Battle Royale'];
  const platforms = ['All', 'PC', 'PlayStation 4', 'PlayStation 5', 'Xbox One', 'Xbox Series X', 'Nintendo Switch', 'Mobile'];

  useEffect(() => {
    setGames(mockGames);
    setFilteredGames(mockGames);
  }, []);

  useEffect(() => {
    filterAndSortGames();
  }, [searchTerm, selectedGenre, selectedPlatform, sortBy]);

  const filterAndSortGames = () => {
    let filtered = [...mockGames];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(game =>
        game.name.toLowerCase().includes(searchLower) ||
        game.description.toLowerCase().includes(searchLower) ||
        game.genre.toLowerCase().includes(searchLower)
      );
    }

    // Apply genre filter
    if (selectedGenre && selectedGenre !== 'All') {
      filtered = filtered.filter(game => game.genre === selectedGenre);
    }

    // Apply platform filter
    if (selectedPlatform && selectedPlatform !== 'All') {
      filtered = filtered.filter(game => game.platforms.includes(selectedPlatform));
    }

    // Apply sorting
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'released':
        filtered.sort((a, b) => new Date(b.released) - new Date(a.released));
        break;
      default:
        break;
    }

    setFilteredGames(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedGenre('All');
    setSelectedPlatform('All');
    setSortBy('rating');
  };

  return (
    <div className="space-y-6">
      {/* Store Header */}
      <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-purple-800 dark:text-purple-200 mb-2">
            🎯 Mock Store
          </h2>
          <p className="text-purple-600 dark:text-purple-300">
            Local game data with curated selection - Always available, fast loading
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <form className="space-y-4">
          {/* Search Bar */}
          <div className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search games in Mock Store..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              type="button"
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-200"
            >
              Clear
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {/* Genre Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Genre
              </label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            {/* Platform Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Platform
              </label>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {platforms.map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="rating">Rating (High to Low)</option>
                <option value="price-low">Price (Low to High)</option>
                <option value="price-high">Price (High to Low)</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="released">Release Date (Newest)</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-end">
              <div className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">{filteredGames.length}</span> of {mockGames.length} games
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Results Info */}
      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-2">
          🎯 Mock Store Games
        </h3>
        <p className="text-purple-600 dark:text-purple-300">
          Found {filteredGames.length} games from local curated collection
        </p>
      </div>

      {/* Games Grid */}
      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Games Found
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Try adjusting your search terms or filters.
          </p>
          <button
            onClick={clearFilters}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            Show All Games
          </button>
        </div>
      )}

      {/* Store Features */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
          ✨ Mock Store Features
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-2">⚡</div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Instant Loading</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No API calls, no waiting. Games load instantly from local storage.
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-3xl mb-2">🔒</div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Always Available</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Works offline, no internet connection required. Perfect for testing and development.
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-3xl mb-2">🎨</div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Curated Content</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Hand-picked selection of popular games with high-quality metadata and images.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
