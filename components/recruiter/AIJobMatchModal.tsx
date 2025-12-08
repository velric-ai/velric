import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Search, TrendingUp, MapPin, User, GraduationCap, BookOpen, Code } from "lucide-react";
import { useSnackbar } from "@/hooks/useSnackbar";

interface AIJobMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  name: string;
  email: string;
  velricScore?: number;
  missionsCompleted?: number;
  domain?: string;
  location?: string;
  profile_image?: string | null;
  matchReason?: string;
  industry?: string;
  mission_focus?: string[];
  strength_areas?: string[];
  experience_summary?: string;
  education_level?: string;
  learning_preference?: string;
  skills?: string[];
}

export default function AIJobMatchModal({ isOpen, onClose }: AIJobMatchModalProps) {
  const { showSnackbar } = useSnackbar();
  const [jobDescription, setJobDescription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!jobDescription.trim()) {
      showSnackbar("Please enter a job description or search prompt", "error");
      return;
    }

    setIsProcessing(true);
    setHasSearched(true);

    try {
      console.log("Sending prompt to API:", jobDescription);
      
      const response = await fetch("/api/recruiter/search-candidates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: jobDescription }),
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
        showSnackbar("No candidates found. Try adjusting your job description.", "info");
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
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setJobDescription("");
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
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">AI Job Match</h2>
                <p className="text-sm text-white/60">Find the best candidates for your role</p>
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
            {/* Job Description Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white/80 mb-2">
                Enter Job Description or Search Prompt
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Enter job description or search prompt. Examples:
- 'Looking for a Senior Frontend Developer with React, TypeScript experience'
- 'Find candidates with Python and Machine Learning skills in Technology industry'
- 'Search for developers with 5+ years experience in Backend Development'
- 'Show all candidates with React and Next.js experience'"
                className="w-full h-32 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
              />
              <button
                onClick={handleSearch}
                disabled={!jobDescription.trim() || isProcessing}
                className="mt-4 w-full px-6 py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                style={{
                  background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
                }}
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Searching Candidates...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>Generate Candidate Matches</span>
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
                  {searchResults.length > 0 && (
                    <span className="text-sm text-white/60">
                      Sorted by match score
                    </span>
                  )}
                </div>

                {searchResults.length === 0 ? (
                  <div className="p-8 text-center rounded-xl bg-white/5 border border-white/10">
                    <p className="text-white/60">No matches found. Try adjusting your job description.</p>
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
                        {/* Header with Profile Image, Name, and Score */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-3 flex-1">
                            {/* Profile Image */}
                            <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center border border-cyan-500/30 overflow-hidden flex-shrink-0">
                              {candidate.profile_image ? (
                                <img
                                  src={candidate.profile_image}
                                  alt={candidate.name}
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                <User className="w-6 h-6 text-cyan-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-3 mb-1">
                                <h4 className="text-lg font-semibold text-white">
                                  {candidate.name}
                                </h4>
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                  #{index + 1}
                                </span>
                              </div>
                              <p className="text-sm text-white/60 mb-1">
                                {candidate.email}
                              </p>
                              {candidate.domain && (
                                <p className="text-sm text-white/70 mb-1 font-medium">
                                  {candidate.domain}
                                </p>
                              )}
                              {candidate.industry && (
                                <p className="text-xs text-white/50 mb-1">
                                  {candidate.industry}
                                </p>
                              )}
                              {candidate.location && (
                                <div className="flex items-center text-xs text-white/50 mb-1">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {candidate.location}
                                </div>
                              )}
                              {candidate.matchReason && (
                                <p className="text-xs text-cyan-400 mt-2">
                                  {candidate.matchReason}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            {candidate.velricScore !== undefined && (
                              <>
                                <div className="flex items-center space-x-2 mb-1">
                                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                                  <span className="text-2xl font-bold text-cyan-300">
                                    {candidate.velricScore.toFixed(1)}
                                  </span>
                                </div>
                                <p className="text-xs text-white/60">Velric Score</p>
                                {candidate.missionsCompleted !== undefined && (
                                  <p className="text-xs text-white/50 mt-1">
                                    {candidate.missionsCompleted} missions
                                  </p>
                                )}
                              </>
                            )}
                          </div>
                        </div>

                        {/* Skills */}
                        {candidate.skills && candidate.skills.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-white/10">
                            <div className="flex items-center gap-2 mb-2">
                              <Code className="w-4 h-4 text-white/60" />
                              <p className="text-xs text-white/60 font-medium">Skills:</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {candidate.skills.slice(0, 8).map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 rounded-lg text-xs border border-blue-500/30 bg-blue-500/20 text-blue-300"
                                >
                                  {skill}
                                </span>
                              ))}
                              {candidate.skills.length > 8 && (
                                <span className="px-2 py-1 rounded-lg text-xs text-white/60 border border-white/10">
                                  +{candidate.skills.length - 8} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Mission Focus and Strength Areas */}
                        {(candidate.mission_focus && candidate.mission_focus.length > 0) || 
                         (candidate.strength_areas && candidate.strength_areas.length > 0) ? (
                          <div className="mt-3 pt-3 border-t border-white/10">
                            {candidate.mission_focus && candidate.mission_focus.length > 0 && (
                              <div className="mb-2">
                                <p className="text-xs text-white/60 mb-1 font-medium">Mission Focus:</p>
                                <div className="flex flex-wrap gap-2">
                                  {candidate.mission_focus.slice(0, 5).map((focus, idx) => (
                                    <span
                                      key={idx}
                                      className="px-2 py-1 rounded-full text-xs border border-cyan-500/30 bg-cyan-500/20 text-cyan-300"
                                    >
                                      {focus}
                                    </span>
                                  ))}
                                  {candidate.mission_focus.length > 5 && (
                                    <span className="px-2 py-1 rounded-full text-xs text-white/60">
                                      +{candidate.mission_focus.length - 5} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                            {candidate.strength_areas && candidate.strength_areas.length > 0 && (
                              <div>
                                <p className="text-xs text-white/60 mb-1 font-medium">Strengths:</p>
                                <div className="flex flex-wrap gap-2">
                                  {candidate.strength_areas.slice(0, 5).map((strength, idx) => (
                                    <span
                                      key={idx}
                                      className="px-2 py-1 rounded-full text-xs border border-purple-500/30 bg-purple-500/20 text-purple-300"
                                    >
                                      {strength}
                                    </span>
                                  ))}
                                  {candidate.strength_areas.length > 5 && (
                                    <span className="px-2 py-1 rounded-full text-xs text-white/60">
                                      +{candidate.strength_areas.length - 5} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : null}

                        {/* Education and Learning Preference */}
                        {(candidate.education_level || candidate.learning_preference) && (
                          <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                            {candidate.education_level && (
                              <div className="flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-white/60" />
                                <p className="text-xs text-white/60">
                                  <span className="font-medium">Education:</span> {candidate.education_level}
                                </p>
                              </div>
                            )}
                            {candidate.learning_preference && (
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-white/60" />
                                <p className="text-xs text-white/60">
                                  <span className="font-medium">Learning Style:</span> {candidate.learning_preference}
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Experience Summary */}
                        {candidate.experience_summary && (
                          <div className="mt-3 pt-3 border-t border-white/10">
                            <p className="text-xs text-white/60 mb-2 font-medium">Experience Summary:</p>
                            <p className="text-sm text-white/70 line-clamp-3">
                              {candidate.experience_summary}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

