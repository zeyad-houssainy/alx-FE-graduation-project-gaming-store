import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores';
import CartItem from './CartItem';

export default function SlidingCartSummary() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { items, getCartTotal } = useCartStore();
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const cartPanelRef = useRef(null);

  // Listen for custom event to open cart summary
  useEffect(() => {
    const handleOpenCartSummary = () => {
      setIsAnimating(true);
      setTimeout(() => {
        setIsOpen(true);
        if (cartPanelRef.current) {
          cartPanelRef.current.offsetHeight;
        }
      }, 10);
    };

    window.addEventListener('openCartSummary', handleOpenCartSummary);
    return () => {
      window.removeEventListener('openCartSummary', handleOpenCartSummary);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    timeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
    }, 400);
  };

  const handleViewCart = () => {
    setIsOpen(false);
    setTimeout(() => {
      navigate('/cart');
    }, 300);
  };

  const handleCheckout = () => {
    setIsOpen(false);
    setTimeout(() => {
      navigate('/checkout');
    }, 300);
  };

  return (
    <>


      {/* Modern Cart Summary Panel */}
      {(isOpen || isAnimating) && (
        <>
          {/* Backdrop */}
          <div 
            className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 transition-all duration-300 ease-out ${
              isOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={handleClose}
          />
          
          {/* Cart Panel */}
          <div 
            ref={cartPanelRef}
            className={`fixed top-0 right-0 h-screen w-full sm:w-96 lg:w-[420px] bg-white dark:bg-slate-900 shadow-2xl z-50 transform transition-all duration-300 ease-out ${
              isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            
            {/* Modern Header */}
            <div className="bg-slate-50 dark:bg-slate-800 px-6 py-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white dark:text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Shopping Cart</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{items.length} item{items.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
                  aria-label="Close cart"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Cart Content */}
            <div className="flex flex-col h-full">
              {/* Items List */}
              <div className="overflow-y-auto p-6 space-y-4 flex-1">
                {items.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                      Your cart is empty
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                      Start shopping to add amazing games to your cart
                    </p>
                    <button
                      onClick={handleClose}
                      className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-all duration-200"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))
                )}
              </div>
              
              {/* Spacer for empty cart */}
              {items.length === 0 && <div className="flex-1 min-h-[40vh]" />}

              {/* Modern Cart Footer */}
              {items.length > 0 && (
                <div className="border-t border-slate-200 dark:border-slate-700 p-6 bg-slate-50 dark:bg-slate-800 mt-auto sticky bottom-0">
                  {/* Total Section */}
                  <div className="flex items-center justify-between mb-6 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white dark:text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                      </div>
                      <span className="text-lg font-semibold text-slate-900 dark:text-white">Total Amount</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">
                      ${getCartTotal().toFixed(2)}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold py-4 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-3"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      Proceed to Checkout
                    </button>
                    
                    <button
                      onClick={handleViewCart}
                      className="w-full bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-500 font-semibold py-4 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-3"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                      </svg>
                      View Full Cart
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
