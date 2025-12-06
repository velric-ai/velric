import { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";

interface SubmissionFormProps {
  onSubmit: (data: { submissionText: string; code?: string; language?: string }) => void;
  isLoading: boolean;
  code?: string;
  language?: string;
}

export default function SubmissionForm({
  onSubmit,
  isLoading,
  code = '',
  language = 'python',
}: SubmissionFormProps) {
  const [submissionText, setSubmissionText] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  const showWarningMessage = (message: string) => {
    setWarningMessage(message);
    setShowWarning(true);
    setTimeout(() => setShowWarning(false), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionText.trim()) return;
    onSubmit({ 
      submissionText: submissionText.trim(),
      code,
      language,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1C1C1E] rounded-2xl p-8 border border-gray-800 space-y-6"
    >
      <h3 className="text-xl font-bold text-white mb-4">
        Submit Your Response
      </h3>
      <p className="text-gray-400 mb-6">
        Describe your approach to this mission, your solution, or any relevant experience.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Submission Text Input */}
        <div>
          <label htmlFor="submissionText" className="block text-sm font-medium text-white mb-2">
            Your Response *
          </label>
          <textarea
            id="submissionText"
            value={submissionText}
            onChange={(e) => setSubmissionText(e.target.value)}
            disabled={isLoading}
            onContextMenu={(e) => {
              e.preventDefault();
              showWarningMessage('❌ Right-click is disabled');
            }}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) {
                e.preventDefault();
                showWarningMessage('❌ Copy is not allowed');
              } else if ((e.ctrlKey || e.metaKey) && (e.key === 'v' || e.key === 'V')) {
                e.preventDefault();
                showWarningMessage('❌ Paste is not allowed');
              }
            }}
            onPaste={(e) => {
              e.preventDefault();
              showWarningMessage('❌ Paste is not allowed');
            }}
            placeholder="Describe your approach to this mission, your solution, or any relevant experience..."
            className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors resize-none min-h-[120px]"
            required
          />
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isLoading || !submissionText.trim()}
          className={`
            w-full py-4 px-6 rounded-lg font-medium transition-all duration-300 text-lg
            ${submissionText.trim() && !isLoading
              ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:shadow-lg'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }
          `}
          whileHover={submissionText.trim() && !isLoading ? { scale: 1.02 } : {}}
          whileTap={submissionText.trim() && !isLoading ? { scale: 0.98 } : {}}
        >
          {isLoading ? (
            <LoadingSpinner size="sm" />
          ) : (
            'Submit Mission Response'
          )}
        </motion.button>
      </form>

      {/* Warning Message */}
      {showWarning && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-500/90 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg z-50"
        >
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">{warningMessage}</span>
        </motion.div>
      )}
    </motion.div>
  );
}
