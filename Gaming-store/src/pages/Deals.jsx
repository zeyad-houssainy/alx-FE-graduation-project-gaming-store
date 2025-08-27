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
              className="bg-blue-600 dark:bg-orange-500 hover:bg-blue-700 dark:hover:bg-orange-600 text-black dark:text-white px-6 py-3 rounded-lg font-semibold transition-colors"
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
          {/* Enhanced Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-[80vh] flex items-center">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 opacity-10">
              {/* Geometric Shapes */}
              <div className="absolute top-1/4 left-1/4 w-64 h-64 border-2 border-blue-300 rotate-45 rounded-full animate-pulse"></div>
              <div className="absolute top-3/4 right-1/4 w-48 h-48 border-2 border-purple-300 rotate-12 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
              <div className="absolute bottom-1/4 left-1/2 w-32 h-32 border-2 border-orange-300 -rotate-45 rounded-full animate-spin"></div>
              <div className="absolute top-1/2 right-1/3 w-24 h-24 border-2 border-green-300 rotate-90 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
              
              {/* Gaming Icons */}
              <div className="absolute top-1/3 left-1/3 text-4xl opacity-20 animate-bounce" style={{ animationDelay: '0.5s' }}>🎮</div>
              <div className="absolute top-2/3 right-1/3 text-3xl opacity-20 animate-pulse" style={{ animationDelay: '1.5s' }}>💎</div>
              <div className="absolute bottom-1/3 left-1/4 text-2xl opacity-20 animate-bounce" style={{ animationDelay: '2.5s' }}>🔥</div>
            </div>
            
            {/* Main Content */}
            <div className="relative z-10 container mx-auto px-4 py-20">
              <div className="text-center max-w-6xl mx-auto">
                {/* Main Title with Enhanced Typography */}
                <div className="mb-8">
                  <h1 className="text-6xl md:text-8xl font-black mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-orange-400 dark:via-red-400 dark:to-pink-400 bg-clip-text text-transparent animate-pulse">
                    GAMING DEALS
                  </h1>
                  <div className="w-32 h-2 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-orange-400 dark:to-red-400 mx-auto rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                </div>
                
                {/* Subtitle with Enhanced Styling */}
                <p className="text-xl md:text-3xl mb-8 text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed font-medium">
                  <span className="text-blue-600 dark:text-orange-400 font-bold">Discover</span> the hottest gaming deals from top stores. 
                  <span className="text-purple-600 dark:text-red-400 font-bold"> Save big</span> on AAA titles, indie gems, and classic favorites!
                </p>
                
                                 {/* Enhanced Store Selection Buttons */}
                 <div className="flex flex-wrap justify-center gap-6 mb-12">
                   {storeSections.map((section, index) => (
                     <button
                       key={section.id}
                       onClick={() => setActiveSection(section.id)}
                       className={`group relative px-8 py-4 rounded-2xl font-bold transition-all duration-500 transform hover:scale-110 hover:rotate-1 overflow-hidden ${
                         activeSection === section.id
                           ? `bg-gradient-to-r ${section.color} text-white shadow-2xl shadow-${section.color.split('-')[1]}/50 scale-105`
                           : 'bg-white/20 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white/30 dark:hover:bg-gray-700/50 border-2 border-white/30 dark:border-gray-600/30 hover:border-white/50 dark:hover:border-gray-500/50 text-black dark:text-white'
                       }`}
                       style={{ animationDelay: `${index * 0.1}s` }}
                     >
                       {/* Hover Effect Background */}
                       <div className={`absolute inset-0 bg-gradient-to-r ${section.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                       
                       {/* Content */}
                       <div className="relative z-10 flex items-center">
                         <span className="mr-3 text-xl group-hover:scale-125 transition-transform duration-300 group-hover:rotate-12">{section.icon}</span>
                         <span className="group-hover:tracking-wider transition-all duration-300 font-bold">{section.name}</span>
                       </div>
                       
                       {/* Active Indicator */}
                       {activeSection === section.id && (
                         <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-full animate-pulse"></div>
                       )}
                     </button>
                   ))}
                 </div>
                
                {/* Search and Stats Section */}
                <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
                  {/* Search Bar */}
                  <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 dark:border-gray-600/30">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-2xl">🔍</div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Search Deals</h3>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search for games, genres, or stores..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-white/30 dark:border-gray-600/30 rounded-xl text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-400 focus:border-transparent transition-all duration-300"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 dark:border-gray-600/30">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-2xl">📊</div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Deals Overview</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-orange-400">{deals.length}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Total Deals</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stores.length}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Stores</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Call to Action Section */}
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 dark:from-orange-500/20 dark:to-red-500/20 backdrop-blur-md rounded-3xl p-8 border border-blue-300/30 dark:border-orange-300/30 max-w-2xl mx-auto transform hover:scale-105 transition-all duration-500">
                  <div className="flex items-center justify-center gap-6 mb-4">
                    <div className="text-4xl animate-bounce">🎯</div>
                    <div className="text-4xl animate-bounce" style={{ animationDelay: '0.3s' }}>💸</div>
                    <div className="text-4xl animate-bounce" style={{ animationDelay: '0.6s' }}>🚀</div>
                  </div>
                  <p className="text-lg text-gray-700 dark:text-gray-200 font-semibold text-center">
                    Ready to score amazing deals? Start exploring now!
                  </p>
                  <div className="text-center mt-4">
                    <div className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-orange-400 font-medium">
                      <span>Scroll down to explore</span>
                      <div className="animate-bounce">⬇️</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Floating Elements */}
            <div className="absolute top-20 left-10 animate-bounce">
              <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full shadow-lg"></div>
            </div>
            <div className="absolute top-40 right-20 animate-pulse">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full shadow-lg"></div>
            </div>
            <div className="absolute bottom-20 left-1/4 animate-spin">
              <div className="w-5 h-5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full shadow-lg"></div>
            </div>
            <div className="absolute top-1/2 right-10 animate-bounce" style={{ animationDelay: '1s' }}>
              <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full shadow-lg"></div>
            </div>
            
            {/* Gaming-themed Floating Elements */}
            <div className="absolute top-1/3 left-20 animate-bounce" style={{ animationDelay: '0.7s' }}>
              <div className="text-3xl opacity-60">🎲</div>
            </div>
            <div className="absolute top-2/3 right-32 animate-pulse" style={{ animationDelay: '1.2s' }}>
              <div className="text-2xl opacity-60">⚡</div>
            </div>
            <div className="absolute bottom-1/3 left-1/3 animate-bounce" style={{ animationDelay: '1.8s' }}>
              <div className="text-2xl opacity-60">🏆</div>
            </div>
            
            {/* Particle Effects */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/4 left-1/2 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0s' }}></div>
              <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-2/3 left-1/3 w-1 h-1 bg-orange-400 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
              <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-green-400 rounded-full animate-ping" style={{ animationDelay: '3s' }}></div>
              <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
              <div className="absolute bottom-1/4 right-1/2 w-1 h-1 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: '2.5s' }}></div>
            </div>
            
            {/* Glowing Orbs */}
            <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-orange-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

          {/* Deals Sections */}
          <div className="container mx-auto px-4 py-16">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-black dark:text-white mb-4">
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
            className="bg-blue-600 dark:bg-orange-500 hover:bg-blue-700 dark:hover:bg-orange-600 text-black dark:text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
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
