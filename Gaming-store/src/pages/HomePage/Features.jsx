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
        <section className="py-20 bg-white relative">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <p className="text-gray-500 font-bold text-sm uppercase tracking-wider mb-4">
                        What We Offer
                    </p>
                    <h2 className="text-4xl md:text-5xl font-black font-['Oxanium'] mb-6 text-gray-900">
                        Gaming <span className="text-blue-600">Excellence</span>
                    </h2>
                    <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature) => (
                        <div 
                            key={feature.id}
                            className="group bg-white p-8 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105"
                        >
                            <div className="text-blue-600 text-4xl mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-bold mb-4 font-['Oxanium'] text-gray-900">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
