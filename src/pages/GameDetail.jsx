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
import { fetchGameScreenshots, fetchGameMovies } from '../services/rawgApi';
import { FaHeart, FaShare, FaDownload, FaCalendar, FaGamepad, FaStar, FaShoppingCart, FaArrowLeft, FaTrophy, FaPlay, FaInfoCircle, FaTags, FaGlobe, FaUsers, FaClock, FaThumbsUp, FaThumbsDown, FaVideo, FaImages, FaExpand, FaCalendarAlt, FaEye, FaRocket, FaGem, FaLightbulb } from 'react-icons/fa';

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
  const [screenshots, setScreenshots] = useState([]);
  const [movies, setMovies] = useState([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  // const [selectedMediaType, setSelectedMediaType] = useState('screenshots'); // 'screenshots' or 'movies'
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Define media arrays early to avoid hoisting issues
  const allScreenshots = game ? [
    game.background_image,
    ...(game.screenshots || []),
    ...(screenshots.map(s => s.image) || [])
  ].filter(Boolean) : [];

  const allMovies = movies ? movies.map(m => m.preview || m.data?.max || m.data?.['480'] || m.data?.['720'] || m.data?.['1080']).filter(Boolean) : [];

  // Combined media array for the gallery
  const allMedia = [
    ...allScreenshots.map(src => ({ type: 'image', src, alt: 'Screenshot' })),
    ...allMovies.map(src => ({ type: 'video', src, alt: 'Video' }))
  ];

  // Get platform icon component
  const getPlatformIconComponent = (platformName, index) => {
    const iconProps = {
      key: index,
      className: "w-8 h-8 text-white"
    };

    const platformLower = platformName.toLowerCase();
    
    if (platformLower.includes('steam')) {
      return <img src="/assets/icons/steam.svg" alt="Steam" {...iconProps} />;
    } else if (platformLower.includes('epic')) {
      return <img src="/assets/icons/epic-games.svg" alt="Epic Games" {...iconProps} />;
    } else if (platformLower.includes('playstation') || platformLower.includes('ps')) {
      return <img src="/assets/icons/playstation.svg" alt="PlayStation" {...iconProps} />;
    } else if (platformLower.includes('psp')) {
      return <img src="/assets/icons/sony.svg" alt="PSP" {...iconProps} />;
    } else if (platformLower.includes('xbox')) {
      return <img src="/assets/icons/xbox.svg" alt="Xbox" {...iconProps} />;
    } else if (platformLower.includes('nintendo') || platformLower.includes('switch')) {
      return <img src="/assets/icons/nintendo-switch.svg" alt="Nintendo" {...iconProps} />;
    } else if (platformLower.includes('windows') || platformLower.includes('pc')) {
      return <img src="/assets/icons/windows.svg" alt="PC" {...iconProps} />;
    } else if (platformLower.includes('mac') || platformLower.includes('macos')) {
      return <img src="/assets/icons/mac-os.svg" alt="macOS" {...iconProps} />;
    } else if (platformLower.includes('ubuntu') || platformLower.includes('linux')) {
      return <img src="/assets/icons/ubuntu.svg" alt="Linux" {...iconProps} />;
    } else if (platformLower.includes('android')) {
      return <img src="/assets/icons/android.svg" alt="Android" {...iconProps} />;
    } else {
      return <span key={index} className="w-8 h-8 text-slate-900 dark:text-white flex items-center justify-center text-xs font-bold">
        {platformName.charAt(0).toUpperCase()}
      </span>;
    }
  };

  // Navigation functions for gallery
  const nextImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setSelectedImage((prev) => (prev + 1) % allMedia.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const previousImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setSelectedImage((prev) => (prev - 1 + allMedia.length) % allMedia.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Touch/swipe handlers
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextImage();
    } else if (isRightSwipe) {
      previousImage();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        previousImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTransitioning]);

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

          // Fetch additional media (screenshots and movies)
          setMediaLoading(true);
          try {
            const [screenshotsData, moviesData] = await Promise.all([
              fetchGameScreenshots(gameData.id),
              fetchGameMovies(gameData.id)
            ]);
            
            setScreenshots(screenshotsData);
            setMovies(moviesData);
          } catch (mediaError) {
            console.error('Error fetching media:', mediaError);
            // Continue without media if there's an error
          } finally {
            setMediaLoading(false);
          }
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

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!showLightbox) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowLightbox(false);
      } else if (e.key === 'ArrowLeft' && allScreenshots.length > 1) {
        const currentIndex = allScreenshots.indexOf(lightboxImage);
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : allScreenshots.length - 1;
        setLightboxImage(allScreenshots[prevIndex]);
      } else if (e.key === 'ArrowRight' && allScreenshots.length > 1) {
        const currentIndex = allScreenshots.indexOf(lightboxImage);
        const nextIndex = currentIndex < allScreenshots.length - 1 ? currentIndex + 1 : 0;
        setLightboxImage(allScreenshots[nextIndex]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showLightbox, lightboxImage, allScreenshots]);

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

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
    setShowVideoPlayer(true);
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
        <div className="min-h-screen bg-gray-100 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pt-20">
          <div className="flex items-center justify-center min-h-[80vh]">
            <div className="text-center">
              <div className="relative">
                <div className="w-32 h-32 border-4 border-blue-200 dark:border-orange-200 border-t-blue-600 dark:border-t-orange-400 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-32 h-32 border-4 border-transparent border-t-purple-400 dark:border-t-red-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              </div>
                              <p className="text-xl text-slate-700 dark:text-slate-300 mt-6 font-medium">Loading amazing game details...</p>
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
        <div className="min-h-screen bg-gray-100 dark:bg-gradient-to-br dark:from-slate-900 dark:via-red-900/20 dark:to-pink-900/20 pt-20">
          <div className="container mx-auto px-6 py-12">
            <div className="text-center">
              <div className="text-8xl mb-6 animate-bounce">😞</div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                Game not found
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
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

  // Use the media arrays defined above
  const images = allScreenshots;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Hero Section - Modern Flat Design */}
        <div className="relative min-h-screen overflow-hidden">
          {/* Background Image with Modern Overlay */}
          <div className="absolute inset-0">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-110"
              style={{ 
                backgroundImage: `url(${game.background_image})`,
                opacity: '0.7'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/90 to-slate-900/70" />
          </div>

          {/* Modern Floating Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
            <div className="absolute top-40 right-20 w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-amber-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>

          {/* Content */}
          <div className="relative z-10 container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-12 sm:pb-16 md:pb-20">
            {/* Modern Breadcrumb */}
            <nav className="mb-6 sm:mb-8">
              <ol className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm overflow-x-auto pb-2">
                <li>
                  <button 
                    onClick={() => navigate('/')}
                    className="px-2 sm:px-3 py-2 text-white/90 hover:text-white transition-all duration-200 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                  >
                    <FaArrowLeft className="w-3 h-3" />
                    <span className="hidden sm:inline">Home</span>
                  </button>
                </li>
                <li className="text-white/40">/</li>
                <li>
                  <button 
                    onClick={() => navigate('/games')}
                    className="px-2 sm:px-3 py-2 text-white/90 hover:text-white transition-all duration-200 text-xs sm:text-sm"
                  >
                    <span className="hidden sm:inline">Games</span>
                    <span className="sm:hidden">G</span>
                  </button>
                </li>
                <li className="text-white/40">/</li>
                <li className="px-2 sm:px-3 py-2 text-white font-medium truncate max-w-[120px] sm:max-w-xs text-xs sm:text-sm">
                  {game.name}
                </li>
              </ol>
            </nav>

            {/* Hero Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-start lg:items-center min-h-[60vh] sm:min-h-[65vh] lg:min-h-[70vh]">
              {/* Left Side - Game Info */}
              <div className={`space-y-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                {/* Game Rating */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <FaStar className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
                    <span className="text-xl sm:text-2xl font-bold text-white">{game.rating?.toFixed(1) || 'N/A'}</span>
                  </div>
                  {game.metacritic && (
                    <div className="flex items-center gap-2">
                      <FaStar className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                      <span className="text-lg sm:text-xl font-bold text-white">{game.metacritic}</span>
                    </div>
                  )}
                </div>

                {/* Game Title */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                    <FaRocket className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                    <span className="text-xs sm:text-sm font-medium text-white/90">Featured Game</span>
                  </div>
                  
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight drop-shadow-2xl">
                    {game.name}
                  </h1>
                </div>





                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button 
                    onClick={handleAddToCart}
                    size="large"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2 sm:gap-3 border-2 border-blue-500 hover:border-blue-600"
                  >
                    <FaShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Add to Cart - {formatPrice(game.price)}</span>
                    <span className="sm:hidden">Add to Cart</span>
                  </Button>
                  <button
                    onClick={handleWishlist}
                    className="p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 border-white/30 text-white hover:bg-white/20 transition-all duration-300"
                  >
                    <FaHeart className={`w-4 h-4 sm:w-5 sm:h-5 ${isWishlisted ? 'text-red-400 fill-current' : 'text-white'}`} />
                  </button>
                </div>

                {/* User Rating Section */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/20">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold text-sm sm:text-base">Your Rating</h3>
                    {userRating > 0 && (
                      <span className="text-yellow-400 font-bold text-sm sm:text-base">{userRating}/5</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRating(star)}
                        className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full transition-all duration-200 transform hover:scale-110 ${
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
                    <p className="text-white/70 text-xs sm:text-sm mt-2">Click to rate this game</p>
                  )}
                </div>
              </div>

              {/* Right Side - Image Gallery */}
              <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                <div className="relative group">
                  {/* Main Image */}
                  <div 
                    className="relative h-64 sm:h-72 md:h-80 lg:h-96 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 sm:border-4 border-white/20 backdrop-blur-sm"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    {/* Navigation Arrows */}
                    {allMedia.length > 1 && (
                      <>
                        {/* Previous Button */}
                        <button
                          onClick={previousImage}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-110"
                          disabled={isTransitioning}
                        >
                          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>

                        {/* Next Button */}
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-110"
                          disabled={isTransitioning}
                        >
                          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </>
                    )}
                    {mediaLoading ? (
                      <div className="w-full h-full flex items-center justify-center bg-slate-800">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
                          <p className="text-white/80 text-sm">Loading media...</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {allMedia[selectedImage]?.type === 'video' ? (
                          <>
                            {/* Video Thumbnail */}
                            <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                              <FaVideo className="w-24 h-24 text-slate-400" />
                            </div>
                            {/* Video Play Button Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                              <div 
                                className="bg-red-500 hover:bg-red-600 rounded-full p-6 border-2 border-white shadow-lg transition-all duration-300 transform hover:scale-110 cursor-pointer"
                                onClick={() => {
                                  setSelectedVideo(allMedia[selectedImage].src);
                                  setShowVideoPlayer(true);
                                }}
                              >
                                <FaPlay className="w-8 h-8 text-white" />
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <img
                              src={allMedia[selectedImage]?.src || images[selectedImage]}
                              alt={game.name}
                              className={`w-full h-full object-cover transition-all duration-300 ease-in-out group-hover:scale-110 ${
                                isTransitioning ? 'scale-95 opacity-80' : 'scale-100 opacity-100'
                              }`}
                            />
                            {/* Image Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </>
                        )}
                      </>
                    )}
                  </div>

                  {/* Thumbnail Gallery */}
                  {!mediaLoading && allMedia.length > 1 && (
                    <div className="mt-4 sm:mt-6">
                      {/* Swipe Instructions */}
                      <div className="text-center mb-3">
                        <p className="text-white/70 text-xs sm:text-sm">
                          💡 Swipe left/right or use arrow keys to navigate
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3">
                        {allMedia.map((media, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`relative h-12 sm:h-16 rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all duration-300 transform hover:scale-110 ${
                              selectedImage === index
                                ? 'border-blue-400 dark:border-orange-400 shadow-lg shadow-blue-400/50 dark:shadow-orange-400/50 scale-110'
                                : 'border-white/30 hover:border-white/50'
                            }`}
                          >
                            {media.type === 'video' ? (
                              <>
                                {/* Video Thumbnail */}
                                <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                  <FaVideo className="w-6 h-6 text-slate-400" />
                                </div>
                                {/* Video Indicator */}
                                <div className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                  <FaPlay className="w-2 h-2 text-white" />
                                </div>
                              </>
                            ) : (
                              <img
                                src={media.src}
                                alt={`${game.name} screenshot ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            )}
                            {selectedImage === index && (
                              <div className="absolute inset-0 bg-blue-400/20 dark:bg-orange-400/20" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="relative z-20 -mt-12 sm:-mt-16 md:-mt-20 pb-12 sm:pb-16 md:pb-20 bg-gray-100 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Left Column - Game Details */}
              <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                {/* About This Game */}
                <div className={`bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-200 dark:border-slate-700 transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                  <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 bg-blue-500 rounded-xl sm:rounded-2xl flex items-center justify-center">
                      <FaInfoCircle className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">About This Game</h2>
                  </div>
                  <div className="prose prose-sm sm:prose-lg dark:prose-invert max-w-none">
                    <div 
                      className="text-slate-700 dark:text-slate-300 leading-relaxed text-base sm:text-lg"
                      dangerouslySetInnerHTML={{ __html: game.description }}
                    />
                  </div>
                </div>

                {/* Game Features */}
                <div className={`bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-200 dark:border-slate-700 transform transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                  <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 bg-emerald-500 rounded-xl sm:rounded-2xl flex items-center justify-center">
                      <FaGamepad className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    {/* Platforms */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-3">
                        <FaTrophy className="w-5 h-5 text-amber-500" />
                        Platforms
                      </h3>
                      <div className="flex flex-wrap gap-4">
                        {game.platforms?.map((platform, index) => (
                          <div
                            key={index}
                            className="group relative p-4 rounded-xl transform hover:scale-110 transition-all duration-300 cursor-pointer"
                            title={platform}
                          >
                            {getPlatformIconComponent(platform, index)}
                            {/* Hover Tooltip */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 shadow-lg">
                              {platform}
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900 dark:border-t-slate-100"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Genres */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-3">
                        <FaTags className="w-5 h-5 text-emerald-500" />
                        Genres
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {game.genres?.map((genre, index) => (
                          <span
                            key={index}
                            className="text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 transition-all duration-300"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Developers */}
                    {game.developers && game.developers.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                          <FaUsers className="w-5 h-5 text-blue-500" />
                          Developers
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {game.developers.map((dev, index) => (
                            <span
                              key={index}
                              className="text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 transition-all duration-300"
                            >
                              {dev}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Release Date */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                        <FaCalendar className="w-5 h-5 text-red-500" />
                        Release Date
                      </h3>
                      <p className="text-slate-700 dark:text-slate-300 text-lg font-medium">
                        {formatDate(game.released)}
                      </p>
                    </div>
                  </div>
                </div>



                {/* Video Gallery */}
                {allMovies.length > 0 && (
                  <div className={`bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 transform transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center">
                        <FaVideo className="w-7 h-7 text-white" />
                      </div>
                      <h2 className="text-3xl font-black text-slate-900 dark:text-white">Game Videos</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {allMovies.map((video, index) => (
                        <div 
                          key={index} 
                          className="group relative aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-600 hover:border-red-400 dark:hover:border-red-400 transition-all duration-300 transform hover:scale-105 cursor-pointer bg-slate-100 dark:bg-slate-700 shadow-sm"
                          onClick={() => handleVideoSelect(video)}
                        >
                          {/* Video Thumbnail */}
                          <div className="w-full h-full flex items-center justify-center">
                            <FaVideo className="w-16 h-16 text-slate-400 group-hover:text-red-500 transition-colors duration-300" />
                          </div>
                          
                          {/* Play Button Overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                            <div className="bg-red-500 rounded-full p-4 text-white transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-lg">
                              <FaPlay className="w-6 h-6" />
                            </div>
                          </div>
                          
                          {/* Video Info */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/90 to-transparent p-4">
                            <p className="text-white text-sm font-medium">Video {index + 1}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Store Information and Deals */}
                <div className={`transform transition-all duration-700 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                  <StoreInfo gameId={game.id} gameName={game.name} />
                </div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6 sm:space-y-8">
                {/* Wishlist Card */}
                <div className={`bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-200 dark:border-slate-700 lg:sticky lg:top-32 transform transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                  <div className="text-center space-y-6 sm:space-y-8">
                    {/* Wishlist Button */}
                    <div className="space-y-4">
                      <button
                        onClick={handleWishlist}
                        className="w-full p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300"
                      >
                        <FaHeart className={`w-5 h-5 sm:w-6 sm:h-6 mx-auto ${isWishlisted ? 'text-red-500 fill-current' : 'text-slate-500'}`} />
                      </button>
                    </div>

                    {/* Additional Info */}
                    <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-600">
                      {game.website && (
                        <a
                          href={game.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-3 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                          <FaGlobe className="w-4 h-4" />
                          Official Website
                        </a>
                      )}
                      
                      {game.playtime && (
                        <div className="flex items-center justify-center gap-3 text-slate-600 dark:text-slate-400 px-4 py-3">
                          <FaClock className="w-4 h-4" />
                          <span>Avg. {game.playtime}h</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>



                {/* Tags */}
                {game.tags && game.tags.length > 0 && (
                  <div className={`bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 transform transition-all duration-700 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                      <FaTags className="w-5 h-5 text-purple-500" />
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {game.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 transition-all duration-300"
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

        {/* Additional Game Information */}
        <div className="relative z-20 pb-12 sm:pb-16 md:pb-20 bg-gray-100 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 gap-6 sm:gap-8">{/* Game Videos */}
              {allMovies.length > 0 && (
                <div className={`bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-200 dark:border-slate-700 transform transition-all duration-700 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                  <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 bg-red-500 rounded-xl sm:rounded-2xl flex items-center justify-center">
                      <FaVideo className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Videos</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {allMovies.slice(0, 4).map((video, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedVideo(video);
                          setShowVideoPlayer(true);
                        }}
                        className="relative group aspect-video rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-600 hover:border-red-400 dark:hover:border-red-400 transition-all duration-300 transform hover:scale-105"
                      >
                        <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                          <FaVideo className="w-12 h-12 text-slate-400" />
                        </div>
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <FaPlay className="w-8 h-8 text-white" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-300">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 text-center">
              Rate {game.name}
            </h3>
            
            {/* Rating Display */}
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">
                {'⭐'.repeat(userRating)}
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                You gave this game {userRating}/5 stars
              </p>
            </div>

            {/* Comment Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Add a comment (optional)
              </label>
              <textarea
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                placeholder="What did you think of this game?"
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-400 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white resize-none"
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

      {/* Lightbox Modal for Images */}
      {showLightbox && lightboxImage && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowLightbox(false)}
        >
          <div className="relative max-w-7xl max-h-full" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={() => setShowLightbox(false)}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-200 transform hover:scale-110"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Navigation Buttons */}
            {allScreenshots.length > 1 && (
              <>
                <button
                  onClick={() => {
                    const currentIndex = allScreenshots.indexOf(lightboxImage);
                    const prevIndex = currentIndex > 0 ? currentIndex - 1 : allScreenshots.length - 1;
                    setLightboxImage(allScreenshots[prevIndex]);
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-200 transform hover:scale-110"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    const currentIndex = allScreenshots.indexOf(lightboxImage);
                    const nextIndex = currentIndex < allScreenshots.length - 1 ? currentIndex + 1 : 0;
                    setLightboxImage(allScreenshots[nextIndex]);
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-200 transform hover:scale-110"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Image */}
            <img
              src={lightboxImage}
              alt={`${game.name} full size`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />

            {/* Image Counter */}
            {allScreenshots.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                {allScreenshots.indexOf(lightboxImage) + 1} / {allScreenshots.length}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {showVideoPlayer && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowVideoPlayer(false)}
        >
          <div className="relative max-w-6xl max-h-full w-full" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={() => setShowVideoPlayer(false)}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-200 transform hover:scale-110"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Video Player */}
            <div className="w-full aspect-video rounded-xl overflow-hidden bg-black">
              <video
                src={selectedVideo || allMovies[0]}
                className="w-full h-full"
                controls
                autoPlay
                preload="metadata"
                onError={(e) => {
                  console.error('Video playback error:', e);
                  alert('Unable to play this video. Please try another one.');
                }}
              >
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Video Navigation */}
            {allMovies.length > 1 && (
              <div className="mt-4 flex justify-center gap-2">
                {allMovies.map((video, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedVideo(video)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      video === (selectedVideo || allMovies[0])
                        ? 'bg-red-500 text-white'
                        : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                    }`}
                  >
                    Video {index + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
