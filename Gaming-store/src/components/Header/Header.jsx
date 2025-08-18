// src/components/Header.jsx
import { Link } from "react-router-dom";
import Logo from "./Logo";
import NavBar from "./NavBar";
import News from "./News";
import Utility from "./Utility";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <News />
      <div className="flex justify-between items-center px-6 py-4 relative">
        {/* Decorative Background Element */}
        <div className="absolute top-0 left-0 w-48 h-full bg-gradient-to-r from-blue-50 to-transparent transform -skew-x-12 -translate-x-8"></div>
        
        <Link to="/">
          <Logo />
        </Link>
        <NavBar />
        <Utility />
      </div>
    </header>
  );
}
