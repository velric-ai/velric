import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, User, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useSnackbar } from "@/contexts/SnackbarContext";

interface InterviewRequest {
  id: string;
  recruiter_id: string;
  recruiter_name?: string | null;
  recruiter_email?: string | null;
  interview_type: string;
  context: string;
  duration: number;
  preferred_date: string;
  preferred_time: string;
  message: string | null;
  status: string;
  created_at: string;
}

interface InterviewRequestsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onUpdateCount: () => void;
}

export default function InterviewRequestsDropdown({
  isOpen,
  onClose,
  userId,
  onUpdateCount,
}: InterviewRequestsDropdownProps) {
  const { showSnackbar } = useSnackbar();
  const [interviewRequests, setInterviewRequests] = useState<InterviewRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

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

  const handleAccept = async (requestId: string) => {
    setProcessingIds((prev) => new Set(prev).add(requestId));
    try {
      const response = await fetch(`/api/user/interview-requests/${requestId}/accept`, {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to accept interview request" }));
        showSnackbar(errorData.error || "Failed to accept interview request", "error");
        setProcessingIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(requestId);
          return newSet;
        });
        return;
      }

      const result = await response.json().catch(() => ({ success: false, error: "Invalid response" }));

      if (!result.success) {
        showSnackbar(result.error || "Failed to accept interview request", "error");
        setProcessingIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(requestId);
          return newSet;
        });
        return;
      }

      showSnackbar("Interview request accepted", "success");
      fetchInterviewRequests();
      onUpdateCount();
    } catch (err: any) {
      console.error("Error accepting interview request:", err);
      const errorMessage = err instanceof TypeError && err.message.includes("fetch")
        ? "Network error. Please check your connection."
        : err.message || "Failed to accept interview request";
      showSnackbar(errorMessage, "error");
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  const handleReject = async (requestId: string) => {
    setProcessingIds((prev) => new Set(prev).add(requestId));
    try {
      const response = await fetch(`/api/user/interview-requests/${requestId}/reject`, {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to reject interview request" }));
        showSnackbar(errorData.error || "Failed to reject interview request", "error");
        setProcessingIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(requestId);
          return newSet;
        });
        return;
      }

      const result = await response.json().catch(() => ({ success: false, error: "Invalid response" }));

      if (!result.success) {
        showSnackbar(result.error || "Failed to reject interview request", "error");
        setProcessingIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(requestId);
          return newSet;
        });
        return;
      }

      showSnackbar("Interview request rejected", "success");
      fetchInterviewRequests();
      onUpdateCount();
    } catch (err: any) {
      console.error("Error rejecting interview request:", err);
      const errorMessage = err instanceof TypeError && err.message.includes("fetch")
        ? "Network error. Please check your connection."
        : err.message || "Failed to reject interview request";
      showSnackbar(errorMessage, "error");
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (!isOpen) return null;

  // Show all requests, sorted by created_at (newest first)
  const sortedRequests = [...interviewRequests].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="absolute right-0 top-full mt-2 w-96 rounded-xl overflow-hidden z-50 notification-dropdown"
        style={{
          background: "rgba(15, 23, 42, 0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
          maxHeight: "500px",
        }}
      >
        <div className="p-4 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">Interview Requests</h3>
          <p className="text-sm text-white/60">
            {sortedRequests.length} {sortedRequests.length === 1 ? "request" : "requests"}
          </p>
        </div>

        <div className="overflow-y-auto max-h-[400px] custom-scroll">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
              <span className="ml-2 text-white/60">Loading...</span>
            </div>
            ) : sortedRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 px-4">
                <Calendar className="w-12 h-12 text-white/20 mb-2" />
                <p className="text-white/60 text-sm">No interview requests</p>
              </div>
            ) : (
              <div className="p-2">
                {sortedRequests.map((request) => {
                  const isProcessing = processingIds.has(request.id);
                  const isPending = request.status === "pending";
                  const statusColors: { [key: string]: string } = {
                    pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
                    accepted: "bg-green-500/20 text-green-300 border-green-500/30",
                    rejected: "bg-red-500/20 text-red-300 border-red-500/30",
                    completed: "bg-blue-500/20 text-blue-300 border-blue-500/30",
                    cancelled: "bg-gray-500/20 text-gray-300 border-gray-500/30",
                  };
                  const statusColor = statusColors[request.status] || statusColors.pending;

                  return (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-lg border border-white/10 bg-white/5 mb-2 hover:bg-white/10 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <User className="w-4 h-4 text-white/60" />
                            <span className="text-sm font-semibold text-white">
                              {request.recruiter_name || "Recruiter"}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusColor} capitalize`}>
                              {request.status}
                            </span>
                          </div>
                          <p className="text-xs text-white/60 mb-2">{request.interview_type} Interview</p>
                          <p className="text-sm text-white/80 line-clamp-2">{request.context}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 text-xs text-white/60 mb-3">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(request.preferred_date)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{request.preferred_time}</span>
                        </div>
                      </div>

                      {/* Show Accept/Reject buttons only for pending status */}
                      {isPending ? (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleAccept(request.id)}
                            disabled={isProcessing}
                            className="flex-1 px-3 py-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-300 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1"
                          >
                            {isProcessing ? (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                <span>Processing...</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-3 h-3" />
                                <span>Accept</span>
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleReject(request.id)}
                            disabled={isProcessing}
                            className="flex-1 px-3 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1"
                          >
                            {isProcessing ? (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                <span>Processing...</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3" />
                                <span>Reject</span>
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        <div className="text-xs text-white/50 italic">
                          {request.status === "accepted" && "You accepted this interview request"}
                          {request.status === "rejected" && "You rejected this interview request"}
                          {request.status === "completed" && "This interview has been completed"}
                          {request.status === "cancelled" && "This interview request was cancelled"}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

