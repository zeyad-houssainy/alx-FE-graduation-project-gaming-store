export default function OurServices() {
    const services = [
        {
            id: 1,
            image: "/assets/images/brand-1.png",
            label: "secured purchase",
            alt: "Secured Purchase"
        },
        {
            id: 2,
            image: "/assets/images/brand-2.png",
            label: "Blog",
            alt: "Blog"
        },
        {
            id: 3,
            image: "/assets/images/brand-3.png",
            label: "GAMING STORE",
            alt: "GAMING STORE"
        },
        {
            id: 4,
            image: "/assets/images/brand-4.png",
            label: "online chats",
            alt: "Online Chats"
        },
        {
            id: 5,
            image: "/assets/images/brand-5.png",
            label: "Live matches stream",
            alt: "Live Matches Stream"
        },
        {
            id: 6,
            image: "/assets/images/brand-6.png",
            label: "customer care",
            alt: "Customer Care"
        }
    ];

    return (
        <section className="py-12 sm:py-16 md:py-20 bg-white dark:bg-gray-800 relative">
            <div className="container mx-auto px-4 sm:px-6">
                {/* Section Header */}
                <div className="text-center mb-12 sm:mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
                        Our <span className="text-blue-600 dark:text-orange-400">Services</span>
                    </h2>
                    <div className="w-20 sm:w-24 h-1 bg-blue-600 dark:bg-orange-400 mx-auto mb-4 sm:mb-6"></div>
                    <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed px-4">
                        Discover our comprehensive gaming services designed to enhance your gaming experience
                    </p>
                </div>

                {/* Services Icons Section */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:justify-center md:items-end gap-6 sm:gap-8 md:space-x-8 lg:space-x-12 xl:space-x-16">
                    {services.map((service) => (
                        <div 
                            key={service.id}
                            className="opacity-50 hover:opacity-100 transition-all duration-300 transform hover:scale-110 cursor-pointer group flex flex-col items-center"
                        >
                            {/* Icon Container */}
                            <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl border border-gray-200 dark:border-gray-600 group-hover:border-blue-300 dark:group-hover:border-orange-400 mb-3">
                                <img 
                                    src={service.image} 
                                    alt={service.alt} 
                                    className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain"
                                />
                            </div>
                            
                            {/* Hover Text Label */}
                            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                <p className="text-black dark:text-white text-xs sm:text-sm font-medium text-center whitespace-nowrap">
                                    {service.label}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
