import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, LoginData, SignupData, SignupResponse } from '@/types/auth';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
};

// Check for existing user on initialization
const checkAuthFromStorage = (): User | null => {
  if (typeof window === 'undefined') return null;
  try {
    const userData = localStorage.getItem('velric_user');
    if (userData) {
      return JSON.parse(userData);
    }
  } catch (error) {
    console.error('Error checking auth from storage:', error);
    localStorage.removeItem('velric_user');
  }
  return null;
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (data: LoginData, { rejectWithValue }) => {
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

      if (!response.ok) {
        let errorMessage = 'Network error occurred';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || `Login failed (${response.status})`;
        } catch (parseError) {
          if (response.status === 401) {
            errorMessage = 'Invalid email or password';
          } else if (response.status === 500) {
            errorMessage = 'Server error. Please try again later';
          } else {
            errorMessage = `Login failed (${response.status})`;
          }
        }
        return rejectWithValue(errorMessage);
      }

      const result = await response.json();

      if (!result.success) {
        return rejectWithValue(result.error || 'Login failed. Please try again.');
      }

      // Map backend response to frontend User type
      const authenticatedUser: User = {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        onboarded: result.user.onboarded,
        isRecruiter: Boolean(result.user.is_recruiter),
        createdAt: result.user.created_at,
        surveyCompletedAt: result.user.survey_completed_at,
        profileComplete: result.user.profile_complete,
      };

      // Store in localStorage for backward compatibility
      localStorage.setItem('velric_user', JSON.stringify(authenticatedUser));
      return authenticatedUser;
    } catch (error: any) {
      console.error('Login error:', error);
      return rejectWithValue(error.message || 'An unexpected error occurred. Please try again.');
    }
  }
);

// Async thunk for signup
export const signupUser = createAsyncThunk(
  'auth/signup',
  async (data: SignupData, { rejectWithValue }) => {
    try {
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
        return rejectWithValue(result.error || 'Signup failed');
      }

      // Map API response to User type
      const user: User = {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        onboarded: result.user.onboarded,
        isRecruiter: Boolean(result.user.is_recruiter),
        createdAt: result.user.created_at,
        surveyCompletedAt: result.user.survey_completed_at,
        profileComplete: result.user.profile_complete,
      };

      // Store in localStorage for backward compatibility
      localStorage.setItem('velric_user', JSON.stringify(user));
      return { user, message: result.message };
    } catch (error: any) {
      console.error('Signup error:', error);
      return rejectWithValue(error.message || 'Signup failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Initialize auth state from localStorage
    initializeAuth: (state) => {
      const user = checkAuthFromStorage();
      state.user = user;
      state.isAuthenticated = !!user;
      state.isLoading = false;
    },
    // Logout action - resets all state
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
    },
    // Update user data
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        // Update localStorage for backward compatibility
        if (typeof window !== 'undefined') {
          localStorage.setItem('velric_user', JSON.stringify(state.user));
        }
      }
    },
  },
  extraReducers: (builder) => {
    // Login cases
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });

    // Signup cases
    builder
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(signupUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { initializeAuth, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;

