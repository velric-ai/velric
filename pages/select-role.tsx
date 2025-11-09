import Head from "next/head";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { User, Briefcase } from "lucide-react";
import { ProtectedDashboardRoute } from "../components/auth/ProtectedRoute"; // Assuming correct path

function SelectRoleContent() {
  const router = useRouter();

  const handleRoleSelection = (role: "professional" | "recruiter") => {
    // 1. Retrieve current user data
    const userDataString = localStorage.getItem("velric_user");
    let userData = userDataString ? JSON.parse(userDataString) : {};

    // 2. Save the selected role to user data for persistence
    userData.role = role;
    localStorage.setItem("velric_user", JSON.stringify(userData));

    // 3. Redirect based on role
    if (role === "professional") {
      router.push("/user-dashboard");
    } else {
      router.push("/recruiter-dashboard");
    }
  };

  return (
    <>
      <Head>
        <title>Select Role | Velric</title>
        <meta
          name="description"
          content="Select your user type: Professional or Recruiter"
        />
        <link rel="icon" href="/assets/logo.png" />
      </Head>

      <main
        className="min-h-screen text-white flex items-center justify-center px-4"
        style={{
          background:
            "linear-gradient(135deg, #1a0b2e 0%, #16213e 50%, #0f3460 100%)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-xl p-8 rounded-3xl text-center relative z-10"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(15px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
          }}
        >
          <img
            src="/assets/logo.png"
            alt="Velric"
            className="h-10 mx-auto mb-6 brightness-110"
          />
          <h1 className="text-3xl font-bold mb-4">
            How do you want to use Velric?
          </h1>
          <p className="text-white/70 mb-8">
            Please select your account type to continue to the correct
            dashboard.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Professional Card */}
            <motion.button
              onClick={() => handleRoleSelection("professional")}
              className="p-6 rounded-2xl border-2 border-transparent transition-all duration-300 flex flex-col items-center justify-center text-left space-y-3"
              whileHover={{
                scale: 1.05,
                borderColor: "#06B6D4",
                backgroundColor: "rgba(6, 182, 212, 0.1)",
              }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
              }}
            >
              <User className="w-8 h-8 text-cyan-400" />
              <h2 className="text-xl font-semibold text-white">
                I'm a Professional
              </h2>
              <p className="text-white/60 text-sm">
                Track your score, complete missions, and get hired.
              </p>
              <div className="mt-2 text-cyan-400 font-medium">
                Go to User Dashboard →
              </div>
            </motion.button>

            {/* Recruiter Card */}
            <motion.button
              onClick={() => handleRoleSelection("recruiter")}
              className="p-6 rounded-2xl border-2 border-transparent transition-all duration-300 flex flex-col items-center justify-center text-left space-y-3"
              whileHover={{
                scale: 1.05,
                borderColor: "#9333EA",
                backgroundColor: "rgba(147, 51, 234, 0.1)",
              }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
              }}
            >
              <Briefcase className="w-8 h-8 text-purple-400" />
              <h2 className="text-xl font-semibold text-white">
                I'm a Recruiter
              </h2>
              <p className="text-white/60 text-sm">
                Find top talent, post jobs, and manage pipelines.
              </p>
              <div className="mt-2 text-purple-400 font-medium">
                Go to Recruiter Dashboard →
              </div>
            </motion.button>
          </div>
        </motion.div>
      </main>
    </>
  );
}

export default function SelectRole() {
  return (
    <ProtectedDashboardRoute>
      <SelectRoleContent />
    </ProtectedDashboardRoute>
  );
}
