import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchDeals, fetchStores } from '../services/cheapsharkApi';
import { useCartStore } from '../stores';
import { FaShoppingCart, FaEye, FaHeart, FaArrowLeft, FaArrowRight, FaArrowDown, FaArrowUp } from 'react-icons/fa';
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
            <path d="M4.719 0C2.886 0 2.214.677 2.214 2.505v22.083c0 .209.011.401.027.579c.047.401.047.792.421 1.229c.036.052.412.328.412.328c.203.099.343.172.572.265l11.115 4.656c.573.261.819.371 1.235.355h.005c.421.016.667-.093 1.24-.355l11.109-4.656c.235-.093.369-.167.577-.265c0 0 .376-.287.412-.328c.375-.437.375-.828.421-1.229c.016-.177.027-.369.027-.573V2.506c0-1.828-.677-2.505-2.505-2.505zm17.808 4.145h.905c1.511 0 2.251.735 2.251 2.267v2.505H23.85V6.51c0-.489-.224-.713-.699-.713h-.312c-.489 0-.713.224-.713.713v7.749c0 .489.224.713.713.713h.349c.468 0 .692-.224.692-.713v-2.771h1.833v2.86c0 1.525-.749 2.276-2.265 2.276h-.921c-1.521 0-2.267-.756-2.267-2.276V6.425c0-1.525.745-2.281 2.267-2.281zm-16.251.106h4.151v1.703H8.14v3.468h2.204v1.699H8.14v3.697h2.319v1.704H6.276zm5.088 0h2.928c1.515 0 2.265.755 2.265 2.28v3.261c0 1.525-.751 2.276-2.265 2.276h-1.057v4.453h-1.871zm6.037 0h1.864v12.271h-1.864zm-4.172 1.65v4.52H14c.469 0 .693-.228.693-.719V6.619c0-.489-.224-.719-.693-.719zM8.088 19.437h.276l.063.011h.1l.052.016h.052l.047.015l.052.011l.041.011l.093.021l.053.015l.036.011l.041.016l.052.016l.036.015l.053.021l.047.021l.041.025l.047.021l.036.025l.053.027l.041.025l.041.021l.041.031l.043.027l.036.031l.125.095l-.032.041l-.036.036l-.032.037l-.036.041l-.025.036l-.032.037l-.036.036l-.032.041l-.025.036l-.037.043l-.031.036l-.036.041l-.032.037l-.025.041l-.037.036l-.031.043l-.036.036l-.032.036l-.036-.025l-.041-.037l-.043-.025l-.077-.052l-.047-.027l-.043-.025l-.047-.027l-.036-.021l-.041-.02l-.084-.032l-.052-.009l-.041-.011l-.047-.011l-.053-.011l-.052-.005h-.052l-.061-.011h-.1l-.052.005h-.052l-.052.016l-.041.011l-.047.016l-.047.009l-.043.021l-.052.021l-.072.052l-.043.025l-.036.032l-.036.025l-.037.032l-.025.036l-.043.036l-.052.073l-.025.041l-.021.047l-.025.037l-.027.047l-.016.047l-.02.041l-.016.052l-.005.052l-.015.048l-.011.052v.052l-.005.052v.12l.005.052v.041l.005.052l.009.047l.016.041l.005.053l.016.041l.015.036l.021.052l.027.052l.02.037l.052.083l.032.041l.025.037l.043.031l.025.036l.036.032l.084.063l.036.02l.041.027l.048.021l.052.02l.036.021l.104.031l.047.005l.052.016l.052.005h.224l.063-.005h.047l.053-.021l.052-.005l.052-.015l.041-.011l.047-.021l.041-.02l.047-.021l.032-.021l.041-.025v-.464h-.735v-.744h1.661v1.667l-.036.025l-.036.031l-.037.027l-.041.031l-.041.021l-.036.032l-.084.052l-.052.025l-.083.052l-.053.021l-.041.02l-.047.021l-.104.041l-.041.021l-.095.031l-.047.011l-.047.016l-.052.016l-.041.009l-.156.032l-.048.005l-.104.011l-.057.005l-.052.004l-.057.005h-.26l-.052-.009h-.052l-.052-.011h-.047l-.052-.016l-.152-.031l-.041-.016l-.047-.005l-.052-.021l-.095-.031l-.093-.041l-.052-.021l-.036-.021l-.052-.02l-.037-.032l-.052-.02l-.031-.027l-.041-.025l-.084-.063l-.041-.027l-.032-.031l-.041-.032l-.068-.067l-.036-.032l-.031-.036l-.037-.037l-.025-.041l-.032-.031l-.025-.043l-.032-.041l-.025-.036l-.027-.041l-.025-.048l-.021-.041l-.021-.047l-.02-.041l-.041-.095l-.016-.036l-.021-.047l-.011-.047l-.009-.041l-.011-.052l-.016-.048l-.011-.052l-.005-.041l-.009-.052l-.011-.093l-.011-.104v-.276l.011-.053v-.052l.016-.052v-.052l.015-.047l.016-.052l.021-.093l.015-.052l.016-.047l.063-.141l.02-.041l.021-.047l.027-.048l.02-.041l.027-.036l.052-.084l.031-.041l.032-.036l.025-.041l.068-.068l.031-.037l.037-.036l.031-.036l.043-.032l.072-.063l.041-.031l.043-.027l.036-.031l.041-.027l.043-.02l.047-.027l.052-.025l.036-.027l.052-.02l.047-.021l.047-.025l.043-.011l.052-.016l.041-.021l.047-.009l.047-.016l.052-.011l.043-.016l.052-.011h.052l.047-.015h.052L8 19.444h.047zm15.985.011h.276l.063.011h.099l.052.015h.057l.052.016l.093.021l.052.011l.047.009l.053.016l.047.016l.041.011l.047.015l.052.016l.041.021l.052.02l.048.021l.047.027l.036.02l.047.027l.047.02l.043.027l.047.031l.036.027l.084.063l.041.025l-.032.041l-.025.043l-.031.036l-.032.041l-.025.047l-.027.043l-.031.036l-.032.041l-.025.043l-.032.041l-.025.036l-.032.041l-.025.048l-.032.041l-.031.036l-.032.041l-.025.043l-.041-.032l-.048-.025l-.036-.027l-.041-.025l-.047-.021l-.043-.027l-.047-.02l-.036-.021l-.052-.02l-.037-.021l-.041-.016l-.093-.031l-.104-.032l-.156-.031l-.052-.005l-.095-.011h-.109l-.057.011l-.052.011l-.047.011l-.041.02l-.037.021l-.041.036l-.031.047l-.021.048v.124l.027.057l.02.032l.032.031l.052.027l.041.025l.047.021l.052.02l.068.016l.036.016l.043.011l.052.011l.041.015l.047.011l.057.016l.052.016l.057.015l.057.011l.047.016l.057.015l.052.011l.047.011l.157.047l.041.016l.052.016l.047.02l.052.027l.104.041l.047.027l.084.052l.077.057l.048.031l.036.036l.036.043l.037.036l.025.036l.037.052l.025.037l.021.052l.02.031l.016.052l.016.043l.011.047l.02.104l.005.052l.005.047v.125l-.005.057l-.011.104l-.011.052l-.015.047l-.011.052l-.016.052l-.015.047l-.021.037l-.021.047l-.025.041l-.032.037l-.052.083l-.063.073l-.036.025l-.041.037l-.032.031l-.041.031l-.041.021l-.041.032l-.048.025l-.093.047l-.052.021l-.047.02l-.052.016l-.047.016l-.043.011l-.104.02l-.036.011l-.052.011h-.052l-.047.011h-.052l-.052.011h-.371l-.156-.016l-.052-.011l-.047-.005l-.104-.02l-.057-.011l-.047-.011l-.052-.016l-.053-.011l-.047-.015l-.052-.016l-.052-.021l-.041-.015l-.052-.016l-.052-.021l-.037-.02l-.052-.016l-.041-.027l-.052-.02l-.041-.027l-.037-.025l-.052-.027l-.036-.02l-.041-.032l-.041-.025l-.043-.032l-.036-.031l-.041-.032l-.037-.025l-.041-.037l.032-.041l.036-.036l.031-.037l.037-.041l.025-.036l.032-.041l.036-.037l.031-.036l.037-.041l.025-.037l.037-.036l.031-.041l.032-.037l.036-.041l.025-.036l.037-.037l.036-.041l.036.032l.048.031l.036.031l.052.027l.036.027l.047.031l.043.027l.047.02l.036.027l.047.015l.052.021l.043.021l.047.015l.041.021l.052.016l.047.015l.052.016l.052.005l.048.016l.052.005h.057l.047.015h.281l.047-.009l.052-.011l.036-.005l.043-.016l.036-.02l.047-.032l.027-.036l.02-.041l.016-.048v-.12l-.021-.047l-.025-.041l-.032-.031l-.047-.032l-.036-.015l-.047-.021l-.052-.021l-.057-.025l-.037-.011l-.041-.011l-.052-.016l-.036-.009l-.052-.016l-.052-.005l-.053-.021l-.052-.005l-.057-.015l-.047-.011l-.052-.016l-.052-.011l-.052-.015l-.047-.016l-.052-.011l-.041-.016l-.095-.031l-.052-.021l-.052-.015l-.104-.043l-.047-.025l-.052-.027l-.036-.025l-.048-.027l-.036-.025l-.047-.027l-.068-.068l-.036-.031l-.063-.073l-.027-.036l-.02-.036l-.032-.048l-.015-.036l-.048-.125l-.009-.052l-.011-.047v-.047l-.011-.052v-.213l.011-.104l.011-.043l.009-.047l.016-.041l.011-.052l.021-.036l.02-.053l.021-.041l.02-.052l.027-.036l.036-.041l.027-.043l.041-.036l.031-.036l.032-.043l.047-.036l.032-.027l.041-.031l.083-.052l.047-.027l.095-.047l.041-.015l.047-.016l.052-.021l.052-.015l.037-.011l.047-.011l.041-.011l.047-.011l.052-.011l.104-.009l.048-.005zm-12.318.036h.943l.043.095l.02.041l.016.052l.021.047l.015.041l.027.047l.031.095l.027.047l.041.093l.011.041l.083.188l.016.047l.021.043l.025.047l.011.047l.027.052l.009.047l.048.093l.02.037l.021.052l.016.052l.015.036l.027.052l.016.043l.02.052l.016.036l.021.052l.047.093l.015.047l.011.048l.021.047l.025.041l.021.052l.021.047l.015.041l.043.095l.015.047l.021.047l.016.047l.02.041l.027.048l.02.047l.021.041l.011.052l.041.093l.021.043l.015.047l.043.093l.025.052l.011.041l.027.053l.009.036l.021.052l.027.052l.02.036l.016.052l.021.043l.015.052l.027.036l.031.104l.021.037l.02.052l.027.041l.021.052l.009.047l.016.041l.021.047l.025.043h-1.041l-.025-.043l-.016-.047l-.021-.047l-.02-.052l-.011-.041l-.043-.093l-.015-.043l-.041-.093l-.016-.041l-.021-.052l-.031-.095l-.021-.041h-1.448l-.02.047l-.016.043l-.021.052l-.02.047l-.011.041l-.021.052l-.02.041l-.016.047l-.021.043l-.02.052l-.016.036l-.021.052l-.015.052l-.021.037l-.016.052h-1.031l.015-.048l.043-.093l.015-.052l.016-.041l.027-.047l.02-.047l.021-.043l.011-.047l.02-.052l.027-.041l.02-.047l.032-.095l.047-.093l.016-.047l.02-.041l.016-.048l.063-.14l.021-.052l.015-.041l.016-.047l.027-.043l.02-.052l.016-.047l.016-.041l.02-.052l.027-.037l.016-.052l.02-.041l.016-.047l.021-.052l.025-.041l.016-.052l.02-.037l.016-.052l.021-.052l.02-.036l.021-.052l.016-.043l.02-.052l.016-.036l.027-.052l.02-.052l.021-.041l.011-.047l.02-.048l.027-.047l.02-.041l.011-.052l.021-.047l.021-.043l.041-.093l.015-.041l.043-.104l.02-.037l.021-.052l.016-.041l.015-.052l.021-.047l.027-.041l.02-.052l.016-.037l.016-.052l.02-.041l.027-.047l.016-.052l.015-.043l.021-.052l.02-.036l.027-.052l.016-.052l.015-.036l.021-.052zm2.928.027h1.031l.032.041l.052.084l.025.047l.027.036l.025.047l.027.041l.025.048l.027.041l.025.036l.027.047l.025.043l.037.041l.015.041l.032.047l.025.043l.032.036l.021.047l.025.041l.032.043l.015.041l.037.047l.077.125l.021.041l.031.041l.027.041l.025.048l.079.124l.025.048l.027.041l.031-.041l.021-.053l.031-.036l.027-.047l.025-.036l.021-.052l.036-.037l.027-.047l.021-.036l.025-.043l.032-.047l.025-.036l.027-.052l.025-.036l.032-.048l.02-.036l.027-.052l.025-.031l.027-.043l.031-.052l.027-.036l.02-.047l.032-.037l.025-.052l.027-.031l.031-.041l.027-.052l.025-.037l.027-.047l.025-.036l.027-.052l.031-.037l.021-.047l.027-.036h1.047v3.719h-.98V21.04l-.025.037l-.032.052l-.025.031l-.032.041l-.02.052l-.032.037l-.025.036l-.032.052l-.052.073l-.031.041l-.027.052l-.031.037l-.027.036l-.02.052l-.032.036l-.025.037l-.032.052l-.025.036l-.032.041l-.025.047l-.021.037l-.031.041l-.027.047l-.031.036l-.032.043l-.02.041l-.027.047l-.031.037l-.032.041l-.02.052l-.037.031l-.02.041l-.032.053l-.025.036H16.6l-.031-.047l-.027-.043l-.025-.047l-.027-.036l-.031-.047l-.027-.041l-.031-.043l-.027-.041l-.025-.047l-.027-.036l-.036-.048l-.021-.041l-.031-.047l-.027-.036l-.025-.047l-.032-.043l-.025-.052l-.032-.036l-.025-.047l-.027-.043l-.025-.047l-.032-.036l-.025-.047l-.032-.041l-.02-.043l-.032-.041l-.025-.047l-.032-.036l-.025-.048l-.032-.041l-.02-.047l-.037-.036l-.02-.048l-.032-.041v2.193h-.963v-3.683zm4.624 0h2.933v.839h-1.959v.599h1.76v.792h-1.76v.635h1.984v.844h-2.953v-3.677zm-7.094 1.14l-.016.047l-.015.043l-.021.052l-.021.047l-.015.047l-.043.093l-.02.052l-.016.043l-.016.052l-.02.036l-.016.052l-.021.052l-.02.037l-.016.052l-.02.041l-.016.052l-.027.047l-.011.041l-.02.052l-.021.048l-.016.041l-.02.052h.859l-.02-.052l-.016-.047l-.041-.095l-.016-.047l-.021-.041l-.015-.052l-.021-.047l-.016-.047l-.02-.043l-.016-.047l-.021-.052l-.015-.041l-.043-.093l-.009-.048l-.021-.047l-.021-.052l-.015-.036l-.043-.104l-.015-.047zm-1.53 6.964h10.681l-5.452 1.797z"/>
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

  // Store sections configuration with SVG icons
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
          <div className="container mx-auto px-4 py-16 deals-section relative">
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
            
            {/* Store-Specific Horizontal Scroll Sections */}
            <div className="space-y-16 mb-20">
              {/* Steam Section */}
              <div className="relative">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 432 400">
                        <path d="M372 119q0 26-18 44.5T310 182t-44.5-18.5T247 119t18.5-44.5T310 56t44 18.5t18 44.5zM0 319V209l65 26q20-12 45-12h9l73-105q0-48 34.5-82T309 2q49 0 83.5 34.5t34.5 83t-34.5 83T309 237l-112 82q-3 34-28 56.5T110 398q-32 0-56-19.5T24 329zM309.5 40Q277 40 254 63.5t-23 56t23 55.5t55.5 23t55.5-23t23-55.5t-23-56T309.5 40zM110 246q-7 0-14 2l27 10q19 8 27.5 27.5t.5 39.5t-27.5 28t-39.5 1q-6-3-16.5-7.5T53 341q18 34 57 34q26 0 45-19t19-45.5t-19-45.5t-45-19z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-800 bg-clip-text text-transparent">Steam Deals</h3>
                      <p className="text-gray-600 dark:text-gray-400">Exclusive Steam discounts</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" onClick={() => document.getElementById('steam-scroll').scrollLeft -= 300}>
                      <FaArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" onClick={() => document.getElementById('steam-scroll').scrollLeft += 300}>
                      <FaArrowRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
                <div id="steam-scroll" className="flex gap-3 overflow-x-auto scrollbar-hide pb-4">
                  {getFilteredDeals()
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
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 32 32">
                        <path d="M4.719 0C2.886 0 2.214.677 2.214 2.505v22.083c0 .209.011.401.027.579c.047.401.047.792.421 1.229c.036.052.412.328.412.328c.203.099.343.172.572.265l11.115 4.656c.573.261.819.371 1.235.355h.005c.421.016.667-.093 1.24-.355l11.109-4.656c.235-.093.369-.167.577-.265c0 0 .376-.287.412-.328c.375-.437.375-.828.421-1.229c.016-.177.027-.369.027-.573V2.506c0-1.828-.677-2.505-2.505-2.505zm17.808 4.145h.905c1.511 0 2.251.735 2.251 2.267v2.505H23.85V6.51c0-.489-.224-.713-.699-.713h-.312c-.489 0-.713.224-.713.713v7.749c0 .489.224.713.713.713h.349c.468 0 .692-.224.692-.713v-2.771h1.833v2.86c0 1.525-.749 2.276-2.265 2.276h-.921c-1.521 0-2.267-.756-2.267-2.276V6.425c0-1.525.745-2.281 2.267-2.281zm-16.251.106h4.151v1.703H8.14v3.468h2.204v1.699H8.14v3.697h2.319v1.704H6.276zm5.088 0h2.928c1.515 0 2.265.755 2.265 2.28v3.261c0 1.525-.751 2.276-2.265 2.276h-1.057v4.453h-1.871zm6.037 0h1.864v12.271h-1.864zm-4.172 1.65v4.52H14c.469 0 .693-.228.693-.719V6.619c0-.489-.224-.719-.693-.719z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent">Epic Games</h3>
                      <p className="text-gray-600 dark:text-gray-400">Epic Games discounts</p>
                    </div>
                  </div>
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

// Function to render platform icons
const renderPlatformIcon = (storeID) => {
    switch (storeID) {
      case '1': // Steam
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 432 400">
            <path d="M372 119q0 26-18 44.5T310 182t-44.5-18.5T247 119t18.5-44.5T310 56t44 18.5t18 44.5zM0 319V209l65 26q20-12 45-12h9l73-105q0-48 34.5-82T309 2q49 0 83.5 34.5t34.5 83t-34.5 83T309 237l-112 82q-3 34-28 56.5T110 398q-32 0-56-19.5T24 329zM309.5 40Q277 40 254 63.5t-23 56t23 55.5t55.5 23t55.5-23t23-55.5t-23-56T309.5 40zM110 246q-7 0-14 2l27 10q19 8 27.5 27.5t.5 39.5t-27.5 28t-39.5 1q-6-3-16.5-7.5T53 341q18 34 57 34q26 0 45-19t19-45.5t-19-45.5t-45-19z"/>
          </svg>
        );
      case '2': // Xbox
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 432 432">
            <path d="M213 85q-24-18-47-27.5T127.5 47t-28 0T81 51l-6 3Q134 3 213 3t139 51q-3-1-7-3t-17.5-4t-28.5 0t-38.5 11T213 85zm-56 41q-39 40-65 78t-34.5 63.5t-12 44.5t-1.5 28l3 9Q0 291 0 216q0-84 57-145q38 16 100 55zm270 90q0 75-47 133q1-3 2.5-9t-1.5-27.5t-12-45.5t-34.5-62.5T269 126q28-17 53-31t36-19l11-5q58 61 58 145zm-215-44q38 27 67.5 57t45 53t26 42t13.5 29l3 10q-62 66-153.5 66T59 363q2-4 5-11.5t15-30t28-44.5t44-51t61-54z"/>
          </svg>
        );
      case '3': // PlayStation
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.984 2.596v17.547l3.915 1.261V6.688c0-.69.304-1.151.794-.991c.636.18.76.814.76 1.505v5.875c2.441 1.193 4.362-.002 4.362-3.152c0-3.237-1.126-4.675-4.438-5.827c-1.307-.448-3.728-1.186-5.39-1.502zm4.656 16.241l6.296-2.275c.715-.258.826-.625.246-.818c-.586-.192-1.637-.139-2.357.123l-4.205 1.5V14.98l.24-.085s1.201-.42 2.913-.615c1.696-.18 3.785.03 5.437.661c1.848.601 2.04 1.472 1.576 2.072c-.465.6-1.622 1.036-1.622 1.036l-8.544 3.107V18.86zM1.807 18.6c-1.9-.545-2.214-1.668-1.352-2.32c.801-.586 2.16-1.052 2.16-1.052l5.615-2.013v2.313L4.205 17c-.705.271-.825.632-.239.826c.586.195 1.637.15 2.343-.12L8.247 17v2.074c-.12.03-.256.044-.39.073c-1.939.331-3.996.196-6.038-.479z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          </svg>
        );
    }
  };

