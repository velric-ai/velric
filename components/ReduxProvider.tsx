import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store';
import Snackbar from './common/Snackbar';
import { useAppSelector } from '@/store/hooks';
import { useAppDispatch } from '@/store/hooks';
import { hideSnackbar, clearSnackbar } from '@/store/slices/snackbarSlice';
import { useEffect } from 'react';

// Inner component to access Redux state for Snackbar
function SnackbarWrapper() {
  const dispatch = useAppDispatch();
  const { message, type, isVisible } = useAppSelector((state) => state.snackbar);

  // Clear message after animation completes
  useEffect(() => {
    if (!isVisible && message) {
      const timer = setTimeout(() => {
        dispatch(clearSnackbar());
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible, message, dispatch]);

  return (
    <Snackbar
      message={message}
      type={type}
      isVisible={isVisible}
      onClose={() => dispatch(hideSnackbar())}
      duration={5000}
      position="top-right"
    />
  );
}

interface ReduxProviderProps {
  children: ReactNode;
}

export default function ReduxProvider({ children }: ReduxProviderProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
        <SnackbarWrapper />
      </PersistGate>
    </Provider>
  );
}

