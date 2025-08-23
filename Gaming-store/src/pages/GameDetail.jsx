import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Loader from '../components/Loader';
import axios from 'axios';
import RatingStars from '../components/RatingStars';
import Button from '../components/Button';
import StoreInfo from '../components/StoreInfo';

export default function GameDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCartStore();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  // Fetch game data
  useEffect(() => {
    const fetchGame = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch from RAWG API first
        const response = await axios.get(`https://api.rawg.io/api/games/${id}?key=28849ae8cd824c84ae3af5da501b0d67`);
        
        if (response.data) {
          const gameData = response.data;
          setGame({
            id: gameData.id,
            name: gameData.name,
            background_image: gameData.background_image,
            description: gameData.description,
            rating: gameData.rating,
            metacritic: gameData.metacritic,
            released: gameData.released,
            platforms: gameData.platforms?.map(p => p.platform.name) || [],
            genres: gameData.genres?.map(g => g.name) || [],
            screenshots: gameData.short_screenshots?.map(s => s.image) || [],
            price: Math.floor(Math.random() * 60) + 20,
          });
        }
      } catch (err) {
        console.error('Error fetching game:', err);
        setError('Failed to load game data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchGame();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (game) {
      addToCart(game);
    }
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
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
          <Loader />
        </div>
      </>
    );
  }

  if (error || !game) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
          <div className="container mx-auto px-6 py-12">
            <div className="text-center">
              <div className="text-6xl mb-4">😞</div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Game not found</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                {error || "The game you're looking for doesn't exist."}
              </p>
              <Button onClick={() => navigate('/games')}>
                Back to Games
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const images = game.screenshots && game.screenshots.length > 0 
    ? [game.background_image, ...game.screenshots]
    : [game.background_image];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
        <div className="container mx-auto px-6 py-12">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <li>
                <button 
                  onClick={() => navigate('/')}
                  className="hover:text-blue-600 dark:hover:text-orange-400 transition-colors duration-200"
                >
                  Home
                </button>
              </li>
              <li className="text-gray-400 dark:text-gray-500">/</li>
              <li>
                <button 
                  onClick={() => navigate('/games')}
                  className="hover:text-blue-600 dark:hover:text-orange-400 transition-colors duration-200"
                >
                  Games
                </button>
              </li>
              <li className="text-gray-400 dark:text-gray-500">/</li>
              <li className="text-gray-900 dark:text-white font-medium">{game.name}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative h-64 sm:h-80 md:h-96 rounded-xl overflow-hidden shadow-2xl">
                <img
                  src={images[selectedImage]}
                  alt={game.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-16 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        selectedImage === index
                          ? 'border-blue-500 dark:border-orange-400'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
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
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-bold mb-4 text-gray-900 dark:text-white leading-tight">
                  {game.name}
                </h1>
                <RatingStars rating={game.rating} size="large" />
              </div>

              {/* Price and Add to Cart */}
              <div className="bg-white dark:bg-gray-700 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-600">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                  <span className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
                    {formatPrice(game.price)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
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
              <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600 space-y-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white font-bold">Game Details</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Genre</span>
                    <p className="font-medium text-gray-900 dark:text-white">{game.genre}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Release Date</span>
                    <p className="font-medium text-gray-900 dark:text-white">{formatDate(game.released)}</p>
                  </div>
                  
                  <div className="col-span-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Platforms</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {game.platforms?.map((platform, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white font-bold mb-4">About This Game</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {game.description}
                </p>
              </div>

              {/* Additional Info */}
              {game.website && (
                <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white font-bold mb-4">Official Website</h3>
                  <a
                    href={game.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-orange-400 hover:text-blue-700 dark:hover:text-orange-300 underline font-medium"
                  >
                    Visit Official Website →
                  </a>
                </div>
              )}

              {/* Store Information and Deals */}
              <StoreInfo gameId={game.id} gameName={game.name} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
