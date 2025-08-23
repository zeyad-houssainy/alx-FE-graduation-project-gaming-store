import React, { useState } from 'react';
import { fetchGames, fetchStores, testAPIConnectivity } from '../services/cheapsharkApi';

export default function ApiTest() {
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testCheapSharkAPI = async () => {
    setLoading(true);
    setError(null);
    setTestResults(null);

    try {
      console.log('🧪 Testing CheapShark API...');
      
      // Test 0: Test API connectivity first
      console.log('🔌 Testing API connectivity...');
      const connectivity = await testAPIConnectivity();
      console.log('🔌 Connectivity test result:', connectivity);
      
      if (!connectivity.success) {
        throw new Error(`API connectivity failed: ${connectivity.message}`);
      }
      
      // Test 1: Fetch stores
      console.log('📦 Testing stores API...');
      const stores = await fetchStores();
      console.log('🏪 Stores result:', stores);
      
      // Test 2: Fetch games with search
      console.log('🎮 Testing games API...');
      const games = await fetchGames({
        search: 'Cyberpunk',
        page: 1,
        pageSize: 5,
        sortBy: 'relevance'
      });
      console.log('🎯 Games result:', games);
      
      setTestResults({
        connectivity: connectivity,
        stores: stores,
        games: games,
        timestamp: new Date().toISOString()
      });
      
      console.log('✅ API test completed successfully!');
      
    } catch (err) {
      console.error('❌ API test failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        🧪 CheapShark API Test
      </h2>
      
      <div className="mb-6">
        <button
          onClick={testCheapSharkAPI}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          {loading ? '🔄 Testing...' : '🚀 Test CheapShark API'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
            ❌ API Test Failed
          </h3>
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {testResults && (
        <div className="space-y-6">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
              ✅ API Test Successful
            </h3>
            <p className="text-green-600 dark:text-green-400">
              Test completed at: {new Date(testResults.timestamp).toLocaleString()}
            </p>
          </div>

          {/* Connectivity Results */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">
              🔌 API Connectivity Test
            </h4>
            <div className="text-sm text-blue-600 dark:text-blue-300">
              <p><strong>Status:</strong> {testResults.connectivity.success ? '✅ Connected' : '❌ Failed'}</p>
              <p><strong>Message:</strong> {testResults.connectivity.message}</p>
              {testResults.connectivity.storesCount && (
                <p><strong>Stores Available:</strong> {testResults.connectivity.storesCount}</p>
              )}
            </div>
          </div>

          {/* Stores Results */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              🏪 Stores API Results
            </h4>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p><strong>Total Stores:</strong> {testResults.stores.length}</p>
              <p><strong>Active Stores:</strong> {testResults.stores.filter(s => s.isActive).length}</p>
              <div className="mt-2">
                <strong>Sample Stores:</strong>
                <ul className="list-disc list-inside mt-1">
                  {testResults.stores.slice(0, 5).map(store => (
                    <li key={store.id}>
                      {store.name} {store.isActive ? '✅' : '❌'}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Games Results */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              🎮 Games API Results
            </h4>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p><strong>Total Games Found:</strong> {testResults.games.count}</p>
              <p><strong>Games on Current Page:</strong> {testResults.games.games.length}</p>
              <p><strong>Total Pages:</strong> {testResults.games.totalPages}</p>
              <div className="mt-2">
                <strong>Sample Games:</strong>
                <ul className="list-disc list-inside mt-1">
                  {testResults.games.games.slice(0, 3).map(game => (
                    <li key={game.id}>
                      {game.name} - ${game.price} (Rating: {game.rating}/5)
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Raw Data */}
          <details className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <summary className="text-lg font-semibold text-gray-900 dark:text-white cursor-pointer">
              📊 Raw API Response Data
            </summary>
            <div className="mt-3">
              <pre className="text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto max-h-96">
                {JSON.stringify(testResults, null, 2)}
              </pre>
            </div>
          </details>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          🔍 What This Test Does
        </h3>
        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
          <li>• Tests the CheapShark stores API endpoint</li>
          <li>• Tests the CheapShark games search API endpoint</li>
          <li>• Verifies data transformation and formatting</li>
          <li>• Shows detailed logging in the browser console</li>
          <li>• Displays results in a user-friendly format</li>
        </ul>
      </div>
    </div>
  );
}
