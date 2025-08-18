import React from 'react';
import { useCountdown } from '../hooks/useCountdown';

const CountdownTimer = ({ targetDate }) => {
  const { days, hours, minutes, seconds } = useCountdown(targetDate);

  const formatNumber = (num) => {
    return num.toString().padStart(2, '0');
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 font-['Oxanium']">
        <span className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 dark:from-orange-500 dark:to-amber-500 bg-clip-text text-transparent animate-pulse">
          {formatNumber(days)}
        </span>
        <span className="text-gray-400 dark:text-gray-500 mx-2">:</span>
        <span className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 dark:from-orange-500 dark:to-amber-500 bg-clip-text text-transparent animate-pulse">
          {formatNumber(hours)}
        </span>
        <span className="text-gray-400 dark:text-gray-500 mx-2">:</span>
        <span className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 dark:from-orange-500 dark:to-amber-500 bg-clip-text text-transparent animate-pulse">
          {formatNumber(minutes)}
        </span>
        <span className="text-gray-400 dark:text-gray-500 mx-2">:</span>
        <span className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 dark:from-orange-500 dark:to-amber-500 bg-clip-text text-transparent animate-pulse">
          {formatNumber(seconds)}
        </span>
      </div>
      <div className="flex gap-4 sm:gap-6 md:gap-8 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
        <span className="bg-blue-100 dark:bg-orange-100 px-3 py-1 rounded-full">Days</span>
        <span className="bg-blue-100 dark:bg-orange-100 px-3 py-1 rounded-full">Hours</span>
        <span className="bg-blue-100 dark:bg-orange-100 px-3 py-1 rounded-full">Minutes</span>
        <span className="bg-blue-100 dark:bg-orange-100 px-3 py-1 rounded-full">Seconds</span>
      </div>
    </div>
  );
};

export default CountdownTimer;
