// src/components/Utility.jsx
import { useState } from "react";
import SearchOverlay from "./SearchOverlay";

export default function Utility() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="flex items-center gap-4 text-white">
      <button>Login</button>
      <button>Signup</button>
      <button className="relative">
        <i className="fas fa-shopping-cart"></i>
        <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs px-1 rounded-full">
          0
        </span>
      </button>
      <button onClick={() => setSearchOpen(true)}>
        <i className="fas fa-search"></i>
      </button>

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </div>
  );
}
