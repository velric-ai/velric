import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';

interface GoogleAuthResponse {
  user: any;
  session: any;
}

export const useGoogleAuth = () => {
  const router = useRouter();
  const { signup, login } = useAuth();

  const handleGoogleSignUp = async () => {
    try {
      // Call the Google OAuth callback endpoint
      // Supabase handles the OAuth flow through our callback URL
      const response = await fetch('/api/auth/google-callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'signup' }),
      });

      if (!response.ok) {
        throw new Error('Failed to initiate Google Sign Up');
      }

      // Supabase OAuth redirects are handled via environment config
      // This initiates the OAuth flow
    } catch (error) {
      console.error('Google Sign Up error:', error);
      throw error;
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Similar to signup but for login flow
      const response = await fetch('/api/auth/google-callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'login' }),
      });

      if (!response.ok) {
        throw new Error('Failed to initiate Google Login');
      }
    } catch (error) {
      console.error('Google Login error:', error);
      throw error;
    }
  };

  return {
    handleGoogleSignUp,
    handleGoogleLogin,
  };
};
