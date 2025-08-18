import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import OurServices from './OurServices';
import FeaturedGames from './FeaturedGames';
import Features from './Features';
import LiveMatches from './LiveMatches';
import Articles from './Articles';

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-blue-300 rotate-45"></div>
            <div className="absolute top-3/4 right-1/4 w-24 h-24 border border-indigo-300 rotate-12"></div>
            <div className="absolute bottom-1/4 left-1/2 w-16 h-16 border border-blue-300 -rotate-45"></div>
          </div>
          
          <div className="container mx-auto px-6 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <p className="text-blue-600 font-bold text-xl uppercase tracking-wider mb-4 font-['Oxanium']">
                Ultimate Gaming Experience
              </p>
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 font-['Oxanium'] leading-none text-gray-900">
                Welcome to <span className="text-blue-600">Gamiz</span>
              </h1>
              <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
                Discover the ultimate destination for gaming excellence. Join epic battles, 
                explore new worlds, and connect with fellow gamers worldwide.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a href="/games" className="group relative bg-blue-600 text-white font-bold px-8 py-4 rounded-lg uppercase tracking-wider hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  <span className="relative z-10">Explore Games</span>
                </a>
                <a href="/about" className="group relative overflow-hidden bg-transparent border-2 border-blue-600 text-blue-600 font-bold px-8 py-4 rounded-lg uppercase tracking-wider transition-all duration-300 hover:text-white hover:shadow-lg">
                  <span className="absolute inset-0 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  <span className="relative z-10">About Us</span>
                </a>
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

        {/* Our Services Section */}
        <OurServices />

        {/* Featured Games Section */}
        <FeaturedGames />

        {/* Live Matches Section */}
        <LiveMatches />

        {/* Features Section */}
        <Features />

        {/* Articles Section */}
        <Articles />
      </main>
      <Footer />
    </>
  );
}
