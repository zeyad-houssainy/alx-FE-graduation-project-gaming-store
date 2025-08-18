import React from 'react';

// Dark Mode Dynamic Background
export const DarkDynamicBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Animated grid pattern */}
    <svg
      className="absolute inset-0 w-full h-full opacity-20"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id="darkGrid" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-blue-400">
            <animate attributeName="stroke-opacity" values="0.3;0.8;0.3" dur="4s" repeatCount="indefinite" />
          </path>
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#darkGrid)" />
    </svg>

    {/* Floating geometric shapes */}
    <div className="absolute top-1/4 left-1/4 w-32 h-32 opacity-30">
      <div className="w-full h-full border-2 border-blue-400 rotate-45 animate-spin" />
    </div>

    <div className="absolute top-3/4 right-1/4 w-24 h-24 opacity-40">
      <div className="w-full h-full border-2 border-purple-400 rounded-full animate-pulse" />
    </div>

    <div className="absolute bottom-1/4 left-1/2 w-16 h-16 opacity-50">
      <div className="w-full h-full border-2 border-orange-400 -rotate-45 animate-bounce" />
    </div>

    {/* Animated particles */}
    <div className="absolute inset-0">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-blue-400 rounded-full animate-ping"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 2}s`
          }}
        />
      ))}
    </div>

    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-blue-900/40 to-purple-900/60" />
  </div>
);

// Light Mode Dynamic Background
export const LightDynamicBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Animated wave pattern */}
    <svg
      className="absolute inset-0 w-full h-full opacity-30"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="lightGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3">
            <animate attributeName="stop-opacity" values="0.3;0.6;0.3" dur="8s" repeatCount="indefinite" />
          </stop>
          <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.3">
            <animate attributeName="stop-opacity" values="0.3;0.6;0.3" dur="8s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.3">
            <animate attributeName="stop-opacity" values="0.3;0.6;0.3" dur="8s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
      </defs>
      
      {/* Animated waves */}
      <path
        d="M0,50 Q25,40 50,50 T100,50 L100,100 L0,100 Z"
        fill="url(#lightGradient)"
        opacity="0.6"
      >
        <animate
          attributeName="d"
          values="M0,50 Q25,40 50,50 T100,50 L100,100 L0,100 Z;M0,50 Q25,60 50,50 T100,50 L100,100 L0,100 Z;M0,50 Q25,40 50,50 T100,50 L100,100 L0,100 Z"
          dur="10s"
          repeatCount="indefinite"
        />
      </path>
    </svg>

    {/* Floating bubbles */}
    <div className="absolute top-1/3 left-1/4 w-20 h-20 opacity-60">
      <div className="w-full h-full bg-gradient-to-br from-blue-200 to-blue-300 rounded-full animate-bounce" />
    </div>

    <div className="absolute top-2/3 right-1/3 w-16 h-16 opacity-50">
      <div className="w-full h-full bg-gradient-to-br from-purple-200 to-purple-300 rounded-full animate-pulse" />
    </div>

    <div className="absolute bottom-1/3 left-2/3 w-12 h-12 opacity-70">
      <div className="w-full h-full bg-gradient-to-br from-cyan-200 to-cyan-300 rounded-full animate-ping" />
    </div>

    {/* Animated stars */}
    <div className="absolute inset-0">
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-blue-300 rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${1 + Math.random() * 2}s`
          }}
        />
      ))}
    </div>

    {/* Subtle gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-white/40 to-purple-50/60" />
  </div>
);

// Gaming-themed dynamic background with particles
export const GamingDynamicBackground = ({ isDark = false }) => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Hexagonal grid pattern */}
    <svg
      className="absolute inset-0 w-full h-full opacity-20"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id="hexGrid" x="0" y="0" width="20" height="17.32" patternUnits="userSpaceOnUse">
          <polygon
            points="10,0 20,5.77 20,17.32 10,23.09 0,17.32 0,5.77"
            fill="none"
            stroke={isDark ? "#3B82F6" : "#1E40AF"}
            strokeWidth="0.5"
            opacity="0.6"
          >
            <animate attributeName="opacity" values="0.6;0.9;0.6" dur="8s" repeatCount="indefinite" />
          </polygon>
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#hexGrid)" />
    </svg>

    {/* Animated gaming elements */}
    <div className="absolute top-1/4 left-1/4 w-32 h-32 opacity-40">
      <div className="w-full h-full border-2 border-blue-400 rotate-45 animate-spin">
        <div className="absolute inset-2 border border-blue-300 rotate-45"></div>
      </div>
    </div>

    <div className="absolute top-3/4 right-1/4 w-24 h-24 opacity-50">
      <div className="w-full h-full border-2 border-purple-400 rounded-full animate-pulse">
        <div className="absolute inset-2 border border-purple-300 rounded-full"></div>
      </div>
    </div>

    {/* Energy particles */}
    <div className="absolute inset-0">
      {[...Array(25)].map((_, i) => (
        <div
          key={i}
          className={`absolute w-1 h-1 rounded-full animate-ping ${
            isDark ? 'bg-blue-400' : 'bg-blue-500'
          }`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${1.5 + Math.random() * 2}s`
          }}
        />
      ))}
    </div>

    {/* Circuit-like connections */}
    <svg
      className="absolute inset-0 w-full h-full opacity-30"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <path
        d="M20,20 L40,20 L40,40 L60,40 L60,60 L80,60"
        stroke={isDark ? "#3B82F6" : "#1E40AF"}
        strokeWidth="0.3"
        fill="none"
        opacity="0.6"
      >
        <animate
          attributeName="stroke-dasharray"
          values="0,100;100,0;0,100"
          dur="6s"
          repeatCount="indefinite"
        />
      </path>
    </svg>

    {/* Gradient overlay */}
    <div className={`absolute inset-0 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900/70 via-blue-900/30 to-purple-900/50'
        : 'bg-gradient-to-br from-blue-50/50 via-white/30 to-purple-50/50'
    }`} />
  </div>
);

export default {
  DarkDynamicBackground,
  LightDynamicBackground,
  GamingDynamicBackground
};
