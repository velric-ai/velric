"use client";

import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ArrowLeft } from "lucide-react";


const FeedbackPage: React.FC = () => {
  const router = useRouter();
  const { missionId } = router.query; // here missionId is actually the submission id
  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!missionId) return;
    const id = missionId as string;
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/feedback/${id}`);
        const data = await res.json();
        if (data.success) setSubmission(data.submission);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
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
          {/* Back Button */}
          {submission?.mission_id && (
            <button
              onClick={() => router.push(`/missions`)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Mission</span>
            </button>
          )}

          <div className="text-center mb-16">
            {/* Mission Badge */}
            {submission?.mission_number && (
              <div className="inline-flex items-center px-6 py-3 bg-[#1C1C1E] border border-[#6A0DAD]/30 rounded-full mb-8 hover:scale-105 transition-all duration-300">
                <div className="w-3 h-3 bg-[#00D9FF] rounded-full mr-3 animate-pulse"></div>
                <span className="text-[#00D9FF] text-[14px] font-inter font-semibold uppercase tracking-wide">
                  {submission.mission_number}
                </span>
              </div>
            )}

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
                {/* Submission Status Section */}
                <div className="mb-12">
                  <h2 className="text-[25px] font-bold font-sora text-white mb-4 antialiased">
                    Submission Status
                  </h2>
                  <div className="bg-[#0D0D0D] border border-[#6A0DAD]/30 rounded-2xl p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-4 h-4 bg-[#00D9FF] rounded-full animate-pulse"></div>
                      <p className="text-[18px] text-[#F5F5F5] font-inter">
                        {submission?.status === "graded"
                          ? "Graded"
                          : submission?.status || "Submitted"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tab Switch Deduction Notice */}
                {submission?.tabSwitchCount !== undefined && submission.tabSwitchCount > 0 && (
                  <div className="mb-12">
                    <div className="bg-[#FF6B6B]/10 border-2 border-[#FF6B6B]/40 rounded-2xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-[#FF6B6B]/20 rounded-full flex items-center justify-center">
                            <span className="text-[#FF6B6B] font-bold text-lg">!</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-[18px] font-semibold text-[#FF6B6B] font-sora mb-2">
                            Score Deduction Applied
                          </h3>
                          <p className="text-[15px] text-[#F5F5F5] font-inter mb-3">
                            {submission.tabSwitchCount === 1
                              ? `You switched to another tab 1 time during the mission. A 10% deduction has been applied to your score.`
                              : submission.tabSwitchCount === 2
                              ? `You switched to another tab 2 times during the mission. A 20% deduction has been applied to your score.`
                              : `You switched to another tab ${submission.tabSwitchCount} times during the mission. A 50% deduction has been applied to your score.`}
                          </p>
                          <div className="flex items-center gap-2 pt-2 border-t border-[#FF6B6B]/20">
                            <span className="text-[13px] text-[#F5F5F5]/70 font-inter">Tab Switches:</span>
                            <span className="text-[16px] font-bold text-[#FF6B6B] font-sora">{submission.tabSwitchCount}</span>
                            <span className="text-[13px] text-[#F5F5F5]/70 font-inter ml-4">Deduction:</span>
                            <span className="text-[16px] font-bold text-[#FF6B6B] font-sora">{submission.tabSwitchDeduction}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* No Tab Switches Notice */}
                {submission?.tabSwitchCount === 0 && (
                  <div className="mb-12">
                    <div className="bg-[#00D9FF]/10 border-2 border-[#00D9FF]/40 rounded-2xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-[#00D9FF]/20 rounded-full flex items-center justify-center">
                            <span className="text-[#00D9FF] font-bold text-lg">✓</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-[18px] font-semibold text-[#00D9FF] font-sora">
                            Perfect Focus Maintained
                          </h3>
                          <p className="text-[15px] text-[#F5F5F5] font-inter">
                            Excellent! You maintained perfect focus throughout the mission without switching tabs. No deduction applied.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Velric Score Section - PROMINENT DISPLAY */}
                {submission?.velric_score !== undefined &&
                  submission?.velric_score !== null && (
                    <div className="mb-12">
                      <h2 className="text-[25px] font-bold font-sora text-white mb-4 antialiased">
                        Velric Score
                      </h2>
                      <div className="bg-gradient-to-br from-[#6A0DAD]/20 to-[#00D9FF]/20 border-2 border-[#6A0DAD]/40 rounded-2xl p-8">
                        <div className="text-center">
                          {/* Large Velric Score Display */}
                          <div className="mb-4">
                            <div className="inline-flex items-baseline gap-2">
                              <span className="text-[72px] font-bold font-sora bg-gradient-to-r from-[#6A0DAD] to-[#00D9FF] bg-clip-text text-transparent">
                                {submission.velric_score.toFixed(1)}
                              </span>
                              <span className="text-[36px] font-semibold text-[#F5F5F5]/60 font-sora">
                                / 10
                              </span>
                            </div>
                          </div>

                          {/* Score Label */}
                          <p className="text-[20px] text-[#F5F5F5] font-inter font-medium mb-2">
                            Mission Velric Score
                          </p>

                          {/* Score Description */}
                          <p className="text-[14px] text-[#F5F5F5]/70 font-inter max-w-md mx-auto">
                            {submission.velric_score >= 9.5
                              ? "Outstanding! Exceptional work across all criteria."
                              : submission.velric_score >= 8.5
                              ? "Excellent work! Strong performance."
                              : submission.velric_score >= 7.5
                              ? "Great job! Good understanding demonstrated."
                              : submission.velric_score >= 6.5
                              ? "Good effort. Room for improvement."
                              : "Keep working on it. Review the feedback carefully."}
                          </p>

                          {/* Visual Progress Bar */}
                          <div className="mt-6 max-w-md mx-auto">
                            <div className="h-3 bg-[#0D0D0D] rounded-full overflow-hidden border border-[#6A0DAD]/30">
                              <div
                                className="h-full bg-gradient-to-r from-[#6A0DAD] to-[#00D9FF] rounded-full transition-all duration-1000"
                                style={{
                                  width: `${
                                    (submission.velric_score / 10) * 100
                                  }%`,
                                }}
                              />
                            </div>
                          </div>

                          {/* Overall User Velric Score */}
                          {submission?.userVelricScore !== undefined &&
                            submission?.userVelricScore !== null && (
                              <div className="mt-6 pt-6 border-t border-[#6A0DAD]/30">
                                <p className="text-[14px] text-[#F5F5F5]/70 font-inter mb-3">
                                  Your Overall Velric Score
                                </p>
                                <div className="inline-flex items-baseline gap-2">
                                  <span className="text-[48px] font-bold font-sora bg-gradient-to-r from-[#00D9FF] to-[#6A0DAD] bg-clip-text text-transparent">
                                    {submission.userVelricScore.toFixed(1)}
                                  </span>
                                  <span className="text-[24px] font-semibold text-[#F5F5F5]/60 font-sora">
                                    / 10
                                  </span>
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  )}

                {/* Feedback Section */}
                <div className="mb-12">
                  <h2 className="text-[25px] font-bold font-sora text-white mb-4 antialiased">
                    Feedback
                  </h2>
                  <div className="bg-[#0D0D0D] border border-[#6A0DAD]/30 rounded-2xl p-6">
                    <div className="space-y-4">
                      {submission?.summary && (
                        <div className="text-white text-[18px] font-inter font-medium">
                          {submission.summary}
                        </div>
                      )}
                      {submission?.feedback && (
                        <div className="text-[#F5F5F5]/80 text-[15px] whitespace-pre-wrap">
                          {submission.feedback}
                        </div>
                      )}
                      {!submission?.feedback && (
                        <div className="text-[18px] text-[#F5F5F5]/60 font-inter">
                          Your feedback will appear here
                        </div>
                      )}
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
                          {submission?.letter_grade ?? "—"}
                        </span>
                      </div>
                      <p className="text-[18px] text-[#F5F5F5]/60 font-inter">
                        Grade
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
                            Score
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(submission?.grades
                          ? Object.entries(
                              submission.grades as Record<string, number>
                            )
                          : []
                        ).map(([k, v]) => (
                          <tr key={k} className="border-b border-[#6A0DAD]/10">
                            <td className="text-[14px] text-[#F5F5F5] font-inter py-4 pr-6 font-medium">
                              {k}
                            </td>
                            <td className="text-[14px] text-[#F5F5F5]/80 font-inter py-4 px-4 text-center">
                              {Number(v)}/10
                            </td>
                          </tr>
                        ))}
                        {!submission?.grades && (
                          <tr>
                            <td
                              className="text-[14px] text-[#F5F5F5]/80 font-inter py-4"
                              colSpan={2}
                            >
                              Not graded yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    {/* Rubric descriptions */}
                    {submission?.rubric && (
                      <div className="mt-6 grid grid-cols-1 gap-3">
                        {Object.entries(
                          submission.rubric as Record<string, string>
                        ).map(([crit, desc]) => (
                          <div
                            key={crit}
                            className="bg-[#0D0D0D] border border-[#6A0DAD]/10 rounded-xl p-3"
                          >
                            <div className="text-[14px] text-[#00D9FF] font-semibold">
                              {crit}
                            </div>
                            <div className="text-[13px] text-[#F5F5F5]/80">
                              {desc}
                            </div>
                          </div>
                        ))}
                        {/* Velric overall score out of 10 */}
                        
                      </div>
                    )}
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
                        {(submission?.positiveTemplates ?? []).length > 0 ? (
                          (submission.positiveTemplates as string[]).map(
                            (t, i) => (
                              <div
                                key={i}
                                className="bg-[#00D9FF]/10 border border-[#00D9FF]/20 rounded-xl p-4"
                              >
                                <p className="text-[14px] text-[#F5F5F5] font-inter">
                                  {t}
                                </p>
                              </div>
                            )
                          )
                        ) : (
                          <div className="text-[14px] text-[#F5F5F5]/60">
                            No positive templates generated yet.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Improvement Feedback Templates */}
                    <div className="bg-[#0D0D0D] border border-[#FF6B6B]/30 rounded-2xl p-6">
                      <h3 className="text-[18px] font-semibold text-[#FF6B6B] font-inter mb-4">
                        Improvement Areas
                      </h3>
                      <div className="space-y-3">
                        {(submission?.improvementTemplates ?? []).length > 0 ? (
                          (submission.improvementTemplates as string[]).map(
                            (t, i) => (
                              <div
                                key={i}
                                className="bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 rounded-xl p-4"
                              >
                                <p className="text-[14px] text-[#F5F5F5] font-inter">
                                  {t}
                                </p>
                              </div>
                            )
                          )
                        ) : (
                          <div className="text-[14px] text-[#F5F5F5]/60">
                            No improvement templates generated yet.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    onClick={() => router.push("/user-dashboard")}
                    className="flex-1 bg-gradient-to-r from-[#6A0DAD] to-[#00D9FF] text-white font-bold text-[18px] py-4 px-8 rounded-2xl hover:scale-105 hover:shadow-[#6A0DAD]/30 hover:shadow-2xl transition-all duration-300 font-sora antialiased"
                  >
                    Go back to user dashboard
                  </button>
                  <button
                    onClick={() => router.push("/analytics")}
                    className="flex-1 bg-[#1C1C1E] border border-[#6A0DAD]/30 text-[#F5F5F5] font-bold text-[18px] py-4 px-8 rounded-2xl hover:scale-105 hover:border-[#6A0DAD]/50 hover:bg-[#6A0DAD]/10 transition-all duration-300 font-sora antialiased"
                  >
                    Go to analytics
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
