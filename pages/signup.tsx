import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Eye, EyeOff, User, Mail, Lock, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { SignupData, ValidationError } from '@/types/auth';
import { validateName, validateEmail, validatePassword } from '@/services/authService';

export default function Signup() {
  const router = useRouter();
  const { signup, isAuthenticated, isLoading: authLoading } = useAuth();

  const [formData, setFormData] = useState<SignupData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // Redirect if already authenticated and onboarded
  useEffect(() => {
    // Only redirect if user is authenticated, auth loading is complete,
    // user is already onboarded, and we're not in the middle of a signup process
    if (isAuthenticated && !authLoading && !isLoading) {
      // Check if user is already onboarded
      const userData = localStorage.getItem('velric_user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          // Only redirect if user is already onboarded (existing user)
          if (user.onboarded === true) {
            router.replace('/user-dashboard');
          }
          // If user is not onboarded, let them stay on signup page
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    }
  }, [isAuthenticated, authLoading, router, isLoading]);

  // Real-time validation
  useEffect(() => {
    const newErrors: { [key: string]: string } = {};

    if (touched.name && formData.name) {
      const nameError = validateName(formData.name);
      if (nameError) newErrors.name = nameError;
    }

    if (touched.email && formData.email) {
      const emailError = validateEmail(formData.email);
      if (emailError) newErrors.email = emailError;
    }

    if (touched.password && formData.password) {
      const passwordError = validatePassword(formData.password);
      if (passwordError) newErrors.password = passwordError;
    }

    if (touched.confirmPassword && formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(prev => ({ ...prev, ...newErrors, general: prev.general }));
  }, [formData, touched]);

  const handleInputChange = (field: keyof SignupData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear field-specific error when user starts typing
    if (errors[field as string]) {
      setErrors((prev: { [key: string]: string }) => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  };

  const handleBlur = (field: string) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    const nameError = validateName(formData.name);
    if (nameError) newErrors.name = nameError;

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    setTouched({ name: true, email: true, password: true, confirmPassword: true });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await signup(formData);
      console.log('✅ Signup successful - storing user data...');
      
      // 🔴 CRITICAL FIX: Store both flags as false for new users
      const newUserData = {
        id: response?.user?.id,
        email: response?.user?.email,
        name: response?.user?.name,
        onboarded: false,              // 🔴 Mark as NOT onboarded
        surveyCompleted: false,        // 🔴 Mark survey as NOT completed
        signupCompletedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      
      // Store with exact key 'velric_user'
      localStorage.setItem('velric_user', JSON.stringify(newUserData));
      console.log('✅ User data stored with both flags as false');
      
      // 🔴 CRITICAL FIX: Clear any existing survey data first
      localStorage.removeItem('velric_survey_draft');
      localStorage.removeItem('velric_survey_state');
      console.log('🧹 Cleared any existing survey data');
      
      // 🔴 CRITICAL FIX: Initialize survey state to Step 1
      const initialSurveyState = {
        currentStep: 1,
        currentStepIndex: 0,
        totalSteps: 8,
        completedSteps: [],
        surveyData: {},
        startedAt: new Date().toISOString()
      };
      localStorage.setItem('velric_survey_state', JSON.stringify(initialSurveyState));
      console.log('✅ Survey state initialized to Step 1');
      
      // Redirect to survey for new users
      console.log('🔄 Redirecting to survey...');
      router.replace('/onboard/survey');
    } catch (error) {
      setErrors({ general: "Signup failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <>
      <Head>
        <title>Sign Up | Velric</title>
        <meta name="description" content="Create your Velric account" />
        <link rel="icon" href="/assets/logo.png" />
      </Head>

      <main className="bg-[#0D0D0D] text-white font-sans antialiased min-h-screen flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/">
              <img
                src="/assets/logo.png"
                alt="Velric Logo"
                className="h-12 mx-auto mb-4 brightness-110"
              />
            </Link>
            <h1 className="text-3xl font-bold mb-2">Join Velric</h1>
            <p className="text-gray-400">Create your account to get started</p>
          </div>

          {/* Signup Form */}
          <div className="bg-[#1C1C1E] p-8 rounded-2xl border border-purple-500/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* General Error */}
              {errors.general && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                  {errors.general}
                </div>
              )}

              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  onBlur={handleBlur('name')}
                  className={`w-full px-4 py-3 bg-[#2A2A2E] border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${errors.name ? 'border-red-500' : 'border-purple-500/20'
                    }`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  onBlur={handleBlur('email')}
                  className={`w-full px-4 py-3 bg-[#2A2A2E] border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${errors.email ? 'border-red-500' : 'border-purple-500/20'
                    }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  onBlur={handleBlur('password')}
                  className={`w-full px-4 py-3 bg-[#2A2A2E] border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${errors.password ? 'border-red-500' : 'border-purple-500/20'
                    }`}
                  placeholder="Create a strong password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Must be 8+ characters with uppercase, lowercase, and number
                </p>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  className={`w-full px-4 py-3 bg-[#2A2A2E] border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${errors.confirmPassword ? 'border-red-500' : 'border-purple-500/20'
                    }`}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#9333EA] to-[#06B6D4] text-white py-3 rounded-xl font-semibold hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Already have an account?{" "}
                <Link href="/login" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
              ← Back to Home
            </Link>
          </div>
        </motion.div>
      </main>
    </>
  );
}