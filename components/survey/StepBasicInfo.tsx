import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Check, AlertCircle } from "lucide-react";
import { FormInput } from "./FormInput";
import { validateFullName, validateEducationLevel, validateIndustry, sanitizeName } from "../../utils/surveyValidation";

interface StepBasicInfoProps {
  formData: any;
  updateFormData: (updates: any) => void;
  onNext: () => void;
  onPrev: () => void;
  canProceed: boolean;
  isSubmitting: boolean;
  resetSubsequentSteps?: () => void;
}

const EDUCATION_LEVELS = [
  'High School',
  'Some College',
  'Bachelors Degree',
  'Masters Degree',
  'PhD',
  'Self-Taught',
  'Other'
];

const INDUSTRIES = [
  'Technology & Software',
  'Artificial Intelligence & ML',
  'Finance & Banking',
  'Healthcare & Medical',
  'E-commerce & Retail',
  'Education & Learning',
  'Product Management',
  'Consulting & Services',
  'Marketing & Advertising',
  'Operations & Supply Chain',
  'Data Science & Analytics',
  'Design & Creative',
  'Startup Founder',
  'Government & Public Sector',
  'Non-profit',
  'Transportation & Logistics',
  'Real Estate & Property',
  'Manufacturing',
  'Agriculture & Food',
  'Media & Entertainment',
  'Legal Services',
  'Hospitality & Tourism',
  'Human Resources',
  'Sales & Business Development',
  'Research & Development',
  'Quality Assurance',
  'Customer Support',
  'IT Infrastructure',
  'Other'
];

