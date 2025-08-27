import React from 'react';
import { useCountdown } from '../hooks/useCountdown';

const CountdownTimer = ({ targetDate }) => {
  const { days, hours, minutes, seconds } = useCountdown(targetDate);

  const formatNumber = (num) => {
    return num.toString().padStart(2, '0');
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-2 font-bold">
        <span className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 dark:from-orange-500 dark:to-amber-500 bg-clip-text text-transparent animate-pulse">
          {formatNumber(days)}
        </span>
        <span className="text-gray-400 dark:text-gray-500 mx-1">:</span>
        <span className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 dark:from-orange-500 dark:to-amber-500 bg-clip-text text-transparent animate-pulse">
          {formatNumber(hours)}
        </span>
        <span className="text-gray-400 dark:text-gray-500 mx-1">:</span>
        <span className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 dark:from-orange-500 dark:to-amber-500 bg-clip-text text-transparent animate-pulse">
          {formatNumber(minutes)}
        </span>
        <span className="text-gray-400 dark:text-gray-500 mx-1">:</span>
        <span className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 dark:from-orange-500 dark:to-amber-500 bg-clip-text text-transparent animate-pulse">
          {formatNumber(seconds)}
        </span>
      </div>
    </div>
  );
};

export default CountdownTimer;
