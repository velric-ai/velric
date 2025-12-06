import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface GeneralInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
}

export default function GeneralInstructionsModal({
  isOpen,
  onClose,
  onAgree,
}: GeneralInstructionsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 md:py-0"
          >
            <div className="bg-[#1C1C1E] border border-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header with Close Button */}
              <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-800 bg-[#1C1C1E]">
                <h2 className="text-2xl font-bold text-white">
                  General Instructions
                </h2>
                <motion.button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-6 h-6 text-gray-400" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Important Notice */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="text-yellow-400 font-semibold text-sm">
                    ⚠️ Please read the guidelines carefully before proceeding.
                  </p>
                </div>

                {/* Main Instructions */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">
                      Mission Guidelines
                    </h3>
                    <ol className="space-y-3">
                      {/* Tab Switching */}
                      <li className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-red-500/20 border border-red-500/50">
                            <span className="text-red-400 font-semibold text-sm">
                              1
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-white font-semibold mb-1">
                            Tab Switching is Monitored
                          </p>
                          <p className="text-gray-400 text-sm">
                            Your activity is monitored. Every time you switch away from this page and come back, it will be recorded. Try to minimize tab switching during the mission.
                          </p>
                        </div>
                      </li>

                      {/* Copy Paste */}
                      <li className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-red-500/20 border border-red-500/50">
                            <span className="text-red-400 font-semibold text-sm">
                              2
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-white font-semibold mb-1">
                            Copy Paste is Not Allowed
                          </p>
                          <p className="text-gray-400 text-sm">
                            Copy-pasting is strictly disabled during this mission. You must write all code and responses manually. This helps assess your true understanding and skills.
                          </p>
                        </div>
                      </li>

                      {/* Focus and Concentration */}
                      <li className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-500/20 border border-blue-500/50">
                            <span className="text-blue-400 font-semibold text-sm">
                              3
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-white font-semibold mb-1">
                            Stay Focused
                          </p>
                          <p className="text-gray-400 text-sm">
                            Keep your focus on the mission. Minimize distractions and dedicate yourself to completing the task within the estimated time. This helps us understand your ability to work under normal conditions.
                          </p>
                        </div>
                      </li>

                      {/* Quality Over Speed */}
                      <li className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-500/20 border border-green-500/50">
                            <span className="text-green-400 font-semibold text-sm">
                              4
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-white font-semibold mb-1">
                            Quality Over Speed
                          </p>
                          <p className="text-gray-400 text-sm">
                            Take your time to produce quality work. A well-thought-out solution is better than a rushed one. Clear, maintainable, and efficient code is highly valued.
                          </p>
                        </div>
                      </li>

                      {/* Use Available Resources */}
                      <li className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-500/20 border border-purple-500/50">
                            <span className="text-purple-400 font-semibold text-sm">
                              5
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-white font-semibold mb-1">
                            Use Built-in Code Editor
                          </p>
                          <p className="text-gray-400 text-sm">
                            A code editor is provided on the next page. Write your solution directly in the editor. The built-in IDE has all the features you need to complete the task.
                          </p>
                        </div>
                      </li>
                    </ol>
                  </div>
                </div>

                {/* Acknowledgment */}
                <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4">
                  <p className="text-gray-300 text-sm">
                    By clicking "I Agree" below, you acknowledge that you have read and understood these guidelines and agree to follow them during the mission.
                  </p>
                </div>
              </div>

              {/* Footer with Buttons */}
              <div className="sticky bottom-0 flex gap-3 p-6 border-t border-gray-800 bg-[#1C1C1E]">
                <motion.button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 rounded-lg font-medium text-white border border-gray-700 hover:bg-gray-800 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={onAgree}
                  className="flex-1 px-4 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-velricViolet to-plasmaBlue hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  I Agree & Continue
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
