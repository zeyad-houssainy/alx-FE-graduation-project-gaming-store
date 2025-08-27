import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useFetchGames } from '../../hooks/useFetchGames';
import GameCard from '../../components/GameCard';
import Loader from '../../components/Loader';
import { FaChevronLeft, FaChevronRight, FaPlay, FaPause } from 'react-icons/fa';

export default function FeaturedGames() {
    const { games, loading } = useFetchGames(1, 20); // Fetch more games for multiple sections
    const [activeSection, setActiveSection] = useState(0);
    const [isAutoScrolling, setIsAutoScrolling] = useState(true);
    const [scrollSpeed, setScrollSpeed] = useState(3000); // 3 seconds
    const scrollRefs = useRef([]);
    const autoScrollTimers = useRef([]);

    // Game sections configuration
    const gameSections = [
        {
            id: 'featured',
            title: 'FEATURED GAMES',
            subtitle: 'Handpicked titles for the ultimate gaming experience',
            color: 'from-blue-600 to-purple-600',
            games: games.slice(0, 8)
        },
        {
            id: 'new-releases',
            title: 'NEW RELEASES',
            subtitle: 'Fresh games just launched this month',
            color: 'from-green-600 to-teal-600',
            games: games.slice(8, 16)
        },
        {
            id: 'trending',
            title: 'TRENDING NOW',
            subtitle: 'Most popular games everyone is playing',
            color: 'from-orange-600 to-red-600',
            games: games.slice(16, 24)
        }
    ];

    // Auto-scroll functionality
    useEffect(() => {
        if (isAutoScrolling && games.length > 0) {
            gameSections.forEach((section, index) => {
                const timer = setInterval(() => {
                    scrollToNext(index);
                }, scrollSpeed);
                autoScrollTimers.current[index] = timer;
            });

            return () => {
                autoScrollTimers.current.forEach(timer => clearInterval(timer));
            };
        }
    }, [isAutoScrolling, scrollSpeed, games.length]);

    // Scroll to next set of games
    const scrollToNext = (sectionIndex) => {
        const scrollContainer = scrollRefs.current[sectionIndex];
        if (scrollContainer) {
            const scrollWidth = scrollContainer.scrollWidth;
            const clientWidth = scrollContainer.clientWidth;
            const currentScroll = scrollContainer.scrollLeft;
            const maxScroll = scrollWidth - clientWidth;
            
            if (currentScroll >= maxScroll) {
                scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                scrollContainer.scrollTo({ 
                    left: currentScroll + 300, 
                    behavior: 'smooth' 
                });
            }
        }
    };

    // Scroll to previous set of games
    const scrollToPrevious = (sectionIndex) => {
        const scrollContainer = scrollRefs.current[sectionIndex];
        if (scrollContainer) {
            const currentScroll = scrollContainer.scrollLeft;
            const newScroll = Math.max(0, currentScroll - 300);
            scrollContainer.scrollTo({ 
                left: newScroll, 
                behavior: 'smooth' 
            });
        }
    };

    // Toggle auto-scroll
    const toggleAutoScroll = () => {
        setIsAutoScrolling(!isAutoScrolling);
    };

    // Change scroll speed
    const changeSpeed = (newSpeed) => {
        setScrollSpeed(newSpeed);
        setIsAutoScrolling(true);
    };

    if (loading) {
        return (
            <section className="py-20 bg-gray-50 dark:bg-gray-800 relative">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black font-bold mb-6 text-gray-900 dark:text-white">
                            FEATURED <span className="text-blue-600 dark:text-orange-400">GAMES</span>
                        </h2>
                        <div className="w-24 h-1 bg-amber-500 mx-auto mb-6"></div>
                        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
                            Discover our collection of the latest and most exciting games available across all platforms
                        </p>
                    </div>
                    <Loader />
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-800 relative">
            <div className="container mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black font-bold mb-6 text-gray-900 dark:text-white">
                        FEATURED <span className="text-blue-600 dark:text-orange-400">GAMES</span>
                    </h2>
                    <div className="w-24 h-1 bg-amber-500 mx-auto mb-6"></div>
                    <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
                        Discover our collection of the latest and most exciting games available across all platforms
                    </p>
                    
                    {/* Auto-scroll Controls */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <button
                            onClick={toggleAutoScroll}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                                isAutoScrolling 
                                    ? 'bg-green-600 text-white hover:bg-green-700' 
                                    : 'bg-gray-600 text-white hover:bg-gray-700'
                            }`}
                        >
                            {isAutoScrolling ? <FaPause /> : <FaPlay />}
                            {isAutoScrolling ? 'Pause' : 'Play'} Auto-scroll
                        </button>
                        
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Speed:</span>
                            <button
                                onClick={() => changeSpeed(2000)}
                                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                    scrollSpeed === 2000 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                }`}
                            >
                                Fast
                            </button>
                            <button
                                onClick={() => changeSpeed(3000)}
                                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                    scrollSpeed === 3000 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                }`}
                            >
                                Normal
                            </button>
                            <button
                                onClick={() => changeSpeed(5000)}
                                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                    scrollSpeed === 5000 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                }`}
                            >
                                Slow
                            </button>
                        </div>
                    </div>
                </div>

                {/* Game Sections */}
                {gameSections.map((section, sectionIndex) => (
                    <div key={section.id} className="mb-16 last:mb-0">
                        {/* Section Title */}
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className={`text-2xl md:text-3xl font-black font-bold mb-2 bg-gradient-to-r ${section.color} bg-clip-text text-transparent`}>
                                    {section.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-lg">
                                    {section.subtitle}
                                </p>
                            </div>
                            
                            {/* Navigation Arrows */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => scrollToPrevious(sectionIndex)}
                                    className="p-2 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-orange-400 hover:border-blue-300 dark:hover:border-orange-400 transition-all duration-300 hover:scale-110"
                                >
                                    <FaChevronLeft />
                                </button>
                                <button
                                    onClick={() => scrollToNext(sectionIndex)}
                                    className="p-2 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-orange-400 hover:border-blue-300 dark:hover:border-orange-400 transition-all duration-300 hover:scale-110"
                                >
                                    <FaChevronRight />
                                </button>
                            </div>
                        </div>

                        {/* Horizontal Scroll Container */}
                        <div className="relative">
                            <div
                                ref={el => scrollRefs.current[sectionIndex] = el}
                                className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            >
                                {section.games.map((game) => (
                                    <div key={game.id} className="flex-shrink-0 w-80">
                                        <GameCard game={game} />
                                    </div>
                                ))}
                            </div>
                            
                            {/* Scroll Indicator */}
                            <div className="mt-4 text-center">
                                <div className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <span>Scroll to explore more games</span>
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-blue-600 dark:bg-orange-400 rounded-full animate-pulse"></div>
                                        <div className="w-2 h-2 bg-blue-600 dark:bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-blue-600 dark:bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* View All Button */}
                <div className="text-center mt-16">
                    <Link to="/games">
                        <button className="group relative overflow-hidden bg-transparent border-2 border-blue-600 dark:border-orange-400 text-blue-600 dark:text-orange-400 font-bold px-8 py-4 rounded-lg uppercase tracking-wider transition-all duration-300 hover:text-white hover:shadow-lg transform hover:scale-105">
                            <span className="absolute inset-0 bg-blue-600 dark:bg-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                            <span className="relative z-10">View All Games</span>
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
