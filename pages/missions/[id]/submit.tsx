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
import { missionNeedsIDE } from "@/lib/missionHelpers";

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

  // TAB SWITCH STATE
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showTabSwitchWarning, setShowTabSwitchWarning] = useState(false);
  const wasVisibleRef = useRef(true);

  const [codeFromIDE, setCodeFromIDE] = useState<string>("");
  const [languageFromIDE, setLanguageFromIDE] = useState<string>("python");

  // Load user + IDE code/language
  useEffect(() => {
    const userDataStr = localStorage.getItem("velric_user");
    if (userDataStr) {
      try {
        const user = JSON.parse(userDataStr);
        setUserId(user.id);
      } catch {}
    }

    if (id && typeof id === "string") {
      const savedCode = localStorage.getItem(`interview_${id}_code`);
      const savedLanguage = localStorage.getItem(`interview_${id}_language`);

      if (savedCode) setCodeFromIDE(savedCode);
      if (savedLanguage) setLanguageFromIDE(savedLanguage);
    }
  }, [id]);

  // Track IDE storage updates
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!id || typeof id !== "string") return;

      if (e.key === `interview_${id}_code` && e.newValue) {
        setCodeFromIDE(e.newValue);
      }
      if (e.key === `interview_${id}_language` && e.newValue) {
        setLanguageFromIDE(e.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    const pollInterval = setInterval(() => {
      if (!id || typeof id !== "string") return;
      const currentLang = localStorage.getItem(`interview_${id}_language`);
      if (currentLang && currentLang !== languageFromIDE) {
        setLanguageFromIDE(currentLang);
      }
    }, 500);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(pollInterval);
    };
  }, [id, languageFromIDE]);

  
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        wasVisibleRef.current = false;
      } else {
        if (!wasVisibleRef.current) {
          setTabSwitchCount((prev) => prev + 1);
          setShowTabSwitchWarning(true);
          if (navigator.vibrate) navigator.vibrate(200);
          wasVisibleRef.current = true;
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Fetch mission
  useEffect(() => {
    if (!id || typeof id !== "string") return;

    const fetchMission = async () => {
      try {
        setIsLoading(true);
        setError("");

        const missionResponse = await fetch(`/api/missions/${id}`);
        const missionData = await missionResponse.json();

        if (!missionData.success) {
          const msg = missionData.error || "Mission not found";
          showSnackbar(msg, "error");
          setError(msg);
          return;
        }

        setMission(missionData.mission);
      } catch (err) {
        setError("Failed to load mission");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMission();
  }, [id, userId]);

  const handleGoBack = () => router.back();

  const handleSubmission = async (form: { submissionText: string; code?: string; language?: string }) => {
    if (!id || typeof id !== "string" || !userId) {
      return alert("Please log in first.");
    }

    // fresh from localStorage
    const freshLang = localStorage.getItem(`interview_${id}_language`) || form.language || "python";
    const freshCode = localStorage.getItem(`interview_${id}_code`) || form.code || "";

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionText: form.submissionText,
          code: freshCode,
          language: freshLang,
          missionId: id,
          userId,
          tabSwitchCount,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        showSnackbar(data.error || "Submission failed", "error");
        return;
      }

      setSubmitSuccess(true);
      router.push(`/feedback/${data.id}`);
    } catch {
      alert("Submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Head><title>Loading Mission | Velric</title></Head>
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
        <Head><title>Mission Not Found | Velric</title></Head>
        <main className="bg-[#0D0D0D] text-white min-h-screen">
          <DashboardNavigation activeTab="missions" />
          <div className="pt-24 px-4 text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto" />
            <h1 className="text-3xl font-bold mt-4 mb-4">Mission Not Found</h1>
            <p className="text-gray-400 mb-6">{error}</p>
            <button onClick={handleGoBack} className="px-6 py-3 bg-gradient-to-r from-velricViolet to-plasmaBlue rounded-lg">
              Go Back
            </button>
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
      </Head>

      <main className="bg-[#0D0D0D] text-white min-h-screen antialiased">
        <DashboardNavigation activeTab="missions" />

        {/* HEADER */}
        <div className="bg-gradient-to-b from-[#1A1A1A] to-[#0D0D0D] border-b border-gray-800/50">
          <div className="px-4 pt-24 pb-8 max-w-7xl mx-auto">
            <button onClick={handleGoBack} className="text-gray-400 hover:text-white flex items-center gap-2 mb-6">
              <ArrowLeft className="w-4 h-4" /> Back to Mission
            </button>

            <h1 className="text-4xl font-bold text-white mb-3">{mission.title}</h1>

            {tabSwitchCount > 0 && (
              <div className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-md w-fit">
                <span className="text-yellow-400 text-sm font-medium">
                  {tabSwitchCount} Tab Switch{tabSwitchCount !== 1 ? "es" : ""}
                </span>
              </div>
            )}
          </div>
        </div>

        {}
        <section className="px-4 py-12 max-w-7xl mx-auto space-y-8">
          {/* IDE */}
          {missionNeedsIDE(mission.type, mission.tasks) && (
            <div className="bg-[#1C1C1E] rounded-lg border border-gray-800 p-8">
              <h2 className="text-2xl font-semibold mb-4">Code Editor</h2>
              <TechnicalInterviewIDE interviewId={mission.id} initialLanguage={languageFromIDE} />
            </div>
          )}

          {}
          <div className="bg-[#1C1C1E] rounded-lg border border-gray-800 p-8">
            <h2 className="text-2xl font-semibold mb-4">Submit Your Response</h2>

            <SubmissionForm
              onSubmit={handleSubmission}
              isLoading={isSubmitting}
              code={codeFromIDE}
              language={languageFromIDE}
            />

            {submitSuccess && (
              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-md text-center text-green-400">
                Submitted! Redirecting…
              </div>
            )}
          </div>
        </section>

        {showTabSwitchWarning && (
          <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{
                scale: [1, 1.05, 1],
                x: [-4, 4, -4, 4, 0],
                opacity: 1
              }}
              transition={{ duration: 0.4 }}
              className="bg-[#1A1A1D] border border-orange-500/40 rounded-xl p-8 max-w-md w-full text-center shadow-xl"
            >
              <div className="text-orange-400 text-5xl mb-4">⚠️</div>

              <h2 className="text-3xl font-bold text-white mb-2">Tab Switch Detected!</h2>

              <p className="text-gray-300 mb-3">
                You switched tabs <span className="text-orange-400 font-bold">{tabSwitchCount}</span> times.
              </p>

              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 text-sm text-orange-300 mb-4">
                Multiple tab switches may result in mission termination.
              </div>

              <button
                onClick={() => setShowTabSwitchWarning(false)}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-semibold hover:opacity-90"
              >
                I Understand — Return to Mission
              </button>
            </motion.div>
          </div>
        )}

        <Footer />
      </main>
    </>
  );
}
