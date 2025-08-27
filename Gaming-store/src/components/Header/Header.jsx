// src/components/Header.jsx
import { useState } from "react";
import { useCartStore } from "../../stores";
import { useGamesStore } from "../../stores/gamesStore";
import Logo from "./Logo";
import NavBar from "./NavBar";
import News from "./News";
import Utility from "./Utility";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { getCartItemCount } = useCartStore();
  const { globalSearch } = useGamesStore();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      try {
        // Navigate to the games page with search query
        const searchUrl = `/games?search=${encodeURIComponent(searchTerm.trim())}`;
        window.location.href = searchUrl;
      } catch (error) {
        console.error('Search error:', error);
        // Still navigate to games page even if search fails
        window.location.href = '/games';
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <News />
      <div className="flex items-center px-4 sm:px-6 py-4">
        {/* Desktop Layout */}
        <div className="hidden lg:flex w-full items-center justify-between">
          {/* Logo on the left */}
          <div className="flex-shrink-0">
            <Logo />
          </div>
          
          {/* Search Bar - Centered */}
          <div className="flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search games across all stores..."
                className="w-full px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 focus:border-blue-500 dark:focus:border-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 dark:hover:text-orange-400 transition-colors"
                aria-label="Search games"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
          
          {/* Desktop Navigation - Right side */}
          <div className="flex items-center gap-4">
            <NavBar />
            <Utility />
          </div>
        </div>
        
        {/* Mobile Layout */}
        <div className="lg:hidden flex-1 flex flex-col gap-3">
          {/* Top row: Logo and Controls */}
          <div className="flex items-center justify-between">
            <Logo />
            
            {/* Mobile Controls */}
            <div className="flex items-center gap-2">
              {/* Mobile Cart Button */}
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('openCartSummary'))}
                className="p-2.5 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-orange-400 transition-colors bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-orange-400"
                aria-label="Open cart summary"
              >
                <div className="relative">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                  {/* Cart Badge */}
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-medium">
                    {getCartItemCount()}
                  </span>
                </div>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="p-2.5 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-orange-400 transition-colors bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-orange-400"
                aria-label="Toggle mobile menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
          
          {/* Bottom row: Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search games across all stores..."
              className="w-full px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 focus:border-blue-500 dark:focus:border-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 dark:hover:text-orange-400 transition-colors"
              aria-label="Search games"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  );
}
