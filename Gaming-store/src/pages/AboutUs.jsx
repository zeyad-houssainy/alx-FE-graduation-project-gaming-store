import Button from '../components/Button';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black font-['Oxanium'] mb-6 text-gray-900">
            ABOUT <span className="text-blue-600">GAMIZ</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            We're passionate about gaming and committed to providing the best digital gaming experience for players worldwide.
          </p>
        </div>

        {/* Our Story */}
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 font-['Oxanium'] mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Founded in 2024, Gamiz was born from a simple belief: every gamer deserves access to the best titles, 
                  regardless of their platform or location. What started as a small passion project has grown into a 
                  comprehensive gaming marketplace serving millions of players worldwide.
                </p>
                <p>
                  Our team consists of dedicated gamers, developers, and industry professionals who understand what makes 
                  gaming special. We believe in the power of games to bring people together, inspire creativity, and 
                  provide endless hours of entertainment.
                </p>
                <p>
                  Today, Gamiz stands as a testament to our commitment to the gaming community. We're not just selling 
                  games; we're building a platform where gamers can discover, connect, and celebrate their shared passion.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl p-8 text-center">
                <div className="text-6xl mb-4">🎮</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Gaming Since 2024</h3>
                <p className="text-gray-600">Building the future of digital gaming</p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Mission & Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-gray-900 font-['Oxanium'] mb-4">Our Mission</h3>
            <p className="text-gray-700 leading-relaxed">
              To democratize gaming by providing seamless access to the world's best digital games, 
              fostering a vibrant community, and supporting developers in creating amazing experiences.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
            <div className="text-4xl mb-4">💎</div>
            <h3 className="text-2xl font-bold text-gray-900 font-['Oxanium'] mb-4">Our Values</h3>
            <ul className="text-gray-700 space-y-2">
              <li>• <strong>Quality:</strong> Only the best games make it to our platform</li>
              <li>• <strong>Community:</strong> Gamers first, always</li>
              <li>• <strong>Innovation:</strong> Pushing the boundaries of digital gaming</li>
              <li>• <strong>Accessibility:</strong> Gaming for everyone, everywhere</li>
            </ul>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
            <div className="text-gray-600">Games Available</div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">50K+</div>
            <div className="text-gray-600">Happy Gamers</div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">24/7</div>
            <div className="text-gray-600">Support Available</div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">99.9%</div>
            <div className="text-gray-600">Uptime</div>
          </div>
        </div>

        {/* Team */}
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 font-['Oxanium'] mb-8 text-center">
            Meet Our Team
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                ZA
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Zeyad Alhoussainy</h3>
              <p className="text-blue-600 font-medium mb-2">Founder & CEO</p>
              <p className="text-gray-600 text-sm">
                Gaming enthusiast and tech visionary leading Gamiz into the future of digital gaming.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                GD
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Game Development</h3>
              <p className="text-green-600 font-medium mb-2">Development Team</p>
              <p className="text-gray-600 text-sm">
                Expert developers crafting the best gaming platform experience for our users.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                CS
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Customer Success</h3>
              <p className="text-purple-600 font-medium mb-2">Support Team</p>
              <p className="text-gray-600 text-sm">
                Dedicated support specialists ensuring every gamer has an amazing experience.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 font-['Oxanium'] mb-8 text-center">
            Get in Touch
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Details</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="text-blue-600 text-xl">📍</span>
                  <div>
                    <p className="font-medium text-gray-900">Address</p>
                    <p className="text-gray-600">PO Box W75 Street Ian West, New Queens</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-green-600 text-xl">📞</span>
                  <div>
                    <p className="font-medium text-gray-900">Phone</p>
                    <p className="text-gray-600">+24 1245 654 235</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-red-500 text-xl">📧</span>
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-gray-600">info@gamiz.com</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-purple-600 text-xl">🌐</span>
                  <div>
                    <p className="font-medium text-gray-900">Website</p>
                    <p className="text-gray-600">www.gamiz.com</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Business Hours</h3>
              <div className="space-y-2 text-gray-600">
                <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM</p>
                <p><strong>Saturday:</strong> 10:00 AM - 4:00 PM</p>
                <p><strong>Sunday:</strong> Closed</p>
                <p><strong>Support:</strong> 24/7 Available</p>
              </div>
              
              <div className="mt-6">
                <Button 
                  onClick={() => window.location.href = 'mailto:info@gamiz.com'}
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
  );
}
