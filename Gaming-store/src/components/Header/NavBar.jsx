// src/components/NavBar.jsx
import { Link, useLocation } from "react-router-dom";

export default function NavBar() {
  const location = useLocation();
  const links = [
    { name: "HOME", path: "/" },
    { name: "LIVE", path: "/live" },
    { name: "FEATURES", path: "/features" },
    { name: "SHOP", path: "/games" },
    { name: "BLOG", path: "/blog" },
    { name: "CONTACT", path: "/contact" }
  ];

  return (
    <nav className="relative z-10">
      <ul className="flex gap-8 text-gray-700 uppercase font-bold font-['Oxanium'] text-sm tracking-wider">
        {links.map((link) => (
          <li key={link.name} className="relative group">
            <Link
              to={link.path}
              className="relative block px-4 py-3 hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              {/* Background hover effect */}
              <div className="absolute inset-0 bg-blue-50 transform -skew-x-12 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded"></div>
              
              {/* Text */}
              <span className="relative z-10">{link.name}</span>
              
              {/* Active indicator */}
              {location.pathname === link.path && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-blue-600"></div>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
