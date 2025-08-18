import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import ThemeToggle from "../ThemeToggle";

export default function MobileMenu({ isOpen, onClose }) {
  const location = useLocation();
  const { getCartItemCount } = useCart();
  
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
      
      {/* Mobile Menu */}
      <div className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-6">
          <ul className="space-y-4">
            {links.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  onClick={handleLinkClick}
                  className={`block py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-200 ${
                    location.pathname === link.path
                      ? 'bg-blue-600 dark:bg-orange-500 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-orange-400'
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Utility Section */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-4">
            {/* Login/Signup Buttons */}
            <div className="flex flex-col space-y-3">
              <Link to="/login" onClick={handleLinkClick}>
                <button className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-orange-400 px-4 py-3 rounded-lg font-medium text-sm uppercase tracking-wider transition-all duration-300 hover:text-blue-600 dark:hover:text-orange-400 hover:shadow-md">
                  Login
                </button>
              </Link>
              <Link to="/signup" onClick={handleLinkClick}>
                <button className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-orange-400 px-4 py-3 rounded-lg font-medium text-sm uppercase tracking-wider transition-all duration-300 hover:text-blue-600 dark:hover:text-orange-400 transform hover:scale-105 shadow-sm hover:shadow-md">
                  Signup
                </button>
              </Link>
            </div>

            {/* Theme Toggle */}
            <div className="flex justify-center">
              <ThemeToggle />
            </div>

            {/* Cart Button */}
            <Link to="/cart" onClick={handleLinkClick}>
              <button className="w-full group relative p-4 hover:text-blue-600 dark:hover:text-orange-400 transition-all duration-300 transform hover:scale-110 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-orange-400 rounded-lg">
                <div className="flex items-center justify-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                  <span className="font-medium">Cart</span>
                  {getCartItemCount() > 0 && (
                    <span className="bg-blue-600 dark:bg-orange-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] h-[20px] flex items-center justify-center font-bold font-['Oxanium'] shadow-lg shadow-blue-600/30 dark:shadow-orange-500/30">
                      {getCartItemCount()}
                    </span>
                  )}
                </div>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
