import Head from "next/head";
import { useState } from "react";
import DashboardNavigation from "@/components/dashboard/DashboardNavigation";
import DashboardLayout, { DashboardGrid, DashboardColumn } from "@/components/dashboard/DashboardLayout";
import VelricScoreCard from "@/components/dashboard/VelricScoreCard";
import WeeklyActivityCard from "@/components/dashboard/WeeklyActivityCard";
import DomainBreakdownGrid from "@/components/dashboard/DomainBreakdownGrid";
import QuickStatsPanel from "@/components/dashboard/QuickStatsPanel";
import ConnectedPlatformsSection from "@/components/dashboard/ConnectedPlatformsSection";

// Mock data for the glassmorphic dashboard
const mockDashboardData = {
  user: {
    velricScore: 95,
    percentile: 95,
    lastUpdated: "2025-10-14"
  },
  weeklyActivity: [
    { day: 'Mon', active: true, score: 92 },
    { day: 'Tue', active: true, score: 88 },
    { day: 'Wed', active: false },
    { day: 'Thu', active: true, score: 95 },
    { day: 'Fri', active: true, score: 87 },
    { day: 'Sat', active: false },
    { day: 'Sun', active: false }
  ],
  streakCount: 5,
  recentActivities: [
    { name: "Completed: Backend Challenge", score: 92, timeAgo: "2 days ago" },
    { name: "Updated: Portfolio", score: 0, timeAgo: "3 days ago" },
    { name: "Completed: Frontend Mission", score: 88, timeAgo: "5 days ago" }
  ],
  domains: [
    {
      name: "Backend Development",
      score: 92,
      change: 5,
      skills: ["Python", "Node.js", "PostgreSQL"],
      color: "pink" as const,
      indicatorColor: "pink" as const
    },
    {
      name: "Frontend Development",
      score: 88,
      change: 3,
      skills: ["React", "TypeScript", "Tailwind CSS"],
      color: "cyan" as const,
      indicatorColor: "cyan" as const
    },
    {
      name: "Data Analytics",
      score: 85,
      change: 0,
      skills: ["SQL", "Python", "Tableau"],
      color: "green" as const,
      indicatorColor: "cyan" as const
    },
    {
      name: "DevOps & Infrastructure",
      score: 78,
      change: -2,
      skills: ["Docker", "AWS", "Kubernetes"],
      color: "orange" as const,
      indicatorColor: "orange" as const
    },
    {
      name: "Mobile Development",
      score: 82,
      change: 8,
      skills: ["React Native", "Swift", "Flutter"],
      color: "blue" as const,
      indicatorColor: "cyan" as const
    },
    {
      name: "AI & Machine Learning",
      score: 90,
      change: 12,
      skills: ["TensorFlow", "PyTorch", "Scikit-learn"],
      color: "purple" as const,
      indicatorColor: "green" as const
    }
  ],
  quickStats: [
    {
      title: "30-Day Score Growth",
      value: "+12%",
      subtitle: "30-Day Score Growth",
      icon: "chart" as const,
      gradient: ["green", "teal"]
    },
    {
      title: "Profile Completeness",
      value: "85%",
      subtitle: "Profile Completeness",
      subtext: "Add 3 more details",
      icon: "user" as const,
      gradient: ["blue", "cyan"]
    },
    {
      title: "Profile Views",
      value: "24",
      subtitle: "Profile Views This Month",
      icon: "eye" as const,
      gradient: ["purple", "blue"]
    }
  ],
  platforms: [
    {
      name: "GitHub",
      icon: "github" as const,
      connected: true,
      status: "public" as const,
      onConnect: () => console.log("Connect GitHub"),
      onDisconnect: () => console.log("Disconnect GitHub")
    },
    {
      name: "CodeSignal",
      icon: "codesignal" as const,
      connected: true,
      status: "private" as const,
      onConnect: () => console.log("Connect CodeSignal"),
      onDisconnect: () => console.log("Disconnect CodeSignal")
    },
    {
      name: "HackerRank",
      icon: "hackerrank" as const,
      connected: false,
      status: null,
      onConnect: () => console.log("Connect HackerRank"),
      onDisconnect: () => console.log("Disconnect HackerRank")
    },
    {
      name: "Discord",
      icon: "discord" as const,
      connected: true,
      status: "public" as const,
      onConnect: () => console.log("Connect Discord"),
      onDisconnect: () => console.log("Disconnect Discord")
    },
    {
      name: "LinkedIn",
      icon: "linkedin" as const,
      connected: false,
      status: null,
      onConnect: () => console.log("Connect LinkedIn"),
      onDisconnect: () => console.log("Disconnect LinkedIn")
    }
  ]
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleViewScoreBreakdown = () => {
    console.log('View score breakdown');
  };

  const handleConnectMorePlatforms = () => {
    console.log('Connect more platforms');
  };

  return (
    <>
      <Head>
        <title>Dashboard | Velric</title>
        <meta name="description" content="Your Velric dashboard - track your progress and performance" />
        <link rel="icon" href="/assets/logo.png" />
      </Head>

      <DashboardLayout>
        <DashboardNavigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
          notificationCount={3}
        />

        {activeTab === 'dashboard' ? (
          <DashboardGrid>
            {/* Left Column */}
            <DashboardColumn span={5}>
              <VelricScoreCard
                score={mockDashboardData.user.velricScore}
                percentile={mockDashboardData.user.percentile}
                lastUpdated={mockDashboardData.user.lastUpdated}
                onViewBreakdown={handleViewScoreBreakdown}
              />
              <WeeklyActivityCard
                weeklyData={mockDashboardData.weeklyActivity}
                streakCount={mockDashboardData.streakCount}
                recentActivities={mockDashboardData.recentActivities}
              />
            </DashboardColumn>

            {/* Right Column */}
            <DashboardColumn span={7}>
              <DomainBreakdownGrid domains={mockDashboardData.domains} />
              <QuickStatsPanel stats={mockDashboardData.quickStats} />
              <ConnectedPlatformsSection
                platforms={mockDashboardData.platforms}
                onConnectMore={handleConnectMorePlatforms}
              />
            </DashboardColumn>
          </DashboardGrid>
        ) : (
          <DashboardGrid>
            <DashboardColumn span={12}>
              <div className="text-center py-20">
                <h2 className="text-3xl font-bold text-white mb-4">{activeTab}</h2>
                <p className="text-white/60">Coming soon...</p>
              </div>
            </DashboardColumn>
          </DashboardGrid>
        )}
      </DashboardLayout>
    </>
  );
}
