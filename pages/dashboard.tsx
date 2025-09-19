import Head from "next/head";
import Navbar from "@/components/Navbar";
import DashboardSection from "@/components/DashboardSection";
import { motion } from "framer-motion";

// Hardcoded example data matching database schema
const mockMissions = {
  starred: [
    {
      id: "1",
      title: "Build a React Dashboard Component",
      description: "Create a responsive dashboard component with data visualization using React and Chart.js",
      skills: ["React", "JavaScript", "Chart.js", "CSS"],
      industries: ["Frontend Development", "Data Visualization"],
      status: "starred" as const
    },
    {
      id: "2", 
      title: "Design a Mobile-First Landing Page",
      description: "Design and implement a mobile-first landing page for a SaaS product with modern UI/UX principles",
      skills: ["HTML", "CSS", "JavaScript", "Responsive Design"],
      industries: ["Web Design", "UI/UX"],
      status: "starred" as const
    }
  ],
  inProgress: [
    {
      id: "3",
      title: "Create a REST API with Authentication",
      description: "Build a secure REST API with JWT authentication, user management, and CRUD operations",
      skills: ["Node.js", "Express", "JWT", "MongoDB"],
      industries: ["Backend Development", "Security"],
      status: "in_progress" as const,
      started_at: "2024-01-15"
    }
  ],
  completed: [
    {
      id: "4",
      title: "Implement User Authentication System",
      description: "Build a complete user authentication system with login, signup, and password reset functionality",
      skills: ["React", "Node.js", "JWT", "bcrypt"],
      industries: ["Full Stack Development", "Security"],
      status: "completed" as const,
      grade: 87,
      completed_at: "2024-01-10",
      feedback: "Excellent implementation! Great attention to security best practices and clean code structure."
    },
    {
      id: "5",
      title: "Build a Todo App with Local Storage",
      description: "Create a functional todo application with local storage persistence and modern UI",
      skills: ["JavaScript", "HTML", "CSS", "Local Storage"],
      industries: ["Frontend Development"],
      status: "completed" as const,
      grade: 92,
      completed_at: "2024-01-08",
      feedback: "Perfect execution! Clean code and intuitive user interface."
    }
  ],
  suggested: [
    {
      id: "6",
      title: "Develop a Real-time Chat Application",
      description: "Build a real-time chat application using WebSockets with user rooms and message history",
      skills: ["Socket.io", "React", "Node.js", "Express"],
      industries: ["Real-time Applications", "Full Stack Development"],
      status: "suggested" as const
    },
    {
      id: "7",
      title: "Create a Data Visualization Dashboard",
      description: "Design and implement an interactive dashboard with multiple chart types and data filtering",
      skills: ["D3.js", "React", "TypeScript", "Data Analysis"],
      industries: ["Data Visualization", "Frontend Development"],
      status: "suggested" as const
    },
    {
      id: "8",
      title: "Build a E-commerce Product Catalog",
      description: "Develop a product catalog with search, filtering, and shopping cart functionality",
      skills: ["React", "Redux", "API Integration", "Payment Processing"],
      industries: ["E-commerce", "Full Stack Development"],
      status: "suggested" as const
    }
  ]
};

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Dashboard | Velric</title>
        <meta name="description" content="Your mission dashboard - track your progress and discover new challenges" />
        <link rel="icon" href="/assets/logo.png" />
      </Head>

      <main className="bg-[#0D0D0D] text-white font-sans antialiased min-h-screen">
        <Navbar />
        
        {/* Dashboard Header */}
        <div className="pt-24 px-4 md:px-8 lg:px-16 pb-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-[#F5F5F5] bg-clip-text text-transparent">
                Your Mission Dashboard
              </h1>
              <p className="text-lg text-white/80 max-w-2xl mx-auto">
                Track your progress, manage active missions, and discover new challenges tailored to your skills.
              </p>
            </motion.div>

            {/* Stats Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
            >
              <div className="bg-[#1C1C1E] p-6 rounded-2xl text-center">
                <div className="text-2xl font-bold text-[#6A0DAD]">{mockMissions.completed.length}</div>
                <div className="text-sm text-white/70">Completed</div>
              </div>
              <div className="bg-[#1C1C1E] p-6 rounded-2xl text-center">
                <div className="text-2xl font-bold text-[#00D9FF]">{mockMissions.inProgress.length}</div>
                <div className="text-sm text-white/70">In Progress</div>
              </div>
              <div className="bg-[#1C1C1E] p-6 rounded-2xl text-center">
                <div className="text-2xl font-bold text-[#F5F5F5]">{mockMissions.starred.length}</div>
                <div className="text-sm text-white/70">Starred</div>
              </div>
              <div className="bg-[#1C1C1E] p-6 rounded-2xl text-center">
                <div className="text-2xl font-bold text-[#6A0DAD]">
                  {mockMissions.completed.reduce((sum, mission) => sum + (mission.grade || 0), 0) + (mockMissions.completed.length * 10)}
                </div>
                <div className="text-sm text-white/70">Velric Score</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Mission Sections */}
        <div className="px-4 md:px-8 lg:px-16 pb-20">
          <div className="max-w-7xl mx-auto space-y-12">
            
            {/* Starred Missions */}
            <DashboardSection
              title="Starred Missions"
              description="Missions you've saved for later"
              missions={mockMissions.starred}
              emptyMessage="No starred missions yet. Star missions you want to work on later!"
              icon="⭐"
            />

            {/* In Progress Missions */}
            <DashboardSection
              title="In Progress"
              description="Missions you're currently working on"
              missions={mockMissions.inProgress}
              emptyMessage="No active missions. Start a mission to see it here!"
              icon="🚀"
            />

            {/* Completed Missions */}
            <DashboardSection
              title="Completed"
              description="Missions you've successfully finished"
              missions={mockMissions.completed}
              emptyMessage="No completed missions yet. Complete your first mission to see it here!"
              icon="✅"
            />

            {/* Suggested Missions */}
            <DashboardSection
              title="Suggested for You"
              description="AI-recommended missions based on your skills and interests"
              missions={mockMissions.suggested}
              emptyMessage="No suggestions available. Complete your profile to get personalized recommendations!"
              icon="💡"
            />

          </div>
        </div>
      </main>
    </>
  );
}
