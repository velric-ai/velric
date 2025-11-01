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

// --- Configuration for Velric Values - RESPONSIVE SIZES ---
const createValuesConfig = (innerRadius: number, outerRadius: number, cardSize: number): ValueConfig[] => [
  // Inner Orbit (Cyan glow)
  {
    id: 'proof',
    number: 1,
    title: 'Proof Over Promises',
    subtitle: 'Show it. Don\'t say it.',
    orbitRadius: innerRadius,
    size: cardSize,
    speed: 0.8,
    phaseShift: 0,
    glowColor: 'cyan'
  },
  {
    id: 'merit',
    number: 2,
    title: 'Merit Over Background',
    subtitle: 'Earn it. Don\'t inherit it.',
    orbitRadius: innerRadius,
    size: cardSize,
    speed: 0.8,
    phaseShift: (2 * Math.PI) / 3,
    glowColor: 'cyan'
  },
  {
    id: 'data',
    number: 3,
    title: 'Data Over Opinion',
    subtitle: 'Evidence speaks louder.',
    orbitRadius: innerRadius,
    size: cardSize,
    speed: 0.8,
    phaseShift: (4 * Math.PI) / 3,
    glowColor: 'cyan'
  },
  // Outer Orbit (Purple glow) - rotating opposite direction
  {
    id: 'execution',
    number: 4,
    title: 'Execution Defines Talent',
    subtitle: 'Doers win. Talkers fade.',
    orbitRadius: outerRadius,
    size: cardSize,
    speed: -0.6,
    phaseShift: 0,
    glowColor: 'purple'
  },
  {
    id: 'global',
    number: 5,
    title: 'One Global Standard',
    subtitle: 'Talent measured equally.',
    orbitRadius: outerRadius,
    size: cardSize,
    speed: -0.6,
    phaseShift: (2 * Math.PI) / 3,
    glowColor: 'purple'
  },
  {
    id: 'builders',
    number: 6,
    title: 'Built for Builders',
    subtitle: 'Ambition is our language.',
    orbitRadius: outerRadius,
    size: cardSize,
    speed: -0.6,
    phaseShift: (4 * Math.PI) / 3,
    glowColor: 'purple'
  }
];

// --- Memoized Orbiting Value Component ---
const OrbitingValue = memo(({ config, angle, isMobile, isTablet }: OrbitingValueProps & { isMobile: boolean; isTablet: boolean }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { orbitRadius, size, number, title, subtitle, glowColor } = config;

  const x = Math.cos(angle) * orbitRadius;
  const y = Math.sin(angle) * orbitRadius;

  const glowColorMap = {
    cyan: '#06B6D4',
    purple: '#9333EA'
  };

  const glowColor_ = glowColorMap[glowColor];

  // Responsive text sizes
  const getTitleSize = () => {
    if (isMobile) return 'text-xs';
    if (isTablet) return 'text-sm';
    return 'text-base';
  };

  const getSubtitleSize = () => {
    if (isMobile) return 'text-xs';
    if (isTablet) return 'text-xs';
    return 'text-sm';
  };

  const getPadding = () => {
    if (isMobile) return 'p-2';
    if (isTablet) return 'p-3';
    return 'p-5';
  };

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
          relative w-full h-full ${getPadding()} bg-gray-900/70 backdrop-blur-md
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
        {/* Value Number Badge */}
        <div
          className={`${isMobile ? 'text-xs' : 'text-sm'} font-bold mb-1 px-2 py-0.5 rounded-full`}
          style={{
            color: glowColor_,
            backgroundColor: `${glowColor_}15`,
            border: `1px solid ${glowColor_}30`,
          }}
        >
          #{number}
        </div>

        {/* Value Title and Subtitle */}
        <div className="text-center">
          <h3 className={`${getTitleSize()} font-bold text-white leading-tight mb-1 px-1`}>
            {title}
          </h3>
          <p className={`${getSubtitleSize()} text-gray-300 px-1 leading-snug`}>
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

  useEffect(() => {
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
  }, []);





  // Use window width directly for more reliable responsive behavior
  const [windowWidth, setWindowWidth] = useState(1024); // Default to desktop

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  // Calculate responsive values based on window width
  const isCurrentlyMobile = windowWidth < 768;
  const isCurrentlyTablet = windowWidth >= 768 && windowWidth < 1024;

  // Responsive orbit sizes
  const getOrbitRadii = () => {
    if (isCurrentlyMobile) return { inner: 100, outer: 160 };
    if (isCurrentlyTablet) return { inner: 140, outer: 220 };
    return { inner: 200, outer: 320 };
  };

  const { inner, outer } = getOrbitRadii();
  
  const orbitConfigs: Array<{ radius: number; glowColor: GlowColor; delay: number }> = [
    { radius: inner, glowColor: 'cyan', delay: 0 },
    { radius: outer, glowColor: 'purple', delay: 1.5 }
  ];

  // Get responsive card size
  const getCardSize = () => {
    if (isCurrentlyMobile) return 110;
    if (isCurrentlyTablet) return 130;
    return 160;
  };

  // Get responsive container size
  const getContainerSize = () => {
    if (isCurrentlyMobile) return Math.max(350, Math.min(400, windowWidth - 40));
    if (isCurrentlyTablet) return 550;
    return 750;
  };

  // Get responsive center icon size
  const getCenterIconSize = () => {
    if (isCurrentlyMobile) return { container: 'w-16 h-16', icon: 32 };
    if (isCurrentlyTablet) return { container: 'w-20 h-20', icon: 40 };
    return { container: 'w-28 h-28', icon: 56 };
  };

  const cardSize = getCardSize();
  const containerSize = getContainerSize();
  const centerIcon = getCenterIconSize();
  const valuesConfig = createValuesConfig(inner, outer, cardSize);



  return (
    <div className="w-full flex items-center justify-center overflow-visible py-8 md:py-0 px-4 md:px-0 min-h-[400px] md:min-h-[600px]">
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
        className="relative flex items-center justify-center"
        style={{
          width: `${containerSize}px`,
          height: `${containerSize}px`,
          maxWidth: '95vw',
          aspectRatio: '1',
        }}
      >
        {/* Central "V" Icon with enhanced glow */}
        <div className={`${centerIcon.container} bg-gradient-to-br from-purple-900/50 to-cyan-900/30 rounded-full flex items-center justify-center z-10 relative shadow-2xl border border-purple-500/30`}>
          <div className="absolute inset-0 rounded-full bg-cyan-500/30 blur-xl animate-pulse"></div>
          <div className="absolute inset-0 rounded-full bg-purple-500/30 blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="relative z-10">
            <svg xmlns="http://www.w3.org/2000/svg" width={centerIcon.icon} height={centerIcon.icon} viewBox="0 0 24 24" fill="none" stroke="url(#valuesGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              isMobile={isCurrentlyMobile}
              isTablet={isCurrentlyTablet}
            />
          );
        })}
      </div>
    </div>
  );
}