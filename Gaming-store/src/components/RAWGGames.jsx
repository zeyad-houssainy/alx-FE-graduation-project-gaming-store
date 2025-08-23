import React, { useState, useEffect } from 'react';
import { fetchGamesWithFilters, testRAWGConnectivity, fetchPlatforms, fetchGenres } from '../services/rawgApi';
import GameCard from './GameCard';

export default function RAWGGames({ searchTerm = '', selectedGenre = [], selectedPlatform = [], sortBy = 'relevance' }) {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadGames();
  }, [searchTerm, selectedGenre, selectedPlatform, sortBy]);

  // Filter and sort games when props change
  useEffect(() => {
    if (games.length > 0) {
      let filtered = [...games];

      // Apply search term filter
      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase();
        filtered = filtered.filter(game => 
          game.name.toLowerCase().includes(searchLower) ||
          (game.description && game.description.toLowerCase().includes(searchLower)) ||
          (game.genres && game.genres.some(genre => 
            genre.name && genre.name.toLowerCase().includes(searchLower)
          ))
        );
      }

      // Apply genre filter
      if (selectedGenre.length > 0) {
        filtered = filtered.filter(game => 
          game.genres && game.genres.some(genre => 
            selectedGenre.some(selected => 
              genre.name && genre.name.toLowerCase().includes(selected.toLowerCase())
            )
          )
        );
      }

      // Apply platform filter
      if (selectedPlatform.length > 0) {
        filtered = filtered.filter(game => 
          game.platforms && game.platforms.some(platform => 
            selectedPlatform.some(selected => 
              platform.platform && platform.platform.name && 
              platform.platform.name.toLowerCase().includes(selected.toLowerCase())
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
        case 'rating':
          filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case 'released':
          filtered.sort((a, b) => new Date(b.released || 0) - new Date(a.released || 0));
          break;
        default: // 'relevance' - keep original order
          break;
      }

      setFilteredGames(filtered);
    }
  }, [games, searchTerm, selectedGenre, selectedPlatform, sortBy]);

  const loadGames = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🎮 Loading games from RAWG API with filters:', { selectedGenre, selectedPlatform, searchTerm, sortBy });
      
      const result = await fetchGamesWithFilters({
        search: searchTerm,
        page: 1,
        pageSize: 30, // Load more games for variety
        sortBy: sortBy,
        selectedGenre: selectedGenre,
        selectedPlatform: selectedPlatform
      });
      
      console.log('📊 RAWG result:', result);
      
      if (result && result.games) {
        setGames(result.games);
        console.log(`✅ Loaded ${result.games.length} games from RAWG with filters`);
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
      {/* RAWG Games Store Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg">
          <span className="text-2xl">🎮</span>
          <h2 className="text-xl font-bold">RAWG Games Store</h2>
          <span className="text-2xl">🎮</span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
          All platforms - from PC to consoles, mobile to handheld
        </p>
      </div>

      {/* Results Info */}
      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredGames.length} out of {games.length} games
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
          <div className="text-6xl mb-4">🎮</div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">No games found</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 px-4">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
}
