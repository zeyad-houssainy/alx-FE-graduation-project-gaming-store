// src/components/Logo.jsx
export default function Logo() {
  return (
    <div className="flex items-center text-gray-900 dark:text-white font-black text-2xl sm:text-3xl font-['Oxanium'] hover:text-blue-600 dark:hover:text-orange-400 transition-colors cursor-pointer relative z-10">
      <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
        Gam
      </span>
      <span className="text-blue-600 dark:text-orange-400">iz</span>
      {/* Gaming controller icon accent */}
      <div className="ml-2 text-blue-600 dark:text-orange-400 text-sm">🎮</div>
    </div>
  );
}
