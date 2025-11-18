import Head from "next/head";
import { motion } from "framer-motion";
import { Briefcase, Plus } from "lucide-react";
import { ProtectedDashboardRoute } from "@/components/auth/ProtectedRoute";
import RecruiterNavbar from "@/components/recruiter/RecruiterNavbar";

function JobsPageContent() {
  return (
    <>
      <Head>
        <title>Job Posts | Velric Recruiter</title>
        <meta
          name="description"
          content="Manage your job posts and listings"
        />
      </Head>

      <div
        className="min-h-screen text-white"
        style={{
          background:
            "linear-gradient(135deg, #1a0b2e 0%, #16213e 50%, #0f3460 100%)",
        }}
      >
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-16 left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-32 w-[32rem] h-[32rem] bg-cyan-500/10 rounded-full blur-3xl" />
        </div>

        <RecruiterNavbar activeTab="jobs" />

        <main className="relative z-10 pt-16">
          <div className="max-w-7xl mx-auto px-6 py-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold mb-2">Job Posts</h1>
              <p className="text-white/60">
                Create, edit, and track the performance of your job listings
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl text-center"
            >
              <Briefcase className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
              <h2 className="text-2xl font-semibold mb-2">No Job Posts Yet</h2>
              <p className="text-white/60 mb-6">
                Create your first job post to start attracting top talent
              </p>
              <motion.button
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold flex items-center space-x-2 mx-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-5 h-5" />
                <span>Create Job Post</span>
              </motion.button>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
}

export default function JobsPage() {
  return (
    <ProtectedDashboardRoute>
      <JobsPageContent />
    </ProtectedDashboardRoute>
  );
}

