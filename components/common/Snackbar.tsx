import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

export type SnackbarType = "success" | "error" | "info";

interface SnackbarProps {
  message: string | null;
  type?: SnackbarType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number; // Auto-hide duration in milliseconds
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

export default function Snackbar({
  message,
  type = "info",
  isVisible,
  onClose,
  duration = 5000,
  position = "top-right",
}: SnackbarProps) {
  // Auto-hide snackbar after duration
  useEffect(() => {
    if (!isVisible || !message) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [isVisible, message, duration, onClose]);

  if (!isVisible || !message) return null;

  // Get icon and colors based on type
  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return {
          icon: CheckCircle,
          borderColor: "border-green-500/30",
          bgGradient: "from-[#1a0b2e]/95 via-[#16213e]/95 to-[#0f3460]/95",
          shadowColor: "shadow-green-900/40",
          iconBg: "bg-green-500/20",
          iconColor: "text-green-300",
          progressGradient: "from-green-400 via-emerald-400 to-cyan-400",
        };
      case "error":
        return {
          icon: AlertCircle,
          borderColor: "border-red-500/30",
          bgGradient: "from-[#1a0b2e]/95 via-[#16213e]/95 to-[#0f3460]/95",
          shadowColor: "shadow-red-900/40",
          iconBg: "bg-red-500/20",
          iconColor: "text-red-300",
          progressGradient: "from-red-400 via-purple-400 to-cyan-400",
        };
      case "info":
      default:
        return {
          icon: Info,
          borderColor: "border-cyan-500/30",
          bgGradient: "from-[#1a0b2e]/95 via-[#16213e]/95 to-[#0f3460]/95",
          shadowColor: "shadow-cyan-900/40",
          iconBg: "bg-cyan-500/20",
          iconColor: "text-cyan-300",
          progressGradient: "from-cyan-400 via-purple-400 to-pink-400",
        };
    }
  };

  const styles = getTypeStyles();
  const Icon = styles.icon;

  // Get position classes
  const getPositionClasses = () => {
    switch (position) {
      case "top-left":
        return "top-6 left-6";
      case "bottom-right":
        return "bottom-6 right-6";
      case "bottom-left":
        return "bottom-6 left-6";
      case "top-right":
      default:
        return "top-6 right-6";
    }
  };

  return (
    <AnimatePresence>
      {isVisible && message && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`fixed ${getPositionClasses()} z-[60] max-w-sm rounded-2xl border ${styles.borderColor} bg-gradient-to-r ${styles.bgGradient} p-4 shadow-2xl ${styles.shadowColor}`}
        >
          <div className="flex items-center space-x-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles.iconBg} ${styles.iconColor}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">{message}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/50 transition hover:text-white"
              aria-label="Dismiss notification"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: duration / 1000, ease: "linear" }}
            className={`mt-3 h-1 rounded-full bg-gradient-to-r ${styles.progressGradient}`}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

