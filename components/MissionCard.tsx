import { motion } from "framer-motion";
import { Star, Clock, CheckCircle, TrendingUp, Play } from "lucide-react";
import CTAButton from "./CTAButton";

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

interface MissionCardProps {
  mission: Mission;
  onStar?: (missionId: string) => void;
  onStart?: (missionId: string) => void;
  onView?: (missionId: string) => void;
}

export default function MissionCard({ mission, onStar, onStart, onView }: MissionCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "starred": return "text-yellow-400";
      case "in_progress": return "text-[#00D9FF]";
      case "completed": return "text-green-400";
      case "submitted": return "text-[#00D9FF]";
      case "suggested": return "text-[#6A0DAD]";
      default: return "text-white";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "starred": return <Star className="w-4 h-4" />;
      case "in_progress": return <Play className="w-4 h-4" />;
      case "completed": return <CheckCircle className="w-4 h-4" />;
      case "submitted": return <CheckCircle className="w-4 h-4" />;
      case "suggested": return <TrendingUp className="w-4 h-4" />;
      default: return null;
    }
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
              <span className="text-sm font-medium capitalize">{mission.status.replace('_', ' ')}</span>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">{mission.title}</h3>
          <p className="text-white/70 text-sm leading-relaxed">{mission.description}</p>
        </div>
      </div>

      {/* Skills */}
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


      {/* Grade for Completed */}
      {mission.status === "completed" && mission.grade && (
        <div className="mb-4 p-3 bg-[#0D0D0D] rounded-xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white">Grade</span>
            <span className="text-lg font-bold text-[#6A0DAD]">{mission.grade}/100</span>
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
           {mission.status === "suggested" && (
             <>
               <button
                 onClick={() => onStar?.(mission.id)}
                 className="px-4 py-2 bg-[#0D0D0D] text-white/80 hover:text-white hover:bg-[#1C1C1E] rounded-lg transition-colors border border-white/10 cursor-pointer"
               >
                 <Star className="w-4 h-4" />
               </button>
               <button
                 onClick={() => onStart?.(mission.id)}
                 className="px-4 py-2 bg-gradient-to-r from-[#6A0DAD] to-[#00D9FF] text-white rounded-lg hover:scale-105 transition-transform cursor-pointer"
               >
                 Start Mission
               </button>
             </>
           )}
 
           {mission.status === "starred" && (
             <>
               <button
                 onClick={() => onStar?.(mission.id)}
                 className="px-4 py-2 bg-[#6A0DAD] text-white rounded-lg hover:scale-105 transition-transform cursor-pointer"
               >
                 <Star className="w-4 h-4 fill-current" />
               </button>
               <button
                 onClick={() => onStart?.(mission.id)}
                 className="px-4 py-2 bg-gradient-to-r from-[#6A0DAD] to-[#00D9FF] text-white rounded-lg hover:scale-105 transition-transform cursor-pointer"
               >
                 Start Mission
               </button>
             </>
           )}
 
           {mission.status === "in_progress" && (
             <button
               onClick={() => onView?.(mission.id)}
               className="px-4 py-2 bg-gradient-to-r from-[#6A0DAD] to-[#00D9FF] text-white rounded-lg hover:scale-105 transition-transform cursor-pointer"
             >
               Continue Mission
             </button>
           )}
 
           {mission.status === "submitted" && (
             <button
               onClick={() => onView?.(mission.id)}
               className="px-4 py-2 bg-[#0D0D0D] text-white/80 hover:text-white hover:bg-[#1C1C1E] rounded-lg transition-colors border border-white/10 cursor-pointer"
             >
               View Submission
             </button>
           )}
 
           {mission.status === "completed" && (
             <button
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
// components/MissionCard.tsx
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { Clock, Star, ArrowRight } from 'lucide-react';
import { Mission, getDifficultyColor } from '@/lib/missionHelpers';
import { MissionTemplate } from '@/types';

interface MissionCardProps {
  mission: Mission | MissionTemplate;
  index: number;
}

export default function MissionCard({ mission, index }: MissionCardProps) {
  const router = useRouter();

  const handleViewMission = () => {
    router.push(`/missions/${mission.id}`);
  };

  // Handle both Mission and MissionTemplate types
  const estimatedTime = 'estimatedTime' in mission ? mission.estimatedTime : mission.time_estimate;
  const skills = mission.skills;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-[#1C1C1E] rounded-xl p-6 border border-gray-800 hover:border-velricViolet/50 transition-all duration-300 group cursor-pointer"
      whileHover={{ y: -5, scale: 1.02 }}
      onClick={handleViewMission}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-velricViolet transition-colors">
            {mission.title}
          </h3>
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {mission.description}
          </p>
        </div>
      </div>

      {/* Difficulty and Time */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-400" />
          <span className={`text-sm font-medium ${getDifficultyColor(mission.difficulty)}`}>
            {mission.difficulty}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400">{estimatedTime}</span>
        </div>
      </div>

      {/* Skills */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {skills.slice(0, 3).map((skill, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-velricViolet/20 text-velricViolet text-xs rounded-full border border-velricViolet/30"
            >
              {skill}
            </span>
          ))}
          {skills.length > 3 && (
            <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
              +{skills.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* View Mission Button */}
      <motion.button
        onClick={handleViewMission}
        className="w-full bg-gradient-to-r from-velricViolet to-plasmaBlue text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        View Mission
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </motion.div>
  );
}