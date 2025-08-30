import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { useCartStore, useAuthStore } from '../../stores';
import ThemeToggle from "../ThemeToggle";

export default function MobileMenu({ isOpen, onClose }) {
  const location = useLocation();
  const { getCartItemCount } = useCartStore();
  const { isLoggedIn, user, logout } = useAuthStore();
  
  const links = [
    { name: "HOME", path: "/", icon: "🏠" },
    { name: "LIVE", path: "/live", icon: "🔴" },
    { name: "FEATURES", path: "/features", icon: "⭐" },
    { name: "SHOP", path: "/games", icon: "🛒" },
    { name: "DEALS", path: "/deals", icon: "💰" },

    { name: "DEBUG", path: "/debug", icon: "🐛" },
    { name: "BLOG", path: "/blog", icon: "📝" },
    { name: "CONTACT", path: "/contact", icon: "📞" }
  ];

  const handleLinkClick = () => {
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Mobile Menu - Slide from right */}
      <div className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 z-50 lg:hidden transform transition-transform duration-300 ease-out shadow-2xl ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        {/* Header */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                  GAMING
                </span>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                  STORE
                </span>
              </div>
            </div>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  onClick={handleLinkClick}
                  className={`group flex items-center space-x-4 p-3 rounded-lg transition-all duration-200 ${
                    location.pathname === link.path
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {/* Icon */}
                  <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                    {link.icon}
                  </span>
                  
                  {/* Text */}
                  <span className="text-base font-medium">
                    {link.name}
                  </span>
                  
                  {/* Active indicator */}
                  {location.pathname === link.path && (
                    <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="space-y-4">
            {/* Theme Toggle */}
            <div className="flex justify-center">
              <div className="bg-white dark:bg-gray-700 rounded-lg p-2 border border-gray-200 dark:border-gray-600">
                <ThemeToggle />
              </div>
            </div>

            {/* User Actions */}
            <div className="flex flex-col space-y-3">
              {isLoggedIn ? (
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                      {user?.name || 'User'}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md text-xs font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Link 
                    to="/login" 
                    onClick={handleLinkClick}
                    className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium text-center transition-colors"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    onClick={handleLinkClick}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg text-sm font-medium text-center transition-colors shadow-sm"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Cart Summary */}
            <div className="text-center">
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('openCartSummary'));
                  onClose();
                }}
                className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                <span>Cart ({getCartItemCount()})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
