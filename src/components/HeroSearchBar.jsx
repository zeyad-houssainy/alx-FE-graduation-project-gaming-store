import React, { useState, useEffect, useRef } from 'react';
import { useGamesStore } from '../stores';

export default function HeroSearchBar({ onSearch, className = "" }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const timeoutRef = useRef(null);

  const { globalSearch } = useGamesStore();

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
        console.log('HeroSearchBar: Fetching suggestions for:', searchTerm.trim());
        
        // Search across all store APIs using global search
        const result = await globalSearch(searchTerm.trim());
        console.log('HeroSearchBar: Search result:', result);
        
        // Limit to 3 suggestions maximum
        const limitedSuggestions = result.games.slice(0, 3);
        console.log('HeroSearchBar: Limited suggestions:', limitedSuggestions);
        
        setSuggestions(limitedSuggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error('HeroSearchBar: Error fetching suggestions:', error);
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
  }, [searchTerm, globalSearch]);

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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </button>
        </div>
      </form>
      
      {/* Search Suggestions */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
          {/* Loading State */}
          {loading && (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              <div className="animate-spin w-6 h-6 border-2 border-blue-500 dark:border-orange-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              Searching...
            </div>
          )}

          {/* Search Suggestions */}
          {!loading && suggestions.length > 0 && (
            <div className="p-2">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-3 py-2 uppercase tracking-wide">
                Search Results
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.id}-${index}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-3 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-lg flex items-center gap-3"
                >
                  {/* Game Image */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={suggestion.background_image || '/assets/images/featured-game-1.jpg'}
                      alt={suggestion.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/assets/images/featured-game-1.jpg';
                      }}
                    />
                  </div>
                  
                  {/* Game Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-gray-900 dark:text-white font-medium truncate">{suggestion.name}</div>
                    <div className="text-gray-500 dark:text-gray-400 text-sm truncate">
                      {suggestion.genres?.slice(0, 2).join(', ') || 'Action'}
                    </div>
                  </div>

                  {/* Store Badge */}
                  <div className="text-xs px-2 py-1 rounded bg-blue-600 text-white">
                    {suggestion.storeName || 'Store'}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Popular Searches */}
          {!loading && searchTerm.length === 0 && (
            <div className="p-2">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-3 py-2 uppercase tracking-wide">
                Popular Searches
              </div>
              {popularSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handlePopularSearchClick(search)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-lg text-gray-700 dark:text-gray-300"
                >
                  {search}
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && searchTerm.length >= 2 && suggestions.length === 0 && (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No games found for "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}

