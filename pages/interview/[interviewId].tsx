import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, User, Code, AlertCircle } from "lucide-react";
import DashboardNavigation from "@/components/dashboard/DashboardNavigation";
import Footer from "@/components/Footer";
import LoadingSpinner from "@/components/LoadingSpinner";
import TechnicalInterviewIDE from "@/components/TechnicalInterviewIDE";
import { useSnackbar } from "@/hooks/useSnackbar";

interface InterviewDetails {
  id: string;
  recruiter_id: string;
  recruiter_name?: string | null;
  recruiter_email?: string | null;
  interview_type: string;
  context: string;
  preferred_date: string;
  preferred_time: string;
  start_time?: string | null;
  end_time?: string | null;
  message: string | null;
  status: string;
  question?: string;
  coding_problem?: string;
}

export default function TechnicalInterviewPage() {
  const router = useRouter();
  const { interviewId } = router.query;
  const { showSnackbar } = useSnackbar();
  const [interview, setInterview] = useState<InterviewDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const userDataStr = localStorage.getItem("velric_user");
    if (userDataStr) {
      try {
        const user = JSON.parse(userDataStr);
        setUserId(user.id);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!interviewId || typeof interviewId !== "string" || !userId) return;

    const fetchInterview = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(`/api/user/interview-requests?userId=${userId}`);
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || "Failed to fetch interview");
        }

        const foundInterview = result.interviewRequests?.find(
          (req: any) => req.id === interviewId
        );

        if (!foundInterview) {
          throw new Error("Interview not found");
        }

        // Check if it's a technical interview
        if (foundInterview.interview_type.toLowerCase() !== "technical") {
          setError("This interview is not a technical interview");
          return;
        }

        setInterview(foundInterview);
      } catch (err: any) {
        console.error("Error fetching interview:", err);
        setError(err.message || "Failed to load interview");
        showSnackbar(err.message || "Failed to load interview", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterview();
  }, [interviewId, userId, showSnackbar]);

  const handleSubmitSolution = async (code: string, language: string) => {
    if (!interviewId || !userId) {
      throw new Error("Missing interview or user information");
    }

    const response = await fetch(`/api/user/interview-requests/${interviewId}/submit-solution`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        language,
        userId,
      }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to submit solution");
    }

    return result;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Technical Interview | Velric</title>
        </Head>
        <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </>
    );
  }

  if (error || !interview) {
    return (
      <>
        <Head>
          <title>Interview Not Found | Velric</title>
        </Head>
        <div className="min-h-screen bg-[#0D0D0D] text-white">
          <DashboardNavigation />
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Interview Not Found</h1>
              <p className="text-white/60 mb-6">{error || "The interview you're looking for doesn't exist."}</p>
              <button
                onClick={() => router.push("/user-dashboard")}
                className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Technical Interview - {interview.context} | Velric</title>
      </Head>

      <div className="min-h-screen bg-[#0D0D0D] text-white">
        <DashboardNavigation />

        {/* Header */}
        <header className="bg-[#1C1C1E] border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>

            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Technical Interview</h1>
                <p className="text-white/70 text-lg">{interview.context}</p>
              </div>
            </div>

            {/* Interview Info */}
            <div className="mt-6 flex flex-wrap gap-6 text-sm">
              {interview.recruiter_name && (
                <div className="flex items-center gap-2 text-white/60">
                  <User className="w-4 h-4" />
                  <span>{interview.recruiter_name}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-white/60">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(interview.preferred_date)}</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <Clock className="w-4 h-4" />
                <span>
                  {interview.start_time && interview.end_time
                    ? `${formatTime(interview.start_time)} - ${formatTime(interview.end_time)}`
                    : formatTime(interview.preferred_time)}
                </span>
              </div>
            </div>

            {interview.message && (
              <div className="mt-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                <p className="text-white/80 text-sm">{interview.message}</p>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-8">
          {/* Problem Description */}
          {interview.coding_problem && (
            <div className="mb-6 bg-[#1C1C1E] rounded-lg border border-gray-800 p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Code className="w-5 h-5 text-cyan-400" />
                Coding Problem
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-white/80 whitespace-pre-wrap">{interview.coding_problem}</p>
              </div>
            </div>
          )}

          {/* IDE Section - Only for Technical Interviews */}
          {interview.interview_type.toLowerCase() === "technical" && (
            <div className="bg-[#1C1C1E] rounded-lg border border-gray-800 p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Code className="w-5 h-5 text-cyan-400" />
                Code Editor
              </h2>
              <div className="h-[700px]">
                <TechnicalInterviewIDE
                  interviewId={interview.id}
                  question={interview.coding_problem || interview.question}
                  initialLanguage="python"
                  onSubmit={handleSubmitSolution}
                />
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-6 bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-cyan-400 mb-2">Instructions</h3>
            <ul className="text-sm text-white/70 space-y-1 list-disc list-inside">
              <li>Select your preferred programming language from the dropdown</li>
              <li>Write your solution in the code editor</li>
              <li>Click "Run" to test your code and see the output</li>
              <li>Click "Submit" when you're ready to submit your final solution</li>
              <li>Your code is automatically saved as you type</li>
            </ul>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

