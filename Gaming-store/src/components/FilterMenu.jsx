export default function FilterMenu({ genres, platforms, selectedGenre, selectedPlatform, onGenreChange, onPlatformChange, onClearFilters }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 font-['Oxanium']">Filters</h3>
        <button
          onClick={onClearFilters}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium underline transition-colors duration-200"
        >
          Clear All
        </button>
      </div>

      {/* Genre Filter */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <span className="mr-2">🎮</span>
          Genre
        </h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {genres.map((genre) => (
            <label key={genre.id} className="flex items-center cursor-pointer group hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
              <input
                type="radio"
                name="genre"
                value={genre.name}
                checked={selectedGenre === genre.name}
                onChange={(e) => onGenreChange(e.target.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className={`ml-3 font-medium transition-colors duration-200 ${
                selectedGenre === genre.name ? 'text-blue-600 font-semibold' : 'text-gray-700 group-hover:text-gray-900'
              }`}>
                {genre.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Platform Filter */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <span className="mr-2">🖥️</span>
          Platform
        </h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {platforms.map((platform) => (
            <label key={platform.id} className="flex items-center cursor-pointer group hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
              <input
                type="radio"
                name="platform"
                value={platform.name}
                checked={selectedPlatform === platform.name}
                onChange={(e) => onPlatformChange(e.target.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className={`ml-3 font-medium transition-colors duration-200 ${
                selectedPlatform === platform.name ? 'text-blue-600 font-semibold' : 'text-gray-700 group-hover:text-gray-900'
              }`}>
                {platform.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Active Filters Display */}
      {(selectedGenre || selectedPlatform) && (
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
            <span className="mr-2">🔍</span>
            Active Filters:
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedGenre && (
              <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium flex items-center">
                <span className="mr-1">🎮</span>
                {selectedGenre}
                <button
                  onClick={() => onGenreChange(selectedGenre)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {selectedPlatform && (
              <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium flex items-center">
                <span className="mr-1">🖥️</span>
                {selectedPlatform}
                <button
                  onClick={() => onPlatformChange(selectedPlatform)}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
