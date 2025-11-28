import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  icon?: React.ReactNode;
  getOptionLabel?: (value: string) => string; // Optional function to get display label from value
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  disabled = false,
  className = "",
  label,
  icon,
  getOptionLabel,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const getDisplayLabel = (val: string) => {
    if (getOptionLabel) {
      return getOptionLabel(val);
    }
    return options.find((opt) => opt === val) || val;
  };

  const selectedLabel = value && value.trim() !== ""
    ? getDisplayLabel(value)
    : placeholder;

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      {label && (
        <label className="block text-sm font-semibold text-white/80 mb-2">
          {label}
        </label>
      )}
      <motion.button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-lg bg-white/5 border transition-all duration-300 flex items-center justify-between ${
          disabled
            ? "opacity-50 cursor-not-allowed border-white/10"
            : isOpen
            ? "border-purple-500 bg-white/10 shadow-lg shadow-purple-500/20 cursor-pointer"
            : "border-white/10 hover:border-white/20 hover:bg-white/10 cursor-pointer"
        }`}
        whileHover={!disabled && !isOpen ? { scale: 1.01 } : {}}
        whileTap={!disabled ? { scale: 0.99 } : {}}
      >
        <div className="flex items-center space-x-2 flex-1 text-left min-w-0">
          {icon && <span className="text-white/70 flex-shrink-0">{icon}</span>}
          <span
            className={`truncate ${
              value && value.trim() !== "" ? "text-white" : "text-white/50"
            }`}
          >
            {selectedLabel}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-white/70 transition-transform duration-300 flex-shrink-0 ml-2 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && !disabled && (
          <>
            <div
              className="fixed inset-0 z-[9998]"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-hidden z-[9999] max-h-60 overflow-y-auto"
              style={{
                background: "rgba(26, 11, 46, 0.95)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
              }}
            >
              {options.length > 0 ? (
                options.map((option, index) => {
                  const isSelected = value === option;
                  return (
                    <motion.button
                      key={option}
                      type="button"
                      onClick={() => {
                        onChange(option);
                        setIsOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors flex items-center justify-between ${
                        isSelected
                          ? "bg-purple-500/20 border-l-2 border-purple-500"
                          : ""
                      }`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                    >
                      <span className="flex-1">{getOptionLabel ? getOptionLabel(option) : option}</span>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500 }}
                        >
                          <Check className="w-4 h-4 text-purple-400" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })
              ) : (
                <div className="px-4 py-3 text-white/60 text-center">
                  No options available
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

