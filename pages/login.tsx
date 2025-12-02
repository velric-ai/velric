import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";

export default function Login() {
  const router = useRouter();
  const { login, isLoading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    // Basic validation - errors will be shown in snackbar via AuthContext
    if (!formData.email || !formData.email.includes("@")) {
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      return false;
    }
    return true;
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Don't specify a fixed redirect - let the callback handler decide where to send user
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('Google login error:', error);
      // Error will be handled by snackbar in AuthContext if needed
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Validation errors will be handled by form's required attributes
      // For better UX, we could show snackbar for validation errors too
      return;
    }

    setIsLoading(true);

    // Call login - it won't throw, will return null on error and show snackbar
    const authenticatedUser = await login({
      email: formData.email,
      password: formData.password,
    });

    // Only redirect if login was successful (user is not null)
    if (authenticatedUser) {
      if (authenticatedUser.isRecruiter) {
        router.push("/recruiter-dashboard");
      } else {
        router.push("/user-dashboard");
      }
    }
    // If login failed, error is already shown in snackbar via AuthContext
    // No need to handle error here - just reset loading state
    
    setIsLoading(false);
  };

  return (
    <>
      <Head>
        <title>Login | Velric</title>
        <meta name="description" content="Login to your Velric account" />
        <link rel="icon" href="/assets/logo.png" />
      </Head>

      <main className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center px-4">
        {/* Background decorative elements */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <img
                src="/assets/logo.png"
                alt="Velric"
                className="h-12 mx-auto"
              />
            </Link>
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-white/70">Sign in to your Velric account</p>
          </div>

          {/* Login Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-[#1C1C1E] rounded-2xl p-8 border border-white/10"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-[#2A2A2E] border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none transition-colors text-white placeholder-white/40"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-12 py-3 bg-[#2A2A2E] border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none transition-colors text-white placeholder-white/40"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <Link
                  href="/forgotpassword"
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || authLoading}
                className="w-full bg-gradient-to-r from-[#9333EA] to-[#06B6D4] text-white py-3 rounded-lg font-semibold hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading || authLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center space-x-4">
                <div className="flex-1 h-px bg-white/10"></div>
                <span className="text-xs text-white/50 px-2">OR</span>
                <div className="flex-1 h-px bg-white/10"></div>
              </div>

              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading || authLoading}
                className="w-full flex items-center justify-center space-x-2 bg-white text-[#0D0D0D] py-3 rounded-lg font-semibold hover:bg-white/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Sign in with Google</span>
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-white/70">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </motion.div>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <Link
              href="/"
              className="text-white/60 hover:text-white/80 transition-colors text-sm"
            >
              ← Back to Home
            </Link>
          </div>
        </motion.div>
      </main>
    </>
  );
}

