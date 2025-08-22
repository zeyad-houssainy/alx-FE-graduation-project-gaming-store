import React from 'react';
import CountdownTimer from '../../components/CountdownTimer';

const LiveMatches = () => {
  return (
    <section className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
          WATCH LIVE <span className="text-blue-600 dark:text-orange-400">MATCH</span>
        </h2>
        <div className="w-16 sm:w-20 md:w-24 h-1 bg-blue-600 dark:bg-orange-400 mx-auto rounded-full mb-4 sm:mb-6 md:mb-8"></div>
      </div>

      <div className="max-w-5xl mx-auto bg-gray-100 dark:bg-gray-700 rounded-lg shadow-2xl overflow-hidden relative group">
        {/* Video Player Section */}
        <div className="relative w-full h-0 pb-[56.25%] bg-black">
          <img
            src="/assets/images/live-match-banner.jpg"
            alt="Live E-sports Match"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/60 flex items-center justify-center">
            <button className="relative z-10 p-4 sm:p-6 bg-blue-600 dark:bg-orange-500 rounded-full text-white text-2xl sm:text-3xl shadow-lg transform transition-transform duration-300 group-hover:scale-110">
              ▶
            </button>
          </div>
          {/* Neon lights effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-blue-600/30 to-transparent"></div>
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-pink-600/30 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Upcoming Live Matches Section */}
      <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12 md:mt-16 relative overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-gray-200 text-6xl sm:text-8xl md:text-9xl font-extrabold opacity-20 select-none">LIVE</span>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-8 sm:mb-12">
            <span className="inline-block bg-blue-600 dark:bg-orange-500 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-full uppercase tracking-wide">
              Upcoming Live Matches
            </span>
            <div className="mt-4 sm:mt-6">
              <CountdownTimer targetDate="2025-12-01T00:00:00" />
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-around items-center gap-6 sm:gap-8 md:gap-12">
            {/* Team 1: Tokyo Eagle */}
            <div className="flex flex-col items-center text-gray-900 dark:text-gray-100">
              <img src="/assets/images/live-match-player-1.png" alt="Tokyo Eagle Logo" className="w-80 h-80 sm:w-96 sm:h-96 md:w-[28rem] md:h-[28rem] lg:w-[32rem] lg:h-[32rem] xl:w-[36rem] xl:h-[36rem] object-contain mb-3 sm:mb-4" />
              <div className="bg-blue-600 dark:bg-orange-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-center">
                <p className="text-xs sm:text-sm uppercase">Tokyo</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold">EAGLE</p>
              </div>
            </div>

            {/* Team 2: New York Hunter 7 */}
            <div className="flex flex-col items-center text-gray-900 dark:text-gray-100">
              <img src="/assets/images/live-match-player-2.png" alt="New York Hunter 7 Logo" className="w-80 h-80 sm:w-96 sm:h-96 md:w-[28rem] md:h-[28rem] lg:w-[32rem] lg:h-[32rem] xl:w-[36rem] xl:h-[36rem] object-contain mb-3 sm:mb-4 mt-15" />
              <p className="text-2xl sm:text-3xl font-extrabold mb-2">FOX</p>
              <div className="bg-blue-600 dark:bg-orange-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-center">
                <p className="text-xs sm:text-sm uppercase">New York</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold">HUNTER 7</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveMatches;
