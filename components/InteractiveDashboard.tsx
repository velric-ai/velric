import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Zap, Target } from 'lucide-react';

interface InteractiveDashboardProps {
  width: number;
  height: number;
  text: string;
  className?: string;
}

export default function InteractiveDashboard({ width, height, text, className = "" }: InteractiveDashboardProps) {
  const [activeMetric, setActiveMetric] = useState(0);
  const [dataPoints, setDataPoints] = useState<number[]>([]);

  useEffect(() => {
    // Generate random data points
    const generateData = () => {
      const newData = Array.from({ length: 8 }, () => Math.random() * 100);
      setDataPoints(newData);
    };

    generateData();
    const interval = setInterval(generateData, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMetric(prev => (prev + 1) % 4);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const metrics = [
    { icon: BarChart3, label: 'Performance', value: '94%', color: 'text-purple-400' },
    { icon: TrendingUp, label: 'Growth', value: '+127%', color: 'text-blue-400' },
    { icon: Zap, label: 'Speed', value: '2.3s', color: 'text-green-400' },
    { icon: Target, label: 'Accuracy', value: '98.7%', color: 'text-pink-400' }
  ];

  return (
    <div 
      className={`relative bg-gradient-to-br from-gray-900/90 to-purple-900/30 rounded-2xl overflow-hidden border border-purple-500/20 ${className}`}
      style={{ width, height }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #9333EA 1px, transparent 0)`,
            backgroundSize: '30px 30px'
          }}
        />
      </div>

      {/* Header */}
      <div className="absolute top-2 left-3 right-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-white">AI Dashboard</h3>
          <div className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            AI-POWERED
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="absolute top-10 left-2 right-2 grid grid-cols-2 gap-1.5">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          const isActive = activeMetric === index;
          
          return (
            <motion.div
              key={index}
              className={`p-1.5 rounded-md border transition-all duration-300 cursor-pointer ${
                isActive 
                  ? 'bg-purple-500/20 border-purple-400/50' 
                  : 'bg-gray-800/30 border-gray-600/30'
              }`}
              animate={{
                scale: isActive ? 1.01 : 1,
                boxShadow: isActive ? '0 0 10px rgba(147, 51, 234, 0.3)' : '0 0 0px rgba(0,0,0,0)'
              }}
              onHoverStart={() => setActiveMetric(index)}
            >
              <div className="flex items-center space-x-1">
                <IconComponent className={`w-2.5 h-2.5 ${metric.color}`} />
                <span className="text-xs text-gray-300 truncate flex-1">{metric.label}</span>
              </div>
              <motion.div 
                className="text-xs font-bold text-white mt-0.5"
                animate={{ scale: isActive ? 1.02 : 1 }}
              >
                {metric.value}
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Chart Area */}
      <div className="absolute bottom-8 left-2 right-2 h-12">
        <svg className="w-full h-full">
          {/* Chart Grid */}
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(147, 51, 234, 0.6)" />
              <stop offset="100%" stopColor="rgba(147, 51, 234, 0.1)" />
            </linearGradient>
          </defs>
          
          {/* Grid Lines */}
          {[0, 25, 50, 75, 100].map(y => (
            <line
              key={y}
              x1="0"
              y1={`${y}%`}
              x2="100%"
              y2={`${y}%`}
              stroke="rgba(147, 51, 234, 0.2)"
              strokeWidth="0.5"
            />
          ))}

          {/* Data Line */}
          <motion.polyline
            points={dataPoints.map((point, index) => 
              `${(index / (dataPoints.length - 1)) * 100},${100 - point}`
            ).join(' ')}
            fill="none"
            stroke="rgba(147, 51, 234, 0.8)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
          />

          {/* Data Area */}
          <motion.polygon
            points={`0,100 ${dataPoints.map((point, index) => 
              `${(index / (dataPoints.length - 1)) * 100},${100 - point}`
            ).join(' ')} 100,100`}
            fill="url(#chartGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 1, delay: 0.5 }}
          />

          {/* Data Points */}
          {dataPoints.map((point, index) => (
            <motion.circle
              key={index}
              cx={`${(index / (dataPoints.length - 1)) * 100}%`}
              cy={`${100 - point}%`}
              r="2"
              fill="rgba(147, 51, 234, 1)"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            />
          ))}
        </svg>
      </div>

      {/* Status Bar */}
      <div className="absolute bottom-1 left-2 right-2">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="truncate text-xs">Real-time Analytics</span>
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="ml-2 text-xs"
          >
            Live Data
          </motion.span>
        </div>
      </div>

      {/* Text Label */}
      <motion.div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-2 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <span className="text-xs text-purple-300 bg-black/50 px-3 py-1 rounded-full">
          {text}
        </span>
      </motion.div>
    </div>
  );
}