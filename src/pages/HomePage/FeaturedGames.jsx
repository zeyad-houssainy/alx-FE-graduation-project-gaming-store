import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useFetchGames } from '../../hooks/useFetchGames';
import PortraitGameCard from '../../components/PortraitGameCard';
import Loader from '../../components/Loader';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function FeaturedGames() {
    const { games, loading } = useFetchGames(1, 20); // Fetch more games for multiple sections
    const [activeSection, setActiveSection] = useState(0);
    const [isAutoScrolling, setIsAutoScrolling] = useState(true);
    const [scrollSpeed, setScrollSpeed] = useState(5000); // 5 seconds (normal speed)
    const scrollRefs = useRef([]);
    const autoScrollTimers = useRef([]);
    const [hoveredSection, setHoveredSection] = useState(null);

    // Game sections configuration
    const gameSections = [
        {
            id: 'featured',
            title: 'Discover Something New',
            games: games.slice(0, 8)
        },
        {
            id: 'new-releases',
            title: 'New Releases',
            games: games.slice(8, 16)
        },
        {
            id: 'trending',
            title: 'Trending Now',
            games: games.slice(16, 24)
        }
    ];

    // Auto-scroll functionality
    useEffect(() => {
        if (isAutoScrolling && games.length > 0) {
            gameSections.forEach((section, index) => {
                // Only start auto-scroll if this section is not being hovered
                if (hoveredSection !== index) {
                    const timer = setInterval(() => {
                        scrollToNext(index);
                    }, scrollSpeed);
                    autoScrollTimers.current[index] = timer;
                }
            });

            return () => {
                autoScrollTimers.current.forEach(timer => clearInterval(timer));
            };
        }
    }, [isAutoScrolling, scrollSpeed, games.length, hoveredSection]);

    // Scroll to next set of games (skip 3 tickets)
    const scrollToNext = (sectionIndex) => {
        const scrollContainer = scrollRefs.current[sectionIndex];
        if (scrollContainer) {
            const scrollWidth = scrollContainer.scrollWidth;
            const clientWidth = scrollContainer.clientWidth;
            const currentScroll = scrollContainer.scrollLeft;
            const maxScroll = scrollWidth - clientWidth;
            
            // Calculate scroll distance for 3 tickets (3 * 256px + 16px gap)
            const scrollDistance = 3 * 256 + 16;
            
            if (currentScroll >= maxScroll) {
                scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                scrollContainer.scrollTo({ 
                    left: currentScroll + scrollDistance, 
                    behavior: 'smooth' 
                });
            }
        }
    };

    // Scroll to previous set of games (skip 3 tickets)
    const scrollToPrevious = (sectionIndex) => {
        const scrollContainer = scrollRefs.current[sectionIndex];
        if (scrollContainer) {
            const currentScroll = scrollContainer.scrollLeft;
            // Calculate scroll distance for 3 tickets (3 * 256px + 16px gap)
            const scrollDistance = 3 * 256 + 16;
            const newScroll = Math.max(0, currentScroll - scrollDistance);
            scrollContainer.scrollTo({ 
                left: newScroll, 
                behavior: 'smooth' 
            });
        }
    };



    // Handle hover events to pause/resume auto-scroll
    const handleMouseEnter = (sectionIndex) => {
        setHoveredSection(sectionIndex);
        // Clear the timer for this section when hovering
        if (autoScrollTimers.current[sectionIndex]) {
            clearInterval(autoScrollTimers.current[sectionIndex]);
            autoScrollTimers.current[sectionIndex] = null;
        }
    };

    const handleMouseLeave = (sectionIndex) => {
        setHoveredSection(null);
        // Restart auto-scroll for this section when not hovering
        if (isAutoScrolling) {
            const timer = setInterval(() => {
                scrollToNext(sectionIndex);
            }, scrollSpeed);
            autoScrollTimers.current[sectionIndex] = timer;
        }
    };

    // New function to handle manual scroll
    const handleManualScroll = (sectionIndex, direction) => {
        if (direction === 'left') {
            scrollToPrevious(sectionIndex);
        } else {
            scrollToNext(sectionIndex);
        }
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
        <section className="py-16 sm:py-20 md:py-24">
            <div className="container mx-auto px-4">
                {gameSections.map((section, sectionIndex) => (
                    <div key={section.id} className="mb-16 last:mb-0">
                        {/* Section Header - Clean Layout */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                                    {section.title}
                                </h2>
                                <FaChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                            </div>
                            
                            {/* Navigation Arrows */}
                            <div className="flex items-center gap-2">
                                <button 
                                    className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                    onClick={() => handleManualScroll(sectionIndex, 'left')}
                                >
                                    <FaChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                </button>
                                <button 
                                    className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                    onClick={() => handleManualScroll(sectionIndex, 'right')}
                                >
                                    <FaChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                </button>
                            </div>
                        </div>

                        {/* Horizontal Scroll Container */}
                        <div className="relative">
                            <div
                                ref={el => scrollRefs.current[sectionIndex] = el}
                                className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                onMouseEnter={() => handleMouseEnter(sectionIndex)}
                                onMouseLeave={() => handleMouseLeave(sectionIndex)}
                            >
                                {section.games.map((game) => (
                                    <div key={game.id} className="flex-shrink-0 w-80">
                                        <PortraitGameCard game={game} />
                                    </div>
                                ))}
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
