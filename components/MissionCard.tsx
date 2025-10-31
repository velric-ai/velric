import { motion } from "framer-motion";
import { Star, Clock, CheckCircle, TrendingUp, Play } from "lucide-react";
import { StaticMission } from "@/data/staticMissions";

interface MissionCardProps {
  mission: StaticMission;
  onStar?: (missionId: string) => void;
  onStart?: (missionId: string) => void;
  onView?: (missionId: string) => void;
}

export default function MissionCard({ mission, onStar, onStart, onView }: MissionCardProps) {
  const getStatusColor = (status?: string) => {
    if (!status) return "text-gray-400";
    switch (status) {
      case "starred": return "text-yellow-400";
      case "in_progress": return "text-blue-400";
      case "completed": return "text-green-400";
      case "submitted": return "text-blue-400";
      case "suggested": return "text-purple-400";
      default: return "text-gray-400";
    }
  };

  const getStatusIcon = (status?: string) => {
    if (!status) return <TrendingUp className="w-4 h-4" />;
    switch (status) {
      case "starred": return <Star className="w-4 h-4" />;
      case "in_progress": return <Play className="w-4 h-4" />;
      case "completed": return <CheckCircle className="w-4 h-4" />;
      case "submitted": return <CheckCircle className="w-4 h-4" />;
      case "suggested": return <TrendingUp className="w-4 h-4" />;
      default: return <TrendingUp className="w-4 h-4" />;
    }
  };

  const getStatusText = (status?: string) => {
    if (!status) return "suggested";
    return status.replace('_', ' ');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="bg-[#1C1C1E] rounded-2xl p-6 hover:shadow-[0_8px_30px_rgba(106,13,173,0.15)] transition-all duration-300 border border-white/5"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className={`flex items-center gap-1 ${getStatusColor(mission.status)}`}>
              {getStatusIcon(mission.status)}
              <span className="text-sm font-medium capitalize">{getStatusText(mission.status)}</span>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">{mission.title}</h3>
          <p className="text-white/70 text-sm leading-relaxed">{mission.description}</p>
        </div>
      </div>

      {/* Skills */}
      {mission.skills && mission.skills.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {mission.skills.slice(0, 4).map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-[#0D0D0D] text-white/80 text-xs rounded-full border border-white/10"
              >
                {skill}
              </span>
            ))}
            {mission.skills.length > 4 && (
              <span className="px-3 py-1 bg-[#0D0D0D] text-white/60 text-xs rounded-full border border-white/10">
                +{mission.skills.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Grade for Completed */}
      {mission.status === "completed" && mission.grade && (
        <div className="mb-4 p-3 bg-[#0D0D0D] rounded-xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white">Grade</span>
            <span className="text-lg font-bold text-purple-400">{mission.grade}/100</span>
          </div>
          {mission.feedback && (
            <p className="text-sm text-white/70 italic">"{mission.feedback}"</p>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-white/60">
          {mission.started_at && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Started {new Date(mission.started_at).toLocaleDateString()}</span>
            </div>
          )}
          {mission.submitted_at && (
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              <span>Submitted {new Date(mission.submitted_at).toLocaleDateString()}</span>
            </div>
          )}
          {mission.completed_at && (
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              <span>Completed {new Date(mission.completed_at).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {(!mission.status || mission.status === "suggested") && (
            <>
              <button
                type="button"
                onClick={() => onStar?.(mission.id)}
                className="px-4 py-2 bg-[#0D0D0D] text-white/80 hover:text-white hover:bg-[#1C1C1E] rounded-lg transition-colors border border-white/10 cursor-pointer"
                title="Star this mission"
              >
                <Star className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onStart?.(mission.id)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg hover:scale-105 transition-transform cursor-pointer"
              >
                Start Mission
              </button>
            </>
          )}

          {mission.status === "starred" && (
            <>
              <button
                type="button"
                onClick={() => onStar?.(mission.id)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:scale-105 transition-transform cursor-pointer"
                title="Unstar this mission"
              >
                <Star className="w-4 h-4 fill-current" />
              </button>
              <button
                type="button"
                onClick={() => onStart?.(mission.id)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg hover:scale-105 transition-transform cursor-pointer"
              >
                Start Mission
              </button>
            </>
          )}

          {mission.status === "in_progress" && (
            <button
              type="button"
              onClick={() => onView?.(mission.id)}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg hover:scale-105 transition-transform cursor-pointer"
            >
              Continue Mission
            </button>
          )}

          {mission.status === "submitted" && (
            <button
              type="button"
              onClick={() => onView?.(mission.id)}
              className="px-4 py-2 bg-[#0D0D0D] text-white/80 hover:text-white hover:bg-[#1C1C1E] rounded-lg transition-colors border border-white/10 cursor-pointer"
            >
              View Submission
            </button>
          )}

          {mission.status === "completed" && (
            <button
              type="button"
              onClick={() => onView?.(mission.id)}
              className="px-4 py-2 bg-[#0D0D0D] text-white/80 hover:text-white hover:bg-[#1C1C1E] rounded-lg transition-colors border border-white/10 cursor-pointer"
            >
              View Mission Details
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}