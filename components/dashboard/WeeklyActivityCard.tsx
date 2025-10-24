import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import { Flame } from 'lucide-react';

interface WeeklyActivityData {
  day: string;
  active: boolean;
  score?: number;
}

interface RecentActivity {
  name: string;
  score: number;
  timeAgo: string;
}

interface WeeklyActivityCardProps {
  weeklyData: WeeklyActivityData[];
  streakCount: number;
  recentActivities: RecentActivity[];
}

export default function WeeklyActivityCard({ 
  weeklyData, 
  streakCount, 
  recentActivities 
}: WeeklyActivityCardProps) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <GlassCard className="p-6">
      <div className="space-y-6">
        {/* Title */}
        <h3 className="text-xl font-semibold text-white">This Week's Activity</h3>

        {/* Activity Calendar */}
        <div className="flex justify-between items-end space-x-2">
          {days.map((day, index) => {
            const dayData = weeklyData.find(d => d.day === day) || { day, active: false };
            
            return (
              <motion.div
                key={day}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex flex-col items-center space-y-2"
              >
                <motion.div
                  className={`activity-bar ${dayData.active ? 'active' : 'inactive'}`}
                  whileHover={{ scaleY: 1.1 }}
                  transition={{ duration: 0.2 }}
                />
                <span className="text-xs text-white/60 font-medium">{day}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Streak Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl p-4"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-white">{streakCount}-Day Streak</span>
                <span className="text-orange-400">🔥</span>
              </div>
              <p className="text-white/70 text-sm">Keep your streak alive!</p>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-white">Recent Activity</h4>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
              >
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">{activity.name}</p>
                  <p className="text-white/60 text-xs">{activity.timeAgo}</p>
                </div>
                <div className="text-right">
                  <span className="text-green-400 font-bold text-sm">
                    {activity.score}/100
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}