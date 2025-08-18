// src/components/Utility.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import SearchOverlay from "./SearchOverlay";
import ThemeToggle from "../ThemeToggle";

export default function Utility() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { getCartItemCount } = useCart();

  const handleCartClick = (e) => {
    e.preventDefault();
    console.log('Header cart button clicked, dispatching custom event...');
    // Dispatch a custom event to open the sliding cart summary
    window.dispatchEvent(new CustomEvent('openCartSummary'));
    console.log('Custom event dispatched');
  };

  return (
    <div className="flex items-center gap-6 text-gray-700 dark:text-gray-300 relative z-10">
      {/* Login Button */}
      <Link to="/login">
        <button className="group relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-orange-400 px-4 py-2 rounded-lg font-medium text-sm uppercase tracking-wider transition-all duration-300 hover:text-blue-600 dark:hover:text-orange-400 hover:shadow-md">
          <span className="relative z-10">Login</span>
        </button>
      </Link>

      {/* Signup Button */}
      <Link to="/signup">
        <button className="group relative overflow-hidden bg-blue-600 dark:bg-blue-700 border border-blue-600 dark:border-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 px-4 py-2 rounded-lg font-medium text-sm uppercase tracking-wider transition-all duration-300 text-white transform hover:scale-105 shadow-sm hover:shadow-md">
          <span className="relative z-10">Signup</span>
        </button>
      </Link>

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Cart Button */}
      <button 
        onClick={handleCartClick}
        className="group relative p-3 hover:text-blue-600 dark:hover:text-orange-400 transition-all duration-300 transform hover:scale-110 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-orange-400 rounded-lg"
      >
        <div className="relative">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
          </svg>
          {/* Cart Badge - Only show when cart has items */}
          {getCartItemCount() > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-600 dark:bg-orange-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] h-[20px] flex items-center justify-center font-bold font-['Oxanium'] shadow-lg shadow-blue-600/30 dark:shadow-orange-500/30">
              {getCartItemCount()}
            </span>
          )}
        </div>
      </button>

      {/* Search Button */}
      <button 
        className="group relative p-3 hover:text-blue-600 dark:hover:text-orange-400 transition-all duration-300 transform hover:scale-110 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-orange-400 rounded-lg"
        onClick={() => setSearchOpen(true)}
      >
        <div className="relative">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </button>

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </div>
  );
}
