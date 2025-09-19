// components/SubmissionForm.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, X } from 'lucide-react';
import { interestOptions } from '@/lib/missionHelpers';
import LoadingSpinner from './LoadingSpinner';

const formSchema = z.object({
  interests: z.array(z.string()).min(1, 'Please select at least one interest').max(5, 'Please select no more than 5 interests')
});

type FormData = z.infer<typeof formSchema>;

interface SubmissionFormProps {
  onSubmit: (interests: string[]) => void;
  isLoading: boolean;
}

export default function SubmissionForm({ onSubmit, isLoading }: SubmissionFormProps) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interests: []
    }
  });

  const toggleInterest = (interest: string) => {
    if (isLoading) return;
    
    const newInterests = selectedInterests.includes(interest)
      ? selectedInterests.filter(i => i !== interest)
      : [...selectedInterests, interest];
    
    setSelectedInterests(newInterests);
    setValue('interests', newInterests);
    
    if (newInterests.length > 0) {
      clearErrors('interests');
    }
  };

  const onFormSubmit = (data: FormData) => {
    onSubmit(data.interests);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1C1C1E] rounded-xl p-6 border border-gray-800"
    >
      <h3 className="text-xl font-bold text-white mb-4">
        Tell us your interests
      </h3>
      <p className="text-gray-400 mb-6">
        Select up to 5 areas you&apos;re interested in to get personalized mission recommendations.
      </p>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
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
                      ? 'bg-gradient-to-r from-velricViolet to-plasmaBlue text-white border-transparent' 
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
          disabled={isLoading || selectedInterests.length === 0}
          className={`
            w-full py-3 px-6 rounded-lg font-medium transition-all duration-300
            ${selectedInterests.length > 0 && !isLoading
              ? 'bg-gradient-to-r from-velricViolet to-plasmaBlue text-white hover:shadow-lg'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }
          `}
          whileHover={selectedInterests.length > 0 && !isLoading ? { scale: 1.02 } : {}}
          whileTap={selectedInterests.length > 0 && !isLoading ? { scale: 0.98 } : {}}
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