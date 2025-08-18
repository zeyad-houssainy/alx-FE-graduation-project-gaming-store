// src/components/Header.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import NavBar from "./NavBar";
import News from "./News";
import Utility from "./Utility";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-lg">
      <News />
      <div className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 relative">
        {/* Decorative Background Element */}
        <div className="absolute top-0 left-0 w-48 h-full bg-gradient-to-r from-blue-50 dark:from-blue-900/20 to-transparent transform -skew-x-12 -translate-x-8 hidden lg:block"></div>
        
        <Link to="/" className="z-10">
          <Logo />
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:block">
          <NavBar />
        </div>
        
        {/* Desktop Utility */}
        <div className="hidden lg:flex">
          <Utility />
        </div>
        
        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden z-20 p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-orange-400 transition-colors"
          aria-label="Toggle mobile menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      
      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  );
}
