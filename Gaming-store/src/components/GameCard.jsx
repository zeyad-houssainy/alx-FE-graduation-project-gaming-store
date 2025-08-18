import { useCart } from '../context/CartContext';

export default function GameCard({ game }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(game);
  };

  const formatPrice = (price) => {
    if (price === 0) return 'Free';
    return `$${price.toFixed(2)}`;
  };

  const formatRating = (rating) => {
    return rating ? rating.toFixed(1) : 'N/A';
  };

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
      {/* Game Image */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={game.background_image} 
          alt={game.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        {/* Rating Badge */}
        <div className="absolute top-4 right-4 bg-amber-500 text-black px-2 py-1 rounded-full text-xs font-bold">
          ⭐ {formatRating(game.rating)}
        </div>
        
        {/* Genre Badge */}
        <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          {game.genre}
        </div>
        
        {/* Price */}
        <div className="absolute bottom-4 right-4 bg-green-600 text-white px-3 py-1 rounded-lg font-bold text-lg">
          {formatPrice(game.price)}
        </div>
        
        {/* Hover Action Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50">
          <button 
            onClick={handleAddToCart}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg uppercase tracking-wider transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg"
          >
            Add to Cart
          </button>
        </div>
      </div>
      
      {/* Game Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2 text-gray-900 font-['Oxanium'] leading-tight">
          {game.name}
        </h3>
        
        {/* Platforms */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <span className="text-blue-600">🎮</span>
          <span className="uppercase tracking-wide">
            {game.platforms?.slice(0, 2).join(', ')}
            {game.platforms?.length > 2 && ' +'}
          </span>
        </div>
        
        {/* Release Date */}
        {game.released && (
          <p className="text-xs text-gray-500 mb-3">
            Released: {new Date(game.released).toLocaleDateString()}
          </p>
        )}
        
        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed overflow-hidden" style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {game.description}
        </p>
      </div>
    </div>
  );
}
