import { useState, useEffect } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/router";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'signin' | 'signup';
}

export default function AuthModal({ isOpen, onClose, mode }: AuthModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setPassword("");
      setError("");
      setIsLoading(false);
      setShowPassword(false);
    }
  }, [isOpen, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simple validation
    if (!email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    // Mock authentication
    setTimeout(() => {
      localStorage.setItem("velric_authenticated", "true");
      localStorage.setItem("velric_user", JSON.stringify({
        email,
        name: email.split('@')[0] || "Velric User"
      }));
      onClose();
      router.push("/dashboard");
      setIsLoading(false);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80"
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-purple-500/30 p-8 shadow-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-gray-700"
          aria-label="Close modal"
          title="Close modal"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            {mode === 'signup' ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-gray-400">
            {mode === 'signup' ? "Join Velric to start your journey" : "Sign in to your Velric account"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors pr-12"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading 
              ? (mode === 'signup' ? "Creating Account..." : "Signing In...") 
              : (mode === 'signup' ? "Create Account" : "Sign In")
            }
          </button>
        </form>
      </div>
    </div>
  );
}