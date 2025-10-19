import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface ConnectionAnimationProps {
  className?: string;
}

export default function ConnectionAnimation({ className = "" }: ConnectionAnimationProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div className="w-full h-48 flex items-center justify-center">
        
        {/* Left Side - People Icon */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: -30, scale: 0.8 }}
          animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-400 rounded-full flex items-center justify-center relative">
            {/* Pulsing Glow */}
            <motion.div
              className="absolute inset-0 bg-green-400/30 rounded-full"
              animate={isInView ? { 
                scale: [1, 1.4, 1],
                opacity: [0.3, 0.1, 0.3]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            {/* People Icon */}
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
            </svg>
          </div>
          
          {/* Talent Label */}
          <motion.div
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-green-400 font-medium whitespace-nowrap"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Talent
          </motion.div>
        </motion.div>

        {/* Center Connection - V-Shape Connector */}
        <div className="flex-1 relative mx-8">
          <svg className="w-full h-16" viewBox="0 0 200 64" preserveAspectRatio="none">
            {/* Connection Lines */}
            <motion.path
              d="M 0 32 L 100 16 L 200 32"
              stroke="url(#connectionGradient)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: 1.5, delay: 1.0, ease: "easeInOut" }}
            />
            
            <motion.path
              d="M 0 32 L 100 48 L 200 32"
              stroke="url(#connectionGradient)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: 1.5, delay: 1.2, ease: "easeInOut" }}
            />
            
            {/* Gradient Definition */}
            <defs>
              <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22C55E" />
                <stop offset="50%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Flowing Particles */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400 rounded-full"
              style={{
                top: "50%",
                left: "0%",
              }}
              animate={isInView ? {
                x: [0, 200],
                y: [0, i % 2 === 0 ? -16 : 16, 0],
                opacity: [0, 1, 0]
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 1.5 + i * 0.4,
                ease: "easeInOut"
              }}
            />
          ))}
          
          {/* Center Node */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { 
              scale: [0, 1.2, 1],
              opacity: 1
            } : {}}
            transition={{ duration: 0.6, delay: 1.8 }}
          />
        </div>

        {/* Right Side - Company Icon */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 30, scale: 0.8 }}
          animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-400 rounded-full flex items-center justify-center relative">
            {/* Pulsing Glow */}
            <motion.div
              className="absolute inset-0 bg-purple-400/30 rounded-full"
              animate={isInView ? { 
                scale: [1, 1.4, 1],
                opacity: [0.3, 0.1, 0.3]
              } : {}}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
            
            {/* Company Icon */}
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd"/>
            </svg>
          </div>
          
          {/* Companies Label */}
          <motion.div
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-purple-400 font-medium whitespace-nowrap"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            Companies
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}