import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function AfterSubmit() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      className="flex flex-col items-center justify-center text-center p-8 rounded-2xl 
                 bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] 
                 shadow-[0_0_30px_rgba(0,255,170,0.2)] 
                 max-w-md mx-auto mt-16 antialiased"
    >
      <motion.div
        initial={{ rotate: -10, scale: 0.8, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "backOut" }}
      >
        <CheckCircle className="w-16 h-16 text-[#00ffaa] drop-shadow-[0_0_12px_#00ffaa]" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-3xl font-bold bg-clip-text text-transparent 
                   bg-gradient-to-r from-[#00ffaa] via-[#00e5ff] to-[#a855f7] 
                   mt-4"
      >
        You’re in! 🚀
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="text-gray-400 mt-3 text-lg"
      >
        Thanks for joining the revolution — expect updates soon.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-6"
      >
        <div className="px-5 py-2 rounded-full text-sm font-medium 
                        bg-gradient-to-r from-[#00ffaa]/20 to-[#00e5ff]/20 
                        text-[#00ffaa] 
                        border border-[#00ffaa]/30 
                        shadow-[0_0_15px_rgba(0,255,170,0.3)] 
                        animate-pulse">
          You're officially on the waitlist
        </div>
      </motion.div>
    </motion.div>
  );
}
