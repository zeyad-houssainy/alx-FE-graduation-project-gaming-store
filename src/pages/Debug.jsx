import React, { useState, useEffect } from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { FaBug, FaCode, FaDatabase, FaGlobe, FaServer, FaExclamationTriangle, FaCheckCircle, FaStore, FaGamepad, FaSearch, FaFilter, FaSort } from 'react-icons/fa';

const Debug = () => {
  const [systemInfo, setSystemInfo] = useState({});
  const [apiStatus, setApiStatus] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Debug functionality from shop page
  const [cheapSharkTestResult, setCheapSharkTestResult] = useState(null);
  const [rawgTestResult, setRawgTestResult] = useState(null);
  const [isTestingCheapShark, setIsTestingCheapShark] = useState(false);
  const [isTestingRAWG, setIsTestingRAWG] = useState(false);

  useEffect(() => {
    // Collect system information
    const info = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      screenResolution: `${screen.width}x${screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      referrer: document.referrer || 'Direct access'
    };
    setSystemInfo(info);

    // Test API connectivity
    testAPIs();
  }, []);

  const testAPIs = async () => {
    const apis = {};
    
    try {
      // Test CheapShark API
      const cheapSharkResponse = await fetch('https://www.cheapshark.com/api/1.0/stores');
      apis.cheapShark = {
        status: cheapSharkResponse.ok ? 'success' : 'error',
        statusCode: cheapSharkResponse.status,
        message: cheapSharkResponse.ok ? 'API accessible' : `HTTP ${cheapSharkResponse.status}`,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      apis.cheapShark = {
        status: 'error',
        statusCode: 'N/A',
        message: error.message,
        timestamp: new Date().toISOString()
      };
    }

    try {
      // Test RAWG API (if you have an API key)
      const rawgResponse = await fetch('https://api.rawg.io/api/platforms?key=demo');
      apis.rawg = {
        status: rawgResponse.ok ? 'success' : 'error',
        statusCode: rawgResponse.status,
        message: rawgResponse.ok ? 'API accessible' : `HTTP ${rawgResponse.status}`,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      apis.rawg = {
        status: 'error',
        statusCode: 'N/A',
        message: error.message,
        timestamp: new Date().toISOString()
      };
    }

    setApiStatus(apis);
    setLoading(false);
  };

  // API Testing Functions from shop page
  const testCheapSharkAPI = async () => {
    try {
      setIsTestingCheapShark(true);
      setCheapSharkTestResult(null);
      
      console.log('🧪 Testing CheapShark API...');
      
      // Import the CheapShark API service function dynamically to avoid CORS issues
      const { testCheapSharkConnectivity } = await import('../services/cheapsharkApi');
      
      // Use the CheapShark API service which handles CORS and authentication properly
      const result = await testCheapSharkConnectivity();
      
      if (result.success) {
        setCheapSharkTestResult({
          success: true,
          message: 'API is accessible and responding',
          storesCount: result.storesCount,
          totalGames: result.totalGames || 'Available (requires search terms)',
          sampleStore: result.sampleStore,
          note: 'CheapShark API is working correctly'
        });
        console.log('✅ CheapShark API test successful:', result);
      } else {
        setCheapSharkTestResult({
          success: false,
          message: result.message || 'API test failed',
          error: result.error || 'Unknown error',
          note: result.note || 'This may be due to network issues or API restrictions'
        });
      }
    } catch (error) {
      console.error('❌ CheapShark API test failed:', error);
      
      // Provide more specific error information
      let errorMessage = error.message;
      let note = 'This may be due to network issues or API restrictions';
      
      if (error.message === 'Failed to fetch') {
        errorMessage = 'Network request failed';
        note = 'This may be due to CORS restrictions, network issues, or API being blocked. CheapShark API requires proper network access.';
      } else if (error.message.includes('CORS')) {
        errorMessage = 'CORS policy blocked the request';
        note = 'CheapShark API has CORS restrictions. This API is designed for server-side use, not direct browser requests.';
      } else if (error.message.includes('TypeError')) {
        errorMessage = 'Request type error';
        note = 'This may indicate a network connectivity issue or API endpoint problem.';
      }
      
      const result = {
        success: false,
        message: errorMessage,
        error: error.message,
        note: note
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <FaCheckCircle className="text-green-500" />;
      case 'error':
        return <FaExclamationTriangle className="text-red-500" />;
      default:
        return <FaExclamationTriangle className="text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-yellow-600 dark:text-yellow-400';
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 dark:border-orange-400 mx-auto"></div>
            <p className="text-gray-900 dark:text-gray-100 text-xl mt-4">Loading debug information...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="relative z-10 pt-20 sm:pt-24">
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          {/* Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-red-400 via-orange-500 to-yellow-400 dark:from-red-900 dark:via-orange-800 dark:to-yellow-900 min-h-[40vh] flex items-center">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-1/4 left-1/4 w-64 h-64 border-2 border-red-300 rotate-45 rounded-full animate-pulse"></div>
              <div className="absolute top-3/4 right-1/4 w-48 h-48 border-2 border-orange-300 rotate-12 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
            </div>
            
            <div className="relative z-10 container mx-auto px-4 py-16">
              <div className="text-center max-w-4xl mx-auto">
                <div className="mb-8">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 dark:bg-gray-800/20 rounded-full mb-6 backdrop-blur-md">
                    <FaBug className="text-6xl text-white dark:text-gray-200" />
                  </div>
                  <h1 className="text-5xl md:text-6xl font-black mb-4 text-white drop-shadow-2xl">
                    DEBUG MODE
                  </h1>
                  <div className="w-32 h-2 bg-white/30 mx-auto rounded-full animate-pulse shadow-lg"></div>
                </div>
                
                <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto leading-relaxed font-medium drop-shadow-lg">
                  System diagnostics, API status, and debugging information for developers
                </p>
              </div>
            </div>
          </div>

          {/* Debug Content */}
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-6xl mx-auto space-y-8">
              
              {/* API Status Section */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <FaGlobe className="text-3xl text-blue-600 dark:text-blue-400" />
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">API Status</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(apiStatus).map(([apiName, status]) => (
                    <div key={apiName} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white capitalize">
                          {apiName} API
                        </h3>
                        {getStatusIcon(status.status)}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Status:</span>
                          <span className={`font-semibold ${getStatusColor(status.status)}`}>
                            {status.status === 'success' ? 'Online' : 'Offline'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Code:</span>
                          <span className="font-mono text-sm">{status.statusCode}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Message:</span>
                          <span className="text-sm text-gray-700 dark:text-gray-300 max-w-32 truncate" title={status.message}>
                            {status.message}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Time:</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(status.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Information Section */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <FaServer className="text-3xl text-green-600 dark:text-green-400" />
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">System Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(systemInfo).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className="text-sm text-gray-900 dark:text-white font-mono break-all">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Debug Tools Section */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <FaCode className="text-3xl text-purple-600 dark:text-purple-400" />
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Debug Tools</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Console Logs</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Check browser console for detailed logs and error messages
                    </p>
                    <button 
                      onClick={() => console.log('Debug: Manual console log test')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Test Console Log
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Local Storage</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      View stored application data and settings
                    </p>
                    <button 
                      onClick={() => {
                        const data = {};
                        for (let i = 0; i < localStorage.length; i++) {
                          const key = localStorage.key(i);
                          if (key) {
                            try {
                              data[key] = JSON.parse(localStorage.getItem(key) || '');
                            } catch {
                              data[key] = localStorage.getItem(key);
                            }
                          }
                        }
                        console.log('Local Storage Data:', data);
                        alert('Local storage data logged to console');
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      View Storage
                    </button>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <FaDatabase className="text-3xl text-orange-600 dark:text-orange-400" />
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Performance Metrics</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600 text-center">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {performance.now().toFixed(2)}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">Performance Time (ms)</div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600 text-center">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                      {navigator.hardwareConcurrency || 'N/A'}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">CPU Cores</div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600 text-center">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                      {navigator.deviceMemory || 'N/A'}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">Device Memory (GB)</div>
                  </div>
                </div>
              </div>

              {/* Comprehensive API Testing Section */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <FaGlobe className="text-3xl text-purple-600 dark:text-purple-400" />
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Comprehensive API Testing</h2>
                </div>
                
                <div className="space-y-6">
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
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Debug;
