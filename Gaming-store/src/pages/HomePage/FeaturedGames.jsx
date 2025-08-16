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
        <section className="py-20 bg-gray-50 relative">
            <div className="container mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black font-['Oxanium'] mb-6 text-gray-900">
                        ALL RELEASED <span className="text-amber-500">GAMES</span>
                    </h2>
                    <div className="w-24 h-1 bg-amber-500 mx-auto mb-6"></div>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                        Discover our collection of the latest and most exciting games available across all platforms
                    </p>
                </div>

                {/* Games Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredGames.map((game) => (
                        <div 
                            key={game.id}
                            className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                        >
                            {/* Game Image */}
                            <div className="relative h-80 overflow-hidden">
                                <img 
                                    src={game.image} 
                                    alt={game.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                
                                {/* Category Badge */}
                                <div className="absolute top-4 left-4 bg-amber-500 text-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {game.category}
                                </div>
                                
                                {/* Content Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                    <h3 className="text-xl font-black font-['Oxanium'] mb-2 leading-tight">
                                        {game.title}
                                    </h3>
                                    <p className="text-amber-400 font-bold text-sm mb-3 uppercase tracking-wider">
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
                                
                                {/* Hover Action Button */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <button className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-6 py-3 rounded-lg uppercase tracking-wider transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg">
                                        Play Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-lg uppercase tracking-wider transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                        View All Games
                    </button>
                </div>
            </div>
        </section>
    );
}
