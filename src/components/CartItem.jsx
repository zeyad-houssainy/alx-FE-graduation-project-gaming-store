import React from 'react';
import { useCartStore } from '../stores';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCartStore();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(item.id);
    } else {
      updateQuantity(item.id, newQuantity);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Game Image */}
        <div className="relative flex-shrink-0">
          <img
            src={item.background_image || item.image}
            alt={item.name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover"
          />
          
          {/* Remove Button */}
          <button
            onClick={handleRemove}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
            aria-label="Remove item"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Game Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {item.name}
          </h3>
          
          {/* Genre and Rating */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {((item.genres && item.genres[0]?.name) || item.genre) && (
              <span className="bg-blue-100 dark:bg-orange-900/30 text-blue-800 dark:text-orange-200 text-xs px-2 py-1 rounded-md font-medium">
                {item.genres && item.genres[0]?.name ? item.genres[0].name : item.genre}
              </span>
            )}
            {item.rating && (
              <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 text-xs px-2 py-1 rounded-md font-medium flex items-center gap-1">
                ⭐ {item.rating}
              </span>
            )}
          </div>
          
          {/* Price per item */}
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            ${item.price.toFixed(2)} each
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="w-8 h-8 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md flex items-center justify-center transition-colors"
              aria-label="Decrease quantity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            
            <span className="w-10 h-8 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md flex items-center justify-center text-lg font-bold text-gray-900 dark:text-white">
              {item.quantity}
            </span>
            
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="w-8 h-8 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md flex items-center justify-center transition-colors"
              aria-label="Increase quantity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          
          {/* Total Price */}
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total</div>
            <div className="text-xl font-bold text-blue-600 dark:text-orange-400">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
