import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetchGameById } from '../hooks/useFetchGames';
import { useCart } from '../context/CartContext';
import RatingStars from '../components/RatingStars';
import Button from '../components/Button';
import Loader from '../components/Loader';

export default function GameDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { game, loading, error } = useFetchGameById(id);
  const [selectedImage, setSelectedImage] = useState(0);

  const handleAddToCart = () => {
    addToCart(game);
  };

  const formatPrice = (price) => {
    if (price === 0) return 'Free';
    return `$${price.toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <Loader />
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <div className="text-6xl mb-4">😞</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Game not found</h1>
            <p className="text-gray-600 mb-8">
              {error || "The game you're looking for doesn't exist."}
            </p>
            <Button onClick={() => navigate('/games')}>
              Back to Games
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const images = game.screenshots && game.screenshots.length > 0 
    ? [game.background_image, ...game.screenshots]
    : [game.background_image];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <button 
                onClick={() => navigate('/')}
                className="hover:text-blue-600 transition-colors duration-200"
              >
                Home
              </button>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <button 
                onClick={() => navigate('/games')}
                className="hover:text-blue-600 transition-colors duration-200"
              >
                Games
              </button>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium">{game.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative h-96 rounded-xl overflow-hidden shadow-2xl">
              <img
                src={images[selectedImage]}
                alt={game.name}
                className="w-full h-full object-cover"
              />
              
              {/* Image Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              
              {/* Rating Badge */}
              <div className="absolute top-4 right-4 bg-amber-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                ⭐ {game.rating ? game.rating.toFixed(1) : 'N/A'}
              </div>
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === index 
                        ? 'border-blue-500 shadow-lg' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${game.name} screenshot ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Game Info */}
          <div className="space-y-6">
            {/* Title and Rating */}
            <div>
              <h1 className="text-4xl md:text-5xl font-black font-['Oxanium'] mb-4 text-gray-900 leading-tight">
                {game.name}
              </h1>
              <RatingStars rating={game.rating} size="large" />
            </div>

            {/* Price and Add to Cart */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-bold text-green-600">
                  {formatPrice(game.price)}
                </span>
                <span className="text-sm text-gray-500">
                  {game.price === 0 ? 'Free to Play' : 'Digital Download'}
                </span>
              </div>
              
              <Button 
                onClick={handleAddToCart}
                size="large"
                className="w-full"
              >
                Add to Cart
              </Button>
            </div>

            {/* Game Details */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 space-y-4">
              <h3 className="text-xl font-bold text-gray-900 font-['Oxanium']">Game Details</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Genre</span>
                  <p className="font-medium text-gray-900">{game.genre}</p>
                </div>
                
                <div>
                  <span className="text-sm text-gray-500">Release Date</span>
                  <p className="font-medium text-gray-900">{formatDate(game.released)}</p>
                </div>
                
                <div className="col-span-2">
                  <span className="text-sm text-gray-500">Platforms</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {game.platforms?.map((platform, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 font-['Oxanium'] mb-4">About This Game</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {game.description}
              </p>
            </div>

            {/* Additional Info */}
            {game.website && (
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 font-['Oxanium'] mb-4">Official Website</h3>
                <a
                  href={game.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 underline font-medium"
                >
                  Visit Official Website →
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
