import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from './CartItem';

export default function SlidingCartSummary() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { items, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const cartPanelRef = useRef(null);

  // Listen for custom event to open cart summary
  useEffect(() => {
    const handleOpenCartSummary = () => {
      // Set animating state first
      setIsAnimating(true);
      // Add a small delay to ensure the DOM is ready for the animation
      setTimeout(() => {
        setIsOpen(true);
        // Trigger reflow for smooth animation
        if (cartPanelRef.current) {
          cartPanelRef.current.offsetHeight;
        }
      }, 10);
    };

    window.addEventListener('openCartSummary', handleOpenCartSummary);
    return () => {
      window.removeEventListener('openCartSummary', handleOpenCartSummary);
      // Clear timeout on cleanup
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Reset animation state after animation completes
    timeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
    }, 400);
  };

  const handleViewCart = () => {
    setIsOpen(false);
    // Small delay to allow animation to complete before navigation
    setTimeout(() => {
      navigate('/cart');
    }, 300);
  };

  const handleCheckout = () => {
    setIsOpen(false);
    // Small delay to allow animation to complete before navigation
    setTimeout(() => {
      navigate('/checkout');
    }, 300);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  return (
    <>
      {/* Floating Cart Button */}
      {items.length > 0 && (
        <button
          onClick={() => {
            // Set animating state first
            setIsAnimating(true);
            // Add a small delay to ensure the DOM is ready for the animation
            setTimeout(() => {
              setIsOpen(true);
              // Trigger reflow for smooth animation
              if (cartPanelRef.current) {
                cartPanelRef.current.offsetHeight;
              }
            }, 10);
          }}
          className="fixed bottom-6 right-6 z-40 bg-blue-600 dark:bg-orange-500 hover:bg-blue-700 dark:hover:bg-orange-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110"
          aria-label="Open cart summary"
        >
          {/* Cart Icon */}
          <div className="relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
            
            {/* Item Count Badge */}
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-medium">
              {items.length}
            </span>
          </div>
        </button>
      )}

      {/* Cart Summary Panel */}
      {(isOpen || isAnimating) && (
        <>
          {/* Backdrop with fade animation */}
          <div 
            className={`fixed inset-0 bg-black/50 z-50 transition-all duration-500 ease-out ${
              isOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={handleClose}
          />
          
          {/* Cart Panel with enhanced slide animation */}
          <div 
            ref={cartPanelRef}
            className={`fixed top-0 right-0 h-full w-full sm:w-96 lg:w-[450px] bg-white dark:bg-gray-800 shadow-2xl z-50 transform transition-all duration-500 ease-out ${
              isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            style={{
              transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
              boxShadow: isOpen ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : '0 0 0 0 rgba(0, 0, 0, 0)'
            }}
          >
            
            {/* Header */}
            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600 transition-all duration-500 ease-out">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3 transition-all duration-500 ease-out">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                  Cart Summary
                </h2>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-110"
                  aria-label="Close cart"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Cart Content */}
            <div className="flex flex-col h-full transition-all duration-500 ease-out">
              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 transition-all duration-500 ease-out">
                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🛒</div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Your cart is empty
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Start shopping to add games to your cart
                    </p>
                  </div>
                ) : (
                  items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))
                )}
              </div>

              {/* Cart Footer */}
              {items.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-700 transition-all duration-500 ease-out">
                  {/* Total */}
                  <div className="flex items-center justify-between mb-6 transition-all duration-500 ease-out">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">Total:</span>
                    <span className="text-2xl font-bold text-blue-600 dark:text-orange-400 transition-all duration-500 ease-out">
                      ${getCartTotal().toFixed(2)}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 transition-all duration-500 ease-out">
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-blue-600 dark:bg-orange-500 hover:bg-blue-700 dark:hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg"
                    >
                      Proceed to Checkout
                    </button>
                    
                    <button
                      onClick={handleViewCart}
                      className="w-full bg-white dark:bg-gray-800 border border-blue-500 dark:border-orange-500 text-blue-600 dark:text-orange-400 hover:bg-blue-50 dark:hover:bg-orange-900/20 font-semibold py-3 px-6 rounded-lg transition-all duration-300 ease-out hover:scale-105 hover:shadow-md"
                    >
                      View Full Cart
                    </button>
                    
                    <button
                      onClick={handleClearCart}
                      className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 ease-out hover:scale-105 hover:shadow-md"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
