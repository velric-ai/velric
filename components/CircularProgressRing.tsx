import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

interface CircularProgressRingProps {
  className?: string;
}

export default function CircularProgressRing({ className = "" }: CircularProgressRingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        const interval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 100) {
              clearInterval(interval);
              return 100;
            }
            return prev + 2;
          });
        }, 30);
        return () => clearInterval(interval);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  const radius = 80;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, transparent 70%)",
            filter: "blur(20px)"
          }}
          animate={isInView ? { 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3]
          } : {}}
          transition={{ duration: 3, repeat: Infinity }}
        />
        
        {/* SVG Progress Ring */}
        <svg
          width="192"
          height="192"
          className="transform -rotate-90"
        >
          {/* Background Circle */}
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="rgba(147, 51, 234, 0.1)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          
          {/* Progress Circle */}
          <motion.circle
            cx="96"
            cy="96"
            r={radius}
            stroke="url(#progressGradient)"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: "stroke-dashoffset 0.3s ease" }}
          />
          
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9333EA" />
              <stop offset="50%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            className="text-4xl font-bold text-white mb-1"
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {progress}%
          </motion.div>
          <motion.div
            className="text-sm text-purple-300 font-medium"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            Complete
          </motion.div>
        </div>
        
        {/* Rotating Accent */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent"
          style={{
            background: "linear-gradient(45deg, transparent, rgba(147, 51, 234, 0.5), transparent)",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "xor"
          }}
          animate={isInView ? { rotate: 360 } : {}}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
}