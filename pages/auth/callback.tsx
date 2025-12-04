import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { supabase } from '@/lib/supabaseClient';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getUser, createUser, checkUserExists } from '@/lib/auth';
import { useSnackbar } from '@/hooks/useSnackbar';

export default function AuthCallback() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const handleCallback = async () => {
      if (status === 'loading') {
        return; // Still loading
      }

      if (status === 'unauthenticated') {
        showSnackbar('Authentication failed. Please try again.', 'error');
        setTimeout(() => router.push('/login'), 2000);
        return;
      }

      if (!session?.user) {
        showSnackbar('No session found. Please try again.', 'error');
        setTimeout(() => router.push('/login'), 2000);
        return;
      }

      try {
        const authUser = session.user as any;
        const mode = router.query.mode as string || 'login'; // Get mode from query params
        
        let userData;
        if (mode === 'signup') {
          // For signup: check if user exists first
          const userExists = await checkUserExists(session.user.email!);
          
          if (userExists) {
            // User already exists, show error and redirect to login
            showSnackbar('This email is already registered. Please sign in instead.', 'error');
            setLoading(false);
            setTimeout(() => router.push('/login'), 2000);
            return;
          }
          
          // User doesn't exist, redirect to user type selection
          // The select-user-type page will get data from NextAuth session
          setLoading(false);
          router.push('/auth/select-user-type');
          return;
        } else {
          // For login: get existing user and store tokens
          const sessionWithTokens = session as any;
          console.log('[Callback] Login - Session tokens:', {
            hasAccessToken: !!sessionWithTokens.accessToken,
            hasRefreshToken: !!sessionWithTokens.refreshToken,
            expiresAt: sessionWithTokens.expiresAt,
            userId: authUser.id,
            email: session.user.email,
          });
          
          const result = await getUser({
            id: authUser.id,
            email: session.user.email!,
            accessToken: sessionWithTokens.accessToken,
            refreshToken: sessionWithTokens.refreshToken,
            expiresAt: sessionWithTokens.expiresAt,
          });

          if (!result.success) {
            // User not found, show error and redirect to signup
            showSnackbar(result.error, 'error');
            setLoading(false);
            setTimeout(() => router.push('/signup'), 2000);
            return;
          }

          userData = result.data;
        }

        // Store user in localStorage for compatibility with existing code
        const userObject = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          onboarded: userData.onboarded,
          isRecruiter: userData.isRecruiter,
          createdAt: userData.createdAt,
          surveyCompletedAt: userData.surveyCompletedAt,
          surveyCompleted: userData.surveyCompleted,
          profileComplete: userData.profileComplete,
        };
        localStorage.setItem('velric_user', JSON.stringify(userObject));

        // Check if user has survey response
        const { data: surveyResponse } = await supabase
          .from("survey_responses")
          .select("id")
          .eq("user_id", userData.id)
          .maybeSingle();

        // Redirect based on user type and onboarding status
        if (userData.isRecruiter) {
          router.push('/recruiter-dashboard');
        } else if (surveyResponse) {
          // User has completed survey, send to dashboard
          setTimeout(() => {
            router.push('/user-dashboard');
          }, 100);
        } else {
          // User hasn't completed survey yet, send to survey
          localStorage.removeItem('velric_survey_draft');
          localStorage.removeItem('velric_survey_state');
          const freshSurveyState = {
            currentStep: 1,
            currentStepIndex: 0,
            totalSteps: 9,
            completedSteps: [],
            surveyData: {},
            startedAt: new Date().toISOString()
          };
          localStorage.setItem('velric_survey_state', JSON.stringify(freshSurveyState));
          router.push('/onboard/survey');
        }
      } catch (error: any) {
        console.error('OAuth callback error:', error);
        const errorMessage = error.message || 'An error occurred during authentication';
        
        // Show error in snackbar
        showSnackbar(errorMessage, 'error');
        setTimeout(() => router.push('/login'), 2000);
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [session, status, router, showSnackbar]);

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-white mt-4">Signing you in...</p>
        </div>
      </div>
    );
  }

  return null;
}
