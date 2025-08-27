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
    { name: "HOME", path: "/" },
    { name: "LIVE", path: "/live" },
    { name: "FEATURES", path: "/features" },
    { name: "SHOP", path: "/games" },
    { name: "BLOG", path: "/blog" },
    { name: "CONTACT", path: "/contact" }
  ];

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Mobile Menu - Full Screen Popup */}
      <div className={`fixed inset-0 bg-gray-900 dark:bg-black z-50 lg:hidden transform transition-all duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-blue-600 dark:bg-blue-700">
          <div className="flex items-center space-x-2">
            {/* Logo Icon */}
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            
            {/* Logo Text */}
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-white">
                GAMING
              </span>
              <span className="text-xs font-medium text-blue-100 uppercase tracking-wider">
                STORE
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors p-2"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 flex items-center justify-center">
          <ul className="space-y-6 text-center">
            {links.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  onClick={handleLinkClick}
                  className={`block py-4 px-8 text-3xl font-bold tracking-wider transition-all duration-200 ${
                    location.pathname === link.path
                      ? 'text-blue-400 dark:text-orange-400 underline decoration-2 underline-offset-4'
                      : 'text-white hover:text-blue-400 dark:hover:text-orange-400 hover:scale-105'
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="p-6 border-t border-gray-700">
          <div className="space-y-6">
            {/* Theme Toggle - Centered */}
            <div className="flex justify-center">
              <ThemeToggle />
            </div>



            {/* Login/Signup - Clickable Text */}
            <div className="flex justify-center space-x-8 text-center">
              <Link to="/login" onClick={handleLinkClick}>
                <span className="text-white hover:text-blue-400 dark:hover:text-orange-400 transition-colors duration-200 text-lg font-medium cursor-pointer">
                  Login
                </span>
              </Link>
              <Link to="/signup" onClick={handleLinkClick}>
                <span className="text-white hover:text-blue-400 dark:hover:text-orange-400 transition-colors duration-200 text-lg font-medium cursor-pointer">
                  Signup
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
