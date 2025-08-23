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

  // Filter and sort games based on search parameters
  const filteredGames = useMemo(() => {
    let filtered = [...mockGames];

    // Apply search term filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(game => 
        game.name.toLowerCase().includes(searchLower) ||
        game.description.toLowerCase().includes(searchLower) ||
        game.genre.toLowerCase().includes(searchLower) ||
        game.developers.some(dev => dev.toLowerCase().includes(searchLower)) ||
        game.publishers.some(pub => pub.toLowerCase().includes(searchLower))
      );
    }

    // Apply genre filter
    if (selectedGenre.length > 0) {
      filtered = filtered.filter(game => 
        selectedGenre.some(genre => 
          game.genre.toLowerCase().includes(genre.toLowerCase())
        )
      );
    }

    // Apply platform filter
    if (selectedPlatform.length > 0) {
      filtered = filtered.filter(game => 
        selectedPlatform.some(platform => 
          game.platforms.some(gamePlatform => 
            gamePlatform.toLowerCase().includes(platform.toLowerCase())
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
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default: // 'relevance' - keep original order
        break;
    }

    return filtered;
  }, [searchTerm, selectedGenre, selectedPlatform, sortBy]);



  return (
    <div className="space-y-6">


      {/* Games Grid */}
      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎮</div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">No games found</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 px-4">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
        </div>
      )}

      {/* Results Info */}
      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredGames.length} out of {mockGames.length} games
      </div>
    </div>
  );
}
