import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Check, AlertCircle, Calendar, Clock, Plus, X, Globe } from "lucide-react";
import { FormInput } from "./FormInput";
import { validateFullName, validateEducationLevel, validateIndustry, sanitizeName } from "../../utils/surveyValidation";
import { EDUCATION_LEVELS, INDUSTRIES, DAYS_OF_WEEK, TIME_SLOTS } from "@/data/surveyConstants";

interface StepBasicInfoProps {
  formData: any;
  updateFormData: (updates: any) => void;
  onNext: () => void;
  onPrev: () => void;
  canProceed: boolean;
  isSubmitting: boolean;
  resetSubsequentSteps?: () => void;
}

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
  console.log("formData", formData,industrySearch);
  // Interview availability state
  const [timeSlots, setTimeSlots] = useState<Array<{ day: string; startTime: string; endTime: string }>>(
    formData.interviewAvailability?.value || []
  );
  const [timezone, setTimezone] = useState<string>(
    formData.interviewAvailability?.timezone || (typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC")
  );
  
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

  useEffect(() => {
    if(formData.industry?.value) {
      setIndustrySearch(formData.industry?.value);
    }
  }, [formData]);
  // Update interview availability in form data
  useEffect(() => {
    updateFormData({
      interviewAvailability: {
        value: timeSlots,
        timezone: timezone,
        error: null,
        touched: true,
      },
    });
  }, [timeSlots, timezone, updateFormData]);

  // Auto-detect timezone on mount
  useEffect(() => {
    if (typeof Intl !== "undefined" && !formData.interviewAvailability?.timezone) {
      const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setTimezone(detectedTimezone);
    }
  }, []);

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
    // Don't validate during typing, only on blur
    const error = formData.fullName.touched ? validateFullName(sanitized.trim()) : null;
    
    updateFormData({
      fullName: {
        value: sanitized,
        error,
        touched: true
      }
    });
  };

  const handleNameBlur = () => {
    // Trim only on blur for validation
    const trimmedValue = formData.fullName.value.trim();
    const error = validateFullName(trimmedValue);
    updateFormData({
      fullName: {
        value: trimmedValue,
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

  // Interview availability handlers
  const addTimeSlot = () => {
    setTimeSlots([
      ...timeSlots,
      { day: "Monday", startTime: "09:00", endTime: "17:00" },
    ]);
  };

  const removeTimeSlot = (index: number) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  const updateTimeSlot = (index: number, field: 'day' | 'startTime' | 'endTime', value: string) => {
    const updated = [...timeSlots];
    updated[index] = { ...updated[index], [field]: value };
    setTimeSlots(updated);
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

        {/* Interview Availability */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <label className="block text-sm font-semibold text-white/90 mb-3">
            <Calendar className="inline w-4 h-4 mr-2" />
            What time slots are you usually available for interviews each week?
          </label>

          {/* Timezone Selection */}
          <div className="mb-4">
            <label className="flex items-center space-x-2 text-white/70 mb-2 text-sm">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Your Timezone</span>
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm"
            >
              {typeof Intl !== "undefined" && Intl.supportedValuesOf("timeZone").map((tz) => (
                <option key={tz} value={tz} className="bg-gray-800">
                  {tz.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

          {/* Time Slots */}
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center space-x-2 text-white/70 text-sm">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Weekly Availability</span>
              </label>
              <button
                type="button"
                onClick={addTimeSlot}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 transition-colors text-sm"
              >
                <Plus className="w-3 h-3" />
                <span>Add Time Slot</span>
              </button>
            </div>

            {timeSlots.length === 0 ? (
              <div className="text-center py-6 text-white/50 text-sm border border-white/10 rounded-xl bg-white/5">
                <p className="mb-2">No time slots added yet</p>
                <button
                  type="button"
                  onClick={addTimeSlot}
                  className="px-4 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 transition-colors text-sm"
                >
                  Add Your First Time Slot
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {timeSlots.map((slot, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10"
                  >
                    <select
                      value={slot.day}
                      onChange={(e) => updateTimeSlot(index, "day", e.target.value)}
                      className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm flex-shrink-0"
                    >
                      {DAYS_OF_WEEK.map((day) => (
                        <option key={day} value={day} className="bg-gray-800">
                          {day}
                        </option>
                      ))}
                    </select>

                    <span className="text-white/40 text-sm">from</span>

                    <select
                      value={slot.startTime}
                      onChange={(e) => updateTimeSlot(index, "startTime", e.target.value)}
                      className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm flex-shrink-0"
                    >
                      {TIME_SLOTS.map((time) => (
                        <option key={time} value={time} className="bg-gray-800">
                          {time}
                        </option>
                      ))}
                    </select>

                    <span className="text-white/40 text-sm">to</span>

                    <select
                      value={slot.endTime}
                      onChange={(e) => updateTimeSlot(index, "endTime", e.target.value)}
                      className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm flex-shrink-0"
                    >
                      {TIME_SLOTS.map((time) => (
                        <option key={time} value={time} className="bg-gray-800">
                          {time}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => removeTimeSlot(index)}
                      className="ml-auto p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
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