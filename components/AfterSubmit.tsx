import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function AfterSubmit() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center justify-center text-center p-6 bg-white shadow-xl rounded-2xl max-w-sm mx-auto mt-10"
    >
      <CheckCircle className="text-green-500 w-12 h-12 mb-3" />
      <h2 className="text-2xl font-semibold text-gray-800">You're in! 🎉</h2>
      <p className="text-gray-600 mt-2 text-lg">
        Thanks for joining us — expect exciting updates soon.
      </p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-5"
      >
        <div className="animate-pulse bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
          You’re officially on the waitlist
        </div>
      </motion.div>
    </motion.div>
  );
}
