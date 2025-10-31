import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface ActivityTrackerProps {
  userData: any;
}

export default function ActivityTracker({ userData }: ActivityTrackerProps) {
  const getActivityColor = (active: boolean) => {
    return active ? "bg-green-500" : "bg-gray-700";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-[#1C1C1E] to-[#2A1A3A] p-6 rounded-xl border border-purple-500/20"
    >
      <h3 className="text-lg font-bold text-white mb-6">This Week's Activity</h3>
      
      {/* 7-Day Activity Bar */}
      <div className="flex justify-between items-end mb-6">
        {userData.weeklyActivity.map((day: any, index: number) => (
          <div key={day.day} className="flex flex-col items-center space-y-2">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: day.active ? "40px" : "20px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`w-8 rounded-t-lg ${getActivityColor(day.active)}`}
            ></motion.div>
            <span className="text-xs text-gray-400">{day.day}</span>
          </div>
        ))}
      </div>

      {/* Streak Badge */}
      <div className="flex items-center justify-center space-x-2 mb-6 p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
        <Flame className="text-orange-500" size={20} />
        <span className="text-orange-500 font-bold">{userData.currentStreak}-Day Streak</span>
      </div>
      
      <p className="text-center text-sm text-gray-400 mb-6">Keep your streak alive!</p>

      {/* Recent Activity Feed */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-300">Recent Activity</h4>
        {userData.recentActivity.slice(0, 3).map((activity: any, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
          >
            <div>
              <p className="text-sm text-white">{activity.title}</p>
              <p className="text-xs text-gray-400">{activity.daysAgo} days ago</p>
            </div>
            <div className="text-sm font-medium text-purple-400">
              {activity.score}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}