"use client"
import React, { useEffect, useState, memo } from 'react';

// --- Type Definitions ---
type GlowColor = 'cyan' | 'purple';

interface ValueConfig {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  orbitRadius: number;
  size: number;
  speed: number;
  phaseShift: number;
  glowColor: GlowColor;
}

interface OrbitingValueProps {
  config: ValueConfig;
  angle: number;
}

interface GlowingOrbitPathProps {
  radius: number;
  glowColor?: GlowColor;
  animationDelay?: number;
}

// --- Configuration for Velric Values - INCREASED SIZES ---
const valuesConfig: ValueConfig[] = [
  // Inner Orbit (Cyan glow) - SIZE INCREASED FROM 100 TO 160
  {
    id: 'proof',
    number: 1,
    title: 'Proof Over Promises',
    subtitle: 'Show it. Don\'t say it.',
    orbitRadius: 200, // INCREASED FROM 120 TO 200
    size: 160, // INCREASED FROM 100 TO 160
    speed: 0.8,
    phaseShift: 0,
    glowColor: 'cyan'
  },
  {
    id: 'merit',
    number: 2,
    title: 'Merit Over Background',
    subtitle: 'Earn it. Don\'t inherit it.',
    orbitRadius: 200, // INCREASED FROM 120 TO 200
    size: 160, // INCREASED FROM 100 TO 160
    speed: 0.8,
    phaseShift: (2 * Math.PI) / 3,
    glowColor: 'cyan'
  },
  {
    id: 'data',
    number: 3,
    title: 'Data Over Opinion',
    subtitle: 'Evidence speaks louder.',
    orbitRadius: 200, // INCREASED FROM 120 TO 200
    size: 160, // INCREASED FROM 100 TO 160
    speed: 0.8,
    phaseShift: (4 * Math.PI) / 3,
    glowColor: 'cyan'
  },
  // Outer Orbit (Purple glow) - rotating opposite direction - SIZE INCREASED FROM 100 TO 160
  {
    id: 'execution',
    number: 4,
    title: 'Execution Defines Talent',
    subtitle: 'Doers win. Talkers fade.',
    orbitRadius: 320, // INCREASED FROM 200 TO 320
    size: 160, // INCREASED FROM 100 TO 160
    speed: -0.6,
    phaseShift: 0,
    glowColor: 'purple'
  },
  {
    id: 'global',
    number: 5,
    title: 'One Global Standard',
    subtitle: 'Talent measured equally.',
    orbitRadius: 320, // INCREASED FROM 200 TO 320
    size: 160, // INCREASED FROM 100 TO 160
    speed: -0.6,
    phaseShift: (2 * Math.PI) / 3,
    glowColor: 'purple'
  },
  {
    id: 'builders',
    number: 6,
    title: 'Built for Builders',
    subtitle: 'Ambition is our language.',
    orbitRadius: 320, // INCREASED FROM 200 TO 320
    size: 160, // INCREASED FROM 100 TO 160
    speed: -0.6,
    phaseShift: (4 * Math.PI) / 3,
    glowColor: 'purple'
  }
];

