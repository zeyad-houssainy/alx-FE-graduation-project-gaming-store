import React, { useState } from 'react';
import { useCartStore } from '../stores';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

export default function GameCard({ game }) {
  // Image handling state
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

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

  // Get unique platform icons (avoid duplicates like PS4/PS5)
  const getUniquePlatformIcons = () => {
    if (!game.platforms || !Array.isArray(game.platforms) || game.platforms.length === 0) {
      return [{ icon: 'generic', name: 'Platform' }];
    }

    const platformIconMap = new Map();
    
    game.platforms.forEach((platform) => {
      const platformName = typeof platform === 'string' ? platform.toLowerCase() : platform?.platform?.name?.toLowerCase() || '';
      
      // Group similar platforms to avoid duplicates
      if (platformName.includes('steam')) {
        platformIconMap.set('steam', { icon: 'steam', name: 'Steam' });
      } else if (platformName.includes('epic')) {
        platformIconMap.set('epic', { icon: 'epic', name: 'Epic Games' });
      } else if (platformName.includes('playstation') || platformName.includes('ps')) {
        platformIconMap.set('playstation', { icon: 'playstation', name: 'PlayStation' });
      } else if (platformName.includes('psp')) {
        platformIconMap.set('psp', { icon: 'psp', name: 'PSP' });
      } else if (platformName.includes('xbox')) {
        platformIconMap.set('xbox', { icon: 'xbox', name: 'Xbox' });
      } else if (platformName.includes('nintendo') || platformName.includes('switch')) {
        platformIconMap.set('nintendo', { icon: 'nintendo', name: 'Nintendo' });
      } else if (platformName.includes('windows') || platformName.includes('pc')) {
        platformIconMap.set('pc', { icon: 'pc', name: 'PC' });
      } else if (platformName.includes('mac') || platformName.includes('macos')) {
        platformIconMap.set('mac', { icon: 'mac', name: 'macOS' });
      } else if (platformName.includes('ubuntu') || platformName.includes('linux')) {
        platformIconMap.set('linux', { icon: 'linux', name: 'Linux' });
      } else if (platformName.includes('android')) {
        platformIconMap.set('android', { icon: 'android', name: 'Android' });
      }
    });

    // Convert Map to Array and limit to first 4 icons for clean display
    return Array.from(platformIconMap.values()).slice(0, 4);
  };

  // Get platform icon component
  const getPlatformIconComponent = (iconType, index) => {
    const iconProps = {
      key: index,
      className: "w-3 h-3 filter brightness-0 invert"
    };

    switch (iconType) {
      case 'steam':
        return <img src="/assets/icons/steam.svg" alt="Steam" {...iconProps} />;
      case 'epic':
        return <img src="/assets/icons/epic-games.svg" alt="Epic Games" {...iconProps} />;
      case 'playstation':
        return <img src="/assets/icons/playstation.svg" alt="PlayStation" {...iconProps} />;
      case 'psp':
        return <img src="/assets/icons/sony.svg" alt="PSP" {...iconProps} />;
      case 'xbox':
        return <img src="/assets/icons/xbox.svg" alt="Xbox" {...iconProps} />;
      case 'nintendo':
        return <img src="/assets/icons/nintendo-switch.svg" alt="Nintendo" {...iconProps} />;
      case 'pc':
        return <img src="/assets/icons/windows.svg" alt="PC" {...iconProps} />;
      case 'mac':
        return <img src="/assets/icons/mac-os.svg" alt="macOS" {...iconProps} />;
      case 'linux':
        return <img src="/assets/icons/ubuntu.svg" alt="Linux" {...iconProps} />;
      case 'android':
        return <img src="/assets/icons/android.svg" alt="Android" {...iconProps} />;
      default:
        return <span key={index} className="text-xs text-white font-medium">P</span>;
    }
  };

  return (
    <div className="group bg-gradient-to-b from-gray-900 via-gray-800 to-black rounded-xl overflow-hidden border border-gray-700 transition-all duration-300 ease-in-out w-[400px] h-[350px] hover:h-[600px] flex flex-col hover:shadow-2xl shadow-lg relative">
      {/* Clickable Image Container - Links to Game Detail */}
      <Link to={`/games/${game.id}`} className="block flex-shrink-0">
        <div className="relative overflow-hidden w-full h-[230px] bg-gray-900 group">
          {/* Loading State */}
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
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
          
          {/* Rating Display */}
          <div className="absolute top-3 right-3">
            <div className="bg-black/70 dark:bg-white/70 text-white dark:text-black px-2 py-1 rounded-lg text-xs font-bold">
              {game.rating ? `${game.rating.toFixed(1)}/5` : '4.2/5'}
            </div>
          </div>

          {/* Image Gallery Dots */}
          <div className="absolute bottom-3 right-3 flex gap-1">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <div 
                key={index} 
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  index === 0 
                    ? 'bg-white w-3' 
                    : 'bg-white/40'
                }`}
              />
            ))}
            </div>
        </div>
      </Link>

      {/* Content Section - Fixed height for lower part */}
      <div className="p-4 bg-gradient-to-b from-gray-800 to-gray-900 h-[120px] flex flex-col justify-between transition-all duration-300 group-hover:h-[370px]">
        {/* Platform Icons Header */}
        <div className="flex items-center gap-2 mb-2">
          {getUniquePlatformIcons().map((platformData, index) => (
            <div key={index} className="w-4 h-4 flex items-center justify-center">
              {getPlatformIconComponent(platformData.icon, index)}
            </div>
          ))}
        </div>
        
        {/* Game Title */}
        <div className="mb-3">
          <Link to={`/games/${game.id}`} className="block">
            <h3 className="text-lg font-bold text-white line-clamp-2 leading-tight hover:text-blue-300 transition-colors cursor-pointer">
            {game.name || 'Untitled Game'}
          </h3>
        </Link>
          {/* Target Icon */}
          <div className="flex items-center gap-1 mt-1">
            <span className="text-red-500 text-sm">🎯</span>
          </div>
        </div>
        
        {/* Empty space for better spacing */}
        <div className="mb-2"></div>

        {/* Extended Content - Only visible on hover */}
        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100 space-y-4 overflow-hidden">
          {/* Game Details */}
          <div className="space-y-3">
            <div className="text-sm text-gray-300">
              <span className="text-gray-400">Release date:</span>
              <div className="text-white font-medium mt-1">{formatReleaseDate(game.released)}</div>
            </div>
            
            <div className="text-sm text-gray-300">
              <span className="text-gray-400">Genres:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="text-white text-xs">{game.genres?.[0]?.name || 'Action'}</span>
                {game.genres?.[1]?.name && (
                  <>
                    <span className="text-gray-500 text-xs">•</span>
                    <span className="text-white text-xs">{game.genres[1].name}</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="text-sm text-gray-300">
              <span className="text-gray-400">Chart:</span>
              <div className="text-white font-medium mt-1">#7 Top 2025</div>
            </div>
          </div>
          

        </div>

        {/* Bottom Action Button - Add to Cart (Only visible on hover) */}
        <div className="mt-auto opacity-0 group-hover:opacity-100 transition-all duration-300 delay-150">
          <button
            onClick={handleAddToCart}
            className={`w-full py-3 px-4 rounded-lg font-bold transition-all duration-300 ease-in-out flex items-center justify-center gap-2 ${
              isAddedToCart 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <div className={`transition-all duration-300 ease-in-out transform ${
              isAddedToCart ? 'rotate-360 scale-110' : 'rotate-0 scale-100'
            }`}>
              {isAddedToCart ? (
                <img src="/assets/icons/check.svg" alt="Added to Cart" className="w-4 h-4 filter brightness-0 invert" />
              ) : (
                <FaShoppingCart className="w-4 h-4" />
              )}
            </div>
            <span className="font-semibold">
              {isAddedToCart ? 'Added to Library!' : 'Add to Cart'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
