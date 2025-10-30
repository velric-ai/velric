import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: number;
}

export function ProgressBar({ currentStep, totalSteps, completedSteps }: ProgressBarProps) {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="sticky top-0 z-40 bg-black/20 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Complete Your Profile</h1>
            <p className="text-white/60 text-sm">Help us personalize your Velric experience</p>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-white/80">
              Step {currentStep} of {totalSteps}
            </div>
            <div className="text-xs text-white/60">
              {Math.round(progressPercentage)}% complete
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div 
            className="h-2 bg-white/10 rounded-full overflow-hidden"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between mt-3">
            {Array.from({ length: totalSteps }, (_, index) => {
              const stepNumber = index + 1;
              const isCompleted = stepNumber <= completedSteps;
              const isCurrent = stepNumber === currentStep;
              
              return (
                <motion.div
                  key={stepNumber}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    isCompleted
                      ? 'bg-gradient-to-r from-green-500 to-emerald-400 text-white'
                      : isCurrent
                      ? 'bg-gradient-to-r from-purple-500 to-cyan-400 text-white'
                      : 'bg-white/10 text-white/40'
                  }`}
                  initial={{ scale: 0.8 }}
                  animate={{ 
                    scale: isCurrent ? 1.1 : 1,
                    boxShadow: isCurrent ? '0 0 20px rgba(167, 139, 250, 0.5)' : 'none'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    stepNumber
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}