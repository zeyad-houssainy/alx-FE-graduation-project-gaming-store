import React, { useState } from 'react';
import { useCartStore } from '../stores';
import { Link } from 'react-router-dom';

export default function GameCard({ game, activeFilters }) {
  // Image handling state
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Safety check - if game is undefined, don't render
  if (!game) {
    return null;
  }

  const { addToCart, updateQuantity, items, isInCart, getItemQuantity } = useCartStore();
  
  const cartItem = items.find(item => item.id === game.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  const isGameInCart = isInCart(game.id);

  // Image handling functions
  const getImageUrl = () => {
    if (imageError) {
      return '/assets/images/featured-game-1.jpg'; // Fallback image
    }
    return game.background_image || game.image || '/assets/images/featured-game-1.jpg';
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(game);
  };

  const handleIncreaseQuantity = (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(game.id, quantity + 1);
  };

  const handleDecreaseQuantity = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity > 1) {
      updateQuantity(game.id, quantity - 1);
    } else {
      updateQuantity(game.id, 0); // This will remove the item
    }
  };

  // Prevent navigation when clicking on cart controls
  const handleCartControlClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Link to={`/games/${game.id}`} className="block h-full group">
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-200 h-full flex flex-col hover:shadow-lg dark:hover:shadow-gray-900/50">
        {/* Image Container - Fixed Height */}
        <div className="relative overflow-hidden aspect-[4/3] flex-shrink-0 bg-gray-100 dark:bg-gray-700">
          {/* Loading State */}
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-600">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-orange-400"></div>
            </div>
          )}
          
          {/* Main Image with Enhanced Positioning */}
          <img
            src={getImageUrl()}
            alt={game.name || 'Game'}
            className={`w-full h-full transition-all duration-300 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            } ${
              imageError ? 'object-contain p-4' : 'object-cover'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
            decoding="async"
            style={{
              objectPosition: 'center center',
              imageRendering: 'auto'
            }}
          />
          
          {/* Image Quality Indicator */}
          {!imageError && !imageLoading && (
            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
              HD
            </div>
          )}
          
          {/* Rating Badge */}
          <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 px-2 py-1 rounded-lg text-xs font-medium text-gray-900 dark:text-white">
            ⭐ {game.rating || 'N/A'}
          </div>
          
          {/* Genre Badge */}
          {(game.genres && Array.isArray(game.genres) && game.genres.length > 0 && game.genres[0]?.name) || game.genre ? (
            <div className="absolute top-3 left-3 bg-blue-500/90 px-3 py-1 rounded-lg text-xs font-medium text-white">
              {game.genres && Array.isArray(game.genres) && game.genres.length > 0 ? game.genres[0].name : game.genre}
            </div>
          ) : null}
        </div>

        {/* Content - Flexible Height with Consistent Spacing */}
        <div className="p-2 sm:p-3 lg:p-4 flex flex-col flex-1">
          {/* Title - Fixed Height */}
          <h3 className="text-xs sm:text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2 line-clamp-2 transition-colors min-h-[2.5rem] sm:min-h-[3.5rem]">
            {game.name || 'Untitled Game'}
          </h3>
          
          {/* Price and Platform - Fixed Height */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3 min-h-[2rem]">
            <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-0">
              {(game.platforms && Array.isArray(game.platforms) && game.platforms.length > 0) ? (
                <div className="flex items-center gap-1">
                  <span className={`text-xs px-1 sm:px-2 py-1 rounded-md font-medium truncate max-w-[80px] sm:max-w-none ${
                    (() => {
                      // If we have active platform filters, prioritize showing the filtered platform
                      if (activeFilters?.platforms && activeFilters.platforms.length > 0) {
                        const filteredPlatform = activeFilters.platforms[0];
                        // Find if this game has the filtered platform
                        const hasFilteredPlatform = game.platforms.some(platform => {
                          const platformName = typeof platform === 'string' ? platform : platform?.platform?.name;
                          return platformName && platformName.toLowerCase().includes(filteredPlatform.toLowerCase());
                        });
                        
                        if (hasFilteredPlatform) {
                          return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700';
                        }
                      }
                      
                      // Default styling
                      return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300';
                    })()
                  }`}>
                    {(() => {
                      // If we have active platform filters, prioritize showing the filtered platform
                      if (activeFilters?.platforms && activeFilters.platforms.length > 0) {
                        const filteredPlatform = activeFilters.platforms[0];
                        // Find if this game has the filtered platform
                        const hasFilteredPlatform = game.platforms.some(platform => {
                          const platformName = typeof platform === 'string' ? platform : platform?.platform?.name;
                          return platformName && platformName.toLowerCase().includes(filteredPlatform.toLowerCase());
                        });
                        
                        if (hasFilteredPlatform) {
                          return filteredPlatform;
                        }
                      }
                      
                      // Fallback to first platform
                      return typeof game.platforms[0] === 'string' ? game.platforms[0] : game.platforms[0]?.platform?.name || 'Unknown';
                    })()}
                  </span>
                  
                  {/* Show filter indicator when platform matches active filter */}
                  {(() => {
                    if (activeFilters?.platforms && activeFilters.platforms.length > 0) {
                      const filteredPlatform = activeFilters.platforms[0];
                      const hasFilteredPlatform = game.platforms.some(platform => {
                        const platformName = typeof platform === 'string' ? platform : platform?.platform?.name;
                        return platformName && platformName.toLowerCase().includes(filteredPlatform.toLowerCase());
                      });
                      
                      if (hasFilteredPlatform) {
                        return (
                          <span className="text-blue-600 dark:text-blue-400 text-xs" title={`Available on ${filteredPlatform}`}>
                            ✓
                          </span>
                        );
                      }
                    }
                    return null;
                  })()}
                </div>
              ) : null}
            </div>
            <div className="text-left sm:text-right">
              <span className="text-sm sm:text-lg lg:text-xl font-bold text-blue-600 dark:text-orange-400">
                ${game.price || '29.99'}
              </span>
            </div>
          </div>

          {/* Action Buttons - Fixed Height, Pushed to Bottom */}
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 mt-auto">
            {/* Add to Cart Button or Quantity Controls */}
            {!isGameInCart ? (
              <button
                onClick={handleAddToCart}
                className="flex-1 px-2 sm:px-3 py-2 sm:py-3 lg:py-2 rounded-lg font-medium text-xs sm:text-sm transition-all duration-300 bg-transparent border-2 border-blue-600 dark:border-orange-500 text-blue-600 dark:text-orange-500 hover:bg-blue-100 dark:hover:bg-orange-100 hover:text-blue-700 dark:hover:text-orange-700 hover:shadow-lg hover:border-blue-700 dark:hover:border-orange-600 active:scale-95 touch-manipulation"
                style={{ minHeight: '36px' }} // Smaller for mobile 3-column
              >
                Add to Cart
              </button>
            ) : (
              <div 
                className="flex-1 flex items-center justify-center gap-1 sm:gap-2 lg:gap-3 px-2 sm:px-3 py-2 sm:py-3 lg:py-2 bg-blue-600 dark:bg-orange-500 hover:bg-blue-700 dark:hover:bg-orange-600 text-white rounded-lg font-medium text-xs sm:text-sm transition-all duration-300 shadow-lg hover:shadow-xl"
                onClick={handleCartControlClick}
                style={{ minHeight: '36px' }} // Smaller for mobile 3-column
              >
                {/* Minus Button */}
                <button
                  onClick={handleDecreaseQuantity}
                  className={`w-6 h-6 sm:w-8 sm:h-8 lg:w-7 lg:h-7 rounded-full flex items-center justify-center transition-all duration-200 text-white font-bold text-sm sm:text-lg hover:scale-110 active:scale-95 touch-manipulation ${
                    quantity === 1 
                      ? 'bg-red-500/30 hover:bg-red-500/50 cursor-pointer' 
                      : 'bg-white/20 hover:bg-white/30 active:bg-white/40'
                  }`}
                  aria-label={quantity === 1 ? "Remove from cart" : "Decrease quantity"}
                  title={quantity === 1 ? "Remove from cart" : "Decrease quantity"}
                >
                  {quantity === 1 ? '🗑️' : '−'}
                </button>
                
                {/* Quantity Display */}
                <span 
                  className="min-w-[1.5rem] sm:min-w-[2.5rem] text-center font-bold text-sm sm:text-lg bg-white/20 rounded-lg px-1 sm:px-2 py-1"
                >
                  {quantity}
                </span>
                
                {/* Plus Button */}
                <button
                  onClick={handleIncreaseQuantity}
                  className="w-6 h-6 sm:w-8 sm:h-8 lg:w-7 lg:h-7 rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 flex items-center justify-center transition-all duration-200 text-white font-bold text-sm sm:text-lg hover:scale-110 active:scale-95 touch-manipulation"
                  aria-label="Increase quantity"
                  title="Increase quantity"
                >
                  +
                </button>
              </div>
            )}
            
            {/* View Details Button */}
            <button 
              className="px-2 sm:px-3 py-2 sm:py-3 lg:py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-xs sm:text-sm transition-colors active:scale-95 touch-manipulation"
              style={{ minHeight: '36px' }} // Smaller for mobile 3-column
            >
              View
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
