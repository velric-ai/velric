import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Target, Code, Cpu, Network } from 'lucide-react';

export default function InteractiveAIVisual() {
  const [activeNode, setActiveNode] = useState(0);
  const [pulseNodes, setPulseNodes] = useState<number[]>([]);

  // Cycle through active nodes
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNode(prev => (prev + 1) % 6);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Random pulse effects
  useEffect(() => {
    const interval = setInterval(() => {
      const randomNodes = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, 
        () => Math.floor(Math.random() * 6)
      );
      setPulseNodes(randomNodes);
      
      setTimeout(() => setPulseNodes([]), 1000);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const nodes = [
    { icon: Brain, position: { x: 50, y: 20 }, label: 'AI Brain' },
    { icon: Zap, position: { x: 80, y: 40 }, label: 'Processing' },
    { icon: Target, position: { x: 70, y: 70 }, label: 'Targeting' },
    { icon: Code, position: { x: 15, y: 70 }, label: 'Code Gen' },
    { icon: Cpu, position: { x: 20, y: 35 }, label: 'Computing' },
    { icon: Network, position: { x: 50, y: 50 }, label: 'Network' }
  ];

  const connections = [
    { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 },
    { from: 3, to: 4 }, { from: 4, to: 5 }, { from: 5, to: 0 },
    { from: 0, to: 2 }, { from: 1, to: 4 }, { from: 2, to: 5 }
  ];

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-2xl overflow-hidden border border-purple-500/20">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(147, 51, 234, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(147, 51, 234, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px',
            animation: 'gridMove 20s linear infinite'
          }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Connection Lines */}
      <svg className="absolute inset-0 w-full h-full">
        {connections.map((connection, index) => {
          const fromNode = nodes[connection.from];
          const toNode = nodes[connection.to];
          const isActive = activeNode === connection.from || activeNode === connection.to;
          
          return (
            <motion.line
              key={index}
              x1={`${fromNode.position.x}%`}
              y1={`${fromNode.position.y}%`}
              x2={`${toNode.position.x}%`}
              y2={`${toNode.position.y}%`}
              stroke={isActive ? '#A855F7' : '#6B21A8'}
              strokeWidth={isActive ? '2' : '1'}
              opacity={isActive ? 0.8 : 0.3}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: index * 0.1 }}
            />
          );
        })}
      </svg>

      {/* AI Nodes */}
      {nodes.map((node, index) => {
        const IconComponent = node.icon;
        const isActive = activeNode === index;
        const isPulsing = pulseNodes.includes(index);
        
        return (
          <motion.div
            key={index}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{
              left: `${node.position.x}%`,
              top: `${node.position.y}%`
            }}
            whileHover={{ scale: 1.2 }}
            onHoverStart={() => setActiveNode(index)}
          >
            <motion.div
              className={`
                relative p-3 rounded-full border-2 backdrop-blur-sm
                ${isActive 
                  ? 'bg-purple-500/30 border-purple-400 shadow-lg shadow-purple-500/50' 
                  : 'bg-purple-900/20 border-purple-600/50'
                }
              `}
              animate={{
                scale: isPulsing ? [1, 1.3, 1] : isActive ? 1.1 : 1,
                boxShadow: isActive 
                  ? '0 0 20px rgba(168, 85, 247, 0.5)' 
                  : '0 0 10px rgba(107, 33, 168, 0.3)'
              }}
              transition={{ duration: 0.3 }}
            >
              <IconComponent 
                className={`w-6 h-6 ${isActive ? 'text-purple-200' : 'text-purple-400'}`}
              />
              
              {/* Pulse Ring */}
              {(isActive || isPulsing) && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-purple-400"
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.div>
            
            {/* Label */}
            <motion.div
              className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 5 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-xs text-purple-300 bg-black/50 px-2 py-1 rounded">
                {node.label}
              </span>
            </motion.div>
          </motion.div>
        );
      })}

      {/* Central Glow Effect */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Interactive Overlay Text */}
      <motion.div
        className="absolute bottom-4 left-4 right-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p className="text-sm text-purple-300/80">
          Interactive AI Mission Network
        </p>
      </motion.div>
    </div>
  );
}