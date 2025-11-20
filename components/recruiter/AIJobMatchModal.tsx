import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Search, TrendingUp } from "lucide-react";
import { Candidate, mockCandidates } from "@/lib/mockCandidates";
import { getClusterById, mapSkillToClusters } from "@/lib/skillClusters";

interface AIJobMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidates?: Candidate[]; // Optional, defaults to mockCandidates
}

interface MatchResult {
  candidate: Candidate;
  matchScore: number;
  matchedClusters: string[];
  overlapPercentage: number;
}

export default function AIJobMatchModal({ isOpen, onClose, candidates = mockCandidates }: AIJobMatchModalProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const generateMatches = () => {
    if (!jobDescription.trim()) return;

    setIsProcessing(true);
    setHasSearched(true);

    // Simulate processing delay
    setTimeout(() => {
      // Extract keywords from job description
      const descriptionLower = jobDescription.toLowerCase();
      const words = descriptionLower.split(/\s+/).filter(w => w.length > 3);
      
      // Find clusters mentioned in job description
      const mentionedClusters = new Set<string>();
      for (const word of words) {
        const clusters = mapSkillToClusters(word);
        clusters.forEach(c => mentionedClusters.add(c));
      }

      // Calculate matches
      const results: MatchResult[] = candidates.map(candidate => {
        // Count cluster overlaps
        const candidateClusters = new Set([
          ...candidate.clusters.core_stack,
          ...candidate.clusters.domain_tags,
          ...candidate.clusters.strength_tags
        ]);

        const matchedClusters = Array.from(mentionedClusters).filter(c => candidateClusters.has(c));
        const overlapPercentage = mentionedClusters.size > 0 
          ? (matchedClusters.length / mentionedClusters.size) * 100 
          : 0;

        // Match score: 60% Velric Score + 40% cluster overlap
        const matchScore = Math.round(
          candidate.velricScore * 0.6 + 
          Math.min(overlapPercentage, 100) * 0.4
        );

        return {
          candidate,
          matchScore,
          matchedClusters,
          overlapPercentage: Math.round(overlapPercentage)
        };
      });

      // Sort by match score (descending), then by Velric Score
      results.sort((a, b) => {
        if (b.matchScore !== a.matchScore) {
          return b.matchScore - a.matchScore;
        }
        return b.candidate.velricScore - a.candidate.velricScore;
      });

      setMatches(results);
      setIsProcessing(false);
    }, 1500);
  };

  const handleClose = () => {
    setJobDescription("");
    setMatches([]);
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
                Paste Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here... For example: 'Looking for a Senior Frontend Developer with React, TypeScript experience. Must have experience with Next.js and modern UI/UX design.'"
                className="w-full h-32 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
              />
              <button
                onClick={generateMatches}
                disabled={!jobDescription.trim() || isProcessing}
                className="mt-4 w-full px-6 py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                style={{
                  background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
                }}
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Generating Matches...</span>
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
                    {matches.length} Candidate{matches.length !== 1 ? 's' : ''} Found
                  </h3>
                  {matches.length > 0 && (
                    <span className="text-sm text-white/60">
                      Sorted by match score
                    </span>
                  )}
                </div>

                {matches.length === 0 ? (
                  <div className="p-8 text-center rounded-xl bg-white/5 border border-white/10">
                    <p className="text-white/60">No matches found. Try adjusting your job description.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {matches.map((match, index) => (
                      <motion.div
                        key={match.candidate.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/30 transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-lg font-semibold text-white">
                                {match.candidate.name}
                              </h4>
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                #{index + 1}
                              </span>
                            </div>
                            <p className="text-sm text-white/60 mb-2">
                              {match.candidate.domain} • Velric Score: {match.candidate.velricScore}
                            </p>
                            {match.candidate.location && (
                              <p className="text-xs text-white/50">{match.candidate.location}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-2 mb-1">
                              <TrendingUp className="w-4 h-4 text-cyan-400" />
                              <span className="text-2xl font-bold text-cyan-300">
                                {match.matchScore}%
                              </span>
                            </div>
                            <p className="text-xs text-white/60">Match Score</p>
                            <p className="text-xs text-cyan-400 mt-1">
                              {match.overlapPercentage}% overlap
                            </p>
                          </div>
                        </div>

                        {match.matchedClusters.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-white/10">
                            <p className="text-xs text-white/60 mb-2">Matched Clusters:</p>
                            <div className="flex flex-wrap gap-2">
                              {match.matchedClusters.slice(0, 5).map((clusterId) => {
                                const cluster = getClusterById(clusterId);
                                if (!cluster) return null;
                                return (
                                  <span
                                    key={clusterId}
                                    className="px-2 py-1 rounded-full text-xs border"
                                    style={{
                                      background: `${cluster.color}20`,
                                      borderColor: `${cluster.color}60`,
                                      color: 'white'
                                    }}
                                  >
                                    {cluster.name}
                                  </span>
                                );
                              })}
                              {match.matchedClusters.length > 5 && (
                                <span className="px-2 py-1 rounded-full text-xs text-white/60">
                                  +{match.matchedClusters.length - 5} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {match.candidate.about && (
                          <p className="mt-3 text-sm text-white/70 line-clamp-2">
                            {match.candidate.about}
                          </p>
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

