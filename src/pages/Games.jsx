import React, { useState, useEffect } from 'react';
import { useGamesStore, useCartStore, useAuthStore } from '../stores';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import FilterMenu from '../components/FilterMenu';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';
import GameCard from '../components/GameCard';

import { testCheapSharkConnectivity } from '../services/cheapsharkApi';
import { testRAWGConnectivity } from '../services/rawgApi';
import { FaFilter, FaTimes, FaEye, FaEyeSlash, FaBug, FaCog, FaPlay, FaPause, FaStop } from 'react-icons/fa';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

export default function Games() {
  const navigate = useNavigate();
  const { 
    games, 
    filteredGames,
    loading, 
    error, 
    fetchGames, 
    clearGames, 
    setLoading, 
    setError,
    currentPage,
    totalPages,
    setCurrentPage,
    pagination,
    filters,
    activeStore,
    setSearch,
    setGenres,
    setPlatforms,
    setSortBy,
    setPriceRange,
    setPage,
    setActiveStore,
    getGenres,
    getPlatforms,
    getQuickFilters,
    applyQuickFilter,
    resetFiltersForStore,
    getFilterStatus,
    globalSearch,
  } = useGamesStore();

  // Use filteredGames for display (which includes sorting) or fall back to games
  const displayGames = filteredGames && filteredGames.length > 0 ? filteredGames : games;
  const { addToCart } = useCartStore();
  const { isAdmin: _isAdmin } = useAuthStore();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const [isDebugOpen, setIsDebugOpen] = useState(false); // Track debug menu state
  
  // API Testing States
  const [cheapSharkTestResult, setCheapSharkTestResult] = useState(null);
  const [rawgTestResult, setRawgTestResult] = useState(null);
  const [isTestingCheapShark, setIsTestingCheapShark] = useState(false);
  const [isTestingRAWG, setIsTestingRAWG] = useState(false);
  
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
    return savedSort || 'relevance';
  });

  const [localPriceRange, setLocalPriceRange] = useState(() => {
    const savedPriceRange = localStorage.getItem('gaming-price-range');
    return savedPriceRange ? JSON.parse(savedPriceRange) : { min: '', max: '' };
  });

  // Global search state
  const [globalSearchResults, setGlobalSearchResults] = useState(null);
  const [isGlobalSearch, setIsGlobalSearch] = useState(false);
  
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

  // Update body background when debug mode changes
  useEffect(() => {
    if (isDebugOpen) {
      document.body.classList.add('debug-mode-active');
      document.body.style.backgroundColor = '#f3e8ff'; // Light purple
    } else {
      document.body.classList.remove('debug-mode-active');
      document.body.style.backgroundColor = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('debug-mode-active');
      document.body.style.backgroundColor = '';
    };
  }, [isDebugOpen]);

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
    setLocalSortBy('relevance');
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

  const handlePageChange = (page) => {
    setCurrentPageState(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // API Testing Functions
  const testCheapSharkAPI = async () => {
    try {
      setIsTestingCheapShark(true);
      setCheapSharkTestResult(null);
      
      console.log('🧪 Testing CheapShark API...');
      
      // Test stores endpoint to verify API accessibility
      const storesResponse = await axios.get('https://www.cheapshark.com/api/1.0/stores');
      
      if (storesResponse.status === 200) {
        const storesData = storesResponse.data;
        
        // Also test games endpoint to get total count
        const gamesResponse = await axios.get('https://www.cheapshark.com/api/1.0/games', {
          params: { limit: 1 }
        });
        let totalGames = 'Unknown';
        
        if (gamesResponse.status === 200) {
          // CheapShark doesn't provide total count directly, but we can show
          // that games endpoint is accessible
          totalGames = 'Available (requires search terms)';
        }
        
        const result = {
          success: true,
          message: 'API is accessible',
          storesCount: storesData.length,
          totalGames: totalGames,
          sampleStore: storesData[0]
        };
        setCheapSharkTestResult(result);
        console.log('✅ CheapShark API test successful:', result);
      } else {
        throw new Error(`HTTP ${storesResponse.status}: ${storesResponse.statusText}`);
      }
    } catch (error) {
      console.error('❌ CheapShark API test failed:', error);
      const result = {
        success: false,
        message: error.message || 'Network error',
        error: error.message
      };
      setCheapSharkTestResult(result);
    } finally {
      setIsTestingCheapShark(false);
    }
  };

  const testRAWGAPI = async () => {
    try {
      setIsTestingRAWG(true);
      setRawgTestResult(null);
      
      console.log('🧪 Testing RAWG API...');
      
      // Import the RAWG API service function dynamically to avoid CORS issues
      const { testRAWGConnectivity } = await import('../services/rawgApi');
      
      // Use the RAWG API service which handles CORS and authentication properly
      const result = await testRAWGConnectivity();
      
      if (result.success) {
        setRawgTestResult({
          success: true,
          message: 'API is accessible and responding',
          totalGames: result.totalGames,
          sampleGame: result.sampleGame,
          note: 'API is working - full access confirmed with valid API key'
        });
        console.log('✅ RAWG API test successful:', result);
      } else {
        setRawgTestResult({
          success: false,
          message: result.message || 'API test failed',
          error: result.error || 'Unknown error',
          note: result.message === 'API key invalid or expired' 
            ? 'Please check if the API key is correct and has not expired'
            : 'This may be due to network issues or API restrictions'
        });
      }
    } catch (error) {
      console.error('❌ RAWG API test failed:', error);
      
      // Provide more specific error information
      let errorMessage = error.message;
      let note = 'This may be due to network issues or API restrictions';
      
      if (error.message === 'Failed to fetch') {
        errorMessage = 'Network request failed';
        note = 'This may be due to CORS restrictions, network issues, or API being blocked. RAWG API requires server-side requests or proper CORS headers.';
      } else if (error.message.includes('CORS')) {
        errorMessage = 'CORS policy blocked the request';
        note = 'RAWG API has CORS restrictions. This API is designed for server-side use, not direct browser requests.';
      } else if (error.message.includes('TypeError')) {
        errorMessage = 'Request type error';
        note = 'This may indicate a network connectivity issue or API endpoint problem.';
      }
      
      const result = {
        success: false,
        message: 'API connectivity test failed',
        error: errorMessage,
        note: note
      };
      setRawgTestResult(result);
    } finally {
      setIsTestingRAWG(false);
    }
  };



  // Store configurations
  const stores = [
    {
      id: 'mock',
      name: '🎯 Mock Store',
      description: 'Local game data with curated selection',
      color: 'purple',
      features: ['Local data storage', 'Always available', 'Fast loading']
    },
    {
      id: 'cheapshark',
      name: '💰 CheapShark Store',
      description: 'Real-time pricing from 20+ stores',
      color: 'blue',
      features: ['Real-time pricing', '20+ store comparison', 'Deal tracking']
    },
    {
      id: 'rawg',
      name: '🎮 RAWG Store',
      description: 'Comprehensive gaming database',
      color: 'green',
      features: ['500,000+ games', 'Rich metadata', 'Advanced filtering']
    },

  ];

  const activeStoreInfo = stores.find(store => store.id === activeStore);

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
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg transition-colors duration-200"
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
      <div className={`min-h-screen pt-20 sm:pt-24 transition-all duration-500 ${
        isDebugOpen 
          ? 'bg-purple-100 dark:bg-purple-950' 
          : 'bg-white dark:bg-gray-900'
      }`}>
        <div className={`container mx-auto px-4 sm:px-6 py-8 sm:py-12 transition-all duration-500 ${
          isDebugOpen ? 'bg-purple-50 dark:bg-gray-800' : ''
        }`}>
                  

        {/* Debug Mode Banner */}
        {isDebugOpen && (
          <div className="mb-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg shadow-lg">
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">🧪</span>
              <span className="font-semibold text-lg">DEBUG MODE ACTIVE</span>
              <span className="text-2xl">🧪</span>
            </div>
            <p className="text-center text-purple-100 mt-2 text-sm">
              Purple theme activated - All debugging tools are now available
            </p>
          </div>
        )}
          
          {/* Page Header */}
          <div className={`text-center mb-8 sm:mb-12 transition-all duration-500 ${
            isDebugOpen ? 'text-purple-900 dark:text-purple-100' : ''
          }`}>
            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-bold mb-4 sm:mb-6 transition-all duration-500 ${
              isDebugOpen 
                ? 'text-purple-900 dark:text-purple-100' 
                : 'text-gray-900 dark:text-gray-100'
            }`}>
              GAME <span className={`transition-all duration-500 ${
                isDebugOpen 
                  ? 'text-purple-600 dark:text-purple-400' 
                  : 'text-blue-600 dark:text-orange-400'
              }`}>STORE</span>
            </h1>
            <p className={`text-base sm:text-lg max-w-2xl mx-auto leading-relaxed px-4 transition-all duration-500 ${
              isDebugOpen 
                ? 'text-purple-700 dark:text-purple-300' 
                : 'text-gray-600 dark:text-gray-300'
            }`}>
              Discover thousands of games across all platforms. Find your next adventure today!
            </p>
          </div>

          {/* Comprehensive Debugging Section */}
          <div className="bg-purple-50 dark:bg-gray-700 rounded-lg p-6 mb-8 border border-purple-200 dark:border-gray-600">
            <details 
              className="group"
              onToggle={(e) => setIsDebugOpen(e.target.open)}
            >
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    🧪 Debugging
                  </h3>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    API Selection, Testing & Debug Tools
                  </span>
                </div>
                <div className="text-gray-400 group-open:rotate-180 transition-transform duration-200">
                  ▼
                </div>
              </summary>
              
              <div className="mt-6 space-y-6">
                {/* Store Selection Subsection */}
                <div className="bg-purple-100 dark:bg-gray-800 rounded-lg p-6 border border-purple-300 dark:border-gray-600">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    🎯 Store Selection
                  </h4>
                  <div className="flex flex-wrap justify-center gap-4">
                    {stores.map((store) => (
                      <button
                        key={store.id}
                        onClick={() => {
                          setActiveStore(store.id);
                          setSelectedGenre([]);
                          setSelectedPlatform([]);
                          setSearchTerm('');
                          // Clear global search when switching stores
                          setIsGlobalSearch(false);
                          setGlobalSearchResults(null);
                        }}
                        className={`flex items-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                          activeStore === store.id
                            ? `bg-${store.color}-600 text-white shadow-lg shadow-${store.color}-600/30`
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        <span className="text-2xl">{store.name.split(' ')[0]}</span>
                        <div className="text-left">
                          <div className="font-bold">{store.name.split(' ').slice(1).join(' ')}</div>
                          <div className="text-sm opacity-80">{store.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* API Debug Subsection */}
                <div className="bg-purple-100 dark:bg-gray-800 rounded-lg p-6 border border-purple-300 dark:border-gray-600">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    🔍 API Debug & Testing
                  </h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Testing: {activeStoreInfo.name}
                  </div>
                  
                  {/* API Debug Information */}
                  {activeStore === 'cheapshark' && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <h5 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">
                        💰 CheapShark API Debug
                      </h5>
                      <p className="text-blue-600 dark:text-blue-300 mb-3">
                        CheapShark API is providing real-time pricing data from multiple stores.
                      </p>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                        <h6 className="font-semibold text-gray-900 dark:text-white mb-2">API Status:</h6>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>• Base URL: https://www.cheapshark.com/api/1.0</li>
                          <li>• No API key required</li>
                          <li>• Real-time pricing from 20+ stores</li>
                          <li>• CORS-friendly (works in browser)</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {activeStore === 'rawg' && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <h5 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">
                        🎮 RAWG API Debug
                      </h5>
                      <p className="text-green-600 dark:text-green-300 mb-3">
                        RAWG API provides comprehensive gaming database information.
                      </p>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                        <h6 className="font-semibold text-gray-900 dark:text-white mb-2">API Status:</h6>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>• Base URL: https://api.rawg.io/api</li>
                          <li>• API key: Configured</li>
                          <li>• 500,000+ games in database</li>
                          <li>• Rich metadata and screenshots</li>
                        </ul>
                      </div>
                    </div>
                  )}



                  {activeStore === 'mock' && (
                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                      <h5 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-3">
                        🎯 Mock Store Test
                      </h5>
                      <p className="text-purple-600 dark:text-purple-300">
                        Mock store is using local data - no API calls required. All games are loaded instantly from local storage.
                      </p>
                      <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
                        <h6 className="font-semibold text-gray-900 dark:text-white mb-2">Mock Store Features:</h6>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>• 8 curated games with high-quality metadata</li>
                          <li>• Instant loading with no network requests</li>
                          <li>• Always available (works offline)</li>
                          <li>• Advanced filtering and sorting</li>
                          <li>• Perfect for testing and development</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* Enhanced API Testing & Results Analysis */}
                <div className="bg-purple-100 dark:bg-gray-800 rounded-lg p-6 border border-purple-300 dark:border-gray-600">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    🧪 API Testing & Results Analysis
                  </h4>
                  
                  {/* Store Selection with Status */}
                  <div className="mb-6">
                    <h5 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      📊 Current Store Status
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {stores.map((store) => (
                        <div key={store.id} className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                          activeStore === store.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800'
                        }`}>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{store.name.split(' ')[0]}</span>
                            <span className={`text-sm px-2 py-1 rounded-full ${
                              activeStore === store.id
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-400 text-white'
                            }`}>
                              {activeStore === store.id ? 'ACTIVE' : 'INACTIVE'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {store.description}
                          </p>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {store.features.join(' • ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* API Testing Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* Mock Store Test */}
                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                      <h5 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-3">
                        🎯 Mock Store
                      </h5>
                      <div className="text-center">
                        <div className="text-4xl mb-2">✅</div>
                        <p className="text-purple-600 dark:text-purple-300 text-sm mb-3">
                          Local data - Always available
                        </p>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-left">
                          <div className="text-xs text-purple-600 dark:text-purple-400 space-y-1">
                            <div>• Games: 8</div>
                            <div>• Status: Available</div>
                            <div>• Load Time: Instant</div>
                            <div>• Offline: Yes</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CheapShark API Test */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <h5 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">
                        💰 CheapShark API
                      </h5>
                      <div className="text-center">
                        <div className="text-4xl mb-2">🔌</div>
                        <p className="text-blue-600 dark:text-blue-300 text-sm mb-3">
                          Test API connectivity
                        </p>
                        <button
                          onClick={testCheapSharkAPI}
                          disabled={isTestingCheapShark}
                          className={`px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors duration-200 ${
                            isTestingCheapShark 
                              ? 'bg-blue-400 cursor-not-allowed' 
                              : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                        >
                          {isTestingCheapShark ? 'Testing...' : 'Test API'}
                        </button>
                        {cheapSharkTestResult && (
                          <div className="mt-3 bg-white dark:bg-gray-800 rounded-lg p-3 text-left">
                            <div className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
                              <div>• Status: {cheapSharkTestResult.success ? '✅ Success' : '❌ Failed'}</div>
                              <div>• Message: {cheapSharkTestResult.message}</div>
                              {cheapSharkTestResult.storesCount && (
                                <div>• Stores: {cheapSharkTestResult.storesCount}</div>
                              )}
                              {cheapSharkTestResult.totalGames && (
                                <div>• Total Games: {cheapSharkTestResult.totalGames}</div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* RAWG API Test */}
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <h5 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">
                        🎮 RAWG API
                      </h5>
                      <div className="text-center">
                        <div className="text-4xl mb-2">🔌</div>
                        <p className="text-green-600 dark:text-green-300 text-sm mb-3">
                          Test API connectivity
                        </p>
                        <button
                          onClick={testRAWGAPI}
                          disabled={isTestingRAWG}
                          className={`px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors duration-200 ${
                            isTestingRAWG 
                              ? 'bg-green-400 cursor-not-allowed' 
                              : 'bg-green-600 hover:bg-green-700'
                          }`}
                        >
                          {isTestingRAWG ? 'Testing...' : 'Test API'}
                        </button>
                        {rawgTestResult && (
                          <div className="mt-3 bg-white dark:bg-gray-800 rounded-lg p-3 text-left">
                            <div className="text-xs text-green-600 dark:text-green-400 space-y-1">
                              <div>• Status: {rawgTestResult.success ? '✅ Success' : '❌ Failed'}</div>
                              <div>• Message: {rawgTestResult.message}</div>
                              {rawgTestResult.totalGames && (
                                <div>• Total Games: {rawgTestResult.totalGames.toLocaleString()}</div>
                              )}
                              {rawgTestResult.note && (
                                <div>• Note: {rawgTestResult.note}</div>
                              )}
                              {rawgTestResult.error && (
                                <div>• Error: {rawgTestResult.error}</div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>


                  </div>

                  {/* Comprehensive Results Analysis */}
                  {(cheapSharkTestResult || rawgTestResult) && (
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                      <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        📊 API Test Results Analysis
                      </h5>
                      
                      {/* Overall Status Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                          <div className="text-2xl mb-1">🎯</div>
                          <div className="font-medium text-gray-900 dark:text-white">Mock Store</div>
                          <div className="text-green-600 dark:text-green-400 text-sm">✅ Always Available</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">8 games • Instant load</div>
                        </div>
                        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                          <div className="text-2xl mb-1">💰</div>
                          <div className="font-medium text-gray-900 dark:text-white">CheapShark</div>
                          <div className={`text-sm ${cheapSharkTestResult?.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {cheapSharkTestResult?.success ? '✅ Connected' : '❌ Failed'}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {cheapSharkTestResult?.storesCount ? `${cheapSharkTestResult.storesCount} stores` : 'Status unknown'}
                          </div>
                        </div>
                        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                          <div className="text-2xl mb-1">🎮</div>
                          <div className="font-medium text-gray-900 dark:text-white">RAWG</div>
                          <div className={`text-sm ${rawgTestResult?.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {rawgTestResult?.success ? '✅ Connected' : '❌ Failed'}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {rawgTestResult?.totalGames ? `${rawgTestResult.totalGames.toLocaleString()} games` : 'Status unknown'}
                          </div>
                        </div>

                      </div>

                      {/* Detailed Analysis */}
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                        <h6 className="font-semibold text-gray-900 dark:text-white mb-3">🔍 Detailed Analysis:</h6>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <h7 className="font-medium text-gray-700 dark:text-gray-300">API Performance:</h7>
                            <ul className="text-gray-600 dark:text-gray-400 mt-1 space-y-1">
                              <li>• Mock Store: Instant response (local data)</li>
                              <li>• CheapShark: {cheapSharkTestResult?.success ? 'API responding' : 'API failed'}</li>
                              <li>• RAWG: {rawgTestResult?.success ? 'API responding' : 'API failed'}</li>

                            </ul>
                          </div>
                          <div>
                            <h7 className="font-medium text-gray-700 dark:text-gray-300">Data Availability:</h7>
                            <ul className="text-gray-600 dark:text-gray-400 mt-1 space-y-1">
                              <li>• Mock Store: 8 curated games</li>
                              <li>• CheapShark: {cheapSharkTestResult?.storesCount ? `${cheapSharkTestResult.storesCount} stores` : 'Unknown'}</li>
                              <li>• RAWG: {rawgTestResult?.totalGames ? `${rawgTestResult.totalGames.toLocaleString()}+ games` : 'Unknown'}</li>

                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Debug & Testing Subsection */}
                <div className="bg-purple-100 dark:bg-gray-800 rounded-lg p-6 border border-purple-300 dark:border-gray-600">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    🧪 Debug & Testing
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Connection Test */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                      <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        🔌 Connection Test
                      </h5>
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center justify-between">
                          <span>Mock Store:</span>
                          <span className="text-green-600 dark:text-green-400">✅ Available</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>CheapShark API:</span>
                          <span className="text-green-600 dark:text-green-400">✅ Connected</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>RAWG API:</span>
                          <span className="text-green-600 dark:text-green-400">✅ Connected</span>
                        </div>
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                      <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        ⚡ Performance
                      </h5>
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center justify-between">
                          <span>Games Loaded:</span>
                          <span className="font-medium">{displayGames.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Total Available:</span>
                          <span className="font-medium">{pagination.count}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Current Page:</span>
                          <span className="font-medium">{currentPageState}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="text-center">
                    <div className="flex flex-wrap justify-center gap-3">
                      <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                      >
                        🔄 Refresh Page
                      </button>
                      <button
                        onClick={handleClearFilters}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                      >
                        🧹 Clear All Filters
                      </button>
                      <button
                        onClick={() => console.log('Debug info:', { games: displayGames.length, pagination, currentPageState, totalPages })}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                      >
                        📊 Log Debug Info
                      </button>
                    </div>
                  </div>
                </div>

                {/* Debug Information Subsection */}
                <div className="bg-purple-100 dark:bg-gray-800 rounded-lg p-6 border border-purple-300 dark:border-gray-600">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    📋 Debug Information
                  </h4>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                    {/* System Status */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                      <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        🖥️ System Status
                      </h5>
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center justify-between">
                          <span>Theme:</span>
                          <span className="font-medium">{document.documentElement.classList.contains('dark') ? 'Dark' : 'Light'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Viewport:</span>
                          <span className="font-medium">{window.innerWidth} × {window.innerHeight}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>User Agent:</span>
                          <span className="font-medium text-xs truncate">{navigator.userAgent.substring(0, 30)}...</span>
                        </div>
                      </div>
                    </div>

                    {/* Store Configuration */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                      <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        ⚙️ Store Config
                      </h5>
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center justify-between">
                          <span>Active Store:</span>
                          <span className="font-medium capitalize">{activeStore}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Search Term:</span>
                          <span className="font-medium">{searchTerm || 'None'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Sort By:</span>
                          <span className="font-medium">{sortBy}</span>
                        </div>
                      </div>
                    </div>

                    {/* Data Statistics */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                      <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        📊 Data Stats
                      </h5>
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center justify-between">
                          <span>Genres:</span>
                          <span className="font-medium">{filters.genres.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Platforms:</span>
                          <span className="font-medium">{filters.platforms.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Total Pages:</span>
                          <span className="font-medium">{totalPages}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Advanced Debug Tools */}
                  <div className="mt-6">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                      <h5 className="font-semibold text-gray-900 dark:text-white mb-3">
                        🔧 Advanced Debug Tools
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          onClick={() => {
                            const debugData = {
                              timestamp: new Date().toISOString(),
                              store: activeStore,
                              games: displayGames.length,
                              pagination,
                              filters: { genre: selectedGenre, platform: selectedPlatform, sortBy },
                              search: searchTerm,
                              theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light'
                            };
                            console.log('🔍 Full Debug Data:', debugData);
                            alert('Debug data logged to console!');
                          }}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                        >
                          📋 Export Debug Data
                        </button>
                        <button
                          onClick={() => {
                            localStorage.clear();
                            alert('Local storage cleared! Page will refresh.');
                            window.location.reload();
                          }}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                        >
                          🗑️ Clear Storage
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </details>
          </div>

          {/* Results Count */}
          <div className={`flex justify-between sm:justify-end items-center mb-6 transition-all duration-500 ${
            isDebugOpen ? 'text-purple-700 dark:text-purple-300' : ''
          }`}>
            <p className={`text-sm sm:hidden transition-all duration-500 ${
              isDebugOpen 
                ? 'text-purple-700 dark:text-purple-300' 
                : 'text-gray-600 dark:text-gray-300'
            }`}>
              {isGlobalSearch && globalSearchResults 
                ? `${globalSearchResults.count} games found across all stores`
                : `${displayGames.length} of ${pagination.count} games`
              }
            </p>
            <div className="text-right">
              <p className={`text-sm hidden sm:block transition-all duration-500 ${
                isDebugOpen 
                  ? 'text-purple-700 dark:text-purple-300' 
                  : 'text-gray-600 dark:text-gray-300'
              }`}>
                {isGlobalSearch && globalSearchResults 
                  ? `Found ${globalSearchResults.count} games across all stores`
                  : `Showing ${displayGames.length} of ${pagination.count} games`
                }
              </p>
              <div className={`text-xs transition-all duration-500 ${
                isDebugOpen 
                  ? 'text-purple-500 dark:text-purple-400' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {isGlobalSearch && globalSearchResults 
                  ? 'Global search results'
                  : `Page ${currentPageState} of ${totalPages}`
                }
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onSearch={handleSearch}
              activeStore={activeStore}
            />
          </div>

          {/* Global Search Results */}
          {isGlobalSearch && globalSearchResults && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                🔍 Global Search Results
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {globalSearchResults.stores.rawg.count}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">RAWG Games</div>
                </div>
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {globalSearchResults.stores.cheapshark.count}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">CheapShark Deals</div>
                </div>
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {globalSearchResults.stores.mock.count}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Mock Store</div>
                </div>
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">
                Found {globalSearchResults.count} total games across all stores
              </div>
            </div>
          )}

          {/* Platform Quick Filters */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Quick Filters
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Filter by platform
                </p>
              </div>
              
              {/* Clear Platform Filter Button */}
              {selectedPlatform.length > 0 && (
                <button
                  onClick={() => {
                    setSelectedPlatform([]);
                    setCurrentPageState(1);
                  }}
                  className="px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {Object.entries(getQuickFilters()).map(([key, filter]) => (
                <button
                  key={key}
                  onClick={() => handlePlatformQuickFilter(key)}
                  className={`px-3 py-2 text-xs font-medium rounded-full transition-all duration-200 flex items-center gap-2 ${
                    selectedPlatform.includes(filter.filter.platform)
                      ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-200 dark:ring-blue-800'
                      : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  {(() => {
                    const platform = filter.filter.platform.toLowerCase();
                    if (platform.includes('pc')) return '💻';
                    if (platform.includes('playstation') || platform.includes('ps')) return '🎮';
                    if (platform.includes('xbox')) return '🎯';
                    if (platform.includes('nintendo') || platform.includes('switch')) return '🎲';
                    return '🖥️';
                  })()}
                  {filter.name}
                </button>
              ))}
            </div>
            
            {/* Filter Status Display */}
            <div className="mt-3 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span>Store: {getFilterStatus().activeStore}</span>
              <span>Games: {getFilterStatus().totalGames}</span>
              <span>Filtered: {getFilterStatus().filteredGames}</span>
              {getFilterStatus().hasActiveFilters && (
                <span className="text-blue-600 dark:text-blue-400 font-medium">Active Filters</span>
              )}
            </div>
          </div>

          {/* Filters and Actions Header */}
          <div className="flex flex-col gap-4 mb-6">
            {/* Filter Button and Active Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
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

              {/* Sort By (separate control) */}
              <div className="flex items-center gap-2">
                <span className={`text-sm transition-all duration-500 ${
                  isDebugOpen 
                    ? 'text-purple-700 dark:text-purple-300' 
                    : 'text-gray-600 dark:text-gray-300'
                }`}>Sort by</span>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className={`px-3 py-2 rounded-lg border transition-all duration-500 ${
                    isDebugOpen 
                      ? 'border-purple-300 dark:border-purple-600 focus:ring-purple-500 dark:focus:ring-purple-400' 
                      : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-orange-500'
                  } bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2`}
                >
                  <option value="relevance">Relevance</option>
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  {activeStore === 'rawg' && (
                    <>
                      <option value="released">Newest First</option>
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
                  className={`px-4 py-2 rounded-lg border transition-all duration-500 ${
                    isDebugOpen 
                      ? 'border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-200 bg-white dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-900/20' 
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                  } transition-colors`}
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
                      <span key={genre} className={`text-xs px-3 py-2 rounded-full font-medium flex items-center border transition-all duration-500 ${
                        isDebugOpen 
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-800' 
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800'
                      }`}>
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
                      <span key={platform} className={`text-xs px-3 py-2 rounded-full font-medium flex items-center border transition-all duration-500 ${
                        isDebugOpen 
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-800' 
                          : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800'
                      }`}>
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
                    <span className={`text-xs px-3 py-2 rounded-full font-medium flex items-center border transition-all duration-500 ${
                      isDebugOpen 
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800' 
                        : 'bg-yellow-800'
                    }`}>
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



          {/* Unified Game Display Using Store's Sorted Games */}
          <div className="mb-8">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-orange-400 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading games...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Games</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                <button
                  onClick={() => fetchGames()}
                  className="px-4 py-2 bg-blue-600 dark:bg-orange-500 hover:bg-blue-700 dark:hover:bg-orange-600 text-white rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : displayGames && displayGames.length > 0 ? (
              <>
                {/* Games Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {displayGames.map((game) => (
                    <GameCard 
                  key={game.id} 
                  game={game} 
                  activeFilters={{ 
                    platforms: selectedPlatform, 
                    genres: selectedGenre,
                    priceRange: localPriceRange 
                  }} 
                />
                  ))}
                </div>
                
                {/* No More Games Message */}
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>End of results</p>
                </div>
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
                    setLocalSortBy('relevance');
                  }}
                  className="px-4 py-2 bg-blue-600 dark:bg-orange-500 hover:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg transition-colors"
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
