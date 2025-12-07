import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);

  const updatePassword = async () => {
    await supabase.auth.updateUser({ password });
    setDone(true);
  };

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center px-4 relative">

      {/* Blurred Color Blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#1C1C1E] w-full max-w-md p-8 rounded-2xl border border-white/10 shadow-lg relative z-10"
      >

        <h1 className="text-3xl font-bold text-center mb-4">Reset Password</h1>
        <p className="text-center text-white/60 mb-8">Enter a new password for your account</p>

        {done ? (
          <p className="text-center text-green-400 font-medium text-lg">
            Password successfully updated!
          </p>
        ) : (
          <>
            <input
              className="w-full mb-4 px-4 py-3 rounded-lg bg-[#2A2A2E] border border-white/10 placeholder-white/40 focus:border-purple-500 outline-none"
              type="password"
              placeholder="Enter new password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={updatePassword}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-400 py-3 rounded-lg font-semibold hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
            >
              Update Password
            </button>
          </>
        )}

        <p className="text-center text-sm mt-6 text-white/70">
          Back to{" "}
          <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">
            Login
          </Link>
        </p>

      </motion.div>
    </main>
  );
}
