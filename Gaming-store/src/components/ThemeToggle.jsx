import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  // Only light mode

  return (
    <div
      className="group relative p-3 text-blue-600 transition-all duration-300 transform hover:scale-110 bg-gray-50 hover:bg-blue-50 rounded-lg"
      title={'Light Mode'}
    >
      {/* Sun icon for light mode */}
      <svg className="w-6 h-6 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="5" />
      </svg>
    </div>
  );
}
