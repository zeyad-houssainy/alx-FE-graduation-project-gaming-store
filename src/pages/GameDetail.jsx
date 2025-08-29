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
import { FaHeart, FaShare, FaDownload, FaCalendar, FaGamepad, FaStar, FaShoppingCart, FaArrowLeft, FaTrophy, FaPlay, FaInfoCircle, FaTags, FaGlobe, FaUsers, FaClock, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

export default function GameDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCartStore();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingComment, setRatingComment] = useState('');

  // Convert all existing 10-star ratings to 5-star scale on component mount
  useEffect(() => {
    const savedRatings = JSON.parse(localStorage.getItem('userGameRatings') || '{}');
    let hasChanges = false;
    
    Object.keys(savedRatings).forEach(gameId => {
      if (savedRatings[gameId].rating > 5) {
        savedRatings[gameId].rating = Math.round((savedRatings[gameId].rating / 10) * 5);
        hasChanges = true;
      }
    });
    
    if (hasChanges) {
      localStorage.setItem('userGameRatings', JSON.stringify(savedRatings));
    }
  }, []);

  // Fetch game data
  useEffect(() => {
    const fetchGame = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch from RAWG API first
        const response = await axios.get(`https://api.rawg.io/api/games/${id}`, {
          params: {
            key: '8e59bea6409848d5992b40629a0399fc'
          }
        });
        
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
            website: gameData.website,
            developers: gameData.developers?.map(d => d.name) || [],
            publishers: gameData.publishers?.map(p => p.name) || [],
            tags: gameData.tags?.slice(0, 10).map(t => t.name) || [],
            playtime: gameData.playtime,
            achievements: gameData.achievements_count || 0,
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

  // Animation on mount
  useEffect(() => {
    if (game) {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [game]);

  // Load user's existing rating for this game
  useEffect(() => {
    if (game) {
      const savedRatings = JSON.parse(localStorage.getItem('userGameRatings') || '{}');
      const existingRating = savedRatings[game.id];
      if (existingRating) {
        // Convert old 10-star ratings to 5-star scale
        let convertedRating = existingRating.rating;
        if (existingRating.rating > 5) {
          convertedRating = Math.round((existingRating.rating / 10) * 5);
          // Update the stored rating to the new scale
          savedRatings[game.id] = {
            ...existingRating,
            rating: convertedRating
          };
          localStorage.setItem('userGameRatings', JSON.stringify(savedRatings));
        }
        setUserRating(convertedRating);
        setRatingComment(existingRating.comment || '');
      }
    }
  }, [game]);

  const handleAddToCart = () => {
    if (game) {
      addToCart(game);
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const handleRating = (rating) => {
    setUserRating(rating);
    setShowRatingModal(true);
  };

  const saveRating = () => {
    if (game && userRating > 0) {
      const savedRatings = JSON.parse(localStorage.getItem('userGameRatings') || '{}');
      savedRatings[game.id] = {
        rating: userRating,
        comment: ratingComment,
        gameName: game.name,
        gameImage: game.background_image,
        date: new Date().toISOString(),
        gameId: game.id
      };
      localStorage.setItem('userGameRatings', JSON.stringify(savedRatings));
      setShowRatingModal(false);
      
      // Show success message
      alert(`Rating saved! You gave ${game.name} ${userRating}/5 stars.`);
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20">
          <div className="flex items-center justify-center min-h-[80vh]">
            <div className="text-center">
              <div className="relative">
                <div className="w-32 h-32 border-4 border-blue-200 dark:border-orange-200 border-t-blue-600 dark:border-t-orange-400 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-32 h-32 border-4 border-transparent border-t-purple-400 dark:border-t-red-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              </div>
              <p className="text-xl text-gray-700 dark:text-gray-300 mt-6 font-medium">Loading amazing game details...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !game) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-pink-50 dark:from-gray-900 dark:via-red-900/20 dark:to-pink-900/20 pt-20">
          <div className="container mx-auto px-6 py-12">
            <div className="text-center">
              <div className="text-8xl mb-6 animate-bounce">😞</div>
              <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                Game not found
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                {error || "The game you're looking for doesn't exist or has been removed."}
              </p>
              <Button onClick={() => navigate('/games')} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-bold rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-2xl">
                <FaArrowLeft className="mr-2" />
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Hero Section with Parallax */}
        <div className="relative min-h-screen overflow-hidden">
          {/* Background Image with Parallax */}
          <div className="absolute inset-0">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-110"
              style={{ 
                backgroundImage: `url(${game.background_image})`,
                filter: 'blur(8px) brightness(0.3)'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
          </div>

          {/* Floating Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-4 h-4 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0s' }}></div>
            <div className="absolute top-40 right-20 w-6 h-6 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-40 left-1/4 w-3 h-3 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/2 right-1/3 w-5 h-5 bg-orange-400 rounded-full animate-spin" style={{ animationDelay: '0.5s' }}></div>
          </div>

          {/* Content */}
          <div className="relative z-10 container mx-auto px-6 pt-32 pb-20">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <ol className="flex items-center space-x-3 text-sm">
                <li>
                  <button 
                    onClick={() => navigate('/')}
                    className="text-white/80 hover:text-white transition-colors duration-200 flex items-center gap-2 hover:scale-105 transform"
                  >
                    <FaArrowLeft className="w-3 h-3" />
                    Home
                  </button>
                </li>
                <li className="text-white/60">/</li>
                <li>
                  <button 
                    onClick={() => navigate('/games')}
                    className="text-white/80 hover:text-white transition-colors duration-200 hover:scale-105 transform"
                  >
                    Games
                  </button>
                </li>
                <li className="text-white/60">/</li>
                <li className="text-white font-medium truncate max-w-xs">{game.name}</li>
              </ol>
            </nav>

            {/* Hero Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
              {/* Left Side - Game Info */}
              <div className={`space-y-6 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                {/* Game Title */}
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-7xl font-black text-white leading-tight drop-shadow-2xl">
                    {game.name}
                  </h1>
                  <div className="flex items-center gap-4">
                    <RatingStars rating={game.rating} size="large" />
                    {game.metacritic && (
                      <div className="bg-yellow-500 text-black px-3 py-1 rounded-full font-bold text-sm flex items-center gap-2">
                        <FaStar className="w-4 h-4" />
                        {game.metacritic}
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {game.genres?.slice(0, 2).map((genre, index) => (
                    <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center border border-white/20">
                      <div className="text-2xl mb-1">🎮</div>
                      <p className="text-white text-sm font-medium">{genre}</p>
                    </div>
                  ))}
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center border border-white/20">
                    <div className="text-2xl mb-1">📅</div>
                    <p className="text-white text-sm font-medium">{formatDate(game.released)}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center border border-white/20">
                    <div className="text-2xl mb-1">⭐</div>
                    <p className="text-white text-sm font-medium">{game.rating?.toFixed(1) || 'N/A'}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={handleAddToCart}
                    size="large"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-bold rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-2xl flex items-center gap-3"
                  >
                    <FaShoppingCart className="w-5 h-5" />
                    Add to Cart - {formatPrice(game.price)}
                  </Button>
                  <button
                    onClick={handleWishlist}
                    className="p-4 rounded-2xl border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 backdrop-blur-md transition-all duration-300 transform hover:scale-105"
                  >
                    <FaHeart className={`w-5 h-5 ${isWishlisted ? 'text-red-500 fill-current' : 'text-white'}`} />
                  </button>
                </div>

                {/* User Rating Section */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold">Your Rating</h3>
                    {userRating > 0 && (
                      <span className="text-yellow-400 font-bold">{userRating}/5</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRating(star)}
                        className={`w-8 h-8 rounded-full transition-all duration-200 transform hover:scale-110 ${
                          star <= userRating
                            ? 'bg-yellow-400 text-black'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        ⭐
                      </button>
                    ))}
                  </div>
                  {userRating === 0 && (
                    <p className="text-white/70 text-sm mt-2">Click to rate this game</p>
                  )}
                </div>
              </div>

              {/* Right Side - Image Gallery */}
              <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                <div className="relative group">
                  {/* Main Image */}
                  <div className="relative h-80 md:h-96 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 backdrop-blur-sm">
                    <img
                      src={images[selectedImage]}
                      alt={game.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="bg-white/20 backdrop-blur-md rounded-full p-6 border border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:scale-110">
                        <FaPlay className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Thumbnail Gallery */}
                  {images.length > 1 && (
                    <div className="mt-6 grid grid-cols-5 gap-3">
                      {images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`relative h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 transform hover:scale-110 ${
                            selectedImage === index
                              ? 'border-blue-400 dark:border-orange-400 shadow-lg shadow-blue-400/50 dark:shadow-orange-400/50'
                              : 'border-white/30 hover:border-white/50'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${game.name} screenshot ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {selectedImage === index && (
                            <div className="absolute inset-0 bg-blue-400/20 dark:bg-orange-400/20" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="relative z-20 -mt-20 pb-20">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Game Details */}
              <div className="lg:col-span-2 space-y-8">
                {/* About This Game */}
                <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50 transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                      <FaInfoCircle className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white">About This Game</h2>
                  </div>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                      {game.description}
                    </p>
                  </div>
                </div>

                {/* Game Features */}
                <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50 transform transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center">
                      <FaGamepad className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white">Game Features</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Platforms */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                        <FaTrophy className="w-5 h-5 text-yellow-500" />
                        Platforms
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {game.platforms?.map((platform, index) => (
                          <span
                            key={index}
                            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg transform hover:scale-105 transition-all duration-300"
                          >
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Genres */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                        <FaTags className="w-5 h-5 text-green-500" />
                        Genres
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {game.genres?.map((genre, index) => (
                          <span
                            key={index}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg transform hover:scale-105 transition-all duration-300"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Developers */}
                    {game.developers && game.developers.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                          <FaUsers className="w-5 h-5 text-blue-500" />
                          Developers
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {game.developers.map((dev, index) => (
                            <span
                              key={index}
                              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg transform hover:scale-105 transition-all duration-300"
                            >
                              {dev}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Release Date */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                        <FaCalendar className="w-5 h-5 text-red-500" />
                        Release Date
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 text-lg font-medium">
                        {formatDate(game.released)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Store Information and Deals */}
                <div className={`transform transition-all duration-700 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                  <StoreInfo gameId={game.id} gameName={game.name} />
                </div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-8">
                {/* Price Card */}
                <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20 dark:border-gray-700/50 sticky top-32 transform transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                  <div className="text-center space-y-6">
                    {/* Price */}
                    <div className="space-y-2">
                      <span className="text-4xl font-black text-green-600 dark:text-green-400">
                        {formatPrice(game.price)}
                      </span>
                      <p className="text-gray-600 dark:text-gray-400">
                        {game.price === 0 ? 'Free to Play' : 'Digital Download'}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <Button 
                        onClick={handleAddToCart}
                        size="large"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 text-lg font-bold rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-2xl"
                      >
                        <FaShoppingCart className="w-5 h-5 mr-2" />
                        Add to Cart
                      </Button>
                      
                      <button
                        onClick={handleWishlist}
                        className="w-full p-4 rounded-2xl border-2 border-white/30 text-gray-700 dark:text-white hover:bg-white/30 hover:border-white/50 backdrop-blur-md transition-all duration-300 transform hover:scale-105"
                      >
                        <FaHeart className={`w-5 h-5 mx-auto ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-700 dark:text-white'}`} />
                      </button>
                    </div>

                    {/* Additional Info */}
                    <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                      {game.website && (
                        <a
                          href={game.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 text-blue-600 dark:text-orange-400 hover:text-blue-700 dark:hover:text-orange-300 font-medium transition-colors duration-200"
                        >
                          <FaGlobe className="w-4 h-4" />
                          Official Website
                        </a>
                      )}
                      
                      {game.playtime && (
                        <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                          <FaClock className="w-4 h-4" />
                          <span>Avg. {game.playtime}h</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {game.tags && game.tags.length > 0 && (
                  <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20 dark:border-gray-700/50 transform transition-all duration-700 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <FaTags className="w-5 h-5 text-purple-500" />
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {game.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-300">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
              Rate {game.name}
            </h3>
            
            {/* Rating Display */}
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">
                {'⭐'.repeat(userRating)}
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                You gave this game {userRating}/5 stars
              </p>
            </div>

            {/* Comment Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Add a comment (optional)
              </label>
              <textarea
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                placeholder="What did you think of this game?"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                rows="3"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowRatingModal(false)}
                className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={saveRating}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Save Rating
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
