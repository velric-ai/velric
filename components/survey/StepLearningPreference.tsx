import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Rocket, Book, Scale, Check } from "lucide-react";

interface StepLearningPreferenceProps {
  formData: any;
  updateFormData: (updates: any) => void;
  onNext: () => void;
  onPrev: () => void;
  canProceed: boolean;
  isSubmitting: boolean;
}

const LEARNING_PREFERENCES = [
  {
    id: 'trial-error',
    title: 'Trial & Error Projects',
    description: 'Learn by doing - hands-on projects, real-world challenges, experimentation',
    icon: Rocket,
    color: '#F472B6',
    points: [
      'Build real projects',
      'Learn from mistakes',
      'Practice-focused'
    ]
  },
  {
    id: 'reading',
    title: 'Reading & Study',
    description: 'Theory-first approach - structured learning paths, documentation, courses',
    icon: Book,
    color: '#60A5FA',
    points: [
      'Structured curriculum',
      'Deep understanding',
      'Resource-based'
    ]
  },
  {
    id: 'both',
    title: 'Balanced Approach',
    description: 'Mix of both theory and practice - comprehensive growth through variety',
    icon: Scale,
    color: '#34D399',
    points: [
      'Theory + practice',
      'Comprehensive learning',
      'Flexible approach'
    ]
  }
];

export function StepLearningPreference({ 
  formData, 
  updateFormData, 
  onNext, 
  onPrev, 
  canProceed, 
  isSubmitting 
}: StepLearningPreferenceProps) {
  const [selectedPreference, setSelectedPreference] = useState<string>(formData.learningPreference.value || '');
  
  // Update form data when selection changes
  useEffect(() => {
    const error = !selectedPreference ? 'Please select a learning preference' : null;
    
    updateFormData({
      learningPreference: {
        value: selectedPreference,
        error,
        touched: true
      }
    });
  }, [selectedPreference, updateFormData]);

  const handlePreferenceSelect = (preferenceId: string) => {
    setSelectedPreference(preferenceId);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canProceed && !isSubmitting) {
      onNext();
    }
    
    // Arrow key navigation
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const currentIndex = LEARNING_PREFERENCES.findIndex(p => p.id === selectedPreference);
      let newIndex;
      
      if (e.key === 'ArrowLeft') {
        newIndex = currentIndex > 0 ? currentIndex - 1 : LEARNING_PREFERENCES.length - 1;
      } else {
        newIndex = currentIndex < LEARNING_PREFERENCES.length - 1 ? currentIndex + 1 : 0;
      }
      
      setSelectedPreference(LEARNING_PREFERENCES[newIndex].id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto"
    >
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold text-white mb-4"
        >
          How do you learn best?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-white/70 mb-2"
        >
          Choose your preferred development style
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-white/50"
        >
          This helps us personalize your learning experience
        </motion.p>
      </div>

      <div 
        className="p-8 rounded-2xl backdrop-blur-sm border border-white/10"
        style={{
          background: 'rgba(255, 255, 255, 0.05)'
        }}
      >
        {/* Learning Preference Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {LEARNING_PREFERENCES.map((preference, index) => {
            const isSelected = selectedPreference === preference.id;
            const Icon = preference.icon;
            
            return (
              <motion.button
                key={preference.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => handlePreferenceSelect(preference.id)}
                onKeyDown={handleKeyDown}
                className={`p-8 rounded-2xl border-2 transition-all duration-500 text-center relative overflow-hidden group ${
                  isSelected
                    ? 'border-purple-500 bg-purple-500/10 shadow-2xl shadow-purple-500/30 transform scale-105'
                    : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10 hover:scale-102'
                }`}
                whileHover={{ 
                  y: -12,
                  boxShadow: `0 25px 50px ${preference.color}30`
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Background Gradient */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-500 ${
                    isSelected 
                      ? 'opacity-20' 
                      : 'opacity-0 group-hover:opacity-10'
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${preference.color}40, ${preference.color}20)`
                  }}
                />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="mb-6 flex justify-center">
                    <div 
                      className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 ${
                        isSelected 
                          ? 'shadow-2xl transform scale-110' 
                          : 'group-hover:scale-110'
                      }`}
                      style={{
                        background: isSelected 
                          ? `linear-gradient(135deg, ${preference.color}, ${preference.color}cc)`
                          : `${preference.color}20`,
                        boxShadow: isSelected ? `0 12px 24px ${preference.color}50` : 'none'
                      }}
                    >
                      <Icon 
                        className="w-10 h-10 transition-all duration-300" 
                        style={{ 
                          color: isSelected ? 'white' : preference.color 
                        }} 
                      />
                    </div>
                  </div>
                  
                  {/* Selection Indicator */}
                  <div className="absolute top-6 right-6">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      isSelected
                        ? 'border-green-400 bg-green-500'
                        : 'border-white/30 group-hover:border-white/50'
                    }`}>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3, type: "spring" }}
                        >
                          <Check className="w-5 h-5 text-white" />
                        </motion.div>
                      )}
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-white font-bold text-xl mb-4 leading-tight">
                    {preference.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-white/70 text-sm leading-relaxed mb-6">
                    {preference.description}
                  </p>
                  
                  {/* Feature Points */}
                  <div className="space-y-2">
                    {preference.points.map((point, pointIndex) => (
                      <motion.div
                        key={pointIndex}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + (index * 0.1) + (pointIndex * 0.05) }}
                        className="flex items-center justify-center space-x-2"
                      >
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: preference.color }}
                        />
                        <span className="text-white/80 text-xs font-medium">
                          {point}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Selection Indicator Bar */}
                  <div className={`mt-6 h-1 bg-gradient-to-r rounded-full transition-all duration-500 ${
                    isSelected 
                      ? 'opacity-100 scale-x-100' 
                      : 'opacity-0 scale-x-0 group-hover:opacity-50 group-hover:scale-x-100'
                  }`}
                  style={{
                    background: `linear-gradient(90deg, ${preference.color}, ${preference.color}80)`
                  }} />
                </div>

                {/* Radio Button (Hidden but accessible) */}
                <input
                  type="radio"
                  name="learningPreference"
                  value={preference.id}
                  checked={isSelected}
                  onChange={() => handlePreferenceSelect(preference.id)}
                  className="sr-only"
                />
              </motion.button>
            );
          })}
        </div>

        {/* Selection Confirmation */}
        {selectedPreference && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-6"
          >
            <div className="inline-flex items-center space-x-3 px-6 py-3 rounded-full bg-green-500/20 border border-green-500/30">
              <Check className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-medium">
                {LEARNING_PREFERENCES.find(p => p.id === selectedPreference)?.title} selected
              </span>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {formData.learningPreference.error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <p className="text-red-400 text-sm">{formData.learningPreference.error}</p>
          </motion.div>
        )}

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-between items-center pt-6"
        >
          <button
            onClick={onPrev}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <button
            onClick={onNext}
            disabled={!canProceed || isSubmitting}
            className={`px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 ${
              canProceed && !isSubmitting
                ? 'bg-gradient-to-r from-purple-500 to-cyan-400 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25'
                : 'bg-gray-600 cursor-not-allowed opacity-50'
            }`}
          >
            {isSubmitting ? 'Processing...' : 'Continue'}
          </button>
        </motion.div>

        {/* Keyboard Navigation Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-4"
        >
          <p className="text-white/40 text-xs">
            Use arrow keys to navigate • Enter to continue
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}