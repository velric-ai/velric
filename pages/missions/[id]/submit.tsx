// pages/missions/[id]/submit.tsx
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { motion } from "framer-motion";
import DashboardNavigation from "@/components/dashboard/DashboardNavigation";
import Footer from "@/components/Footer";
import LoadingSpinner from "@/components/LoadingSpinner";
import { StaticMission } from "@/data/staticMissions";
import { AlertCircle, ArrowLeft } from "lucide-react";
import SubmissionForm from "@/components/SubmissionForm";
import TechnicalInterviewIDE from "@/components/TechnicalInterviewIDE";
import { useSnackbar } from "@/hooks/useSnackbar";

export default function MissionSubmitPage() {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const { id } = router.query;
  const [mission, setMission] = useState<StaticMission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const submissionSectionRef = useRef<HTMLDivElement | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showTabSwitchWarning, setShowTabSwitchWarning] = useState(false);
  const wasVisibleRef = useRef(true);
  const [codeFromIDE, setCodeFromIDE] = useState<string>("");
  const [languageFromIDE, setLanguageFromIDE] = useState<string>("python");

  // Get logged-in user ID from localStorage
  useEffect(() => {
    const userDataStr = localStorage.getItem("velric_user");
    if (userDataStr) {
      try {
        const user = JSON.parse(userDataStr);
        setUserId(user.id);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    // Retrieve code and language from IDE localStorage
    if (id && typeof id === "string") {
      const savedCode = localStorage.getItem(`interview_${id}_code`);
      const savedLanguage = localStorage.getItem(`interview_${id}_language`);
      if (savedCode) {
        setCodeFromIDE(savedCode);
      }
      if (savedLanguage) {
        setLanguageFromIDE(savedLanguage);
        console.log("[MissionSubmit] Loaded language from localStorage:", savedLanguage);
      }
    }
  }, [id]);

  // Listen to storage changes to detect when IDE updates the code/language
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (id && typeof id === "string") {
        if (e.key === `interview_${id}_code` && e.newValue) {
          setCodeFromIDE(e.newValue);
        }
        if (e.key === `interview_${id}_language` && e.newValue) {
          setLanguageFromIDE(e.newValue);
          console.log("[MissionSubmit] Language updated via storage event:", e.newValue);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Also poll localStorage every 500ms to catch updates in the same tab
    const pollInterval = setInterval(() => {
      if (id && typeof id === "string") {
        const currentLanguage = localStorage.getItem(`interview_${id}_language`);
        if (currentLanguage) {
          setLanguageFromIDE((prev) => {
            if (prev !== currentLanguage) {
              console.log("[MissionSubmit] Language polled from localStorage:", currentLanguage);
              return currentLanguage;
            }
            return prev;
          });
        }
      }
    }, 500);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(pollInterval);
    };
  }, [id]);

  // Track tab switches using Page Visibility API
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User switched away from the tab
        wasVisibleRef.current = false;
      } else {
        // User came back to the tab
        if (!wasVisibleRef.current) {
          // Only increment if they actually left and came back
          setTabSwitchCount((prev) => {
            const newCount = prev + 1;
            setShowTabSwitchWarning(true);
            return newCount;
          });
          wasVisibleRef.current = true;
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
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

        console.log("[MissionSubmitPage] Loaded mission:", {
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

  const handleSubmission = async (form: { submissionText: string; code?: string; language?: string }) => {
    if (!id || typeof id !== "string" || !userId) {
      alert("Please log in to submit a mission response.");
      return;
    }

    // Get fresh language from localStorage in case user changed it
    const freshLanguage = localStorage.getItem(`interview_${id}_language`) || form.language || "python";
    const freshCode = localStorage.getItem(`interview_${id}_code`) || form.code || "";

    console.log("[MissionSubmit] Submitting with:", {
      language: freshLanguage,
      code: freshCode ? freshCode.substring(0, 50) + "..." : "empty",
    });

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionText: form.submissionText,
          code: freshCode,
          language: freshLanguage,
          missionId: id,
          userId,
          tabSwitchCount,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        const errorMessage = data.error || "Submission failed";
        showSnackbar(errorMessage, "error");
        setIsSubmitting(false);
        return;
      }
      setSubmitSuccess(true);
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
        <title>{mission.title} - Submit | Velric</title>
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
                Back to Mission
              </motion.button>

              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-[#1C1C1E] border border-gray-700 rounded-md text-xs font-medium text-gray-300">
                      {mission.company}
                    </span>
                    {tabSwitchCount > 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-md"
                      >
                        <span className="text-yellow-400 text-xs font-medium">
                          {tabSwitchCount} Tab Switch
                          {tabSwitchCount !== 1 ? "es" : ""}
                        </span>
                      </motion.div>
                    )}
                  </div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
                    {mission.title}
                  </h1>
                  <p className="text-gray-400 text-sm">
                    Complete the mission and submit your response below
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Content */}
        <section className="px-4 md:px-8 lg:px-16 py-12">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* IDE Section for Technical Missions */}
            {(() => {
              // Check if mission is technical-related
              const isTechnical =
                mission.type === "technical" ||
                (mission.field &&
                  (mission.field.toLowerCase().includes("technical") ||
                    mission.field.toLowerCase().includes("engineering") ||
                    mission.field.toLowerCase().includes("development") ||
                    mission.field.toLowerCase().includes("programming") ||
                    mission.field.toLowerCase().includes("software") ||
                    mission.field.toLowerCase().includes("coding") ||
                    mission.field.toLowerCase().includes("backend") ||
                    mission.field.toLowerCase().includes("frontend") ||
                    mission.field.toLowerCase().includes("full stack") ||
                    mission.field
                      .toLowerCase()
                      .includes("data engineering") ||
                    mission.field.toLowerCase().includes("devops") ||
                    mission.field
                      .toLowerCase()
                      .includes("machine learning") ||
                    mission.field.toLowerCase().includes("ai") ||
                    mission.field.toLowerCase().includes("blockchain"))) ||
                (mission.skills &&
                  mission.skills.some(
                    (skill) =>
                      skill.toLowerCase().includes("programming") ||
                      skill.toLowerCase().includes("coding") ||
                      skill.toLowerCase().includes("python") ||
                      skill.toLowerCase().includes("javascript") ||
                      skill.toLowerCase().includes("java") ||
                      skill.toLowerCase().includes("react") ||
                      skill.toLowerCase().includes("node") ||
                      skill.toLowerCase().includes("typescript") ||
                      skill.toLowerCase().includes("c++") ||
                      skill.toLowerCase().includes("software") ||
                      skill.toLowerCase().includes("development")
                  ));

              // Detect language from skills or field if not explicitly set
              let detectedLanguage = mission.language;
              if (!detectedLanguage && isTechnical) {
                const allText = [
                  ...(mission.skills || []),
                  mission.field || "",
                  mission.category || "",
                ]
                  .join(" ")
                  .toLowerCase();
                if (
                  allText.includes("python") ||
                  allText.includes("django") ||
                  allText.includes("flask")
                ) {
                  detectedLanguage = "python";
                } else if (
                  allText.includes("javascript") ||
                  allText.includes("react") ||
                  allText.includes("node") ||
                  allText.includes("js")
                ) {
                  detectedLanguage = "javascript";
                } else if (
                  allText.includes("typescript") ||
                  allText.includes("ts")
                ) {
                  detectedLanguage = "typescript";
                } else if (allText.includes("java")) {
                  detectedLanguage = "java";
                } else if (allText.includes("c++") || allText.includes("cpp")) {
                  detectedLanguage = "cpp";
                } else if (
                  allText.includes("go") ||
                  allText.includes("golang")
                ) {
                  detectedLanguage = "go";
                } else if (allText.includes("rust")) {
                  detectedLanguage = "rust";
                } else {
                  // Default to python for technical missions
                  detectedLanguage = "python";
                }
              }

              return isTechnical ? (
                <div className="bg-[#1C1C1E] rounded-lg border border-gray-800 p-8">
                  <h2 className="text-2xl font-semibold text-white mb-6 pb-4 border-b border-gray-800">
                    Code Editor
                  </h2>
                  <div className="h-[600px]">
                    <TechnicalInterviewIDE
                      interviewId={mission.id}
                      initialLanguage={detectedLanguage || "python"}
                    />
                  </div>
                </div>
              ) : null;
            })()}

            {/* Submission Section */}
            <div
              ref={submissionSectionRef}
              id="submission-section"
              className="bg-[#1C1C1E] rounded-lg border border-gray-800 p-8"
            >
              <h2 className="text-2xl font-semibold text-white mb-6 pb-4 border-b border-gray-800">
                Submit Your Response
              </h2>
              
              {/* Debug Info */}
              <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded text-blue-400 text-xs">
                <p>Language detected: <span className="font-semibold">{languageFromIDE}</span></p>
              </div>

              <SubmissionForm
                onSubmit={handleSubmission}
                isLoading={isSubmitting}
                code={codeFromIDE}
                language={languageFromIDE}
              />
              {submitSuccess && (
                <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-md">
                  <p className="text-green-400 text-sm font-medium text-center">
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
