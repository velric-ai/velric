import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Award, 
  Clock, 
  Target,
  ArrowRight,
  CheckCircle,
  Star,
  Activity
} from "lucide-react";

interface DashboardOverviewProps {
  user: any;
}

export default function DashboardOverview({ user }: DashboardOverviewProps) {
  // Mock data - in real app, this would come from API
  const stats = {
    velricScore: 847,
    completedMissions: 12,
    activeMissions: 3,
    totalApplications: 8
  };

  const recentActivity = [
    {
      id: 1,
      type: "mission_completed",
      title: "React Dashboard Component",
      time: "2 hours ago",
      score: 92
    },
    {
      id: 2,
      type: "application_submitted",
      title: "Frontend Developer at TechCorp",
      time: "1 day ago"
    },
    {
      id: 3,
      type: "mission_started",
      title: "API Authentication System",
      time: "2 days ago"
    },
    {
      id: 4,
      type: "profile_updated",
      title: "Updated skills and experience",
      time: "3 days ago"
    }
  ];

  const quickActions = [
    {
      title: "Start New Mission",
      description: "Discover AI-generated missions tailored to your skills",
      icon: Target,
      color: "from-purple-500 to-purple-600",
      action: "start-mission"
    },
    {
      title: "View Applications",
      description: "Track your job application status and progress",
      icon: Activity,
      color: "from-blue-500 to-blue-600",
      action: "view-applications"
    },
    {
      title: "Update Profile",
      description: "Keep your profile current with latest achievements",
      icon: Award,
      color: "from-green-500 to-green-600",
      action: "update-profile"
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "mission_completed":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "application_submitted":
        return <TrendingUp className="w-4 h-4 text-blue-400" />;
      case "mission_started":
        return <Clock className="w-4 h-4 text-yellow-400" />;
      default:
        return <Star className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name || 'User'}! 👋
        </h2>
        <p className="text-white/70">
          Here's what's happening with your Velric journey today.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="bg-[#1C1C1E] p-6 rounded-2xl border border-purple-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats.velricScore}</div>
          <div className="text-sm text-white/60">Velric Score</div>
        </div>

        <div className="bg-[#1C1C1E] p-6 rounded-2xl border border-blue-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats.completedMissions}</div>
          <div className="text-sm text-white/60">Completed Missions</div>
        </div>

        <div className="bg-[#1C1C1E] p-6 rounded-2xl border border-yellow-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats.activeMissions}</div>
          <div className="text-sm text-white/60">Active Missions</div>
        </div>

        <div className="bg-[#1C1C1E] p-6 rounded-2xl border border-green-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats.totalApplications}</div>
          <div className="text-sm text-white/60">Applications</div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-xl font-semibold mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.action}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#1C1C1E] p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all text-left group"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  {action.title}
                </h4>
                <p className="text-sm text-white/60 mb-4">{action.description}</p>
                <div className="flex items-center text-purple-400 text-sm font-medium">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="text-xl font-semibold mb-6">Recent Activity</h3>
        <div className="bg-[#1C1C1E] rounded-2xl border border-white/10 overflow-hidden">
          {recentActivity.map((activity, index) => (
            <div
              key={activity.id}
              className={`p-6 flex items-center space-x-4 ${
                index !== recentActivity.length - 1 ? 'border-b border-white/10' : ''
              }`}
            >
              <div className="flex-shrink-0">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-white">{activity.title}</h4>
                <p className="text-sm text-white/60">{activity.time}</p>
              </div>
              {activity.score && (
                <div className="flex-shrink-0">
                  <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                    Score: {activity.score}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}