import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, MapPin, GraduationCap, Briefcase, Code, Trophy, Linkedin, Github, Calendar, User } from "lucide-react";
import ScheduleInterviewFormModal from "./ScheduleInterviewFormModal";

interface CandidateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateId: string;
  candidateName: string;
  candidateEmail?: string;
  candidateVelricScore?: number;
}

interface CandidateProfile {
  id: string;
  name: string;
  email: string;
  velricScore: number;
  domain?: string;
  industry?: string;
  location?: string;
  education_level?: string;
  mission_focus?: string[];
  strength_areas?: string[];
  experience_summary?: string;
  learning_preference?: string;
  skills?: string[];
  profile_image?: string | null;
}

export default function CandidateProfileModal({
  isOpen,
  onClose,
  candidateId,
  candidateName,
  candidateEmail,
  candidateVelricScore,
}: CandidateProfileModalProps) {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !candidateId) return;

    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        // Record the view
        const recruiterData = localStorage.getItem("velric_user");
        const recruiterId = recruiterData ? JSON.parse(recruiterData).id : null;

        await fetch("/api/user/view-profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            candidateId,
            recruiterId,
          }),
        });

        // Fetch candidate profile data
        const [userResponse, surveyResponse] = await Promise.all([
          fetch(`/api/user/${candidateId}`),
          fetch(`/api/survey/${candidateId}`),
        ]);

        const userData = await userResponse.json();
        const surveyData = await surveyResponse.json();

        if (userData.success && surveyData.success) {
          setProfile({
            id: userData.user.id,
            name: userData.user.name || candidateName,
            email: userData.user.email || candidateEmail || "",
            velricScore: candidateVelricScore || 0,
            domain: surveyData.surveyData?.mission_focus?.[0],
            industry: surveyData.surveyData?.industry,
            location: undefined,
            education_level: surveyData.surveyData?.education_level,
            mission_focus: Array.isArray(surveyData.surveyData?.mission_focus)
              ? surveyData.surveyData.mission_focus
              : [],
            strength_areas: Array.isArray(surveyData.surveyData?.strength_areas)
              ? surveyData.surveyData.strength_areas
              : [],
            experience_summary: surveyData.surveyData?.experience_summary,
            learning_preference: surveyData.surveyData?.learning_preference,
            skills: [],
            profile_image: userData.user.profile_image || null,
          });
        }
      } catch (error) {
        console.error("Error fetching candidate profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [isOpen, candidateId, candidateName, candidateEmail]);

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl pointer-events-auto"
                style={{
                  background: "rgba(15, 23, 42, 1)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
                }}
              >
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-purple-500 to-cyan-500">
                  <h2 className="text-2xl font-bold text-white">Candidate Profile</h2>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5 text-white/60" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                      <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : profile ? (
                    <div className="space-y-6">
                      {/* Basic Info */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          {/* Profile Image */}
                          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center border-2 border-cyan-500/30 overflow-hidden flex-shrink-0">
                            {profile.profile_image ? (
                              <img
                                src={profile.profile_image}
                                alt={profile.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <User className="w-10 h-10 text-cyan-400" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-3xl font-bold text-white mb-2">{profile.name}</h3>
                          {profile.email && (
                            <div className="flex items-center text-white/60 mb-2">
                              <Mail className="w-4 h-4 mr-2" />
                              <a href={`mailto:${profile.email}`} className="hover:text-cyan-400 transition-colors">
                                {profile.email}
                              </a>
                            </div>
                          )}
                          {profile.location && (
                            <div className="flex items-center text-white/60">
                              <MapPin className="w-4 h-4 mr-2" />
                              {profile.location}
                            </div>
                          )}
                          </div>
                        </div>
                        <button
                          onClick={() => setIsScheduleModalOpen(true)}
                          className="px-6 py-3 rounded-lg font-medium text-white transition-all flex items-center space-x-2"
                          style={{
                            background: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
                          }}
                        >
                          <Calendar className="w-4 h-4" />
                          <span>Schedule Interview</span>
                        </button>
                      </div>

                      {/* Velric Score */}
                      <div className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-white/60 mb-1">Velric Score</p>
                            <p className="text-4xl font-bold text-cyan-300">{profile.velricScore.toFixed(1)}</p>
                          </div>
                          <Trophy className="w-12 h-12 text-yellow-400" />
                        </div>
                      </div>

                      {/* Domain & Industry */}
                      {(profile.domain || profile.industry) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {profile.domain && (
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                              <p className="text-xs text-white/60 mb-1">Domain</p>
                              <p className="text-lg font-semibold text-white">{profile.domain}</p>
                            </div>
                          )}
                          {profile.industry && (
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                              <p className="text-xs text-white/60 mb-1">Industry</p>
                              <p className="text-lg font-semibold text-white">{profile.industry}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Education */}
                      {profile.education_level && (
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                          <div className="flex items-center mb-2">
                            <GraduationCap className="w-5 h-5 text-purple-400 mr-2" />
                            <p className="text-sm font-semibold text-white">Education</p>
                          </div>
                          <p className="text-white/80">{profile.education_level}</p>
                        </div>
                      )}

                      {/* Mission Focus */}
                      {profile.mission_focus && profile.mission_focus.length > 0 && (
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                          <div className="flex items-center mb-3">
                            <Code className="w-5 h-5 text-cyan-400 mr-2" />
                            <p className="text-sm font-semibold text-white">Mission Focus</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {profile.mission_focus.map((focus, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 rounded-full text-xs border border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
                              >
                                {focus}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Strength Areas */}
                      {profile.strength_areas && profile.strength_areas.length > 0 && (
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                          <div className="flex items-center mb-3">
                            <Briefcase className="w-5 h-5 text-green-400 mr-2" />
                            <p className="text-sm font-semibold text-white">Strength Areas</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {profile.strength_areas.map((area, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 rounded-full text-xs border border-green-500/30 bg-green-500/10 text-green-300"
                              >
                                {area}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Experience Summary */}
                      {profile.experience_summary && (
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                          <p className="text-sm font-semibold text-white mb-2">Experience Summary</p>
                          <p className="text-white/80 whitespace-pre-wrap">{profile.experience_summary}</p>
                        </div>
                      )}

                      {/* Learning Preference */}
                      {profile.learning_preference && (
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                          <p className="text-sm font-semibold text-white mb-2">Learning Preference</p>
                          <p className="text-white/80">{profile.learning_preference}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-20 text-white/60">
                      <p>Failed to load candidate profile</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Schedule Interview Modal */}
      {isScheduleModalOpen && (
        <ScheduleInterviewFormModal
          isOpen={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
          candidateId={candidateId}
          candidateName={profile?.name || candidateName}
          candidateEmail={profile?.email || candidateEmail}
        />
      )}
    </>
  );
}

