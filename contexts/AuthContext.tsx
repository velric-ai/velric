import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, LoginData, SignupData, SignupResponse } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const login = async (data: LoginData): Promise<void> => {
    setIsLoading(true);
    try {
      // Mock login - in real app this would call your API
      const mockUser: User = {
        id: `user_${Date.now()}`,
        email: data.email,
        name: data.email.split('@')[0],
        onboarded: true, // Assume existing users are onboarded
      };

      localStorage.setItem('velric_user', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      throw new Error('Login failed');
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
        }),
      });

      const result = await response.json();

      if (!result.success) {
        // Throw error with the API error message
        const errorMessage = result.error || 'Signup failed';
        throw errorMessage;
      }

      // Map API response to User type
      const user: User = {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        onboarded: result.user.onboarded,
        createdAt: result.user.created_at,
        surveyCompletedAt: result.user.survey_completed_at,
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
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
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