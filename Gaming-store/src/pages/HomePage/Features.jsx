export default function Features() {
    const features = [
        {
            id: 1,
            icon: "🎮",
            title: "Latest Games",
            description: "Discover the newest and most exciting games in our ever-expanding collection."
        },
        {
            id: 2,
            icon: "🏆",
            title: "Tournaments",
            description: "Compete with players worldwide in epic tournaments and live matches."
        },
        {
            id: 3,
            icon: "🛒",
            title: "Gaming Store",
            description: "Shop for gaming accessories, merchandise, and exclusive collectibles."
        }
    ];

    return (
        <section className="py-12 sm:py-16 md:py-20 bg-white dark:bg-gray-800 relative">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="text-center mb-12 sm:mb-16">
                    <p className="text-gray-500 dark:text-gray-400 font-bold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4">
                        What We Offer
                    </p>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-['Oxanium'] mb-4 sm:mb-6 text-gray-900 dark:text-white">
                        Gaming <span className="text-blue-600 dark:text-orange-400">Excellence</span>
                    </h2>
                    <div className="w-20 sm:w-24 h-1 bg-blue-600 dark:bg-orange-400 mx-auto mb-4 sm:mb-6"></div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {features.map((feature) => (
                        <div 
                            key={feature.id}
                            className="group bg-white dark:bg-gray-700 p-6 sm:p-8 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-orange-400 hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105"
                        >
                            <div className="text-blue-600 dark:text-orange-400 text-3xl sm:text-4xl mb-3 sm:mb-4">{feature.icon}</div>
                            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 font-['Oxanium'] text-gray-900 dark:text-white">
                                {feature.title}
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
