import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function SlidingCartSummary() {
  const navigate = useNavigate();
  const { items, getCartTotal, getCartItemCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  // Listen for custom event from header cart button
  useEffect(() => {
    const handleOpenCartSummary = () => {
      console.log('Custom event received, opening cart summary...');
      setIsOpen(true);
    };

    window.addEventListener('openCartSummary', handleOpenCartSummary);
    console.log('Event listener added for openCartSummary');

    return () => {
      window.removeEventListener('openCartSummary', handleOpenCartSummary);
      console.log('Event listener removed for openCartSummary');
    };
  }, []);

  const handleViewFullCart = () => {
    console.log('View full cart clicked');
    setIsOpen(false);
    navigate('/cart');
  };

  const handleCheckout = () => {
    console.log('Checkout clicked');
    setIsOpen(false);
    navigate('/checkout');
  };

  const handleCartButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Floating cart button clicked, opening summary...');
    setIsOpen(true);
  };

  // Don't render if cart is empty
  if (items.length === 0) {
    console.log('Cart is empty, not rendering SlidingCartSummary');
    return null;
  }

  console.log('SlidingCartSummary rendered, isOpen:', isOpen, 'items count:', items.length);

  return (
    <>
      {/* Cart Summary Button */}
      <button
        onClick={handleCartButtonClick}
        className="fixed bottom-6 right-6 z-[9999] bg-blue-600 hover:bg-blue-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-4 border-white dark:border-gray-800"
        aria-label="View cart summary"
        style={{ boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}
      >
        <div className="relative">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
          </svg>
          {/* Cart Badge */}
          {getCartItemCount() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] h-[20px] flex items-center justify-center font-bold shadow-lg">
              {getCartItemCount()}
            </span>
          )}
        </div>
      </button>

      {/* Sliding Cart Summary Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-[9998]"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Desktop Panel - Slides in from right */}
          <div className="hidden md:block fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl z-[9999] animate-slide-in">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-['Oxanium']">
                Cart Summary
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cart Items Summary */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {items.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <img
                      src={item.background_image}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-gray-100 truncate text-sm">
                        {item.name}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">
                        Qty: {item.quantity} • ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                
                {/* Show more items indicator */}
                {items.length > 3 && (
                  <div className="text-center py-2">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      +{items.length - 3} more items
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-6 space-y-4">
              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                <span className="text-2xl font-bold text-green-600">
                  ${getCartTotal().toFixed(2)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleViewFullCart}
                  className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  View Full Cart ({getCartItemCount()} items)
                </button>
                
                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>

              {/* Quick Info */}
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Secure checkout • Instant download • 24/7 support
              </div>
            </div>
          </div>

          {/* Mobile Panel - Slides up from bottom */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-2xl shadow-2xl z-[9999] animate-slide-up max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-['Oxanium']">
                Cart Summary
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cart Items Summary */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {items.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <img
                      src={item.background_image}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-gray-100 truncate text-sm">
                        {item.name}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">
                        Qty: {item.quantity} • ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                
                {/* Show more items indicator */}
                {items.length > 3 && (
                  <div className="text-center py-2">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      +{items.length - 3} more items
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-6 space-y-4">
              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                <span className="text-2xl font-bold text-green-600">
                  ${getCartTotal().toFixed(2)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleViewFullCart}
                  className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  View Full Cart ({getCartItemCount()} items)
                </button>
                
                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>

              {/* Quick Info */}
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Secure checkout • Instant download • 24/7 support
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
