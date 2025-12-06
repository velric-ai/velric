import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  Mail,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  Loader2,
  Video,
} from "lucide-react";
import { ProtectedDashboardRoute } from "../../components/auth/ProtectedRoute";
import { WelcomeMessage } from "../../components/dashboard/WelcomeMessage";
import RecruiterNavbar from "../../components/recruiter/RecruiterNavbar";
import { useSnackbar } from "@/hooks/useSnackbar";

interface InterviewRequest {
  id: string;
  candidate_id: string;
  candidate_name?: string | null;
  candidate_email?: string | null;
  interview_type: string;
  context: string;
  duration?: number; // Optional for backward compatibility
  preferred_date: string;
  preferred_time: string;
  start_time?: string | null;
  end_time?: string | null;
  message: string | null;
  status: string;
  google_meet_link?: string | null;
  created_at: string;
  updated_at: string;
}

// Helper function to format time range
const formatTimeRange = (startTime?: string | null, endTime?: string | null): string => {
  if (!startTime || !endTime) return "";
  const formatTime12 = (time24: string): string => {
    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };
  return `${formatTime12(startTime)} - ${formatTime12(endTime)}`;
};

const STATUS_COLORS = {
  pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  accepted: "bg-green-500/20 text-green-300 border-green-500/30",
  rejected: "bg-red-500/20 text-red-300 border-red-500/30",
  completed: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  cancelled: "bg-gray-500/20 text-gray-300 border-gray-500/30",
};

const STATUS_ICONS = {
  pending: ClockIcon,
  accepted: CheckCircle,
  rejected: XCircle,
  completed: CheckCircle,
  cancelled: XCircle,
};

