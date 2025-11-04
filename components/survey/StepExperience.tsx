import React from 'react';

interface StepExperienceProps {
  formData: any;
  updateFormData: (updates: any) => void;
  onNext: () => void;
  onPrev: () => void;
  canProceed: (step?: number) => boolean;
  isSubmitting: boolean;
}

export function StepExperience({ 
  formData, 
  updateFormData, 
  onNext, 
  onPrev, 
  canProceed, 
  isSubmitting 
}: StepExperienceProps) {
  const [characterCount, setCharacterCount] = React.useState(
    formData.experienceSummary?.value?.length || 0
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setCharacterCount(value.length);
    
    updateFormData({
      experienceSummary: {
        value: value,
        error: null,
        touched: true,
      }
    });
  };

  const handleNext = () => {
    if (!formData.experienceSummary?.value?.trim()) {
      updateFormData({
        experienceSummary: {
          ...formData.experienceSummary,
          error: 'Please share your experience and accomplishments',
          touched: true,
        }
      });
      return;
    }
    
    // Clear any errors before proceeding
    updateFormData({
      experienceSummary: {
        ...formData.experienceSummary,
        error: null,
      }
    });
    
    onNext();
  };

  const handlePrev = () => {
    onPrev();
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      {/* Progress Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          Share Your Experience
        </h2>
        <p className="text-white/60 text-sm">
          Step 7 of 8
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Instruction Box */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <p className="text-white text-sm leading-relaxed">
            Please provide a thorough and concise summary of everything you have 
            accomplished in your professional journey so far. Include your work experience, 
            training programs, completed projects, and any other relevant accomplishments 
            from A to Z.
          </p>
        </div>

        {/* Textarea Section */}
        <div className="space-y-2">
          <label className="text-white font-medium text-sm block">
            Professional Background
          </label>
          
          <textarea
            value={formData.experienceSummary?.value || ''}
            onChange={handleChange}
            placeholder="Write about your work experience, training, projects, achievements, and everything relevant to your professional journey..."
            className="w-full h-72 bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-colors resize-none"
          />
          
          {/* Error Message & Character Count */}
          <div className="flex justify-between items-center">
            <div>
              {formData.experienceSummary?.error && (
                <p className="text-red-400 text-sm font-medium">
                  {formData.experienceSummary.error}
                </p>
              )}
            </div>
            <p className="text-white/50 text-xs">
              {characterCount} characters
            </p>
          </div>
        </div>

        {/* Helpful Tips */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <p className="text-white/70 text-sm font-medium mb-3">💡 Tips for a great experience summary:</p>
          <ul className="text-white/60 text-sm space-y-2">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Be thorough - include all relevant experiences and accomplishments</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Be concise - avoid unnecessary or irrelevant details</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Cover A to Z - from your earliest experiences to present</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Include work experience, training, projects, and achievements</span>
            </li>
          </ul>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4 mt-8">
          <button
            type="button"
            onClick={handlePrev}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/10 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Back
          </button>
          
          <button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting || !formData.experienceSummary?.value?.trim()}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Processing...' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}