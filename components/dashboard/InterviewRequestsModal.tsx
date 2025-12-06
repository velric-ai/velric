import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, User, MessageSquare, CheckCircle, XCircle, Clock as ClockIcon, Code, Play, Video } from "lucide-react";
import { useSnackbar } from "@/hooks/useSnackbar";

interface InterviewRequest {
  id: string;
  recruiter_id: string;
  recruiter_name?: string | null;
  recruiter_email?: string | null;
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
}

// Helper function to calculate duration from time range
const calculateDuration = (startTime?: string | null, endTime?: string | null): number | null => {
  if (!startTime || !endTime) return null;
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);
  const startTotal = startHours * 60 + startMinutes;
  const endTotal = endHours * 60 + endMinutes;
  return endTotal - startTotal;
};

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

interface InterviewRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

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

export default function InterviewRequestsModal({
  isOpen,
  onClose,
  userId,
}: InterviewRequestsModalProps) {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const [interviewRequests, setInterviewRequests] = useState<InterviewRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartTechnicalInterview = (requestId: string) => {
    router.push(`/interview/${requestId}`);
    onClose();
  };

  useEffect(() => {
    if (isOpen && userId) {
      fetchInterviewRequests();
    }
  }, [isOpen, userId]);

  const fetchInterviewRequests = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/user/interview-requests?userId=${userId}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to fetch interview requests" }));
        showSnackbar(errorData.error || "Failed to fetch interview requests", "error");
        setIsLoading(false);
        return;
      }

      const result = await response.json().catch(() => ({ success: false, error: "Invalid response" }));

      if (!result.success) {
        showSnackbar(result.error || "Failed to fetch interview requests", "error");
        setIsLoading(false);
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
      setIsLoading(false);
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl"
          style={{
            background: "rgba(15, 23, 42, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Interview Requests</h2>
                <p className="text-sm text-white/60">
                  {interviewRequests.length} {interviewRequests.length === 1 ? "request" : "requests"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-white/70" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] custom-scroll">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                <span className="ml-3 text-white/60">Loading interview requests...</span>
              </div>
            ) : interviewRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Calendar className="w-16 h-16 text-white/20 mb-4" />
                <p className="text-white/60 text-lg">No interview requests yet</p>
                <p className="text-white/40 text-sm mt-2">You'll see interview requests here when recruiters schedule interviews with you.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {interviewRequests.map((request) => {
                  const StatusIcon = STATUS_ICONS[request.status as keyof typeof STATUS_ICONS] || ClockIcon;
                  const statusColor = STATUS_COLORS[request.status as keyof typeof STATUS_COLORS] || STATUS_COLORS.pending;

                  return (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className="text-lg font-semibold text-white">{request.interview_type} Interview</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColor} flex items-center space-x-1`}>
                              <StatusIcon className="w-3 h-3" />
                              <span className="capitalize">{request.status}</span>
                            </span>
                          </div>

                          <p className="text-white/80 mb-4">{request.context}</p>

                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center space-x-2 text-white/60">
                              <User className="w-4 h-4" />
                              <span className="text-sm">
                                {request.recruiter_name || "Recruiter"}
                                {request.recruiter_email && (
                                  <span className="ml-2 text-white/40">({request.recruiter_email})</span>
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
                              <span className="text-sm">{formatDate(request.created_at)}</span>
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
                                className="text-sm text-blue-400 hover:text-blue-300 underline break-all block mb-2"
                              >
                                {request.google_meet_link}
                              </a>
                              <a
                                href={request.google_meet_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 text-sm font-medium transition-all"
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
                                <span className="text-sm font-medium text-white/80">Message from Recruiter</span>
                              </div>
                              <p className="text-sm text-white/70">{request.message}</p>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="mt-4 flex gap-3">
                            {request.interview_type.toLowerCase() === "technical" && request.status === "accepted" && (
                              <button
                                onClick={() => handleStartTechnicalInterview(request.id)}
                                className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors border border-cyan-500/30"
                              >
                                <Code className="w-4 h-4" />
                                <span>Start Coding Interview</span>
                              </button>
                            )}
                            {request.status === "pending" && (
                              <div className="flex gap-2">
                                <button
                                  onClick={async () => {
                                    try {
                                      const response = await fetch(`/api/user/interview-requests/${request.id}/accept`, {
                                        method: "POST",
                                      });
                                      const result = await response.json();
                                      if (result.success) {
                                        showSnackbar("Interview request accepted", "success");
                                        fetchInterviewRequests();
                                      } else {
                                        showSnackbar(result.error || "Failed to accept", "error");
                                      }
                                    } catch (err: any) {
                                      showSnackbar("Failed to accept interview", "error");
                                    }
                                  }}
                                  className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors border border-green-500/30"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  <span>Accept</span>
                                </button>
                                <button
                                  onClick={async () => {
                                    try {
                                      const response = await fetch(`/api/user/interview-requests/${request.id}/reject`, {
                                        method: "POST",
                                      });
                                      const result = await response.json();
                                      if (result.success) {
                                        showSnackbar("Interview request rejected", "success");
                                        fetchInterviewRequests();
                                      } else {
                                        showSnackbar(result.error || "Failed to reject", "error");
                                      }
                                    } catch (err: any) {
                                      showSnackbar("Failed to reject interview", "error");
                                    }
                                  }}
                                  className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors border border-red-500/30"
                                >
                                  <XCircle className="w-4 h-4" />
                                  <span>Reject</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

