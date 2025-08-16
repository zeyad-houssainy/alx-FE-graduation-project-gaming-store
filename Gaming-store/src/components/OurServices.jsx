export default function OurServices() {
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

                {/* Brand Icons Section */}
                <div className="flex justify-center items-center space-x-12 md:space-x-16 lg:space-x-20">
                    {/* Brand 1 */}
                    <div className="opacity-50 hover:opacity-100 transition-all duration-300 transform hover:scale-110 cursor-pointer group">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl border border-gray-200 group-hover:border-blue-300">
                            <img 
                                src="/assets/images/brand-1.png" 
                                alt="Gaming Brand 1" 
                                className="w-10 h-10 md:w-12 md:h-12 object-contain"
                            />
                        </div>
                    </div>
                    
                    {/* Brand 2 */}
                    <div className="opacity-50 hover:opacity-100 transition-all duration-300 transform hover:scale-110 cursor-pointer group">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl border border-gray-200 group-hover:border-blue-300">
                            <img 
                                src="/assets/images/brand-2.png" 
                                alt="Gaming Brand 2" 
                                className="w-10 h-10 md:w-12 md:h-12 object-contain"
                            />
                        </div>
                    </div>
                    
                    {/* Brand 3 */}
                    <div className="opacity-50 hover:opacity-100 transition-all duration-300 transform hover:scale-110 cursor-pointer group">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl border border-gray-200 group-hover:border-blue-300">
                            <img 
                                src="/assets/images/brand-3.png" 
                                alt="Gaming Brand 3" 
                                className="w-10 h-10 md:w-12 md:h-12 object-contain"
                            />
                        </div>
                    </div>
                    
                    {/* Brand 4 */}
                    <div className="opacity-50 hover:opacity-100 transition-all duration-300 transform hover:scale-110 cursor-pointer group">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl border border-gray-200 group-hover:border-blue-300">
                            <img 
                                src="/assets/images/brand-4.png" 
                                alt="Gaming Brand 4" 
                                className="w-10 h-10 md:w-12 md:h-12 object-contain"
                            />
                        </div>
                    </div>
                    
                    {/* Brand 5 */}
                    <div className="opacity-50 hover:opacity-100 transition-all duration-300 transform hover:scale-110 cursor-pointer group">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl border border-gray-200 group-hover:border-blue-300">
                            <img 
                                src="/assets/images/brand-5.png" 
                                alt="Gaming Brand 5" 
                                className="w-10 h-10 md:w-12 md:h-12 object-contain"
                            />
                        </div>
                    </div>
                    
                    {/* Brand 6 */}
                    <div className="opacity-50 hover:opacity-100 transition-all duration-300 transform hover:scale-110 cursor-pointer group">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl border border-gray-200 group-hover:border-blue-300">
                            <img 
                                src="/assets/images/brand-6.png" 
                                alt="Gaming Brand 6" 
                                className="w-10 h-10 md:w-12 md:h-12 object-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
