export default function Hero() {
    return(
            <div className="max-w-4xl mx-auto">
            <p className="text-[#ECB808] text-xl font-bold uppercase mb-4 tracking-wider">
              Ultimate Gaming Experience
            </p>
            <h1 className="text-6xl md:text-8xl font-['Oxanium'] font-black text-white leading-none mb-6 tracking-tight">
              Welcome to <span className="text-[#ECB808]">Gamics</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
              Discover the latest games, join epic battles, and connect with fellow gamers worldwide. 
              Your ultimate destination for gaming excellence starts here.
            </p>
            <button className="relative bg-[#ECB808] text-black px-8 py-4 font-bold uppercase text-sm tracking-wider hover:bg-[#d4a507] transition-all duration-300 transform hover:scale-105">
              <span className="relative z-10">Start Gaming</span>
            </button>
    )
}