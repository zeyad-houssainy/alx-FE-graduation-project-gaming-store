import React, { useState } from 'react';
import { useCartStore } from '../stores';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaCalendarAlt, FaGamepad, FaHeart, FaEllipsisH, FaArrowRight, FaEyeSlash } from 'react-icons/fa';

export default function GameCard({ game }) {
  // Image handling state
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const { addToCart } = useCartStore();

  // Safety check - if game is undefined, don't render
  if (!game) {
    return null;
  }

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
    setIsAddedToCart(true);
    
    // Reset the animation after 2 seconds
    setTimeout(() => {
      setIsAddedToCart(false);
    }, 2000);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  // Generate random rating for demo
  const rating = Math.floor(Math.random() * 5) + 1;

  // Format release date
  const formatReleaseDate = (dateString) => {
    if (!dateString) return 'TBA';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return 'TBA';
    }
  };

  // Get genres as string
  const getGenresString = () => {
    if (game.genres && Array.isArray(game.genres) && game.genres.length > 0) {
      return game.genres.slice(0, 3).map(g => g.name).join(', ');
    } else if (game.genre) {
      return game.genre;
    }
    return 'Action, Adventure';
  };

  return (
    <div className="group bg-white/50 dark:bg-white/50 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-500 ease-in-out w-[400px] h-[350px] hover:h-[500px] flex flex-col hover:shadow-2xl dark:hover:shadow-gray-900/50 shadow-lg relative">
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

          {/* Image Gallery Indicator (like in the reference image) */}
          <div className="absolute bottom-2 right-2 flex gap-1">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <div 
                key={index} 
                className={`w-1 h-1 rounded-full transition-all duration-300 ${
                  index === 0 
                    ? 'bg-white w-2' 
                    : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </Link>

      {/* Content Section - Fixed height for lower part */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 h-[120px] flex flex-col justify-between transition-all duration-500 group-hover:h-[270px]">
        {/* Platform Icons Row - First */}
        <div className="flex items-center gap-2 mb-2">
          {(game.platforms && Array.isArray(game.platforms) && game.platforms.length > 0) ? (
            <div className="flex items-center gap-1">
              {game.platforms.slice(0, 3).map((platform, index) => {
                const platformName = typeof platform === 'string' ? platform.toLowerCase() : platform?.platform?.name?.toLowerCase() || '';
                return (
                  <div key={index} className="w-4 h-4 flex items-center justify-center text-gray-900 dark:text-white">
                    {platformName.includes('steam') ? (
                      <img src="/assets/icons/steam.svg" alt="Steam" className="w-3 h-3 dark:filter dark:brightness-0 dark:invert" />
                    ) : platformName.includes('epic') ? (
                      <img src="/assets/icons/epic-games.svg" alt="Epic Games" className="w-3 h-3 dark:filter dark:brightness-0 dark:invert" />
                    ) : platformName.includes('playstation') || platformName.includes('ps') ? (
                      <img src="/assets/icons/playstation.svg" alt="PlayStation" className="w-3 h-3 dark:filter dark:brightness-0 dark:invert" />
                    ) : platformName.includes('psp') ? (
                      <img src="/assets/icons/sony.svg" alt="PSP" className="w-3 h-3 dark:filter dark:brightness-0 dark:invert" />
                    ) : platformName.includes('xbox') ? (
                      <img src="/assets/icons/xbox.svg" alt="Xbox" className="w-3 h-3 dark:filter dark:brightness-0 dark:invert" />
                    ) : platformName.includes('nintendo') || platformName.includes('switch') ? (
                      <img src="/assets/icons/nintendo-switch.svg" alt="Nintendo Switch" className="w-3 h-3 dark:filter dark:brightness-0 dark:invert" />
                    ) : platformName.includes('windows') || platformName.includes('pc') ? (
                      <img src="/assets/icons/windows.svg" alt="Windows" className="w-3 h-3 dark:filter dark:brightness-0 dark:invert" />
                    ) : platformName.includes('mac') || platformName.includes('macos') ? (
                      <img src="/assets/icons/mac-os.svg" alt="macOS" className="w-3 h-3 dark:filter dark:brightness-0 dark:invert" />
                    ) : platformName.includes('ubuntu') || platformName.includes('linux') ? (
                      <img src="/assets/icons/ubuntu.svg" alt="Ubuntu" className="w-3 h-3 dark:filter dark:brightness-0 dark:invert" />
                    ) : platformName.includes('android') ? (
                      <img src="/assets/icons/android.svg" alt="Android" className="w-3 h-3 dark:filter dark:brightness-0 dark:invert" />
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
        
        {/* Title and Price Row - Second */}
        <div className="flex items-center justify-between mb-2">
          <Link to={`/games/${game.id}`} className="block flex-1 mr-2">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 leading-tight hover:text-blue-600 dark:hover:text-blue-300 transition-colors cursor-pointer">
              {game.name || 'Untitled Game'}
            </h3>
          </Link>
          <span className="text-lg font-bold text-green-400 dark:text-green-300 flex-shrink-0">
            ${game.price || '29.99'}
          </span>
        </div>
        
        {/* Action Row - Third (All in one row) */}
        <div className="flex items-center justify-between mb-2">
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
            
            {/* Gift Button */}
            <button
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-purple-500 hover:text-white transition-all duration-300"
              title="Gift this game"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </button>
            
            {/* More Options Button */}
            <button
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-500 hover:text-white transition-all duration-300"
              title="More options"
            >
              <FaEllipsisH className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Extended Content - Only visible on hover */}
        <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200 space-y-3 overflow-hidden">
          {/* Release Date */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <FaCalendarAlt className="w-3 h-3" />
              Release date:
            </span>
            <span className="text-gray-900 dark:text-white font-medium">
              {formatReleaseDate(game.released)}
            </span>
          </div>

          {/* Genres */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <FaGamepad className="w-3 h-3" />
              Genres:
            </span>
            <span className="text-blue-600 dark:text-blue-400 font-medium underline cursor-pointer hover:text-blue-800 dark:hover:text-blue-300">
              {getGenresString()}
            </span>
          </div>

          {/* Chart Position */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
              📊 Chart:
            </span>
            <span className="text-blue-600 dark:text-blue-400 font-medium underline cursor-pointer hover:text-blue-800 dark:hover:text-blue-300">
              #{Math.floor(Math.random() * 20) + 1} Top {new Date().getFullYear()}
            </span>
          </div>
        </div>

        {/* Bottom Action Buttons - Full width, only visible on hover */}
        <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 delay-300 space-y-2 mt-auto">
          {/* Show more like this button */}
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 group/btn">
            Show more like this
            <FaArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform duration-300" />
          </button>
          
          {/* Hide this game button */}
          <button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2">
            <FaEyeSlash className="w-3 h-3" />
            Hide this game
          </button>

          {/* Add to Cart Button - Full width at the bottom */}
          <button
            onClick={handleAddToCart}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-500 ease-in-out flex items-center justify-center gap-2 ${
              isAddedToCart 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            <div className={`transition-all duration-500 ease-in-out transform ${
              isAddedToCart ? 'rotate-360 scale-110' : 'rotate-0 scale-100'
            }`}>
              {isAddedToCart ? (
                <img src="/assets/icons/check.svg" alt="Added to Cart" className="w-4 h-4 filter brightness-0 invert" />
              ) : (
                <FaShoppingCart className="w-4 h-4" />
              )}
            </div>
            <span className="font-semibold">
              {isAddedToCart ? 'Added to Cart!' : 'Add to Cart'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
