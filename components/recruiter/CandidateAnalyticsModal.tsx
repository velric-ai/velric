import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, Zap, Target, BookOpen, ChevronDown } from "lucide-react";

interface CandidateAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateId: string;
  candidateName: string;
}

interface AnalyticsData {
  missionsCompleted: number;
  averageScore: number;
  skillsAcquired: string[];
  learningPath: string;
  completionRate: number;
  timeSpent: number;
  missionsByDomain: Record<string, number>;
  recentActivity: Array<{
    date: string;
    mission: string;
    score: number;
  }>;
  allMissions: Array<{
    id: string;
    mission_id: string;
    title: string;
    field?: string;
    category?: string;
    status: string;
    grade?: number;
    velric_score?: number;
    letter_grade?: string;
    feedback?: string;
    feedback_text?: string;
    summary?: string;
    submission_text?: string;
    tab_switch_count?: number;
    started_at?: string;
    completed_at?: string;
    created_at?: string;
    grades?: any;
    rubric?: any;
    positive_templates?: any;
    improvement_templates?: any;
  }>;
}

export default function CandidateAnalyticsModal({
  isOpen,
  onClose,
  candidateId,
  candidateName,
}: CandidateAnalyticsModalProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedMission, setExpandedMission] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !candidateId) return;

    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/recruiter/candidate-analytics?userId=${candidateId}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch analytics: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.success && data.analytics) {
          setAnalytics(data.analytics);
        } else {
          throw new Error(data.error || "Failed to load analytics");
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
        // Set empty state on error so user knows it failed
        setAnalytics(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [isOpen, candidateId]);

  if (!isOpen) return null;

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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[111] flex items-center justify-center p-4 pointer-events-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl pointer-events-auto"
              style={{
                background: "rgba(15, 23, 42, 1)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
              }}
            >
              {/* Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-blue-500 to-cyan-500">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-6 h-6 text-white" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">Analytics</h2>
                    <p className="text-sm text-white/70">{candidateName}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : analytics ? (
                  <div className="space-y-6">
                    {/* Learning Path */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="p-6 rounded-xl bg-white/5 border border-white/10"
                    >
                      <h3 className="text-lg font-semibold text-white mb-3">Learning Path</h3>
                      <p className="text-cyan-300 text-lg font-medium">
                        {analytics.learningPath}
                      </p>
                    </motion.div>

                    {/* Skills Acquired */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="p-6 rounded-xl bg-white/5 border border-white/10"
                    >
                      <h3 className="text-lg font-semibold text-white mb-4">
                        Skills Acquired
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {analytics.skillsAcquired.map((skill, idx) => (
                          <motion.span
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 + idx * 0.1 }}
                            className="px-4 py-2 rounded-full text-sm font-medium border border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>

                    {/* Missions by Domain */}
                    {Object.keys(analytics.missionsByDomain).length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="p-6 rounded-xl bg-white/5 border border-white/10"
                      >
                        <h3 className="text-lg font-semibold text-white mb-4">
                          Missions by Domain
                        </h3>
                        <div className="space-y-3">
                          {Object.entries(analytics.missionsByDomain).map(
                            ([domain, count], idx) => (
                              <div key={idx} className="flex items-center justify-between">
                                <span className="text-white/80">{domain}</span>
                                <div className="flex items-center space-x-3">
                                  <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                                      style={{
                                        width: `${(count / Math.max(...Object.values(analytics.missionsByDomain))) * 100}%`,
                                      }}
                                    ></div>
                                  </div>
                                  <span className="text-cyan-300 font-semibold w-8 text-right">
                                    {count}
                                  </span>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Recent Activity */}
                    {analytics.recentActivity && analytics.recentActivity.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="p-6 rounded-xl bg-white/5 border border-white/10"
                      >
                        <h3 className="text-lg font-semibold text-white mb-4">
                          Recent Activity
                        </h3>
                        <div className="space-y-3">
                          {analytics.recentActivity.map((activity, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-colors"
                            >
                              <div>
                                <p className="text-white font-medium">{activity.mission}</p>
                                <p className="text-xs text-white/50">{activity.date}</p>
                              </div>
                              <div className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30">
                                <p className="text-sm font-semibold text-cyan-300">
                                  {activity.score}%
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* All Missions Data Table */}
                    {analytics.allMissions && analytics.allMissions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="p-6 rounded-xl bg-white/5 border border-white/10"
                      >
                        <h3 className="text-lg font-semibold text-white mb-4">
                          All Missions Data
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-white/10">
                                <th className="text-left px-4 py-2 text-white/70 font-semibold">Mission</th>
                                <th className="text-left px-4 py-2 text-white/70 font-semibold">Category</th>
                                <th className="text-left px-4 py-2 text-white/70 font-semibold">Status</th>
                                <th className="text-left px-4 py-2 text-white/70 font-semibold">Score</th>
                                <th className="text-left px-4 py-2 text-white/70 font-semibold">Grade</th>
                                <th className="text-left px-4 py-2 text-white/70 font-semibold">Tab Switches</th>
                                <th className="text-left px-4 py-2 text-white/70 font-semibold">Completed</th>
                                <th className="text-center px-4 py-2 text-white/70 font-semibold">Details</th>
                              </tr>
                            </thead>
                            <tbody>
                              {analytics.allMissions.map((mission, idx) => (
                                <React.Fragment key={idx}>
                                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="px-4 py-3 text-white">{mission.title}</td>
                                    <td className="px-4 py-3 text-white/70">
                                      {mission.field || mission.category || "-"}
                                    </td>
                                    <td className="px-4 py-3">
                                      <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                          mission.status === "completed"
                                            ? "bg-green-500/20 text-green-300"
                                            : mission.status === "in_progress"
                                            ? "bg-blue-500/20 text-blue-300"
                                            : mission.status === "submitted"
                                            ? "bg-yellow-500/20 text-yellow-300"
                                            : "bg-white/10 text-white/70"
                                        }`}
                                      >
                                        {mission.status}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-cyan-300 font-semibold">
                                      {mission.velric_score
                                        ? Math.round(parseFloat(mission.velric_score as any) * 10) / 10
                                        : "-"}
                                    </td>
                                    <td className="px-4 py-3 text-white/70">
                                      {mission.letter_grade || (mission.grade ? `${Math.round(parseFloat(mission.grade as any))}%` : "-")}
                                    </td>
                                    <td className="px-4 py-3 text-white/70">
                                      {mission.tab_switch_count || 0}
                                    </td>
                                    <td className="px-4 py-3 text-white/70 text-xs">
                                      {mission.completed_at
                                        ? new Date(mission.completed_at).toLocaleDateString()
                                        : "-"}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                      <button
                                        onClick={() =>
                                          setExpandedMission(
                                            expandedMission === mission.id ? null : mission.id
                                          )
                                        }
                                        className="inline-flex items-center justify-center p-1 rounded-lg hover:bg-white/10 transition-colors"
                                      >
                                        <ChevronDown
                                          className={`w-5 h-5 text-cyan-400 transition-transform ${
                                            expandedMission === mission.id ? "rotate-180" : ""
                                          }`}
                                        />
                                      </button>
                                    </td>
                                  </tr>

                                  {/* Expanded Row with Details */}
                                  <AnimatePresence>
                                    {expandedMission === mission.id && (
                                      <tr>
                                        <td colSpan={8} className="px-4 py-0">
                                          <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="bg-white/5 border-t border-white/10 p-4"
                                          >
                                            <div className="space-y-4">
                                              {/* Submission Text */}
                                              {mission.submission_text && (
                                                <div>
                                                  <h4 className="text-sm font-semibold text-cyan-300 mb-2">Submission</h4>
                                                  <div className="bg-white/5 p-3 rounded-lg border border-white/10 max-h-32 overflow-y-auto">
                                                    <p className="text-white/80 text-xs whitespace-pre-wrap">
                                                      {mission.submission_text}
                                                    </p>
                                                  </div>
                                                </div>
                                              )}

                                              {/* Feedback Text */}
                                              {mission.feedback_text && (
                                                <div>
                                                  <h4 className="text-sm font-semibold text-yellow-300 mb-2">Feedback</h4>
                                                  <div className="bg-white/5 p-3 rounded-lg border border-white/10 max-h-32 overflow-y-auto">
                                                    <p className="text-white/80 text-xs whitespace-pre-wrap">
                                                      {mission.feedback_text}
                                                    </p>
                                                  </div>
                                                </div>
                                              )}

                                              {/* Grades */}
                                              {mission.grades && (
                                                <div>
                                                  <h4 className="text-sm font-semibold text-green-300 mb-2">Grades</h4>
                                                  <div className="bg-white/5 p-3 rounded-lg border border-white/10 max-h-32 overflow-y-auto">
                                                    <pre className="text-white/80 text-xs font-mono">
                                                      {typeof mission.grades === "string"
                                                        ? mission.grades
                                                        : JSON.stringify(mission.grades, null, 2)}
                                                    </pre>
                                                  </div>
                                                </div>
                                              )}

                                              {/* Rubric */}
                                              {mission.rubric && (
                                                <div>
                                                  <h4 className="text-sm font-semibold text-purple-300 mb-2">Rubric</h4>
                                                  <div className="bg-white/5 p-3 rounded-lg border border-white/10 max-h-32 overflow-y-auto">
                                                    <pre className="text-white/80 text-xs font-mono">
                                                      {typeof mission.rubric === "string"
                                                        ? mission.rubric
                                                        : JSON.stringify(mission.rubric, null, 2)}
                                                    </pre>
                                                  </div>
                                                </div>
                                              )}

                                              {/* Positive Templates */}
                                              {mission.positive_templates && (
                                                <div>
                                                  <h4 className="text-sm font-semibold text-green-400 mb-2">Positive Feedback Templates</h4>
                                                  <div className="bg-white/5 p-3 rounded-lg border border-white/10 max-h-32 overflow-y-auto">
                                                    <pre className="text-white/80 text-xs font-mono">
                                                      {typeof mission.positive_templates === "string"
                                                        ? mission.positive_templates
                                                        : JSON.stringify(mission.positive_templates, null, 2)}
                                                    </pre>
                                                  </div>
                                                </div>
                                              )}

                                              {/* Improvement Templates */}
                                              {mission.improvement_templates && (
                                                <div>
                                                  <h4 className="text-sm font-semibold text-orange-400 mb-2">Improvement Suggestions</h4>
                                                  <div className="bg-white/5 p-3 rounded-lg border border-white/10 max-h-32 overflow-y-auto">
                                                    <pre className="text-white/80 text-xs font-mono">
                                                      {typeof mission.improvement_templates === "string"
                                                        ? mission.improvement_templates
                                                        : JSON.stringify(mission.improvement_templates, null, 2)}
                                                    </pre>
                                                  </div>
                                                </div>
                                              )}

                                              {!mission.submission_text &&
                                                !mission.feedback_text &&
                                                !mission.grades &&
                                                !mission.rubric &&
                                                !mission.positive_templates &&
                                                !mission.improvement_templates && (
                                                  <p className="text-white/60 text-sm">
                                                    No additional details available for this mission.
                                                  </p>
                                                )}
                                            </div>
                                          </motion.div>
                                        </td>
                                      </tr>
                                    )}
                                  </AnimatePresence>
                                </React.Fragment>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-20 text-white/60">
                    <p>Failed to load analytics data</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
