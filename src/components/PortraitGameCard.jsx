import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../stores';

const PortraitGameCard = ({ game }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [cartButtonState, setCartButtonState] = useState('idle'); // 'idle', 'loading', 'success'
  
  const { addToCart } = useCartStore();

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  // Use game price if available, otherwise generate random pricing for demo
  const originalPrice = game.price || Math.floor(Math.random() * 50) + 10; // $10-$59
  const discount = game.discount || Math.floor(Math.random() * 80) + 20; // 20-99%
  const discountedPrice = game.discountedPrice || Math.round((originalPrice * (100 - discount)) / 100 * 100) / 100;

  return (
    <div className="group relative bg-gray-800/20 dark:bg-gray-800/30 rounded-lg overflow-hidden transition-all duration-300 w-[230px] flex flex-col border border-gray-700 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-400 shadow-lg hover:shadow-xl backdrop-blur-sm">
      {/* Game Cover Art Section (Top ~60% of the card) */}
      <div className="relative overflow-hidden w-[230px] h-[300px] flex-shrink-0 bg-gray-800">
        {/* Add to Cart Icon - Top Right */}
        <div className="absolute top-3 right-3 z-10">
          <button 
            className={`w-8 h-8 rounded-full transition-all duration-300 flex items-center justify-center text-white shadow-lg ${
              cartButtonState === 'success' 
                ? 'bg-green-600 scale-110' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (cartButtonState === 'idle') {
                setCartButtonState('loading');
                // Add to cart
                addToCart(game);
                // Simulate API call delay
                setTimeout(() => {
                  setCartButtonState('success');
                  // Reset to idle after 2 seconds
                  setTimeout(() => setCartButtonState('idle'), 2000);
                }, 500);
              }
            }}
            title={cartButtonState === 'success' ? 'Added to Cart!' : 'Add to Cart'}
            disabled={cartButtonState === 'loading'}
          >
            {cartButtonState === 'success' ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 376 384">
                <path d="M119 282L346 55l29 30l-256 256L0 222l30-30z"/>
              </svg>
            ) : cartButtonState === 'loading' ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5.1 4.8a.499.499 0 0 1 .471-.795a.5.5 0 0 1 .329.195L8 7V.5a.5.5 0 0 1 .5.5V7l2.1-2.8a.501.501 0 0 1 .895.229a.5.5 0 0 1-.095.371l-3 4c-.006.008-.017.012-.024.02a.5.5 0 0 1-.116.1a.3.3 0 0 1-.05.034a.47.47 0 0 1-.42 0a.3.3 0 0 1-.05-.034a.5.5 0 0 1-.116-.1c-.007-.008-.018-.012-.024-.02zm.65 9.95a1.245 1.245 0 0 1-.772 1.154a1.252 1.252 0 0 1-1.704-.91a1.25 1.25 0 1 1 2.475-.245zm8 0a1.245 1.245 0 0 1-.772 1.154a1.252 1.252 0 0 1-1.704-.91a1.249 1.249 0 1 1 2.475-.245zM14 5.5a.5.5 0 0 0-.5.5l-.5 4H4.09l-1.1-6.58a.5.5 0 0 0-.49-.418h-1a.5.5 0 0 0 .5.5a.5.5 0 0 0 .5.5h.576l1.43 8.58a.496.496 0 0 0 .493.418h9a.5.5 0 0 0 0-1h-8.58l-.167-1h8.74a1 1 0 0 0 .992-.876l.508-4.12a.5.5 0 0 0-.5-.5z"/>
              </svg>
            )}
          </button>
        </div>

        {/* Loading State */}
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
        
        {/* Main Image - Clickable */}
        <Link to={`/games/${game.id}`} className="block w-full h-full" onClick={() => console.log('PortraitGameCard image clicked:', game.id, game.name)}>
          <img
            src={game.background_image || game.image || '/assets/images/featured-game-1.jpg'}
            alt={game.name || 'Game'}
            className={`w-full h-full transition-all duration-500 cursor-pointer ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            } ${
              imageError ? 'object-contain p-4' : 'object-cover'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
            decoding="async"
          />
        </Link>

        {/* EA Play Overlay (for specific games) */}
        {game.name && game.name.toLowerCase().includes('battlefield') && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2">
            <span className="text-white text-xs font-medium">EA Play</span>
            <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
              <svg className="w-2 h-2 text-gray-900 dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        )}

        {/* Remastered Badge (for specific games) */}
        {game.name && game.name.toLowerCase().includes('remastered') && (
          <div className="absolute bottom-4 right-4 bg-gray-700 text-white px-2 py-1 rounded text-xs font-medium">
            REMASTERED
          </div>
        )}
      </div>

      {/* Text Details Section (Bottom ~40% of the card) */}
      <div className="bg-gray-900 dark:bg-gray-800 p-4 flex flex-col justify-between flex-1">
        {/* Base Game Label */}
        <div className="text-gray-400 text-xs mb-2">
          Base Game
        </div>
        
        {/* Game Title and Price - Clickable */}
        <Link to={`/games/${game.id}`} className="block" onClick={() => console.log('PortraitGameCard title clicked:', game.id, game.name)}>
          <div className="flex items-start justify-between gap-2 mb-3">
            <h3 className="text-white font-bold text-sm line-clamp-2 min-h-[2.5rem] hover:text-blue-300 transition-colors cursor-pointer flex-1">
              {game.name || 'Untitled Game'}
            </h3>
            {game.price && (
              <div className="text-sm font-bold text-green-400 dark:text-green-300 flex-shrink-0">
                ${game.price}
              </div>
            )}
          </div>
        </Link>
        
        {/* Pricing Information */}
        <div className="flex items-center gap-2">
          {/* Discount Percentage Badge */}
          <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">
            -{discount}%
          </div>
          
          {/* Original Price */}
          <span className="text-gray-400 text-sm line-through">
            ${originalPrice}.99*
          </span>
          
          {/* Discounted Price */}
          <span className="text-white font-bold text-sm">
            ${discountedPrice}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PortraitGameCard;
