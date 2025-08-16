import './App.css'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import OurServices from './components/OurServices'

function App() {

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-['Poppins'] relative">
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
                <button className="group relative bg-blue-600 text-white font-bold px-8 py-4 rounded-lg uppercase tracking-wider hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  <span className="relative z-10">Explore Games</span>
                </button>
                <button className="group relative border-2 border-blue-600 text-blue-600 font-bold px-8 py-4 rounded-lg uppercase tracking-wider hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg">
                  <span className="relative z-10">Join Community</span>
                </button>
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

        {/* Featured Content Section */}
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
              <div className="group bg-white p-8 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
                <div className="text-blue-600 text-4xl mb-4">🎮</div>
                <h3 className="text-xl font-bold mb-4 font-['Oxanium'] text-gray-900">Latest Games</h3>
                <p className="text-gray-600 leading-relaxed">
                  Discover the newest and most exciting games in our ever-expanding collection.
                </p>
              </div>
              
              <div className="group bg-white p-8 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
                <div className="text-blue-600 text-4xl mb-4">🏆</div>
                <h3 className="text-xl font-bold mb-4 font-['Oxanium'] text-gray-900">Tournaments</h3>
                <p className="text-gray-600 leading-relaxed">
                  Compete with players worldwide in epic tournaments and live matches.
                </p>
              </div>
              
              <div className="group bg-white p-8 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
                <div className="text-blue-600 text-4xl mb-4">🛒</div>
                <h3 className="text-xl font-bold mb-4 font-['Oxanium'] text-gray-900">Gaming Store</h3>
                <p className="text-gray-600 leading-relaxed">
                  Shop for gaming accessories, merchandise, and exclusive collectibles.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default App
