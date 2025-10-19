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
      <div>
        <label
          htmlFor="submissionText"
          className="block text-sm font-medium text-white mb-2"
        >
          Your Mission Submission
        </label>
        <textarea
          id="submissionText"
          value={submissionText}
          onChange={(e) => setSubmissionText(e.target.value)}
          disabled={isLoading}
          placeholder="Write your thoughts, solution, or explanation here..."
          className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors resize-none"
          rows={6}
        />
      </div>

      <motion.button
        type="submit"
        disabled={isLoading || !submissionText.trim()}
        className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300
          ${
            submissionText.trim() && !isLoading
              ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:shadow-lg"
              : "bg-gray-700 text-gray-400 cursor-not-allowed"
          }`}
        whileHover={submissionText.trim() && !isLoading ? { scale: 1.02 } : {}}
        whileTap={submissionText.trim() && !isLoading ? { scale: 0.98 } : {}}
      >
        {isLoading ? <LoadingSpinner size="sm" /> : "Submit Mission"}
      </motion.button>
    </motion.form>
  );
}
