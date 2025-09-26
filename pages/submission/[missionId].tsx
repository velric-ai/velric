import SubmissionForm from "@/components/SubmissionForm";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const MissionSubmissionPage: React.FC = () => {
  const router = useRouter();
  const { missionId } = router.query;
  const [missionData, setMissionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching mission data
    if (missionId) {
      setLoading(false);
      setMissionData({
        id: missionId,
        title: `Mission ${missionId}`,
        description:
          "Join our innovative community and submit your groundbreaking mission.",
        deadline: "2024-02-15",
        status: "active",
      });
    }
  }, [missionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#6A0DAD] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#F5F5F5] text-[18px] font-inter">
            Loading mission details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#6A0DAD]/10 via-transparent to-[#00D9FF]/10"></div>

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
            <h1 className="text-[64px] md:text-[80px] font-bold font-sora text-white mb-6 antialiased leading-tight">
              Mission Submission
            </h1>

            {/* Subtitle */}
            <p className="text-[24px] text-[#F5F5F5] font-inter max-w-4xl mx-auto mb-8 leading-relaxed">
              Ready to make your mark? Submit your mission and join the future
              of innovation.
            </p>

            {/* Mission Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              <div className="bg-[#1C1C1E] border border-[#6A0DAD]/20 rounded-2xl p-6 hover:scale-105 hover:border-[#6A0DAD]/40 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-[#6A0DAD] to-[#00D9FF] rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-[18px] font-semibold text-white font-inter mb-2">
                  Active Mission
                </h3>
                <p className="text-[14px] text-[#F5F5F5]/60 font-inter">
                  Currently accepting submissions
                </p>
              </div>

              <div className="bg-[#1C1C1E] border border-[#6A0DAD]/20 rounded-2xl p-6 hover:scale-105 hover:border-[#6A0DAD]/40 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-[#6A0DAD] to-[#00D9FF] rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-[18px] font-semibold text-white font-inter mb-2">
                  Deadline
                </h3>
                <p className="text-[14px] text-[#F5F5F5]/60 font-inter">
                  March 25, 2026
                </p>
              </div>

              <div className="bg-[#1C1C1E] border border-[#6A0DAD]/20 rounded-2xl p-6 hover:scale-105 hover:border-[#6A0DAD]/40 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-[#6A0DAD] to-[#00D9FF] rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-[18px] font-semibold text-white font-inter mb-2">
                  Community
                </h3>
                <p className="text-[14px] text-[#F5F5F5]/60 font-inter">
                  Join 1,000+ innovators
                </p>
              </div>
            </div>
          </div>

          {/* Submission Form Section */}
          <div className="relative">
            {/* Decorative Elements */}
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-br from-[#6A0DAD]/20 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-gradient-to-br from-[#00D9FF]/20 to-transparent rounded-full blur-3xl"></div>

            <SubmissionForm />
          </div>

          {/* Additional Info Section */}
          <div className="mt-20 text-center">
            <div className="bg-[#1C1C1E] border border-[#6A0DAD]/20 rounded-2xl p-8 max-w-4xl mx-auto hover:border-[#6A0DAD]/40 transition-all duration-300">
              <h2 className="text-[32px] font-bold font-sora text-white mb-6 antialiased">
                What Happens Next?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#6A0DAD] to-[#00D9FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-[24px] font-sora">
                      1
                    </span>
                  </div>
                  <h3 className="text-[18px] font-semibold text-white font-inter mb-2">
                    Review
                  </h3>
                  <p className="text-[14px] text-[#F5F5F5]/60 font-inter">
                    Our team reviews your submission within 48 hours
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#6A0DAD] to-[#00D9FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-[24px] font-sora">
                      2
                    </span>
                  </div>
                  <h3 className="text-[18px] font-semibold text-white font-inter mb-2">
                    Feedback
                  </h3>
                  <p className="text-[14px] text-[#F5F5F5]/60 font-inter">
                    Receive detailed feedback and next steps
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#6A0DAD] to-[#00D9FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-[24px] font-sora">
                      3
                    </span>
                  </div>
                  <h3 className="text-[18px] font-semibold text-white font-inter mb-2">
                    Launch
                  </h3>
                  <p className="text-[14px] text-[#F5F5F5]/60 font-inter">
                    Get support to bring your mission to life
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionSubmissionPage;
