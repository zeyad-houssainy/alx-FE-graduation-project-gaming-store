// src/components/NavBar.jsx
import { Link, useLocation } from "react-router-dom";

export default function NavBar() {
  const location = useLocation();

  const navItems = [
    { name: "HOME", path: "/" },
    { name: "LIVE", path: "/live" },
    { name: "FEATURES", path: "/features" },
    { name: "SHOP", path: "/games" },
    { name: "DEALS", path: "/deals" },
    { name: "BLOG", path: "/blog" },
    { name: "CONTACT", path: "/contact" }
  ];

  return (
    <nav className="flex items-center space-x-1">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.name}
            to={item.path}
            className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
              isActive
                ? "bg-blue-50 dark:bg-orange-900/20 text-blue-700 dark:text-orange-300"
                : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-orange-400"
            }`}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
