import React, { useState, useRef, useEffect } from 'react';

export default function FilterMenu({ 
  genres, 
  platforms, 
  selectedGenre, 
  selectedPlatform, 
  priceRange = { min: '', max: '' },
  onGenreChange, 
  onPlatformChange, 
  onPriceRangeChange,
  onClearFilters,
  activeStore = 'mock'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempGenre, setTempGenre] = useState(selectedGenre);
  const [tempPlatform, setTempPlatform] = useState(selectedPlatform);
  const [tempPriceRange, setTempPriceRange] = useState(priceRange);
  const modalRef = useRef(null);

  // Update temp states when props change
  useEffect(() => {
    setTempGenre(selectedGenre);
    setTempPlatform(selectedPlatform);
    setTempPriceRange(priceRange);
  }, [selectedGenre, selectedPlatform, priceRange]);

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
    setTempPriceRange(priceRange);
  };

  const handleApply = () => {
    onGenreChange(tempGenre);
    onPlatformChange(tempPlatform);
    onPriceRangeChange(tempPriceRange);
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

  const handlePriceRangeChange = (field, value) => {
    setTempPriceRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getActiveFiltersCount = () => {
    let count = selectedGenre.length + selectedPlatform.length;
    // Add price range to count if set
    if (tempPriceRange.min || tempPriceRange.max) count++;
    return count;
  };

  const clearAllFilters = () => {
    setTempGenre([]);
    setTempPlatform([]);
    setTempPriceRange(priceRange);
  };

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
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Filter Games
                  </h3>
                </div>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                {/* Price Range Filter */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">💰</span>
                    <h4 className="font-medium text-gray-900 dark:text-white">Price Range</h4>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Min Price</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          min="0"
                          max="999"
                          placeholder="0"
                          value={tempPriceRange.min}
                          onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                          className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="text-gray-400">to</div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Max Price</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          min="0"
                          max="999"
                          placeholder="100"
                          value={tempPriceRange.max}
                          onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                          className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Set price range to find games within your budget
                  </p>
                </div>

                {/* Genres */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">🎮</span>
                    <h4 className="font-medium text-gray-900 dark:text-white">Genres</h4>
                    <span className="text-xs bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full">
                      {tempGenre.length} selected
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {genres.map((genre) => (
                      <button
                        key={genre}
                        onClick={() => handleGenreToggle(genre)}
                        className={`px-3 py-2 text-sm rounded-lg border transition-all duration-200 ${
                          tempGenre.includes(genre)
                            ? 'bg-purple-100 dark:bg-purple-800 border-purple-300 dark:border-purple-600 text-purple-800 dark:text-purple-200 shadow-sm'
                            : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:border-purple-200 dark:hover:border-purple-500'
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Platforms */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">🖥️</span>
                    <h4 className="font-medium text-gray-900 dark:text-white">Platforms</h4>
                    <span className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                      {tempPlatform.length} selected
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {platforms.map((platform) => (
                      <button
                        key={platform}
                        onClick={() => handlePlatformToggle(platform)}
                        className={`px-3 py-2 text-sm rounded-lg border transition-all duration-200 ${
                          tempPlatform.includes(platform)
                            ? 'bg-blue-100 dark:bg-blue-800 border-blue-300 dark:border-blue-600 text-blue-800 dark:text-blue-200 shadow-sm'
                            : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-200 dark:hover:border-blue-500'
                        }`}
                      >
                        {platform}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active Filters Summary */}
                {(tempGenre.length > 0 || tempPlatform.length > 0 || tempPriceRange.min || tempPriceRange.max) && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                    <h5 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2 flex items-center gap-2">
                      <span>⚡</span>
                      Active Filters
                    </h5>
                    <div className="space-y-1 text-sm">
                      {tempGenre.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-600 dark:text-yellow-400">🎮</span>
                          <span className="text-yellow-700 dark:text-yellow-300">
                            Genres: {tempGenre.join(', ')}
                          </span>
                        </div>
                      )}
                      {tempPlatform.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-600 dark:text-yellow-400">🖥️</span>
                          <span className="text-yellow-700 dark:text-yellow-300">
                            Platforms: {tempPlatform.join(', ')}
                          </span>
                        </div>
                      )}
                      {(tempPriceRange.min || tempPriceRange.max) && (
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-600 dark:text-yellow-400">💰</span>
                          <span className="text-yellow-700 dark:text-yellow-300">
                            Price: ${tempPriceRange.min || '0'} - ${tempPriceRange.max || '∞'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50">
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors font-medium"
                >
                  Clear All
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApply}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md"
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
