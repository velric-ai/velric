import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
  Users,
  Briefcase,
  Search,
} from "lucide-react";
import { ProtectedDashboardRoute } from "../components/auth/ProtectedRoute";
import { WelcomeMessage } from "../components/dashboard/WelcomeMessage";
import RecruiterNavbar from "../components/recruiter/RecruiterNavbar";

function RecruiterDashboardContent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication
  useEffect(() => {
    const checkAuth = () => {
      const userDataString = localStorage.getItem("velric_user");

      if (!userDataString) {
        router.push("/login");
        return;
      }

      try {
        const parsedUser = JSON.parse(userDataString);

        // Safety check: if user is not a recruiter, redirect
        const isRecruiter = Boolean(parsedUser.isRecruiter || parsedUser.is_recruiter);
        if (!isRecruiter) {
          if (parsedUser.onboarded === true) {
            router.push("/user-dashboard");
          } else {
            router.push("/onboard/survey");
          }
          return;
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        router.push("/login");
        return;
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [router]);


  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, #1a0b2e 0%, #16213e 50%, #0f3460 100%)",
        }}
      >
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading Recruiter Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Recruiter Dashboard | Velric</title>
        <meta
          name="description"
          content="Your Velric recruiter dashboard - find talent and manage jobs"
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
        <WelcomeMessage />

        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-pink-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: "20px 20px",
            }}
          />
        </div>

        {/* Top Navigation - RECRUITER */}
        <RecruiterNavbar />

        {/* Main Content */}
        <div className="relative z-10 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto px-4 py-8"
          >
            <h1 className="text-4xl font-extrabold text-white mb-8">
              Recruiter Dashboard
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Find Candidates Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="p-8 rounded-2xl cursor-pointer"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(15px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                }}
                onClick={() => router.push("/recruiter/candidates")}
              >
                <Search className="w-8 h-8 text-green-400 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Find Candidates</h2>
                <p className="text-white/70">
                  Search and filter top-ranked professionals by Velric Score
                  and skills.
                </p>
              </motion.div>

              {/* Job Posts Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="p-8 rounded-2xl cursor-pointer"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(15px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                }}
                onClick={() => router.push("/recruiter/jobs")}
              >
                <Briefcase className="w-8 h-8 text-pink-400 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Manage Job Posts</h2>
                <p className="text-white/70">
                  Create, edit, and track the performance of your job
                  listings.
                </p>
              </motion.div>

              {/* Placeholder Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="p-8 rounded-2xl"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(15px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                }}
              >
                <Users className="w-8 h-8 text-yellow-400 mb-4" />
                <h2 className="text-2xl font-bold mb-2">
                  Pipeline Analytics
                </h2>
                <p className="text-white/70">
                  Track your hiring funnel metrics and candidate engagement.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default function RecruiterDashboard() {
  return (
    <ProtectedDashboardRoute>
      <RecruiterDashboardContent />
    </ProtectedDashboardRoute>
  );
}
