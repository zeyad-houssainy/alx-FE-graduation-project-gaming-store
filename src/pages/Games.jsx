import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useGamesStore, useAuthStore } from '../stores';
import { useSearchParams } from 'react-router-dom';
import FilterMenu from '../components/FilterMenu';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';
import GameCard from '../components/GameCard';

import { FaFilter, FaTimes, FaEye, FaEyeSlash, FaBug, FaCog, FaPlay, FaPause, FaStop } from 'react-icons/fa';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

export default function Games() {
  const { 
    games, 
    filteredGames,
    loading, 
    error, 
    fetchGames, 
    setLoading, 
    setError,
    totalPages,
    filters,
    activeStore,
    setSearch,
    setGenres,
    setPlatforms,
    setSortBy,
    setPriceRange,
    setPage,
    getGenres,
    getPlatforms,
    getQuickFilters,
    applyQuickFilter,
    globalSearch,
  } = useGamesStore();

  // Use filteredGames for display (which includes sorting) or fall back to games
  const displayGames = filteredGames && filteredGames.length > 0 ? filteredGames : games;

  // Infinite scrolling state
  const [visibleGamesCount, setVisibleGamesCount] = useState(100); // Show all 100 games initially
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreGames, setHasMoreGames] = useState(true);
  const scrollObserverRef = useRef(null);
  const loadingRef = useRef(null);

  const { isAdmin: _isAdmin } = useAuthStore();
  
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize states from localStorage if available
  const [currentPageState, setCurrentPageState] = useState(() => {
    const savedPage = localStorage.getItem('gaming-current-page');
    return savedPage ? parseInt(savedPage) : 1;
  });
  
  const [searchTerm, setSearchTerm] = useState(() => {
    // Always start with empty search on Games page
    // This ensures users see all games when they visit the shop
    return '';
  });
  
  const [selectedGenre, setSelectedGenre] = useState(() => {
    const savedGenres = localStorage.getItem('gaming-selected-genres');
    return savedGenres ? JSON.parse(savedGenres) : [];
  });
  
  const [selectedPlatform, setSelectedPlatform] = useState(() => {
    const savedPlatforms = localStorage.getItem('gaming-selected-platforms');
    return savedPlatforms ? JSON.parse(savedPlatforms) : [];
  });
  
  const [sortBy, setLocalSortBy] = useState(() => {
    const savedSort = localStorage.getItem('gaming-sort-by');
    return savedSort || 'released';
  });

  const [localPriceRange, setLocalPriceRange] = useState(() => {
    const savedPriceRange = localStorage.getItem('gaming-price-range');
    return savedPriceRange ? JSON.parse(savedPriceRange) : { min: '', max: '' };
  });

  // Global search state
  const [globalSearchResults, setGlobalSearchResults] = useState(null);
  const [isGlobalSearch, setIsGlobalSearch] = useState(false);

  // Get visible games for display
  const visibleGames = displayGames ? displayGames.slice(0, visibleGamesCount) : [];

  // Load more games function
  const loadMoreGames = useCallback(() => {
    if (isLoadingMore || !hasMoreGames) return;

    setIsLoadingMore(true);
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      setVisibleGamesCount(prev => prev + 20); // Load 5 more rows
      setIsLoadingMore(false);
    }, 500);
  }, [isLoadingMore, hasMoreGames]);

  // Reset infinite scroll when filters change
  useEffect(() => {
    setVisibleGamesCount(100); // Reset to show all 100 games
    setHasMoreGames(true);
  }, [selectedGenre, selectedPlatform, sortBy, searchTerm, localPriceRange]);

  // Check if there are more games to load
  useEffect(() => {
    if (displayGames && visibleGamesCount >= displayGames.length) {
      setHasMoreGames(false);
    } else {
      setHasMoreGames(true);
    }
  }, [displayGames, visibleGamesCount]);

  // Intersection Observer for infinite scrolling
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 0.1,
    };

    const handleObserver = (entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasMoreGames && !isLoadingMore) {
        loadMoreGames();
      }
    };

    scrollObserverRef.current = new IntersectionObserver(handleObserver, options);

    if (loadingRef.current) {
      scrollObserverRef.current.observe(loadingRef.current);
    }

    return () => {
      if (scrollObserverRef.current) {
        scrollObserverRef.current.disconnect();
      }
    };
  }, [hasMoreGames, isLoadingMore, loadMoreGames]);

  // Update observer when loadingRef changes
  useEffect(() => {
    if (scrollObserverRef.current && loadingRef.current) {
      scrollObserverRef.current.observe(loadingRef.current);
    }
  }, [visibleGamesCount]);
  
  // Save states to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('gaming-current-page', currentPageState.toString());
  }, [currentPageState]);

  useEffect(() => {
    localStorage.setItem('gaming-price-range', JSON.stringify(localPriceRange));
  }, [localPriceRange]);

  // Handle global search from URL or header search
  useEffect(() => {
    const handleGlobalSearch = async () => {
      // Check if there's a search query in the URL
      const urlParams = new URLSearchParams(window.location.search);
      const searchQuery = urlParams.get('search');
      
      if (searchQuery && searchQuery.trim()) {
        try {
          setIsGlobalSearch(true);
          setLoading(true);
          
          // Perform global search
          const results = await globalSearch(searchQuery.trim());
          setGlobalSearchResults(results);
          
          // Update the search term in the store
          setSearch(searchQuery.trim());
          
          // Clear the URL search parameter
          const newUrl = new URL(window.location);
          newUrl.searchParams.delete('search');
          window.history.replaceState({}, '', newUrl);
          
        } catch (error) {
          console.error('Global search error:', error);
          setError('Search failed. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };

    handleGlobalSearch();
  }, [globalSearch, setSearch, setLoading, setError]);

  useEffect(() => {
    localStorage.setItem('gaming-search-term', searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    localStorage.setItem('gaming-selected-genres', JSON.stringify(selectedGenre));
  }, [selectedGenre]);

  useEffect(() => {
    localStorage.setItem('gaming-selected-platforms', JSON.stringify(selectedPlatform));
  }, [selectedPlatform]);

  useEffect(() => {
    localStorage.setItem('gaming-sort-by', sortBy);
  }, [sortBy]);

  // Update URL when search term changes
  useEffect(() => {
    if (filters.search) {
      setSearchParams({ search: filters.search });
    } else {
      setSearchParams({});
    }
  }, [filters.search, setSearchParams]);

  // Update store when localPriceRange changes
  useEffect(() => {
    console.log('Games: localPriceRange changed to:', localPriceRange);
    setPriceRange(localPriceRange);
  }, [localPriceRange, setPriceRange]);

  // Update store filters when local state changes
  useEffect(() => {
    console.log('Games: searchTerm changed to:', searchTerm);
    setSearch(searchTerm);
  }, [searchTerm, setSearch]);

  useEffect(() => {
    console.log('Games: selectedGenre changed to:', selectedGenre);
    setGenres(selectedGenre);
  }, [selectedGenre, setGenres]);

  useEffect(() => {
    console.log('Games: selectedPlatform changed to:', selectedPlatform);
    setPlatforms(selectedPlatform);
  }, [selectedPlatform, setPlatforms]);

  // Sync store filters back to local state when they change
  useEffect(() => {
    if (filters.platforms && filters.platforms.length !== selectedPlatform.length) {
      console.log('Games: Syncing store platforms to local state:', filters.platforms);
      setSelectedPlatform(filters.platforms);
    }
  }, [filters.platforms, selectedPlatform]);

  useEffect(() => {
    if (filters.genres && filters.genres.length !== selectedGenre.length) {
      console.log('Games: Syncing store genres to local state:', filters.genres);
      setSelectedGenre(filters.genres);
    }
  }, [filters.genres, selectedGenre]);

  useEffect(() => {
    console.log('Games: sortBy changed to:', sortBy);
    setSortBy(sortBy);
  }, [sortBy, setSortBy]);

  // Initialize games on mount
  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  useEffect(() => {
    setPage(currentPageState);
  }, [currentPageState, setPage]);

  // Don't update search term from URL params - always start fresh
  // This prevents search terms from being carried over from homepage
  useEffect(() => {
    // If there are any search params, clear them
    if (searchParams.get('search')) {
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  // Clear URL search params and localStorage on component mount
  useEffect(() => {
    setSearchParams({});
    localStorage.removeItem('gaming-search-term');
  }, [setSearchParams]);

  // Log when component loads
  useEffect(() => {
    // Component loaded with clean search state
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPageState(1);
  }, [selectedGenre, selectedPlatform, sortBy]);

  const handleSearch = async (searchQuery) => {
    console.log('Games: handleSearch called with:', searchQuery);
    if (!searchQuery || !searchQuery.trim()) {
      console.log('Games: Empty search query, clearing search');
      // Clear search
      setSearchTerm('');
      setSearch('');
      setIsGlobalSearch(false);
      setGlobalSearchResults(null);
      setCurrentPageState(1);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Clear global search state since we're searching within the current store
      setIsGlobalSearch(false);
      setGlobalSearchResults(null);
      
      // Update the search term in the store
      console.log('Games: Setting search term in store:', searchQuery.trim());
      setSearch(searchQuery.trim());
      
      // Update local state
      setSearchTerm(searchQuery.trim());
      
      // Reset to first page
      setCurrentPageState(1);
      
      console.log('Games: Search initiated successfully');
    } catch (error) {
      console.error('Games: Search error:', error);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenreChange = (genres) => {
    setSelectedGenre(genres);
  };

  const handlePlatformChange = (platforms) => {
    setSelectedPlatform(platforms);
  };

  const handlePriceRangeChange = (newPriceRange) => {
    setPriceRange(newPriceRange);
    setLocalPriceRange(newPriceRange);
  };

  const handlePlatformQuickFilter = (filterKey) => {
    const quickFilters = getQuickFilters();
    const filter = quickFilters[filterKey];
    
    if (filter && filter.filter.platform) {
      const platform = filter.filter.platform;
      console.log('Games: Applying platform quick filter:', platform);
      
      // Update local state
      setSelectedPlatform([platform]);
      
      // Apply the filter in the store
      applyQuickFilter(filterKey);
      
      // Reset to first page
      setCurrentPageState(1);
    }
  };

  const handleSortChange = (sort) => {
    setLocalSortBy(sort);
  };

  const handleClearFilters = () => {
    setSelectedGenre([]);
    setSelectedPlatform([]);
    setLocalPriceRange({ min: '', max: '' });
    setLocalSortBy('released');
    setSearchTerm('');
    setCurrentPageState(1);
    
    // Clear global search
    setIsGlobalSearch(false);
    setGlobalSearchResults(null);
    
    // Clear URL params
    setSearchParams({});
    
    // Clear localStorage
    localStorage.removeItem('gaming-selected-genres');
    localStorage.removeItem('gaming-selected-platforms');
    localStorage.removeItem('gaming-price-range');
    localStorage.removeItem('gaming-sort-by');
    localStorage.removeItem('gaming-search-term');
    localStorage.removeItem('gaming-current-page');
    
    // Force immediate search update
    setSearchTerm('');
  };

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white dark:bg-gray-900 pt-20 sm:pt-24">
          <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <div className="text-center">
              <div className="text-6xl mb-4">😞</div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Oops! Something went wrong</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-8">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-lg transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen pt-20 sm:pt-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-1 sm:px-2 py-8 sm:py-12">
          
          {/* Page Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
              RAWG <span className="text-blue-600 dark:text-orange-400">STORE</span>
            </h1>
            <p className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed px-4 text-gray-600 dark:text-gray-400">
              Your ultimate destination for discovering and collecting games across all platforms
            </p>
          </div>

          {/* RAWG-style Search Bar */}
          <div className="mb-8 max-w-2xl mx-auto">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onSearch={handleSearch}
              activeStore={activeStore}
              placeholder="Search 891,955 games"
              className="w-full"
            />
          </div>

          {/* Results Count */}
          <div className="flex justify-between sm:justify-end items-center mb-6">
            <p className="text-sm sm:hidden text-gray-600 dark:text-gray-300">
              {isGlobalSearch && globalSearchResults 
                ? `${globalSearchResults.count} games found across all stores`
                : `${visibleGames.length} of ${displayGames.length} games`
              }
            </p>
            <div className="text-right">
              <p className="text-sm hidden sm:block text-gray-600 dark:text-gray-300">
                {isGlobalSearch && globalSearchResults 
                  ? `Found ${globalSearchResults.count} games across all stores`
                  : `Showing ${visibleGames.length} of ${displayGames.length} games`
                }
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {isGlobalSearch && globalSearchResults 
                  ? 'Global search results'
                  : `Page ${currentPageState} of ${totalPages}`
                }
              </div>
            </div>
          </div>

          {/* Global Search Results */}
          {isGlobalSearch && globalSearchResults && (
            <div className="mb-6 p-4 bg-white/80 dark:bg-gray-800/20 border border-gray-200 dark:border-gray-700 rounded-lg backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                🔍 Global Search Results
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {globalSearchResults.stores.rawg.count}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">RAWG Games</div>
                </div>
                <div className="text-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {globalSearchResults.stores.cheapshark.count}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">CheapShark Deals</div>
                </div>
                <div className="text-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {globalSearchResults.stores.mock.count}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Mock Store</div>
                </div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Found {globalSearchResults.count} total games across all stores
              </div>
            </div>
          )}

          {/* Filters and Actions Header */}
          <div className="flex flex-col gap-4 mb-6">
            {/* Filter Button, Platform Icons, Sort By, and Clear Filters */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Filter Button */}
              <div className="flex-shrink-0">
                <FilterMenu
                  genres={getGenres()}
                  platforms={getPlatforms()}
                  selectedGenre={selectedGenre}
                  selectedPlatform={selectedPlatform}
                  priceRange={localPriceRange}
                  onGenreChange={handleGenreChange}
                  onPlatformChange={handlePlatformChange}
                  onPriceRangeChange={handlePriceRangeChange}
                  onClearFilters={handleClearFilters}
                  activeStore={activeStore}
                />
              </div>

              {/* Platform Icons */}
              <div className="flex items-center gap-3 flex-wrap justify-center lg:justify-start">
                {/* PC/Windows */}
                <button
                  onClick={() => handlePlatformQuickFilter('pc')}
                  className={`w-8 h-8 transition-all duration-300 hover:scale-110 ${
                    selectedPlatform.includes('PC')
                      ? 'opacity-100 transform scale-110'
                      : 'opacity-50 hover:opacity-75'
                  }`}
                  title="PC"
                >
                  <img 
                    src="/assets/icons/windows.svg" 
                    alt="PC" 
                    className="w-full h-full text-gray-800 dark:text-white"
                  />
                </button>



                {/* PlayStation */}
                <button
                  onClick={() => handlePlatformQuickFilter('playstation')}
                  className={`w-8 h-8 transition-all duration-300 hover:scale-110 ${
                    selectedPlatform.includes('PlayStation 5') || selectedPlatform.includes('PlayStation 4') || selectedPlatform.includes('PlayStation 3')
                      ? 'opacity-100 transform scale-110'
                      : 'opacity-50 hover:opacity-75'
                  }`}
                  title="PlayStation"
                >
                  <img 
                    src="/assets/icons/playstation.svg" 
                    alt="PlayStation" 
                    className="w-full h-full text-gray-800 dark:text-white"
                  />
                </button>

                {/* Xbox */}
                <button
                  onClick={() => handlePlatformQuickFilter('xbox')}
                  className={`w-8 h-8 transition-all duration-300 hover:scale-110 ${
                    selectedPlatform.includes('Xbox Series X') || selectedPlatform.includes('Xbox One') || selectedPlatform.includes('Xbox 360')
                      ? 'opacity-100 transform scale-110'
                      : 'opacity-50 hover:opacity-75'
                  }`}
                  title="Xbox"
                >
                  <img 
                    src="/assets/icons/xbox.svg" 
                    alt="Xbox" 
                    className="w-full h-full text-gray-800 dark:text-white"
                  />
                </button>

                {/* Nintendo Switch */}
                <button
                  onClick={() => handlePlatformQuickFilter('nintendo-switch')}
                  className={`w-8 h-8 transition-all duration-300 hover:scale-110 ${
                    selectedPlatform.includes('Nintendo Switch')
                      ? 'opacity-100 transform scale-110'
                      : 'opacity-50 hover:opacity-75'
                  }`}
                  title="Nintendo Switch"
                >
                  <img 
                    src="/assets/icons/nintendo-switch.svg" 
                    alt="Nintendo Switch" 
                    className="w-full h-full text-gray-800 dark:text-white"
                  />
                </button>

                {/* macOS */}
                <button
                  onClick={() => handlePlatformQuickFilter('mac')}
                  className={`w-8 h-8 transition-all duration-300 hover:scale-110 ${
                    selectedPlatform.includes('macOS')
                      ? 'opacity-100 transform scale-110'
                      : 'opacity-50 hover:opacity-75'
                  }`}
                  title="macOS"
                >
                  <img 
                    src="/assets/icons/mac-os.svg" 
                    alt="macOS" 
                    className="w-full h-full text-gray-800 dark:text-white"
                  />
                </button>


              </div>

              {/* Sort By (separate control) */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">Sort by</span>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-orange-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2"
                >
                  <option value="released">Newest First</option>
                  <option value="relevance">Relevance</option>
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  {activeStore === 'rawg' && (
                    <>
                      <option value="metacritic">Highest Metacritic</option>
                      <option value="added">Most Popular</option>
                    </>
                  )}
                  {activeStore === 'cheapshark' && (
                    <>
                      <option value="price-low">Best Deals</option>
                      <option value="rating">Highest Rated</option>
                    </>
                  )}
                </select>
                {/* Store-specific sorting info */}
                <div className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                  {activeStore === 'cheapshark' && '💰 Price-focused'}
                  {activeStore === 'mock' && '🎯 Curated'}
                </div>
              </div>

              {/* Clear Filters Button */}
              <div className="flex-shrink-0">
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Active Filters Display (filters only) */}
            {(selectedGenre.length > 0 || selectedPlatform.length > 0 || localPriceRange.min || localPriceRange.max) && (
              <div className="flex flex-wrap gap-2">
                {selectedGenre.length > 0 && (
                  <>
                    {selectedGenre.map((genre) => (
                      <span key={genre} className="text-xs px-3 py-2 rounded-full font-medium flex items-center border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200">
                        <span className="mr-1">🎮</span>
                        {genre}
                        <button
                          onClick={() => handleGenreChange(selectedGenre.filter(g => g !== genre))}
                          className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full w-4 h-4 flex items-center justify-center transition-colors duration-200"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </>
                )}
                {selectedPlatform.length > 0 && (
                  <>
                    {selectedPlatform.map((platform) => (
                      <span key={platform} className="text-xs px-3 py-2 rounded-full font-medium flex items-center border bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800">
                        <span className="mr-1">🖥️</span>
                        {platform}
                        <button
                          onClick={() => handlePlatformChange(selectedPlatform.filter(p => p !== platform))}
                          className="ml-2 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 hover:bg-green-200 dark:hover:bg-green-800 rounded-full w-4 h-4 flex items-center justify-center transition-colors duration-200"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </>
                )}
                
                {(localPriceRange.min || localPriceRange.max) && (
                  <span className="text-xs px-3 py-2 rounded-full font-medium flex items-center border bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800">
                    <span className="mr-1">💰</span>
                    ${localPriceRange.min || '0'} - ${localPriceRange.max || '∞'}
                    <button
                      onClick={() => handlePriceRangeChange({ min: '', max: '' })}
                      className="ml-2 text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-800 rounded-full w-4 h-4 flex items-center justify-center transition-colors duration-200"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Games Display */}
          <div className="mb-8">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-white mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading games...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Games</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                <button
                  onClick={() => fetchGames()}
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : visibleGames && visibleGames.length > 0 ? (
              <>
                {/* Games Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-[2000px] mx-auto">
                  {visibleGames.map((game) => (
                    <div key={game.id} className="flex justify-center">
                      <GameCard 
                        game={game} 
                        activeFilters={{ 
                          platforms: selectedPlatform, 
                          genres: selectedGenre,
                          priceRange: localPriceRange 
                        }} 
                      />
                    </div>
                  ))}
                </div>
                
                {/* Loading More Indicator */}
                {hasMoreGames && (
                  <div ref={loadingRef} className="text-center py-8">
                    {isLoadingMore ? (
                      <Loader />
                    ) : (
                      <div className="text-gray-600 dark:text-gray-400">
                        <p>Scroll down to load more games...</p>
                      </div>
                    )}
                  </div>
                )}

                {/* No More Games Message */}
                {!hasMoreGames && (
                  <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                    <p>End of results</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎮</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Games Found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Try adjusting your search terms, filters, or platform selection.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedGenre([]);
                    setSelectedPlatform([]);
                    setLocalPriceRange({ min: '', max: '' });
                    setLocalSortBy('released');
                  }}
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}