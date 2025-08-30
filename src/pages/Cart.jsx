import React from 'react';
import { useCartStore } from '../stores';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import CartItem from '../components/CartItem';
import Button from '../components/Button';
import { Link, useNavigate } from 'react-router-dom';

export default function Cart() {
  const { items, getCartTotal, getCartItemCount, clearCart } = useCartStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/games');
  };

  if (items.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 sm:pt-24">
          <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <div className="text-center">
              <div className="text-6xl mb-4">🛒</div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Your cart is empty</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-8 px-4">
                Looks like you haven't added any games to your cart yet. Start shopping to discover amazing games!
              </p>
              <Button onClick={handleContinueShopping} size="large">
                Start Shopping
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-20 sm:pt-24">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Page Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-bold mb-4 sm:mb-6 text-gray-900 dark:text-gray-100">
              SHOPPING <span className="text-blue-600 dark:text-orange-400">CART</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed px-4">
              Review your selected games and proceed to checkout
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="xl:col-span-2 space-y-4 sm:space-y-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 font-bold mb-4 sm:mb-6">
                Cart Items ({getCartItemCount()})
              </h2>
             
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}


            </div>

            {/* Order Summary */}
            <div className="xl:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 md:p-6 shadow-lg border border-gray-200 dark:border-gray-700 sticky top-24">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 font-bold mb-4 sm:mb-6">
                  Order Summary
                </h3>

                {/* Cart Items Summary */}
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-xs sm:text-sm">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <img
                          src={item.background_image || item.image || '/assets/images/featured-game-1.jpg'}
                          alt={item.name}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100 text-xs sm:text-sm">{item.name}</p>
                          <p className="text-gray-500 dark:text-gray-400 text-xs">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900 dark:text-gray-100 text-xs sm:text-sm">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-gray-600 my-4"></div>

                {/* Total */}
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">Total</span>
                  <span className="text-xl sm:text-2xl font-bold text-green-600">
                    ${getCartTotal().toFixed(2)}
                  </span>
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={handleCheckout}
                  size="large"
                  className="w-full mb-4"
                >
                  Proceed to Checkout
                </Button>

                {/* Continue Shopping */}
                <Button
                  variant="outline"
                  onClick={handleContinueShopping}
                  className="w-full"
                >
                  Continue Shopping
                </Button>

                {/* Additional Info */}
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 text-sm sm:text-base">What's included:</h4>
                  <ul className="text-xs sm:text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• Digital download</li>
                    <li>• Instant access</li>
                    <li>• 24/7 support</li>
                    <li>• Secure payment</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
