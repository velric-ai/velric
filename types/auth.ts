// Auth types
export interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  onboarded: boolean;
  createdAt?: string;
  surveyCompletedAt?: string | null;
  profileComplete?: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
}