// DealCard component
const DealCard = ({ deal, onAddToCart, onAddToWishlist, isInWishlist }) => {
  const savings = deal.normalPrice && deal.cheapestPrice 
    ? Math.round(((deal.normalPrice - deal.cheapestPrice) / deal.normalPrice) * 100)
    : 0;

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-orange-400 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl hover:shadow-blue-500/30 dark:hover:shadow-orange-500/30 shadow-gray-200/50 dark:shadow-gray-800/50">
      <Link 
        to={`/games/${deal.gameId || deal.id}`}
        className="block cursor-pointer"
        onClick={() => console.log('DealCard clicked:', deal.gameId || deal.id, deal.title)}
      >
        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAddToWishlist(deal.id);
          }}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-300 ${
            isInWishlist 
              ? 'bg-red-500 text-white shadow-xl' 
              : 'bg-black/50 text-white hover:bg-red-500 shadow-lg hover:shadow-xl'
          }`}
        >
          <FaHeart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Image Container */}
        <div className="relative overflow-hidden">
          <img
            src={deal.cheapestDeal.thumb || deal.thumb || '/assets/images/featured-game-1.jpg'}
            alt={deal.title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          {/* Savings Badge */}
          {savings > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm">
              -{savings}%
            </div>
          )}
          
          {/* Multiple Prices Indicator */}
          {deal.allPrices && deal.allPrices.length > 1 && (
            <div className="absolute top-3 right-16 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              {deal.allPrices.length} prices
            </div>
          )}
          
          {/* Overlay with Buttons */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAddToCart(deal);
              }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/40 flex items-center gap-3 shadow-xl border-0 focus:outline-none focus:ring-4 focus:ring-green-500/20"
            >
              <FaShoppingCart className="w-5 h-5" />
              <span className="text-sm">Add to Cart</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Platform Icon */}
          <div className="mb-3">
            <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300">
              {renderPlatformIcon(deal.cheapestDeal.storeID)}
            </div>
          </div>
          
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1">
              {deal.title}
            </h3>
            {deal.allPrices && deal.allPrices.length > 1 && (
              <div className="ml-2 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
                {deal.allPrices.length} stores
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                ${deal.cheapestPrice}
              </span>
              {deal.allPrices && deal.allPrices.length > 1 && (
                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                  Best Price
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
            <span>Store ID: {deal.cheapestDeal.storeID}</span>
            {deal.releaseDate && (
              <span>{new Date(deal.releaseDate * 1000).getFullYear()}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Deals;
