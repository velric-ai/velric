import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Search,
  Users,
  Briefcase,
  Settings,
  Bell,
  ChevronDown,
  LogOut,
  User,
  UserCircle,
} from "lucide-react";
import { ProtectedDashboardRoute } from "../components/auth/ProtectedRoute";
import { WelcomeMessage } from "../components/dashboard/WelcomeMessage";

function RecruiterDashboardContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Function to switch roles and update localStorage
  const handleRoleSwitch = (newRole: "professional" | "recruiter") => {
    // 1. Update the role in localStorage
    const userDataString = localStorage.getItem("velric_user");
    if (userDataString) {
      let userData = JSON.parse(userDataString);
      userData.role = newRole; // Set the new role
      localStorage.setItem("velric_user", JSON.stringify(userData));
    }

    // 2. Redirect to the new dashboard
    if (newRole === "professional") {
      router.push("/user-dashboard");
    } else {
      router.push("/recruiter-dashboard");
    }
  };

  // Check authentication and load user data
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
        // Check both isRecruiter (frontend) and is_recruiter (backend) for compatibility
        const isRecruiter = Boolean(parsedUser.isRecruiter || parsedUser.is_recruiter);
        if (!isRecruiter) {
          // If not recruiter, redirect to appropriate dashboard
          if (parsedUser.onboarded === true) {
            router.push("/user-dashboard");
          } else {
            router.push("/onboard/survey");
          }
          return;
        }

        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        router.push("/login");
        return;
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showUserDropdown && !target.closest(".user-dropdown-container")) {
        setShowUserDropdown(false);
      }
    };

    if (showUserDropdown) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showUserDropdown]);

  const handleLogout = () => {
    localStorage.removeItem("velric_user");
    router.push("/");
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "candidates", label: "Candidates", icon: Users },
    { id: "jobs", label: "Job Posts", icon: Briefcase },
    { id: "settings", label: "Settings", icon: Settings },
  ];

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
        <nav
          className="fixed top-0 left-0 right-0 z-50 h-16"
          style={{
            background: "rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src="/assets/logo.png"
                alt="Velric Logo"
                className="h-8 brightness-110"
              />
            </div>
            <div className="flex items-center space-x-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                    }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                      isActive
                        ? "bg-purple-500/30 text-white border border-purple-500/50"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{tab.label}</span>
                  </motion.button>
                );
              })}
            </div>

            <div className="flex items-center space-x-4">
              <motion.button
                className="relative p-2 rounded-lg hover:bg-white/5 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Bell className="w-5 h-5 text-white/80" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  5
                </span>
              </motion.button>

              <div className="relative user-dropdown-container">
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUserDropdown(!showUserDropdown);
                  }}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                    {user?.name ? (
                      user.name.charAt(0).toUpperCase()
                    ) : (
                      <Briefcase className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold text-white">
                      {user?.name || "Recruiter"}
                    </span>
                    <span className="text-xs text-white/60">
                      {user?.email || ""}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-white/60 transition-transform ${
                      showUserDropdown ? "rotate-180" : ""
                    }`}
                  />
                </motion.button>

                {/* Dropdown Menu */}
                {showUserDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-56 rounded-xl overflow-hidden z-50"
                    style={{
                      background: "rgba(0, 0, 0, 0.8)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
                    }}
                  >
                    {/* User Info Section */}
                    {user && (
                      <div className="px-4 py-3 border-b border-white/10">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-semibold">
                            {user.name ? user.name.charAt(0).toUpperCase() : "R"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">
                              {user.name || "Recruiter"}
                            </p>
                            <p className="text-xs text-white/60 truncate">
                              {user.email || ""}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowUserDropdown(false);
                        // ⭐ Use the new role switch handler
                        handleRoleSwitch("professional");
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-white/5 transition-colors"
                      whileHover={{
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <User className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm font-medium text-white">
                        Switch to Professional
                      </span>
                    </motion.button>
                    
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowUserDropdown(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-white/5 transition-colors"
                      whileHover={{
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <LogOut className="w-4 h-4 text-red-400" />
                      <span className="text-sm font-medium text-white">
                        Logout
                      </span>
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </nav>

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

            {/* Dashboard Content based on Active Tab */}
            {activeTab === "dashboard" && (
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
                  onClick={() => setActiveTab("candidates")}
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
                  onClick={() => setActiveTab("jobs")}
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
            )}

            {/* General Placeholder for other tabs */}
            {activeTab !== "dashboard" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="py-20 text-center"
              >
                <h2 className="text-3xl font-bold text-white mb-4 capitalize">
                  {activeTab} Section
                </h2>
                <p className="text-white/60">
                  This area is where the **{activeTab}** functionality for
                  recruiters will be developed!
                </p>
              </motion.div>
            )}
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
