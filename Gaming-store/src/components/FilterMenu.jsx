import React, { useState, useRef, useEffect } from 'react';

export default function FilterMenu({ genres, platforms, selectedGenre, selectedPlatform, onGenreChange, onPlatformChange, onClearFilters }) {
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
          <div
            ref={modalRef}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-transparent"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700">
              {/* Modal Header */}
              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filter Games</h3>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                {/* Genres Section */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Genres</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {genres.map((genre) => (
                      <label
                        key={genre.id}
                        className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-orange-400 transition-colors cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={tempGenre.includes(genre.id)}
                          onChange={() => handleGenreToggle(genre.id)}
                          className="w-4 h-4 text-blue-600 dark:text-orange-500 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-orange-500"
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {genre.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Platforms Section */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Platforms</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {platforms.map((platform) => (
                      <label
                        key={platform.id}
                        className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-orange-400 transition-colors cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={tempPlatform.includes(platform.id)}
                          onChange={() => handlePlatformToggle(platform.id)}
                          className="w-4 h-4 text-blue-600 dark:text-orange-500 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-orange-500"
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {platform.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                <div className="flex gap-3">
                  <button
                    onClick={handleClose}
                    className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApply}
                    className="flex-1 px-4 py-2 bg-blue-600 dark:bg-orange-500 hover:bg-blue-700 dark:hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
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
