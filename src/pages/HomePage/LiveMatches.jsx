import React, { useState } from 'react';
import CountdownTimer from '../../components/CountdownTimer';

const LiveMatches = () => {
  const [activeStream, setActiveStream] = useState(0);

  const liveStreams = [
    {
      id: 1,
      title: "CS2 Major Championship",
      streamer: "ESL Gaming",
      viewers: "125.4K",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      videoId: "dQw4w9WgXcQ",
      category: "FPS",
      status: "LIVE"
    },
    {
      id: 2,
      title: "League of Legends Worlds",
      streamer: "Riot Games",
      viewers: "89.2K",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      videoId: "dQw4w9WgXcQ",
      category: "MOBA",
      status: "LIVE"
    },
    {
      id: 3,
      title: "Valorant Champions Tour",
      streamer: "Valorant Esports",
      viewers: "67.8K",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      videoId: "dQw4w9WgXcQ",
      category: "Tactical",
      status: "LIVE"
    }
  ];

  const upcomingMatches = [
    {
      id: 1,
      team1: { name: "Tokyo Eagle", logo: "/assets/images/live-match-player-1.png", score: 2 },
      team2: { name: "New York Hunter", logo: "/assets/images/live-match-player-2.png", score: 1 },
      game: "CS2",
      time: "15:30",
      status: "LIVE NOW",
      countdownDate: "2025-09-15T15:30:00"
    },
    {
      id: 2,
      team1: { name: "Dragon Force", logo: "/assets/images/live-match-player-1.png", score: 0 },
      team2: { name: "Phoenix Rising", logo: "/assets/images/live-match-player-2.png", score: 0 },
      game: "Valorant",
      time: "17:00",
      status: "UPCOMING",
      countdownDate: "2025-10-22T17:00:00"
    },
    {
      id: 3,
      team1: { name: "Shadow Wolves", logo: "/assets/images/live-match-player-1.png", score: 0 },
      team2: { name: "Thunder Cats", logo: "/assets/images/live-match-player-2.png", score: 0 },
      game: "League of Legends",
      time: "19:30",
      status: "UPCOMING",
      countdownDate: "2025-12-08T19:30:00"
    }
  ];

  return (
    <section className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-orange-500 dark:to-red-500 text-white px-6 py-2 rounded-full text-sm font-semibold mb-4">
            <span className="animate-pulse">🔴</span>
            LIVE NOW
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-gray-100 mb-4">
            WATCH LIVE <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-orange-500 dark:to-red-500 bg-clip-text text-transparent">MATCHES</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Experience the thrill of competitive gaming with live streams from top tournaments and players
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Live Stream Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
              {/* Stream Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-orange-500 dark:to-red-500 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                    <span className="text-white font-semibold text-lg">{liveStreams[activeStream].title}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/90 text-sm">
                    <span>👁️ {liveStreams[activeStream].viewers}</span>
                    <span>•</span>
                    <span>{liveStreams[activeStream].category}</span>
                  </div>
                </div>
              </div>

              {/* Video Player */}
              <div className="relative w-full h-0 pb-[56.25%] bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${liveStreams[activeStream].videoId}?autoplay=0&mute=1&rel=0&modestbranding=1`}
                  title={liveStreams[activeStream].title}
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              {/* Stream Info */}
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {liveStreams[activeStream].title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      by {liveStreams[activeStream].streamer}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      LIVE
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      {liveStreams[activeStream].viewers} watching
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stream Selection Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                🔴 Live Streams
              </h3>
              <div className="space-y-3">
                {liveStreams.map((stream, index) => (
                  <button
                    key={stream.id}
                    onClick={() => setActiveStream(index)}
                    className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                      activeStream === index
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-500 dark:border-orange-500'
                        : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🎮</span>
                        </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                          {stream.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-xs">
                          {stream.streamer} • {stream.category}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                          <span className="text-red-500 text-xs font-semibold">LIVE</span>
                          <span className="text-gray-500 dark:text-gray-400 text-xs">
                            {stream.viewers}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Matches Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              🏆 Upcoming Matches
            </h3>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-orange-500 dark:to-red-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingMatches.map((match) => (
              <div key={match.id} className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                {/* Match Header */}
                <div className="text-center mb-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    match.status === 'LIVE NOW' 
                      ? 'bg-red-500 text-white' 
                      : 'bg-blue-500 text-white'
                  }`}>
                    {match.status}
                  </span>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                    {match.game} • {match.time}
                  </p>
                </div>

                {/* Teams */}
                <div className="space-y-4">
                  {/* Team 1 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img 
                        src={match.team1.logo} 
                        alt={match.team1.name} 
                        className="w-12 h-12 object-contain"
                      />
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {match.team1.name}
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {match.team1.score}
                    </span>
                  </div>

                  {/* VS */}
                  <div className="text-center">
                    <span className="text-gray-400 dark:text-gray-500 font-bold">VS</span>
                  </div>

                  {/* Team 2 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img 
                        src={match.team2.logo} 
                        alt={match.team2.name} 
                        className="w-12 h-12 object-contain"
                      />
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {match.team2.name}
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {match.team2.score}
                    </span>
                  </div>
                </div>

                {/* Countdown Timer */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <CountdownTimer targetDate={match.countdownDate} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveMatches;
