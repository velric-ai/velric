import Head from "next/head";
import Navbar from "@/components/Navbar";
import DashboardSection from "@/components/DashboardSection";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { MissionTemplate } from "@/types";


export default function Dashboard() {
  const [missions, setMissions] = useState<{
    starred: any[];
    inProgress: any[];
    completed: any[];
    suggested: any[];
  }>({
    starred: [],
    inProgress: [],
    completed: [],
    suggested: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // For demo purposes, using a hardcoded user ID
  // In a real app, this would come from authentication context
  const userId = "demo-user-123";

  useEffect(() => {
    fetchUserMissions();
  }, []);

  const fetchUserMissions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch user missions from API
      const response = await fetch(`/api/user/missions?userId=${userId}`);
      const data = await response.json();

      if (data.success) {
        // Transform API data to match expected format
        const transformedMissions = {
          starred: data.missions.filter((m: any) => m.status === "starred"),
          inProgress: data.missions.filter(
            (m: any) => m.status === "in_progress"
          ),
          completed: data.missions.filter((m: any) => m.status === "completed"),
          suggested: data.missions.filter(
            (m: any) => m.status === "suggested" || !m.status
          ),
        };

        setMissions(transformedMissions);
      } else {
        console.warn("Failed to fetch missions:", data.error);
        setError(data.error || "Failed to fetch missions");
        // Fallback to empty state instead of mock data
        setMissions({
          starred: [],
          inProgress: [],
          completed: [],
          suggested: [],
        });
      }
    } catch (error) {
      console.error("Error fetching missions:", error);
      setError("Failed to load missions. Please try again.");
      // Fallback to empty state instead of mock data
      setMissions({
        starred: [],
        inProgress: [],
        completed: [],
        suggested: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generatePersonalizedMissions = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      const response = await fetch("/api/personalized_missions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          count: 5,
          regenerate: true,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh missions after generation
        await fetchUserMissions();
      } else {
        setError(data.error || "Failed to generate personalized missions");
      }
    } catch (error) {
      console.error("Error generating missions:", error);
      setError("Failed to generate personalized missions");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Head>
        <title>Dashboard | Velric</title>
        <meta
          name="description"
          content="Your mission dashboard - track your progress and discover new challenges"
        />
        <link rel="icon" href="/assets/logo.png" />
      </Head>

      <main className="bg-[#0D0D0D] text-white font-sans antialiased min-h-screen">
        <Navbar />

        {/* Dashboard Header */}
        <div className="pt-24 px-4 md:px-8 lg:px-16 pb-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-[#F5F5F5] bg-clip-text text-transparent">
                Your Mission Dashboard
              </h1>
              <p className="text-lg text-white/80 max-w-2xl mx-auto mb-6">
                Track your progress, manage active missions, and discover new
                challenges tailored to your skills.
              </p>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
                  <p className="text-red-400">{error}</p>
                </div>
              )}

              {/* Generate Missions Button */}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={generatePersonalizedMissions}
                  disabled={isGenerating}
                  className="px-6 py-3 bg-gradient-to-r from-[#007AFF] to-[#0056CC] text-white font-semibold rounded-lg hover:from-[#0056CC] hover:to-[#003D99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating
                    ? "Generating..."
                    : "Generate Personalized Missions"}
                </button>
                <button
                  onClick={fetchUserMissions}
                  disabled={isLoading}
                  className="px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Loading..." : "Refresh"}
                </button>
              </div>
            </motion.div>

            {/* Stats Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
            >
              <div className="bg-[#1C1C1E] p-6 rounded-2xl text-center">
                <div className="text-2xl font-bold text-[#6A0DAD]">
                  {missions.completed.length}
                </div>
                <div className="text-sm text-white/70">Completed</div>
              </div>
              <div className="bg-[#1C1C1E] p-6 rounded-2xl text-center">
                <div className="text-2xl font-bold text-[#00D9FF]">
                  {missions.inProgress.length}
                </div>
                <div className="text-sm text-white/70">In Progress</div>
              </div>
              <div className="bg-[#1C1C1E] p-6 rounded-2xl text-center">
                <div className="text-2xl font-bold text-[#F5F5F5]">
                  {missions.starred.length}
                </div>
                <div className="text-sm text-white/70">Starred</div>
              </div>
              <div className="bg-[#1C1C1E] p-6 rounded-2xl text-center">
                <div className="text-2xl font-bold text-[#6A0DAD]">
                  {missions.completed.reduce(
                    (sum: number, mission: any) => sum + (mission.grade || 0),
                    0
                  ) +
                    missions.completed.length * 10}
                </div>
                <div className="text-sm text-white/70">Velric Score</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Mission Sections */}
        <div className="px-4 md:px-8 lg:px-16 pb-20">
          <div className="max-w-7xl mx-auto space-y-12">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <p className="mt-4 text-white/70">Loading your missions...</p>
              </div>
            ) : (
              <>
                {/* Starred Missions */}
                <DashboardSection
                  title="Starred Missions"
                  description="Missions you've saved for later"
                  missions={missions.starred}
                  emptyMessage="No starred missions yet. Star missions you want to work on later!"
                  icon="⭐"
                />

                {/* In Progress Missions */}
                <DashboardSection
                  title="In Progress"
                  description="Missions you're currently working on"
                  missions={missions.inProgress}
                  emptyMessage="No active missions. Start a mission to see it here!"
                  icon="🚀"
                />

                {/* Completed Missions */}
                <DashboardSection
                  title="Completed"
                  description="Missions you've successfully finished"
                  missions={missions.completed}
                  emptyMessage="No completed missions yet. Complete your first mission to see it here!"
                  icon="✅"
                />

                {/* Suggested Missions */}
                <DashboardSection
                  title="Suggested for You"
                  description="AI-recommended missions based on your skills and interests"
                  missions={missions.suggested}
                  emptyMessage="No suggestions available. Complete your profile to get personalized recommendations!"
                  icon="💡"
                />
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
