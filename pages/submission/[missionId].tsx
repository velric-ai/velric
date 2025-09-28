import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import SubmissionForm from "@/components/SubmissionForm";
import LoadingSpinner from "@/components/LoadingSpinner";

const MissionSubmissionPage: React.FC = () => {
  const router = useRouter();
  const { missionId } = router.query;
  const [missionData, setMissionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching mission data
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
          Loading mission details...
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
              Assignment & Mission Submission
            </h1>

            {/* Subtitle */}
            <p className="text-[24px] text-[#F5F5F5] font-inter max-w-4xl mx-auto mb-8 leading-relaxed">
              Ready to make your mark? Submit your mission and join the future
              of innovation.
            </p>
          </div>

          {/* Submission Form */}
          <div className="relative">
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-br from-[#6A0DAD]/20 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-gradient-to-br from-[#00D9FF]/20 to-transparent rounded-full blur-3xl"></div>

            <SubmissionForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionSubmissionPage;
