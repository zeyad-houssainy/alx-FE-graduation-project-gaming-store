import React, { useState, useEffect, useRef } from 'react';
import { fetchGames } from '../services/gamesApi';

export default function HeroSearchBar({ onSearch, className = "" }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const timeoutRef = useRef(null);

  const popularSearches = [
    'Action Games',
    'RPG Games', 
    'Strategy Games',
    'Sports Games',
    'Racing Games',
    'Puzzle Games'
  ];

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setShowSuggestions(false);
        if (searchRef.current) {
          const input = searchRef.current.querySelector('input');
          if (input) input.blur();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Fetch search suggestions when search term changes
  useEffect(() => {
    if (searchTerm.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);
    
    // Debounce search to avoid too many API calls
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        const result = await fetchGames(1, 8, searchTerm.trim());
        setSuggestions(result.games);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchTerm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      console.log('HeroSearchBar: Submitting search for:', searchTerm.trim());
      setShowSuggestions(false);
      onSearch(searchTerm.trim());
    } else {
      console.log('HeroSearchBar: Empty search term, ignoring submit');
    }
  };

  const handleSuggestionClick = (suggestion) => {
    console.log('HeroSearchBar: Suggestion clicked:', suggestion);
    setSearchTerm(suggestion.name);
    setShowSuggestions(false);
    onSearch(suggestion.name);
  };

  const handlePopularSearchClick = (suggestion) => {
    console.log('HeroSearchBar: Popular search clicked:', suggestion);
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion);
  };

  const handleInputBlur = () => {
    // Small delay to allow suggestion clicks to work
    timeoutRef.current = setTimeout(() => {
      setShowSuggestions(false);
    }, 150);
  };

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (e.target.value.length === 0) {
                setShowSuggestions(true);
              }
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={handleInputBlur}
            placeholder="Search for games, genres, or developers..."
            className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 shadow-lg hover:shadow-xl group-hover:border-blue-300 dark:group-hover:border-orange-400"
          />
          <button 
            type="submit"
            className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 dark:bg-orange-500 hover:bg-blue-700 dark:hover:bg-orange-600 text-white p-2 sm:p-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </form>
      
      {/* Search Suggestions */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-20 animate-fade-in">
          <div className="p-4">
            {/* Loading State */}
            {loading && (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 dark:border-orange-500"></div>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Searching...</p>
              </div>
            )}
            
            {/* Search Results */}
            {!loading && suggestions.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 text-left">Search Results</h3>
                <div className="space-y-2">
                  {suggestions.map((game) => (
                    <button
                      key={game.id}
                      onClick={() => handleSuggestionClick(game)}
                      className="w-full p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-orange-500/20 rounded-lg transition-all duration-300 group border border-transparent hover:border-blue-200 dark:hover:border-orange-500/30 hover:shadow-md"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={game.background_image} 
                          alt={game.name}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                          onError={(e) => {
                            e.target.src = '/assets/images/featured-game-1.jpg';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-orange-400 transition-colors truncate">
                            {game.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {game.genre} • {game.platforms?.join(', ')}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                          <span>⭐</span>
                          <span>{game.rating}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Popular Searches */}
            {!loading && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 text-left">Popular Searches</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {popularSearches.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handlePopularSearchClick(suggestion)}
                      className="p-2 sm:p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-orange-500/20 rounded-lg transition-all duration-300 group border border-transparent hover:border-blue-200 dark:hover:border-orange-500/30 hover:shadow-md"
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-orange-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-orange-400 transition-colors font-medium text-sm sm:text-base">
                          {suggestion}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* No Results Message */}
            {!loading && searchTerm.trim().length >= 2 && suggestions.length === 0 && (
              <div className="text-center py-4">
                <p className="text-gray-500 dark:text-gray-400">No games found for "{searchTerm}"</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try a different search term</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

