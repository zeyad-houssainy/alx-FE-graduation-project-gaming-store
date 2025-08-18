// src/components/Logo.jsx
export default function Logo() {
  return (
    <div className="flex items-center text-gray-900 font-black text-3xl font-['Oxanium'] hover:text-blue-600 transition-colors cursor-pointer relative z-10">
      <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
        Gam
      </span>
      <span className="text-blue-600">iz</span>
      {/* Gaming controller icon accent */}
      <div className="ml-2 text-blue-600 text-sm">🎮</div>
    </div>
  );
}
