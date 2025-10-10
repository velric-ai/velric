import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface HumanAIConnectionProps {
  width: number;
  height: number;
  text: string;
  className?: string;
}

export default function HumanAIConnection({ width, height, text, className = "" }: HumanAIConnectionProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [sparkles, setSparkles] = useState<Array<{id: number, x: number, y: number}>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsConnected(prev => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isConnected) {
      const newSparkles = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100
      }));
      setSparkles(newSparkles);
      
      const timeout = setTimeout(() => setSparkles([]), 2000);
      return () => clearTimeout(timeout);
    }
  }, [isConnected]);

  return (
    <div 
      className={`relative bg-gradient-to-br from-purple-900/20 to-blue-900/30 rounded-2xl overflow-hidden border border-purple-500/20 cursor-pointer ${className}`}
      style={{ width, height }}
      onMouseEnter={() => setIsConnected(true)}
      onMouseLeave={() => setIsConnected(false)}
    >
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(147, 51, 234, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(147, 51, 234, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />
      </div>

      {/* Sparkles */}
      {sparkles.map(sparkle => (
        <motion.div
          key={sparkle.id}
          className="absolute w-1 h-1 bg-purple-300 rounded-full"
          style={{ left: `${sparkle.x}%`, top: `${sparkle.y}%` }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, delay: sparkle.id * 0.1 }}
        />
      ))}

      {/* Human Hand */}
      <motion.div
        className="absolute left-8 top-1/2 transform -translate-y-1/2"
        animate={{
          x: isConnected ? 10 : 0,
          scale: isConnected ? 1.1 : 1
        }}
        transition={{ duration: 0.5 }}
      >
        <svg width="60" height="60" viewBox="0 0 100 100" className="text-purple-300">
          <motion.path
            d="M20 60 Q30 40 40 50 Q50 30 60 40 Q70 20 80 30 Q85 35 80 45 L75 55 Q70 65 60 70 L40 75 Q25 70 20 60 Z"
            fill="currentColor"
            stroke="rgba(147, 51, 234, 0.8)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2 }}
          />
          {/* Fingers */}
          <motion.circle cx="45" cy="45" r="3" fill="rgba(147, 51, 234, 0.6)" 
            animate={{ scale: isConnected ? [1, 1.3, 1] : 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.circle cx="55" cy="35" r="3" fill="rgba(147, 51, 234, 0.6)"
            animate={{ scale: isConnected ? [1, 1.3, 1] : 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          />
          <motion.circle cx="65" cy="25" r="3" fill="rgba(147, 51, 234, 0.6)"
            animate={{ scale: isConnected ? [1, 1.3, 1] : 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </svg>
      </motion.div>

      {/* AI Hand */}
      <motion.div
        className="absolute right-8 top-1/2 transform -translate-y-1/2"
        animate={{
          x: isConnected ? -10 : 0,
          scale: isConnected ? 1.1 : 1
        }}
        transition={{ duration: 0.5 }}
      >
        <svg width="60" height="60" viewBox="0 0 100 100" className="text-purple-400">
          {/* AI Hand with circuit patterns */}
          <motion.path
            d="M80 60 Q70 40 60 50 Q50 30 40 40 Q30 20 20 30 Q15 35 20 45 L25 55 Q30 65 40 70 L60 75 Q75 70 80 60 Z"
            fill="none"
            stroke="rgba(168, 85, 247, 0.8)"
            strokeWidth="2"
            strokeDasharray="5,5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
          />
          {/* Circuit nodes */}
          <motion.circle cx="55" cy="45" r="4" fill="rgba(168, 85, 247, 0.8)" 
            animate={{ 
              scale: isConnected ? [1, 1.5, 1] : 1,
              opacity: isConnected ? [0.8, 1, 0.8] : 0.8
            }}
            transition={{ duration: 0.5 }}
          />
          <motion.circle cx="45" cy="35" r="4" fill="rgba(168, 85, 247, 0.8)"
            animate={{ 
              scale: isConnected ? [1, 1.5, 1] : 1,
              opacity: isConnected ? [0.8, 1, 0.8] : 0.8
            }}
            transition={{ duration: 0.5, delay: 0.1 }}
          />
          <motion.circle cx="35" cy="25" r="4" fill="rgba(168, 85, 247, 0.8)"
            animate={{ 
              scale: isConnected ? [1, 1.5, 1] : 1,
              opacity: isConnected ? [0.8, 1, 0.8] : 0.8
            }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
          
          {/* Circuit lines */}
          <motion.line x1="55" y1="45" x2="45" y2="35" stroke="rgba(168, 85, 247, 0.6)" strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: isConnected ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
          <motion.line x1="45" y1="35" x2="35" y2="25" stroke="rgba(168, 85, 247, 0.6)" strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: isConnected ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          />
        </svg>
      </motion.div>

      {/* Connection Energy */}
      {isConnected && (
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
        >
          <motion.div
            className="w-8 h-8 bg-purple-400 rounded-full blur-sm"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-0 w-8 h-8 border-2 border-purple-300 rounded-full"
            animate={{
              scale: [1, 2, 1],
              opacity: [0.8, 0, 0.8]
            }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </motion.div>
      )}

      {/* Energy Lines */}
      {isConnected && (
        <svg className="absolute inset-0 w-full h-full">
          <motion.line
            x1="30%" y1="50%" x2="70%" y2="50%"
            stroke="rgba(147, 51, 234, 0.8)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.line
            x1="35%" y1="45%" x2="65%" y2="55%"
            stroke="rgba(168, 85, 247, 0.6)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          />
          <motion.line
            x1="35%" y1="55%" x2="65%" y2="45%"
            stroke="rgba(168, 85, 247, 0.6)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </svg>
      )}

      {/* Text Label */}
      <motion.div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <span className="text-xs text-purple-300 bg-black/50 px-3 py-1 rounded-full">
          {text}
        </span>
      </motion.div>

      {/* Hover Instruction */}
      <motion.div
        className="absolute top-4 right-4 text-xs text-purple-400/60"
        animate={{ opacity: isConnected ? 0 : [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Hover to connect
      </motion.div>
    </div>
  );
}