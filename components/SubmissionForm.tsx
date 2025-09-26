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
  interests: z.array(z.string()).max(5, 'Please select no more than 5 interests'),
  resumeText: z.string().optional()
}).refine(
  (data) => data.interests.length > 0 || (data.resumeText && data.resumeText.trim().length > 0),
  {
    message: 'Please provide either interests or resume text',
    path: ['interests']
  }
);

type FormData = z.infer<typeof formSchema>;

interface SubmissionFormProps {
  onSubmit: (data: { interests?: string[]; resumeText?: string }) => void;
  isLoading: boolean;
}

export default function SubmissionForm({ onSubmit, isLoading }: SubmissionFormProps) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [resumeText, setResumeText] = useState<string>('');
  
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    register
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interests: [],
      resumeText: ''
    }
  });

  const toggleInterest = (interest: string) => {
    if (isLoading) return;
    
    const newInterests = selectedInterests.includes(interest)
      ? selectedInterests.filter(i => i !== interest)
      : [...selectedInterests, interest];
    
    setSelectedInterests(newInterests);
    setValue('interests', newInterests);
    
    if (newInterests.length > 0 || resumeText.trim().length > 0) {
      clearErrors('interests');
    }
  };

  const handleResumeTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setResumeText(value);
    setValue('resumeText', value);
    
    if (value.trim().length > 0 || selectedInterests.length > 0) {
      clearErrors('interests');
    }
  };

  const onFormSubmit = (data: FormData) => {
    onSubmit({
      interests: data.interests.length > 0 ? data.interests : undefined,
      resumeText: data.resumeText && data.resumeText.trim().length > 0 ? data.resumeText : undefined
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1C1C1E] rounded-xl p-6 border border-gray-800"
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
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-velricViolet focus:ring-1 focus:ring-velricViolet transition-colors resize-none"
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
          disabled={isLoading || (selectedInterests.length === 0 && resumeText.trim().length === 0)}
          className={`
            w-full py-3 px-6 rounded-lg font-medium transition-all duration-300
            ${(selectedInterests.length > 0 || resumeText.trim().length > 0) && !isLoading
              ? 'bg-gradient-to-r from-velricViolet to-plasmaBlue text-white hover:shadow-lg'
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
}import React, { useState } from "react";

const SubmissionForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: null as File | null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-16">
      <div className="bg-[#1C1C1E] rounded-2xl p-8 md:p-12 shadow-2xl border border-[#6A0DAD]/20 hover:scale-105 transition-all duration-300 hover:shadow-[#6A0DAD]/20 hover:shadow-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-[64px] font-bold font-sora text-white mb-4 antialiased">
            Mission Submission
          </h1>
          <p className="text-[18px] text-[#F5F5F5] font-inter max-w-2xl mx-auto">
            Submit your mission details and files to join our community of
            innovators
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Mission Title */}
          <div className="space-y-3">
            <label className="block text-[18px] font-semibold text-[#F5F5F5] font-inter">
              Mission Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter your mission title"
              required
              className="w-full px-6 py-4 bg-[#0D0D0D] border border-[#6A0DAD]/30 rounded-2xl text-[#F5F5F5] placeholder-[#F5F5F5]/60 text-[18px] font-inter focus:border-[#6A0DAD] focus:ring-2 focus:ring-[#6A0DAD]/20 focus:outline-none transition-all duration-300 hover:border-[#6A0DAD]/50"
            />
          </div>

          {/* Mission Description */}
          <div className="space-y-3">
            <label className="block text-[18px] font-semibold text-[#F5F5F5] font-inter">
              Mission Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your mission in detail..."
              rows={6}
              required
              className="w-full px-6 py-4 bg-[#0D0D0D] border border-[#6A0DAD]/30 rounded-2xl text-[#F5F5F5] placeholder-[#F5F5F5]/60 text-[18px] font-inter focus:border-[#6A0DAD] focus:ring-2 focus:ring-[#6A0DAD]/20 focus:outline-none transition-all duration-300 hover:border-[#6A0DAD]/50 resize-none"
            />
          </div>

          {/* File Upload */}
          <div className="space-y-3">
            <label className="block text-[18px] font-semibold text-[#F5F5F5] font-inter">
              Upload Supporting Files
            </label>
            <div className="relative">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="border-2 border-dashed border-[#6A0DAD]/30 rounded-2xl p-8 text-center hover:border-[#6A0DAD]/50 hover:bg-[#6A0DAD]/5 transition-all duration-300">
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#6A0DAD] to-[#00D9FF] rounded-2xl flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[18px] text-[#F5F5F5] font-inter">
                      {formData.file
                        ? formData.file.name
                        : "Click to upload files"}
                    </p>
                    <p className="text-[14px] text-[#F5F5F5]/60 font-inter mt-2">
                      PDF, DOC, TXT, JPG, PNG up to 10MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Email */}
            <div className="space-y-3">
              <label className="block text-[18px] font-semibold text-[#F5F5F5] font-inter">
                Contact Email *
              </label>
              <input
                type="email"
                name="email"
                placeholder="your.email@example.com"
                required
                className="w-full px-6 py-4 bg-[#0D0D0D] border border-[#6A0DAD]/30 rounded-2xl text-[#F5F5F5] placeholder-[#F5F5F5]/60 text-[18px] font-inter focus:border-[#6A0DAD] focus:ring-2 focus:ring-[#6A0DAD]/20 focus:outline-none transition-all duration-300 hover:border-[#6A0DAD]/50"
              />
            </div>

            {/* Priority Level */}
            <div className="space-y-3">
              <label className="block text-[18px] font-semibold text-[#F5F5F5] font-inter">
                Priority Level
              </label>
              <select className="w-full px-6 py-4 bg-[#0D0D0D] border border-[#6A0DAD]/30 rounded-2xl text-[#F5F5F5] text-[18px] font-inter focus:border-[#6A0DAD] focus:ring-2 focus:ring-[#6A0DAD]/20 focus:outline-none transition-all duration-300 hover:border-[#6A0DAD]/50">
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#6A0DAD] to-[#00D9FF] text-white font-bold text-[18px] py-4 px-8 rounded-2xl hover:scale-105 hover:shadow-[#6A0DAD]/30 hover:shadow-2xl transition-all duration-300 font-sora antialiased"
            >
              Submit Mission
            </button>
          </div>

          {/* Footer Note */}
          <div className="text-center pt-4">
            <p className="text-[14px] text-[#F5F5F5]/60 font-inter">
              By submitting, you agree to our terms and conditions
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmissionForm;
