import React, { useState, useRef, useEffect } from 'react';

export default function FilterMenu({ 
  genres, 
  platforms, 
  selectedGenre, 
  selectedPlatform, 
  onGenreChange, 
  onPlatformChange, 
  onClearFilters,
  activeStore = 'mock' // Add activeStore prop to show store-specific filters
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempGenre, setTempGenre] = useState(selectedGenre);
  const [tempPlatform, setTempPlatform] = useState(selectedPlatform);
  const modalRef = useRef(null);

  // Update temp states when props change
  useEffect(() => {
    setTempGenre(selectedGenre);
    setTempPlatform(selectedPlatform);
  }, [selectedGenre, selectedPlatform]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Escape key to close
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    // Reset temp states
    setTempGenre(selectedGenre);
    setTempPlatform(selectedPlatform);
  };

  const handleApply = () => {
    onGenreChange(tempGenre);
    onPlatformChange(tempPlatform);
    setIsOpen(false);
  };

  const handleGenreToggle = (genre) => {
    setTempGenre(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handlePlatformToggle = (platform) => {
    setTempPlatform(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const getActiveFiltersCount = () => {
    return selectedGenre.length + selectedPlatform.length;
  };

  // Store-specific filter information
  const getStoreFilterInfo = () => {
    switch (activeStore) {
      case 'rawg':
        return {
          genreNote: 'Rich genre data with detailed categorization',
          platformNote: 'Comprehensive platform support (PC, Consoles)',
          genreIcon: '🎮',
          platformIcon: '🖥️'
        };
      case 'cheapshark':
        return {
          genreNote: 'Limited genre info - basic text matching',
          platformNote: 'Primarily PC games with Steam integration',
          genreIcon: '💰',
          platformIcon: '💻'
        };

      default: // mock
        return {
          genreNote: 'Curated genres for popular games',
          platformNote: 'Multi-platform support',
          genreIcon: '🎯',
          platformIcon: '🖥️'
        };
    }
  };

  const storeInfo = getStoreFilterInfo();

  return (
    <>
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-300 dark:hover:border-orange-400 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
        </svg>
        <span>Filters</span>
        {getActiveFiltersCount() > 0 && (
          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-medium">
            {getActiveFiltersCount()}
          </span>
        )}
      </button>

      {/* Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 z-40 animate-fade-in" />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              ref={modalRef}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Filter Games
                </h3>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Store Info */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    {activeStore === 'rawg' && '🎮 RAWG Store'}
                    {activeStore === 'cheapshark' && '💰 CheapShark Store'}

                    {activeStore === 'mock' && '🎯 Mock Store'}
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {activeStore === 'rawg' && 'Advanced filtering with rich metadata'}
                    {activeStore === 'cheapshark' && 'Price-focused filtering with store comparison'}

                    {activeStore === 'mock' && 'Curated selection with instant access'}
                  </p>
                </div>

                {/* Genres */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">{storeInfo.genreIcon}</span>
                    <h4 className="font-medium text-gray-900 dark:text-white">Genres</h4>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    {storeInfo.genreNote}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {genres.map((genre) => (
                      <button
                        key={genre}
                        onClick={() => handleGenreToggle(genre)}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                          tempGenre.includes(genre)
                            ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200'
                            : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Platforms */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">{storeInfo.platformIcon}</span>
                    <h4 className="font-medium text-gray-900 dark:text-white">Platforms</h4>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    {storeInfo.platformNote}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {platforms.map((platform) => (
                      <button
                        key={platform}
                        onClick={() => handlePlatformToggle(platform)}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                          tempPlatform.includes(platform)
                            ? 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-800 dark:text-green-200'
                            : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                      >
                        {platform}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active Filters Summary */}
                {(tempGenre.length > 0 || tempPlatform.length > 0) && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <h5 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                      Active Filters
                    </h5>
                    <div className="space-y-2">
                      {tempGenre.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-600 dark:text-yellow-400">🎮</span>
                          <span className="text-sm text-yellow-700 dark:text-yellow-300">
                            Genres: {tempGenre.join(', ')}
                          </span>
                        </div>
                      )}
                      {tempPlatform.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-600 dark:text-yellow-400">🖥️</span>
                          <span className="text-sm text-yellow-700 dark:text-yellow-300">
                            Platforms: {tempPlatform.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => {
                    setTempGenre([]);
                    setTempPlatform([]);
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Clear All
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApply}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
