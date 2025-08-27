// src/components/Header.jsx
import { useState } from "react";
import { useCartStore } from "../../stores";
import Logo from "./Logo";
import NavBar from "./NavBar";
import News from "./News";
import Utility from "./Utility";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getCartItemCount } = useCartStore();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <News />
      <div className="flex items-center px-4 sm:px-6 py-4">
        {/* Desktop Layout */}
        <div className="hidden lg:flex w-full items-center justify-center relative">
          {/* Logo on the left */}
          <div className="absolute left-0 flex-shrink-0">
            <Logo />
          </div>
          
          {/* Desktop Navigation - Centered */}
          <div className="flex items-center justify-center">
            <NavBar />
          </div>
          
          {/* Utility on the right */}
          <div className="absolute right-0 flex items-center gap-4">
            <Utility />
          </div>
        </div>
        
        {/* Mobile Layout */}
        <div className="lg:hidden flex-1 flex items-center justify-between">
          {/* Left: Cart Button */}
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

          {/* Center: Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Logo />
          </div>

          {/* Right: Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className={`p-2.5 transition-all duration-300 rounded-xl border ${
              isMobileMenuOpen 
                ? 'bg-blue-600/20 text-blue-600 border-blue-500/30' 
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-orange-400 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-orange-400'
            } hover:scale-105`}
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
      
      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  );
}
