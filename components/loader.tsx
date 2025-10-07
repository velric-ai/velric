"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Loader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let value = 0;
    const interval = setInterval(() => {
      value += 3;
      if (value > 100) {
        clearInterval(interval);
        setLoading(false);
      } else {
        setProgress(value);
      }
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="drop-shadow-[0_0_20px_rgba(168,85,247,0.6)]"
          >
            <Image
              src="/assets/logo.png"
              alt="Velric Logo"
              width={120}
              height={120}
              priority
            />
          </motion.div>

          {/* Brand Name */}
          <motion.h1
            className="mt-6 text-3xl font-bold tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
          >
            VELRIC
          </motion.h1>

          {/* Progress Bar */}
          <div className="mt-8 w-72 h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            />
          </div>

          {/* Percentage */}
          <motion.span
            className="mt-3 text-sm text-gray-400"
            key={progress}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {progress}%
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
