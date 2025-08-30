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
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 hover:shadow-md">
      <div className="flex items-start gap-4">
        {/* Game Image */}
        <div className="relative flex-shrink-0">
          <img
            src={item.background_image || item.image}
            alt={item.name}
            className="w-20 h-20 rounded-xl object-cover shadow-sm"
          />
          
          {/* Modern Remove Button */}
          <button
            onClick={handleRemove}
            className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg"
            aria-label="Remove item"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        {/* Game Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 line-clamp-2">
            {item.name}
          </h3>
          
          {/* Genre */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {((item.genres && item.genres[0]?.name) || item.genre) && (
              <span className="text-slate-700 dark:text-slate-300 text-xs px-3 py-1.5 rounded-lg font-medium border border-slate-200 dark:border-slate-700">
                {item.genres && item.genres[0]?.name ? item.genres[0].name : item.genre}
              </span>
            )}
          </div>
          
          {/* Price per item */}
          <div className="text-sm text-slate-600 dark:text-slate-400 mb-4 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            ${item.price.toFixed(2)} each
          </div>
        </div>

        {/* Quantity Controls and Total */}
        <div className="flex flex-col items-end gap-4">
          {/* Modern Quantity Controls */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="w-8 h-8 bg-white dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
              aria-label="Decrease quantity"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 13H5v-2h14v2z"/>
              </svg>
            </button>
            
            <span className="w-12 h-8 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg flex items-center justify-center text-lg font-bold text-slate-900 dark:text-white">
              {item.quantity}
            </span>
            
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="w-8 h-8 bg-white dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
              aria-label="Increase quantity"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
            </button>
          </div>
          
          {/* Total Price */}
          <div className="text-right">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide font-medium">Total</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
