import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import OurServices from './OurServices';
import FeaturedGames from './FeaturedGames';
import Features from './Features';
import LiveMatches from './LiveMatches';
import Articles from './Articles';
import { useState, useEffect, useRef } from 'react';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

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
        // Remove focus from input
        if (searchRef.current) {
          const input = searchRef.current.querySelector('input');
          if (input) input.blur();
        }
      }
    };

    const handleBodyClick = (event) => {
      // Close suggestions when clicking anywhere on the page
      if (showSuggestions) {
        setShowSuggestions(false);
      }
    };

    // Add event listeners
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    document.addEventListener('click', handleBodyClick);
    
    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('click', handleBodyClick);
    };
  }, [showSuggestions]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setShowSuggestions(false);
      // Navigate to games page with search term
      window.location.href = `/games?search=${encodeURIComponent(searchTerm.trim())}`;
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    window.location.href = `/games?search=${encodeURIComponent(suggestion)}`;
  };

  const handleInputBlur = () => {
    // Small delay to allow suggestion clicks to work
    setTimeout(() => {
      setShowSuggestions(false);
    }, 150);
  };

  return (
    <>
      <Header />
      <main className="relative z-10 pt-20 sm:pt-24">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-blue-300 rotate-45"></div>
            <div className="absolute top-3/4 right-1/4 w-24 h-24 border border-indigo-300 rotate-12"></div>
            <div className="absolute bottom-1/4 left-1/2 w-16 h-16 border border-blue-300 -rotate-45"></div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <p className="text-blue-600 dark:text-orange-400 font-bold text-lg sm:text-xl uppercase tracking-wider mb-4 font-['Oxanium']">
                Ultimate Gaming Experience
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-6 font-['Oxanium'] leading-none text-gray-900 dark:text-gray-100">
                Welcome to <span className="text-blue-600 dark:text-orange-400">Gamiz</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed px-4">
                Discover the ultimate destination for gaming excellence. Join epic battles, 
                explore new worlds, and connect with fellow gamers worldwide.
              </p>
              
              {/* Search Bar Section */}
              <div className="mb-8 px-4">
                <div className="max-w-2xl mx-auto relative" ref={searchRef}>
                  <form onSubmit={handleSearch} className="relative">
                    <div className="relative group">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setShowSuggestions(e.target.value.length === 0);
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
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-left">Popular Searches</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {popularSearches.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
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
                    </div>
                  )}
                </div>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
                <a href="/games" className="group relative bg-blue-600 dark:bg-orange-500 text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-lg uppercase tracking-wider hover:bg-blue-700 dark:hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base w-full sm:w-auto text-center">
                  <span className="relative z-10">Explore Games</span>
                </a>
                <a href="/about" className="group relative overflow-hidden bg-transparent border-2 border-blue-600 dark:border-orange-400 text-blue-600 dark:text-orange-400 font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-lg uppercase tracking-wider transition-all duration-300 hover:text-white hover:shadow-lg text-sm sm:text-base w-full sm:w-auto text-center">
                  <span className="absolute inset-0 bg-blue-600 dark:bg-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  <span className="relative z-10">About Us</span>
                </a>
              </div>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-blue-400 dark:border-orange-400 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-blue-600 dark:bg-orange-500 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* Our Services Section */}
        <OurServices />

        {/* Featured Games Section */}
        <FeaturedGames />

        {/* Live Matches Section */}
        <LiveMatches />

        {/* Features Section */}
        <Features />

        {/* Articles Section */}
        <Articles />
      </main>
      <Footer />
    </>
  );
}
