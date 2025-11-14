import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { ProtectedDashboardRoute } from "../components/auth/ProtectedRoute";
import DashboardNavigation from "@/components/dashboard/DashboardNavigation";
import { CheckCircle, Clock, FileText, Award, X, Target } from "lucide-react";

function AnalyticsContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('analytics');
  const [user, setUser] = useState<any>(null);
  const [missions, setMissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedMissionId, setExpandedMissionId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem("velric_user");
      if (!userData) {
        router.push("/login");
        return;
      }
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        router.push("/login");
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!user?.id) return;

    const fetchMissions = async () => {
      try {
        const response = await fetch(`/api/analytics?userId=${user.id}`);
        const data = await response.json();
        if (data.success && data.missions) {
          setMissions(data.missions);
        }
      } catch (error) {
        console.error("Error fetching missions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMissions();
  }, [user?.id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (expandedMissionId && !target.closest('.mission-card')) {
        setExpandedMissionId(null);
      }
    };

    if (expandedMissionId) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [expandedMissionId]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'graded':
      case 'completed':
        return 'text-green-400 bg-green-400/20';
      case 'submitted':
        return 'text-blue-400 bg-blue-400/20';
      case 'in_progress':
        return 'text-yellow-400 bg-yellow-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'graded':
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'submitted':
        return <FileText className="w-4 h-4" />;
      case 'in_progress':
        return <Clock className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  return (
    <>
      <Head>
        <title>Analytics | Velric</title>
        <meta name="description" content="Your Velric analytics - detailed performance insights and domain breakdown" />
        <link rel="icon" href="/assets/logo.png" />
      </Head>

      <div className="min-h-screen text-white" style={{
        background: 'linear-gradient(135deg, #1a0b2e 0%, #16213e 50%, #0f3460 100%)'
      }}>
        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-cyan-500/10 to-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Navigation */}
        <DashboardNavigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
          notificationCount={3}
        />

        {/* Main Content */}
        <div className="relative z-10 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto px-4 py-8"
          >
            {/* Page Title */}
            <div className="mb-8 pt-10">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Analytics
              </h1>
              <p className="text-white/60 text-lg">
                Detailed insights into your performance across all domains
              </p>
            </div>

            {/* Missions Section */}
            <div className="mb-8">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-white/60">Loading missions...</p>
                </div>
              ) : missions.length === 0 ? (
                <div className="text-center py-12 border border-white/10 rounded-2xl">
                  <p className="text-white/60">No missions found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <AnimatePresence mode="popLayout">
                    {missions.map((mission, index) => {
                      const isExpanded = expandedMissionId === mission.id.toString();

                      return (
                        <motion.div
                          key={mission.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ 
                            opacity: 1, 
                            scale: 1,
                          }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.3, layout: { duration: 0.4 } }}
                          className={`mission-card relative ${
                            isExpanded 
                              ? 'md:col-span-2 lg:col-span-3 bg-[#1C1C1E] rounded-2xl border-2 border-cyan-400/50 shadow-2xl' 
                              : 'bg-white/5 rounded-xl border border-white/10 hover:border-cyan-400/50 cursor-pointer'
                          } p-6 transition-all`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isExpanded) {
                              setExpandedMissionId(mission.id.toString());
                            }
                          }}
                        >
                          {isExpanded && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedMissionId(null);
                              }}
                              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors z-10"
                            >
                              <X className="w-6 h-6" />
                            </button>
                          )}

                          <div className={isExpanded ? 'max-w-4xl mx-auto' : ''}>
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(mission.status)}`}>
                                    {getStatusIcon(mission.status)}
                                    {mission.status}
                                  </span>
                                  {mission.velric_score && (
                                    <span className="px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 text-cyan-400">
                                      {mission.velric_score}/10
                                    </span>
                                  )}
                                </div>
                                <h3 className="text-lg font-semibold text-white">
                                  Mission #{mission.mission_id}
                                </h3>
                                <p className="text-sm text-white/60 mt-1">
                                  Created: {mission.created_date} at {mission.created_time}
                                </p>
                              </div>
                            </div>

                            {/* Expanded Content */}
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                              >
                                {/* Scores */}
                                {(mission.grade || mission.velric_score) && (
                                  <div className="grid grid-cols-2 gap-4">
                                    {mission.grade && (
                                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                        <p className="text-white/60 text-sm mb-1">Grade</p>
                                        <p className="text-2xl font-bold text-white">{mission.grade}/100</p>
                                      </div>
                                    )}
                                    {mission.velric_score && (
                                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                        <p className="text-white/60 text-sm mb-1">Velric Score</p>
                                        <p className="text-2xl font-bold text-cyan-400">{mission.velric_score}/10</p>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Dates */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  {mission.started_date && (
                                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                      <div className="flex items-center gap-2 text-white/60 text-sm mb-1">
                                        <Clock className="w-4 h-4" />
                                        Started
                                      </div>
                                      <p className="text-white">{mission.started_date}</p>
                                      <p className="text-white/60 text-xs">{mission.started_time}</p>
                                    </div>
                                  )}
                                  {mission.completed_date && (
                                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                      <div className="flex items-center gap-2 text-white/60 text-sm mb-1">
                                        <CheckCircle className="w-4 h-4" />
                                        Completed
                                      </div>
                                      <p className="text-white">{mission.completed_date}</p>
                                      <p className="text-white/60 text-xs">{mission.completed_time}</p>
                                    </div>
                                  )}
                                  {mission.letter_grade && (
                                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                      <div className="flex items-center gap-2 text-white/60 text-sm mb-1">
                                        <Award className="w-4 h-4" />
                                        Letter Grade
                                      </div>
                                      <p className="text-2xl font-bold text-white">{mission.letter_grade}</p>
                                    </div>
                                  )}
                                </div>

                                {/* Submission Text */}
                                {mission.submission_text && (
                                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                    <h4 className="text-white font-semibold mb-2">Submission</h4>
                                    <p className="text-white/80 text-sm whitespace-pre-wrap">{mission.submission_text}</p>
                                  </div>
                                )}

                                {/* Feedback */}
                                {mission.feedback_text && (
                                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                    <h4 className="text-white font-semibold mb-2">Feedback</h4>
                                    <p className="text-white/80 text-sm whitespace-pre-wrap">{mission.feedback_text}</p>
                                  </div>
                                )}

                                {/* Summary */}
                                {mission.summary && (
                                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                    <h4 className="text-white font-semibold mb-2">Summary</h4>
                                    <p className="text-white/80 text-sm">{mission.summary}</p>
                                  </div>
                                )}

                                {/* Grades */}
                                {mission.grades && typeof mission.grades === 'object' && (
                                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                    <h4 className="text-white font-semibold mb-3">Detailed Grades</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                      {Object.entries(mission.grades).map(([key, value]: [string, any]) => (
                                        <div key={key} className="flex justify-between items-center">
                                          <span className="text-white/60 text-sm capitalize">{key.replace(/_/g, ' ')}</span>
                                          <span className="text-white font-medium">{value}/100</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Rubric */}
                                {mission.rubric && typeof mission.rubric === 'object' && (
                                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                    <h4 className="text-white font-semibold mb-3">Rubric</h4>
                                    <div className="space-y-2">
                                      {Object.entries(mission.rubric).map(([key, value]: [string, any]) => (
                                        <div key={key}>
                                          <p className="text-white font-medium text-sm capitalize mb-1">{key.replace(/_/g, ' ')}</p>
                                          <p className="text-white/60 text-sm">{value}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default function AnalyticsPage() {
  return (
    <ProtectedDashboardRoute>
      <AnalyticsContent />
    </ProtectedDashboardRoute>
  );
}