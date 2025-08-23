import React, { useState } from 'react';
import MockStore from './MockStore';
import CheapSharkGames from './CheapSharkGames';
import RAWGGames from './RAWGGames';

export default function UnifiedStore() {
  const [activeSection, setActiveSection] = useState('mock'); // 'mock', 'cheapshark', 'rawg'

  const sections = [
    {
      id: 'mock',
      name: '🎯 Mock Store',
      description: 'Local game data with fallback content',
      icon: '🎯',
      color: 'purple'
    },
    {
      id: 'cheapshark',
      name: '💰 CheapShark Store',
      description: 'Real-time pricing from 20+ stores',
      icon: '💰',
      color: 'blue'
    },
    {
      id: 'rawg',
      name: '🎮 RAWG Store',
      description: 'Comprehensive gaming database',
      icon: '🎮',
      color: 'green'
    }
  ];

  const getSectionContent = () => {
    switch (activeSection) {
      case 'mock':
        return <MockStore />;
      case 'cheapshark':
        return <CheapSharkGames />;
      case 'rawg':
        return <RAWGGames />;
      default:
        return <MockStore />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Store Header */}
      <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-green-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-green-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🏪 Gaming Store Hub
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Choose your preferred gaming store experience
          </p>
        </div>

        {/* Store Selection Tabs */}
        <div className="flex flex-wrap justify-center gap-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
                activeSection === section.id
                  ? `bg-${section.color}-600 text-white shadow-lg shadow-${section.color}-600/30`
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
              }`}
            >
              <span className="text-xl">{section.icon}</span>
              <span className="hidden sm:inline">{section.name}</span>
              <span className="sm:hidden">{section.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Section Indicator */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center gap-3">
          <span className="text-2xl">
            {sections.find(s => s.id === activeSection)?.icon}
          </span>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {sections.find(s => s.id === activeSection)?.name}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {sections.find(s => s.id === activeSection)?.description}
            </p>
          </div>
        </div>
      </div>

      {/* Store Content */}
      <div className="min-h-[600px]">
        {getSectionContent()}
      </div>

      {/* Store Comparison */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
          📊 Store Comparison
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sections.map((section) => (
            <div
              key={section.id}
              className={`bg-white dark:bg-gray-800 rounded-lg p-4 border-2 transition-all duration-200 ${
                activeSection === section.id
                  ? `border-${section.color}-500 shadow-lg shadow-${section.color}-500/20`
                  : 'border-gray-200 dark:border-gray-600'
              }`}
            >
              <div className="text-center">
                <div className={`text-4xl mb-2 ${activeSection === section.id ? 'animate-bounce' : ''}`}>
                  {section.icon}
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {section.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {section.description}
                </p>
                
                {/* Store Features */}
                <div className="text-left space-y-1">
                  {section.id === 'mock' && (
                    <>
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        Local data storage
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        Always available
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        Fast loading
                      </div>
                    </>
                  )}
                  
                  {section.id === 'cheapshark' && (
                    <>
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Real-time pricing
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        20+ store comparison
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Deal tracking
                      </div>
                    </>
                  )}
                  
                  {section.id === 'rawg' && (
                    <>
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        500,000+ games
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Rich metadata
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Advanced filtering
                      </div>
                    </>
                  )}
                </div>
                
                <button
                  onClick={() => setActiveSection(section.id)}
                  className={`mt-3 w-full px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    activeSection === section.id
                      ? `bg-${section.color}-600 text-white`
                      : `bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600`
                  }`}
                >
                  {activeSection === section.id ? 'Active' : 'Switch to'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Store Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
          ℹ️ Store Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Mock Store Info */}
          <div className="text-center">
            <div className="text-3xl mb-2">🎯</div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Mock Store</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Local fallback data for offline use and testing. Always available with curated game selection.
            </p>
          </div>
          
          {/* CheapShark Info */}
          <div className="text-center">
            <div className="text-3xl mb-2">💰</div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">CheapShark</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Real-time game prices and deals from multiple online stores. Perfect for price comparison.
            </p>
          </div>
          
          {/* RAWG Info */}
          <div className="text-center">
            <div className="text-3xl mb-2">🎮</div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">RAWG</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Comprehensive gaming database with detailed information, screenshots, and metadata.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
