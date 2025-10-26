export const mockUserData = {
  id: "user123",
  name: "Brandon West",
  email: "brandon.west@example.com",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  velricScore: 95,
  globalPercentile: 95,
  scoreUpdateDate: "2025-10-15",
  thirtyDayGrowth: 12, // +12%
  profileCompleteness: 85,
  recruiterViews: 24,
  domains: [
    {
      id: "backend",
      name: "Backend",
      score: 92,
      trend: "up" as const,
      trendPercent: 5,
      skills: ["Python", "Node.js", "PostgreSQL", "Redis", "GraphQL"],
      color: "#3b82f6"
    },
    {
      id: "frontend",
      name: "Frontend", 
      score: 88,
      trend: "up" as const,
      trendPercent: 3,
      skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
      color: "#10b981"
    },
    {
      id: "analytics",
      name: "Analytics",
      score: 85,
      trend: "stable" as const,
      trendPercent: 0,
      skills: ["SQL", "Python", "Tableau", "Power BI"],
      color: "#f59e0b"
    },
    {
      id: "strategy",
      name: "Strategy",
      score: 78,
      trend: "down" as const,
      trendPercent: -2,
      skills: ["Product Strategy", "Market Analysis", "Planning"],
      color: "#ef4444"
    },
    {
      id: "mobile",
      name: "Mobile",
      score: 82,
      trend: "up" as const,
      trendPercent: 8,
      skills: ["React Native", "Swift", "Flutter", "iOS"],
      color: "#8b5cf6"
    },
    {
      id: "ai",
      name: "AI/ML",
      score: 90,
      trend: "up" as const,
      trendPercent: 12,
      skills: ["TensorFlow", "PyTorch", "Scikit-learn", "OpenAI"],
      color: "#06b6d4"
    }
  ],
  weeklyActivity: [
    { day: "Mon", active: true },
    { day: "Tue", active: true },
    { day: "Wed", active: false },
    { day: "Thu", active: true },
    { day: "Fri", active: true },
    { day: "Sat", active: false },
    { day: "Sun", active: false }
  ],
  currentStreak: 5,
  linkedAccounts: [
    { platform: "GitHub", connected: true, isPublic: true },
    { platform: "CodeSignal", connected: true, isPublic: false },
    { platform: "HackerRank", connected: false, isPublic: false },
    { platform: "Discord", connected: true, isPublic: true },
    { platform: "LinkedIn", connected: false, isPublic: false }
  ],
  recentActivity: [
    { title: "Completed: Backend Challenge", score: "92/100", daysAgo: 2 },
    { title: "Updated: Portfolio", score: "Profile", daysAgo: 5 },
    { title: "Completed: Frontend Mission", score: "88/100", daysAgo: 7 },
    { title: "Completed: AI Challenge", score: "95/100", daysAgo: 10 }
  ]
};