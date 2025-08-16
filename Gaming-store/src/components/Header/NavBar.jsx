// src/components/NavBar.jsx
export default function NavBar() {
  const links = ["Home", "Live", "Features", "Shop", "Blog", "Contact"];
  return (
    <nav className="relative z-10">
      <ul className="flex gap-8 text-white uppercase font-bold font-['Oxanium'] text-sm tracking-wider">
        {links.map((link, index) => (
          <li key={link} className="relative group">
            <a
              href={`#${link.toLowerCase()}`}
              className="relative block px-4 py-3 hover:text-yellow-500 transition-all duration-300 transform hover:scale-105"
            >
              {/* Background skew effect */}
              <div className="absolute inset-0 bg-yellow-500 transform -skew-x-12 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left opacity-20"></div>
              
              {/* Text */}
              <span className="relative z-10">{link}</span>
              
              {/* Active indicator for home */}
              {index === 0 && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-yellow-500"></div>
              )}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
