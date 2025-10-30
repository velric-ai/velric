import { useState, forwardRef } from "react";
import { motion } from "framer-motion";
import { Check, AlertCircle, Eye, EyeOff } from "lucide-react";

interface FormInputProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'url' | 'tel';
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  error?: string | null;
  required?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  maxLength?: number;
  minLength?: number;
  showCharacterCount?: boolean;
  showPasswordToggle?: boolean;
  className?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(({
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  onKeyDown,
  placeholder,
  error,
  required = false,
  disabled = false,
  autoFocus = false,
  maxLength,
  minLength,
  showCharacterCount = false,
  showPasswordToggle = false,
  className = ''
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;
  const hasError = !!error;
  const hasValue = !!value;
  const isValid = hasValue && !hasError;
  const characterCount = value.length;
  const isNearLimit = maxLength && characterCount > maxLength * 0.8;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    
    // Enforce maxLength
    if (maxLength && newValue.length > maxLength) {
      newValue = newValue.slice(0, maxLength);
    }
    
    onChange(newValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      <label className="block text-sm font-semibold text-white/90 mb-3">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>

      {/* Input Container */}
      <div className="relative">
        <input
          ref={ref}
          type={inputType}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          minLength={minLength}
          className={`w-full px-4 py-4 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 transition-all duration-300 ${
            hasError
              ? 'border-red-500 bg-red-500/5 focus:ring-red-500/50'
              : isFocused
              ? 'border-purple-500 focus:ring-purple-500/50'
              : isValid
              ? 'border-green-500/50 bg-green-500/5'
              : 'border-white/20 hover:border-white/30'
          } ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          } ${
            showPasswordToggle || isValid ? 'pr-12' : 'pr-4'
          }`}
          style={{ fontSize: '16px' }} // Prevents zoom on mobile
        />

        {/* Success Icon */}
        {isValid && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
          >
            <Check className="w-5 h-5 text-green-400" />
          </motion.div>
        )}

        {/* Password Toggle */}
        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {/* Character Count */}
      {showCharacterCount && maxLength && (
        <div className="flex justify-end mt-2">
          <span className={`text-xs ${
            isNearLimit ? 'text-yellow-400' : 'text-white/60'
          }`}>
            {characterCount}/{maxLength}
          </span>
        </div>
      )}

      {/* Error Message */}
      {hasError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-center space-x-2 mt-2"
        >
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-400">{error}</p>
        </motion.div>
      )}

      {/* Focus Ring Animation */}
      {isFocused && !hasError && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="absolute inset-0 rounded-xl border-2 border-purple-500/50 pointer-events-none"
          style={{
            boxShadow: '0 0 0 4px rgba(147, 51, 234, 0.1)'
          }}
        />
      )}
    </div>
  );
});