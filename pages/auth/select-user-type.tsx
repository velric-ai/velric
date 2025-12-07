import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { User, Briefcase } from "lucide-react";
import { useSnackbar } from "@/hooks/useSnackbar";
import { createUser } from "@/lib/auth";
import { supabase } from "@/lib/supabaseClient";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useSession } from "next-auth/react";

export default function SelectUserType() {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const hasCheckedAuth = useRef(false);
  const [oauthData, setOauthData] = useState<{
    id: string;
    email: string;
    name: string | null;
    image: string | null;
  } | null>(null);

  useEffect(() => {
    // Prevent multiple checks
    if (hasCheckedAuth.current) {
      return;
    }

    // Wait for session to load
    if (status === 'loading') {
      return;
    }

    hasCheckedAuth.current = true;

    // Check if user is authenticated via NextAuth
    if (status === 'unauthenticated' || !session?.user) {
      showSnackbar("Please complete Google sign-up first.", "error");
      setTimeout(() => router.push("/signup"), 2000);
      return;
    }

    // Use session data directly instead of sessionStorage
    const authUser = session.user as any;
    setOauthData({
      id: authUser.id || session.user.email!,
      email: session.user.email!,
      name: session.user.name || null,
      image: session.user.image || null,
    });
  }, [session, status, router]);

  const handleUserTypeSelection = async (isRecruiter: boolean) => {
    if (!oauthData) {
      showSnackbar("Missing account information. Please try again.", "error");
      return;
    }

    setIsLoading(true);

    // Get tokens from session and pass to createUser to store them
    const sessionWithTokens = session as any;
    console.log('[SelectUserType] Signup - Session tokens:', {
      hasAccessToken: !!sessionWithTokens.accessToken,
      hasRefreshToken: !!sessionWithTokens.refreshToken,
      expiresAt: sessionWithTokens.expiresAt,
      userId: oauthData.id,
      email: oauthData.email,
    });
    
    const result = await createUser({
      id: oauthData.id,
      email: oauthData.email,
      name: oauthData.name,
      image: oauthData.image,
      isRecruiter: isRecruiter,
      accessToken: sessionWithTokens.accessToken,
      refreshToken: sessionWithTokens.refreshToken,
      expiresAt: sessionWithTokens.expiresAt,
    });

    if (!result.success) {
      // Error creating user, show error message
      showSnackbar(result.error, "error");
      setIsLoading(false);
      return;
    }

    const userData = result.data;

    // Store user in localStorage
    const userObject = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      onboarded: userData.onboarded,
      isRecruiter: userData.isRecruiter,
      createdAt: userData.createdAt,
      surveyCompletedAt: userData.surveyCompletedAt,
      surveyCompleted: userData.surveyCompleted,
      profileComplete: userData.profileComplete,
    };
    localStorage.setItem("velric_user", JSON.stringify(userObject));

    // Redirect based on user type
    if (isRecruiter) {
      router.push("/recruiter-dashboard");
    } else {
      // For professionals, check if they need to complete survey
      const { data: surveyResponse } = await supabase
        .from("survey_responses")
        .select("id")
        .eq("user_id", userData.id)
        .maybeSingle();

      if (surveyResponse) {
        router.push("/user-dashboard");
      } else {
        // User hasn't completed survey yet, send to survey
        localStorage.removeItem("velric_survey_draft");
        localStorage.removeItem("velric_survey_state");
        const freshSurveyState = {
          currentStep: 1,
          currentStepIndex: 0,
          totalSteps: 9,
          completedSteps: [],
          surveyData: {},
          startedAt: new Date().toISOString(),
        };
        localStorage.setItem("velric_survey_state", JSON.stringify(freshSurveyState));
        router.push("/onboard/survey");
      }
    }
  };

  if (!oauthData) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-white mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Select User Type | Velric</title>
        <meta
          name="description"
          content="Select your user type: Professional or Recruiter"
        />
        <link rel="icon" href="/assets/logo.png" />
      </Head>

      <main className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center px-4">
        {/* Background decorative elements */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl relative z-10"
        >
          <div className="bg-[#1C1C1E] rounded-2xl p-8 border border-white/10">
            {/* Logo */}
            <div className="text-center mb-8">
              <img
                src="/assets/logo.png"
                alt="Velric"
                className="h-12 mx-auto mb-4 brightness-110"
              />
              <h1 className="text-3xl font-bold mb-2">Welcome to Velric!</h1>
              <p className="text-white/70">
                Please select how you want to use Velric
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Professional Card */}
              <motion.button
                onClick={() => handleUserTypeSelection(false)}
                disabled={isLoading}
                className="p-6 rounded-2xl border-2 border-transparent transition-all duration-300 flex flex-col items-center justify-center text-left space-y-3 bg-[#0D0D0D] hover:border-cyan-500/50 hover:bg-cyan-500/5 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={!isLoading ? { scale: 1.05 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
              >
                <User className="w-10 h-10 text-cyan-400" />
                <h2 className="text-xl font-semibold text-white">
                  I'm a Professional
                </h2>
                <p className="text-white/60 text-sm">
                  Track your score, complete missions, and get hired by top companies.
                </p>
                {isLoading ? (
                  <div className="mt-4">
                    <div className="w-5 h-5 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto"></div>
                  </div>
                ) : (
                  <div className="mt-2 text-cyan-400 font-medium text-sm">
                    Continue as Professional →
                  </div>
                )}
              </motion.button>

              {/* Recruiter Card */}
              <motion.button
                onClick={() => handleUserTypeSelection(true)}
                disabled={isLoading}
                className="p-6 rounded-2xl border-2 border-transparent transition-all duration-300 flex flex-col items-center justify-center text-left space-y-3 bg-[#0D0D0D] hover:border-purple-500/50 hover:bg-purple-500/5 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={!isLoading ? { scale: 1.05 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
              >
                <Briefcase className="w-10 h-10 text-purple-400" />
                <h2 className="text-xl font-semibold text-white">
                  I'm a Recruiter
                </h2>
                <p className="text-white/60 text-sm">
                  Find top talent, post jobs, and manage your hiring pipeline.
                </p>
                {isLoading ? (
                  <div className="mt-4">
                    <div className="w-5 h-5 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin mx-auto"></div>
                  </div>
                ) : (
                  <div className="mt-2 text-purple-400 font-medium text-sm">
                    Continue as Recruiter →
                  </div>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </main>
    </>
  );
}

