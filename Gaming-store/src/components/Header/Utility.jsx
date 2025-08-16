// src/components/Utility.jsx
import { useState } from "react";
import SearchOverlay from "./SearchOverlay";

export default function Utility() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="flex items-center gap-6 text-white relative z-10">
      {/* Login Button */}
      <button className="group relative overflow-hidden bg-transparent border border-yellow-500/30 hover:border-yellow-500 px-4 py-2 rounded font-medium text-sm uppercase tracking-wider transition-all duration-300 hover:text-black">
        <span className="absolute inset-0 bg-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
        <span className="relative z-10">Login</span>
      </button>

      {/* Signup Button */}
      <button className="group relative overflow-hidden bg-yellow-500 text-black px-4 py-2 rounded font-medium text-sm uppercase tracking-wider transition-all duration-300 hover:bg-yellow-400 transform hover:scale-105">
        <span className="relative z-10">Signup</span>
      </button>

      {/* Cart Button */}
      <button className="group relative p-3 hover:text-yellow-500 transition-all duration-300 transform hover:scale-110">
        <div className="relative">
          <i className="fas fa-shopping-cart text-xl"></i>
          {/* Cart Badge */}
          <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full min-w-[20px] h-[20px] flex items-center justify-center font-bold font-['Oxanium'] shadow-lg shadow-yellow-500/30">
            0
          </span>
          {/* Glow effect */}
          <div className="absolute inset-0 bg-yellow-500/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-300"></div>
        </div>
      </button>

      {/* Search Button */}
      <button 
        className="group relative p-3 hover:text-yellow-500 transition-all duration-300 transform hover:scale-110"
        onClick={() => setSearchOpen(true)}
      >
        <div className="relative">
          <i className="fas fa-search text-xl"></i>
          {/* Glow effect */}
          <div className="absolute inset-0 bg-yellow-500/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-300"></div>
        </div>
      </button>

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </div>
  );
}
