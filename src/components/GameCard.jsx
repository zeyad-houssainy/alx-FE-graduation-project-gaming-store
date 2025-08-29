import React, { useState } from 'react';
import { useCartStore } from '../stores';
import { Link } from 'react-router-dom';

export default function GameCard({ game, activeFilters }) {
  // Image handling state
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);

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

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  // Generate random rating for demo
  const rating = Math.floor(Math.random() * 5) + 1;

  return (
    <div className="bg-black/30 dark:bg-white/30 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-200 w-[400px] h-[350px] flex flex-col hover:shadow-xl dark:hover:shadow-gray-900/50 shadow-lg">
      {/* Clickable Image Container - Links to Game Detail */}
      <Link to={`/games/${game.id}`} className="block flex-shrink-0">
        <div className="relative overflow-hidden w-full h-[230px] bg-gray-100 dark:bg-gray-700 group">
          {/* Loading State */}
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-600">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-orange-400"></div>
            </div>
          )}
          
          {/* Main Image */}
          <img
            src={getImageUrl()}
            alt={game.name || 'Game'}
            className={`w-full h-[230px] transition-all duration-300 group-hover:scale-105 ${
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
            ⭐ {rating}
          </div>
          
          {/* Genre Badge */}
          {(game.genres && Array.isArray(game.genres) && game.genres.length > 0 && game.genres[0]?.name) || game.genre ? (
            <div className="absolute top-3 left-3 bg-blue-500/90 px-3 py-1 rounded-lg text-xs font-medium text-white">
              {game.genres && Array.isArray(game.genres) && game.genres.length > 0 ? game.genres[0].name : game.genre}
            </div>
          ) : null}
        </div>
      </Link>

      {/* Content Section - Fixed height for lower part */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 h-[120px] flex flex-col justify-between">
        {/* Platform Icons Row - First */}
        <div className="flex items-center gap-2 mb-2">
          {(game.platforms && Array.isArray(game.platforms) && game.platforms.length > 0) ? (
            <div className="flex items-center gap-1">
              {game.platforms.slice(0, 3).map((platform, index) => {
                const platformName = typeof platform === 'string' ? platform.toLowerCase() : platform?.platform?.name?.toLowerCase() || '';
                return (
                  <div key={index} className="w-4 h-4 flex items-center justify-center text-gray-900 dark:text-white">
                    {platformName.includes('steam') ? (
                      <img src="/assets/icons/steam.svg" alt="Steam" className="w-3 h-3" />
                    ) : platformName.includes('epic') ? (
                      <img src="/assets/icons/epic-games.svg" alt="Epic Games" className="w-3 h-3" />
                    ) : platformName.includes('playstation') || platformName.includes('ps') ? (
                      <img src="/assets/icons/playstation.svg" alt="PlayStation" className="w-3 h-3" />
                    ) : platformName.includes('xbox') ? (
                      <img src="/assets/icons/xbox.svg" alt="Xbox" className="w-3 h-3" />
                    ) : platformName.includes('nintendo') || platformName.includes('switch') ? (
                      <img src="/assets/icons/nintendo-switch.svg" alt="Nintendo Switch" className="w-3 h-3" />
                    ) : platformName.includes('windows') || platformName.includes('pc') ? (
                      <img src="/assets/icons/windows.svg" alt="Windows" className="w-3 h-3" />
                    ) : platformName.includes('mac') || platformName.includes('macos') ? (
                      <img src="/assets/icons/mac-os.svg" alt="macOS" className="w-3 h-3" />
                    ) : platformName.includes('ubuntu') || platformName.includes('linux') ? (
                      <img src="/assets/icons/ubuntu.svg" alt="Ubuntu" className="w-3 h-3" />
                    ) : platformName.includes('android') ? (
                      <img src="/assets/icons/android.svg" alt="Android" className="w-3 h-3" />
                    ) : (
                      <span className="text-xs text-gray-900 dark:text-white font-medium">P</span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="w-4 h-4 flex items-center justify-center text-gray-900 dark:text-white">
              <span className="text-xs text-gray-900 dark:text-white font-medium">P</span>
            </div>
          )}
        </div>
        
        {/* Clickable Title - Second */}
        <Link to={`/games/${game.id}`} className="block mb-2">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 leading-tight hover:text-blue-600 dark:hover:text-blue-300 transition-colors cursor-pointer">
            {game.name || 'Untitled Game'}
          </h3>
        </Link>
        
        {/* Action Row - Third (All in one row) */}
        <div className="flex items-center justify-between">
          {/* Rank/Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-green-400 dark:text-green-300">
              ${game.price || '29.99'}
            </span>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Wishlist Button */}
            <button
              onClick={handleWishlistToggle}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-red-500 hover:text-white transition-all duration-300"
              title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <svg className="w-3 h-3" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            
            {/* Add to Cart Button - Fixed dimensions */}
            <button
              onClick={handleAddToCart}
              className="w-[60px] h-[30px] bg-blue-600 hover:bg-blue-700 text-white rounded transition-all duration-300 flex items-center justify-center"
            >
              <img src="/assets/icons/add-to-cart-16.svg" alt="Add to Cart" className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
