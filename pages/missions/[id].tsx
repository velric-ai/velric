// pages/missions/[id].tsx
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { motion } from "framer-motion";
import DashboardNavigation from "@/components/dashboard/DashboardNavigation";
import Footer from "@/components/Footer";
import LoadingSpinner from "@/components/LoadingSpinner";
import { StaticMission } from "@/data/staticMissions";
import { AlertCircle, ArrowLeft, X } from "lucide-react";
import { useSnackbar } from "@/hooks/useSnackbar";
import GeneralInstructionsModal from "@/components/GeneralInstructionsModal";

export default function MissionDetailPage() {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const { id } = router.query;
  const [mission, setMission] = useState<StaticMission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [missionStatus, setMissionStatus] = useState<string>("suggested");
  const [isStarting, setIsStarting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);

  // Get logged-in user ID from localStorage
  useEffect(() => {
    const userDataStr = localStorage.getItem('velric_user');
    if (userDataStr) {
      try {
        const user = JSON.parse(userDataStr);
        setUserId(user.id);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (!id || typeof id !== "string") return;

    const fetchMission = async () => {
      try {
        setIsLoading(true);
        setError("");

        // Fetch mission details
        const missionResponse = await fetch(`/api/missions/${id}`);
        const missionData = await missionResponse.json();

        if (!missionData.success) {
          const errorMessage = missionData.error || "Mission not found";
          showSnackbar(errorMessage, "error");
          setError(errorMessage);
          setIsLoading(false);
          return;
        }

        setMission(missionData.mission);

        console.log("[MissionPage] Loaded mission:", {
          id,
          hasDescription: !!missionData.mission?.description,
          taskCount: missionData.mission?.tasks?.length || 0,
          skillCount: missionData.mission?.skills?.length || 0,
          evaluationMetricsCount:
            missionData.mission?.evaluationMetrics?.length || 0,
          type: missionData.mission?.type,
          language: missionData.mission?.language,
          field: missionData.mission?.field,
        });

        // Fetch user's mission status (only if logged in)
        if (userId) {
          try {
            const statusResponse = await fetch(
              `/api/user/missions/${id}?userId=${userId}`
            );
            const statusData = await statusResponse.json();

            if (statusData.success && statusData.userMission) {
              setMissionStatus(statusData.userMission.status);
            } else {
              setMissionStatus("suggested"); // Default status
            }
          } catch (statusError) {
            console.warn("Could not fetch mission status:", statusError);
            setMissionStatus("suggested");
          }
        } else {
          setMissionStatus("suggested"); // Default for non-logged-in users
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load mission";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMission();
  }, [id, userId]);

  const handleGoBack = () => {
    router.back();
  };

  const handleStartMission = async () => {
    if (!mission || !id || !userId) {
      alert("Please log in to start a mission.");
      return;
    }

    try {
      setIsStarting(true);

      const response = await fetch("/api/user/missions/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          missionId: id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMissionStatus("in_progress");
        // Show instructions modal instead of navigating
        setShowInstructionsModal(true);
      } else {
        alert("Failed to start mission: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error starting mission:", error);
      alert("Failed to start mission. Please try again.");
    } finally {
      setIsStarting(false);
    }
  };

  const handleAgreeToInstructions = () => {
    if (mission && id) {
      // Navigate to the submission page with the mission ID
      router.push(`/missions/${id}/submit`);
    }
  };

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Loading Mission | Velric</title>
        </Head>
        <main className="bg-[#0D0D0D] text-white min-h-screen">
          <DashboardNavigation activeTab="missions" />
          <div className="pt-24 flex justify-center items-center min-h-[60vh]">
            <LoadingSpinner size="lg" text="Loading mission details..." />
          </div>
          <Footer />
        </main>
      </>
    );
  }

  if (error || !mission) {
    return (
      <>
        <Head>
          <title>Mission Not Found | Velric</title>
        </Head>
        <main className="bg-[#0D0D0D] text-white min-h-screen">
          <DashboardNavigation activeTab="missions" />
          <div className="pt-24 px-4 md:px-8 lg:px-16">
            <div className="max-w-4xl mx-auto text-center py-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h1 className="text-3xl font-bold mb-4">Mission Not Found</h1>
                <p className="text-gray-400 mb-8">
                  {error ||
                    "The mission you're looking for doesn't exist or has been removed."}
                </p>
                <motion.button
                  onClick={handleGoBack}
                  className="bg-gradient-to-r from-velricViolet to-plasmaBlue text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Go Back
                </motion.button>
              </motion.div>
            </div>
          </div>
          <Footer />
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{mission.title} | Velric</title>
        <meta name="description" content={mission.description} />
        <link rel="icon" href="/assets/logo.png" />
      </Head>

      <main className="bg-[#0D0D0D] text-white min-h-screen antialiased">
        <DashboardNavigation activeTab="missions" />

        {/* Header Section */}
        <div className="bg-gradient-to-b from-[#1A1A1A] to-[#0D0D0D] border-b border-gray-800/50">
          <div className="px-4 md:px-8 lg:px-16 pt-24 pb-8">
            <div className="max-w-7xl mx-auto">
              <motion.button
                onClick={handleGoBack}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 text-sm font-medium"
                whileHover={{ x: -3 }}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Missions
              </motion.button>
              
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-[#1C1C1E] border border-gray-700 rounded-md text-xs font-medium text-gray-300">
                      {mission.company}
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
                    {mission.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
                      {mission.difficulty}
                    </span>
                    <span className="text-gray-600">•</span>
                    <span>{mission.timeEstimate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Content */}
        <section className="px-4 md:px-8 lg:px-16 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Mission Overview */}
                <div className="bg-[#1C1C1E] rounded-lg border border-gray-800 p-8">
                  <h2 className="text-2xl font-semibold text-white mb-6 pb-4 border-b border-gray-800">
                    Overview
                  </h2>
                  <p className="text-gray-300 text-base leading-relaxed">
                    {mission.description}
                  </p>
                </div>

                {/* Context Section */}
                {mission.context && (
                  <div className="bg-[#1C1C1E] rounded-lg border border-gray-800 p-8">
                    <h3 className="text-xl font-semibold text-white mb-4 pb-3 border-b border-gray-800">
                      Context
                    </h3>
                    <p className="text-gray-300 text-base leading-relaxed">
                      {mission.context}
                    </p>
                  </div>
                )}

                {/* Tasks Section */}
                {mission.tasks && (
                  <div className="bg-[#1C1C1E] rounded-lg border border-gray-800 p-8">
                    <h3 className="text-xl font-semibold text-white mb-6 pb-3 border-b border-gray-800">
                      Tasks
                    </h3>
                    <ol className="space-y-4">
                      {mission.tasks.map((task, index) => (
                        <li key={index} className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#6A0DAD] flex items-center justify-center mt-0.5">
                            <span className="text-white text-xs font-semibold">
                              {index + 1}
                            </span>
                          </div>
                          <p className="text-gray-300 text-base leading-relaxed flex-1">
                            {task}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Skills Section */}
                {mission.skills && (
                  <div className="bg-[#1C1C1E] rounded-lg border border-gray-800 p-8">
                    <h3 className="text-xl font-semibold text-white mb-6 pb-3 border-b border-gray-800">
                      Required Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {mission.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-[#0D0D0D] text-gray-300 rounded-md text-sm font-medium border border-gray-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Evaluation Metrics */}
                {mission.evaluationMetrics && (
                  <div className="bg-[#1C1C1E] rounded-lg border border-gray-800 p-8">
                    <h3 className="text-xl font-semibold text-white mb-6 pb-3 border-b border-gray-800">
                      Evaluation Criteria
                    </h3>
                    <ul className="space-y-3">
                      {mission.evaluationMetrics.map((metric, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#6A0DAD] mt-2"></div>
                          <p className="text-gray-300 text-base leading-relaxed flex-1">
                            {metric}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Start Mission Section */}
                <div className="bg-[#1C1C1E] rounded-lg border border-gray-800 p-8">
                  <h2 className="text-xl font-semibold text-white mb-6 pb-3 border-b border-gray-800">
                    Ready to Start?
                  </h2>
                  <p className="text-gray-300 mb-6">
                    Review the mission details above and click the button below to begin. You'll see important guidelines before starting.
                  </p>
                  <motion.button
                    onClick={handleStartMission}
                    disabled={isStarting}
                    className="w-full bg-gradient-to-r from-velricViolet to-plasmaBlue text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isStarting ? "Starting..." : "Start Mission"}
                  </motion.button>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-[#1C1C1E] rounded-lg border border-gray-800 p-6 sticky top-24 space-y-6">
                  <h2 className="text-lg font-semibold text-white pb-4 border-b border-gray-800">
                    Mission Details
                  </h2>

                  {/* Metrics */}
                  <div className="space-y-5">
                    <div>
                      <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 block">
                        Difficulty
                      </label>
                      <div className="flex items-center justify-between p-3 bg-[#0D0D0D] rounded-md border border-gray-800">
                        <span className="text-white font-medium">
                          {mission.difficulty}
                        </span>
                        <div className="flex space-x-1.5">
                          {[...Array(3)].map((_, i) => {
                            const level =
                              mission.difficulty === "Beginner"
                                ? 1
                                : mission.difficulty === "Intermediate"
                                  ? 2
                                  : 3;
                            return (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${i < level
                                    ? "bg-[#6A0DAD]"
                                    : "bg-gray-700"
                                  }`}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 block">
                        Time Estimate
                      </label>
                      <div className="p-3 bg-[#0D0D0D] rounded-md border border-gray-800">
                        <p className="text-white font-semibold text-lg">
                          {mission.timeEstimate}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 block">
                        Company
                      </label>
                      <div className="p-3 bg-[#0D0D0D] rounded-md border border-gray-800">
                        <p className="text-white font-medium">
                          {mission.company}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div className="pt-6 border-t border-gray-800">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-white">
                        Progress
                      </h3>
                      <span className="text-xs text-gray-400">
                        {missionStatus === "completed"
                          ? "100%"
                          : missionStatus === "submitted"
                            ? "80%"
                            : missionStatus === "in_progress"
                              ? "25%"
                              : "0%"}
                      </span>
                    </div>
                    <div className="bg-[#0D0D0D] rounded-full h-2 mb-2 overflow-hidden border border-gray-800">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${missionStatus === "completed"
                            ? "bg-green-500 w-full"
                            : missionStatus === "submitted"
                              ? "bg-yellow-500 w-4/5"
                              : missionStatus === "in_progress"
                                ? "bg-blue-500 w-1/4"
                                : "bg-gray-700 w-0"
                          }`}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-400 flex items-center gap-2">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${missionStatus === "completed"
                            ? "bg-green-500"
                            : missionStatus === "in_progress"
                              ? "bg-blue-500"
                              : missionStatus === "submitted"
                                ? "bg-yellow-500"
                                : "bg-gray-500"
                          }`}
                      ></span>
                      {missionStatus === "completed"
                        ? "Complete"
                        : missionStatus === "submitted"
                          ? "Under Review"
                          : missionStatus === "in_progress"
                            ? "In Progress"
                            : "Not Started"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>

      {/* General Instructions Modal */}
      <GeneralInstructionsModal
        isOpen={showInstructionsModal}
        onClose={() => setShowInstructionsModal(false)}
        onAgree={handleAgreeToInstructions}
      />
    </>
  );
}
