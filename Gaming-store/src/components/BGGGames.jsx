import React, { useState, useEffect } from 'react';
import { searchBGGGames, getPopularBGGGames, getBGGGamesByCategory } from '../services/bggApi';
import GameCard from './GameCard';
import Loader from './Loader';

export default function BGGGames({ searchTerm = '', selectedGenre = [], selectedPlatform = [], sortBy = 'relevance' }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Load games when component mounts or filters change
  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
    loadGames();
  }, [searchTerm, selectedGenre, selectedPlatform, sortBy]);

  // Load games for pagination
  useEffect(() => {
    if (currentPage > 1) {
      loadGames();
    }
  }, [currentPage]);

  const loadGames = async () => {
    try {
      setLoading(true);
      setError(null);

      let result;
      const pageSize = 20;

      if (searchTerm && searchTerm.trim()) {
        // Search for specific games
        console.log('🔍 BGG: Searching for games with term:', searchTerm);
        result = await searchBGGGames(searchTerm, { 
          limit: pageSize,
          page: currentPage 
        });
      } else if (selectedGenre && selectedGenre.length > 0) {
        // Get games by category/genre
        const category = selectedGenre[0]; // Use first selected genre
        console.log('🏷️ BGG: Getting games by category:', category);
        result = await getBGGGamesByCategory(category, pageSize);
      } else {
        // Get popular board games
        console.log('🔥 BGG: Loading popular board games');
        result = await getPopularBGGGames(pageSize);
      }

      if (result && result.success && result.games) {
        // Apply additional filtering for genre and platform if needed
        let filteredGames = result.games;
        
        // Apply genre filtering (if not already filtered by API)
        if (selectedGenre.length > 0 && !searchTerm) {
          filteredGames = filteredGames.filter(game => {
            if (!game.genres || game.genres.length === 0) return false;
            return selectedGenre.some(selectedGenre => 
              game.genres.some(gameGenre => 
                gameGenre.toLowerCase().includes(selectedGenre.toLowerCase())
              )
            );
          });
        }
        
        // Apply platform filtering (BGG has limited platform info, but we can check mechanics)
        if (selectedPlatform.length > 0) {
          filteredGames = filteredGames.filter(game => {
            if (!game.mechanics || game.mechanics.length === 0) return false;
            return selectedPlatform.some(selectedPlatform => 
              game.mechanics.some(mechanic => 
                mechanic.toLowerCase().includes(selectedPlatform.toLowerCase())
              )
            );
          });
        }
        
        // Apply sorting
        let sortedGames = [...filteredGames];
        
        switch (sortBy) {
          case 'name-asc':
            sortedGames.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'name-desc':
            sortedGames.sort((a, b) => b.name.localeCompare(a.name));
            break;
          case 'rating':
            sortedGames.sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0));
            break;
          case 'released':
            sortedGames.sort((a, b) => (parseInt(b.yearPublished) || 0) - (parseInt(a.yearPublished) || 0));
            break;
          case 'price-low':
            sortedGames.sort((a, b) => (a.price || 0) - (b.price || 0));
            break;
          case 'price-high':
            sortedGames.sort((a, b) => (b.price || 0) - (a.price || 0));
            break;
          default:
            // Default: sort by rating
            sortedGames.sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0));
        }

        setGames(sortedGames);
        setTotalResults(result.total || sortedGames.length);
        setTotalPages(Math.ceil((result.total || sortedGames.length) / pageSize));
        
        console.log(`✅ BGG: Loaded ${sortedGames.length} games successfully`);
      } else {
        throw new Error(result?.error || 'Failed to load games from BGG');
      }
    } catch (err) {
      console.error('❌ BGG: Error loading games:', err);
      setError(err.message || 'Failed to load board games');
      setGames([]);
      setTotalResults(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && games.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <Loader />
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              Loading board games from BoardGameGeek...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error && games.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <div className="text-6xl mb-4">😞</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Failed to load BGG games
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
            <button
              onClick={loadGames}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-3 rounded-lg transition-colors duration-200"
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
              No board games found
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {searchTerm || selectedGenre.length > 0 || selectedPlatform.length > 0
                ? 'Try adjusting your search terms or filters'
                : 'No board games available at the moment'
              }
            </p>
            {(searchTerm || selectedGenre.length > 0 || selectedPlatform.length > 0) && (
              <button
                onClick={() => window.location.reload()}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-3 rounded-lg transition-colors duration-200"
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
            🎲 Board Game Geek Games
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Found {totalResults} board games
            {searchTerm && ` matching "${searchTerm}"`}
            {selectedGenre.length > 0 && ` in ${selectedGenre.join(', ')}`}
            {selectedPlatform.length > 0 && ` with ${selectedPlatform.join(', ')} mechanics`}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Community ratings and game mechanics from BoardGameGeek
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Loading indicator for pagination */}
        {loading && games.length > 0 && (
          <div className="text-center py-4">
            <Loader />
            <p className="text-gray-600 dark:text-gray-300 mt-2">Loading more games...</p>
          </div>
        )}
      </div>
    </div>
  );
}
