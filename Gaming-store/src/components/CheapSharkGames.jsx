import React, { useState, useEffect } from 'react';
import { fetchGames, searchGames } from '../services/cheapsharkApi';
import GameCard from './GameCard';
import Loader from './Loader';

export default function CheapSharkGames({ searchTerm = '', selectedGenre = [], selectedPlatform = [], sortBy = 'relevance' }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    loadGames();
  }, [searchTerm, selectedGenre, selectedPlatform, sortBy]);

  const loadGames = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('💰 Loading games from CheapShark with filters:', { 
        searchTerm, 
        selectedGenre, 
        selectedPlatform, 
        sortBy 
      });
      
      let result;
      
      if (searchTerm && searchTerm.trim()) {
        // Use search API when search term is provided
        console.log('🔍 CheapShark: Searching for games with term:', searchTerm);
        result = await searchGames(searchTerm, { limit: 30 });
      } else {
        // Load popular games when no search term
        console.log('🔥 CheapShark: Loading popular games');
        result = await fetchGames({
          search: '',
          page: 1,
          pageSize: 30,
          sortBy: 'relevance'
        });
      }
      
      console.log('📊 CheapShark result:', result);
      
      if (result && result.games) {
        let processedGames = result.games;
        
        // Apply genre filtering (CheapShark has limited genre info, so we'll do basic text matching)
        if (selectedGenre.length > 0) {
          processedGames = processedGames.filter(game => {
            // Try to match genre from game title, description, or other available fields
            const gameText = `${game.title || ''} ${game.external || ''} ${game.description || ''}`.toLowerCase();
            return selectedGenre.some(genre => 
              gameText.includes(genre.toLowerCase())
            );
          });
        }
        
        // Apply platform filtering (CheapShark has limited platform info)
        if (selectedPlatform.length > 0) {
          processedGames = processedGames.filter(game => {
            // CheapShark primarily deals with PC games, but we can check for platform hints
            const gameText = `${game.title || ''} ${game.external || ''} ${game.description || ''}`.toLowerCase();
            return selectedPlatform.some(platform => {
              const platformLower = platform.toLowerCase();
              // Check for common platform indicators
              if (platformLower.includes('pc') || platformLower.includes('computer')) {
                return true; // CheapShark is primarily PC-focused
              }
              if (platformLower.includes('steam')) {
                return game.steamAppID; // Check if game has Steam ID
              }
              return gameText.includes(platformLower);
            });
          });
        }
        
        // Apply sorting
        switch (sortBy) {
          case 'name-asc':
            processedGames.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
            break;
          case 'name-desc':
            processedGames.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
            break;
          case 'price-low':
            processedGames.sort((a, b) => (a.cheapestPrice || 0) - (b.cheapestPrice || 0));
            break;
          case 'price-high':
            processedGames.sort((a, b) => (b.cheapestPrice || 0) - (a.cheapestPrice || 0));
            break;
          case 'rating':
            processedGames.sort((a, b) => (b.steamRating || 0) - (a.steamRating || 0));
            break;
          case 'released':
            // CheapShark doesn't have release dates, so we'll sort by relevance
            break;
          default: // 'relevance' - keep original order
            break;
        }
        
        setGames(processedGames);
        setTotalResults(processedGames.length);
        console.log(`✅ Loaded ${processedGames.length} games from CheapShark with filters`);
      } else {
        throw new Error('Invalid response format from CheapShark');
      }
      
    } catch (err) {
      console.error('❌ Failed to load games from CheapShark:', err);
      setError(err.message);
      setGames([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <Loader />
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              Loading games from CheapShark...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <div className="text-6xl mb-4">😞</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Failed to load CheapShark games
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
            <button
              onClick={loadGames}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (games.length === 0) {
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
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg transition-colors duration-200"
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
            💰 CheapShark Games
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Found {totalResults} games
            {searchTerm && ` matching "${searchTerm}"`}
            {selectedGenre.length > 0 && ` in ${selectedGenre.join(', ')}`}
            {selectedPlatform.length > 0 && ` for ${selectedPlatform.join(', ')}`}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Best prices from 20+ online stores
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </div>
  );
}
