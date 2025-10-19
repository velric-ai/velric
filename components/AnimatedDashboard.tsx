import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface AnimatedDashboardProps {
  className?: string;
}

export default function AnimatedDashboard({ className = "" }: AnimatedDashboardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const barData = [85, 92, 78, 96, 88];
  const linePoints = [20, 45, 35, 60, 55, 80, 75, 90];
  const pieData = [40, 25, 20, 15];

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div className="w-full h-48 bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-xl p-4 border border-blue-500/20">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <motion.div
            className="text-sm font-semibold text-blue-300"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            AI Dashboard
          </motion.div>
          <motion.div
            className="px-2 py-1 bg-blue-500/20 rounded-full text-xs text-blue-300"
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            AI-POWERED
          </motion.div>
        </div>

        <div className="grid grid-cols-3 gap-4 h-32">
          
          {/* Bar Chart */}
          <div className="flex flex-col">
            <motion.div
              className="text-xs text-gray-400 mb-2"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              Performance
            </motion.div>
            <div className="flex items-end justify-between h-full space-x-1">
              {barData.map((height, i) => (
                <motion.div
                  key={i}
                  className="bg-gradient-to-t from-blue-600 to-blue-400 rounded-sm flex-1"
                  initial={{ height: 0 }}
                  animate={isInView ? { height: `${height}%` } : {}}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.8 + i * 0.1,
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>
            <motion.div
              className="text-lg font-bold text-blue-400 mt-1"
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 1.5 }}
            >
              94%
            </motion.div>
          </div>

          {/* Line Chart */}
          <div className="flex flex-col">
            <motion.div
              className="text-xs text-gray-400 mb-2"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              Growth
            </motion.div>
            <div className="relative h-full">
              <svg className="w-full h-full" viewBox="0 0 100 80">
                <motion.polyline
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={linePoints.map((y, i) => `${i * 14},${80 - y}`).join(' ')}
                  initial={{ pathLength: 0 }}
                  animate={isInView ? { pathLength: 1 } : {}}
                  transition={{ duration: 2, delay: 1.2, ease: "easeInOut" }}
                />
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <motion.div
              className="text-lg font-bold text-cyan-400 mt-1"
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 1.8 }}
            >
              +127%
            </motion.div>
          </div>

          {/* Pie Chart */}
          <div className="flex flex-col">
            <motion.div
              className="text-xs text-gray-400 mb-2"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.8 }}
            >
              Accuracy
            </motion.div>
            <div className="relative h-full flex items-center justify-center">
              <svg className="w-16 h-16" viewBox="0 0 42 42">
                <circle
                  cx="21"
                  cy="21"
                  r="15.915"
                  fill="transparent"
                  stroke="rgba(139, 92, 246, 0.1)"
                  strokeWidth="3"
                />
                {pieData.map((percentage, i) => {
                  const offset = pieData.slice(0, i).reduce((sum, val) => sum + val, 0);
                  return (
                    <motion.circle
                      key={i}
                      cx="21"
                      cy="21"
                      r="15.915"
                      fill="transparent"
                      stroke={`hsl(${260 + i * 30}, 70%, 60%)`}
                      strokeWidth="3"
                      strokeDasharray={`${percentage} ${100 - percentage}`}
                      strokeDashoffset={-offset}
                      initial={{ strokeDasharray: "0 100" }}
                      animate={isInView ? { strokeDasharray: `${percentage} ${100 - percentage}` } : {}}
                      transition={{ duration: 1, delay: 2 + i * 0.2, ease: "easeOut" }}
                      transform="rotate(-90 21 21)"
                    />
                  );
                })}
              </svg>
            </div>
            <motion.div
              className="text-lg font-bold text-purple-400 mt-1"
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 2.5 }}
            >
              98.7%
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}