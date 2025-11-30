import { useAppDispatch } from '@/store/hooks';
import { showSnackbar, hideSnackbar, SnackbarType } from '@/store/slices/snackbarSlice';

/**
 * Custom hook to replace the old useSnackbar from SnackbarContext
 * Provides the same API for backward compatibility
 */
export const useSnackbar = () => {
  const dispatch = useAppDispatch();

  const show = (message: string, type: SnackbarType = 'info') => {
    dispatch(showSnackbar({ message, type }));
  };

  const hide = () => {
    dispatch(hideSnackbar());
  };

  return {
    showSnackbar: show,
    hideSnackbar: hide,
  };
};

