import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { initializeAuth, loginUser, signupUser, logout, updateUser } from '@/store/slices/authSlice';
import { showSnackbar, hideSnackbar } from '@/store/slices/snackbarSlice';
import { LoginData, SignupData, SignupResponse, User } from '@/types/auth';

/**
 * Custom hook to replace the old useAuth from AuthContext
 * Provides the same API for backward compatibility
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading, isAuthenticated } = useAppSelector((state) => state.auth);

  // Initialize auth on mount
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  const login = async (data: LoginData): Promise<User | null> => {
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) {
      return result.payload;
    } else {
      // Show error snackbar
      const errorMessage = result.payload as string;
      dispatch(showSnackbar({ message: errorMessage, type: 'error' }));
      return null;
    }
  };

  const signup = async (data: SignupData): Promise<SignupResponse | null> => {
    const result = await dispatch(signupUser(data));
    if (signupUser.fulfilled.match(result)) {
      return result.payload;
    } else {
      // Show error snackbar instead of throwing
      const errorMessage = result.payload as string || 'Signup failed. Please try again.';
      dispatch(showSnackbar({ message: errorMessage, type: 'error' }));
      return null;
    }
  };

  const handleLogout = (): void => {
    dispatch(logout());
  };

  const handleUpdateUser = (userData: Partial<User>): void => {
    dispatch(updateUser(userData));
  };

  // For backward compatibility with AuthContext snackbar
  const snackbarMessage = useAppSelector((state) => state.snackbar.message);
  const isSnackbarVisible = useAppSelector((state) => state.snackbar.isVisible);
  const handleHideSnackbar = () => {
    dispatch(hideSnackbar());
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout: handleLogout,
    updateUser: handleUpdateUser,
    // Backward compatibility for snackbar
    snackbarMessage,
    isSnackbarVisible,
    hideSnackbar: handleHideSnackbar,
  };
};

