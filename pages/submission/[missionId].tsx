import { useRouter } from "next/router";
import React, { useEffect, useState, useRef } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import MissionDescription from "@/components/MissionDescription";
import SubmissionForm from "@/components/SubmissionForm";

const MissionSubmissionPage: React.FC = () => {
  const router = useRouter();
  const { missionId } = router.query;
  const [missionData, setMissionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (missionId) {
      // Simulated mission data
      setTimeout(() => {
        setMissionData({
          id: missionId,
          title: `Mission ${missionId}`,
          description:
            "Join our innovative community and share your groundbreaking mission solution below.",
          deadline: "2026-03-25",
          status: "active",
          difficulty: "Intermediate",
          time_estimate: "3 hours",
          category: "AI & Innovation",
          skills: ["React", "TypeScript", "Next.js"],
          industries: ["Technology", "Education"],
        });
        setLoading(false);
      }, 1000);
    }
  }, [missionId]);

  // Handle submission
  const handleSubmit = async (data: { submissionText: string }) => {
    try {
      setIsSubmitting(true);
      console.log("Mission submission:", data);

      // Post to our submissions API. Use a mock user id for now.
      const payload = {
        submissionText: data.submissionText,
        missionId: missionId as string,
        userId: "user-1", // TODO: replace with real auth user id
      };

      const resp = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await resp.json();
      if (!result.success) throw new Error(result.error || "Submission failed");

      // Redirect to feedback page using returned submission id
      router.push(`/feedback/${result.id}`);
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Something went wrong while submitting your mission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Scroll to form when user starts mission
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
      <div className="relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#6A0DAD]/10 via-transparent to-[#00D9FF]/10" />

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16 md:py-24 space-y-20">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-[#1C1C1E] border border-[#6A0DAD]/30 rounded-full mb-8 hover:scale-105 transition-all duration-300">
              <div className="w-3 h-3 bg-[#00D9FF] rounded-full mr-3 animate-pulse"></div>
              <span className="text-[#00D9FF] text-[14px] font-inter font-semibold uppercase tracking-wide">
                Mission #{missionId}
              </span>
            </div>

            <h1
              className="text-[64px] md:text-[80px] font-bold font-sora mb-6 antialiased leading-tight 
             bg-gradient-to-r from-[#6A0DAD] via-[#00D9FF] to-[#6A0DAD] 
             text-transparent bg-clip-text 
             drop-shadow-[0_0_20px_#6A0DAD]/70"
            >
              Mission Submission
            </h1>

            <p className="text-[22px] text-[#F5F5F5]/90 font-inter max-w-3xl mx-auto leading-relaxed">
              Review your mission details and submit your response below.
            </p>
          </div>

          {/* Mission Description */}
          <div className="max-w-5xl mx-auto">
            <MissionDescription mission={missionData} />
          </div>

          {/* Divider Glow */}
          <div className="h-[1px] bg-gradient-to-r from-[#6A0DAD]/30 via-transparent to-[#00D9FF]/30" />

          {/* Submission Section */}
          <div ref={formRef} className="relative max-w-5xl mx-auto">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-[#6A0DAD]/20 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-[#00D9FF]/20 to-transparent rounded-full blur-3xl"></div>

            <div className="bg-[#1C1C1E] border border-[#6A0DAD]/20 rounded-2xl p-10 md:p-14 shadow-2xl hover:shadow-[#6A0DAD]/20 hover:shadow-2xl transition-all duration-300">
              <h2 className="text-[32px] font-bold font-sora text-white mb-4 antialiased text-center">
                Submit Your Solution
              </h2>
              <p className="text-[18px] text-[#F5F5F5]/80 font-inter text-center mb-10">
                Write your mission submission below and showcase your
                creativity.
              </p>

              <SubmissionForm
                onSubmit={handleSubmit}
                isLoading={isSubmitting}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionSubmissionPage;
