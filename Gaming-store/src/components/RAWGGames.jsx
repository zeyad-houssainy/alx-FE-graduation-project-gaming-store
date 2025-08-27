import React, { useState, useEffect } from 'react';
import { fetchGamesWithFilters, testRAWGConnectivity, fetchPlatforms, fetchGenres } from '../services/rawgApi';
import GameCard from './GameCard';
import Loader from './Loader';

export default function RAWGGames({ searchTerm = '', selectedGenre = [], selectedPlatform = [], sortBy = 'relevance' }) {
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
      
      console.log('🎮 Loading games from RAWG API with filters:', { 
        searchTerm, 
        selectedGenre, 
        selectedPlatform, 
        sortBy 
      });
      
      // Convert sortBy to RAWG API format
      let rawgSortBy = 'relevance';
      switch (sortBy) {
        case 'name-asc':
          rawgSortBy = 'name';
          break;
        case 'name-desc':
          rawgSortBy = '-name';
          break;
        case 'rating':
          rawgSortBy = '-rating';
          break;
        case 'released':
          rawgSortBy = '-released';
          break;
        case 'price-low':
        case 'price-high':
          rawgSortBy = 'relevance'; // RAWG doesn't have price sorting
          break;
        default:
          rawgSortBy = 'relevance';
      }
      
      const result = await fetchGamesWithFilters({
        search: searchTerm,
        page: 1,
        pageSize: 60,
        sortBy: rawgSortBy,
        selectedGenre: selectedGenre,
        selectedPlatform: selectedPlatform
      });
      
      console.log('📊 RAWG result:', result);
      
      if (result && result.games) {
        let processedGames = result.games;
        
        // Apply additional client-side sorting for price if needed
        if (sortBy === 'price-low' || sortBy === 'price-high') {
          processedGames.sort((a, b) => {
            const priceA = a.price || a.cheapestPrice || 0;
            const priceB = b.price || b.cheapestPrice || 0;
            return sortBy === 'price-low' ? priceA - priceB : priceB - priceA;
          });
        }
        
        setGames(processedGames);
        setTotalResults(result.total || processedGames.length);
        console.log(`✅ Loaded ${processedGames.length} games from RAWG with filters`);
      } else {
        throw new Error('Invalid response format from RAWG API');
      }
      
    } catch (err) {
      console.error('❌ Failed to load games from RAWG:', err);
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
              Loading games from RAWG API...
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
              Failed to load RAWG games
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
            <button
              onClick={loadGames}
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg transition-colors duration-200"
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
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg transition-colors duration-200"
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
            🎮 RAWG Games
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Found {totalResults} games
            {searchTerm && ` matching "${searchTerm}"`}
            {selectedGenre.length > 0 && ` in ${selectedGenre.join(', ')}`}
            {selectedPlatform.length > 0 && ` for ${selectedPlatform.join(', ')}`}
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
