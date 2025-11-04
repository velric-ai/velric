import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, ChevronLeft } from "lucide-react";
import { getIndustryOptions } from "../../utils/surveyValidation";

interface StepMissionQuestionsProps {
  formData: any;
  updateFormData: (updates: any) => void;
  onNext: () => void;
  onPrev: () => void;
  canProceed: boolean;
  isSubmitting: boolean;
}

export function StepMissionQuestions({ 
  formData, 
  updateFormData, 
  onNext, 
  onPrev, 
  canProceed, 
  isSubmitting 
}: StepMissionQuestionsProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(formData.missionFocus.value || []);
  
  const industry = formData.industry.value;
  const options = getIndustryOptions(industry);
  
  // Generate question text based on industry
  const getQuestionText = (industry: string): string => {
    const questionMap: { [key: string]: string } = {
      'Technology & Software': 'Which tech domains interest you most?',
      'Finance & Banking': 'What\'s your finance specialization?',
      'Product Management': 'What\'s your PM focus?',
      'Healthcare & Medical': 'Healthcare specialization?',
      'Marketing & Advertising': 'Your marketing expertise?',
      'Education & Learning': 'What\'s your education focus?',
      'Design & Creative': 'Design specialization?',
      'E-commerce & Retail': 'E-commerce expertise?',
      'Data Science & Analytics': 'Analytics focus?',
      'Startup Founder': 'What stage is your startup?',
      'Other': 'Tell us more about your role:'
    };
    
    return questionMap[industry] || 'What areas interest you most?';
  };

  const questionText = getQuestionText(industry);

  // Update form data when options change
  useEffect(() => {
    updateFormData({
      missionFocus: {
        value: selectedOptions,
        error: selectedOptions.length === 0 ? 'Please select at least 1 option' : null,
        touched: true,
        questionText,
        options
      }
    });
  }, [selectedOptions, questionText, options, updateFormData]);

  const handleOptionToggle = (option: string) => {
    setSelectedOptions(prev => {
      if (prev.includes(option)) {
        return prev.filter(item => item !== option);
      } else {
        return [...prev, option];
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
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold text-white mb-4"
        >
          Let's narrow it down
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-white/70 mb-2"
        >
          {questionText}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-white/50"
        >
          Select all that apply (minimum 1 required)
        </motion.p>
      </div>

      <div 
        className="p-8 rounded-2xl backdrop-blur-sm border border-white/10"
        style={{
          background: 'rgba(255, 255, 255, 0.05)'
        }}
      >
        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {options.map((option, index) => {
            const isSelected = selectedOptions.includes(option);
            
            return (
              <motion.button
                key={option}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => handleOptionToggle(option)}
                onKeyDown={handleKeyDown}
                className={`p-6 rounded-xl border-2 transition-all duration-300 text-left relative overflow-hidden group ${
                  isSelected
                    ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20'
                    : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
                }`}
                whileHover={{ 
                  scale: 1.02,
                  y: -4
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-300 ${
                  isSelected 
                    ? 'from-purple-500/20 to-cyan-500/20 opacity-100' 
                    : 'from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100'
                }`} />
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-white font-semibold text-sm leading-tight pr-2">
                      {option}
                    </h3>
                    
                    {/* Selection Indicator */}
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      isSelected
                        ? 'border-purple-400 bg-purple-500'
                        : 'border-white/30 group-hover:border-white/50'
                    }`}>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Check className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </div>
                  </div>
                  
                  {/* Hover Effect */}
                  <div className={`h-1 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-300 ${
                    isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                  }`} />
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
          <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${
            selectedOptions.length > 0 
              ? 'bg-green-500/20 border border-green-500/30' 
              : 'bg-white/5 border border-white/20'
          }`}>
            <span className={`text-sm font-medium ${
              selectedOptions.length > 0 ? 'text-green-400' : 'text-white/60'
            }`}>
              Selected: {selectedOptions.length} / {options.length}
            </span>
          </div>
        </motion.div>

        {/* Error Message */}
        {formData.missionFocus.error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <p className="text-red-400 text-sm">{formData.missionFocus.error}</p>
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