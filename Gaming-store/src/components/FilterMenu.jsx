import { useState, useEffect, useRef } from 'react';

export default function FilterMenu({ 
  genres, 
  platforms, 
  selectedGenre, 
  selectedPlatform, 
  onGenreChange, 
  onPlatformChange, 
  onClearFilters
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempGenre, setTempGenre] = useState(selectedGenre);
  const [tempPlatform, setTempPlatform] = useState(selectedPlatform);
  const modalRef = useRef(null);

  // Handle clicking outside the modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Also close on Escape key
      const handleEscapeKey = (event) => {
        if (event.key === 'Escape') {
          handleClose();
        }
      };
      document.addEventListener('keydown', handleEscapeKey);
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [isOpen]);

  const handleOpen = () => {
    setTempGenre(selectedGenre);
    setTempPlatform(selectedPlatform);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleApply = () => {
    onGenreChange(tempGenre);
    onPlatformChange(tempPlatform);
    setIsOpen(false);
  };

  const handleClear = () => {
    setTempGenre([]);
    setTempPlatform([]);
    onClearFilters();
    setIsOpen(false);
  };

  const handleGenreToggle = (genreName) => {
    if (tempGenre.includes(genreName)) {
      setTempGenre(tempGenre.filter(g => g !== genreName));
    } else {
      setTempGenre([...tempGenre, genreName]);
    }
  };

  const handlePlatformToggle = (platformName) => {
    if (tempPlatform.includes(platformName)) {
      setTempPlatform(tempPlatform.filter(p => p !== platformName));
    } else {
      setTempPlatform([...tempPlatform, platformName]);
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (tempGenre.length > 0) count++;
    if (tempPlatform.length > 0) count++;
    return count;
  };

  return (
    <>
      {/* Filter Button */}
      <button
        onClick={handleOpen}
        className="flex items-center gap-3 bg-blue-600 dark:bg-orange-500 hover:bg-blue-700 dark:hover:bg-orange-600 text-white border-0 rounded-lg px-4 py-3 font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
        </svg>
        <span className="font-semibold">Filters</span>
        {getActiveFiltersCount() > 0 && (
          <span className="bg-white dark:bg-gray-800 text-blue-600 dark:text-orange-500 text-xs px-2 py-1 rounded-full min-w-[20px] h-[20px] flex items-center justify-center font-bold shadow-inner">
            {getActiveFiltersCount()}
          </span>
        )}
      </button>

      {/* Filter Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 z-40" />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
            <div 
              ref={modalRef}
              className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden transform transition-all duration-300 ease-out animate-slide-up sm:animate-fade-in"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                  </svg>
                  Filter Games
                </h3>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
                {/* Genre Filter */}
                <div>
                  <h4 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                    <span className="mr-2 text-lg">🎮</span>
                    Genre (Select Multiple)
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    <label className="flex items-center cursor-pointer p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200 border border-transparent hover:border-blue-200 dark:hover:border-blue-800">
                      <input
                        type="checkbox"
                        checked={tempGenre.length === 0}
                        onChange={() => setTempGenre([])}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2 rounded"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                        All Genres
                      </span>
                    </label>
                    {genres.map((genre) => (
                      <label key={genre.id} className="flex items-center cursor-pointer p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200 border border-transparent hover:border-blue-200 dark:hover:border-blue-800">
                        <input
                          type="checkbox"
                          checked={tempGenre.includes(genre.name)}
                          onChange={() => handleGenreToggle(genre.name)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2 rounded"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                          {genre.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Platform Filter */}
                <div>
                  <h4 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                    <span className="mr-2 text-lg">🖥️</span>
                    Platform (Select Multiple)
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    <label className="flex items-center cursor-pointer p-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-200 border border-transparent hover:border-green-200 dark:hover:border-green-800">
                      <input
                        type="checkbox"
                        checked={tempPlatform.length === 0}
                        onChange={() => setTempPlatform([])}
                        className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500 focus:ring-2 rounded"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                        All Platforms
                      </span>
                    </label>
                    {platforms.map((platform) => (
                      <label key={platform.id} className="flex items-center cursor-pointer p-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-200 border border-transparent hover:border-green-200 dark:hover:border-green-800">
                        <input
                          type="checkbox"
                          checked={tempPlatform.includes(platform.name)}
                          onChange={() => handlePlatformToggle(platform.name)}
                          className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500 focus:ring-2 rounded"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                          {platform.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Active Filters Preview */}
                {(tempGenre.length > 0 || tempPlatform.length > 0) && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                    <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 flex items-center">
                      <span className="mr-2">🔍</span>
                      Selected Filters:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {tempGenre.map((genre) => (
                        <span key={genre} className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs px-3 py-1 rounded-full font-medium flex items-center border border-blue-200 dark:border-blue-800">
                          <span className="mr-1">🎮</span>
                          {genre}
                        </span>
                      ))}
                      {tempPlatform.map((platform) => (
                        <span key={platform} className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs px-3 py-1 rounded-full font-medium flex items-center border border-green-200 dark:border-green-800">
                          <span className="mr-1">🖥️</span>
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                <div className="flex gap-3">
                  <button
                    onClick={handleClear}
                    className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:shadow-md"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={handleApply}
                    className="flex-1 px-4 py-3 bg-blue-600 dark:bg-orange-500 text-white rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-orange-600 transition-all duration-200 hover:shadow-lg transform hover:scale-105"
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
