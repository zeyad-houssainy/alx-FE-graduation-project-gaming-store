import React from 'react';

export default function FeaturedGames() {
    const featuredGames = [
        {
            id: 1,
            title: "JUST FOR GAMERS",
            subtitle: "ELITE WARRIOR",
            platforms: "PLAYSTATION 5, XBOX",
            image: "/assets/images/featured-game-1.jpg",
            category: "ACTION"
        },
        {
            id: 2,
            title: "NEED FOR SPEED",
            subtitle: "RACING LEGEND",
            platforms: "PLAYSTATION 5, XBOX",
            image: "/assets/images/featured-game-2.jpg",
            category: "RACING"
        },
        {
            id: 3,
            title: "EGYPT HUNTING",
            subtitle: "GAMERS",
            platforms: "PLAYSTATION 5, XBOX",
            image: "/assets/images/featured-game-3.jpg",
            category: "ADVENTURE"
        },
        {
            id: 4,
            title: "JUST FOR GAMERS",
            subtitle: "TACTICAL OPS",
            platforms: "PLAYSTATION 5, XBOX",
            image: "/assets/images/featured-game-4.jpg",
            category: "SHOOTER"
        }
    ];

    return (
        <section className="py-12 sm:py-16 md:py-20 bg-white dark:bg-gray-800 relative">
            <div className="container mx-auto px-4 sm:px-6">
                {/* Section Header */}
                <div className="text-center mb-12 sm:mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
                        FEATURED <span className="text-amber-500 dark:text-orange-400">GAMES</span>
                    </h2>
                    <div className="w-20 sm:w-24 h-1 bg-amber-500 dark:bg-orange-400 mx-auto mb-4 sm:mb-6"></div>
                    <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed px-4">
                        Discover our collection of the latest and most exciting games available across all platforms
                    </p>
                </div>

                {/* Games Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {featuredGames.map((game) => (
                        <div 
                            key={game.id}
                            className="group relative bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                        >
                            {/* Game Image */}
                            <div className="relative h-60 sm:h-72 md:h-80 overflow-hidden">
                                <img 
                                    src={game.image} 
                                    alt={game.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                
                                {/* Category Badge */}
                                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-amber-500 dark:bg-orange-400 text-black dark:text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {game.category}
                                </div>
                                
                                {/* Content Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                                    <h3 className="text-lg sm:text-xl font-black font-bold mb-2 leading-tight">
                                        {game.title}
                                    </h3>
                                    <p className="text-amber-400 font-bold text-xs sm:text-sm mb-2 sm:mb-3 uppercase tracking-wider">
                                        {game.subtitle}
                                    </p>
                                    
                                    {/* Platform Icons */}
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="text-amber-400">🎮</span>
                                        <span className="text-gray-300 uppercase tracking-wide">
                                            {game.platforms}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Hover Action Button - Desktop */}
                                <div className="absolute inset-0 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <button className="bg-amber-500 dark:bg-orange-400 hover:bg-amber-600 dark:hover:bg-orange-500 text-black dark:text-white font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-lg uppercase tracking-wider transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg text-sm sm:text-base">
                                        Play Now
                                    </button>
                                </div>

                                {/* Mobile Action Button - Always Visible */}
                                <div className="absolute bottom-4 right-4 md:hidden">
                                    <button className="bg-amber-500 dark:bg-orange-400 hover:bg-amber-600 dark:hover:bg-orange-500 text-black dark:text-white font-bold px-3 py-2 rounded-lg uppercase tracking-wider text-xs shadow-lg">
                                        Play Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <button className="bg-blue-600 dark:bg-orange-500 hover:bg-blue-700 dark:hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-lg uppercase tracking-wider transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                        View All Games
                    </button>
                </div>
            </div>
        </section>
    );
}
