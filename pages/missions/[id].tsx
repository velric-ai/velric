// pages/missions/[id].tsx
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoadingSpinner from "@/components/LoadingSpinner";
import { StaticMission } from "@/data/staticMissions";
import { AlertCircle, ArrowLeft } from "lucide-react";
import SubmissionForm from "@/components/SubmissionForm";

export default function MissionDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [mission, setMission] = useState<StaticMission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [missionStatus, setMissionStatus] = useState<string>("suggested");
  const [isStarting, setIsStarting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const submissionSectionRef = useRef<HTMLDivElement | null>(null);

  // For demo purposes, using a hardcoded user ID
  const userId = "demo-user-123";

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
          throw new Error(missionData.error || "Mission not found");
        }

        setMission(missionData.mission);

        console.log("[MissionPage] Loaded mission:", {
          id,
          hasDescription: !!missionData.mission?.description,
          taskCount: missionData.mission?.tasks?.length || 0,
          skillCount: missionData.mission?.skills?.length || 0,
          evaluationMetricsCount:
            missionData.mission?.evaluationMetrics?.length || 0,
        });

        // Fetch user's mission status
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
    if (!mission || !id) return;

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
        // Scroll to submission section instead of navigating away
        setTimeout(() => {
          submissionSectionRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
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

  const handleSubmission = async (form: { submissionText: string }) => {
    if (!id || typeof id !== "string") return;
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionText: form.submissionText,
          missionId: id,
          userId,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.error || "Submission failed");
      setSubmitSuccess(true);
      setMissionStatus("submitted");
      router.push(`/feedback/${data.id}`);
    } catch (e) {
      console.error(e);
      alert("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Loading Mission | Velric</title>
        </Head>
        <main className="bg-[#0D0D0D] text-white min-h-screen">
          <Navbar />
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
          <Navbar />
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

      <main className="bg-[#0D0D0D] text-white min-h-screen antialiased relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-72 h-72 bg-gradient-to-r from-[#6A0DAD]/10 to-[#00D9FF]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gradient-to-l from-[#00D9FF]/10 to-[#6A0DAD]/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#6A0DAD]/5 to-[#00D9FF]/5 rounded-full blur-3xl animate-spin"
            style={{ animationDuration: "60s" }}
          ></div>
        </div>

        {/* Floating Particles */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-[#00D9FF]/30 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        <Navbar />

        {/* Back Button */}
        <section className="pt-24 pb-8 px-4 md:px-8 lg:px-16 relative z-10">
          <div className="max-w-7xl mx-auto">
            <motion.button
              onClick={handleGoBack}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
              whileHover={{ x: -5 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Missions
            </motion.button>
          </div>
        </section>

        {/* Mission Content */}
        <section className="px-4 md:px-8 lg:px-16 pb-20 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content - spans 2 columns */}
              <div className="lg:col-span-2">
                {/* Mission Details Card */}
                <div className="bg-[#1C1C1E]/90 backdrop-blur-xl rounded-2xl p-8 hover:shadow-2xl hover:shadow-[#6A0DAD]/20 transition-all duration-500 border border-[#6A0DAD]/20 hover:border-[#6A0DAD]/40 group relative overflow-hidden">
                  {/* Card Background Glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#6A0DAD]/5 to-[#00D9FF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Corner Accent */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#00D9FF]/20 to-transparent rounded-bl-3xl"></div>

                  <div className="relative z-10">
                    {/* Mission Overview with Icon */}
                    <div className="flex items-center mb-8">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#6A0DAD] to-[#00D9FF] rounded-xl flex items-center justify-center mr-4 rotate-3 hover:rotate-0 transition-transform duration-300">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                      </div>
                      <h2 className="text-4xl font-bold text-[#F5F5F5] font-['Space_Grotesk'] bg-gradient-to-r from-[#F5F5F5] to-[#00D9FF] bg-clip-text text-transparent">
                        Mission Overview
                      </h2>
                    </div>

                    <p className="text-[#F5F5F5] text-lg mb-8 leading-relaxed font-['Inter'] hover:text-[#00D9FF]/80 transition-colors duration-300">
                      {mission.description}
                    </p>

                    {/* Context Section */}
                    {mission.context && (
                      <div className="mb-8">
                        <div className="flex items-center mb-6">
                          <div className="w-8 h-8 bg-gradient-to-r from-[#00D9FF]/20 to-[#6A0DAD]/20 rounded-lg flex items-center justify-center mr-3 border border-[#00D9FF]/30">
                            <svg
                              className="w-4 h-4 text-[#00D9FF]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <h3 className="text-2xl font-semibold text-[#F5F5F5] font-['Space_Grotesk']">
                            Context
                          </h3>
                        </div>
                        <p className="text-[#F5F5F5] text-lg leading-relaxed font-['Inter']">
                          {mission.context}
                        </p>
                      </div>
                    )}

                    {/* Tasks Section */}
                    {mission.tasks && (
                      <div className="mb-8">
                        <div className="flex items-center mb-6">
                          <div className="w-8 h-8 bg-gradient-to-r from-[#00D9FF]/20 to-[#6A0DAD]/20 rounded-lg flex items-center justify-center mr-3 border border-[#00D9FF]/30">
                            <svg
                              className="w-4 h-4 text-[#00D9FF]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                              />
                            </svg>
                          </div>
                          <h3 className="text-2xl font-semibold text-[#F5F5F5] font-['Space_Grotesk']">
                            Tasks
                          </h3>
                        </div>
                        <ul className="space-y-4">
                          {mission.tasks.map((task, index) => (
                            <li
                              key={index}
                              className="flex items-start group/item hover:translate-x-2 transition-transform duration-200"
                            >
                              <div className="w-6 h-6 bg-gradient-to-r from-[#00D9FF] to-[#6A0DAD] rounded-full mt-1 mr-4 flex-shrink-0 group-hover/item:scale-110 transition-transform duration-200 flex items-center justify-center">
                                <span className="text-white text-sm font-bold">
                                  {index + 1}
                                </span>
                              </div>
                              <span className="text-[#F5F5F5] text-lg font-['Inter'] group-hover/item:text-[#00D9FF]/80 transition-colors duration-200">
                                {task}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Skills with Interactive Tags */}
                    {mission.skills && (
                      <div className="mb-8">
                        <div className="flex items-center mb-6">
                          <div className="w-8 h-8 bg-gradient-to-r from-[#6A0DAD]/20 to-[#00D9FF]/20 rounded-lg flex items-center justify-center mr-3 border border-[#6A0DAD]/30">
                            <svg
                              className="w-4 h-4 text-[#6A0DAD]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                              />
                            </svg>
                          </div>
                          <h3 className="text-2xl font-semibold text-[#F5F5F5] font-['Space_Grotesk']">
                            Required Skills
                          </h3>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {mission.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="bg-[#0D0D0D] text-[#F5F5F5] px-4 py-2 rounded-2xl text-sm font-['Inter'] border border-gray-600 hover:border-[#00D9FF]/50 hover:bg-[#00D9FF]/10 hover:scale-105 transition-all duration-200 cursor-pointer"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Evaluation Metrics */}
                    {mission.evaluationMetrics && (
                      <div>
                        <div className="flex items-center mb-6">
                          <div className="w-8 h-8 bg-gradient-to-r from-[#6A0DAD]/20 to-[#00D9FF]/20 rounded-lg flex items-center justify-center mr-3 border border-[#6A0DAD]/30">
                            <svg
                              className="w-4 h-4 text-[#6A0DAD]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                              />
                            </svg>
                          </div>
                          <h3 className="text-2xl font-semibold text-[#F5F5F5] font-['Space_Grotesk']">
                            Evaluation Criteria
                          </h3>
                        </div>
                        <ul className="space-y-4">
                          {mission.evaluationMetrics.map((metric, index) => (
                            <li
                              key={index}
                              className="flex items-start group/item hover:translate-x-2 transition-transform duration-200"
                            >
                              <div className="w-3 h-3 bg-gradient-to-r from-[#6A0DAD] to-[#00D9FF] rounded-full mt-3 mr-4 flex-shrink-0 group-hover/item:scale-125 transition-transform duration-200"></div>
                              <span className="text-[#F5F5F5] text-lg font-['Inter'] group-hover/item:text-[#6A0DAD]/80 transition-colors duration-200">
                                {metric}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-[#1C1C1E]/90 backdrop-blur-xl rounded-2xl p-6 sticky top-32 hover:shadow-2xl hover:shadow-[#6A0DAD]/20 transition-all duration-500 border border-[#6A0DAD]/20 hover:border-[#6A0DAD]/40 group overflow-hidden">
                  {/* Card Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00D9FF]/10 to-[#6A0DAD]/10"></div>
                  </div>

                  {/* Floating Glow Effect */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-l from-[#6A0DAD]/20 to-[#00D9FF]/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                  <div className="relative z-10">
                    {/* Mission Metrics Header with Icon */}
                    <div className="flex items-center mb-8">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#6A0DAD] to-[#00D9FF] rounded-xl flex items-center justify-center mr-3 animate-pulse">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-[#F5F5F5] font-['Space_Grotesk'] bg-gradient-to-r from-[#F5F5F5] to-[#00D9FF] bg-clip-text text-transparent">
                        Mission Metrics
                      </h2>
                    </div>

                    {/* Enhanced Metrics */}
                    <div className="space-y-8">
                      <div className="group/metric hover:scale-105 transition-transform duration-200">
                        <label className="text-gray-400 text-xs font-['Inter'] uppercase tracking-widest mb-2 block">
                          Difficulty:
                        </label>
                        <div className="flex items-center mt-3 p-3 bg-[#0D0D0D]/50 rounded-xl border border-gray-700/50 group-hover/metric:border-[#00D9FF]/30 transition-all duration-200">
                          <span className="text-[#F5F5F5] font-semibold text-lg font-['Inter'] mr-4">
                            {mission.difficulty}
                          </span>
                          <div className="flex space-x-2">
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
                                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    i < level
                                      ? "bg-gradient-to-r from-[#00D9FF] to-[#6A0DAD] animate-pulse"
                                      : "bg-gray-600"
                                  }`}
                                />
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="group/metric hover:scale-105 transition-transform duration-200">
                        <label className="text-gray-400 text-xs font-['Inter'] uppercase tracking-widest mb-2 block">
                          Time Estimate:
                        </label>
                        <div className="p-3 bg-[#0D0D0D]/50 rounded-xl border border-gray-700/50 group-hover/metric:border-[#00D9FF]/30 transition-all duration-200">
                          <p className="text-[#F5F5F5] font-semibold text-lg font-['Inter']">
                            <span className="text-2xl bg-gradient-to-r from-[#00D9FF] to-[#6A0DAD] bg-clip-text text-transparent">
                              {mission.timeEstimate}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="group/metric hover:scale-105 transition-transform duration-200">
                        <label className="text-gray-400 text-xs font-['Inter'] uppercase tracking-widest mb-2 block">
                          Difficulty:
                        </label>
                        <div className="p-3 bg-[#0D0D0D]/50 rounded-xl border border-gray-700/50 group-hover/metric:border-[#6A0DAD]/30 transition-all duration-200">
                          <p className="text-[#F5F5F5] font-semibold text-lg font-['Inter']">
                            <span className="text-2xl bg-gradient-to-r from-[#6A0DAD] to-[#00D9FF] bg-clip-text text-transparent">
                              {mission.difficulty}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="group/metric hover:scale-105 transition-transform duration-200">
                        <label className="text-gray-400 text-xs font-['Inter'] uppercase tracking-widest mb-2 block">
                          Company:
                        </label>
                        <div className="p-3 bg-[#0D0D0D]/50 rounded-xl border border-gray-700/50 group-hover/metric:border-[#00D9FF]/30 transition-all duration-200">
                          <p className="text-[#F5F5F5] font-semibold text-lg font-['Inter']">
                            <span className="text-xl bg-gradient-to-r from-[#00D9FF] to-[#6A0DAD] bg-clip-text text-transparent">
                              {mission.company}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Progress Section */}
                    <div className="mt-10">
                      <h3 className="text-xl font-semibold text-[#F5F5F5] mb-4 font-['Space_Grotesk'] flex items-center">
                        <div
                          className={`w-2 h-2 rounded-full mr-2 ${
                            missionStatus === "completed"
                              ? "bg-green-400"
                              : missionStatus === "in_progress"
                              ? "bg-blue-400 animate-pulse"
                              : missionStatus === "submitted"
                              ? "bg-yellow-400"
                              : "bg-gray-400"
                          }`}
                        ></div>
                        Your Progress
                      </h3>
                      <div className="bg-[#0D0D0D]/70 rounded-full h-4 mb-3 overflow-hidden border border-gray-700/50 relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#6A0DAD]/20 to-[#00D9FF]/20 animate-pulse"></div>
                        <div
                          className={`bg-gradient-to-r from-[#6A0DAD] to-[#00D9FF] h-4 rounded-full transition-all duration-1000 relative z-10 ${
                            missionStatus === "completed"
                              ? "w-full"
                              : missionStatus === "submitted"
                              ? "w-4/5"
                              : missionStatus === "in_progress"
                              ? "w-1/4"
                              : "w-0"
                          }`}
                        ></div>
                      </div>
                      <p className="text-gray-400 text-sm font-['Inter'] flex items-center">
                        <span
                          className={`w-2 h-2 rounded-full mr-2 ${
                            missionStatus === "completed"
                              ? "bg-green-400"
                              : missionStatus === "in_progress"
                              ? "bg-blue-400"
                              : missionStatus === "submitted"
                              ? "bg-yellow-400"
                              : "bg-gray-500"
                          }`}
                        ></span>
                        {missionStatus === "completed"
                          ? "100% Complete"
                          : missionStatus === "submitted"
                          ? "80% Complete - Under Review"
                          : missionStatus === "in_progress"
                          ? "25% Complete - In Progress"
                          : "0% Complete - Not Started"}
                      </p>
                    </div>

                    {/* Enhanced Action Buttons */}
                    <div className="space-y-4 mt-8">
                      {missionStatus === "suggested" && (
                        <button
                          type="button"
                          onClick={handleStartMission}
                          disabled={isStarting}
                          className="w-full bg-gradient-to-r from-[#6A0DAD] to-[#00D9FF] hover:from-[#6A0DAD]/80 hover:to-[#00D9FF]/80 text-white py-4 rounded-2xl font-semibold font-['Inter'] transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-[#6A0DAD]/50 relative overflow-hidden group/button disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0"
                        >
                          <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover/button:translate-x-full transition-transform duration-700"></div>
                          <span className="relative z-10 flex items-center justify-center">
                            <svg
                              className="w-5 h-5 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {isStarting
                              ? "Starting Mission..."
                              : "Start Mission"}
                          </span>
                        </button>
                      )}

                      {missionStatus === "in_progress" && (
                        <button
                          type="button"
                          onClick={() =>
                            submissionSectionRef.current?.scrollIntoView({
                              behavior: "smooth",
                            })
                          }
                          className="w-full bg-gradient-to-r from-[#00D9FF] to-[#6A0DAD] hover:from-[#00D9FF]/80 hover:to-[#6A0DAD]/80 text-white py-4 rounded-2xl font-semibold font-['Inter'] transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-[#00D9FF]/50 relative overflow-hidden group/button"
                        >
                          <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover/button:translate-x-full transition-transform duration-700"></div>
                          <span className="relative z-10 flex items-center justify-center">
                            <svg
                              className="w-5 h-5 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a1 1 0 01-1-1V9a1 1 0 011-1h1a2 2 0 100-4H4a1 1 0 01-1-1V4a1 1 0 011-1h3a1 1 0 001-1z"
                              />
                            </svg>
                            Continue Mission
                          </span>
                        </button>
                      )}

                      {(missionStatus === "submitted" ||
                        missionStatus === "completed") && (
                        <button
                          type="button"
                          onClick={() =>
                            submissionSectionRef.current?.scrollIntoView({
                              behavior: "smooth",
                            })
                          }
                          className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-600/80 hover:to-green-500/80 text-white py-4 rounded-2xl font-semibold font-['Inter'] transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-green-500/50 relative overflow-hidden group/button"
                        >
                          <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover/button:translate-x-full transition-transform duration-700"></div>
                          <span className="relative z-10 flex items-center justify-center">
                            <svg
                              className="w-5 h-5 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            View Submission
                          </span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => alert("Hint feature coming soon!")}
                        className="w-full bg-[#0D0D0D]/70 hover:bg-gray-700/50 text-[#F5F5F5] py-4 rounded-2xl font-semibold font-['Inter'] border border-gray-600 hover:border-[#00D9FF]/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden group/button"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#6A0DAD]/10 to-[#00D9FF]/10 opacity-0 group-hover/button:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative z-10 flex items-center justify-center">
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            />
                          </svg>
                          Get Hint
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Submission Section */}
        <section className="px-4 md:px-8 lg:px-16 pb-20 relative z-10">
          <div
            className="max-w-4xl mx-auto"
            ref={submissionSectionRef}
            id="submission-section"
          >
            <div className="bg-[#1C1C1E]/90 backdrop-blur-xl rounded-2xl p-8 border border-[#6A0DAD]/20">
              <h2 className="text-2xl font-bold text-[#F5F5F5] mb-6">
                Submit Your Response
              </h2>
              <SubmissionForm
                onSubmit={handleSubmission}
                isLoading={isSubmitting}
              />
              {submitSuccess && (
                <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
                  <p className="text-green-400 font-semibold">
                    Submitted! Redirecting to feedback...
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
