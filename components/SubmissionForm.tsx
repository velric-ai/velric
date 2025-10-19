import { useState } from "react";
import { motion } from "framer-motion";
import LoadingSpinner from "./LoadingSpinner";

interface SubmissionFormProps {
  onSubmit: (data: { submissionText: string }) => void;
  isLoading: boolean;
}

export default function SubmissionForm({
  onSubmit,
  isLoading,
}: SubmissionFormProps) {
  const [submissionText, setSubmissionText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionText.trim()) return;
    onSubmit({ submissionText: submissionText.trim() });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1C1C1E] rounded-2xl p-8 border border-gray-800 space-y-6"
    >
      <h3 className="text-xl font-bold text-white mb-4">
        Tell us about yourself
      </h3>
      <p className="text-gray-400 mb-6">
        Provide your interests and/or resume text to get personalized mission recommendations.
      </p>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Resume Text Input */}
        <div>
          <label htmlFor="resumeText" className="block text-sm font-medium text-white mb-2">
            Resume or Background (Optional)
          </label>
          <textarea
            id="resumeText"
            {...register('resumeText')}
            value={resumeText}
            onChange={handleResumeTextChange}
            disabled={isLoading}
            placeholder="Paste your resume text or describe your background, skills, and experience..."
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors resize-none"
            rows={4}
          />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-700"></div>
          <span className="text-gray-400 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>

        {/* Interest Selection */}
        <div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {interestOptions.map((interest) => {
              const isSelected = selectedInterests.includes(interest);
              const isDisabled = isLoading || (selectedInterests.length >= 5 && !isSelected);
              
              return (
                <motion.button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  disabled={isDisabled}
                  className={`
                    relative p-3 rounded-lg text-sm font-medium transition-all duration-200
                    ${isSelected 
                      ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white border-transparent' 
                      : 'bg-gray-800 text-gray-300 border border-gray-700 hover:border-gray-600'
                    }
                    ${isDisabled && !isSelected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                  whileHover={!isDisabled ? { scale: 1.02 } : {}}
                  whileTap={!isDisabled ? { scale: 0.98 } : {}}
                >
                  <span className="flex items-center justify-center gap-2">
                    {interest}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Check className="w-4 h-4" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </span>
                </motion.button>
              );
            })}
          </div>
          
          {/* Selection Counter */}
          <div className="mt-3 text-sm text-gray-400">
            {selectedInterests.length}/5 selected
          </div>
          
          {/* Error Message */}
          <AnimatePresence>
            {errors.interests && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-2 flex items-center gap-2 text-red-400 text-sm"
              >
                <X className="w-4 h-4" />
                {errors.interests.message}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isLoading || (selectedInterests.length === 0 && resumeText.trim().length === 0)}
          className={`
            w-full py-3 px-6 rounded-lg font-medium transition-all duration-300
            ${(selectedInterests.length > 0 || resumeText.trim().length > 0) && !isLoading
              ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:shadow-lg'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }
          `}
          whileHover={(selectedInterests.length > 0 || resumeText.trim().length > 0) && !isLoading ? { scale: 1.02 } : {}}
          whileTap={(selectedInterests.length > 0 || resumeText.trim().length > 0) && !isLoading ? { scale: 0.98 } : {}}
        >
          {isLoading ? (
            <LoadingSpinner size="sm" />
          ) : (
            'Generate My Missions'
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
