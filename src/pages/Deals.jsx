import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchDeals, fetchStores } from '../services/cheapsharkApi';

import { FaArrowDown } from 'react-icons/fa';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import SearchBar from '../components/SearchBar';
import PortraitGameCard from '../components/PortraitGameCard';
import HorizontalGameList from '../components/HorizontalGameList';
import GameCard from '../components/GameCard';

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [consolidatedDeals, setConsolidatedDeals] = useState([]);

  // Store sections configuration with SVG icons
  const storeSections = [
    { id: 'all', name: '🔥 All Deals', icon: '🔥', color: 'from-red-500 via-orange-500 to-yellow-500' },
    { id: 'steam', name: 'Steam Deals', icon: 'steam', color: 'from-blue-600 via-cyan-500 to-blue-800' },
    { id: 'epic', name: 'Epic Games', icon: 'epic', color: 'from-purple-600 via-pink-500 to-red-500' },
    { id: 'ps', name: 'PS Store', icon: 'playstation', color: 'from-blue-500 via-indigo-500 to-purple-600' },
    { id: 'xbox', name: 'Xbox', icon: 'xbox', color: 'from-green-500 via-emerald-500 to-teal-600' }
  ];

  // Function to render SVG icons for store sections
  const renderStoreIcon = (iconType) => {
    switch (iconType) {
      case 'steam':
        return (
          <img src="/assets/icons/steam.svg" alt="Steam" className="w-6 h-6 text-gray-800 dark:text-white" />
        );
      case 'epic':
        return (
          <img src="/assets/icons/epic-games.svg" alt="Epic Games" className="w-6 h-6 text-gray-800 dark:text-white" />
        );
      case 'playstation':
        return (
          <img src="/assets/icons/playstation.svg" alt="PlayStation" className="w-6 h-6 text-gray-800 dark:text-white" />
        );
      case 'xbox':
        return (
          <img src="/assets/icons/xbox.svg" alt="Xbox" className="w-6 h-6 text-gray-800 dark:text-white" />
        );
      default:
        return <span className="text-2xl">{iconType}</span>;
    }
  };

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
        // Consolidate deals to remove duplicates and show only cheapest price
        const consolidated = consolidateDeals(dealsData);
        setConsolidatedDeals(consolidated);
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (err) {
      setError('Failed to fetch deals. Please try again later.');
      console.error('Error fetching deals:', err);
      setDeals([]); // Set empty array on error
      setConsolidatedDeals([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter deals based on active section and search term
  const getFilteredDeals = () => {
    let filtered = consolidatedDeals.filter(deal => {
      if (activeSection === 'all') return true;
      if (activeSection === 'steam') return deal.cheapestDeal?.storeID === '1';
      if (activeSection === 'epic') return deal.cheapestDeal?.storeID === '25';
      if (activeSection === 'ps') return deal.cheapestDeal?.storeID === '3';
      if (activeSection === 'xbox') return deal.cheapestDeal?.storeID === '2';
      return true;
    }).filter(deal => deal.title && deal.title.trim() !== ''); // Filter out deals without titles

    // Apply search filter if searchTerm exists
    if (searchTerm && searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(deal => {
        const titleLower = (deal.title || '').toLowerCase();
        const storeNameLower = (deal.storeName || '').toLowerCase();
        return titleLower.includes(searchLower) || storeNameLower.includes(searchLower);
      });
    }

    return filtered;
  };

  // Get deals for specific store
  const getStoreDeals = (storeID) => {
    return getFilteredDeals().filter(deal => deal.cheapestDeal?.storeID === storeID);
  };

  // Function to consolidate deals by game title, keeping only the cheapest price
  const consolidateDeals = (dealsData) => {
    const dealsByTitle = {};
    
    dealsData.forEach(deal => {
      if (!deal.title || !deal.title.trim()) return;
      
      const title = deal.title.trim().toLowerCase();
      
      if (!dealsByTitle[title]) {
        dealsByTitle[title] = {
          ...deal,
          allPrices: [deal], // Store all price alternatives
          cheapestPrice: deal.salePrice,
          cheapestDeal: deal
        };
      } else {
        // Add this deal to the alternatives
        dealsByTitle[title].allPrices.push(deal);
        
        // Update if this is a cheaper price
        if (deal.salePrice < dealsByTitle[title].cheapestPrice) {
          dealsByTitle[title].cheapestPrice = deal.salePrice;
          dealsByTitle[title].cheapestDeal = deal;
        }
      }
    });
    
    // Convert back to array and sort by cheapest price
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
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-400 via-purple-500 via-pink-500 to-orange-400 dark:from-indigo-900 dark:via-purple-800 dark:via-pink-800 dark:to-orange-900 min-h-[80vh] flex items-center">
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
                  <h1 className="text-6xl md:text-8xl font-black mb-4 bg-gradient-to-r from-yellow-300 via-orange-400 via-red-500 via-pink-500 to-purple-600 dark:from-yellow-200 dark:via-orange-300 dark:via-red-400 dark:via-pink-400 dark:to-purple-500 bg-clip-text text-transparent animate-pulse drop-shadow-2xl">
                    GAMING DEALS
                  </h1>
                  <div className="w-32 h-2 bg-gradient-to-r from-yellow-400 via-orange-500 via-red-500 to-purple-600 dark:from-yellow-300 dark:via-orange-400 dark:via-red-400 dark:to-purple-500 mx-auto rounded-full animate-pulse shadow-lg" style={{ animationDelay: '0.5s' }}></div>
                </div>
                
                {/* Subtitle with Enhanced Styling */}
                <p className="text-xl md:text-3xl mb-8 text-white dark:text-gray-100 max-w-4xl mx-auto leading-relaxed font-medium drop-shadow-lg">
                  <span className="text-yellow-300 dark:text-yellow-200 font-bold">Discover</span> the hottest gaming deals from top stores. 
                  <span className="text-orange-300 dark:text-orange-200 font-bold"> Save big</span> on AAA titles, indie gems, and classic favorites!
                </p>
                
                {/* Enhanced Store Selection Buttons - Dummy/Non-functional */}
                <div className="flex flex-wrap justify-center gap-6 mb-12">
                  {storeSections.map((section, index) => (
                    <div
                      key={section.id}
                      className={`group relative px-8 py-4 rounded-2xl font-bold transition-all duration-500 transform hover:scale-110 hover:rotate-1 overflow-hidden cursor-default ${
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
                        <span className="mr-3 group-hover:scale-125 transition-transform duration-300 group-hover:rotate-12">
                          {renderStoreIcon(section.icon)}
                        </span>
                        <span className="group-hover:tracking-wider transition-all duration-300 font-bold">{section.name}</span>
                      </div>
                       
                      {/* Active Indicator */}
                      {activeSection === section.id && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-full animate-pulse"></div>
                      )}
                    </div>
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
                
                {/* Call to Action Section */}
                <div className="bg-gradient-to-r from-yellow-400/30 via-orange-500/30 via-red-500/30 to-purple-600/30 dark:from-yellow-300/30 dark:via-orange-400/30 dark:via-red-400/30 dark:to-purple-500/30 backdrop-blur-md rounded-3xl p-8 border-2 border-yellow-300/50 dark:border-orange-300/50 max-w-2xl mx-auto transform hover:scale-105 transition-all duration-500 shadow-2xl">
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
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 rounded-full shadow-2xl shadow-orange-500/50"></div>
            </div>
            <div className="absolute top-40 right-20 animate-pulse">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-full shadow-2xl shadow-pink-500/50"></div>
            </div>
            <div className="absolute bottom-20 left-1/4 animate-spin">
              <div className="w-7 h-7 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 rounded-full shadow-2xl shadow-cyan-500/50"></div>
            </div>
            <div className="absolute top-1/2 right-10 animate-bounce" style={{ animationDelay: '1s' }}>
              <div className="w-6 h-6 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-500 rounded-full shadow-2xl shadow-emerald-500/50"></div>
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
            <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-red-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-red-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-r from-blue-400/20 via-cyan-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

                     {/* Deals Sections */}
           <div className="max-w-[1536px] mx-auto px-4 py-16 deals-section relative">
            {/* Flashy Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {/* Animated Gradient Circles */}
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-yellow-400/10 via-orange-400/10 to-red-400/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-gradient-to-r from-purple-400/10 via-pink-400/10 to-red-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute bottom-1/4 left-1/2 w-32 h-32 bg-gradient-to-r from-blue-400/10 via-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
              
              {/* Floating Sparkles */}
              <div className="absolute top-1/3 left-1/3 text-2xl opacity-30 animate-bounce" style={{ animationDelay: '0.5s' }}>✨</div>
              <div className="absolute top-2/3 right-1/3 text-xl opacity-30 animate-pulse" style={{ animationDelay: '1.5s' }}>💫</div>
              <div className="absolute bottom-1/3 left-1/4 text-lg opacity-30 animate-bounce" style={{ animationDelay: '2.5s' }}>⭐</div>
              
              {/* Animated Lines */}
              <div className="absolute top-1/2 left-0 w-32 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-pulse"></div>
              <div className="absolute top-1/3 right-0 w-24 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute bottom-1/3 left-0 w-20 h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>
            
            {/* Search Section - Moved Above All Deals */}
            <div className="max-w-4xl mx-auto mb-16">
              <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 dark:border-gray-600/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-2xl">🔍</div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Search Deals</h3>
                </div>
                <SearchBar
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  onSearch={(term) => {
                    setSearchTerm(term);
                  }}
                  activeStore="cheapshark"
                  placeholder="Search for games, genres, or stores..."
                  className="w-full"
                />
              </div>
            </div>
            
                         {/* All Deals Section */}
             <div className="mb-20">
               {getFilteredDeals().length > 0 ? (
                 <>
                   <HorizontalGameList
                     title="All Deals"
                     subtitle="Best deals from all stores"
                     icon={<span className="text-2xl">🔥</span>}
                     iconBgColor=""
                     games={getFilteredDeals().slice(0, 15).map(deal => ({
                       id: deal.gameId || deal.id,
                       name: deal.title,
                       background_image: deal.thumb || '/assets/images/featured-game-1.jpg',
                       price: deal.cheapestPrice,
                       originalPrice: deal.normalPrice,
                       rating: 4.0,
                       platforms: ['PC'],
                       genre: 'Action'
                     }))}
                     renderGameItem={(game) => <PortraitGameCard game={game} />}
                     scrollId="all-deals-scroll"
                     showScrollButtons={true}
                   />
                   
                   {/* View More Button */}
                   <div className="flex justify-center mt-6">
                     <button 
                       onClick={() => {
                         const allDealsGrid = document.getElementById('all-deals-grid');
                         if (allDealsGrid) {
                           allDealsGrid.scrollIntoView({ behavior: 'smooth' });
                         }
                       }}
                       className="px-6 py-2 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 hover:from-red-600 hover:via-orange-600 hover:to-yellow-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2"
                     >
                       <FaArrowDown className="w-4 h-4" />
                       View More
                     </button>
                   </div>
                 </>
               ) : (
                 <div className="text-center py-16">
                   <div className="text-6xl mb-4">😔</div>
                   <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2">No deals at the moment</h3>
                   <p className="text-gray-500 dark:text-gray-500">Check back later for amazing gaming deals!</p>
                 </div>
               )}
             </div>
            
                         {/* Store-Specific Horizontal Scroll Sections */}
             <div className="space-y-16 mb-20">
               {/* Steam Section */}
               {getStoreDeals('1').length > 0 ? (
                 <HorizontalGameList
                   title="Steam Deals"
                   subtitle="Exclusive Steam discounts"
                   icon={<img src="/assets/icons/steam.svg" alt="Steam" className="w-7 h-7 text-gray-800 dark:text-white" />}
                   iconBgColor=""
                   games={getStoreDeals('1').slice(0, 10).map(deal => ({
                     id: deal.gameId || deal.id,
                     name: deal.title,
                     background_image: deal.thumb || '/assets/images/featured-game-1.jpg',
                     price: deal.cheapestPrice,
                     originalPrice: deal.normalPrice,
                     rating: 4.0,
                     platforms: ['PC'],
                     genre: 'Action'
                   }))}
                   renderGameItem={(game) => <PortraitGameCard game={game} />}
                   scrollId="steam-scroll"
                   showScrollButtons={true}
                 />
               ) : (
                 <div className="text-center py-12">
                   <div className="text-4xl mb-3">😔</div>
                   <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">Steam Deals</h3>
                   <p className="text-gray-500 dark:text-gray-500">No deals at the moment</p>
                 </div>
               )}

               {/* Epic Games Section */}
               {getStoreDeals('25').length > 0 ? (
                 <HorizontalGameList
                   title="Epic Games"
                   subtitle="Epic Games discounts"
                   icon={<img src="/assets/icons/epic-games.svg" alt="Epic Games" className="w-7 h-7 text-gray-800 dark:text-white" />}
                   iconBgColor=""
                   games={getStoreDeals('25').slice(0, 10).map(deal => ({
                     id: deal.gameId || deal.id,
                     name: deal.title,
                     background_image: deal.thumb || '/assets/images/featured-game-1.jpg',
                     price: deal.cheapestPrice,
                     originalPrice: deal.normalPrice,
                     rating: 4.0,
                     platforms: ['PC'],
                     genre: 'Action'
                   }))}
                   renderGameItem={(game) => <PortraitGameCard game={game} />}
                   scrollId="epic-scroll"
                   showScrollButtons={true}
                 />
               ) : (
                 <div className="text-center py-12">
                   <div className="text-4xl mb-3">😔</div>
                   <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">Epic Games</h3>
                   <p className="text-gray-500 dark:text-gray-500">No deals at the moment</p>
                 </div>
               )}

               {/* PlayStation Section */}
               {getStoreDeals('3').length > 0 ? (
                 <HorizontalGameList
                   title="PS Store"
                   subtitle="PlayStation Store discounts"
                   icon={<img src="/assets/icons/playstation.svg" alt="PlayStation" className="w-7 h-7 text-gray-800 dark:text-white" />}
                   iconBgColor=""
                   games={getStoreDeals('3').slice(0, 10).map(deal => ({
                     id: deal.gameId || deal.id,
                     name: deal.title,
                     background_image: deal.thumb || '/assets/images/featured-game-1.jpg',
                     price: deal.cheapestPrice,
                     originalPrice: deal.normalPrice,
                     rating: 4.0,
                     platforms: ['PC'],
                     genre: 'Action'
                   }))}
                   renderGameItem={(game) => <PortraitGameCard game={game} />}
                   scrollId="ps-scroll"
                   showScrollButtons={true}
                 />
               ) : (
                 <div className="text-center py-12">
                   <div className="text-4xl mb-3">😔</div>
                   <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">PS Store</h3>
                   <p className="text-gray-500 dark:text-gray-500">No deals at the moment</p>
                 </div>
               )}

                               {/* Xbox Section */}
                {getStoreDeals('2').length > 0 ? (
                  <HorizontalGameList
                    title="Xbox"
                    subtitle="Xbox Store discounts"
                    icon={<img src="/assets/icons/xbox.svg" alt="Xbox" className="w-7 h-7 text-gray-800 dark:text-white" />}
                    iconBgColor=""
                    games={getStoreDeals('2').slice(0, 10).map(deal => ({
                      id: deal.gameId || deal.id,
                      name: deal.title,
                      background_image: deal.thumb || '/assets/images/featured-game-1.jpg',
                      price: deal.cheapestPrice,
                      originalPrice: deal.normalPrice,
                      rating: 4.0,
                      platforms: ['PC'],
                      genre: 'Action'
                    }))}
                    renderGameItem={(game) => <PortraitGameCard game={game} />}
                    scrollId="xbox-scroll"
                    showScrollButtons={true}
                  />
                ) : (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-3">😔</div>
                    <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">Xbox</h3>
                    <p className="text-gray-500 dark:text-gray-500">No deals at the moment</p>
                  </div>
                )}
             </div>

                                                   {/* Deals Grid Section */}
              <div id="all-deals-grid" className="mb-20">
                <div className="text-center mb-8">
                  <h3 className="text-6xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
                    All Deals Grid
                  </h3>
                </div>
              
                                                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-[2000px] mx-auto">
                 {getFilteredDeals().length > 0 ? (
                   getFilteredDeals().slice(0, 20).map((deal) => (
                     <GameCard
                       key={deal.id}
                       game={{
                         id: deal.gameId || deal.id,
                         name: deal.title,
                         background_image: deal.thumb || '/assets/images/featured-game-1.jpg',
                         price: deal.cheapestPrice,
                         originalPrice: deal.normalPrice,
                         rating: 4.0,
                         platforms: ['PC'],
                         genres: [{ name: 'Action' }],
                         released: deal.releaseDate ? new Date(deal.releaseDate * 1000).toISOString() : null
                       }}
                     />
                   ))
                 ) : (
                   <div className="col-span-full text-center py-16">
                     <div className="text-6xl mb-4">😔</div>
                     <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2">No deals found</h3>
                     <p className="text-gray-500 dark:text-gray-500">
                       {searchTerm ? `No deals match "${searchTerm}"` : 'Try adjusting your search or filters'}
                     </p>
                   </div>
                 )}
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
