import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import CircularProgress from '@/components/ui/CircularProgress';

interface VelricScoreCardProps {
  score: number;
  percentile: number;
  lastUpdated: string;
  onViewBreakdown?: () => void;
}

export default function VelricScoreCard({ 
  score, 
  percentile, 
  lastUpdated, 
  onViewBreakdown 
}: VelricScoreCardProps) {
  const getPercentileText = (percentile: number) => {
    if (percentile >= 95) return "Top 5% of Candidates";
    if (percentile >= 90) return "Top 10% of Candidates";
    if (percentile >= 75) return "Top 25% of Candidates";
    return `Top ${100 - percentile}% of Candidates`;
  };

  return (
    <GlassCard 
      className="p-8 text-center relative overflow-hidden"
      glow="cyan"
    >
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-3xl" />
      
      <div className="relative z-10">
        {/* Circular Progress */}
        <div className="mb-6">
          <CircularProgress
            value={score}
            size={200}
            strokeWidth={8}
            animated={true}
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
                className="text-5xl font-bold text-white mb-2"
              >
                {score}
              </motion.div>
            </div>
          </CircularProgress>
        </div>

        {/* Score Labels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="space-y-2 mb-6"
        >
          <h3 className="text-lg font-semibold text-white tracking-wide">
            YOUR VELRIC SCORE
          </h3>
          <p className="text-cyan-400 font-medium">
            {percentile}th Percentile Globally
          </p>
          <p className="text-green-400 text-sm font-medium">
            {getPercentileText(percentile)}
          </p>
        </motion.div>

        {/* Last Updated */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-white/60 text-sm mb-6"
        >
          Updated {lastUpdated}
        </motion.p>

        {/* View Breakdown Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          onClick={onViewBreakdown}
          className="btn-gradient-primary w-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          View Score Breakdown
        </motion.button>
      </div>
    </GlassCard>
  );
}