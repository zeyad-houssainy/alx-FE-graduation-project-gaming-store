import React, { useState, useEffect, useRef } from 'react';
import { useGamesStore } from '../stores';
import { useNavigate } from 'react-router-dom';

export default function SearchBar({ 
  searchTerm = '', 
  onSearchChange, 
  onSearch, 
  placeholder = "Search games...",
  className = "",
  activeStore = 'mock' // Add activeStore prop for store-specific hints
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const timeoutRef = useRef(null);

  const { globalSearch } = useGamesStore();
  const navigate = useNavigate();

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
        console.log('SearchBar: Fetching suggestions for:', searchTerm.trim());
        
        // Search across all store APIs
        const result = await globalSearch(searchTerm.trim());
        console.log('SearchBar: Search result:', result);
        
        // Limit to 3 suggestions maximum
        const limitedSuggestions = result.games.slice(0, 3);
        console.log('SearchBar: Limited suggestions:', limitedSuggestions);
        
        setSuggestions(limitedSuggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error('SearchBar: Error fetching suggestions:', error);
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
    const trimmedTerm = (searchTerm || '').trim();
    if (trimmedTerm) {
      console.log('SearchBar: Submitting search for:', trimmedTerm);
      setShowSuggestions(false);
      onSearch(trimmedTerm);
    } else {
      console.log('SearchBar: Empty search term, ignoring submit');
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    console.log('SearchBar: Input changed to:', value);
    onSearchChange(value);
  };

  const handleSuggestionClick = (suggestion) => {
    console.log('SearchBar: Suggestion clicked:', suggestion);
    setShowSuggestions(false);
    
    // Navigate directly to game details if we have a game ID
    if (suggestion.id) {
      // Check if this is a RAWG game (which the GameDetail page can handle)
      if (suggestion.source === 'rawg' || suggestion.rawgId) {
        navigate(`/games/${suggestion.rawgId || suggestion.id}`);
      } else {
        // For other sources, perform a search instead
        console.log('SearchBar: Non-RAWG game, performing search instead');
        onSearchChange(suggestion.name);
        onSearch(suggestion.name);
      }
    } else {
      // Fallback to search if no game ID
      onSearchChange(suggestion.name);
      onSearch(suggestion.name);
    }
  };

  const handleInputFocus = () => {
    if (searchTerm.trim().length >= 2 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  // Ensure searchTerm is always a string
  const safeSearchTerm = searchTerm || '';

  // Store-specific search hints
  const getSearchHint = () => {
    switch (activeStore) {
      case 'rawg':
        return 'Search 500,000+ video games by name, genre, or developer...';
      case 'cheapshark':
        return 'Search for the best game deals across 20+ stores...';
      default: // mock
        return 'Search our curated collection of popular games...';
    }
  };

  const getPlaceholder = () => {
    switch (activeStore) {
      case 'rawg':
        return 'Search games, genres, developers...';
      case 'cheapshark':
        return 'Search for game deals...';
      default: // mock
        return 'Search games...';
    }
  };

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative" role="search">
        <input
          type="text"
          value={safeSearchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder || getPlaceholder()}
          className="w-full px-4 py-3 pl-12 pr-32 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-white/20 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 font-medium transition-colors"
          role="searchbox"
          aria-label="Search for games"
        />
        
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <button
          type="submit"
          disabled={!safeSearchTerm.trim()}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-blue-600 dark:bg-white/20 hover:bg-blue-700 dark:hover:bg-white/30 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Search games"
        >
          Search
        </button>
      </form>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
          {/* Loading State */}
          {loading && (
            <div className="p-4 text-center">
              <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-gray-400 text-sm">Searching...</p>
            </div>
          )}
          
          {/* Search Results */}
          {!loading && suggestions.length > 0 && (
            <>
              {suggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.id}-${index}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-700 last:border-b-0 flex items-center gap-3"
                >
                  {/* Game Image */}
                  <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
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
                    <div className="text-gray-600 dark:text-gray-400 text-sm truncate">
                      {suggestion.genres?.slice(0, 2).join(', ') || 'Action'}
                    </div>
                  </div>

                  {/* Store Badge */}
                  <div className="text-xs px-2 py-1 rounded bg-blue-600 text-white">
                    {suggestion.storeName || 'Store'}
                  </div>
                </button>
              ))}
            </>
          )}
          
          {/* No Results */}
          {!loading && suggestions.length === 0 && searchTerm.trim().length >= 2 && (
            <div className="p-4 text-center text-gray-600 dark:text-gray-400 text-sm">
              No games found for "{searchTerm}"
            </div>
          )}
        </div>
      )}
      
      {/* Search Hint */}
      <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 text-center">
        {getSearchHint()}
      </div>
    </div>
  );
}
