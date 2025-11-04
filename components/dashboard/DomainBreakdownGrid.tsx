import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import ProgressBar from '@/components/ui/ProgressBar';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface DomainData {
  name: string;
  score: number;
  change: number;
  skills: string[];
  color: 'pink' | 'cyan' | 'green' | 'orange' | 'blue' | 'purple';
  indicatorColor: 'pink' | 'cyan' | 'green' | 'orange' | 'blue' | 'purple';
}

interface DomainBreakdownGridProps {
  domains: DomainData[];
}

export default function DomainBreakdownGrid({ domains }: DomainBreakdownGridProps) {
  const formatChange = (change: number) => {
    if (change === 0) return { text: 'No change', color: 'text-white/60', icon: null };
    const sign = change > 0 ? '+' : '';
    const color = change > 0 ? 'text-green-400' : 'text-red-400';
    const icon = change > 0 ? TrendingUp : TrendingDown;
    return { 
      text: `${sign}${change}% from last week`, 
      color, 
      icon 
    };
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-white">Domain Breakdown</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {domains.map((domain, index) => {
          const changeInfo = formatChange(domain.change);
          const ChangeIcon = changeInfo.icon;
          
          return (
            <motion.div
              key={domain.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <GlassCard 
                className="p-6 relative h-48"
                glow={domain.color}
              >
                {/* Indicator Dot */}
                <div className={`indicator-dot indicator-${domain.indicatorColor}`} />
                
                <div className="space-y-4 h-full flex flex-col">
                  {/* Domain Name */}
                  <h4 className="text-lg font-semibold text-white leading-tight">
                    {domain.name}
                  </h4>
                  
                  {/* Score */}
                  <div className="text-3xl font-bold text-white">
                    {domain.score}
                  </div>
                  
                  {/* Change Indicator */}
                  <div className={`flex items-center space-x-1 text-sm ${changeInfo.color}`}>
                    {ChangeIcon && <ChangeIcon className="w-4 h-4" />}
                    <span>{changeInfo.text}</span>
                  </div>
                  
                  {/* Skills Label */}
                  <div className="flex-1">
                    <p className="text-white/60 text-xs font-medium mb-2 uppercase tracking-wide">
                      Skills
                    </p>
                    <div className="flex flex-wrap gap-1 overflow-hidden max-w-[95%] w-full">
                      {domain.skills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="skill-tag"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-auto">
                    <ProgressBar
                      value={domain.score}
                      color={domain.color}
                      height={6}
                      animated={true}
                    />
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