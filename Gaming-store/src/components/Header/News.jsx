// src/components/News.jsx
export default function News() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 via-white to-blue-50 text-sm text-gray-600 px-6 py-3 border-b border-gray-100">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-blue-600/10 to-transparent transform -skew-x-12"></div>
      </div>
      
      <div className="flex justify-between items-center relative z-10">
        <div className="flex items-center font-medium">
          <span className="text-blue-600 animate-pulse mr-2">🔥</span>
          Exclusive Black Friday! Offer{" "}
          <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-black px-3 py-1 mx-2 rounded transform -skew-x-6 shadow-lg shadow-blue-600/30 font-['Oxanium']">
            10
          </span>{" "}
          Days
          <span className="ml-2 text-blue-600 animate-bounce">⚡</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-gray-500 text-xs uppercase tracking-wider">Follow us on:</span>
          <div className="flex gap-3">
            {[
              { icon: "fab fa-facebook", href: "#", color: "bg-blue-600 hover:bg-blue-700" },
              { icon: "fab fa-twitter", href: "#", color: "bg-sky-500 hover:bg-sky-600" },
              { icon: "fab fa-instagram", href: "#", color: "bg-pink-500 hover:bg-pink-600" },
              { icon: "fab fa-discord", href: "#", color: "bg-indigo-600 hover:bg-indigo-700" }
            ].map((social, index) => (
              <a
                key={index}
                href={social.href}
                className={`group relative w-8 h-8 flex items-center justify-center ${social.color} text-white rounded-lg transition-all duration-300 transform hover:scale-110 shadow-sm hover:shadow-md`}
              >
                <i className={`${social.icon} text-xs`}></i>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
