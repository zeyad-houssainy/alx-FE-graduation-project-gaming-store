import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchDeals, fetchStores } from '../services/cheapsharkApi';
import { useCartStore } from '../stores';
import { FaShoppingCart, FaHeart, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import SearchBar from '../components/SearchBar';
import PortraitGameCard from '../components/PortraitGameCard';

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('all');
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [consolidatedDeals, setConsolidatedDeals] = useState([]);
  
  const { addToCart } = useCartStore();

  // Function to render SVG icons for store sections
  const renderStoreIcon = (iconType) => {
    switch (iconType) {
      case 'steam':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 432 400">
            <path d="M372 119q0 26-18 44.5T310 182t-44.5-18.5T247 119t18.5-44.5T310 56t44 18.5t18 44.5zM0 319V209l65 26q20-12 45-12h9l73-105q0-48 34.5-82T309 2q49 0 83.5 34.5t34.5 83t-34.5 83T309 237l-112 82q-3 34-28 56.5T110 398q-32 0-56-19.5T24 329zM309.5 40Q277 40 254 63.5t-23 56t23 55.5t55.5 23t55.5-23t23-55.5t-23-56T309.5 40zM110 246q-7 0-14 2l27 10q19 8 27.5 27.5t.5 39.5t-27.5 28t-39.5 1q-6-3-16.5-7.5T53 341q18 34 57 34q26 0 45-19t19-45.5t-19-45.5t-45-19z"/>
          </svg>
        );
      case 'epic':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 32 32">
            <path d="M4.719 0C2.886 0 2.214.677 2.214 2.505v22.083c0 .209.011.401.027.579c.047.401.047.792.421 1.229c.036.052.412.328.412.328c.203.099.343.172.572.265l11.115 4.656c.573.261.819.371 1.235.355h.005c.421.016.667-.093 1.24-.355l11.109-4.656c.235-.093.369-.167.577-.265c0 0 .376-.287.412-.328c.375-.437.375-.828.421-1.229c.016-.177.027-.369.027-.573V2.506c0-1.828-.677-2.505-2.505-2.505zm17.808 4.145h.905c1.511 0 2.251.735 2.251 2.267v2.505H23.85V6.51c0-.489-.224-.713-.699-.713h-.312c-.489 0-.713.224-.713.713v7.749c0 .489.224.713.713.713h.349c.468 0 .692-.224.692-.713v-2.771h1.833v2.86c0 1.525-.749 2.276-2.265 2.276h-.921c-1.521 0-2.267-.756-2.267-2.276V6.425c0-1.525.745-2.281 2.267-2.281zm-16.251.106h4.151v1.703H8.14v3.468h2.204v1.699H8.14v3.697h2.319v1.704H6.276zm5.088 0h2.928c1.515 0 2.265.755 2.265 2.28v3.261c0 1.525-.751 2.276-2.265 2.276h-1.057v4.453h-1.871zm6.037 0h1.864v12.271h-1.864zm-4.172 1.65v4.52H14c.469 0 .693-.228.693-.719V6.619c0-.489-.224-.719-.693-.719z"/>
          </svg>
        );
      case 'playstation':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.984 2.596v17.547l3.915 1.261V6.688c0-.69.304-1.151.794-.991c.636.18.76.814.76 1.505v5.875c2.441 1.193 4.362-.002 4.362-3.152c0-3.237-1.126-4.675-4.438-5.827c-1.307-.448-3.728-1.186-5.39-1.502zm4.656 16.241l6.296-2.275c.715-.258.826-.625.246-.818c-.586-.192-1.637-.139-2.357.123l-4.205 1.5V14.98l.24-.085s1.201-.42 2.913-.615c1.696-.18 3.785.03 5.437.661c1.848.601 2.04 1.472 1.576 2.072c-.465.6-1.622 1.036-1.622 1.036l-8.544 3.107V18.86zM1.807 18.6c-1.9-.545-2.214-1.668-1.352-2.32c.801-.586 2.16-1.052 2.16-1.052l5.615-2.013v2.313L4.205 17c-.705.271-.825.632-.239.826c.586.195 1.637.15 2.343-.12L8.247 17v2.074c-.12.03-.256.044-.39.073c-1.939.331-3.996.196-6.038-.479z"/>
          </svg>
        );
      case 'xbox':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 432 432">
            <path d="M213 85q-24-18-47-27.5T127.5 47t-28 0T81 51l-6 3Q134 3 213 3t139 51q-3-1-7-3t-17.5-4t-28.5 0t-38.5 11T213 85zm-56 41q-39 40-65 78t-34.5 63.5t-12 44.5t-1.5 28l3 9Q0 291 0 216q0-84 57-145q38 16 100 55zm270 90q0 75-47 133q1-3 2.5-9t-1.5-27.5t-12-45.5t-34.5-62.5T269 126q28-17 53-31t36-19l11-5q58 61 58 145zm-215-44q38 27 67.5 57t45 53t26 42t13.5 29l3 10q-62 66-153.5 66T59 363q2-4 5-11.5t15-30t28-44.5t44-51t61-54z"/>
          </svg>
        );
      default:
        return <span className="text-2xl">{iconType}</span>;
    }
  };

  // Store sections configuration
  const storeSections = [
    { id: 'all', name: '🔥 All Deals', icon: '🔥', color: 'from-red-500 via-orange-500 to-yellow-500' },
    { id: 'steam', name: 'Steam Deals', icon: 'steam', color: 'from-blue-600 via-cyan-500 to-blue-800' },
    { id: 'epic', name: 'Epic Games', icon: 'epic', color: 'from-purple-600 via-pink-500 to-red-500' },
    { id: 'ps', name: 'PS Store', icon: 'playstation', color: 'from-blue-500 via-indigo-500 to-purple-600' },
    { id: 'xbox', name: 'Xbox', icon: 'xbox', color: 'from-green-500 via-emerald-500 to-teal-600' }
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
        const consolidated = consolidateDeals(dealsData);
        setConsolidatedDeals(consolidated);
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (err) {
      setError('Failed to fetch deals. Please try again later.');
      console.error('Error fetching deals:', err);
      setDeals([]);
      setConsolidatedDeals([]);
    } finally {
      setLoading(false);
    }
  };

  const consolidateDeals = (dealsData) => {
    const dealsByTitle = {};
    
    dealsData.forEach(deal => {
      if (!deal.title || !deal.title.trim()) return;
      
      const title = deal.title.trim().toLowerCase();
      
      if (!dealsByTitle[title]) {
        dealsByTitle[title] = {
          ...deal,
          allPrices: [deal],
          cheapestPrice: deal.salePrice,
          cheapestDeal: deal
        };
      } else {
        dealsByTitle[title].allPrices.push(deal);
        
        if (deal.salePrice < dealsByTitle[title].cheapestPrice) {
          dealsByTitle[title].cheapestPrice = deal.salePrice;
          dealsByTitle[title].cheapestDeal = deal;
        }
      }
    });
    
    return Object.values(dealsByTitle)
      .sort((a, b) => a.cheapestPrice - b.cheapestPrice);
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
      price: deal.cheapestPrice,
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

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
  };

  const filteredDeals = consolidatedDeals.filter(deal => {
    if (activeSection === 'all') return true;
    if (activeSection === 'steam') return deal.cheapestDeal?.storeID === '1';
    if (activeSection === 'epic') return deal.cheapestDeal?.storeID === '25';
    if (activeSection === 'ps') return deal.cheapestDeal?.storeID === '3';
    if (activeSection === 'xbox') return deal.cheapestDeal?.storeID === '2';
    return true;
  }).filter(deal => deal.title && deal.title.trim() !== '')
    .filter(deal => {
      if (!searchTerm || !searchTerm.trim()) return true;
      
      const searchLower = searchTerm.toLowerCase();
      const titleLower = (deal.title || '').toLowerCase();
      const storeNameLower = (deal.storeName || '').toLowerCase();
      
      return titleLower.includes(searchLower) || storeNameLower.includes(searchLower);
    });

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
          {/* Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-400 via-purple-500 via-pink-500 to-orange-400 dark:from-indigo-900 dark:via-purple-800 dark:via-pink-800 dark:to-orange-900 min-h-[80vh] flex items-center">
            {/* Background Elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-1/4 left-1/4 w-64 h-64 border-2 border-blue-300 rotate-45 rounded-full animate-pulse"></div>
              <div className="absolute top-3/4 right-1/4 w-48 h-48 border-2 border-purple-300 rotate-12 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
              <div className="absolute bottom-1/4 left-1/2 w-32 h-32 border-2 border-orange-300 -rotate-45 rounded-full animate-spin"></div>
            </div>
            
            {/* Main Content */}
            <div className="relative z-10 container mx-auto px-4 py-20">
              <div className="text-center max-w-6xl mx-auto">
                <div className="mb-8">
                  <h1 className="text-6xl md:text-8xl font-black mb-4 bg-gradient-to-r from-yellow-300 via-orange-400 via-red-500 via-pink-500 to-purple-600 dark:from-yellow-200 dark:via-orange-300 dark:via-red-400 dark:via-pink-400 dark:to-purple-500 bg-clip-text text-transparent animate-pulse drop-shadow-2xl">
                    GAMING DEALS
                  </h1>
                  <div className="w-32 h-2 bg-gradient-to-r from-yellow-400 via-orange-500 via-red-500 to-purple-600 dark:from-yellow-300 dark:via-orange-400 dark:via-red-400 dark:to-purple-500 mx-auto rounded-full animate-pulse shadow-lg" style={{ animationDelay: '0.5s' }}></div>
                </div>
                
                <p className="text-xl md:text-3xl mb-8 text-white dark:text-gray-100 max-w-4xl mx-auto leading-relaxed font-medium drop-shadow-lg">
                  <span className="text-yellow-300 dark:text-yellow-200 font-bold">Discover</span> the hottest gaming deals from top stores. 
                  <span className="text-orange-300 dark:text-orange-200 font-bold"> Save big</span> on AAA titles, indie gems, and classic favorites!
                </p>
                
                {/* Store Selection Buttons */}
                <div className="flex flex-wrap justify-center gap-6 mb-12">
                  {storeSections.map((section, index) => (
                    <button
                      key={section.id}
                      onClick={() => handleSectionChange(section.id)}
                      className={`group relative px-8 py-4 rounded-2xl font-bold transition-all duration-500 transform hover:scale-110 hover:rotate-1 overflow-hidden ${
                        activeSection === section.id
                          ? `bg-gradient-to-r ${section.color} text-white shadow-2xl scale-105`
                          : 'bg-white/20 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white/30 dark:hover:bg-gray-700/50 border-2 border-white/30 dark:border-gray-600/30 hover:border-white/50 dark:hover:border-gray-500/50 text-black dark:text-white'
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="relative z-10 flex items-center">
                        <span className="mr-3 group-hover:scale-125 transition-transform duration-300 group-hover:rotate-12">
                          {renderStoreIcon(section.icon)}
                        </span>
                        <span className="group-hover:tracking-wider transition-all duration-300 font-bold">{section.name}</span>
                      </div>
                      
                      {activeSection === section.id && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-full animate-pulse"></div>
                      )}
                    </button>
                  ))}
                </div>
                
                {/* Stats Section */}
                <div className="max-w-4xl mx-auto mb-12">
                  <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 dark:border-gray-600/30">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-2xl">📊</div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Deals Overview</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-orange-400">{consolidatedDeals.length}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Unique Games</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stores.length}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Stores</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Deals Sections */}
          <div className="container mx-auto px-4 py-16 deals-section relative">
            {/* Search Section */}
            <div className="max-w-4xl mx-auto mb-16">
              <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 dark:border-gray-600/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-2xl">🔍</div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Search Deals</h3>
                </div>
                <SearchBar
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  onSearch={setSearchTerm}
                  activeStore="cheapshark"
                  placeholder="Search for games, genres, or stores..."
                  className="w-full"
                />
              </div>
            </div>
            
            {/* Store-Specific Sections */}
            <div className="space-y-16 mb-20">
              {/* Steam Section */}
              <div className="relative">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                      {renderStoreIcon('steam')}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-800 bg-clip-text text-transparent">Steam Deals</h3>
                      <p className="text-gray-600 dark:text-gray-400">Exclusive Steam discounts</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" onClick={() => {
                      const element = document.getElementById('steam-scroll');
                      if (element) element.scrollLeft -= 300;
                    }}>
                      <FaArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" onClick={() => {
                      const element = document.getElementById('steam-scroll');
                      if (element) element.scrollLeft += 300;
                    }}>
                      <FaArrowRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
                <div id="steam-scroll" className="flex gap-3 overflow-x-auto scrollbar-hide pb-4">
                  {filteredDeals
                    .filter(deal => deal.cheapestDeal?.storeID === '1')
                    .slice(0, 10)
                    .map((deal) => (
                      <div key={deal.id} className="flex-shrink-0 w-80">
                        <PortraitGameCard 
                          game={{
                            id: deal.gameId || deal.id,
                            name: deal.title,
                            background_image: deal.thumb || '/assets/images/featured-game-1.jpg',
                            price: deal.cheapestPrice,
                            originalPrice: deal.normalPrice,
                            rating: 4.0,
                            platforms: ['PC'],
                            genre: 'Action'
                          }}
                        />
                      </div>
                    ))}
                </div>
              </div>

              {/* Epic Games Section */}
              <div className="relative">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                      {renderStoreIcon('epic')}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent">Epic Games</h3>
                      <p className="text-gray-600 dark:text-gray-400">Epic store exclusives</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" onClick={() => {
                      const element = document.getElementById('epic-scroll');
                      if (element) element.scrollLeft -= 300;
                    }}>
                      <FaArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" onClick={() => {
                      const element = document.getElementById('epic-scroll');
                      if (element) element.scrollLeft += 300;
                    }}>
                      <FaArrowRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
                <div id="epic-scroll" className="flex gap-3 overflow-x-auto scrollbar-hide pb-4">
                  {filteredDeals
                    .filter(deal => deal.cheapestDeal?.storeID === '25')
                    .slice(0, 10)
                    .map((deal) => (
                      <div key={deal.id} className="flex-shrink-0 w-80">
                        <PortraitGameCard 
                          game={{
                            id: deal.gameId || deal.id,
                            name: deal.title,
                            background_image: deal.thumb || '/assets/images/featured-game-1.jpg',
                            price: deal.cheapestPrice,
                            originalPrice: deal.normalPrice,
                            rating: 4.0,
                            platforms: ['PC'],
                            genre: 'Action'
                          }}
                        />
                      </div>
                    ))}
                </div>
              </div>

              {/* All Deals Grid */}
              <div className="relative">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">All Deals</h3>
                  <p className="text-gray-600 dark:text-gray-400">Browse through all available deals</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredDeals.slice(0, 20).map((deal) => (
                    <div key={deal.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      <div className="relative">
                        <img
                          src={deal.thumb || '/assets/images/featured-game-1.jpg'}
                          alt={deal.title}
                          className="w-full h-48 object-cover"
                        />
                        <button
                          onClick={() => handleAddToWishlist(deal.id)}
                          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${
                            wishlist.includes(deal.id)
                              ? 'bg-red-500 text-white'
                              : 'bg-black/50 text-white hover:bg-red-500'
                          }`}
                        >
                          <FaHeart className={`w-4 h-4 ${wishlist.includes(deal.id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{deal.title}</h4>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-2xl font-bold text-green-600 dark:text-green-400">${deal.cheapestPrice}</span>
                          {deal.normalPrice && deal.normalPrice > deal.cheapestPrice && (
                            <span className="text-sm text-gray-500 line-through">${deal.normalPrice}</span>
                          )}
                        </div>
                        <button
                          onClick={() => handleAddToCart(deal)}
                          className="w-full bg-blue-600 dark:bg-orange-500 hover:bg-blue-700 dark:hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                          <FaShoppingCart className="w-4 h-4" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Deals; 
