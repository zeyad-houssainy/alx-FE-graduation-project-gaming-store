import { useCart } from '../context/CartContext';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity) => {
    updateQuantity(item.id, newQuantity);
  };

  const formatPrice = (price) => {
    if (price === 0) return 'Free';
    return `$${price.toFixed(2)}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Game Image */}
        <div className="flex-shrink-0">
          <img
            src={item.background_image}
            alt={item.name}
            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
          />
        </div>

        {/* Game Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white font-['Oxanium'] mb-2">
            {item.name}
          </h3>
          
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-600 dark:text-gray-300 mb-3">
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs font-medium w-fit">
              {item.genre}
            </span>
            <span className="flex items-center">
              <span className="text-amber-500 dark:text-orange-400 mr-1">⭐</span>
              {item.rating ? item.rating.toFixed(1) : 'N/A'}
            </span>
          </div>

          <div className="text-base sm:text-lg font-bold text-green-600 dark:text-green-400">
            {formatPrice(item.price)}
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center space-x-3 w-full sm:w-auto justify-center sm:justify-start">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            className="w-10 h-10 sm:w-8 sm:h-8 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg flex items-center justify-center transition-colors duration-200 touch-manipulation"
          >
            <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          
          <span className="w-16 sm:w-12 text-center text-base sm:text-lg font-bold text-gray-900 dark:text-white">
            {item.quantity}
          </span>
          
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className="w-10 h-10 sm:w-8 sm:h-8 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg flex items-center justify-center transition-colors duration-200 touch-manipulation"
          >
            <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* Total Price */}
        <div className="text-center sm:text-right w-full sm:w-auto">
          <div className="text-base sm:text-lg font-bold text-green-600 dark:text-green-400">
            {formatPrice(item.price * item.quantity)}
          </div>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => removeFromCart(item.id)}
          className="text-red-500 hover:text-red-700 transition-colors duration-200 self-center sm:self-start p-2 -m-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 touch-manipulation"
        >
          <svg className="w-6 h-6 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
