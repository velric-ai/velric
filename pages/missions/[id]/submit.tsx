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
  const { id } = router.query;
  const { showSnackbar } = useSnackbar();

  const [mission, setMission] = useState<StaticMission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);

  // ✅ TAB TRACKING STATE (CLEAN)
  const [showTabPopup, setShowTabPopup] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const wasVisibleRef = useRef(true);

  const [codeFromIDE, setCodeFromIDE] = useState<string>("");
  const [languageFromIDE, setLanguageFromIDE] = useState<string>("python");

  // ✅ Get logged-in user
  useEffect(() => {
    const userDataStr = localStorage.getItem("velric_user");
    if (userDataStr) {
      try {
        const user = JSON.parse(userDataStr);
        setUserId(user.id);
      } catch {}
    }
  }, []);

  // ✅ Load saved code + language
  useEffect(() => {
    if (!id || typeof id !== "string") return;

    const savedCode = localStorage.getItem(`interview_${id}_code`);
    const savedLanguage = localStorage.getItem(`interview_${id}_language`);

    if (savedCode) setCodeFromIDE(savedCode);
    if (savedLanguage) setLanguageFromIDE(savedLanguage);
  }, [id]);

  // ✅ TAB SWITCH DETECTION (FINAL + WORKING)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        wasVisibleRef.current = false;
      } else {
        if (!wasVisibleRef.current) {
          setTabSwitchCount((prev) => prev + 1);
          setShowTabPopup(true);
          if (navigator.vibrate) navigator.vibrate(250);
          wasVisibleRef.current = true;
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // ✅ Fetch mission
  useEffect(() => {
    if (!id || typeof id !== "string") return;

    const fetchMission = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/missions/${id}`);
        const data = await res.json();
        if (!data.success) throw new Error("Mission not found");
        setMission(data.mission);
      } catch (err) {
        setError("Failed to load mission");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMission();
  }, [id]);

  const handleSubmission = async (form: {
    submissionText: string;
    code?: string;
    language?: string;
  }) => {
    if (!id || typeof id !== "string" || !userId) return;

    const freshCode =
      localStorage.getItem(`interview_${id}_code`) || form.code || "";
    const freshLanguage =
      localStorage.getItem(`interview_${id}_language`) ||
      form.language ||
      "python";

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
      if (!data.success) throw new Error("Submission failed");

      setSubmitSuccess(true);
      router.push(`/feedback/${data.id}`);
    } catch (err) {
      showSnackbar("Submission failed", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="bg-[#0D0D0D] min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </main>
    );
  }

  if (error || !mission) {
    return (
      <main className="bg-[#0D0D0D] min-h-screen flex items-center justify-center text-white">
        <AlertCircle className="w-10 h-10 text-red-400" />
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>{mission.title} – Submit</title>
      </Head>

      <main className="bg-[#0D0D0D] text-white min-h-screen">
        <DashboardNavigation activeTab="missions" />

        <section className="px-8 py-12 max-w-6xl mx-auto space-y-8">
          <motion.button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </motion.button>

          <div className="bg-[#1C1C1E] p-6 rounded-lg border border-gray-800">
            <TechnicalInterviewIDE
              interviewId={mission.id}
              initialLanguage={languageFromIDE}
            />
          </div>

          <div className="bg-[#1C1C1E] p-6 rounded-lg border border-gray-800">
            <SubmissionForm
              onSubmit={handleSubmission}
              isLoading={isSubmitting}
              code={codeFromIDE}
              language={languageFromIDE}
            />

            {submitSuccess && (
              <p className="mt-4 text-green-400 text-center">
                Submitted! Redirecting...
              </p>
            )}
          </div>
        </section>

        <Footer />
      </main>

      {/* ✅ TAB SWITCH POPUP */}
      {showTabPopup && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050510]/80 backdrop-blur-md">
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative w-full max-w-md rounded-2xl border border-orange-400/40 bg-gradient-to-b from-[#0E0E2E] to-[#070717] p-8 shadow-2xl animate-shake"
    >
      <div className="absolute inset-0 rounded-2xl border border-orange-500/30 pointer-events-none" />

      <div className="mb-6 flex justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500/10 border border-orange-500/40">
          <span className="text-orange-400 text-3xl">⚠️</span>
        </div>
      </div>

      <h2 className="text-center text-2xl font-bold text-white mb-2">
        Tab Switch Detected!
      </h2>

      <p className="text-center text-gray-300 mb-5">
        You have switched tabs or left this mission window{" "}
        <span className="text-orange-400 font-semibold">
          {tabSwitchCount} times
        </span>.
      </p>

      <div className="mb-5 rounded-lg border border-orange-500/30 bg-orange-500/10 p-4 text-sm text-orange-300 text-center">
        ⚠️ Multiple tab switches may result in mission termination and a recorded
        integrity violation.
      </div>

      <p className="mb-6 text-center text-sm text-gray-400">
        Please remain on this tab for the duration of the mission. All activity
        is being monitored and recorded.
      </p>

      <button
        onClick={() => setShowTabPopup(false)}
        className="w-full rounded-lg bg-gradient-to-r from-orange-400 to-orange-500 py-3 font-semibold text-black hover:opacity-90 transition"
      >
        I Understand – Return to Mission
      </button>
    </motion.div>
  </div>
)}

    </>
  );
}
