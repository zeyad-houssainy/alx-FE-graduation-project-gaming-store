import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { useCartStore } from '../../stores';
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../ThemeToggle";

export default function MobileMenu({ isOpen, onClose }) {
  const location = useLocation();
  const { getCartItemCount } = useCartStore();
  const { isLoggedIn, user, logout } = useAuth();
  
  const links = [
    { name: "HOME", path: "/", icon: "🏠" },
    { name: "LIVE", path: "/live", icon: "🔴" },
    { name: "FEATURES", path: "/features", icon: "⭐" },
    { name: "SHOP", path: "/games", icon: "🛒" },
    { name: "DEALS", path: "/deals", icon: "💰" },
    { name: "BLOG", path: "/blog", icon: "📝" },
    { name: "CONTACT", path: "/contact", icon: "📞" }
  ];

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
             {/* Mobile Menu - Full Screen */}
       <div className={`fixed inset-0 bg-black/80 backdrop-blur-md z-50 lg:hidden transform transition-all duration-500 ease-out ${
         isOpen ? 'translate-y-0' : 'translate-y-full'
       }`}>
        
        {/* Header with gradient */}
        <div className="relative p-6 bg-gradient-to-br from-gray-900/90 to-black/90 border-b border-gray-700/50">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
          </div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Modern Logo Icon */}
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              
              {/* Logo Text */}
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white tracking-tight">
                  GAMING
                </span>
                <span className="text-xs font-medium text-gray-300 uppercase tracking-widest">
                  STORE
                </span>
              </div>
            </div>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-10 h-10 bg-gray-800/50 hover:bg-gray-700/70 rounded-full flex items-center justify-center text-gray-300 hover:text-white transition-all duration-200 hover:scale-110 border border-gray-600/30"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-6">
          <ul className="space-y-2">
            {links.map((link, index) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  onClick={handleLinkClick}
                  className={`group flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    location.pathname === link.path
                      ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 text-blue-300'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/30 border border-transparent hover:border-gray-600/30'
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: isOpen ? 'slideInUp 0.5s ease-out forwards' : 'none'
                  }}
                >
                  {/* Icon */}
                  <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                    {link.icon}
                  </span>
                  
                  {/* Text */}
                  <span className={`text-lg font-semibold tracking-wide ${
                    location.pathname === link.path ? 'text-blue-300' : 'text-gray-300 group-hover:text-white'
                  }`}>
                    {link.name}
                  </span>
                  
                  {/* Active indicator */}
                  {location.pathname === link.path && (
                    <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="p-6 border-t border-gray-700/50 bg-gray-900/30">
          <div className="space-y-6">
            {/* Theme Toggle */}
            <div className="flex justify-center">
              <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-600/30">
                <ThemeToggle />
              </div>
            </div>

            {/* User Actions */}
            <div className="flex justify-center space-x-4">
              {isLoggedIn ? (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="text-gray-300 text-sm font-medium">
                    {user?.name || 'User'}
                  </span>
                  <button
                    onClick={logout}
                    className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 rounded-lg border border-red-500/30 transition-all duration-200 text-sm font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    onClick={handleLinkClick}
                    className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/70 text-gray-300 hover:text-white rounded-lg border border-gray-600/30 transition-all duration-200 text-sm font-medium hover:scale-105"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    onClick={handleLinkClick}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 text-sm font-medium hover:scale-105 shadow-lg"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Cart Summary */}
            <div className="text-center">
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('openCartSummary'));
                  onClose();
                }}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/70 text-gray-300 hover:text-white rounded-lg border border-gray-600/30 transition-all duration-200 text-sm font-medium"
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

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
