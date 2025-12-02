import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, AuthContextType, LoginData, SignupData, SignupResponse } from '../types/auth';
import { supabase } from '@/lib/supabaseClient';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);

  // Check for existing user on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const userData = localStorage.getItem('velric_user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('velric_user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (data: LoginData): Promise<User | null> => {
    setIsLoading(true);
    setIsSnackbarVisible(false);
    setSnackbarMessage(null);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      // Handle network errors or non-OK responses
      if (!response.ok) {
        let errorMessage = 'Network error occurred';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || `Login failed (${response.status})`;
        } catch (parseError) {
          // If JSON parsing fails, use status-based message
          if (response.status === 401) {
            errorMessage = 'Invalid email or password';
          } else if (response.status === 500) {
            errorMessage = 'Server error. Please try again later';
          } else {
            errorMessage = `Login failed (${response.status})`;
          }
        }
        setSnackbarMessage(errorMessage);
        setIsSnackbarVisible(true);
        return null; // Return null instead of throwing
      }

      const result = await response.json();

      // Handle API-level errors
      if (!result.success) {
        const errorMessage = result.error || 'Login failed. Please try again.';
        setSnackbarMessage(errorMessage);
        setIsSnackbarVisible(true);
        return null; // Return null instead of throwing
      }

      // Map backend response (is_recruiter) to frontend (isRecruiter)
      const authenticatedUser: User = {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        onboarded: result.user.onboarded,
        isRecruiter: Boolean(result.user.is_recruiter), // Use is_recruiter from backend
        createdAt: result.user.created_at,
        surveyCompletedAt: result.user.survey_completed_at,
        surveyCompleted: result.user.survey_completed_at !== null, // Set based on timestamp
        profileComplete: result.user.profile_complete,
      };

      localStorage.setItem('velric_user', JSON.stringify(authenticatedUser));
      setUser(authenticatedUser);
      return authenticatedUser;
    } catch (error: any) {
      // Handle unexpected errors (network failures, etc.)
      console.error('Login error:', error);
      const errorMessage = error.message || 'An unexpected error occurred. Please try again.';
      setSnackbarMessage(errorMessage);
      setIsSnackbarVisible(true);
      return null; // Return null instead of throwing
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: SignupData): Promise<SignupResponse> => {
    setIsLoading(true);
    try {
      // Call the signup API endpoint
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          isRecruiter: data.isRecruiter,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        // Throw error with the API error message
        const errorMessage = result.error || 'Signup failed';
        throw errorMessage;
      }

      // Map API response to User type (same structure as login)
      // Use is_recruiter from backend response
      const user: User = {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        onboarded: result.user.onboarded,
        isRecruiter: Boolean(result.user.is_recruiter), // Use is_recruiter from backend
        createdAt: result.user.created_at,
        surveyCompletedAt: result.user.survey_completed_at,
        surveyCompleted: result.user.survey_completed_at !== null, // Set based on timestamp
        profileComplete: result.user.profile_complete,
      };

      // Store user in localStorage
      localStorage.setItem('velric_user', JSON.stringify(user));
      setUser(user);

      return {
        user,
        message: result.message,
      };
    } catch (error: any) {
      console.error('Signup error:', error);
      // Preserve the original error message if it exists
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    localStorage.removeItem('velric_user');
    setUser(null);
    setIsSnackbarVisible(false);
    setSnackbarMessage(null);
  };

  const googleSignIn = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback?redirect=/user-dashboard`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('Google sign in error:', error);
      setSnackbarMessage(error.message || 'Failed to sign in with Google');
      setIsSnackbarVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const googleSignUp = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback?redirect=/onboard/survey`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('Google sign up error:', error);
      setSnackbarMessage(error.message || 'Failed to sign up with Google');
      setIsSnackbarVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const hideSnackbar = (): void => {
    setIsSnackbarVisible(false);
    setSnackbarMessage(null);
  };

  // Auto-hide snackbar after 5 seconds
  useEffect(() => {
    if (!isSnackbarVisible) return;
    const timer = setTimeout(() => {
      hideSnackbar();
    }, 5000);
    return () => clearTimeout(timer);
  }, [isSnackbarVisible]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    googleSignIn,
    googleSignUp,
    snackbarMessage,
    isSnackbarVisible,
    hideSnackbar,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {isSnackbarVisible && snackbarMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-24 right-6 z-[60] max-w-sm rounded-2xl border border-red-500/30 bg-gradient-to-r from-[#1a0b2e]/95 via-[#16213e]/95 to-[#0f3460]/95 p-4 shadow-2xl shadow-red-900/40"
          >
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/20 text-red-300">
                !
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{snackbarMessage}</p>
              </div>
              <button
                onClick={hideSnackbar}
                className="text-white/50 transition hover:text-white"
                aria-label="Dismiss error"
              >
                &times;
              </button>
            </div>
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 5, ease: "linear" }}
              className="mt-3 h-1 rounded-full bg-gradient-to-r from-red-400 via-purple-400 to-cyan-400"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};