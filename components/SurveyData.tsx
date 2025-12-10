import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import { 
  User, 
  GraduationCap, 
  Building, 
  Target, 
  Zap, 
  BookOpen,
  Github,
  Code,
  Trophy
} from 'lucide-react';

interface SurveyDataProps {
  surveyData?: {
    fullName?: string;
    educationLevel?: string;
    industry?: string;
    missionFocus?: string[];
    strengthAreas?: string[];
    learningPreference?: string;
    platformConnections?: {
      github?: { connected: boolean; username?: string };
      codesignal?: { connected: boolean; username?: string };
      hackerrank?: { connected: boolean; username?: string };
    };
  };
}

export default function SurveyData({ surveyData }: SurveyDataProps) {
  // Mock survey data if not provided
  const data = surveyData || {
    fullName: "John Doe",
    educationLevel: "Bachelor's Degree",
    industry: "Technology",
    missionFocus: ["Backend Development", "Data Analytics", "AI & Machine Learning"],
    strengthAreas: ["Problem Solving", "Technical Implementation", "System Design"],
    learningPreference: "Hands-on Projects",
    platformConnections: {
      github: { connected: true, username: "johndoe" },
      codesignal: { connected: true, username: "john_doe" },
      hackerrank: { connected: false }
    }
  };

  const surveyItems = [
    {
      icon: User,
      title: "Full Name",
      value: data.fullName,
      color: "cyan"
    },
    {
      icon: GraduationCap,
      title: "Education Level",
      value: data.educationLevel,
      color: "purple"
    },
    {
      icon: Building,
      title: "Industry",
      value: data.industry,
      color: "green"
    },
    {
      icon: Target,
      title: "Mission Focus",
      value: data.missionFocus?.join(", ") || "Not specified",
      color: "orange"
    },
    {
      icon: Zap,
      title: "Strength Areas",
      value: data.strengthAreas?.join(", ") || "Not specified",
      color: "pink"
    },
    {
      icon: BookOpen,
      title: "Learning Preference",
      value: data.learningPreference,
      color: "blue"
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      cyan: "from-cyan-500/20 to-cyan-600/20 border-cyan-500/30 text-cyan-400",
      purple: "from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-400",
      green: "from-green-500/20 to-green-600/20 border-green-500/30 text-green-400",
      orange: "from-orange-500/20 to-orange-600/20 border-orange-500/30 text-orange-400",
      pink: "from-pink-500/20 to-pink-600/20 border-pink-500/30 text-pink-400",
      blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400"
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.cyan;
  };

  return (
    <div className="space-y-6">
      
      {/* Survey Data Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {surveyItems.map((item, index) => {
          const IconComponent = item.icon;
          const colorClasses = getColorClasses(item.color);
          
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <GlassCard className="p-6" glow={item.color as any}>
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses} border`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white/60 uppercase tracking-wide mb-1">
                      {item.title}
                    </h4>
                    <p className="text-white font-medium break-words">
                      {item.value || "Not specified"}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Platform Connections */}
      <div className="mt-8">
        <h4 className="text-xl font-semibold text-white mb-4">Platform Connections</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(data.platformConnections || {}).map(([platform, connection], index) => {
            const platformIcons = {
              github: Github,
              codesignal: Code,
              hackerrank: Trophy
            };
            
            const IconComponent = platformIcons[platform as keyof typeof platformIcons] || Code;
            const isConnected = connection.connected;
            
            return (
              <motion.div
                key={platform}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <GlassCard className="p-4" glow={isConnected ? "green" : "gray"}>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      isConnected 
                        ? "bg-green-500/20 border border-green-500/30 text-green-400" 
                        : "bg-gray-500/20 border border-gray-500/30 text-gray-400"
                    }`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium capitalize">{platform}</p>
                      <p className={`text-xs ${
                        isConnected ? "text-green-400" : "text-gray-400"
                      }`}>
                        {isConnected 
                          ? `@${connection.username || 'connected'}` 
                          : "Not connected"
                        }
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}