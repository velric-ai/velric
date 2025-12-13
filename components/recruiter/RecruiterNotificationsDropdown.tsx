import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, User, Loader2, Video } from "lucide-react";

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
}

interface RecruiterNotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  recruiterId: string;
}

export default function RecruiterNotificationsDropdown({
  isOpen,
  onClose,
  recruiterId,
}: RecruiterNotificationsDropdownProps) {
  const [interviewRequests, setInterviewRequests] = useState<InterviewRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && recruiterId) {
      fetchInterviewRequests();
    }
  }, [isOpen, recruiterId]);

  const fetchInterviewRequests = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('velric_token');
      const response = await fetch(`/api/recruiter/interview-requests`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'omit', // Don't send cookies
      });
      
      if (!response.ok) {
        console.error("Failed to fetch interview requests");
        setIsLoading(false);
        return;
      }

      const result = await response.json();

      if (!result.success) {
        console.error("Failed to fetch interview requests:", result.error);
        setIsLoading(false);
        return;
      }

      setInterviewRequests(result.interviewRequests || []);
    } catch (err: any) {
      console.error("Error fetching interview requests:", err);
    } finally {
      setIsLoading(false);
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
                            {request.candidate_name || "Candidate"}
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

                    {request.google_meet_link && (request.status === "accepted" || request.status === "scheduled") && (
                      <div className="mb-3">
                        <a
                          href={request.google_meet_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 text-xs font-medium transition-all"
                        >
                          <Video className="w-3 h-3" />
                          <span>Join Google Meet</span>
                        </a>
                      </div>
                    )}

                    {request.message && (
                      <div className="text-xs text-white/50 italic mb-2">
                        "{request.message}"
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

