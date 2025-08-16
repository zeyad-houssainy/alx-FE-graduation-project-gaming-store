// src/components/Utility.jsx
import { useState } from "react";
import SearchOverlay from "./SearchOverlay";

export default function Utility() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="flex items-center gap-6 text-gray-700 relative z-10">
      {/* Login Button */}
      <button className="group relative overflow-hidden bg-transparent border border-blue-200 hover:border-blue-600 px-4 py-2 rounded-lg font-medium text-sm uppercase tracking-wider transition-all duration-300 hover:text-white hover:shadow-md">
        <span className="absolute inset-0 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
        <span className="relative z-10">Login</span>
      </button>

      {/* Signup Button */}
      <button className="group relative overflow-hidden bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm uppercase tracking-wider transition-all duration-300 hover:bg-blue-700 transform hover:scale-105 shadow-sm hover:shadow-md">
        <span className="relative z-10">Signup</span>
      </button>

      {/* Cart Button */}
      <button className="group relative p-3 hover:text-blue-600 transition-all duration-300 transform hover:scale-110 bg-gray-50 hover:bg-blue-50 rounded-lg">
        <div className="relative">
          <i className="fas fa-shopping-cart text-xl"></i>
          {/* Cart Badge */}
          <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full min-w-[20px] h-[20px] flex items-center justify-center font-bold font-['Oxanium'] shadow-lg shadow-blue-600/30">
            0
          </span>
        </div>
      </button>

      {/* Search Button */}
      <button 
        className="group relative p-3 hover:text-blue-600 transition-all duration-300 transform hover:scale-110 bg-gray-50 hover:bg-blue-50 rounded-lg"
        onClick={() => setSearchOpen(true)}
      >
        <div className="relative">
          <i className="fas fa-search text-xl"></i>
        </div>
      </button>

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </div>
  );
}
