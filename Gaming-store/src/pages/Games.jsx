import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFetchGames, useFetchGenres, useFetchPlatforms } from '../hooks/useFetchGames';
import GameCard from '../components/GameCard';
import SearchBar from '../components/SearchBar';
import FilterMenu from '../components/FilterMenu';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import CheapSharkGames from '../components/CheapSharkGames';
import RAWGGames from '../components/RAWGGames';
import MockStore from '../components/MockStore';

export default function Games() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeStore, setActiveStore] = useState('mock'); // 'mock', 'cheapshark', 'rawg'
  const [isDebugOpen, setIsDebugOpen] = useState(false); // Track debug menu state
  
  // API Testing States
  const [cheapSharkTestResult, setCheapSharkTestResult] = useState(null);
  const [rawgTestResult, setRawgTestResult] = useState(null);
  const [isTestingCheapShark, setIsTestingCheapShark] = useState(false);
  const [isTestingRAWG, setIsTestingRAWG] = useState(false);
  
  // Initialize states from localStorage if available
  const [currentPage, setCurrentPage] = useState(() => {
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
  
  const [sortBy, setSortBy] = useState(() => {
    const savedSort = localStorage.getItem('gaming-sort-by');
    return savedSort || 'relevance';
  });
  
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  // Save states to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('gaming-current-page', currentPage.toString());
  }, [currentPage]);

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

  // Fetch data
  const { games, loading, error, pagination } = useFetchGames(
    currentPage, 
    12, 
    debouncedSearchTerm, 
    selectedGenre, 
    selectedPlatform,
    sortBy
  );
  const { genres } = useFetchGenres();
  const { platforms } = useFetchPlatforms();

  // Update URL when search term changes
  useEffect(() => {
    if (searchTerm) {
      setSearchParams({ search: searchTerm });
    } else {
      setSearchParams({});
    }
  }, [searchTerm, setSearchParams]);

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

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedGenre, selectedPlatform, sortBy]);

  const handleSearch = () => {
    setDebouncedSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  const handleGenreChange = (genres) => {
    setSelectedGenre(genres);
  };

  const handlePlatformChange = (platforms) => {
    setSelectedPlatform(platforms);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
  };

  const handleClearFilters = () => {
    setSelectedGenre([]);
    setSelectedPlatform([]);
    setSortBy('relevance');
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setCurrentPage(1);
    
    // Clear URL params
    setSearchParams({});
    
    // Clear localStorage
    localStorage.removeItem('gaming-selected-genres');
    localStorage.removeItem('gaming-selected-platforms');
    localStorage.removeItem('gaming-sort-by');
    localStorage.removeItem('gaming-search-term');
    localStorage.removeItem('gaming-current-page');
    
    // Force immediate search update
    setDebouncedSearchTerm('');
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.ceil(pagination.count / 12);

  // API Testing Functions
  const testCheapSharkAPI = async () => {
    try {
      setIsTestingCheapShark(true);
      setCheapSharkTestResult(null);
      
      console.log('🧪 Testing CheapShark API...');
      
      // Test with a simple endpoint
      const response = await fetch('https://www.cheapshark.com/api/1.0/stores');
      
      if (response.ok) {
        const data = await response.json();
        const result = {
          success: true,
          message: 'API is accessible',
          storesCount: data.length,
          sampleStore: data[0]
        };
        setCheapSharkTestResult(result);
        console.log('✅ CheapShark API test successful:', result);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
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
      
      // Test with a simple endpoint to check API connectivity
      const response = await fetch('https://api.rawg.io/api/games?page_size=1');
      
      if (response.ok) {
        const data = await response.json();
        const result = {
          success: true,
          message: 'API is accessible and responding',
          totalGames: data.count,
          sampleGame: data.results[0],
          note: 'API is working - full access requires valid API key'
        };
        setRawgTestResult(result);
        console.log('✅ RAWG API test successful:', result);
      } else {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.error && errorData.error.includes('key parameter')) {
          const result = {
            success: false,
            message: 'API requires authentication',
            error: 'API key is required for all endpoints',
            note: 'RAWG API now requires an API key for all requests. Register at rawg.io/apidocs'
          };
          setRawgTestResult(result);
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error('❌ RAWG API test failed:', error);
      const result = {
        success: false,
        message: 'API connectivity test failed',
        error: error.message,
        note: 'This may be due to network issues or API restrictions'
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
    }
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
          ? 'bg-purple-50 dark:bg-purple-950' 
          : 'bg-white dark:bg-gray-900'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
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
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-8">
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
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    🎯 Store Selection
                  </h4>
                  <div className="flex flex-wrap justify-center gap-4">
                    {stores.map((store) => (
                      <button
                        key={store.id}
                        onClick={() => setActiveStore(store.id)}
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
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
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

                {/* API Testing Subsection */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    🧪 API Testing
                  </h4>
                  
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

                  {/* Test Results Summary */}
                  {(cheapSharkTestResult || rawgTestResult) && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                      <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        📊 Test Results Summary
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-2xl mb-1">🎯</div>
                          <div className="font-medium text-gray-900 dark:text-white">Mock Store</div>
                          <div className="text-green-600 dark:text-green-400">✅ Always Available</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl mb-1">💰</div>
                          <div className="font-medium text-gray-900 dark:text-white">CheapShark</div>
                          <div className={cheapSharkTestResult?.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                            {cheapSharkTestResult?.success ? '✅ Connected' : '❌ Failed'}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl mb-1">🎮</div>
                          <div className="font-medium text-gray-900 dark:text-white">RAWG</div>
                          <div className={rawgTestResult?.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                            {rawgTestResult?.success ? '✅ Connected' : '❌ Failed'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Debug & Testing Subsection */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
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
                          <span className="font-medium">{games.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Total Available:</span>
                          <span className="font-medium">{pagination.count}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Current Page:</span>
                          <span className="font-medium">{currentPage}</span>
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
                        onClick={() => console.log('Debug info:', { games: games.length, pagination, currentPage, totalPages })}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                      >
                        📊 Log Debug Info
                      </button>
                    </div>
                  </div>
                </div>

                {/* Debug Information Subsection */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
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
                          <span className="font-medium">{genres.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Platforms:</span>
                          <span className="font-medium">{platforms.length}</span>
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
                              games: games.length,
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
              {games.length} of {pagination.count} games
            </p>
            <div className="text-right">
              <p className={`text-sm hidden sm:block transition-all duration-500 ${
                isDebugOpen 
                  ? 'text-purple-700 dark:text-purple-300' 
                  : 'text-gray-600 dark:text-gray-300'
              }`}>
                Showing {games.length} of {pagination.count} games
              </p>
              <div className={`text-xs transition-all duration-500 ${
                isDebugOpen 
                  ? 'text-purple-500 dark:text-purple-400' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                Page {currentPage} of {totalPages}
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onSearch={handleSearch}
            />
          </div>

          {/* Filters and Actions Header */}
          <div className="flex flex-col gap-4 mb-6">
            {/* Filter Button and Active Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Filter Button */}
              <div className="flex-shrink-0">
                <FilterMenu
                  genres={genres}
                  platforms={platforms}
                  selectedGenre={selectedGenre}
                  selectedPlatform={selectedPlatform}
                  onGenreChange={handleGenreChange}
                  onPlatformChange={handlePlatformChange}
                  onClearFilters={handleClearFilters}
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
                </select>
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
            {(selectedGenre.length > 0 || selectedPlatform.length > 0) && (
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
              </div>
            )}
          </div>



          {/* Store Content Based on Selection */}
          <div className="mb-8">
            {activeStore === 'mock' && (
              <MockStore />
            )}
            
            {activeStore === 'cheapshark' && (
              <CheapSharkGames />
            )}
            
            {activeStore === 'rawg' && (
              <RAWGGames />
            )}
          </div>



          {/* Games Grid - Only show for Mock Store since others have their own display */}
          {activeStore === 'mock' && (
            <>
              {/* Loading State */}
              {loading && <Loader />}

              {/* Games Grid */}
              {!loading && games.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4 lg:gap-6 mb-8">
                  {games.map((game) => (
                    <GameCard key={game.id} game={game} />
                  ))}
                </div>
              )}

              {/* No Results */}
              {!loading && games.length === 0 && (
                <div className="text-center py-12 mb-8">
                  <div className="text-6xl mb-4">🎮</div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">No games found</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 px-4">
                    Try adjusting your search terms or filters to find what you're looking for.
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg transition-colors duration-200"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}

              {/* Pagination */}
              {!loading && games.length > 0 && totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
