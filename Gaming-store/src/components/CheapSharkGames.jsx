import React, { useState, useEffect } from 'react';
import { fetchGames } from '../services/cheapsharkApi';
import GameCard from './GameCard';

export default function CheapSharkGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load all games by default to show maximum variety
    loadAllGames();
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

  const loadAllGames = () => {
    // Load games with a broad search to get more variety
    loadGames('game');
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
          onClick={loadAllGames}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">


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
            onClick={loadAllGames}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            🎮 Load All Games
          </button>
        </div>
      )}


    </div>
  );
}
