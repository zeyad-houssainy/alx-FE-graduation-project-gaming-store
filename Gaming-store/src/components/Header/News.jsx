// src/components/News.jsx
export default function News() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 via-white to-blue-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 text-xs sm:text-sm text-gray-600 dark:text-gray-300 px-4 sm:px-6 py-2 sm:py-3 border-b border-gray-100 dark:border-gray-700">
      {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-blue-600/10 dark:via-orange-500/10 to-transparent transform -skew-x-12"></div>
        </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-center relative z-10 gap-2 sm:gap-0">
        <div className="flex items-center font-medium">
          <span className="text-blue-600 dark:text-orange-400 animate-pulse mr-2">🔥</span>
          <span className="hidden sm:inline">Exclusive Black Friday! Offer</span>
          <span className="sm:hidden">Black Friday!</span>
          <span className="bg-blue-600/90 dark:bg-orange-500/90 text-white px-2 py-1 rounded-full shadow-lg shadow-blue-600/30 dark:shadow-orange-500/30 font-bold text-xs sm:text-sm">
            10
          </span>
          <span className="hidden sm:inline">Days</span>
          <span className="ml-2 text-blue-600 dark:text-orange-400 animate-bounce">⚡</span>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Follow us on:</span>
          <div className="flex gap-3">
            {/* Facebook - Simple F */}
            <a href="#" className="group relative w-8 h-8 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 transform hover:scale-110 shadow-sm hover:shadow-md">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 4h8v2H8V4zm0 4h8v2H8V8zm0 4h8v2H8v-2zm0 4h8v2H8v-2z"/>
              </svg>
            </a>
            
            {/* Twitter - Simple Bird */}
            <a href="#" className="group relative w-8 h-8 flex items-center justify-center bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-all duration-300 transform hover:scale-110 shadow-sm hover:shadow-md">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L8 8l-6 2 6 2 4 6 4-6 6-2-6-2-4-6z"/>
              </svg>
            </a>
            
            {/* Instagram - Simple Camera */}
            <a href="#" className="group relative w-8 h-8 flex items-center justify-center bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-all duration-300 transform hover:scale-110 shadow-sm hover:shadow-md">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8a4 4 0 100 8 4 4 0 000-8zM12 2a10 10 0 100 20 10 10 0 000-20z"/>
              </svg>
            </a>
            
            {/* Discord - Simple Chat */}
            <a href="#" className="group relative w-8 h-8 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-300 transform hover:scale-110 shadow-sm hover:shadow-md">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 4h16v12H8l-4 4V4zm0 4v8h2V8H4zm14 0v8h2V8h-2z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
