import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SnackbarType = 'success' | 'error' | 'info';

interface SnackbarState {
  message: string | null;
  type: SnackbarType;
  isVisible: boolean;
}

const initialState: SnackbarState = {
  message: null,
  type: 'info',
  isVisible: false,
};

const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    showSnackbar: (state, action: PayloadAction<{ message: string; type?: SnackbarType }>) => {
      state.message = action.payload.message;
      state.type = action.payload.type || 'info';
      state.isVisible = true;
    },
    hideSnackbar: (state) => {
      state.isVisible = false;
    },
    clearSnackbar: (state) => {
      state.message = null;
    },
  },
});

export const { showSnackbar, hideSnackbar, clearSnackbar } = snackbarSlice.actions;
export default snackbarSlice.reducer;

