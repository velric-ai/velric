import { Code, Database, BarChart3, Target, ChevronRight } from "lucide-react";

interface RecentlyCompletedMissionsProps {
  userData: any;
}

export default function RecentlyCompletedMissions({ userData }: RecentlyCompletedMissionsProps) {
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "backend":
        return <Database size={16} className="text-gray-600" />;
      case "frontend":
        return <Code size={16} className="text-gray-600" />;
      case "analytics":
        return <BarChart3 size={16} className="text-gray-600" />;
      default:
        return <Target size={16} className="text-gray-600" />;
    }
  };

  const getScoreBadgeClass = (score: number) => {
    if (score >= 90) return "score-badge-excellent";
    if (score >= 80) return "score-badge-good";
    if (score >= 70) return "score-badge-average";
    return "score-badge-poor";
  };

  // Mock recent missions data
  const recentMissions = [
    {
      id: 1,
      title: "Build REST API with Authentication",
      category: "Backend",
      date: "2 days ago",
      score: 92
    },
    {
      id: 2,
      title: "React Dashboard Component",
      category: "Frontend", 
      date: "5 days ago",
      score: 88
    },
    {
      id: 3,
      title: "SQL Query Optimization",
      category: "Analytics",
      date: "1 week ago",
      score: 85
    },
    {
      id: 4,
      title: "User Authentication Flow",
      category: "Backend",
      date: "1 week ago",
      score: 90
    },
    {
      id: 5,
      title: "Data Visualization Dashboard",
      category: "Analytics",
      date: "2 weeks ago",
      score: 87
    }
  ];

  return (
    <div className="glass-card floating-card">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold glass-text-primary">Recently Completed Missions</h3>
          <button className="glass-button text-sm font-medium">
            View all
          </button>
        </div>
        
        <div className="space-y-2">
          {recentMissions.map((mission) => (
            <div
              key={mission.id}
              className="mission-card p-3 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="p-2 bg-white/5 rounded-lg backdrop-blur-sm">
                    {getCategoryIcon(mission.category)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium glass-text-primary truncate">
                      {mission.title}
                    </h4>
                    <p className="text-xs glass-text-secondary">
                      {mission.category} • {mission.date}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getScoreBadgeClass(mission.score)}`}>
                    {mission.score}
                  </span>
                  <ChevronRight size={16} className="glass-text-secondary group-hover:glass-text-primary transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}