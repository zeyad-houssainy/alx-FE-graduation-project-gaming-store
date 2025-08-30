// src/components/Utility.jsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useCartStore, useAuthStore } from "../../stores";
import SearchOverlay from "./SearchOverlay";
import ThemeToggle from "../ThemeToggle";

export default function Utility() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { getCartItemCount } = useCartStore();
  const { isLoggedIn, user, logout } = useAuthStore();
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
    window.dispatchEvent(new CustomEvent('openCartSummary'));
  };

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
  };

  return (
    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 relative z-10">
      {/* Search Button */}
      <button
        onClick={() => setSearchOpen(true)}
        className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-orange-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {/* Cart Button */}
      <button
        onClick={handleCartClick}
        className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-orange-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
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



      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Auth Section */}
      {!isLoggedIn ? (
        <div className="flex items-center gap-2">
          {/* Login Button */}
          <Link to="/login">
            <button className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-orange-400 transition-colors font-medium">
              Sign In
            </button>
          </Link>

          {/* Signup Button */}
          <Link to="/signup">
            <button className="px-4 py-2 bg-blue-600 dark:bg-orange-500 hover:bg-blue-700 dark:hover:bg-orange-600 text-white rounded-lg font-medium transition-colors">
              Sign Up
            </button>
          </Link>
        </div>
      ) : (
        /* Profile Menu */
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-600 dark:bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-base">
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-10 h-10 rounded-full object-cover"
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
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 animate-scale-in">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                {/* Profile Image in Dropdown */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-blue-600 dark:bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      user?.name?.charAt(0)?.toUpperCase() || 'U'
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="py-2">
                <Link
                  to="/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  My Profile
                </Link>
                
                <Link
                  to="/debug"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <img src="/assets/icons/bug.svg" alt="Debug" className="w-4 h-4" />
                  Debug
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search Overlay */}
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </div>
  );
}
