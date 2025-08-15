// src/components/SearchOverlay.jsx
export default function SearchOverlay({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="relative w-1/2">
        <input
          type="text"
          placeholder="Search here..."
          className="w-full px-4 py-3 text-lg rounded bg-transparent border-b-2 border-gray-400 text-white focus:outline-none"
        />
        <button className="absolute right-4 top-3 text-yellow-400 text-xl">
          <i className="fas fa-search"></i>
        </button>
        <button
          className="absolute top-3 right-14 text-white text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
    </div>
  );
}
