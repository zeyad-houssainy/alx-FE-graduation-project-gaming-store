import React, { useState, useEffect, useMemo } from 'react';
import GameCard from './GameCard';

export default function MockStore({ searchTerm = '', selectedGenre = [], selectedPlatform = [], sortBy = 'relevance' }) {

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
      genres: ['RPG', 'Action', 'Open World'],
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
      genres: ['Action RPG', 'Souls-like', 'Open World'],
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
      genres: ['Action-Adventure', 'Hack and Slash', 'Mythology'],
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
      genres: ['Action-Adventure', 'Western', 'Open World'],
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
      genres: ['RPG', 'Action', 'Fantasy'],
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
      genres: ['Action-Adventure', 'Open World', 'Crime'],
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
      rating: 4.7,
      price: 26.95,
      originalPrice: 26.95,
      cheapestPrice: 26.95,
      platforms: ['PC', 'PlayStation 4', 'Xbox One', 'Nintendo Switch', 'Mobile'],
      genre: 'Sandbox',
      genres: ['Sandbox', 'Survival', 'Creative'],
      released: '2011-11-18',
      description: 'A 3D sandbox game with no specific goals to accomplish.',
      metacritic: 93,
      developers: ['Mojang Studios'],
      publishers: ['Mojang Studios'],
    },
    {
      id: 'mock-8',
      name: 'Fortnite',
      background_image: '/assets/images/latest-game-4.jpg',
      rating: 4.3,
      price: 0,
      originalPrice: 0,
      cheapestPrice: 0,
      platforms: ['PC', 'PlayStation 4', 'PlayStation 5', 'Xbox One', 'Xbox Series X', 'Nintendo Switch', 'Mobile'],
      genre: 'Battle Royale',
      genres: ['Battle Royale', 'Shooter', 'Free-to-Play'],
      released: '2017-07-25',
      description: 'A free-to-play battle royale game with building mechanics.',
      metacritic: 81,
      developers: ['Epic Games'],
      publishers: ['Epic Games'],
    }
  ];

  // Filter and sort games based on props
  const filteredAndSortedGames = useMemo(() => {
    let filtered = [...mockGames];

    // Apply search term filter
    if (searchTerm && searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(game => 
        game.name.toLowerCase().includes(searchLower) ||
        (game.description && game.description.toLowerCase().includes(searchLower)) ||
        (game.genres && game.genres.some(genre => 
          genre.toLowerCase().includes(searchLower)
        )) ||
        (game.developers && game.developers.some(dev => 
          dev.toLowerCase().includes(searchLower)
        )) ||
        (game.publishers && game.publishers.some(pub => 
          pub.toLowerCase().includes(searchLower)
        ))
      );
    }

    // Apply genre filter
    if (selectedGenre.length > 0) {
      filtered = filtered.filter(game => 
        game.genres && game.genres.some(genre => 
          selectedGenre.some(selected => 
            genre.toLowerCase().includes(selected.toLowerCase())
          )
        )
      );
    }

    // Apply platform filter
    if (selectedPlatform.length > 0) {
      filtered = filtered.filter(game => 
        game.platforms && game.platforms.some(platform => 
          selectedPlatform.some(selected => 
            platform.toLowerCase().includes(selected.toLowerCase())
          )
        )
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'released':
        filtered.sort((a, b) => new Date(b.released || 0) - new Date(a.released || 0));
        break;
      default: // 'relevance' - keep original order
        break;
    }

    return filtered;
  }, [searchTerm, selectedGenre, selectedPlatform, sortBy]);

  if (filteredAndSortedGames.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              No games found
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {searchTerm || selectedGenre.length > 0 || selectedPlatform.length > 0
                ? 'Try adjusting your search terms or filters'
                : 'No games available at the moment'
              }
            </p>
            {(searchTerm || selectedGenre.length > 0 || selectedPlatform.length > 0) && (
              <button
                onClick={() => window.location.reload()}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-lg transition-colors duration-200"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="container mx-auto px-6 py-12">
        {/* Results Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            🎯 Mock Store Games
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Found {filteredAndSortedGames.length} games
            {searchTerm && ` matching "${searchTerm}"`}
            {selectedGenre.length > 0 && ` in ${selectedGenre.join(', ')}`}
            {selectedPlatform.length > 0 && ` for ${selectedPlatform.join(', ')}`}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Curated selection of popular games (instant access)
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </div>
  );
}
