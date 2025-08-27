export default function Loader() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        
        {/* Loading Text */}
        <div className="mt-4 text-center">
          <p className="text-gray-600 dark:text-gray-300 font-medium">Loading games...</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Please wait while we fetch the latest titles</p>
        </div>
        
        {/* Gaming Icons */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-2xl animate-pulse">🎮</div>
        </div>
      </div>
    </div>
  );
}
