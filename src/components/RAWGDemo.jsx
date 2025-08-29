import React from 'react';
import GameCard from './GameCard';
import Header from './Header/Header';
import Footer from './Footer/Footer';

export default function RAWGDemo() {
  // Sample games data to showcase the new design
  const demoGames = [
    {
      id: 'demo-1',
      name: 'Vampire: The Masquerade - Bloodlines 2',
      background_image: '/assets/images/featured-game-1.jpg',
      rating: 4.2,
      price: 59.99,
      platforms: ['PC', 'PlayStation 5'],
      genres: ['RPG', 'Action', 'Vampire'],
      released: '2025-06-13',
      metacritic: 87,
      developers: ['Hardsuit Labs'],
      short_screenshots: [
        '/assets/images/featured-game-1.jpg',
        '/assets/images/featured-game-2.jpg',
        '/assets/images/featured-game-3.jpg'
      ]
    },
    {
      id: 'demo-2',
      name: 'Death Stranding 2: On The Beach',
      background_image: '/assets/images/featured-game-2.jpg',
      rating: 4.5,
      price: 69.99,
      platforms: ['PlayStation 5'],
      genres: ['Action', 'Adventure', 'Sci-Fi'],
      released: '2025-12-31',
      metacritic: 92,
      developers: ['Kojima Productions'],
      short_screenshots: [
        '/assets/images/featured-game-2.jpg',
        '/assets/images/featured-game-1.jpg',
        '/assets/images/featured-game-3.jpg'
      ]
    },
    {
      id: 'demo-3',
      name: 'Hollow Knight: Silksong',
      background_image: '/assets/images/featured-game-3.jpg',
      rating: 4.8,
      price: 29.99,
      platforms: ['PC', 'Xbox Series X', 'Nintendo Switch'],
      genres: ['Metroidvania', 'Action', 'Adventure'],
      released: '2025-03-15',
      metacritic: 95,
      developers: ['Team Cherry'],
      short_screenshots: [
        '/assets/images/featured-game-3.jpg',
        '/assets/images/featured-game-1.jpg',
        '/assets/images/featured-game-2.jpg'
      ]
    },
    {
      id: 'demo-4',
      name: 'The Alters',
      background_image: '/assets/images/featured-game-4.jpg',
      rating: 4.1,
      price: 49.99,
      platforms: ['PC', 'Xbox Series X'],
      genres: ['Adventure', 'Survival', 'Sci-Fi'],
      released: '2025-06-13',
      metacritic: 78,
      developers: ['11 bit studios'],
      short_screenshots: [
        '/assets/images/featured-game-4.jpg',
        '/assets/images/featured-game-1.jpg',
        '/assets/images/featured-game-2.jpg'
      ]
    }
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="container mx-auto px-6 py-12">
        {/* RAWG-style Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                New and trending
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Based on player counts and release date
              </p>
            </div>
            
            {/* Display Options */}
            <div className="flex items-center gap-4 mt-4 lg:mt-0">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Order by:</span>
                <select className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500">
                  <option value="relevance">Relevance</option>
                  <option value="rating">Rating</option>
                  <option value="released">Release Date</option>
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="metacritic">Metacritic</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Display options:</span>
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button className="p-2 rounded bg-white dark:bg-gray-800 shadow-sm">
                    <svg className="w-4 h-4 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                    </svg>
                  </button>
                  <button className="p-2 rounded text-gray-400 dark:text-gray-500">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Import Games Banner */}
          <div className="bg-gradient-to-r from-pink-500 to-red-500 rounded-xl p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="text-white mb-4 lg:mb-0">
                <h3 className="text-lg font-semibold mb-2">
                  Jump-start your library with games from Steam, PlayStation, Xbox or GOG
                </h3>
                <p className="text-pink-100 text-sm">
                  The more complete your profile is, the better it shows your interests.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm">Steam</span>
                  <span className="text-white text-sm">Xbox</span>
                  <span className="text-white text-sm">PlayStation</span>
                </div>
                <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Import games
                </button>
                <button className="text-white/80 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {demoGames.map((game) => (
            <div key={game.id} className="flex justify-center">
              <GameCard 
                game={game} 
                activeFilters={{}} 
              />
            </div>
          ))}
        </div>

        {/* Features Showcase */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            RAWG-style Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Platform Icons</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Beautiful platform icons for PC, PlayStation, Xbox, and Nintendo with color coding
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="text-4xl mb-4">🖼️</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Image Carousel</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Hover over games to see multiple screenshots with interactive dot navigation
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Hover Expansion</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Cards expand on hover showing additional game details and information
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </>
  );
}

