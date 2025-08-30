import React, { useState, useEffect } from 'react';
import { fetchStores, fetchGameDeals } from '../services/cheapsharkApi';

export default function StoreInfo({ gameId, gameName }) {
  const [stores, setStores] = useState([]);
  const [gameDeals, setGameDeals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load stores and game deals in parallel
        const [storesData, dealsData] = await Promise.all([
          fetchStores(),
          gameId ? fetchGameDeals(gameId) : null
        ]);
        
        setStores(storesData);
        if (dealsData) {
          setGameDeals(dealsData);
        }
        
        setError(null);
      } catch (err) {
        console.error('Failed to load store data:', err);
        setError('Failed to load store information');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [gameId]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-600 dark:text-red-400 text-sm">
          ⚠️ {error}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Store Information */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          🏪 Available Stores
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {stores.slice(0, 8).map((store) => (
            <div
              key={store.id}
              className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <img
                src={store.icon}
                alt={store.name}
                className="w-8 h-8 object-contain mb-2"
                onError={(e) => {
                  e.target.src = '/assets/images/featured-game-1.jpg';
                }}
              />
              <span className="text-xs text-gray-600 dark:text-gray-300 text-center font-medium">
                {store.name}
              </span>
              <div className={`w-2 h-2 rounded-full mt-1 ${
                store.isActive ? 'bg-green-500' : 'bg-gray-400'
              }`}></div>
            </div>
          ))}
        </div>
        {stores.length > 8 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
            +{stores.length - 8} more stores available
          </p>
        )}
      </div>

      {/* Game Deals */}
      {gameDeals && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            💰 Best Deals for {gameName}
          </h3>
          
          {gameDeals.dealCount > 0 ? (
            <div className="space-y-3">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      🎯 Best Price Found
                    </p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ${gameDeals.cheapestPrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-green-600 dark:text-green-400">
                      {gameDeals.dealCount} deals available
                    </p>
                    <p className="text-xs text-green-500 dark:text-green-300">
                      Across {stores.length} stores
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <p>💡 This game has {gameDeals.dealCount} different price offers across various stores.</p>
                <p>🔄 Prices are updated in real-time from CheapShark.</p>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                📊 No current deals found for this game. Check back later for price updates!
              </p>
            </div>
          )}
        </div>
      )}


    </div>
  );
}
