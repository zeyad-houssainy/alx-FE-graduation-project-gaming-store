import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchDeals, fetchStores } from '../services/cheapsharkApi';
import { useCartStore } from '../stores';
import { FaShoppingCart, FaEye, FaHeart, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('all');
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  
  const { addToCart } = useCartStore();

  // Store sections configuration
  const storeSections = [
    { id: 'all', name: '🔥 All Deals', icon: '🔥', color: 'from-red-500 to-orange-500' },
    { id: 'steam', name: '🎮 Steam Deals', icon: '🎮', color: 'from-blue-600 to-blue-800' },
    { id: 'epic', name: '⭐ Epic Games', icon: '⭐', color: 'from-purple-500 to-pink-500' },
    { id: 'ps', name: '🎯 PS Store', icon: '🎯', color: 'from-blue-400 to-blue-600' },
    { id: 'xbox', name: '🎲 Xbox', icon: '🎲', color: 'from-green-500 to-green-700' }
  ];

  useEffect(() => {
    fetchDealsData();
    fetchStoresData();
  }, []);

  const fetchDealsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const dealsData = await fetchDeals({ pageSize: 100 });
      
      if (dealsData && Array.isArray(dealsData)) {
        setDeals(dealsData);
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (err) {
      setError('Failed to fetch deals. Please try again later.');
      console.error('Error fetching deals:', err);
      setDeals([]); // Set empty array on error
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

  const handleAddToCart = (deal) => {
    const game = {
      id: deal.gameId || deal.id,
      name: deal.title,
      price: deal.salePrice,
      background_image: deal.thumb || '/assets/images/featured-game-1.jpg',
      rating: 4.0,
      platforms: ['PC'],
      genre: 'Action'
    };
    addToCart(game);
  };

  const handleAddToWishlist = (dealId) => {
    setWishlist(prev => 
      prev.includes(dealId) 
        ? prev.filter(id => id !== dealId)
        : [...prev, dealId]
    );
  };

  const filteredDeals = deals.filter(deal => {
    if (activeSection === 'all') return true;
    if (activeSection === 'steam') return deal.storeID === '1';
    if (activeSection === 'epic') return deal.storeID === '25';
    if (activeSection === 'ps') return deal.storeID === '3';
    if (activeSection === 'xbox') return deal.storeID === '2';
    return true;
  }).filter(deal => deal.title && deal.title.trim() !== ''); // Filter out deals without titles

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 dark:border-orange-400 mx-auto"></div>
            <p className="text-gray-900 dark:text-white text-xl mt-4">Loading amazing deals...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center pt-20">
          <div className="text-center text-gray-900 dark:text-white">
            <h1 className="text-4xl font-bold mb-4">Oops! Something went wrong</h1>
            <p className="text-xl mb-6">{error}</p>
            <button 
              onClick={fetchDealsData}
              className="bg-blue-600 dark:bg-orange-500 hover:bg-blue-700 dark:hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="relative z-10 pt-20 sm:pt-24">
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          {/* Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-blue-300 rotate-45 rounded-full"></div>
              <div className="absolute top-3/4 right-1/4 w-48 h-48 border border-purple-300 rotate-12 rounded-full"></div>
              <div className="absolute bottom-1/4 left-1/2 w-32 h-32 border border-orange-300 -rotate-45 rounded-full"></div>
            </div>
            
            <div className="relative z-10 container mx-auto px-4 py-20">
              <div className="text-center">
                <h1 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-orange-400 dark:via-red-400 dark:to-pink-400 bg-clip-text text-transparent">
                  GAMING DEALS
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Discover the hottest gaming deals from top stores. Save big on AAA titles, indie gems, and classic favorites!
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  {storeSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`px-6 py-3 rounded-full font-semibold text-white transition-all duration-300 transform hover:scale-105 ${
                        activeSection === section.id
                          ? `bg-gradient-to-r ${section.color} shadow-lg shadow-${section.color.split('-')[1]}/50`
                          : 'bg-white/20 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white/30 dark:hover:bg-gray-700/50 border border-white/30 dark:border-gray-600/30'
                      }`}
                    >
                      <span className="mr-2">{section.icon}</span>
                      {section.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute top-20 left-10 animate-bounce">
              <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
            </div>
            <div className="absolute top-40 right-20 animate-pulse">
              <div className="w-6 h-6 bg-purple-400 rounded-full"></div>
            </div>
            <div className="absolute bottom-20 left-1/4 animate-spin">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            </div>
          </div>

          {/* Deals Sections */}
          <div className="container mx-auto px-4 py-16">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
                {storeSections.find(s => s.id === activeSection)?.name || 'All Deals'}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                {filteredDeals.length} amazing deals waiting for you
              </p>
            </div>

            {/* Deals Grid */}
            {filteredDeals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredDeals.map((deal) => (
                  <DealCard 
                    key={deal.id} 
                    deal={deal} 
                    onAddToCart={handleAddToCart}
                    onAddToWishlist={handleAddToWishlist}
                    isInWishlist={wishlist.includes(deal.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-900 dark:text-white py-20">
                <div className="text-6xl mb-4">😔</div>
                <h3 className="text-2xl font-semibold mb-2">No deals available</h3>
                <p className="text-gray-600 dark:text-gray-400">Check back later for amazing deals!</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

// Deal Card Component
const DealCard = ({ deal, onAddToCart, onAddToWishlist, isInWishlist }) => {
  const savings = deal.savings ? Math.round(deal.savings) : 0;
  
  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-orange-400 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 dark:hover:shadow-orange-500/25">
      {/* Wishlist Button */}
      <button
        onClick={() => onAddToWishlist(deal.id)}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-300 ${
          isInWishlist 
            ? 'bg-red-500 text-white shadow-lg' 
            : 'bg-black/50 text-white hover:bg-red-500'
        }`}
      >
        <FaHeart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
      </button>

      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          src={deal.thumb || '/assets/images/featured-game-1.jpg'}
          alt={deal.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Savings Badge */}
        {savings > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm">
            -{savings}%
          </div>
        )}
        
        {/* Overlay with Buttons */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          <button
            onClick={() => onAddToCart(deal)}
            className="bg-blue-600 dark:bg-orange-500 hover:bg-blue-700 dark:hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <FaShoppingCart />
            Add to Cart
          </button>
          <Link
            to={`/games/${deal.gameId}`}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 backdrop-blur-sm"
          >
            <FaEye />
            View Details
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {deal.title}
        </h3>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
              ${deal.salePrice}
            </span>
            {deal.normalPrice > deal.salePrice && (
              <span className="text-gray-500 dark:text-gray-400 line-through">
                ${deal.normalPrice}
              </span>
            )}
          </div>
          
          {deal.dealRating && (
            <div className="bg-yellow-500 text-black px-2 py-1 rounded text-sm font-semibold">
              ⭐ {deal.dealRating}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>Store ID: {deal.storeID}</span>
          {deal.releaseDate && (
            <span>{new Date(deal.releaseDate * 1000).getFullYear()}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Deals;
