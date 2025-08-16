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
            label: "gaming store",
            alt: "Gaming Store"
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
        <section className="py-20 bg-white relative">
            <div className="container mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black font-['Oxanium'] mb-6 text-gray-900">
                        Our <span className="text-blue-600">Services</span>
                    </h2>
                    <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                        Discover our comprehensive gaming services designed to enhance your gaming experience
                    </p>
                </div>

                {/* Services Icons Section */}
                <div className="flex justify-center items-end space-x-8 md:space-x-12 lg:space-x-16">
                    {services.map((service) => (
                        <div 
                            key={service.id}
                            className="opacity-50 hover:opacity-100 transition-all duration-300 transform hover:scale-110 cursor-pointer group flex flex-col items-center"
                        >
                            {/* Icon Container */}
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl border border-gray-200 group-hover:border-blue-300 mb-3">
                                <img 
                                    src={service.image} 
                                    alt={service.alt} 
                                    className="w-10 h-10 md:w-12 md:h-12 object-contain"
                                />
                            </div>
                            
                            {/* Hover Text Label */}
                            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                <p className="text-black text-sm font-medium text-center whitespace-nowrap">
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
