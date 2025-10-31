import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import { TrendingUp, User, Eye } from 'lucide-react';

interface QuickStat {
  title: string;
  value: string;
  subtitle: string;
  subtext?: string;
  icon: 'chart' | 'user' | 'eye';
  gradient: string[];
}

interface QuickStatsPanelProps {
  stats: QuickStat[];
}

export default function QuickStatsPanel({ stats }: QuickStatsPanelProps) {
  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'chart':
        return TrendingUp;
      case 'user':
        return User;
      case 'eye':
        return Eye;
      default:
        return TrendingUp;
    }
  };

  const getGradientClass = (gradient: string[]) => {
    if (gradient.includes('green')) return 'from-green-500 to-teal-500';
    if (gradient.includes('blue')) return 'from-blue-500 to-cyan-500';
    if (gradient.includes('purple')) return 'from-purple-500 to-blue-500';
    return 'from-green-500 to-teal-500';
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-white">Quick Stats</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = getIcon(stat.icon);
          const gradientClass = getGradientClass(stat.gradient);
          
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <GlassCard className="p-6 relative overflow-hidden">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-10 rounded-3xl`} />
                
                <div className="relative z-10 flex items-center space-x-4">
                  {/* Icon Circle */}
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradientClass} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="text-2xl font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-white/80 text-sm font-medium mb-1">
                      {stat.subtitle}
                    </div>
                    {stat.subtext && (
                      <div className="text-white/60 text-xs">
                        {stat.subtext}
                      </div>
                    )}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}