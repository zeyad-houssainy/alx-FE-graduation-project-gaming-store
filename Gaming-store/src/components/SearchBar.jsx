import React from 'react';

export default function SearchBar({ 
  searchTerm = '', 
  onSearchChange, 
  onSearch, 
  placeholder = "Search games...",
  className = ""
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedTerm = (searchTerm || '').trim();
    if (trimmedTerm) {
      onSearch(trimmedTerm);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    onSearchChange(value);
  };

  // Ensure searchTerm is always a string
  const safeSearchTerm = searchTerm || '';

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative" role="search">
        <input
          type="text"
          value={safeSearchTerm}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-12 pr-32 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 focus:border-blue-500 dark:focus:border-orange-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 font-medium transition-colors"
          role="searchbox"
          aria-label="Search for games"
        />
        
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <button
          type="submit"
          disabled={!safeSearchTerm.trim()}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-blue-600 dark:bg-orange-500 hover:bg-blue-700 dark:hover:bg-orange-600 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Search games"
        >
          Search
        </button>
      </form>
    </div>
  );
}
