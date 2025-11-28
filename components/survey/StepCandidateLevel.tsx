import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, AlertCircle } from "lucide-react";

interface StepCandidateLevelProps {
  formData: any;
  updateFormData: (updates: any) => void;
  onNext: () => void;
  onPrev: () => void;
  canProceed: boolean;
  isSubmitting: boolean;
}

const LEVELS = ["Beginner", "Intermediate", "Professional"];

export function StepCandidateLevel({
  formData,
  updateFormData,
  onNext,
  onPrev,
  canProceed,
  isSubmitting,
}: StepCandidateLevelProps) {
  const [selectedLevel, setSelectedLevel] = useState(formData.level?.value || "");

  useEffect(() => {
    const error = !selectedLevel ? "Please select your level" : null;
    updateFormData({
      level: {
        value: selectedLevel,
        error,
        touched: true,
      },
    });
  }, [selectedLevel, updateFormData]);

  const handleLevelSelect = (level: string) => {
    setSelectedLevel(level);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && canProceed && !isSubmitting) {
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
          What is your current level?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-white/70"
        >
          Select the option that best describes your experience level.
        </motion.p>
      </div>
      <div className="p-8 rounded-2xl backdrop-blur-sm border border-white/10 space-y-8" style={{ background: "rgba(255, 255, 255, 0.05)" }}>
        <div className="flex flex-col gap-6">
          {LEVELS.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => handleLevelSelect(level)}
              onKeyDown={handleKeyDown}
              className={`w-full px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 border border-white/20 text-white bg-white/5 hover:bg-purple-500/10 focus:outline-none focus:ring-2 focus:ring-purple-500 ${selectedLevel === level ? "border-purple-500 bg-purple-500/20" : ""}`}
            >
              {level}
              {selectedLevel === level && <Check className="inline-block ml-2 w-5 h-5 text-green-400" />}
            </button>
          ))}
        </div>
        {formData.level?.error && (
          <div className="flex items-center space-x-2 mt-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <p className="text-sm text-red-400">{formData.level.error}</p>
          </div>
        )}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onPrev}
            className="px-8 py-4 rounded-xl font-semibold text-white bg-gray-700 hover:bg-gray-600 transition-all duration-300"
          >
            Back
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!canProceed || isSubmitting}
            className={`px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 ${canProceed && !isSubmitting ? "bg-gradient-to-r from-purple-500 to-cyan-400 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25" : "bg-gray-600 cursor-not-allowed opacity-50"}`}
          >
            {isSubmitting ? "Processing..." : "Continue"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
