import React from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const HorizontalGameList = ({ 
  title, 
  subtitle, 
  icon, 
  iconBgColor, 
  games, 
  renderGameItem, 
  scrollId, 
  showScrollButtons = true 
}) => {
  const scrollLeft = () => {
    const element = document.getElementById(scrollId);
    if (element) element.scrollLeft -= 300;
  };

  const scrollRight = () => {
    const element = document.getElementById(scrollId);
    if (element) element.scrollLeft += 300;
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 ${iconBgColor} rounded-xl flex items-center justify-center shadow-lg`}>
            {icon}
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-800 bg-clip-text text-transparent">
              {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
          </div>
        </div>
        {showScrollButtons && (
          <div className="flex items-center gap-2">
            <button 
              className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" 
              onClick={scrollLeft}
            >
              <FaArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button 
              className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" 
              onClick={scrollRight}
            >
              <FaArrowRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        )}
      </div>
      <div id={scrollId} className="flex flex-row gap-2 overflow-x-auto scrollbar-hide pb-4">
        {games.map((game) => (
          <div key={game.id} className="flex-shrink-0 w-80">
            {renderGameItem(game)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalGameList;
