import Head from "next/head";
import { useState } from "react";
import { motion } from "framer-motion";
import DomainPerformance from "@/components/DomainPerformance";
import { ProtectedDashboardRoute } from "../components/auth/ProtectedRoute";
import DashboardNavigation from "@/components/dashboard/DashboardNavigation";

// Mock data for domain performance (same as dashboard)
const mockDomainsData = [
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
];

function AnalyticsContent() {
  const [activeTab, setActiveTab] = useState('analytics');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <>
      <Head>
        <title>Analytics | Velric</title>
        <meta name="description" content="Your Velric analytics - detailed performance insights and domain breakdown" />
        <link rel="icon" href="/assets/logo.png" />
      </Head>

      <div className="min-h-screen text-white" style={{
        background: 'linear-gradient(135deg, #1a0b2e 0%, #16213e 50%, #0f3460 100%)'
      }}>
        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-cyan-500/10 to-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Navigation */}
        <DashboardNavigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
          notificationCount={3}
        />

        {/* Main Content */}
        <div className="relative z-10 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto px-4 py-8"
          >
            {/* Page Title */}
            <div className="mb-8 pt-10">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Analytics
              </h1>
              <p className="text-white/60 text-lg">
                Detailed insights into your performance across all domains
              </p>
            </div>

            {/* Domain Performance Section */}
            <div className="mb-8">
              <DomainPerformance domains={mockDomainsData} />
            </div>

            {/* Future sections */}
            <div className="text-center py-12 border-t border-white/10">
              <h3 className="text-xl font-semibold text-white mb-2">More Analytics Coming Soon</h3>
              <p className="text-white/60">
                We're working on additional analytics features including trend analysis, 
                comparative insights, and detailed performance metrics.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default function AnalyticsPage() {
  return (
    <ProtectedDashboardRoute>
      <AnalyticsContent />
    </ProtectedDashboardRoute>
  );
}