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
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Fetch data
  const { games, loading, error, pagination } = useFetchGames(
    currentPage, 
    12, 
    debouncedSearchTerm, 
    selectedGenre, 
    selectedPlatform
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
  }, [selectedGenre, selectedPlatform]);

  const handleSearch = () => {
    setDebouncedSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre === selectedGenre ? '' : genre);
  };

  const handlePlatformChange = (platform) => {
    setSelectedPlatform(platform === selectedPlatform ? '' : platform);
  };

  const handleClearFilters = () => {
    setSelectedGenre('');
    setSelectedPlatform('');
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setCurrentPage(1);
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

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
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

            {/* Games Grid */}
            <div className="lg:col-span-3">
              {/* Results Count */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600 dark:text-gray-300">
                  Showing {games.length} of {pagination.count} games
                </p>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Page {currentPage} of {totalPages}
                </div>
              </div>

              {/* Loading State */}
              {loading && <Loader />}

              {/* Games Grid */}
              {!loading && games.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
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
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
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
      </div>
      <Footer />
    </>
  );
}
