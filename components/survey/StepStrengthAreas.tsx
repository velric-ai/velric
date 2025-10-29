import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Check, 
  ChevronLeft, 
  Users, 
  Lightbulb, 
  Code, 
  Palette, 
  MessageSquare, 
  BarChart3, 
  Target, 
  Zap, 
  Handshake 
} from "lucide-react";

interface StepStrengthAreasProps {
  formData: any;
  updateFormData: (updates: any) => void;
  onNext: () => void;
  onPrev: () => void;
  canProceed: boolean;
  isSubmitting: boolean;
}

const STRENGTH_AREAS = [
  {
    name: 'Leadership & Management',
    icon: Users,
    description: 'Guiding teams, strategic planning, decision-making',
    color: '#F472B6'
  },
  {
    name: 'Problem Solving',
    icon: Lightbulb,
    description: 'Analytical thinking, creative solutions, debugging',
    color: '#FBBF24'
  },
  {
    name: 'Coding & Development',
    icon: Code,
    description: 'Software development, programming, technical implementation',
    color: '#60A5FA'
  },
  {
    name: 'Design Thinking',
    icon: Palette,
    description: 'User experience, product design, creative problem-solving',
    color: '#A78BFA'
  },
  {
    name: 'Storytelling & Communication',
    icon: MessageSquare,
    description: 'Clear communication, presentations, written content',
    color: '#34D399'
  },
  {
    name: 'Data Analysis',
    icon: BarChart3,
    description: 'Data insights, analytics, metrics, reporting',
    color: '#F87171'
  },
  {
    name: 'Marketing Strategy',
    icon: Target,
    description: 'Marketing campaigns, growth, strategy, positioning',
    color: '#FB7185'
  },
  {
    name: 'Technical Communication',
    icon: Zap,
    description: 'Explaining complex topics, technical writing, documentation',
    color: '#FBBF24'
  },
  {
    name: 'Teamwork & Collaboration',
    icon: Handshake,
    description: 'Cooperation, communication, cross-functional work',
    color: '#10B981'
  }
];

export function StepStrengthAreas({ 
  formData, 
  updateFormData, 
  onNext, 
  onPrev, 
  canProceed, 
  isSubmitting 
}: StepStrengthAreasProps) {
  const [selectedStrengths, setSelectedStrengths] = useState<string[]>(formData.strengthAreas.value || []);
  
  // Update form data when selections change
  useEffect(() => {
    const error = selectedStrengths.length < 3 
      ? 'Please select at least 3 strengths' 
      : selectedStrengths.length > 9 
      ? 'Please select no more than 9 strengths' 
      : null;
      
    updateFormData({
      strengthAreas: {
        value: selectedStrengths,
        error,
        touched: true
      }
    });
  }, [selectedStrengths, updateFormData]);

  const handleStrengthToggle = (strengthName: string) => {
    setSelectedStrengths(prev => {
      if (prev.includes(strengthName)) {
        return prev.filter(item => item !== strengthName);
      } else if (prev.length < 9) {
        return [...prev, strengthName];
      } else {
        // Replace the first selected item if at max
        return [...prev.slice(1), strengthName];
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canProceed && !isSubmitting) {
      onNext();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-5xl mx-auto"
    >
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold text-white mb-4"
        >
          What are your core strengths?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-white/70 mb-2"
        >
          Select the areas where you excel
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-white/50"
        >
          Choose 3-9 strengths (recommended: 3-5)
        </motion.p>
      </div>

      <div 
        className="p-8 rounded-2xl backdrop-blur-sm border border-white/10"
        style={{
          background: 'rgba(255, 255, 255, 0.05)'
        }}
      >
        {/* Strengths Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {STRENGTH_AREAS.map((strength, index) => {
            const isSelected = selectedStrengths.includes(strength.name);
            const Icon = strength.icon;
            const isDisabled = !isSelected && selectedStrengths.length >= 9;
            
            return (
              <motion.button
                key={strength.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => !isDisabled && handleStrengthToggle(strength.name)}
                onKeyDown={handleKeyDown}
                disabled={isDisabled}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left relative overflow-hidden group ${
                  isSelected
                    ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20 transform scale-105'
                    : isDisabled
                    ? 'border-white/10 bg-white/5 opacity-50 cursor-not-allowed'
                    : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10 hover:scale-102'
                }`}
                whileHover={!isDisabled ? { 
                  y: -8,
                  boxShadow: `0 20px 40px ${strength.color}20`
                } : {}}
                whileTap={!isDisabled ? { scale: 0.98 } : {}}
              >
                {/* Background Gradient */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-300 ${
                    isSelected 
                      ? 'opacity-20' 
                      : 'opacity-0 group-hover:opacity-10'
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${strength.color}40, ${strength.color}20)`
                  }}
                />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon and Selection Indicator */}
                  <div className="flex items-center justify-between mb-4">
                    <div 
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isSelected 
                          ? 'shadow-lg' 
                          : 'group-hover:scale-110'
                      }`}
                      style={{
                        background: isSelected 
                          ? `linear-gradient(135deg, ${strength.color}, ${strength.color}cc)`
                          : `${strength.color}20`,
                        boxShadow: isSelected ? `0 8px 16px ${strength.color}40` : 'none'
                      }}
                    >
                      <Icon 
                        className="w-6 h-6 text-white" 
                        style={{ 
                          color: isSelected ? 'white' : strength.color 
                        }} 
                      />
                    </div>
                    
                    {/* Selection Checkmark */}
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      isSelected
                        ? 'border-green-400 bg-green-500'
                        : 'border-white/30 group-hover:border-white/50'
                    }`}>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Check className="w-5 h-5 text-white" />
                        </motion.div>
                      )}
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-white font-bold text-lg mb-2 leading-tight">
                    {strength.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-white/70 text-sm leading-relaxed">
                    {strength.description}
                  </p>
                  
                  {/* Selection Indicator Bar */}
                  <div className={`mt-4 h-1 bg-gradient-to-r rounded-full transition-all duration-300 ${
                    isSelected 
                      ? 'opacity-100' 
                      : 'opacity-0 group-hover:opacity-50'
                  }`}
                  style={{
                    background: `linear-gradient(90deg, ${strength.color}, ${strength.color}80)`
                  }} />
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Selection Counter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-6"
        >
          <div className={`inline-flex items-center space-x-3 px-6 py-3 rounded-full ${
            selectedStrengths.length >= 3 
              ? 'bg-green-500/20 border border-green-500/30' 
              : 'bg-white/5 border border-white/20'
          }`}>
            <span className={`text-sm font-medium ${
              selectedStrengths.length >= 3 ? 'text-green-400' : 'text-white/60'
            }`}>
              Selected: {selectedStrengths.length} / 9
            </span>
            {selectedStrengths.length >= 3 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Check className="w-4 h-4 text-green-400" />
              </motion.div>
            )}
          </div>
          
          {selectedStrengths.length < 3 && (
            <p className="text-white/50 text-xs mt-2">
              Select at least {3 - selectedStrengths.length} more strength{3 - selectedStrengths.length !== 1 ? 's' : ''}
            </p>
          )}
        </motion.div>

        {/* Error Message */}
        {formData.strengthAreas.error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <p className="text-red-400 text-sm">{formData.strengthAreas.error}</p>
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
      </div>
    </motion.div>
  );
}