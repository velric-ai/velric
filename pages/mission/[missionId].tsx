import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import SubmissionForm from "@/components/SubmissionForm";
import { ArrowLeft, Clock, TrendingUp, Users } from "lucide-react";

interface StaticMission {
  id: string;
  title: string;
  description: string;
  field: string;
  difficulty: string;
  timeEstimate: string;
  category: string;
  skills: string[];
  industries: string[];
  tasks: string[];
  evaluationMetrics: string[];
  company?: string;
  context?: string;
  objectives?: string[];
  resources?: string[];
  status: "suggested" | "starred" | "in_progress" | "submitted" | "completed";
  grade?: number;
  feedback?: string;
  started_at?: string;
  submitted_at?: string;
  completed_at?: string;
}

export default function MissionPage() {
  const router = useRouter();
  const { missionId } = router.query;

  const [mission, setMission] = useState<StaticMission | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!missionId) return;

    const fetchMission = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/getMissions", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch missions");

        const data: StaticMission[] = await res.json();
        const found = data.find((m) => m.id === missionId);

        setMission(found || null);
      } catch (err) {
        console.error("Error fetching mission:", err);
        setMission(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMission();
  }, [missionId]);

  const handleBack = () => router.push("/mission/MissionDashboard");

  const handleSubmit = async (data: { submissionText: string }) => {
    setIsSubmitting(true);
    try {
      console.log("Mission submitted:", data);
      alert("Mission submitted successfully!");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D] text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#6A0DAD] mx-auto mb-4"></div>
          <p>Loading mission details...</p>
        </div>
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center flex-col">
        <p className="text-lg text-gray-300 mb-6">Mission not found.</p>
        <button
          onClick={handleBack}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg font-medium"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{mission.title} | Velric Missions</title>
        <meta name="description" content={mission.description} />
        <link rel="icon" href="/assets/logo.png" />
      </Head>

      <div className="min-h-screen bg-[#0D0D0D] text-white">
        <Navbar />

        <div className="max-w-5xl mx-auto px-6 py-16">
          <motion.button
            onClick={handleBack}
            className="flex items-center gap-2 text-[#00D9FF] hover:text-[#6A0DAD] mb-8 transition-colors"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="w-5 h-5" /> Back to Dashboard
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#6A0DAD] to-[#00D9FF] bg-clip-text text-transparent mb-4">
              {mission.title}
            </h1>
            <p className="text-gray-300 text-lg">{mission.description}</p>
          </motion.div>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 mb-10">
            <div className="flex items-center gap-2 text-[#00D9FF]">
              <Clock className="w-5 h-5" /> {mission.timeEstimate}
            </div>
            <div className="flex items-center gap-2 text-[#6A0DAD]">
              <TrendingUp className="w-5 h-5" /> {mission.difficulty}
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="w-5 h-5" /> {mission.field}
            </div>
          </div>

          {/* Tasks */}
          {mission.tasks?.length > 0 && (
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-[#00D9FF]">Tasks</h2>
              <ul className="list-decimal list-inside text-gray-300 space-y-3">
                {mission.tasks.map((task, idx) => (
                  <li key={idx}>{task}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Submission Box */}
          <section className="mt-12">
            <SubmissionForm onSubmit={handleSubmit} isLoading={isSubmitting} />
          </section>
        </div>

        <Footer />
      </div>
    </>
  );
}
