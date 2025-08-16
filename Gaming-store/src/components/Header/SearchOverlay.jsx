// src/components/SearchOverlay.jsx
import { useState, useEffect } from "react";

export default function SearchOverlay({ onClose }) {
  const [searchQuery, setSearchQuery] = useState("");

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      onClose();
    }
  };

  // Close when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-[60] animate-fadeIn"
      onClick={handleBackdropClick}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-yellow-500/20 rotate-45 animate-spin-slow"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 border border-yellow-500/20 rotate-12 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/2 w-16 h-16 border border-yellow-500/20 -rotate-45 animate-bounce"></div>
      </div>

      <div className="relative w-full max-w-3xl mx-4 animate-slideUp">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="relative group">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/50 to-yellow-400/50 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Input field */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search games, tournaments, players..."
              className="relative w-full px-8 py-6 text-xl bg-[#1a1621] border-2 border-yellow-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors font-['Oxanium'] font-medium"
              autoFocus
            />
            
            {/* Search icon */}
            <button 
              type="submit"
              className="absolute right-6 top-1/2 transform -translate-y-1/2 text-yellow-500 hover:text-yellow-400 transition-colors text-2xl group/btn"
            >
              <i className="fas fa-search group-hover/btn:scale-110 transition-transform"></i>
            </button>
          </div>
        </form>
        
        {/* Close button */}
        <button
          className="absolute -top-16 right-0 text-white hover:text-yellow-500 text-4xl transition-all duration-300 transform hover:scale-110 hover:rotate-90"
          onClick={onClose}
          aria-label="Close search"
        >
          <i className="fas fa-times"></i>
        </button>

        {/* Search suggestions */}
        {searchQuery && (
          <div className="mt-6 bg-[#1a1621]/90 backdrop-blur border border-yellow-500/20 rounded-lg p-6 animate-fadeIn">
            <div className="flex items-center gap-3 mb-4">
              <i className="fas fa-search text-yellow-500"></i>
              <p className="text-gray-300 font-medium">
                Press <kbd className="bg-yellow-500/20 px-2 py-1 rounded text-yellow-500 font-bold">Enter</kbd> to search for "{searchQuery}"
              </p>
            </div>
            
            {/* Quick suggestions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Popular Games', 'Live Tournaments', 'Pro Players', 'Gaming Gear'].map((suggestion, index) => (
                <button
                  key={index}
                  className="text-left px-4 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 rounded text-gray-300 hover:text-yellow-500 transition-all duration-300 text-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
