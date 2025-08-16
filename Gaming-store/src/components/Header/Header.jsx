// src/components/Header.jsx
import Logo from "./Logo";
import NavBar from "./NavBar";
import News from "./News";
import Utility from "./Utility";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#1c191d]/95 backdrop-blur-sm border-b border-yellow-500/20">
      <News />
      <div className="flex justify-between items-center px-6 py-4 relative">
        {/* Decorative Background Element */}
        <div className="absolute top-0 left-0 w-48 h-full bg-gradient-to-r from-yellow-500/10 to-transparent transform -skew-x-12 -translate-x-8"></div>
        
        <Logo />
        <NavBar />
        <Utility />
      </div>
    </header>
  );
}
