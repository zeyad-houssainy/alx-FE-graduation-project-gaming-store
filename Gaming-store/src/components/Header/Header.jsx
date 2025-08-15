// src/components/Header.jsx
import Logo from "./Logo";
import NavBar from "./NavBar";
import News from "./News";
import Utility from "./Utility";

export default function Header() {
  return (
    <header className="bg-gray-800">
      <div className="flex justify-between items-center px-6 py-4">
        <Logo />
        <NavBar />
        <Utility />
      </div>
      <News />
    </header>
  );
}
