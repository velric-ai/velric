import Head from "next/head";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardNavigation from "@/components/dashboard/DashboardNavigation";
import ProfileCard from "@/components/ProfileCard";
import SurveyData from "@/components/SurveyData";
import { ProtectedDashboardRoute } from "../components/auth/ProtectedRoute";

function ProfileContent() {
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get user ID from localStorage
        const userDataStr = localStorage.getItem('velric_user');
        if (!userDataStr) {
          throw new Error('User not authenticated');
        }

        const localUser = JSON.parse(userDataStr);
        const userId = localUser.id;

        if (!userId) {
          throw new Error('User ID not found');
        }

        // Fetch user data from API
        const response = await fetch(`/api/user/${userId}`);
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch user data');
        }

        // Format user data for ProfileCard
        setUserData({
          name: result.user.name || 'User',
          email: result.user.email,
          avatar: "/assets/default-avatar.png",
          status: result.user.onboarded ? "Active" : "Pending Onboarding",
          statusDescription: result.user.onboarded 
            ? "Your profile is complete" 
            : "Complete your onboarding to get started",
          onboarded: result.user.onboarded,
          profileComplete: result.user.profile_complete,
        });
      } catch (err: any) {
        console.error('Error fetching user data:', err);
        setError(err.message || 'Failed to load user data');
        
        // Fallback to mock data on error
        setUserData({
          name: "User",
          email: "user@example.com",
          avatar: "/assets/default-avatar.png",
          status: "Loading...",
          statusDescription: "Unable to load user data",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const [surveyData, setSurveyData] = useState<any>(null);
  const [isLoadingSurvey, setIsLoadingSurvey] = useState(true);

  // Fetch survey data from API
  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        setIsLoadingSurvey(true);

        // Get user ID from localStorage
        const userDataStr = localStorage.getItem('velric_user');
        if (!userDataStr) {
          setIsLoadingSurvey(false);
          return;
        }

        const localUser = JSON.parse(userDataStr);
        const userId = localUser.id;

        if (!userId) {
          setIsLoadingSurvey(false);
          return;
        }

        // Fetch survey data from API
        const response = await fetch(`/api/survey/${userId}`);
        const result = await response.json();

        if (!result.success) {
          console.error('Failed to fetch survey data:', result.error);
          setIsLoadingSurvey(false);
          return;
        }

        // Transform API response to match SurveyData component format
        if (result.surveyData) {
          const transformedData = {
            fullName: result.surveyData.full_name || "",
            educationLevel: result.surveyData.education_level || "",
            industry: result.surveyData.industry || "",
            missionFocus: Array.isArray(result.surveyData.mission_focus) 
              ? result.surveyData.mission_focus 
              : [],
            strengthAreas: Array.isArray(result.surveyData.strength_areas) 
              ? result.surveyData.strength_areas 
              : [],
            learningPreference: result.surveyData.learning_preference || "",
            platformConnections: result.surveyData.platform_connections || {
              github: { connected: false },
              codesignal: { connected: false },
              hackerrank: { connected: false },
            },
          };
          setSurveyData(transformedData);
        }
      } catch (err: any) {
        console.error('Error fetching survey data:', err);
      } finally {
        setIsLoadingSurvey(false);
      }
    };

    fetchSurveyData();
  }, []);

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
                {isLoading ? (
                  <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-8 text-center">
                    <div className="animate-pulse">
                      <div className="w-24 h-24 mx-auto mb-4 bg-white/10 rounded-full"></div>
                      <div className="h-4 bg-white/10 rounded w-3/4 mx-auto mb-2"></div>
                      <div className="h-4 bg-white/10 rounded w-1/2 mx-auto"></div>
                    </div>
                  </div>
                ) : error ? (
                  <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl p-8 text-center">
                    <p className="text-red-400">{error}</p>
                  </div>
                ) : (
                  <ProfileCard user={userData} />
                )}
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
              {isLoadingSurvey ? (
                <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-8">
                  <div className="animate-pulse">
                    <div className="h-6 bg-white/10 rounded w-1/3 mb-4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="h-20 bg-white/10 rounded"></div>
                      <div className="h-20 bg-white/10 rounded"></div>
                      <div className="h-20 bg-white/10 rounded"></div>
                      <div className="h-20 bg-white/10 rounded"></div>
                    </div>
                  </div>
                </div>
              ) : surveyData ? (
                <SurveyData surveyData={surveyData} />
              ) : (
                <div className="bg-gradient-to-br from-gray-500/10 to-gray-600/10 border border-gray-500/20 rounded-xl p-8 text-center">
                  <p className="text-white/60">No survey data available. Please complete your onboarding survey.</p>
                </div>
              )}
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
