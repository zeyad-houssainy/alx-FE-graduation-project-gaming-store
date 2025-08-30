import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore, useAuthStore } from '../stores';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';

const PortraitGameCard = ({ game }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  
  const { addToCart } = useCartStore();
  const { addToFavorites, removeFromFavorites, isFavorite } = useAuthStore();

  // Check if this game is in favorites
  const isInFavorites = isFavorite(game?.id);

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

  // Handle favorite toggle
  const handleFavoriteToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInFavorites) {
      removeFromFavorites(game.id);
    } else {
      addToFavorites(game);
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
      className: "w-4 h-4 text-black dark:text-white"
    };

    switch (iconType) {
      case 'steam':
        return <img key={index} src="/assets/icons/steam.svg" alt="Steam" {...iconProps} />;
      case 'epic':
        return <img key={index} src="/assets/icons/epic-games.svg" alt="Epic Games" {...iconProps} />;
      case 'playstation':
        return <img key={index} src="/assets/icons/playstation.svg" alt="PlayStation" {...iconProps} />;
      case 'psp':
        return <img key={index} src="/assets/icons/sony.svg" alt="PSP" {...iconProps} />;
      case 'xbox':
        return <img key={index} src="/assets/icons/xbox.svg" alt="Xbox" {...iconProps} />;
      case 'nintendo':
        return <img key={index} src="/assets/icons/nintendo-switch.svg" alt="Nintendo" {...iconProps} />;
      case 'pc':
        return <img key={index} src="/assets/icons/windows.svg" alt="PC" {...iconProps} />;
      case 'mac':
        return <img key={index} src="/assets/icons/mac-os.svg" alt="macOS" {...iconProps} />;
      case 'linux':
        return <img key={index} src="/assets/icons/ubuntu.svg" alt="Linux" {...iconProps} />;
      case 'android':
        return <img key={index} src="/assets/icons/android.svg" alt="Android" {...iconProps} />;
      default:
        return <span key={index} className="text-xs text-black dark:text-white font-medium">P</span>;
    }
  };

  return (
    <div className="group bg-gradient-to-b from-white/80 via-white/80 to-white/80 dark:from-gray-900 dark:via-gray-800 dark:to-black rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700 transition-all duration-300 ease-in-out w-[250px] h-[400px] flex flex-col shadow-lg hover:shadow-xl relative">
      {/* Clickable Image Container - Links to Game Detail */}
      <Link to={`/games/${game.id}`} className="block flex-shrink-0">
        <div className="relative overflow-hidden w-full h-[300px] bg-white/80 dark:bg-gray-900 group">
          {/* Loading State */}
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          )}
          
          {/* Main Image */}
          <img
            src={getImageUrl()}
            alt={game.name || 'Game'}
            className={`w-full h-[300px] transition-all duration-300 group-hover:scale-105 ${
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
            <div className="bg-white/90 dark:bg-black/70 text-black dark:text-white px-2 py-1 rounded-lg text-xs font-bold">
              {game.rating ? `${game.rating.toFixed(1)}/5` : '4.2/5'}
            </div>
          </div>

          {/* Favorite Button - Top Left */}
          <button
            onClick={handleFavoriteToggle}
            className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm transition-all duration-200 flex items-center justify-center text-white shadow-lg z-10"
            title={isInFavorites ? 'Remove from favorites' : 'Add to favorites'}
          >
            <FaHeart className={`w-4 h-4 ${isInFavorites ? 'fill-red-500 scale-110' : 'fill-white/70 hover:fill-red-400'}`} />
          </button>
        </div>
      </Link>

      {/* Content Section - Fixed height for lower part */}
      <div className="p-4 bg-gradient-to-b from-white/80 to-white/80 dark:from-gray-800 dark:to-gray-900 h-[100px] flex flex-col justify-between">
        {/* Platform Icons and Price - Top Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          {/* Platform Icons */}
          <div className="flex items-center gap-2">
            {getUniquePlatformIcons().map((platformData, index) => (
              <div key={index} className="w-5 h-5 flex items-center justify-center">
                {getPlatformIconComponent(platformData.icon, index)}
              </div>
            ))}
          </div>
          
          {/* Price Display - Right Side */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="text-lg font-bold text-green-600 dark:text-green-400">
              ${game.price ? game.price.toFixed(2) : '19.99'}
            </div>
            {game.originalPrice && game.originalPrice > game.price && (
              <div className="text-sm text-black dark:text-gray-400 line-through">
                ${game.originalPrice.toFixed(2)}
              </div>
            )}
          </div>
        </div>
        
        {/* Game Title and Add to Cart Button */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link to={`/games/${game.id}`} className="block flex-1">
            <h3 className="text-base font-bold text-black dark:text-white line-clamp-2 leading-tight hover:text-blue-600 dark:hover:text-blue-300 transition-colors cursor-pointer">
              {game.name || 'Untitled Game'}
            </h3>
          </Link>
          
          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className={`w-8 h-8 rounded-full transition-all duration-300 ease-in-out flex items-center justify-center hover:scale-110 shadow-md hover:shadow-lg flex-shrink-0 ${
              isAddedToCart 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            title={isAddedToCart ? 'Added to Cart!' : 'Add to Cart'}
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
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortraitGameCard;
