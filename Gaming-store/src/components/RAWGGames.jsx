import React, { useState, useEffect } from 'react';
import { fetchGames, testRAWGConnectivity, fetchPlatforms, fetchGenres } from '../services/rawgApi';
import GameCard from './GameCard';

export default function RAWGGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🎮 Loading games from RAWG API...');
      
      const result = await fetchGames({
        search: '',
        page: 1,
        pageSize: 12,
        ordering: '-rating',
        platforms: [],
        genres: []
      });
      
      console.log('📊 RAWG result:', result);
      
      if (result && result.games) {
        setGames(result.games);
        console.log(`✅ Loaded ${result.games.length} games from RAWG`);
      } else {
        throw new Error('Invalid response format from RAWG API');
      }
      
    } catch (err) {
      console.error('❌ Failed to load games from RAWG:', err);
      setError(err.message);
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading games from RAWG API...</p>
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
          onClick={() => loadGames()}
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
      <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>


    </div>
  );
}
