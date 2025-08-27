import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Features() {
    const navigate = useNavigate();
    
    const features = [
        {
            id: 1,
            icon: "🎮",
            title: "Latest Games",
            description: "Discover the newest and most exciting games in our ever-expanding collection.",
            background: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
            gradient: "from-blue-600 via-purple-600 to-indigo-600",
            route: "/games"
        },
        {
            id: 2,
            icon: "🏆",
            title: "Tournaments",
            description: "Compete with players worldwide in epic tournaments and live matches.",
            background: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
            gradient: "from-purple-600 to-indigo-600",
            route: "/tournaments"
        },
        {
            id: 3,
            icon: "🛒",
            title: "GAMING STORE",
            description: "Shop for gaming accessories, merchandise, and exclusive collectibles.",
            background: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
            gradient: "from-blue-600 via-purple-600 to-indigo-600",
            route: "/deals"
        }
    ];

    const handleLearnMore = (feature) => {
        if (feature.route) {
            navigate(feature.route);
        } else {
            // Fallback for features without routes
            alert(`Learn more about ${feature.title}`);
        }
    };

    const handleExploreAllFeatures = () => {
        navigate('/games');
    };

    return (
        <section className="py-16 sm:py-20 md:py-24 bg-gray-50 dark:bg-gray-800 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-blue-300 rotate-45 rounded-full"></div>
                <div className="absolute top-3/4 right-1/4 w-48 h-48 border border-purple-300 rotate-12 rounded-full"></div>
                <div className="absolute bottom-1/4 left-1/2 w-32 h-32 border border-orange-300 -rotate-45 rounded-full"></div>
            </div>
            
            <div className="container mx-auto px-4 sm:px-6 relative z-10">
                <div className="text-center mb-16 sm:mb-20">
                    <p className="text-blue-600 dark:text-orange-400 font-bold text-sm sm:text-base uppercase tracking-wider mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent">
                        What We Offer
                    </p>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-black font-bold mb-6 sm:mb-8 text-gray-900 dark:text-white">
                        Gaming <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-orange-400 dark:via-red-400 dark:to-pink-400 bg-clip-text text-transparent">Excellence</span>
                    </h2>
                    <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-orange-400 dark:via-red-400 dark:to-pink-400 mx-auto mb-6 sm:mb-8 rounded-full"></div>
                    <p className="text-gray-600 dark:text-gray-300 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
                        Experience the pinnacle of gaming innovation with cutting-edge technology, 
                        immersive gameplay, and unparalleled entertainment.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10">
                    {features.map((feature) => (
                        <div 
                            key={feature.id}
                            className="group relative overflow-hidden rounded-3xl transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                        >
                            {/* Background Image */}
                            <div 
                                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-110 opacity-70"
                                style={{ backgroundImage: `url(${feature.background})` }}
                            />
                            
                            {/* Gradient Overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} transition-opacity duration-500 group-hover:opacity-80`} />
                            
                            {/* Glass Effect Card */}
                            <div className="relative h-full min-h-[400px] p-8 sm:p-10 backdrop-blur-md bg-white/10 dark:bg-gray-900/20 border border-white/20 dark:border-gray-700/30 rounded-3xl shadow-2xl group-hover:bg-white/20 dark:group-hover:bg-gray-900/30">
                                {/* Icon */}
                                <div className="text-6xl sm:text-7xl mb-6 sm:mb-8 drop-shadow-2xl filter transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                                    {feature.icon}
                                </div>
                                
                                {/* Content */}
                                <div className="relative z-10">
                                    <h3 className="text-2xl sm:text-3xl font-black mb-4 sm:mb-6 text-white drop-shadow-lg">
                                        {feature.title}
                                    </h3>
                                    <p className="text-base sm:text-lg text-white/90 leading-relaxed drop-shadow-md">
                                        {feature.description}
                                    </p>
                                    
                                    {/* Learn More Button */}
                                    <button 
                                        onClick={() => handleLearnMore(feature)}
                                        className="mt-6 sm:mt-8 px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-2xl hover:bg-white/30 hover:border-white/50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                                    >
                                        Learn More →
                                    </button>
                                </div>
                                
                                {/* Glow Effect */}
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Bottom CTA */}
                <div className="text-center mt-16 sm:mt-20">
                    <button 
                        onClick={handleExploreAllFeatures}
                        className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-orange-400 dark:via-red-400 dark:to-pink-400 text-white font-bold px-8 sm:px-10 py-4 sm:py-5 rounded-2xl uppercase tracking-wider transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 dark:hover:shadow-orange-500/25 text-lg sm:text-xl"
                    >
                        <span className="relative z-10">Explore All Features</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 dark:from-pink-400 via-red-400 dark:to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                </div>
            </div>
        </section>
    );
}
