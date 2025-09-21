import { motion } from "framer-motion";
import MissionCard from "./MissionCard";

interface Mission {
  id: string;
  title: string;
  description: string;
  skills: string[];
  industries: string[];
  status: "suggested" | "starred" | "in_progress" | "submitted" | "completed";
  grade?: number;
  feedback?: string;
  started_at?: string;
  submitted_at?: string;
  completed_at?: string;
}

interface DashboardSectionProps {
  title: string;
  description: string;
  missions: Mission[];
  emptyMessage: string;
  icon?: string;
  onStar?: (missionId: string) => void;
  onStart?: (missionId: string) => void;
  onView?: (missionId: string) => void;
}

export default function DashboardSection({
  title,
  description,
  missions,
  emptyMessage,
  icon,
  onStar,
  onStart,
  onView
}: DashboardSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Section Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          {icon && (
            <span className="text-4xl md:text-5xl" style={{ filter: 'none' }}>
              {icon}
            </span>
          )}
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-[#F5F5F5] bg-clip-text text-transparent">
            {title}
          </h2>
        </div>
        <p className="text-white/70 text-lg max-w-2xl mx-auto">
          {description}
        </p>
      </div>

      {/* Missions Grid */}
      {missions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions.map((mission, index) => (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <MissionCard
                mission={mission}
                onStar={onStar}
                onStart={onStart}
                onView={onView}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center py-16"
        >
          <div className="bg-[#1C1C1E] rounded-2xl p-12 border border-white/5">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#0D0D0D] flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">No missions yet</h3>
            <p className="text-white/60 max-w-md mx-auto">
              {emptyMessage}
            </p>
          </div>
        </motion.div>
      )}

      {missions.length > 6 && (
        <div className="text-center pt-6">
          <button className="px-6 py-3 bg-[#0D0D0D] text-white/80 hover:text-white hover:bg-[#1C1C1E] rounded-lg transition-colors border border-white/10">
            View All ({missions.length} missions)
          </button>
        </div>
      )}
    </motion.section>
  );
}
