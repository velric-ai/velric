import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

interface MissionFlowProps {
  width: number;
  height: number;
  text: string;
  className?: string;
}

export default function MissionFlow({ width, height, text, className = "" }: MissionFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Check if this is the smaller diff-size variant
  const isSmallSize = className.includes('diff-size') || width <= 320;

  const steps = [
    { icon: Play, label: 'Start Mission', color: 'text-blue-400' },
    { icon: Sparkles, label: 'AI Analysis', color: 'text-purple-400' },
    { icon: CheckCircle, label: 'Complete', color: 'text-green-400' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        const next = (prev + 1) % steps.length;
        if (next === 0) {
          setCompletedSteps([]);
        } else {
          setCompletedSteps(prevCompleted => [...prevCompleted, prev]);
        }
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div 
      className={`relative bg-gradient-to-br from-indigo-900/20 to-purple-900/30 rounded-2xl overflow-hidden border border-purple-500/20 ${className}`}
      style={{ width, height }}
    >
      {/* Background Animation */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5"
          animate={{
            background: [
              'linear-gradient(45deg, rgba(147,51,234,0.05), rgba(59,130,246,0.05))',
              'linear-gradient(135deg, rgba(59,130,246,0.05), rgba(147,51,234,0.05))',
              'linear-gradient(225deg, rgba(147,51,234,0.05), rgba(59,130,246,0.05))',
              'linear-gradient(315deg, rgba(59,130,246,0.05), rgba(147,51,234,0.05))'
            ]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      {/* Mission Steps */}
      <div className={`absolute inset-0 flex items-center justify-center ${isSmallSize ? 'top-2' : ''}`}>
        <div className={`flex items-center ${isSmallSize ? 'space-x-4' : 'space-x-8'}`}>
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const isActive = currentStep === index;
            const isCompleted = completedSteps.includes(index);
            
            return (
              <React.Fragment key={index}>
                <motion.div
                  className={`relative rounded-full border-2 transition-all duration-500 ${
                    isSmallSize ? 'p-2' : 'p-4'
                  } ${
                    isActive 
                      ? 'bg-purple-500/30 border-purple-400 shadow-lg shadow-purple-500/50' 
                      : isCompleted
                      ? 'bg-green-500/20 border-green-400'
                      : 'bg-gray-800/30 border-gray-600/50'
                  }`}
                  animate={{
                    scale: isActive ? (isSmallSize ? 1.1 : 1.2) : 1,
                    rotate: isActive ? [0, 5, -5, 0] : 0
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <IconComponent 
                    className={`${isSmallSize ? 'w-4 h-4' : 'w-6 h-6'} ${
                      isActive ? 'text-purple-200' : 
                      isCompleted ? 'text-green-300' : 
                      'text-gray-400'
                    }`}
                  />
                  
                  {/* Pulse Ring */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-purple-400"
                      initial={{ scale: 1, opacity: 0.8 }}
                      animate={{ scale: 2, opacity: 0 }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}

                  {/* Completion Checkmark */}
                  {isCompleted && (
                    <motion.div
                      className={`absolute -top-1 -right-1 bg-green-500 rounded-full flex items-center justify-center ${
                        isSmallSize ? 'w-3 h-3' : 'w-4 h-4'
                      }`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      <CheckCircle className={`text-white ${isSmallSize ? 'w-2 h-2' : 'w-3 h-3'}`} />
                    </motion.div>
                  )}

                  {/* Step Label */}
                  {!isSmallSize && (
                    <motion.div
                      className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: isActive ? 1 : 0.6, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className={`text-xs font-medium ${
                        isActive ? 'text-purple-300' : 
                        isCompleted ? 'text-green-300' : 
                        'text-gray-400'
                      }`}>
                        {step.label}
                      </span>
                    </motion.div>
                  )}
                </motion.div>

                {/* Arrow between steps */}
                {index < steps.length - 1 && (
                  <motion.div
                    className="flex items-center"
                    animate={{
                      opacity: currentStep > index ? 1 : 0.3,
                      x: isActive ? [0, 5, 0] : 0
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <ArrowRight className={`${isSmallSize ? 'w-3 h-3' : 'w-5 h-5'} ${
                      currentStep > index ? 'text-purple-400' : 'text-gray-500'
                    }`} />
                  </motion.div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Progress Bar */}
      <div className={`absolute ${isSmallSize ? 'bottom-3 left-4 right-4' : 'bottom-6 left-6 right-6'}`}>
        <div className={`w-full bg-gray-800/50 rounded-full overflow-hidden ${isSmallSize ? 'h-1.5' : 'h-2'}`}>
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className={`flex justify-between text-xs text-gray-400 ${isSmallSize ? 'mt-1 px-0.5' : 'mt-2 px-1'}`}>
          <span>Mission Progress</span>
          <span className="font-medium">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 40}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5
            }}
          />
        ))}
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