import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const sendResetLink = async () => {
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/resetpassword",
    });
    setSent(true);
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
        transition={{ duration: 0.6 }}
        className="bg-[#1C1C1E] w-full max-w-md p-8 rounded-2xl border border-white/10 shadow-lg relative z-10"
      >

        <h1 className="text-3xl font-bold text-center mb-4">Forgot Password</h1>
        <p className="text-center text-white/60 mb-8">Enter your email to receive a reset link</p>

        {sent ? (
          <p className="text-center text-green-400 font-medium">
            Reset email sent! Check your inbox.
          </p>
        ) : (
          <>
            <input
              className="w-full mb-4 px-4 py-3 rounded-lg bg-[#2A2A2E] border border-white/10 placeholder-white/40 focus:border-purple-500 outline-none"
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={sendResetLink}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-400 py-3 rounded-lg font-semibold hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
            >
              Send Reset Email
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
