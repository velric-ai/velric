// pages/email-confirmed.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/authContext';

export default function EmailConfirmed() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    if (!loading) {
      if (user) {
        // User is authenticated, redirect to survey immediately
        router.push('/survey');
      } else {
        // User is not authenticated yet, wait a bit and check again
        const timer = setTimeout(() => {
          setCheckingAuth(false);
        }, 3000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [user, loading, router]);

  const handleGoToSurvey = () => {
    if (user) {
      router.push('/survey');
    } else {
      // If still not authenticated, try to refresh auth state
      window.location.reload();
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-black text-white pt-20">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-md mx-auto px-6 py-12 text-center">
          <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-8 mb-6">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold text-blue-400 mb-2">Completing Verification</h2>
            <p className="text-gray-300">Setting up your account...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-md mx-auto px-6 py-12 text-center">
        <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-8 mb-6">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-green-400 mb-2">Email Confirmed!</h2>
          <p className="text-gray-300 mb-6">
            Your email has been successfully verified. You're all set to start the survey!
          </p>
          
          <button
            onClick={handleGoToSurvey}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300"
          >
            Start Survey
          </button>
        </div>

        <div className="text-sm text-gray-400">
          <p>Having issues? </p>
          <button
            onClick={() => window.location.reload()}
            className="text-purple-400 hover:text-purple-300 font-semibold mt-2"
          >
            Refresh page
          </button>
        </div>
      </div>
    </div>
  );
}