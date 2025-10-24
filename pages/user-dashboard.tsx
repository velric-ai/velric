import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Target, 
  GraduationCap, 
  BarChart3, 
  User, 
  Settings,
  Bell,
  TrendingUp,
  TrendingDown,
  Flame,
  Github,
  Code,
  Trophy,
  MessageCircle,
  Linkedin,
  X,
  Plus,
  Eye,
  LogOut,
  ChevronDown
} from "lucide-react";

export default function UserDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Check authentication and load user data
  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem("velric_user");
      if (!userData) {
        router.push("/login");
        return;
      }
      
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        router.push("/login");
        return;
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showUserDropdown && !target.closest('.user-dropdown-container')) {
        setShowUserDropdown(false);
      }
    };

    if (showUserDropdown) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showUserDropdown]);

  const handleLogout = () => {
    localStorage.removeItem("velric_user");
    router.push("/");
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'missions', label: 'Missions', icon: Target },
    { id: 'grading', label: 'Grading', icon: GraduationCap },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Mock data matching the reference images
  const dashboardData = {
    velricScore: 95,
    percentile: 95,
    lastUpdated: "2025-10-14",
    weeklyActivity: [
      { day: 'Mon', active: true },
      { day: 'Tue', active: true },
      { day: 'Wed', active: false },
      { day: 'Thu', active: true },
      { day: 'Fri', active: true },
      { day: 'Sat', active: false },
      { day: 'Sun', active: false }
    ],
    streakCount: 5,
    recentActivities: [
      { name: "Completed: Backend Challenge", score: 92, timeAgo: "2 days ago" },
      { name: "Updated: Portfolio", timeAgo: "3 days ago" },
      { name: "Completed: Frontend Mission", score: 88, timeAgo: "5 days ago" }
    ],   
 domains: [
      {
        name: "Backend Development",
        score: 92,
        change: 5,
        skills: ["Python", "Node.js", "PostgreSQL"],
        color: "#F472B6"
      },
      {
        name: "Frontend Development", 
        score: 88,
        change: 3,
        skills: ["React", "TypeScript", "Tailwind CSS"],
        color: "#00F5FF"
      },
      {
        name: "Data Analytics",
        score: 85,
        change: 0,
        skills: ["SQL", "Python", "Tableau"],
        color: "#00FF87"
      },
      {
        name: "DevOps & Infrastructure",
        score: 78,
        change: -2,
        skills: ["Docker", "AWS", "Kubernetes"],
        color: "#F59E0B"
      },
      {
        name: "Mobile Development",
        score: 82,
        change: 8,
        skills: ["React Native", "Swift", "Flutter"],
        color: "#3B82F6"
      },
      {
        name: "AI & Machine Learning",
        score: 90,
        change: 12,
        skills: ["TensorFlow", "PyTorch", "Scikit-learn"],
        color: "#A78BFA"
      }
    ],    
quickStats: [
      { title: "+12%", subtitle: "30-Day Score Growth", icon: TrendingUp, color: "#00FF87" },
      { title: "85%", subtitle: "Profile Completeness", subtext: "Add 3 more details", icon: User, color: "#3B82F6" },
      { title: "24", subtitle: "Profile Views This Month", icon: Eye, color: "#A78BFA" }
    ],
    platforms: [
      { name: "GitHub", icon: Github, connected: true, status: "Public" },
      { name: "CodeSignal", icon: Code, connected: true, status: "Private" },
      { name: "HackerRank", icon: Trophy, connected: false },
      { name: "Discord", icon: MessageCircle, connected: true, status: "Public" },
      { name: "LinkedIn", icon: Linkedin, connected: false }
    ]
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #1a0b2e 0%, #16213e 50%, #0f3460 100%)'
      }}>
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard | Velric</title>
        <meta name="description" content="Your Velric dashboard - track your progress and performance" />
        <link rel="icon" href="/assets/logo.png" />
      </Head>

      <div className="min-h-screen text-white" style={{
        background: 'linear-gradient(135deg, #1a0b2e 0%, #16213e 50%, #0f3460 100%)'
      }}>
        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-cyan-500/10 to-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: '20px 20px'
            }}
          />
        </div>

        {/* Top Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 h-16" style={{
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src="/assets/logo.png" alt="Velric Logo" className="h-8 brightness-110" />
            </div>  
          <div className="flex items-center space-x-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-purple-500/30 text-white border border-purple-500/50' 
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{tab.label}</span>
                  </motion.button>
                );
              })}
            </div>

            <div className="flex items-center space-x-4">
              <motion.button
                className="relative p-2 rounded-lg hover:bg-white/5 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Bell className="w-5 h-5 text-white/80" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  3
                </span>
              </motion.button>

              <div className="relative user-dropdown-container">
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUserDropdown(!showUserDropdown);
                  }}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">V</span>
                  </div>
                  <span className="text-sm font-medium text-white">Velric AI</span>
                  <ChevronDown className={`w-4 h-4 text-white/60 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
                </motion.button>

                {/* Dropdown Menu */}
                {showUserDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-48 rounded-xl overflow-hidden z-50"
                    style={{
                      background: 'rgba(0, 0, 0, 0.8)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                    }}
                  >
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowUserDropdown(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-white/5 transition-colors"
                      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <LogOut className="w-4 h-4 text-red-400" />
                      <span className="text-sm font-medium text-white">Logout</span>
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </nav>  
      {/* Main Content */}
        <div className="relative z-10 pt-16">
          {activeTab === 'dashboard' ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-7xl mx-auto px-4 py-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Velric Score Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="p-8 text-center relative overflow-hidden rounded-3xl"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(15px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-3xl" />
                    
                    <div className="relative z-10">
                      <div className="mb-6">
                        <div className="relative inline-flex items-center justify-center">
                          <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 200 200">
                            <defs>
                              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#00F5FF" />
                                <stop offset="50%" stopColor="#0EA5E9" />
                                <stop offset="100%" stopColor="#3B82F6" />
                              </linearGradient>
                            </defs>
                            <circle
                              cx="100"
                              cy="100"
                              r="88"
                              stroke="rgba(255, 255, 255, 0.1)"
                              strokeWidth="8"
                              fill="none"
                            />
                            <motion.circle
                              cx="100"
                              cy="100"
                              r="88"
                              stroke="url(#scoreGradient)"
                              strokeWidth="8"
                              fill="none"
                              strokeLinecap="round"
                              strokeDasharray={`${2 * Math.PI * 88}`}
                              strokeDashoffset={`${2 * Math.PI * 88 * (1 - dashboardData.velricScore / 100)}`}
                              initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                              animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - dashboardData.velricScore / 100) }}
                              transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                              style={{
                                filter: 'drop-shadow(0 0 10px rgba(0, 245, 255, 0.5))'
                              }}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
                              className="text-5xl font-bold text-white"
                            >
                              {dashboardData.velricScore}
                            </motion.div>
                          </div>
                        </div>
                      </div>           
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
                          {dashboardData.percentile}th Percentile Globally
                        </p>
                        <p className="text-green-400 text-sm font-medium">
                          Top 5% of Candidates
                        </p>
                      </motion.div>

                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.5 }}
                        className="text-white/60 text-sm mb-6"
                      >
                        Updated {dashboardData.lastUpdated}
                      </motion.p>

                      <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.5 }}
                        className="w-full py-3 rounded-xl font-semibold transition-all"
                        style={{
                          background: 'linear-gradient(135deg, #00F5FF 0%, #3B82F6 100%)',
                          boxShadow: '0 4px 15px rgba(0, 245, 255, 0.2)'
                        }}
                        whileHover={{ 
                          scale: 1.02,
                          boxShadow: '0 8px 25px rgba(0, 245, 255, 0.3)'
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        View Score Breakdown
                      </motion.button>
                    </div>
                  </motion.div>         
         {/* Weekly Activity Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="p-6 rounded-3xl"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(15px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-white">This Week's Activity</h3>

                      <div className="flex justify-between items-end space-x-2">
                        {dashboardData.weeklyActivity.map((day, index) => (
                          <motion.div
                            key={day.day}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                            className="flex flex-col items-center space-y-2"
                          >
                            <motion.div
                              className={`w-3 h-16 rounded-lg transition-all ${
                                day.active 
                                  ? 'bg-gradient-to-t from-green-400 to-cyan-400' 
                                  : 'bg-white/10'
                              }`}
                              style={{
                                boxShadow: day.active ? '0 0 10px rgba(0, 255, 135, 0.5)' : 'none'
                              }}
                              whileHover={{ scaleY: 1.1 }}
                              transition={{ duration: 0.2 }}
                            />
                            <span className="text-xs text-white/60 font-medium">{day.day}</span>
                          </motion.div>
                        ))}
                      </div>

                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className="rounded-xl p-4"
                        style={{
                          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(239, 68, 68, 0.2) 100%)',
                          border: '1px solid rgba(245, 158, 11, 0.3)'
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center"
                            style={{
                              background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)'
                            }}
                          >
                            <Flame className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-bold text-white">{dashboardData.streakCount}-Day Streak</span>
                              <span className="text-orange-400">🔥</span>
                            </div>
                            <p className="text-white/70 text-sm">Keep your streak alive!</p>
                          </div>
                        </div>
                      </motion.div>    
                  <div className="space-y-4">
                        <h4 className="text-lg font-medium text-white">Recent Activity</h4>
                        <div className="space-y-3">
                          {dashboardData.recentActivities.map((activity, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                              className="flex items-center justify-between p-3 rounded-lg"
                              style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                              }}
                            >
                              <div className="flex-1">
                                <p className="text-white font-medium text-sm">{activity.name}</p>
                                <p className="text-white/60 text-xs">{activity.timeAgo}</p>
                              </div>
                              {activity.score && (
                                <div className="text-right">
                                  <span className="text-green-400 font-bold text-sm">
                                    {activity.score}/100
                                  </span>
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>     
           {/* Right Column */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Domain Breakdown */}
                  <div className="space-y-6">
                    <h3 className="text-2xl font-semibold text-white">Domain Breakdown</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                      {dashboardData.domains.map((domain, index) => {
                        const changeColor = domain.change > 0 ? '#00FF87' : domain.change < 0 ? '#EF4444' : '#9CA3AF';
                        const ChangeIcon = domain.change > 0 ? TrendingUp : domain.change < 0 ? TrendingDown : null;
                        
                        return (
                          <motion.div
                            key={domain.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                            className="p-5 relative min-h-[220px] rounded-2xl"
                            style={{
                              background: 'rgba(255, 255, 255, 0.05)',
                              backdropFilter: 'blur(15px)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                            }}
                            whileHover={{
                              y: -4,
                              scale: 1.02,
                              boxShadow: `0 12px 40px rgba(0, 0, 0, 0.4)`
                            }}
                          >
                            {/* Indicator Dot */}
                            <div 
                              className="absolute top-4 right-4 w-3 h-3 rounded-full"
                              style={{
                                backgroundColor: domain.color,
                                boxShadow: `0 0 10px ${domain.color}`
                              }}
                            />
                            
                            <div className="h-full flex flex-col justify-between">
                              <div className="space-y-3">
                                <h4 className="text-base font-semibold text-white leading-tight pr-6">
                                  {domain.name}
                                </h4>
                                
                                <div className="text-2xl font-bold text-white">
                                  {domain.score}
                                </div>
                                
                                <div className="flex items-center space-x-1 text-xs" style={{ color: changeColor }}>
                                  {ChangeIcon && <ChangeIcon className="w-3 h-3" />}
                                  <span className="font-medium">
                                    {domain.change === 0 ? 'No change' : `${domain.change > 0 ? '+' : ''}${domain.change}% from last week`}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="space-y-3">
                                <div>
                                  <p className="text-white/60 text-xs font-medium mb-2 uppercase tracking-wide">
                                    Skills
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {domain.skills.map((skill, skillIndex) => (
                                      <span
                                        key={skillIndex}
                                        className="px-2 py-1 rounded text-xs font-medium"
                                        style={{
                                          background: 'rgba(255, 255, 255, 0.1)',
                                          color: 'rgba(255, 255, 255, 0.8)',
                                          border: '1px solid rgba(255, 255, 255, 0.1)'
                                        }}
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                
                                <div>
                                  <div className="h-2 rounded-full overflow-hidden"
                                    style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                                  >
                                    <motion.div
                                      className="h-full rounded-full"
                                      style={{ 
                                        background: `linear-gradient(90deg, ${domain.color}, ${domain.color}dd)`,
                                        boxShadow: `0 0 10px ${domain.color}50`
                                      }}
                                      initial={{ width: 0 }}
                                      animate={{ width: `${domain.score}%` }}
                                      transition={{ duration: 1.5, delay: 0.5 + index * 0.1, ease: "easeOut" }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="space-y-6 mt-12">
                    <h3 className="text-2xl font-semibold text-white">Quick Stats</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {dashboardData.quickStats.map((stat, index) => {
                        const Icon = stat.icon;
                        
                        return (
                          <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                            className="p-6 relative overflow-hidden rounded-2xl"
                            style={{
                              background: 'rgba(255, 255, 255, 0.05)',
                              backdropFilter: 'blur(15px)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                            }}
                          >
                            <div 
                              className="absolute inset-0 opacity-10 rounded-2xl"
                              style={{
                                background: `linear-gradient(135deg, ${stat.color}, ${stat.color}80)`
                              }}
                            />
                            
                            <div className="relative z-10 flex items-center space-x-4">
                              <div 
                                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{
                                  background: `linear-gradient(135deg, ${stat.color}, ${stat.color}cc)`
                                }}
                              >
                                <Icon className="w-6 h-6 text-white" />
                              </div>
                              
                              <div className="flex-1">
                                <div className="text-2xl font-bold text-white mb-1">
                                  {stat.title}
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
                          </motion.div>
                        );
                      })}
                    </div>
                  </div> 
                 {/* Connected Platforms */}
                  <div className="space-y-6">
                    <h3 className="text-2xl font-semibold text-white">Connected Platforms</h3>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="p-6 rounded-2xl"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(15px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                      }}
                    >
                      <div className="space-y-4">
                        {dashboardData.platforms.map((platform, index) => {
                          const Icon = platform.icon;
                          
                          return (
                            <motion.div
                              key={platform.name}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                              className="flex items-center justify-between p-4 rounded-lg hover:bg-white/5 transition-colors"
                              style={{
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                              }}
                            >
                              <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                                  <Icon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <h4 className="text-white font-medium">{platform.name}</h4>
                                  <p className="text-white/60 text-sm">
                                    {platform.connected ? 'Connected' : 'Not Connected'}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center space-x-3">
                                {platform.connected ? (
                                  <>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                      platform.status === 'Public' 
                                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                        : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                    }`}>
                                      {platform.status}
                                    </span>
                                    
                                    <motion.button
                                      className="w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center text-red-400 hover:text-red-300 transition-colors"
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                    >
                                      <X className="w-4 h-4" />
                                    </motion.button>
                                  </>
                                ) : (
                                  <motion.button
                                    className="px-4 py-2 rounded-full text-xs font-medium"
                                    style={{
                                      background: 'linear-gradient(135deg, #A78BFA, #3B82F6)'
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    Connect
                                  </motion.button>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}

                        <motion.button
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 + dashboardData.platforms.length * 0.1, duration: 0.5 }}
                          className="w-full p-4 border-2 border-dashed border-white/20 rounded-lg hover:border-white/40 hover:bg-white/5 transition-colors flex items-center justify-center space-x-2 text-white/60 hover:text-white/80"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Plus className="w-5 h-5" />
                          <span className="font-medium">Connect More Platforms</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto px-4 py-20 text-center"
            >
              <h2 className="text-3xl font-bold text-white mb-4 capitalize">{activeTab}</h2>
              <p className="text-white/60">Coming soon...</p>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}