function InboxContent() {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [interviewRequests, setInterviewRequests] = useState<InterviewRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    const checkAuth = () => {
      const userDataString = localStorage.getItem("velric_user");

      if (!userDataString) {
        router.push("/login");
        return;
      }

      try {
        const parsedUser = JSON.parse(userDataString);
        const isRecruiter = Boolean(parsedUser.isRecruiter || parsedUser.is_recruiter);
        if (!isRecruiter) {
          if (parsedUser.onboarded === true) {
            router.push("/user-dashboard");
          } else {
            router.push("/onboard/survey");
          }
          return;
        }
        setUser(parsedUser);
        setIsLoading(false);
      } catch (error) {
        console.error("Error parsing user data:", error);
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (user?.id) {
      fetchInterviewRequests();
    }
  }, [user?.id]);

  const fetchInterviewRequests = async () => {
    setIsLoadingRequests(true);
    try {
      const response = await fetch(`/api/recruiter/interview-requests?recruiterId=${user.id}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to fetch interview requests" }));
        showSnackbar(errorData.error || "Failed to fetch interview requests", "error");
        setIsLoadingRequests(false);
        return;
      }

      const result = await response.json().catch(() => ({ success: false, error: "Invalid response" }));

      if (!result.success) {
        showSnackbar(result.error || "Failed to fetch interview requests", "error");
        setIsLoadingRequests(false);
        return;
      }

      setInterviewRequests(result.interviewRequests || []);
    } catch (err: any) {
      console.error("Error fetching interview requests:", err);
      const errorMessage = err instanceof TypeError && err.message.includes("fetch")
        ? "Network error. Please check your connection."
        : err.message || "Failed to fetch interview requests";
      showSnackbar(errorMessage, "error");
    } finally {
      setIsLoadingRequests(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const filteredRequests =
    filterStatus === "all"
      ? interviewRequests
      : interviewRequests.filter((req) => req.status === filterStatus);

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #1a0b2e 0%, #16213e 50%, #0f3460 100%)",
        }}
      >
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Inbox - Interview Requests | Velric</title>
        <meta name="description" content="View all your scheduled interview requests" />
        <link rel="icon" href="/assets/logo.png" />
      </Head>

      <div
        className="min-h-screen text-white"
        style={{
          background: "linear-gradient(135deg, #1a0b2e 0%, #16213e 50%, #0f3460 100%)",
        }}
      >
        <WelcomeMessage />
        <RecruiterNavbar activeTab="inbox" />

        <div className="relative z-10 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto px-4 py-8"
          >
            <div className="mb-8">
              <h1 className="text-4xl font-extrabold text-white mb-2">Interview Requests Inbox</h1>
              <p className="text-white/60">View and manage all your scheduled interviews</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-2">
              {[
                { value: "all", label: "All" },
                { value: "pending", label: "Pending" },
                { value: "accepted", label: "Accepted" },
                { value: "rejected", label: "Rejected" },
                { value: "completed", label: "Completed" },
                { value: "cancelled", label: "Cancelled" },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setFilterStatus(filter.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    filterStatus === filter.value
                      ? "bg-purple-500/30 text-white border border-purple-500/50"
                      : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10"
                  }`}
                >
                  {filter.label}
                  {filter.value !== "all" && (
                    <span className="ml-2 text-xs">
                      ({interviewRequests.filter((r) => r.status === filter.value).length})
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Interview Requests List */}
            {isLoadingRequests ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                <span className="ml-3 text-white/60">Loading interview requests...</span>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 rounded-2xl bg-white/5 border border-white/10">
                <Calendar className="w-16 h-16 text-white/20 mb-4" />
                <p className="text-white/60 text-lg">No interview requests found</p>
                <p className="text-white/40 text-sm mt-2">
                  {filterStatus === "all"
                    ? "You haven't scheduled any interviews yet."
                    : `No ${filterStatus} interview requests.`}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRequests.map((request) => {
                  const StatusIcon = STATUS_ICONS[request.status as keyof typeof STATUS_ICONS] || ClockIcon;
                  const statusColor = STATUS_COLORS[request.status as keyof typeof STATUS_COLORS] || STATUS_COLORS.pending;

                  return (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className="text-xl font-semibold text-white">{request.interview_type} Interview</h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColor} flex items-center space-x-1`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              <span className="capitalize">{request.status}</span>
                            </span>
                          </div>

                          <p className="text-white/80 mb-4">{request.context}</p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center space-x-2 text-white/60">
                              <User className="w-4 h-4" />
                              <span className="text-sm">
                                {request.candidate_name || "Candidate"}
                                {request.candidate_email && (
                                  <span className="ml-2 text-white/40">({request.candidate_email})</span>
                                )}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-white/60">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm">
                                {request.start_time && request.end_time
                                  ? formatTimeRange(request.start_time, request.end_time)
                                  : request.duration
                                    ? `${request.duration} minutes`
                                    : formatTime(request.preferred_time)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-white/60">
                              <Calendar className="w-4 h-4" />
                              <span className="text-sm">
                                {formatDate(request.preferred_date)}
                                {request.start_time && request.end_time
                                  ? ` (${formatTimeRange(request.start_time, request.end_time)})`
                                  : ` at ${formatTime(request.preferred_time)}`}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-white/60">
                              <ClockIcon className="w-4 h-4" />
                              <span className="text-sm">Created: {formatDate(request.created_at)}</span>
                            </div>
                          </div>

                          {request.google_meet_link && (request.status === "accepted" || request.status === "scheduled") && (
                            <div className="mt-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                              <div className="flex items-center space-x-2 mb-2">
                                <Video className="w-4 h-4 text-blue-400" />
                                <span className="text-sm font-medium text-blue-300">Google Meet Link</span>
                              </div>
                              <a
                                href={request.google_meet_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-400 hover:text-blue-300 underline break-all"
                              >
                                {request.google_meet_link}
                              </a>
                              <a
                                href={request.google_meet_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 text-sm font-medium transition-all"
                              >
                                <Video className="w-4 h-4" />
                                <span>Join Meeting</span>
                              </a>
                            </div>
                          )}

                          {request.message && (
                            <div className="mt-3 p-3 rounded-lg bg-white/5 border border-white/10">
                              <div className="flex items-center space-x-2 mb-2">
                                <MessageSquare className="w-4 h-4 text-white/60" />
                                <span className="text-sm font-medium text-white/80">Message</span>
                              </div>
                              <p className="text-sm text-white/70">{request.message}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default function Inbox() {
  return (
    <ProtectedDashboardRoute>
      <InboxContent />
    </ProtectedDashboardRoute>
  );
}

