// Auth types
export interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  isRecruiter: boolean;
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
  isRecruiter?: boolean;
  createdAt?: string;
  surveyCompletedAt?: string | null;
  surveyCompleted?: boolean; // Derived from surveyCompletedAt !== null
  hasSurveyResponse?: boolean; // Derived from checking survey_responses table
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

export interface SignupResponse {
  user: User;
  message?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<User | null>;
  signup: (data: SignupData) => Promise<SignupResponse>;
  logout: () => void;
  googleSignIn: () => Promise<void>;
  googleSignUp: () => Promise<void>;
  snackbarMessage: string | null;
  isSnackbarVisible: boolean;
  hideSnackbar: () => void;
}