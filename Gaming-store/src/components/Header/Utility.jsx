// src/components/Utility.jsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import SearchOverlay from "./SearchOverlay";
import ThemeToggle from "../ThemeToggle";

export default function Utility() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { getCartItemCount } = useCart();
  const { isLoggedIn, user, logout } = useAuth();
  const profileMenuRef = useRef(null);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  const handleCartClick = (e) => {
    e.preventDefault();
    console.log('Header cart button clicked, dispatching custom event...');
    // Dispatch a custom event to open the sliding cart summary
    window.dispatchEvent(new CustomEvent('openCartSummary'));
    console.log('Custom event dispatched');
  };

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
  };

  return (
    <div className="flex items-center gap-6 text-gray-700 dark:text-gray-300 relative z-10">
      {/* Auth Section - Show Login/Signup or Profile */}
      {!isLoggedIn ? (
        <>
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
        </>
      ) : (
        /* Profile Icon and Menu */
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-orange-500 flex items-center justify-center text-white font-semibold text-sm">
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                user?.name?.charAt(0)?.toUpperCase() || 'U'
              )}
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
              {user?.name || 'User'}
            </span>
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
              </div>
              <Link
                to="/profile"
                onClick={() => setShowProfileMenu(false)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Cart Button */}
      <button 
        onClick={handleCartClick}
        className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 transition-all duration-300 transform hover:scale-110"
      >
        <div className="relative">
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
          </svg>
          {/* Cart Badge - Only show when cart has items */}
          {getCartItemCount() > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-600 dark:bg-orange-500 text-white text-xs px-2 py-1 rounded-lg min-w-[20px] h-[20px] flex items-center justify-center font-bold font-['Oxanium'] shadow-lg shadow-blue-600/30 dark:shadow-orange-500/30">
              {getCartItemCount()}
            </span>
          )}
        </div>
      </button>

      {/* Search Button */}
      <button 
        className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 transition-all duration-300 transform hover:scale-110"
        onClick={() => setSearchOpen(true)}
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </div>
  );
}
