import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchDeals, fetchStores } from '../services/cheapsharkApi';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { FaArrowLeft, FaExternalLinkAlt, FaShoppingCart, FaHeart, FaStar, FaRocket, FaCalendar, FaGamepad, FaTags, FaGlobe, FaClock, FaThumbsUp, FaThumbsDown, FaVideo, FaImages, FaExpand, FaCalendarAlt, FaEye, FaGem, FaLightbulb, FaFire, FaPercent, FaStore, FaCheck } from 'react-icons/fa';
import { useCartStore, useAuthStore } from '../stores';

const DealDetail = () => {
  const { dealId } = useParams();
  const navigate = useNavigate();
  const [deal, setDeal] = useState(null);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  
  const { addToCart } = useCartStore();
  const { addToFavorites, removeFromFavorites, isFavorite } = useAuthStore();

  useEffect(() => {
    fetchDealData();
    fetchStoresData();
  }, [dealId]);

  // Animation on mount
  useEffect(() => {
    if (deal) {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [deal]);

  const fetchDealData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all deals and find the specific one
      const dealsData = await fetchDeals({ pageSize: 1000 });
      
      if (dealsData && Array.isArray(dealsData)) {
        const foundDeal = dealsData.find(d => d.id === dealId || d.gameId === dealId);
        if (foundDeal) {
          setDeal(foundDeal);
        } else {
          setError('Deal not found');
        }
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (err) {
      setError('Failed to fetch deal details. Please try again later.');
      console.error('Error fetching deal:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStoresData = async () => {
    try {
      const storesData = await fetchStores();
      setStores(storesData);
    } catch (err) {
      console.error('Error fetching stores:', err);
    }
  };

  const getStoreName = (storeID) => {
    const store = stores.find(s => s.storeID === storeID);
    return store ? store.storeName : 'Unknown Store';
  };

  const getStoreIcon = (storeID) => {
    const store = stores.find(s => s.storeID === storeID);
    if (!store) return '🏪';
    
    const storeName = store.storeName.toLowerCase();
    if (storeName.includes('steam')) return '/assets/icons/steam.svg';
    if (storeName.includes('epic')) return '/assets/icons/epic-games.svg';
    if (storeName.includes('playstation') || storeName.includes('ps')) return '/assets/icons/playstation.svg';
    if (storeName.includes('xbox')) return '/assets/icons/xbox.svg';
    if (storeName.includes('nintendo')) return '/assets/icons/nintendo-switch.svg';
    if (storeName.includes('gog')) return '/assets/icons/gog.svg';
    return '🏪';
  };

  const handleAddToCart = () => {
    if (deal) {
      const gameForCart = {
        id: deal.id,
        name: deal.title,
        background_image: deal.thumb || '/assets/images/featured-game-1.jpg',
        price: deal.salePrice,
        originalPrice: deal.normalPrice,
        isDeal: true
      };
      addToCart(gameForCart);
      setIsAddedToCart(true);
      // Reset the check icon after 2 seconds
      setTimeout(() => setIsAddedToCart(false), 2000);
    }
  };

  const handleFavoriteToggle = () => {
    if (deal) {
      const gameForFavorites = {
        id: deal.id,
        name: deal.title,
        background_image: deal.thumb || '/assets/images/featured-game-1.jpg',
        price: deal.salePrice,
        originalPrice: deal.normalPrice,
        isDeal: true
      };
      
      if (isFavorite(deal.id)) {
        removeFromFavorites(deal.id);
        setIsWishlisted(false);
      } else {
        addToFavorites(gameForFavorites);
        setIsWishlisted(true);
      }
    }
  };

  const isInFavorites = deal ? isFavorite(deal.id) : false;

  const formatPrice = (price) => {
    if (!price || price === 0) return 'Free';
    return `$${price.toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    return new Date(dateString * 1000).toLocaleDateString('en-US', {
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
              <p className="text-xl text-slate-700 dark:text-slate-300 mt-6 font-medium">Loading amazing deal details...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !deal) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-100 dark:bg-gradient-to-br dark:from-slate-900 dark:via-red-900/20 dark:to-pink-900/20 pt-20">
          <div className="container mx-auto px-6 py-12">
            <div className="text-center">
              <div className="text-8xl mb-6 animate-bounce">😞</div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                Deal not found
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
                {error || "The deal you're looking for doesn't exist or has been removed."}
              </p>
              <button
                onClick={() => navigate('/deals')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-bold rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-2xl flex items-center gap-2 mx-auto"
              >
                <FaArrowLeft />
                Back to Deals
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const savings = deal.normalPrice ? Math.round(((deal.normalPrice - deal.salePrice) / deal.normalPrice) * 100) : 0;

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
                backgroundImage: `url(${deal.thumb || '/assets/images/featured-game-1.jpg'})`,
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
                    onClick={() => navigate('/deals')}
                    className="px-2 sm:px-3 py-2 text-white/90 hover:text-white transition-all duration-200 text-xs sm:text-sm"
                  >
                    <span className="hidden sm:inline">Deals</span>
                    <span className="sm:hidden">D</span>
                  </button>
                </li>
                <li className="text-white/40">/</li>
                <li className="px-2 sm:px-3 py-2 text-white font-medium truncate max-w-[120px] sm:max-w-xs text-xs sm:text-sm">
                  {deal.title}
                </li>
              </ol>
            </nav>

            {/* Hero Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-start lg:items-center min-h-[60vh] sm:min-h-[65vh] lg:min-h-[70vh]">
              {/* Left Side - Deal Info */}
              <div className={`space-y-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                {/* Deal Rating and Savings */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <FaFire className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
                    <span className="text-xl sm:text-2xl font-bold text-white">Hot Deal!</span>
                  </div>
                  {savings > 0 && (
                    <div className="flex items-center gap-2">
                      <FaPercent className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                      <span className="text-lg sm:text-xl font-bold text-white">{savings}% OFF</span>
                    </div>
                  )}
                </div>

                {/* Deal Title */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                    <FaRocket className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                    <span className="text-xs sm:text-sm font-medium text-white/90">Limited Time Deal</span>
                  </div>
                  
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight drop-shadow-2xl">
                    {deal.title}
                  </h1>
                </div>

                {/* Price Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl sm:text-4xl font-bold text-green-400">
                      {formatPrice(deal.salePrice)}
                    </div>
                    {deal.normalPrice && (
                      <div className="text-xl sm:text-2xl text-white/70 line-through">
                        {formatPrice(deal.normalPrice)}
                      </div>
                    )}
                  </div>
                  
                  {savings > 0 && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 backdrop-blur-sm rounded-full border border-green-400/30">
                      <FaPercent className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 font-bold">Save ${(deal.normalPrice - deal.salePrice).toFixed(2)}</span>
                    </div>
                  )}
                </div>

                {/* Store Information */}
                <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                  <img
                    src={getStoreIcon(deal.storeID)}
                    alt={getStoreName(deal.storeID)}
                    className="w-8 h-8 sm:w-10 sm:h-10"
                  />
                  <div>
                    <div className="text-white/70 text-sm">Available on</div>
                    <div className="text-white font-semibold text-lg">{getStoreName(deal.storeID)}</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                     <button 
                     onClick={handleAddToCart}
                     className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2 sm:gap-3 border-2 border-blue-500 hover:border-blue-600"
                   >
                     {isAddedToCart ? (
                       <FaCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                     ) : (
                       <FaShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                     )}
                     <span className="hidden sm:inline">
                       {isAddedToCart ? 'Added to Cart!' : `Add to Cart - ${formatPrice(deal.salePrice)}`}
                     </span>
                     <span className="sm:hidden">
                       {isAddedToCart ? 'Added!' : 'Add to Cart'}
                     </span>
                   </button>
                  <button
                    onClick={handleFavoriteToggle}
                    className="p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 border-white/30 text-white hover:bg-white/20 transition-all duration-300"
                  >
                    <FaHeart className={`w-4 h-4 sm:w-5 sm:h-5 ${isInFavorites ? 'text-red-400 fill-current' : 'text-white'}`} />
                  </button>
                </div>

                {/* Deal Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {deal.releaseDate && (
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                      <div className="flex items-center gap-3 mb-2">
                        <FaCalendar className="w-4 h-4 text-blue-400" />
                        <span className="text-white/70 text-sm">Release Date</span>
                      </div>
                      <div className="text-white font-semibold">{formatDate(deal.releaseDate)}</div>
                    </div>
                  )}
                  
                  {deal.steamAppID && (
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                      <div className="flex items-center gap-3 mb-2">
                        <FaGamepad className="w-4 h-4 text-purple-400" />
                        <span className="text-white/70 text-sm">Steam App ID</span>
                      </div>
                      <div className="text-white font-semibold">{deal.steamAppID}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side - Game Image */}
              <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                <div className="relative group">
                  {/* Main Image */}
                  <div className="relative h-64 sm:h-72 md:h-80 lg:h-96 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 sm:border-4 border-white/20 backdrop-blur-sm">
                    <img
                      src={deal.thumb || '/assets/images/featured-game-1.jpg'}
                      alt={deal.title}
                      className="w-full h-full object-cover transition-all duration-300 ease-in-out group-hover:scale-110"
                    />
                    {/* Image Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Deal Badge */}
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                      <FaFire className="w-4 h-4" />
                      {savings}% OFF
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Deal Information */}
        <div className="relative z-20 pb-12 sm:pb-16 md:pb-20 bg-gray-100 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Left Column - Deal Details */}
              <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                {/* Deal Information Card */}
                <div className={`bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-200 dark:border-slate-700 transform transition-all duration-700 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                  <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <div className="w-10 h-10 sm:w-14 h-14 bg-blue-500 rounded-xl sm:rounded-2xl flex items-center justify-center">
                      <FaStore className="w-5 h-5 sm:w-7 h-7 text-white" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Deal Information</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <span className="text-slate-600 dark:text-slate-400 font-medium">Game Title:</span>
                        <p className="text-slate-900 dark:text-white font-semibold">{deal.title}</p>
                      </div>
                      
                      <div>
                        <span className="text-slate-600 dark:text-slate-400 font-medium">Store:</span>
                        <div className="flex items-center gap-2 mt-1">
                          <img
                            src={getStoreIcon(deal.storeID)}
                            alt={getStoreName(deal.storeID)}
                            className="w-6 h-6"
                          />
                          <span className="text-slate-900 dark:text-white font-semibold">{getStoreName(deal.storeID)}</span>
                        </div>
                      </div>
                      
                      {deal.steamAppID && (
                        <div>
                          <span className="text-slate-600 dark:text-slate-400 font-medium">Steam App ID:</span>
                          <p className="text-slate-900 dark:text-white font-semibold">{deal.steamAppID}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <span className="text-slate-600 dark:text-slate-400 font-medium">Sale Price:</span>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {formatPrice(deal.salePrice)}
                        </p>
                      </div>
                      
                      {deal.normalPrice && (
                        <div>
                          <span className="text-slate-600 dark:text-slate-400 font-medium">Original Price:</span>
                          <p className="text-xl text-slate-500 line-through">
                            {formatPrice(deal.normalPrice)}
                          </p>
                        </div>
                      )}
                      
                      {savings > 0 && (
                        <div>
                          <span className="text-slate-600 dark:text-slate-400 font-medium">Savings:</span>
                          <p className="text-xl font-bold text-green-600 dark:text-green-400">
                            {savings}% off (${(deal.normalPrice - deal.salePrice).toFixed(2)})
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Purchase Link Card */}
                {deal.cheapSharkURL && (
                  <div className={`bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-200 dark:border-slate-700 transform transition-all duration-700 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                    <div className="text-center space-y-6">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Ready to Purchase?
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Click below to view this deal on CheapShark and complete your purchase. You'll be redirected to the official store page.
                      </p>
                      <a
                        href={deal.cheapSharkURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
                      >
                        <FaExternalLinkAlt className="w-5 h-5" />
                        View Deal on CheapShark
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6 sm:space-y-8">
                {/* Wishlist Card */}
                <div className={`bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-200 dark:border-slate-700 lg:sticky lg:top-32 transform transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                  <div className="text-center space-y-6 sm:space-y-8">
                    {/* Wishlist Button */}
                    <div className="space-y-4">
                      <button
                        onClick={handleFavoriteToggle}
                        className="w-full p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300"
                      >
                        <FaHeart className={`w-5 h-5 sm:w-6 h-6 mx-auto ${isInFavorites ? 'text-red-500 fill-current' : 'text-slate-500'}`} />
                      </button>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {isInFavorites ? 'Remove from favorites' : 'Add to favorites'}
                      </p>
                    </div>

                    {/* Deal Stats */}
                    <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-600">
                      <div className="flex items-center justify-center gap-3 text-slate-600 dark:text-slate-400 px-4 py-3">
                        <FaFire className="w-4 h-4 text-orange-500" />
                        <span>Hot Deal</span>
                      </div>
                      
                      {savings > 0 && (
                        <div className="flex items-center justify-center gap-3 text-green-600 dark:text-green-400 px-4 py-3 font-semibold">
                          <FaPercent className="w-4 h-4" />
                          <span>{savings}% OFF</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Store Information Card */}
                <div className={`bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 transform transition-all duration-700 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                    <FaStore className="w-5 h-5 text-blue-500" />
                    Store Details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-slate-100 dark:bg-slate-700 rounded-xl">
                      <img
                        src={getStoreIcon(deal.storeID)}
                        alt={getStoreName(deal.storeID)}
                        className="w-8 h-8"
                      />
                      <div>
                        <div className="text-slate-900 dark:text-white font-semibold">{getStoreName(deal.storeID)}</div>
                        <div className="text-slate-600 dark:text-slate-400 text-sm">Official Store</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DealDetail;
