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