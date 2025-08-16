export default function Hero() {
    return(
        <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-blue-300 rotate-45"></div>
                <div className="absolute top-3/4 right-1/4 w-24 h-24 border border-purple-300 rotate-12"></div>
                <div className="absolute bottom-1/4 left-1/2 w-16 h-16 border border-indigo-300 -rotate-45"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="text-left">
                        <p className="text-blue-600 text-sm font-bold uppercase mb-4 tracking-wider">
                            WORLD GAMING
                        </p>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-['Oxanium'] font-black text-gray-900 leading-tight mb-6">
                            Create <span className="text-amber-500">Manage</span><br />
                            Matches
                        </h1>
                        <p className="text-gray-600 text-lg max-w-lg mb-8 leading-relaxed">
                            Find technology or people for digital projects in public sector and find an individual specialist developer researcher.
                        </p>
                        <button className="bg-amber-500 text-black px-8 py-4 font-bold uppercase text-sm tracking-wider hover:bg-amber-600 transition-all duration-300 transform hover:scale-105 rounded-lg shadow-lg hover:shadow-xl">
                            READ MORE
                        </button>
                    </div>

                    {/* Right Content - Character */}
                    <div className="relative flex justify-center lg:justify-end">
                        <div className="relative">
                            {/* Character placeholder - you can replace this with actual image */}
                            <div className="w-80 h-80 lg:w-96 lg:h-96 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-2xl">
                                <div className="text-6xl">🏴‍☠️</div>
                            </div>
                            
                            {/* Floating elements */}
                            <div className="absolute -top-8 -left-8 w-16 h-16 bg-amber-400 rounded-full animate-bounce opacity-80"></div>
                            <div className="absolute -bottom-4 -right-8 w-12 h-12 bg-blue-400 rounded-full animate-pulse opacity-80"></div>
                            <div className="absolute top-1/2 -left-12 w-8 h-8 bg-purple-400 rounded-full animate-ping opacity-60"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-blue-400 rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-blue-600 rounded-full mt-2 animate-pulse"></div>
                </div>
            </div>
        </section>
    )
}