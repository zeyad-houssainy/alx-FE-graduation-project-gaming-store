// src/components/NavBar.jsx
export default function NavBar() {
  const links = ["Home", "Live", "Features", "Shop", "Blog", "Contact"];
  return (
    <nav>
      <ul className="flex gap-6 text-white uppercase font-semibold">
        {links.map((link) => (
          <li
            key={link}
            className="hover:text-yellow-400 cursor-pointer transition-colors"
          >
            {link}
          </li>
        ))}
      </ul>
    </nav>
  );
}
