import React, { createContext, useContext, useState, ReactNode } from 'react';
import Snackbar, { SnackbarType } from '@/components/common/Snackbar';

interface SnackbarContextType {
  showSnackbar: (message: string, type?: SnackbarType) => void;
  hideSnackbar: () => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

interface SnackbarProviderProps {
  children: ReactNode;
}

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ children }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<SnackbarType>('info');
  const [isVisible, setIsVisible] = useState(false);

  const showSnackbar = (newMessage: string, newType: SnackbarType = 'info') => {
    setMessage(newMessage);
    setType(newType);
    setIsVisible(true);
  };

  const hideSnackbar = () => {
    setIsVisible(false);
    // Clear message after animation completes
    setTimeout(() => {
      setMessage(null);
    }, 300);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar }}>
      {children}
      <Snackbar
        message={message}
        type={type}
        isVisible={isVisible}
        onClose={hideSnackbar}
        duration={5000}
        position="top-right"
      />
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = (): SnackbarContextType => {
  const context = useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

