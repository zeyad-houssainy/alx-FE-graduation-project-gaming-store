import { useEffect, useState } from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { useNavigate } from 'react-router-dom';

export default function CheckoutSuccess() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup timer on component unmount
    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-20 sm:pt-24 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
          {/* Success Icon */}
          <div className="text-8xl mb-6 animate-bounce">🎉</div>
          
          {/* Thank You Message */}
          <h1 className="text-4xl font-black font-bold text-gray-900 dark:text-white mb-4">
            Order Confirmed! 🎉
          </h1>
          
          {/* Order Details */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-6">
            <p className="text-lg text-green-800 dark:text-green-200 font-semibold mb-2">
              🚚 Order Confirmed
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Your order will be delivered within <span className="font-bold text-blue-600 dark:text-orange-400">3-5 business days</span>
            </p>
          </div>

          {/* Additional Information */}
          <div className="space-y-3 mb-8">
            <p className="text-gray-600 dark:text-gray-300">
              A confirmation email has been sent to your registered email address
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              You can track your order status in your profile
            </p>
          </div>

          {/* Countdown and Redirect Message */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <p className="text-blue-800 dark:text-blue-200 font-medium">
              Redirecting to home page in <span className="font-bold text-xl">{countdown}</span> seconds...
            </p>
          </div>

          {/* Manual Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/games')}
              className="px-6 py-3 bg-white dark:bg-orange-500 border border-gray-300 dark:border-orange-500 hover:border-blue-600 dark:hover:bg-orange-600 text-gray-700 dark:text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 hover:text-blue-600 dark:hover:text-white"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="px-6 py-3 bg-white dark:bg-gray-500 border border-gray-300 dark:border-gray-500 hover:border-blue-600 dark:hover:bg-gray-600 text-gray-700 dark:text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 hover:text-blue-600 dark:hover:text-white"
            >
              View Orders
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


