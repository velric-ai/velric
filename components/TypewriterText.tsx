import { motion } from "framer-motion";

interface TypewriterTextProps {
  text: string;
  className?: string;
}

const TypewriterText = ({ text, className = "" }: TypewriterTextProps) => {
  const words = text.split(" ");

  return (
    <div className={`flex flex-wrap justify-center gap-2 ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ 
            duration: 0.1,
            delay: 0.8 + (i * 0.15) // Start after 0.8s, then 0.15s per word
          }}
          className="text-lg md:text-2xl text-gray-300"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};

export default TypewriterText;