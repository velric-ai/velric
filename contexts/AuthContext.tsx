import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, AuthContextType, LoginData, SignupData } from "../types/auth";
import { supabase, USE_DUMMY } from "../lib/supabaseClient";

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
        const userData = localStorage.getItem("velric_user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        localStorage.removeItem("velric_user");
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
        name: data.email.split("@")[0],
        onboarded: true, // Assume existing users are onboarded
      };

      localStorage.setItem("velric_user", JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      throw new Error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: SignupData): Promise<void> => {
    setIsLoading(true);
    try {
      // Mock signup - in real app this would call your API
      const mockUser: User = {
        id: `user_${Date.now()}`,
        email: data.email,
        name: data.name,
        onboarded: false, // New users need onboarding
        createdAt: new Date().toISOString(),
        surveyCompletedAt: null,
        profileComplete: false,
      };

      // If using dummy mode (no Supabase configured), keep existing behaviour
      /*if (USE_DUMMY) {
        localStorage.setItem("velric_user", JSON.stringify(mockUser));
        setUser(mockUser);
        return;
      }*/

      // Attempt to persist the new user to the users table in Supabase
      const insertPayload = {
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        onboarded: mockUser.onboarded,
        created_at: mockUser.createdAt,
        survey_completed_at: mockUser.surveyCompletedAt,
        profile_complete: mockUser.profileComplete,
      } as any;

      try {
        const { data, error } = await supabase
          .from("users")
          .insert(insertPayload)
          .select()
          .single();

        if (error) {
          // If the table doesn't exist or another DB error occurs, fallback to local storage
          const code = (error as any)?.code;
          const message = (error as any)?.message || String(error);
          console.warn(
            "Supabase insert error (falling back to localStorage):",
            code,
            message
          );

          localStorage.setItem("velric_user", JSON.stringify(mockUser));
          setUser(mockUser);
          return;
        }

        // Map DB row to our User shape (Supabase returns snake_case fields)
        const savedUser: User = {
          id: data.id,
          email: data.email,
          name: data.name,
          onboarded: data.onboarded ?? false,
          createdAt: data.created_at ?? mockUser.createdAt,
          surveyCompletedAt: data.survey_completed_at ?? null,
          profileComplete: data.profile_complete ?? false,
        };

        localStorage.setItem("velric_user", JSON.stringify(savedUser));
        setUser(savedUser);
      } catch (dbErr) {
        console.warn(
          "Error inserting user into Supabase, falling back to localStorage:",
          dbErr
        );
        localStorage.setItem("velric_user", JSON.stringify(mockUser));
        setUser(mockUser);
      }
    } catch (error) {
      throw new Error("Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    localStorage.removeItem("velric_user");
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
