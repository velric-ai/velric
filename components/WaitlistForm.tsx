import { useState, useRef, useEffect } from "react";
import AfterSubmit from "./AfterSubmit";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Briefcase, Check, Sparkles, ChevronDown } from "lucide-react";

type FormData = {
  name: string;
  email: string;
  interest: string;
};

type ValidationState = {
  name: boolean;
  email: boolean;
  interest: boolean;
};

export default function WaitlistForm() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    interest: "",
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [validation, setValidation] = useState<ValidationState>({
    name: false,
    email: false,
    interest: false,
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const interests = [
    { value: "ai", label: "AI & Machine Learning", icon: "🤖" },
    { value: "engineering", label: "Software Engineering", icon: "💻" },
    { value: "design", label: "Product & UX Design", icon: "🎨" },
    { value: "data", label: "Data Science & Analytics", icon: "📊" },
    { value: "marketing", label: "Marketing & Growth", icon: "📈" },
    { value: "strategy", label: "Business Strategy", icon: "🎯" },
    { value: "product", label: "Product Management", icon: "🚀" },
    { value: "founder", label: "Founders & Startups", icon: "💡" },
    { value: "investing", label: "VC & Investing", icon: "💰" },
    { value: "operations", label: "Operations & Systems", icon: "⚙️" },
    { value: "writing", label: "Content & Technical Writing", icon: "✍️" },
    { value: "education", label: "Learning & EdTech", icon: "📚" },
    { value: "other", label: "Other", icon: "🔮" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
    
    // Real-time validation
    const newValidation = { ...validation };
    switch (name) {
      case 'name':
        newValidation.name = value.trim().length >= 2;
        break;
      case 'email':
        newValidation.email = validateEmail(value);
        break;
      case 'interest':
        newValidation.interest = value !== '';
        break;
    }
    setValidation(newValidation);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const scriptURL = "https://script.google.com/macros/s/AKfycbyrY4MO68paGjqI3UWRgeHt9jLA-xNk4AMlbDutnnUBg8Bwq0V4s-kk_QgJf-_sc9H-qQ/exec";

    try {
      await fetch(scriptURL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(formData).toString(),
      });

      setTimeout(() => {
        setIsLoading(false);
        setSubmitted(true);
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      console.error("Error!", error);
    }
  };

  const selectedInterest = interests.find(i => i.value === formData.interest);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      {/* Glassmorphism Container */}
      <div className="relative bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-8 max-w-xl mx-auto shadow-2xl">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-3xl blur-xl"></div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${20 + (i % 3) * 30}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5
              }}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Check className="w-10 h-10 text-white" />
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl font-bold text-white mb-2"
                >
                  You&apos;re In! 🎉
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-gray-300"
                >
                  Expect updates soon. We&apos;ll be in touch!
                </motion.p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Name Field */}
                <div className="relative">
                  <motion.div
                    className={`relative border-2 rounded-2xl transition-all duration-300 ${
                      focusedField === 'name' 
                        ? 'border-purple-400 shadow-lg shadow-purple-500/25' 
                        : 'border-gray-600/50'
                    }`}
                    whileFocus={{ scale: 1.02 }}
                  >
                    <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                      focusedField === 'name' ? 'text-purple-400' : 'text-gray-400'
                    }`} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full pl-12 pr-12 py-4 bg-black/50 backdrop-blur-sm text-white placeholder-gray-400 rounded-2xl focus:outline-none transition-all duration-300"
                      placeholder="First Name"
                      required
                    />
                    {validation.name && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2"
                      >
                        <Check className="w-5 h-5 text-green-400" />
                      </motion.div>
                    )}
                  </motion.div>
                  <AnimatePresence>
                    {focusedField === 'name' && (
                      <motion.label
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute -top-3 left-4 bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent text-sm font-medium px-2"
                      >
                        First Name
                      </motion.label>
                    )}
                  </AnimatePresence>
                </div>

                {/* Email Field */}
                <div className="relative">
                  <motion.div
                    className={`relative border-2 rounded-2xl transition-all duration-300 ${
                      focusedField === 'email' 
                        ? 'border-purple-400 shadow-lg shadow-purple-500/25' 
                        : 'border-gray-600/50'
                    }`}
                    whileFocus={{ scale: 1.02 }}
                  >
                    <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                      focusedField === 'email' ? 'text-purple-400' : 'text-gray-400'
                    }`} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full pl-12 pr-12 py-4 bg-black/50 backdrop-blur-sm text-white placeholder-gray-400 rounded-2xl focus:outline-none transition-all duration-300"
                      placeholder="Email Address"
                      required
                    />
                    {validation.email && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2"
                      >
                        <Check className="w-5 h-5 text-green-400" />
                      </motion.div>
                    )}
                  </motion.div>
                  <AnimatePresence>
                    {focusedField === 'email' && (
                      <motion.label
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute -top-3 left-4 bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent text-sm font-medium px-2"
                      >
                        Email Address
                      </motion.label>
                    )}
                  </AnimatePresence>
                </div>

                {/* Custom Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <motion.div
                    className={`relative border-2 rounded-2xl transition-all duration-300 cursor-pointer ${
                      dropdownOpen 
                        ? 'border-purple-400 shadow-lg shadow-purple-500/25' 
                        : 'border-gray-600/50'
                    }`}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    whileHover={{ scale: 1.01 }}
                  >
                    <Briefcase className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                      dropdownOpen ? 'text-purple-400' : 'text-gray-400'
                    }`} />
                    <div className="w-full pl-12 pr-12 py-4 bg-black/50 backdrop-blur-sm text-white rounded-2xl flex items-center justify-between">
                      <span className={selectedInterest ? 'text-white' : 'text-gray-400'}>
                        {selectedInterest ? (
                          <span className="flex items-center gap-2">
                            <span>{selectedInterest.icon}</span>
                            {selectedInterest.label}
                          </span>
                        ) : 'Area of Interest'}
                      </span>
                      <motion.div
                        animate={{ rotate: dropdownOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-5 h-5" />
                      </motion.div>
                    </div>
                    {validation.interest && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute right-12 top-1/2 transform -translate-y-1/2"
                      >
                        <Check className="w-5 h-5 text-green-400" />
                      </motion.div>
                    )}
                  </motion.div>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full mt-2 w-full bg-black/90 backdrop-blur-xl border border-purple-500/20 rounded-2xl shadow-2xl z-50 max-h-60 overflow-y-auto"
                      >
                        {interests.map((interest, index) => (
                          <motion.div
                            key={interest.value}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => {
                              handleChange('interest', interest.value);
                              setDropdownOpen(false);
                            }}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-purple-500/20 cursor-pointer transition-colors duration-200 first:rounded-t-2xl last:rounded-b-2xl"
                          >
                            <span className="text-lg">{interest.icon}</span>
                            <span className="text-white">{interest.label}</span>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.label
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute -top-3 left-4 bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent text-sm font-medium px-2"
                      >
                        Area of Interest
                      </motion.label>
                    )}
                  </AnimatePresence>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading || !validation.name || !validation.email || !validation.interest}
                  className="w-full relative overflow-hidden bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(147, 51, 234, 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center gap-2"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                        <span>Joining...</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="submit"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center gap-2"
                      >
                        <Sparkles className="w-5 h-5" />
                        <span>Join the Waitlist</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Ripple Effect */}
                  <motion.div
                    className="absolute inset-0 bg-white/20 rounded-2xl"
                    initial={{ scale: 0, opacity: 0 }}
                    whileTap={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </motion.div>
  );
}
