// components/MissionDescription.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MissionTemplate, UserMissionActionResponse } from '@/types';
import { 
  Clock, 
  Star, 
  Play, 
  CheckCircle, 
  Building, 
  Code, 
  AlertCircle,
  Sparkles 
} from 'lucide-react';

interface MissionDescriptionProps {
  mission: MissionTemplate;
}

export default function MissionDescription({ mission }: MissionDescriptionProps) {
  const [isStarred, setIsStarred] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Mock user ID - in real app this would come from auth context
  const userId = 'user-1';

  const showMessage = (text: string, type: 'success' | 'error') => {
    setActionMessage({ text, type });
    setTimeout(() => setActionMessage(null), 3000);
  };

  const handleUserMissionAction = async (action: 'star' | 'start') => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/user_missions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          missionId: mission.id,
          action
        }),
      });

      const data: UserMissionActionResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || `Failed to ${action} mission`);
      }

      if (action === 'star') {
        setIsStarred(true);
        showMessage('Mission starred! You can find it in your starred missions.', 'success');
      } else if (action === 'start') {
        setIsStarted(true);
        showMessage('Mission started! Good luck with your challenge.', 'success');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to ${action} mission`;
      showMessage(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'Intermediate':
        return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'Advanced':
        return 'text-red-400 bg-red-400/20 border-red-400/30';
      default:
        return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Action Messages */}
      <AnimatePresence>
        {actionMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-lg border flex items-center gap-3 ${
              actionMessage.type === 'success'
                ? 'bg-green-500/20 border-green-500/30 text-green-400'
                : 'bg-red-500/20 border-red-500/30 text-red-400'
            }`}
          >
            {actionMessage.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {actionMessage.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mission Header */}
      <div className="bg-[#1C1C1E] rounded-2xl p-8 border border-gray-800">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <motion.h1 
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {mission.title}
            </motion.h1>
            
            <motion.p 
              className="text-gray-300 text-lg leading-relaxed mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {mission.description}
            </motion.p>

            {/* Mission Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-full border ${getDifficultyColor(mission.difficulty)}`}>
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">{mission.difficulty}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{mission.time_estimate}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:min-w-[200px]">
            <motion.button
              onClick={() => handleUserMissionAction('start')}
              disabled={isLoading || isStarted}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                isStarted
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-gradient-to-r from-velricViolet to-plasmaBlue text-white hover:shadow-lg'
              }`}
              whileHover={!isLoading && !isStarted ? { scale: 1.02 } : {}}
              whileTap={!isLoading && !isStarted ? { scale: 0.98 } : {}}
            >
              {isStarted ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Started
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Start Mission
                </>
              )}
            </motion.button>

            <motion.button
              onClick={() => handleUserMissionAction('star')}
              disabled={isLoading || isStarred}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium border transition-all duration-300 ${
                isStarred
                  ? 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30'
                  : 'border-velricViolet text-velricViolet hover:bg-velricViolet hover:text-white'
              }`}
              whileHover={!isLoading && !isStarred ? { scale: 1.02 } : {}}
              whileTap={!isLoading && !isStarred ? { scale: 0.98 } : {}}
            >
              <Star className={`w-4 h-4 ${isStarred ? 'fill-current' : ''}`} />
              {isStarred ? 'Starred' : 'Star Mission'}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <motion.div 
        className="bg-[#1C1C1E] rounded-2xl p-8 border border-gray-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Code className="w-6 h-6 text-velricViolet" />
          <h2 className="text-2xl font-bold text-white">Skills You'll Use</h2>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {mission.skills.map((skill, index) => (
            <motion.span
              key={skill}
              className="px-4 py-2 bg-velricViolet/20 text-velricViolet rounded-full border border-velricViolet/30 font-medium"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Industries Section */}
      <motion.div 
        className="bg-[#1C1C1E] rounded-2xl p-8 border border-gray-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Building className="w-6 h-6 text-plasmaBlue" />
          <h2 className="text-2xl font-bold text-white">Relevant Industries</h2>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {mission.industries.map((industry, index) => (
            <motion.span
              key={industry}
              className="px-4 py-2 bg-plasmaBlue/20 text-plasmaBlue rounded-full border border-plasmaBlue/30 font-medium"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              {industry}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Mission Category */}
      {mission.category && (
        <motion.div 
          className="bg-[#1C1C1E] rounded-2xl p-8 border border-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="text-lg font-semibold text-white mb-2">Category</h3>
          <span className="inline-block px-4 py-2 bg-gray-700 text-gray-300 rounded-full">
            {mission.category}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}