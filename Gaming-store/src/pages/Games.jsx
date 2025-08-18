import { useState, useEffect } from 'react';
import { useFetchGames, useFetchGenres, useFetchPlatforms } from '../hooks/useFetchGames';
import GameCard from '../components/GameCard';
import SearchBar from '../components/SearchBar';
import FilterMenu from '../components/FilterMenu';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

export default function Games() {
  // Initialize states from localStorage if available
  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = localStorage.getItem('gaming-current-page');
    return savedPage ? parseInt(savedPage) : 1;
  });
  
  const [searchTerm, setSearchTerm] = useState(() => {
    const savedSearch = localStorage.getItem('gaming-search-term');
    return savedSearch || '';
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
    
    // Clear localStorage
    localStorage.removeItem('gaming-selected-genres');
    localStorage.removeItem('gaming-selected-platforms');
    localStorage.removeItem('gaming-sort-by');
    localStorage.removeItem('gaming-search-term');
    localStorage.removeItem('gaming-current-page');
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.ceil(pagination.count / 12);

  if (error) {
    return (
      <>
        <Header />
                 <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 sm:pt-24">
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
             <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 sm:pt-24">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Page Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-['Oxanium'] mb-4 sm:mb-6 text-gray-900 dark:text-gray-100">
              GAME <span className="text-blue-600 dark:text-orange-400">STORE</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed px-4">
              Discover thousands of games across all platforms. Find your next adventure today!
            </p>
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
                <span className="text-sm text-gray-600 dark:text-gray-300">Sort by</span>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500"
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
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
                      <span key={genre} className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs px-3 py-2 rounded-full font-medium flex items-center border border-blue-200 dark:border-blue-800">
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
                      <span key={platform} className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs px-3 py-2 rounded-full font-medium flex items-center border border-green-200 dark:border-green-800">
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

          {/* Results Count */}
          <div className="flex justify-between sm:justify-end items-center">
            <p className="text-gray-600 dark:text-gray-300 text-sm sm:hidden">
              {games.length} of {pagination.count} games
            </p>
            <div className="text-right">
              <p className="text-gray-600 dark:text-gray-300 text-sm hidden sm:block">
                Showing {games.length} of {pagination.count} games
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          </div>

          {/* Games Grid */}
          <div className="w-full">
            {/* Loading State */}
            {loading && <Loader />}

            {/* Games Grid */}
            {!loading && games.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {games.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && games.length === 0 && (
              <div className="text-center py-12">
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
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
