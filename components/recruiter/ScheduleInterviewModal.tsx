import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Search, Sparkles, User } from "lucide-react";
import { useSnackbar } from "@/hooks/useSnackbar";
import ScheduleInterviewFormModal from "./ScheduleInterviewFormModal";

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScheduleInterview?: (userId: string, userName: string) => void;
}

interface SearchResult {
  id: string;
  name: string;
  email: string;
  velricScore?: number;
  domain?: string;
  location?: string;
  matchReason?: string;
}

export default function ScheduleInterviewModal({
  isOpen,
  onClose,
  onScheduleInterview,
}: ScheduleInterviewModalProps) {
  const { showSnackbar } = useSnackbar();
  const [aiPrompt, setAiPrompt] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<{
    id: string;
    name: string;
    email?: string;
  } | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const handleSearch = async () => {
    if (!aiPrompt.trim()) {
      showSnackbar("Please enter a search prompt", "error");
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    try {
      console.log("Sending prompt to API:", aiPrompt);
      
      const response = await fetch("/api/recruiter/search-candidates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      // Check if response is ok
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { error: `HTTP error! status: ${response.status}` };
        }
        const errorMessage = errorData.error || `Server error: ${response.status}`;
        showSnackbar(errorMessage, "error");
        setSearchResults([]);
        return;
      }

      const result = await response.json();

      if (!result.success) {
        const errorMessage = result.error || "Failed to search candidates";
        showSnackbar(errorMessage, "error");
        setSearchResults([]);
        return;
      }

      const candidates = result.candidates || [];
      setSearchResults(candidates);

      // Show success message
      if (candidates.length > 0) {
        showSnackbar(`Found ${candidates.length} candidate${candidates.length !== 1 ? 's' : ''}`, "success");
      } else {
        showSnackbar("No candidates found. Try adjusting your search prompt.", "info");
      }
    } catch (err: any) {
      console.error("Error searching candidates:", err);
      
      // Determine error message based on error type
      let errorMessage = "Failed to search candidates. Please try again.";
      
      if (err instanceof TypeError && err.message.includes("fetch")) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (err instanceof SyntaxError) {
        errorMessage = "Invalid response from server. Please try again.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      showSnackbar(errorMessage, "error");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleScheduleInterview = (userId: string, userName: string, userEmail?: string) => {
    setSelectedCandidate({ id: userId, name: userName, email: userEmail });
    setIsFormModalOpen(true);
  };

  const handleClose = () => {
    setAiPrompt("");
    setSearchResults([]);
    setHasSearched(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl"
          style={{
            background: "rgba(15, 23, 42, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Schedule Interview</h2>
                <p className="text-sm text-white/60">Search candidates using AI-powered prompt</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-white/70" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] custom-scroll">
            {/* AI Prompt Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white/80 mb-2">
                Enter Search Prompt (This will be analyzed by AI to find matching candidates)
              </label>
              <textarea
                value={aiPrompt}
                onChange={(e) => {
                  setAiPrompt(e.target.value);
                }}
                placeholder="Enter your search prompt here. Examples:
- 'show all candidate with arvind khandal name'
- 'Looking for a Senior Frontend Developer with React, TypeScript experience'
- 'Find candidates with Python and Machine Learning skills in Technology industry'
- 'Search for developers with 5+ years experience in Backend Development'"
                className="w-full h-32 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
              />
              <button
                onClick={handleSearch}
                disabled={!aiPrompt.trim() || isSearching}
                className="mt-4 w-full px-6 py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                style={{
                  background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
                }}
              >
                {isSearching ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Searching Candidates...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>Search Candidates</span>
                  </>
                )}
              </button>
            </div>

            {/* Results */}
            {hasSearched && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    {searchResults.length} Candidate{searchResults.length !== 1 ? 's' : ''} Found
                  </h3>
                </div>

                {searchResults.length === 0 ? (
                  <div className="p-8 text-center rounded-xl bg-white/5 border border-white/10">
                    <p className="text-white/60">No candidates found. Try adjusting your search prompt.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {searchResults.map((candidate, index) => (
                      <motion.div
                        key={candidate.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/30 transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h4 className="text-lg font-semibold text-white">
                                  {candidate.name}
                                </h4>
                                <p className="text-sm text-white/60">{candidate.email}</p>
                              </div>
                            </div>
                            {candidate.domain && (
                              <p className="text-sm text-white/60 mb-1">
                                {candidate.domain}
                                {candidate.velricScore && ` • Velric Score: ${candidate.velricScore}`}
                              </p>
                            )}
                            {candidate.location && (
                              <p className="text-xs text-white/50">{candidate.location}</p>
                            )}
                            {candidate.matchReason && (
                              <p className="text-xs text-cyan-400 mt-2">{candidate.matchReason}</p>
                            )}
                          </div>
                          <button
                            onClick={() => handleScheduleInterview(candidate.id, candidate.name, candidate.email)}
                            className="px-4 py-2 rounded-lg font-medium text-white transition-all flex items-center space-x-2"
                            style={{
                              background: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
                            }}
                          >
                            <Calendar className="w-4 h-4" />
                            <span>Schedule</span>
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Schedule Interview Form Modal */}
        {selectedCandidate && (
          <ScheduleInterviewFormModal
            isOpen={isFormModalOpen}
            onClose={() => {
              setIsFormModalOpen(false);
              setSelectedCandidate(null);
            }}
            candidateId={selectedCandidate.id}
            candidateName={selectedCandidate.name}
            candidateEmail={selectedCandidate.email}
          />
        )}
      </div>
    </AnimatePresence>
  );
}

