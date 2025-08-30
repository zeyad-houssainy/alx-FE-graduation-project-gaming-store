// src/components/SearchOverlay.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGamesStore } from '../../stores';

export default function SearchOverlay({ onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [gameSuggestions, setGameSuggestions] = useState([]);
  const [showGameSuggestions, setShowGameSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [popularSearches] = useState([
    'Action Games',
    'RPG Games',
    'Strategy Games',
    'Sports Games',
    'Racing Games',
    'Puzzle Games',
    'Adventure Games',
    'Shooter Games',
    'Indie Games',
    'AAA Games'
  ]);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { globalSearch } = useGamesStore();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleEnter = (e) => {
      if (e.key === 'Enter' && searchTerm.trim()) {
        handleSubmit(e);
      }
    };

    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Add opacity class to body when search is open
    document.body.classList.add('search-overlay-active');

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleEnter);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleEnter);
      document.removeEventListener('mousedown', handleClickOutside);
      // Remove opacity class when search closes
      document.body.classList.remove('search-overlay-active');
    };
  }, [onClose, searchTerm]);

  // Fetch game suggestions when search term changes
  useEffect(() => {
    if (searchTerm.trim().length < 2) {
      setGameSuggestions([]);
      setShowGameSuggestions(false);
      return;
    }

    setLoading(true);
    
    const timeoutId = setTimeout(async () => {
      try {
        console.log('SearchOverlay: Fetching suggestions for:', searchTerm.trim());
        
        // Search across all store APIs
        const result = await globalSearch(searchTerm.trim());
        console.log('SearchOverlay: Search result:', result);
        
        // Limit to 5 suggestions maximum
        const limitedSuggestions = result.games.slice(0, 5);
        console.log('SearchOverlay: Limited suggestions:', limitedSuggestions);
        
        setGameSuggestions(limitedSuggestions);
        setShowGameSuggestions(true);
      } catch (error) {
        console.error('SearchOverlay: Error fetching suggestions:', error);
        setGameSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, globalSearch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      console.log('SearchOverlay: Submitting search for:', searchTerm.trim());
      setIsSearching(true);
      try {
        // Navigate to games page with search query
        const searchUrl = `/games?search=${encodeURIComponent(searchTerm.trim())}`;
        console.log('SearchOverlay: Navigating to:', searchUrl);
        navigate(searchUrl);
        onClose();
      } catch (error) {
        console.error('SearchOverlay: Search navigation error:', error);
      } finally {
        setIsSearching(false);
      }
    } else {
      console.log('SearchOverlay: Empty search term, ignoring submit');
    }
  };

  const handleGameSuggestionClick = (suggestion) => {
    console.log('SearchOverlay: Game suggestion clicked:', suggestion);
    setShowGameSuggestions(false);
    
    // Navigate directly to game details if we have a game ID
    if (suggestion.id) {
      // Check if this is a RAWG game (which the GameDetail page can handle)
      if (suggestion.source === 'rawg' || suggestion.rawgId) {
        navigate(`/games/${suggestion.rawgId || suggestion.id}`);
        onClose();
      } else {
        // For other sources, perform a search instead
        console.log('SearchOverlay: Non-RAWG game, performing search instead');
        setSearchTerm(suggestion.name);
        handleSubmit(new Event('submit'));
      }
    } else {
      // Fallback to search if no game ID
      setSearchTerm(suggestion.name);
      handleSubmit(new Event('submit'));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/640 backdrop-blur-sm z-50 flex items-start justify-center pt-24 p-4">
      <div 
        ref={searchRef}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Search Games</h2>
            <p className="text-gray-600 dark:text-gray-400">Find your next gaming adventure</p>
          </div>

          {/* Search Input */}
          <div className="relative mb-8">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for games, genres, or developers..."
              className="w-full px-6 py-4 text-lg border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
              autoFocus
            />
            <button 
              type="submit"
              disabled={isSearching || !searchTerm.trim()}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-orange-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? (
                <div className="animate-spin w-6 h-6 border-2 border-blue-500 dark:border-orange-400 border-t-transparent rounded-full"></div>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </button>
          </div>

          {/* Game Search Suggestions */}
          {showGameSuggestions && gameSuggestions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Game Suggestions</h3>
              <div className="space-y-2">
                {gameSuggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion.id}-${index}`}
                    onClick={() => handleGameSuggestionClick(suggestion)}
                    className="w-full p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-orange-500/20 rounded-lg transition-colors group flex items-center gap-3"
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
            </div>
          )}

          {/* Loading State for Game Suggestions */}
          {loading && searchTerm.trim().length >= 2 && (
            <div className="mb-6 p-4 text-center">
              <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Searching for games...</p>
            </div>
          )}

          {/* Popular Searches - Only show when no search term or no game suggestions */}
          {(searchTerm.length === 0 || (!showGameSuggestions && gameSuggestions.length === 0)) && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Popular Searches</h3>
              <div className="grid grid-cols-2 gap-3">
                {popularSearches.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchTerm(suggestion);
                      // Navigate to games page with the suggestion
                      navigate(`/games?search=${encodeURIComponent(suggestion)}`);
                      onClose();
                    }}
                    className="p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-orange-500/20 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-orange-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-orange-400 transition-colors">
                        {suggestion}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
