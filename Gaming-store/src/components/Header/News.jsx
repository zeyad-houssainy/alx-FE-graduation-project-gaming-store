// src/components/News.jsx
export default function News() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#2b282c] via-[#1a1621] to-[#2b282c] text-sm text-gray-300 px-6 py-3 border-b border-yellow-500/10">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent transform -skew-x-12"></div>
      </div>
      
      <div className="flex justify-between items-center relative z-10">
        <div className="flex items-center font-medium">
          <span className="text-yellow-500 animate-pulse mr-2">🔥</span>
          Exclusive Black Friday! Offer{" "}
          <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-black px-3 py-1 mx-2 rounded transform -skew-x-6 shadow-lg shadow-yellow-500/30 font-['Oxanium']">
            10
          </span>{" "}
          Days
          <span className="ml-2 text-yellow-500 animate-bounce">⚡</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-xs uppercase tracking-wider">Follow us on:</span>
          <div className="flex gap-3">
            {[
              { icon: "fab fa-facebook", href: "#" },
              { icon: "fab fa-twitter", href: "#" },
              { icon: "fab fa-instagram", href: "#" },
              { icon: "fab fa-discord", href: "#" }
            ].map((social, index) => (
              <a
                key={index}
                href={social.href}
                className="group relative w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-yellow-500 text-gray-400 hover:text-black rounded transition-all duration-300 transform hover:scale-110 hover:rotate-12"
              >
                <i className={`${social.icon} text-xs`}></i>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-yellow-500/20 rounded scale-0 group-hover:scale-150 transition-transform duration-300 -z-10"></div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
