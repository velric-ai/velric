import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

const FeedbackPage: React.FC = () => {
  const router = useRouter();
  const { missionId } = router.query;
  const [missionData, setMissionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching mission data (same as submission page)
    if (missionId) {
      setTimeout(() => {
        setMissionData({
          id: missionId,
          title: `Mission ${missionId}`,
          description:
            "Join our innovative community and submit your groundbreaking mission.",
          deadline: "2026-03-25",
          status: "active",
        });
        setLoading(false);
      }, 1200); // slight delay for UX demo
    }
  }, [missionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center space-y-6">
        <LoadingSpinner size="lg" />
        <p className="text-[#F5F5F5] text-[18px] font-inter antialiased">
          Loading feedback details...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#6A0DAD]/10 via-transparent to-[#00D9FF]/10" />

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16 md:py-24">
          <div className="text-center mb-16">
            {/* Mission Badge */}
            <div className="inline-flex items-center px-6 py-3 bg-[#1C1C1E] border border-[#6A0DAD]/30 rounded-full mb-8 hover:scale-105 transition-all duration-300">
              <div className="w-3 h-3 bg-[#00D9FF] rounded-full mr-3 animate-pulse"></div>
              <span className="text-[#00D9FF] text-[14px] font-inter font-semibold uppercase tracking-wide">
                Mission #{missionId}
              </span>
            </div>

            {/* Main Heading */}
            <h1
              className="text-[64px] md:text-[80px] font-bold font-sora mb-6 antialiased leading-tight 
             bg-gradient-to-r from-[#6A0DAD] via-[#00D9FF] to-[#6A0DAD] 
             text-transparent bg-clip-text 
             drop-shadow-[0_0_20px_#6A0DAD]/70"
            >
              Mission Feedback
            </h1>

            {/* Subtitle */}
            <p className="text-[24px] text-[#F5F5F5] font-inter max-w-4xl mx-auto mb-8 leading-relaxed">
              Review your mission feedback and grading results.
            </p>
          </div>

          {/* Feedback Content */}
          <div className="relative">
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-br from-[#6A0DAD]/20 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-gradient-to-br from-[#00D9FF]/20 to-transparent rounded-full blur-3xl"></div>

            <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-16">
              <div className="bg-[#1C1C1E] rounded-2xl p-8 md:p-12 shadow-2xl border border-[#6A0DAD]/20 hover:scale-105 transition-all duration-300 hover:shadow-[#6A0DAD]/20 hover:shadow-2xl">
                {/* Mission Name Section */}
                <div className="mb-12">
                  <h2 className="text-[25px] font-bold font-sora text-white mb-4 antialiased">
                    Mission Name
                  </h2>
                  <div className="bg-[#0D0D0D] border border-[#6A0DAD]/30 rounded-2xl p-6">
                    <p className="text-[20px] text-[#F5F5F5] font-inter">
                      {missionData?.title || `Mission ${missionId}`}
                    </p>
                  </div>
                </div>

                {/* Submission Status Section */}
                <div className="mb-12">
                  <h2 className="text-[25px] font-bold font-sora text-white mb-4 antialiased">
                    Submission Status
                  </h2>
                  <div className="bg-[#0D0D0D] border border-[#6A0DAD]/30 rounded-2xl p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-4 h-4 bg-[#00D9FF] rounded-full animate-pulse"></div>
                      <p className="text-[18px] text-[#F5F5F5] font-inter">
                        Submitted
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feedback Section */}
                <div className="mb-12">
                  <h2 className="text-[25px] font-bold font-sora text-white mb-4 antialiased">
                    Feedback
                  </h2>
                  <div className="bg-[#0D0D0D] border border-[#6A0DAD]/30 rounded-2xl p-6">
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#6A0DAD]/20 to-[#00D9FF]/20 rounded-2xl flex items-center justify-center mb-6">
                        <svg
                          className="w-8 h-8 text-[#6A0DAD]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                      </div>
                      <p className="text-[18px] text-[#F5F5F5]/60 font-inter">
                        Your feedback will appear here
                      </p>
                    </div>
                  </div>
                </div>

                {/* Grade Section */}
                <div className="mb-12">
                  <h2 className="text-[25px] font-bold font-sora text-white mb-4 antialiased">
                    Grade
                  </h2>
                  <div className="bg-[#0D0D0D] border border-[#6A0DAD]/30 rounded-2xl p-6">
                    <div className="text-center py-8">
                      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#6A0DAD]/20 to-[#00D9FF]/20 rounded-full flex items-center justify-center mb-4">
                        <span className="text-[32px] font-bold text-[#6A0DAD] font-sora">
                          A+
                        </span>
                      </div>
                      <p className="text-[18px] text-[#F5F5F5]/60 font-inter">
                        Grade: +10
                      </p>
                    </div>
                  </div>
                </div>

                {/* Grading Rubric Section */}
                <div className="mb-12">
                  <h2 className="text-[25px] font-bold font-sora text-white mb-6 antialiased">
                    Grading Rubric
                  </h2>
                  <div className="bg-[#0D0D0D] border border-[#6A0DAD]/30 rounded-2xl p-6 overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-[#6A0DAD]/20">
                          <th className="text-[16px] font-semibold text-[#F5F5F5] font-inter py-4 pr-6">
                            Criteria
                          </th>
                          <th className="text-[16px] font-semibold text-[#00D9FF] font-inter py-4 px-4 text-center">
                            Excellent (5)
                          </th>
                          <th className="text-[16px] font-semibold text-[#6A0DAD] font-inter py-4 px-4 text-center">
                            Good (3)
                          </th>
                          <th className="text-[16px] font-semibold text-[#FF6B6B] font-inter py-4 px-4 text-center">
                            Needs Work (1)
                          </th>
                        </tr>
                      </thead>
                      <tbody className="space-y-4">
                        <tr className="border-b border-[#6A0DAD]/10">
                          <td className="text-[14px] text-[#F5F5F5] font-inter py-4 pr-6 font-medium">
                            Completeness
                          </td>
                          <td className="text-[14px] text-[#F5F5F5]/80 font-inter py-4 px-4">
                            Fully meets requirements
                          </td>
                          <td className="text-[14px] text-[#F5F5F5]/80 font-inter py-4 px-4">
                            Mostly complete
                          </td>
                          <td className="text-[14px] text-[#F5F5F5]/80 font-inter py-4 px-4">
                            Missing key parts
                          </td>
                        </tr>
                        <tr className="border-b border-[#6A0DAD]/10">
                          <td className="text-[14px] text-[#F5F5F5] font-inter py-4 pr-6 font-medium">
                            Clarity
                          </td>
                          <td className="text-[14px] text-[#F5F5F5]/80 font-inter py-4 px-4">
                            Very clear
                          </td>
                          <td className="text-[14px] text-[#F5F5F5]/80 font-inter py-4 px-4">
                            Understandable
                          </td>
                          <td className="text-[14px] text-[#F5F5F5]/80 font-inter py-4 px-4">
                            Hard to follow
                          </td>
                        </tr>
                        <tr className="border-b border-[#6A0DAD]/10">
                          <td className="text-[14px] text-[#F5F5F5] font-inter py-4 pr-6 font-medium">
                            Originality
                          </td>
                          <td className="text-[14px] text-[#F5F5F5]/80 font-inter py-4 px-4">
                            Highly creative
                          </td>
                          <td className="text-[14px] text-[#F5F5F5]/80 font-inter py-4 px-4">
                            Some creativity
                          </td>
                          <td className="text-[14px] text-[#F5F5F5]/80 font-inter py-4 px-4">
                            Generic
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[14px] text-[#F5F5F5] font-inter py-4 pr-6 font-medium">
                            Presentation
                          </td>
                          <td className="text-[14px] text-[#F5F5F5]/80 font-inter py-4 px-4">
                            Professional & neat
                          </td>
                          <td className="text-[14px] text-[#F5F5F5]/80 font-inter py-4 px-4">
                            Acceptable
                          </td>
                          <td className="text-[14px] text-[#F5F5F5]/80 font-inter py-4 px-4">
                            Messy
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Feedback Templates Section */}
                <div className="mb-8">
                  <h2 className="text-[25px] font-bold font-sora text-white mb-6 antialiased">
                    Feedback Templates
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Positive Feedback Templates */}
                    <div className="bg-[#0D0D0D] border border-[#00D9FF]/30 rounded-2xl p-6">
                      <h3 className="text-[18px] font-semibold text-[#00D9FF] font-inter mb-4">
                        Positive Feedback
                      </h3>
                      <div className="space-y-3">
                        <div className="bg-[#00D9FF]/10 border border-[#00D9FF]/20 rounded-xl p-4">
                          <p className="text-[14px] text-[#F5F5F5] font-inter">
                            "Great work! You demonstrated strong understanding
                            of the mission goals."
                          </p>
                        </div>
                        <div className="bg-[#00D9FF]/10 border border-[#00D9FF]/20 rounded-xl p-4">
                          <p className="text-[14px] text-[#F5F5F5] font-inter">
                            "Excellent creativity and originality in your
                            approach."
                          </p>
                        </div>
                        <div className="bg-[#00D9FF]/10 border border-[#00D9FF]/20 rounded-xl p-4">
                          <p className="text-[14px] text-[#F5F5F5] font-inter">
                            "Outstanding presentation and attention to detail."
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Improvement Feedback Templates */}
                    <div className="bg-[#0D0D0D] border border-[#FF6B6B]/30 rounded-2xl p-6">
                      <h3 className="text-[18px] font-semibold text-[#FF6B6B] font-inter mb-4">
                        Improvement Areas
                      </h3>
                      <div className="space-y-3">
                        <div className="bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 rounded-xl p-4">
                          <p className="text-[14px] text-[#F5F5F5] font-inter">
                            "Try to expand on your explanation in section X for
                            more clarity."
                          </p>
                        </div>
                        <div className="bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 rounded-xl p-4">
                          <p className="text-[14px] text-[#F5F5F5] font-inter">
                            "Please check formatting – ensure PDF is well
                            structured."
                          </p>
                        </div>
                        <div className="bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 rounded-xl p-4">
                          <p className="text-[14px] text-[#F5F5F5] font-inter">
                            "Consider adding more specific examples to support
                            your points."
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    onClick={() => router.push(`/submission/${missionId}`)}
                    className="flex-1 bg-gradient-to-r from-[#6A0DAD] to-[#00D9FF] text-white font-bold text-[18px] py-4 px-8 rounded-2xl hover:scale-105 hover:shadow-[#6A0DAD]/30 hover:shadow-2xl transition-all duration-300 font-sora antialiased"
                  >
                    View Submission
                  </button>
                  <button
                    onClick={() => router.push("/")}
                    className="flex-1 bg-[#1C1C1E] border border-[#6A0DAD]/30 text-[#F5F5F5] font-bold text-[18px] py-4 px-8 rounded-2xl hover:scale-105 hover:border-[#6A0DAD]/50 hover:bg-[#6A0DAD]/10 transition-all duration-300 font-sora antialiased"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
