import Head from "next/head";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardNavigation from "@/components/dashboard/DashboardNavigation";
import ProfileCard from "@/components/ProfileCard";
import SurveyData from "@/components/SurveyData";
import { ProtectedDashboardRoute } from "../components/auth/ProtectedRoute";
import { Upload, X } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useSnackbar } from "@/hooks/useSnackbar";
import router from "next/router";

function ProfileContent() {
  const { showSnackbar } = useSnackbar();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const showUserDataError = (message?: string) => {
    const friendlyMessage = message || "Failed to load user data";
    setError(friendlyMessage);
    showSnackbar(friendlyMessage, "error");
    setUserData({
      name: "User",
      email: "user@example.com",
      avatar: "/assets/default-avatar.png",
      status: "Loading...",
      statusDescription: "Unable to load user data",
    });
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
          showUserDataError('User not authenticated');
          return;
        }

        const localUser = JSON.parse(userDataStr);
        const userId = localUser.id;

        if (!userId) {
          showUserDataError('User ID not found');
          return;
        }

        // Fetch user data from API
        const response = await fetch(`/api/user/${userId}`);
        const result = await response.json();

        if (!response.ok || !result.success) {
          showUserDataError(result.error || 'Failed to fetch user data');
          return;
        }

        // Format user data for ProfileCard
        setUserData({
          name: result.user.name || 'User',
          email: result.user.email,
          avatar: result.user.profile_image || "/assets/default-avatar.png",
          status: result.user.onboarded ? "Active" : "Pending Onboarding",
          statusDescription: result.user.onboarded 
            ? "Your profile is complete" 
            : "Complete your onboarding to get started",
          onboarded: result.user.onboarded,
          profileComplete: result.user.profile_complete,
        });
        
        // Set preview if image exists
        if (result.user.profile_image) {
          setProfileImagePreview(result.user.profile_image);
        }
      } catch (err: any) {
        console.error('Error fetching user data:', err);
        showUserDataError(err?.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const [surveyData, setSurveyData] = useState<any>(null);
  const [isLoadingSurvey, setIsLoadingSurvey] = useState(true);
  const [totalMissionsCompleted, setTotalMissionsCompleted] = useState<number>(0);
  const [averageVelricScore, setAverageVelricScore] = useState<number>(0);
  const [profileViews, setProfileViews] = useState<number>(0);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

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

  // Fetch mission statistics and profile views
  useEffect(() => {
    const fetchMissionStats = async () => {
      try {
        setIsLoadingStats(true);
        
        // Get user ID from localStorage
        const userDataStr = localStorage.getItem('velric_user');
        if (!userDataStr) {
          setIsLoadingStats(false);
          return;
        }

        const localUser = JSON.parse(userDataStr);
        const userId = localUser.id;

        if (!userId) {
          setIsLoadingStats(false);
          return;
        }

        // Fetch missions from analytics API and quick stats
        const [analyticsResponse, quickStatsResponse] = await Promise.all([
          fetch(`/api/analytics?userId=${userId}`),
          fetch(`/api/user/quick-stats?userId=${userId}`),
        ]);

        const analyticsResult = await analyticsResponse.json();
        const quickStatsResult = await quickStatsResponse.json();

        if (analyticsResult.success && analyticsResult.missions) {
          // Count completed missions (status is 'completed' or 'graded')
          const completedMissions = analyticsResult.missions.filter((mission: any) => 
            mission.status === 'completed' || mission.status === 'graded'
          );
          setTotalMissionsCompleted(completedMissions.length);

          // Calculate average velric score from all missions with scores
          const missionsWithScores = analyticsResult.missions.filter((mission: any) => 
            mission.velric_score !== null && 
            mission.velric_score !== undefined && 
            typeof mission.velric_score === 'number'
          );

          if (missionsWithScores.length > 0) {
            const totalScore = missionsWithScores.reduce((sum: number, mission: any) => 
              sum + mission.velric_score, 0
            );
            const average = totalScore / missionsWithScores.length;
            setAverageVelricScore(Math.round(average * 10) / 10); // Round to 1 decimal place
          } else {
            setAverageVelricScore(0);
          }
        }

        // Set profile views from quick stats
        if (quickStatsResult.success && quickStatsResult.stats?.profileViews) {
          setProfileViews(quickStatsResult.stats.profileViews.count || 0);
        }
      } catch (err: any) {
        console.error('Error fetching mission stats:', err);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchMissionStats();
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showSnackbar('Image size must be less than 5MB', 'error');
      return;
    }

    setProfileImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setProfileImage(null);
    // Reset preview to current user avatar or null
    const currentAvatar = userData?.avatar && userData.avatar !== "/assets/default-avatar.png" 
      ? userData.avatar 
      : null;
    setProfileImagePreview(currentAvatar);
  };

  const handleImageUpload = async () => {
    if (!profileImage) return;

    try {
      setIsUploadingImage(true);
      const fileName = `profile_${Date.now()}_${profileImage.name}`;
      
      const { data, error } = await supabase.storage
        .from("portfolio_uploads")
        .upload(fileName, profileImage, {
          upsert: false,
          contentType: profileImage.type,
        });

      if (error) {
        showSnackbar("Failed to upload image. Please try again.", "error");
        return null;
      }

      const { data: urlData } = supabase.storage
        .from("portfolio_uploads")
        .getPublicUrl(fileName);

      // Update user profile image
      const userDataStr = localStorage.getItem('velric_user');
      if (!userDataStr) {
        showSnackbar('User not authenticated. Please log in again.', "error");
        return null;
      }

      const localUser = JSON.parse(userDataStr);
      const userId = localUser.id;

      const response = await fetch('/api/user/upload-avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          imageUrl: urlData.publicUrl,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        const errorMessage = result.error || 'Failed to update profile image';
        showSnackbar(errorMessage, "error");
        return null;
      }

      // Update local state
      setUserData((prev:any) => prev ? { ...prev, avatar: urlData.publicUrl } : prev);
      setProfileImage(null);
    } catch (error: any) {
      console.error('Error uploading profile image:', error);
      showSnackbar(error.message || 'Failed to upload image. Please try again.', 'error');
    } finally {
      setIsUploadingImage(false);
    }
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
        <DashboardNavigation activeTab="profile" />

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
              <div className="lg:col-span-1 space-y-4">
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
                  <>
                    <ProfileCard 
                      user={userData} 
                      onImageClick={() => {
                        const input = document.getElementById('profileImageUpload') as HTMLInputElement;
                        input?.click();
                      }}
                    />
                    {/* Hidden file input */}
                    <input
                      type="file"
                      id="profileImageUpload"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    {/* Image upload modal/preview */}
                    {profileImage && (
                      <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Update Profile Picture</h3>
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="relative w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                            {profileImagePreview && (
                              <img
                                src={profileImagePreview}
                                alt="Profile preview"
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-white/80 mb-2">{profileImage.name}</p>
                            <p className="text-xs text-white/60">Max 5MB, JPG/PNG</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={handleImageUpload}
                            disabled={isUploadingImage}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isUploadingImage ? "Uploading..." : "Save Image"}
                          </button>
                          <button
                            onClick={removeImage}
                            className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Right Column - Quick Stats */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Quick Stats Cards */}
                  <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Average Velric Score
                    </h3>
                    {isLoadingStats ? (
                      <div className="text-3xl font-bold text-purple-400 mb-1">-</div>
                    ) : (
                      <div className="text-3xl font-bold text-purple-400 mb-1">
                        {averageVelricScore > 0 ? averageVelricScore.toFixed(1) : '0.0'}
                      </div>
                    )}
                    <p className="text-white/60 text-sm">Across all missions</p>
                  </div>

                  <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 border border-cyan-500/20 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Missions Completed
                    </h3>
                    {isLoadingStats ? (
                      <div className="text-3xl font-bold text-cyan-400 mb-1">-</div>
                    ) : (
                      <div className="text-3xl font-bold text-cyan-400 mb-1">{totalMissionsCompleted}</div>
                    )}
                    <p className="text-white/60 text-sm">Total completed</p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-xl p-6 md:col-span-2">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Profile Views
                    </h3>
                    {isLoadingStats ? (
                      <div className="text-3xl font-bold text-orange-400 mb-1">-</div>
                    ) : (
                      <div className="text-3xl font-bold text-orange-400 mb-1">{profileViews}</div>
                    )}
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
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-white">Survey Information</h2>
                    <button
                      onClick={() => router.push('/onboard/survey')}
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Survey
                    </button>
                  </div>
                  <SurveyData surveyData={surveyData} />
                </div>
              ) : (
                <div className="bg-gradient-to-br from-gray-500/10 to-gray-600/10 border border-gray-500/20 rounded-xl p-8 text-center">
                  <p className="text-white/60 mb-4">No survey data available. Please complete your onboarding survey.</p>
                  <button
                    onClick={() => router.push('/onboard/survey')}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    Complete Survey
                  </button>
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
