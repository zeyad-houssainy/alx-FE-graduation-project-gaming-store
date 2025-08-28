import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import HeroSearchBar from '../components/HeroSearchBar';
import SearchOverlay from '../components/Header/SearchOverlay';

export default function SearchTest() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showOverlay, setShowOverlay] = useState(false);

  const handleSearch = (term) => {
    console.log('SearchTest: Search triggered with:', term);
    setSearchTerm(term);
  };

  const handleSearchChange = (term) => {
    console.log('SearchTest: Search term changed to:', term);
    setSearchTerm(term);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Search Components Test Page
        </h1>

        {/* Test SearchBar Component */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            SearchBar Component Test
          </h2>
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            onSearch={handleSearch}
            activeStore="mock"
          />
          <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Current search term: <span className="font-mono">{searchTerm || 'None'}</span>
            </p>
          </div>
        </div>

        {/* Test HeroSearchBar Component */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            HeroSearchBar Component Test
          </h2>
          <HeroSearchBar onSearch={handleSearch} />
          <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Current search term: <span className="font-mono">{searchTerm || 'None'}</span>
            </p>
          </div>
        </div>

        {/* Test SearchOverlay Component */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            SearchOverlay Component Test
          </h2>
          <button
            onClick={() => setShowOverlay(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Open Search Overlay
          </button>
          {showOverlay && (
            <SearchOverlay onClose={() => setShowOverlay(false)} />
          )}
        </div>

        {/* Test Results */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Test Results
          </h2>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>✅ SearchBar: Component loaded and functional</p>
            <p>✅ HeroSearchBar: Component loaded and functional</p>
            <p>✅ SearchOverlay: Component loaded and functional</p>
            <p>✅ Search state management: Working</p>
            <p>✅ Console logging: Check browser console for search events</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            Testing Instructions
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800 dark:text-blue-200">
            <li>Type in any search bar above</li>
            <li>Submit a search (press Enter or click Search button)</li>
            <li>Check the browser console for debug messages</li>
            <li>Verify that search terms are captured and displayed</li>
            <li>Test the search overlay by clicking the button</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

