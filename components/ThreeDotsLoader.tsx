import { motion } from "framer-motion";

interface ThreeDotsLoaderProps {
  className?: string;
  text?: string;
  size?: "sm" | "md" | "lg";
}

export default function ThreeDotsLoader({ 
  className = "", 
  text,
  size = "md" 
}: ThreeDotsLoaderProps) {
  const dotSizes = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4"
  };

  const containerGaps = {
    sm: "gap-1.5",
    md: "gap-2",
    lg: "gap-2.5"
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`flex items-center ${containerGaps[size]}`}>
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className={`${dotSizes[size]} rounded-full bg-cyan-400`}
            animate={{
              y: [0, -8, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      {text && (
        <motion.p
          className="text-white/80 text-sm mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

