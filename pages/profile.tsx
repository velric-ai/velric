import Head from "next/head";
import { useState } from "react";
import { motion } from "framer-motion";
import DashboardNavigation from "@/components/dashboard/DashboardNavigation";
import ProfileCard from "@/components/ProfileCard";
import SurveyData from "@/components/SurveyData";
import { ProtectedDashboardRoute } from "../components/auth/ProtectedRoute";

function ProfileContent() {
  const [activeTab, setActiveTab] = useState("profile");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // ✅ Mock user data (used by ProfileCard)
  const mockUserData = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/assets/default-avatar.png",
    status: "Top 5%",
    statusDescription: "You're in the top 5% of all Velric users",
  };

  // ✅ Mock survey data (used by SurveyData)
  const mockSurveyData = {
    fullName: "John Doe",
    educationLevel: "Bachelor's Degree",
    industry: "Technology",
    missionFocus: ["Backend Development", "Data Analytics", "AI & Machine Learning"],
    strengthAreas: ["Problem Solving", "Technical Implementation", "System Design"],
    learningPreference: "Hands-on Projects",
    platformConnections: {
      github: { connected: true, username: "johndoe" },
      codesignal: { connected: true, username: "john_doe" },
      hackerrank: { connected: false },
    },
  };

  return (
    <>
      <Head>
        <title>Profile | Velric</title>
        <meta
          name="description"
          content="Your Velric profile - manage your information and view your survey data"
        />
        <link rel="icon" href="/assets/logo.png" />
      </Head>

      <div
        className="min-h-screen text-white"
        style={{
          background:
            "linear-gradient(135deg, #1a0b2e 0%, #16213e 50%, #0f3460 100%)",
        }}
      >
        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-cyan-500/10 to-green-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          />
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
                Profile
              </h1>
              <p className="text-white/60 text-lg">
                Manage your profile information and view your survey responses
              </p>
            </div>

            {/* Profile Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Left Column - Profile Card */}
              <div className="lg:col-span-1">
                <ProfileCard user={mockUserData} />
              </div>

              {/* Right Column - Quick Stats */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Quick Stats Cards */}
                  <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Velric Score
                    </h3>
                    <div className="text-3xl font-bold text-purple-400 mb-1">
                      95
                    </div>
                    <p className="text-white/60 text-sm">Top 5% globally</p>
                  </div>

                  <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 border border-cyan-500/20 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Missions Completed
                    </h3>
                    <div className="text-3xl font-bold text-cyan-400 mb-1">12</div>
                    <p className="text-white/60 text-sm">This month</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Streak
                    </h3>
                    <div className="text-3xl font-bold text-green-400 mb-1">7</div>
                    <p className="text-white/60 text-sm">Days active</p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Profile Views
                    </h3>
                    <div className="text-3xl font-bold text-orange-400 mb-1">24</div>
                    <p className="text-white/60 text-sm">This month</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Survey Data Section */}
            <div className="mb-8">
              <SurveyData surveyData={mockSurveyData} />
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedDashboardRoute>
      <ProfileContent />
    </ProtectedDashboardRoute>
  );
}
