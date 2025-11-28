import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
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
  Inbox,
  FileText,
} from "lucide-react";
import RecruiterNotificationsDropdown from "./RecruiterNotificationsDropdown";

interface RecruiterNavbarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function RecruiterNavbar({
  activeTab,
  onTabChange,
}: RecruiterNavbarProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [interviewRequestCount, setInterviewRequestCount] = useState(0);

  // Auto-detect active tab from route if not provided
  const getActiveTab = () => {
    if (activeTab) return activeTab;
    const path = router.pathname;
    if (path === "/recruiter-dashboard") return "dashboard";
    if (path === "/recruiter/candidates") return "candidates";
    if (path === "/recruiter/applications") return "applications";
    if (path === "/recruiter/inbox") return "inbox";
    if (path === "/recruiter/settings") return "settings";
    return "dashboard";
  };

  const currentActiveTab = getActiveTab();

  useEffect(() => {
    const userDataString = localStorage.getItem("velric_user");
    if (userDataString) {
      try {
        const parsedUser = JSON.parse(userDataString);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  // Fetch interview request count
  useEffect(() => {
    if (!user?.id) return;

    const fetchInterviewCount = async () => {
      try {
        const response = await fetch(`/api/recruiter/interview-requests?recruiterId=${user.id}`);
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setInterviewRequestCount(result.count || 0);
          }
        }
      } catch (error) {
        console.error("Error fetching interview request count:", error);
      }
    };

    fetchInterviewCount();
    // Refresh every 30 seconds
    const interval = setInterval(fetchInterviewCount, 30000);
    return () => clearInterval(interval);
  }, [user?.id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showUserDropdown && !target.closest(".user-dropdown-container")) {
        setShowUserDropdown(false);
      }
      if (showNotificationsDropdown && !target.closest(".notification-dropdown-container")) {
        setShowNotificationsDropdown(false);
      }
    };

    if (showUserDropdown || showNotificationsDropdown) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showUserDropdown, showNotificationsDropdown]);

  const handleLogout = () => {
    localStorage.removeItem("velric_user");
    router.push("/");
  };

  const handleRoleSwitch = (newRole: "professional" | "recruiter") => {
    const userDataString = localStorage.getItem("velric_user");
    if (userDataString) {
      let userData = JSON.parse(userDataString);
      userData.role = newRole;
      localStorage.setItem("velric_user", JSON.stringify(userData));
    }

    if (newRole === "professional") {
      router.push("/user-dashboard");
    } else {
      router.push("/recruiter-dashboard");
    }
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/recruiter-dashboard" },
    { id: "candidates", label: "Candidates", icon: Search, path: "/recruiter/candidates" },
    { id: "applications", label: "Applications", icon: FileText, path: "/recruiter/applications" },
    { id: "inbox", label: "Inbox", icon: Inbox, path: "/recruiter/inbox" },
    { id: "settings", label: "Settings", icon: Settings, path: "/recruiter/settings" },
  ];

  const handleTabClick = (tab: { id: string; path: string }) => {
    // Always navigate to the page, don't use onTabChange for navigation
    router.push(tab.path);
  };

  return (
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
            className="h-8 brightness-110 cursor-pointer"
            onClick={() => router.push("/recruiter-dashboard")}
          />
        </div>
        <div className="flex items-center space-x-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentActiveTab === tab.id;

            return (
              <motion.button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
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
          {/* Notification Bell */}
          <div className="relative notification-dropdown-container">
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                setShowNotificationsDropdown(!showNotificationsDropdown);
              }}
              className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
              title="Interview Requests"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Bell className="w-5 h-5 text-white/70 hover:text-white" />
              {interviewRequestCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center"
                >
                  <span className="text-xs font-bold text-white">
                    {interviewRequestCount > 9 ? "9+" : interviewRequestCount}
                  </span>
                </motion.div>
              )}
            </motion.button>
            {showNotificationsDropdown && user?.id && (
              <RecruiterNotificationsDropdown
                isOpen={showNotificationsDropdown}
                onClose={() => setShowNotificationsDropdown(false)}
                recruiterId={user.id}
              />
            )}
          </div>

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

            <AnimatePresence>
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
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
}

