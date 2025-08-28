import React, { useState, useEffect } from 'react';
import { fetchGames } from '../services/cheapsharkApi';
import GameCard from './GameCard';

export default function CheapSharkGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load some popular games by default since CheapShark needs a search term
    loadGames('popular');
  }, []);

  const loadGames = async (search = '') => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🎮 Loading games from CheapShark...');
      
      const result = await fetchGames({
        search: search,
        page: 1,
        pageSize: 12,
        sortBy: 'relevance'
      });
      
      console.log('📊 CheapShark result:', result);
      
      if (result && result.games) {
        setGames(result.games);
        console.log(`✅ Loaded ${result.games.length} games from CheapShark`);
      } else {
        throw new Error('Invalid response format from CheapShark');
      }
      
    } catch (err) {
      console.error('❌ Failed to load games from CheapShark:', err);
      setError(err.message);
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('CheapSharkGames: Search submitted for:', searchTerm);
    if (searchTerm.trim()) {
      loadGames(searchTerm.trim());
    } else {
      console.log('CheapSharkGames: Empty search term, ignoring');
    }
  };

  const loadPopularGames = () => {
    loadGames('popular');
    setSearchTerm('');
  };

  const loadActionGames = () => {
    loadGames('action');
    setSearchTerm('');
  };

  const loadRPGames = () => {
    loadGames('rpg');
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading games from CheapShark...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
          ❌ Failed to Load Games
        </h3>
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <button
          onClick={() => loadPopularGames()}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Search Buttons */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">
          🚀 Quick Search
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={loadPopularGames}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
          >
            Popular Games
          </button>
          <button
            onClick={loadActionGames}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
          >
            Action Games
          </button>
          <button
            onClick={loadRPGames}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
          >
            RPG Games
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search games on CheapShark..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
          >
            Search
          </button>
        </form>
      </div>

      {/* Results Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
          🎮 CheapShark Games
        </h3>
        <p className="text-blue-600 dark:text-blue-300">
          Found {games.length} games with real-time pricing from multiple stores
        </p>
      </div>

      {/* Games Grid */}
      {games.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎮</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Games Found
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Try using the quick search buttons above or search for a specific game.
          </p>
          <button
            onClick={loadPopularGames}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            Load Popular Games
          </button>
        </div>
      )}

      {/* Debug Info */}
      <details className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <summary className="text-lg font-semibold text-gray-900 dark:text-white cursor-pointer">
          🔍 Debug Information
        </summary>
        <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
          <p><strong>Total Games:</strong> {games.length}</p>
          <p><strong>Search Term:</strong> {searchTerm || 'None'}</p>
          <p><strong>API Status:</strong> {error ? 'Failed' : 'Success'}</p>
          <div className="mt-2">
            <strong>Sample Game Data:</strong>
            {games.length > 0 && (
              <pre className="mt-1 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto max-h-32">
                {JSON.stringify(games[0], null, 2)}
              </pre>
            )}
          </div>
        </div>
      </details>
    </div>
  );
}