// --- Memoized Orbiting Value Component ---
const OrbitingValue = memo(({ config, angle }: OrbitingValueProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { orbitRadius, size, number, title, subtitle, glowColor } = config;

  const x = Math.cos(angle) * orbitRadius;
  const y = Math.sin(angle) * orbitRadius;

  const glowColorMap = {
    cyan: '#06B6D4',
    purple: '#9333EA'
  };

  const glowColor_ = glowColorMap[glowColor];

  return (
    <div
      className="absolute top-1/2 left-1/2 transition-all duration-300 ease-out"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))`,
        zIndex: isHovered ? 20 : 10,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`
          relative w-full h-full p-5 bg-gray-900/70 backdrop-blur-md
          rounded-full flex flex-col items-center justify-center
          transition-all duration-300 cursor-pointer border border-gray-700/50
          ${isHovered ? 'scale-110 shadow-2xl' : 'shadow-lg hover:shadow-xl'}
        `}
        style={{
          boxShadow: isHovered
            ? `0 0 30px ${glowColor_}40, 0 0 60px ${glowColor_}20, inset 0 0 30px ${glowColor_}10`
            : `0 0 15px ${glowColor_}20`,
        }}
      >
        {/* Value Number Badge - SLIGHTLY LARGER */}
        <div
          className="text-sm font-bold mb-2 px-2.5 py-1 rounded-full"
          style={{
            color: glowColor_,
            backgroundColor: `${glowColor_}15`,
            border: `1px solid ${glowColor_}30`,
          }}
        >
          #{number}
        </div>

        {/* Value Title - LARGER TEXT */}
        <div className="text-center">
          <h3 className="text-base font-bold text-white leading-tight mb-1.5 px-2">
            {title}
          </h3>
          {/* Value Subtitle - LARGER TEXT */}
          <p className="text-sm text-gray-300 px-2 leading-snug">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
});
OrbitingValue.displayName = 'OrbitingValue';

// --- Optimized Orbit Path Component ---
const GlowingOrbitPath = memo(({ radius, glowColor = 'cyan', animationDelay = 0 }: GlowingOrbitPathProps) => {
  const glowColors = {
    cyan: {
      primary: 'rgba(6, 182, 212, 0.4)',
      secondary: 'rgba(6, 182, 212, 0.2)',
      border: 'rgba(6, 182, 212, 0.3)'
    },
    purple: {
      primary: 'rgba(147, 51, 234, 0.4)',
      secondary: 'rgba(147, 51, 234, 0.2)',
      border: 'rgba(147, 51, 234, 0.3)'
    }
  };

  const colors = glowColors[glowColor] || glowColors.cyan;

  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
      style={{
        width: `${radius * 2}px`,
        height: `${radius * 2}px`,
        animationDelay: `${animationDelay}s`,
      }}
    >
      {/* Glowing background */}
      <div
        className="absolute inset-0 rounded-full animate-pulse"
        style={{
          background: `radial-gradient(circle, transparent 30%, ${colors.secondary} 70%, ${colors.primary} 100%)`,
          boxShadow: `0 0 60px ${colors.primary}, inset 0 0 60px ${colors.secondary}`,
          animation: 'pulse 4s ease-in-out infinite',
          animationDelay: `${animationDelay}s`,
        }}
      />

      {/* Static ring for depth */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: `1px solid ${colors.border}`,
          boxShadow: `inset 0 0 20px ${colors.secondary}`,
        }}
      />
    </div>
  );
});
GlowingOrbitPath.displayName = 'GlowingOrbitPath';

// --- Main Orbiting Values Component ---
export default function OrbitingValues() {
  const [time, setTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      setTime(prevTime => prevTime + deltaTime);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused]);

  // INCREASED ORBIT SIZES - FROM 120/200 TO 200/320
  const orbitConfigs: Array<{ radius: number; glowColor: GlowColor; delay: number }> = [
    { radius: 200, glowColor: 'cyan', delay: 0 }, // INCREASED FROM 120
    { radius: 320, glowColor: 'purple', delay: 1.5 } // INCREASED FROM 200
  ];

  return (
    <div className="w-full flex items-center justify-center overflow-hidden py-12">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #374151 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, #4B5563 0%, transparent 50%)`,
          }}
        />
      </div>

      <div 
        className="relative w-[calc(100vw-40px)] h-[calc(100vw-40px)] md:w-[750px] md:h-[750px] flex items-center justify-center"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        
        {/* Central "V" Icon with enhanced glow - SLIGHTLY LARGER */}
        <div className="w-28 h-28 bg-gradient-to-br from-purple-900/50 to-cyan-900/30 rounded-full flex items-center justify-center z-10 relative shadow-2xl border border-purple-500/30">
          <div className="absolute inset-0 rounded-full bg-cyan-500/30 blur-xl animate-pulse"></div>
          <div className="absolute inset-0 rounded-full bg-purple-500/30 blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="relative z-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="url(#valuesGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <defs>
                <linearGradient id="valuesGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06B6D4" />
                  <stop offset="100%" stopColor="#9333EA" />
                </linearGradient>
              </defs>
              <polyline points="2 4 12 20 22 4"></polyline>
            </svg>
          </div>
        </div>

        {/* Render glowing orbit paths */}
        {orbitConfigs.map((config) => (
          <GlowingOrbitPath
            key={`path-${config.radius}`}
            radius={config.radius}
            glowColor={config.glowColor}
            animationDelay={config.delay}
          />
        ))}

        {/* Render orbiting value cards */}
        {valuesConfig.map((config) => {
          const angle = time * config.speed + (config.phaseShift || 0);
          return (
            <OrbitingValue
              key={config.id}
              config={config}
              angle={angle}
            />
          );
        })}
      </div>
    </div>
  );
}