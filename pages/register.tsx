// pages/register.tsx
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      // First, check if user already exists by trying to sign in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: 'dummy_password_to_check_user' // Use a dummy password to check if user exists
      });

      // If no error, that means the user exists (but password is wrong)
      if (!signInError) {
        setError('This email is already registered. Please login instead.');
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
        setLoading(false);
        return;
      }

      // If the error is about invalid credentials, that means the user exists but we used wrong password
      if (signInError && signInError.message.includes('Invalid login credentials')) {
        setError('This email is already registered. Please login instead.');
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
        setLoading(false);
        return;
      }

      // If we get here, the user doesn't exist, so proceed with registration
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        setSuccess(true);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      // Check for specific Supabase errors
      if (error.message?.includes('User already registered')) {
        setError('This email is already registered. Please login instead.');
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setError(error.message || 'An error occurred during registration');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
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
            <h2 className="text-2xl font-bold text-green-400 mb-2">Check Your Email!</h2>
            <p className="text-gray-300">
              We've sent a confirmation link to <strong>{email}</strong>. 
              Please check your email and click the link to verify your account.
            </p>
          </div>
          
          <div className="text-sm text-gray-400">
            <p>Didn't receive the email?</p>
            <button
              onClick={() => setSuccess(false)}
              className="text-purple-400 hover:text-purple-300 font-semibold mt-2"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-md mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-gray-400">Join Velric and start your journey</p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-6">
          {error && (
            <div className={`p-4 rounded-lg ${
              error.includes('already registered') 
                ? 'bg-yellow-500/10 border border-yellow-500/50 text-yellow-400'
                : 'bg-red-500/10 border border-red-500/50 text-red-400'
            }`}>
              <div className="flex items-start gap-3">
                {error.includes('already registered') && (
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                )}
                <div>
                  <p className="font-semibold">{error}</p>
                  {error.includes('already registered') && (
                    <p className="text-sm mt-1 text-yellow-300">
                      Redirecting to login page...
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              placeholder="Create a password (min. 6 characters)"
              required
              minLength={6}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              placeholder="Confirm your password"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating Account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Login link */}
        <div className="text-center mt-8 pt-6 border-t border-gray-800">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link 
              href="/login" 
              className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-300"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}