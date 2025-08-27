import Button from '../components/Button';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { useNavigate } from 'react-router-dom';

export default function AboutUs() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-32 sm:pt-36">
        {/* Back to Home Button */}
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-orange-400 transition-colors duration-200 group"
          >
            <svg 
              className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Go Home</span>
          </button>
        </div>

        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Page Header */}
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-bold mb-4 sm:mb-6 text-gray-900 dark:text-gray-100">
              ABOUT <span className="text-blue-600 dark:text-orange-400">GAMING STORE</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              We're passionate about gaming and committed to providing the best digital gaming experience for players worldwide.
              Our journey began with a simple vision: to create a platform where gamers could discover, purchase, and enjoy
              their favorite games with unparalleled ease and convenience.
            </p>

            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Founded in 2024, GAMING STORE was born from a simple belief: every gamer deserves access to the best titles,
              regardless of their location or budget. We started as a small team of passionate gamers who wanted to
              revolutionize how people discover and purchase games.
            </p>

            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Today, GAMING STORE stands as a testament to our commitment to the gaming community. We're not just selling
              games; we're building a community where gamers can connect, share experiences, and discover new adventures together.
              Our platform is designed to be more than just a store – it's your gateway to the world of gaming.
            </p>
          </div>

          {/* Our Story */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-bold mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                  <p>
                    Founded in 2024, GAMING STORE was born from a simple belief: every gamer deserves access to the best titles, 
                    regardless of their location or budget. We started as a small team of passionate gamers who wanted to
                    revolutionize how people discover and purchase games.
                  </p>
                  <p>
                    Our team consists of dedicated gamers, developers, and industry professionals who understand what makes 
                    gaming special. We believe in the power of games to bring people together, inspire creativity, and 
                    provide endless hours of entertainment.
                  </p>
                  <p>
                    Today, GAMING STORE stands as a testament to our commitment to the gaming community. We're not just selling 
                    games; we're building a platform where gamers can discover, connect, and celebrate their shared passion.
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-xl p-8 text-center">
                  <div className="text-6xl mb-4">🎮</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Gaming Since 2024</h3>
                  <p className="text-gray-600 dark:text-gray-300">Building the future of digital gaming</p>
                </div>
              </div>
            </div>
          </div>

          {/* Our Mission & Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-bold mb-4">Our Mission</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                To democratize gaming by providing seamless access to the world's best digital games, 
                fostering a vibrant community, and supporting developers in creating amazing experiences.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-bold mb-4">Our Values</h3>
              <ul className="text-gray-700 dark:text-gray-300 space-y-2">
                <li>• <strong>Quality:</strong> Only the best games make it to our platform</li>
                <li>• <strong>Community:</strong> Gamers first, always</li>
                <li>• <strong>Innovation:</strong> Pushing the boundaries of digital gaming</li>
                <li>• <strong>Accessibility:</strong> Gaming for everyone, everywhere</li>
              </ul>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-16">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-orange-400 mb-2">1000+</div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Games Available</div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mb-2">50K+</div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Happy Gamers</div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400 mb-2">24/7</div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Support Available</div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">99.9%</div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Uptime</div>
            </div>
          </div>

          {/* Team */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-bold mb-8 text-center">
              Meet Our Team
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-500 dark:from-orange-400 dark:to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  👨‍💻
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">John Doe</h3>
                <p className="text-blue-600 dark:text-orange-400 font-medium mb-2">Founder & CEO</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Gaming enthusiast and tech visionary leading GAMING STORE into the future of digital gaming.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  GD
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Game Development</h3>
                <p className="text-green-600 dark:text-green-400 font-medium mb-2">Development Team</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Expert developers crafting the best gaming platform experience for our users.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  CS
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Customer Success</h3>
                <p className="text-purple-600 dark:text-purple-400 font-medium mb-2">Support Team</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Dedicated support specialists ensuring every gamer has an amazing experience.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-bold mb-8 text-center">
              Get in Touch
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Contact Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-blue-600 dark:text-orange-400 text-xl">📍</span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Address</p>
                      <p className="text-gray-600 dark:text-gray-300">123 Gaming Street, Digital City</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className="text-green-600 dark:text-green-400 text-xl">📞</span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Phone</p>
                      <p className="text-gray-600 dark:text-gray-300">+24 1245 654 235</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className="text-red-500 dark:text-red-400 text-xl">📧</span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Email</p>
                      <p className="text-gray-600 dark:text-gray-300">info@gamingstore.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className="text-purple-600 dark:text-purple-400 text-xl">🌐</span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Website</p>
                      <p className="text-gray-600 dark:text-gray-300">www.gamingstore.com</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Business Hours</h3>
                <div className="space-y-2 text-gray-600 dark:text-gray-300">
                  <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM</p>
                  <p><strong>Saturday:</strong> 10:00 AM - 4:00 PM</p>
                  <p><strong>Sunday:</strong> Closed</p>
                  <p><strong>Support:</strong> 24/7 Available</p>
                </div>
                
                <div className="mt-6">
                  <Button 
                    onClick={() => window.location.href = 'mailto:info@gamingstore.com'}
                    className="w-full"
                  >
                    Send us a Message
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
