// src/components/Logo.jsx
export default function Logo() {
  return (
    <div className="flex items-center text-white font-black text-3xl font-['Oxanium'] hover:text-yellow-500 transition-colors cursor-pointer relative z-10">
      <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
        Gam
      </span>
      <span className="text-yellow-500">ics</span>
      {/* Gaming controller icon accent */}
      <div className="ml-2 text-yellow-500 text-sm">🎮</div>
    </div>
  );
}
