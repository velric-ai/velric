import Head from "next/head";
import { motion } from "framer-motion";
import { Settings as SettingsIcon } from "lucide-react";
import { ProtectedDashboardRoute } from "@/components/auth/ProtectedRoute";
import RecruiterNavbar from "@/components/recruiter/RecruiterNavbar";

function SettingsPageContent() {
  return (
    <>
      <Head>
        <title>Settings | Velric Recruiter</title>
        <meta
          name="description"
          content="Manage your recruiter account settings"
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

        <RecruiterNavbar activeTab="settings" />

        <main className="relative z-10 pt-16">
          <div className="max-w-7xl mx-auto px-6 py-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold mb-2">Settings</h1>
              <p className="text-white/60">
                Manage your recruiter account and preferences
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl text-center"
            >
              <SettingsIcon className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
              <h2 className="text-2xl font-semibold mb-2">Settings</h2>
              <p className="text-white/60">
                Settings functionality coming soon
              </p>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
}

export default function SettingsPage() {
  return (
    <ProtectedDashboardRoute>
      <SettingsPageContent />
    </ProtectedDashboardRoute>
  );
}