export function StepBasicInfo({ 
  formData, 
  updateFormData, 
  onNext, 
  canProceed, 
  isSubmitting,
  resetSubsequentSteps
}: StepBasicInfoProps) {
  const [industrySearch, setIndustrySearch] = useState('');
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
  const [filteredIndustries, setFilteredIndustries] = useState(INDUSTRIES);
  
  // Track previous values to detect changes
  const prevEducationLevel = useRef(formData.educationLevel?.value);
  const prevIndustry = useRef(formData.industry?.value);

  // Filter industries based on search
  useEffect(() => {
    if (industrySearch) {
      const filtered = INDUSTRIES.filter(industry =>
        industry.toLowerCase().includes(industrySearch.toLowerCase())
      );
      setFilteredIndustries(filtered);
    } else {
      setFilteredIndustries(INDUSTRIES);
    }
  }, [industrySearch]);

  // Reset subsequent steps when education level or industry changes
  useEffect(() => {
    // Only reset if we're on step 1 and values have actually changed
    if (formData.currentStep === 1 && resetSubsequentSteps) {
      const educationChanged = prevEducationLevel.current !== formData.educationLevel?.value;
      const industryChanged = prevIndustry.current !== formData.industry?.value;
      
      // Only reset if the field was previously filled (not initial load)
      if ((educationChanged && prevEducationLevel.current) || (industryChanged && prevIndustry.current)) {
        console.log('🔄 Resetting subsequent steps due to change in Education Level or Industry');
        resetSubsequentSteps();
      }
      
      // Update refs
      prevEducationLevel.current = formData.educationLevel?.value;
      prevIndustry.current = formData.industry?.value;
    }
  }, [formData.educationLevel?.value, formData.industry?.value, formData.currentStep, resetSubsequentSteps]);

  const handleNameChange = (value: string) => {
    const sanitized = sanitizeName(value);
    const error = formData.fullName.touched ? validateFullName(sanitized) : null;
    
    updateFormData({
      fullName: {
        value: sanitized,
        error,
        touched: true
      }
    });
  };

  const handleNameBlur = () => {
    const error = validateFullName(formData.fullName.value);
    updateFormData({
      fullName: {
        ...formData.fullName,
        error,
        touched: true
      }
    });
  };

  const handleEducationChange = (value: string) => {
    const error = validateEducationLevel(value);
    updateFormData({
      educationLevel: {
        value,
        error,
        touched: true
      }
    });
  };

  const handleIndustrySelect = (industry: string) => {
    const error = validateIndustry(industry);
    updateFormData({
      industry: {
        value: industry,
        error,
        touched: true
      }
    });
    setIndustrySearch(industry);
    setShowIndustryDropdown(false);
  };

  const handleIndustryInputChange = (value: string) => {
    setIndustrySearch(value);
    setShowIndustryDropdown(true);
    
    // Update form data if exact match
    const exactMatch = INDUSTRIES.find(industry => 
      industry.toLowerCase() === value.toLowerCase()
    );
    
    if (exactMatch) {
      const error = validateIndustry(exactMatch);
      updateFormData({
        industry: {
          value: exactMatch,
          error,
          touched: true
        }
      });
    } else {
      updateFormData({
        industry: {
          value: '',
          error: formData.industry.touched ? 'Please select a valid industry' : null,
          touched: true
        }
      });
    }
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
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold text-white mb-4"
        >
          Let's Build Your Velric Profile
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-white/70"
        >
          Complete these details to get started
        </motion.p>
      </div>

      <div 
        className="p-8 rounded-2xl backdrop-blur-sm border border-white/10 space-y-8"
        style={{
          background: 'rgba(255, 255, 255, 0.05)'
        }}
      >
        {/* Full Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <FormInput
            label="Full Name"
            type="text"
            value={formData.fullName.value}
            onChange={handleNameChange}
            onBlur={handleNameBlur}
            onKeyDown={handleKeyDown}
            placeholder="John Doe"
            error={formData.fullName.error}
            required
            maxLength={50}
            autoFocus
            showCharacterCount
          />
        </motion.div>

        {/* Education Level */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label className="block text-sm font-semibold text-white/90 mb-3">
            Education Level <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <select
              value={formData.educationLevel.value}
              onChange={(e) => handleEducationChange(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Education Level"
              className={`w-full px-4 py-4 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all appearance-none cursor-pointer ${
                formData.educationLevel.error ? 'border-red-500 bg-red-500/5' : 'border-white/20 hover:border-white/30'
              }`}
            >
              {EDUCATION_LEVELS.map((level) => (
                <option key={level} value={level} className="bg-gray-800 text-white">
                  {level}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60 pointer-events-none" />
            {formData.educationLevel.value && !formData.educationLevel.error && (
              <Check className="absolute right-12 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
            )}
          </div>
          {formData.educationLevel.error && (
            <div className="flex items-center space-x-2 mt-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <p className="text-sm text-red-400">{formData.educationLevel.error}</p>
            </div>
          )}
        </motion.div>

        {/* Industry */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative z-10"
        >
          <label className="block text-sm font-semibold text-white/90 mb-3">
            Current Industry <span className="text-red-400">*</span>
          </label>
          <div className="relative z-10">
            <input
              type="text"
              value={industrySearch}
              onChange={(e) => handleIndustryInputChange(e.target.value)}
              onFocus={() => setShowIndustryDropdown(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search and select your industry"
              className={`w-full px-4 py-4 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                formData.industry.error ? 'border-red-500 bg-red-500/5' : 'border-white/20 hover:border-white/30'
              }`}
            />
            {formData.industry.value && !formData.industry.error && (
              <Check className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
            )}
            
            {/* Dropdown - FIXED */}
            {showIndustryDropdown && (
              <>
                {/* Backdrop overlay - only closes dropdown, doesn't block clicks */}
                <div
                  className="fixed inset-0 z-[9998]"
                  onClick={() => setShowIndustryDropdown(false)}
                  style={{
                    backgroundColor: 'transparent'
                  }}
                />
                
                {/* Dropdown menu - HIGHEST Z-INDEX */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-white/20 rounded-xl shadow-2xl max-h-60 overflow-y-auto z-[9999]"
                >
                  {filteredIndustries.length > 0 ? (
                    filteredIndustries.map((industry) => (
                      <button
                        key={industry}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleIndustrySelect(industry);
                        }}
                        className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors first:rounded-t-xl last:rounded-b-xl cursor-pointer"
                      >
                        {industry}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-white/60 text-center">
                      No industries found
                    </div>
                  )}
                </motion.div>
              </>
            )}
          </div>
          {formData.industry.error && (
            <div className="flex items-center space-x-2 mt-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <p className="text-sm text-red-400">{formData.industry.error}</p>
            </div>
          )}
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-end pt-6"
        >
          <button
            type="button"
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