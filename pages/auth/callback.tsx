import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AuthCallback() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session from the URL hash (Supabase sets this)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
          setError('Failed to get session from Google OAuth');
          setTimeout(() => router.push('/login'), 2000);
          return;
        }

        const authUser = session.user;

        // Check if user exists in our users table
        const { data: existingUser, error: checkError } = await supabase
          .from("users")
          .select("*")
          .eq("id", authUser.id)
          .maybeSingle();

        if (checkError && checkError.code !== "PGRST116") {
          console.error("Error checking user:", checkError);
          setError('Failed to check user account');
          setTimeout(() => router.push('/login'), 2000);
          return;
        }

        // If user already exists, load their profile
        if (existingUser) {
          console.log('🔍 [OAuth Callback] User found in DB:', {
            id: existingUser.id,
            email: existingUser.email,
            onboarded: existingUser.onboarded,
            is_recruiter: existingUser.is_recruiter,
            survey_completed_at: existingUser.survey_completed_at,
            profile_complete: existingUser.profile_complete,
          });

          // CHECK IF USER HAS COMPLETED SURVEY BY LOOKING FOR SURVEY RESPONSE
          const { data: surveyResponse, error: surveyError } = await supabase
            .from("survey_responses")
            .select("id")
            .eq("user_id", existingUser.id)
            .maybeSingle();

          console.log('🔍 [OAuth Callback] Survey response check:', { hasSurvey: !!surveyResponse, surveyError });

          // CRITICAL: Clear any old survey data for existing users
          localStorage.removeItem('velric_survey_draft');
          localStorage.removeItem('velric_survey_state');

          // User already exists, store in localStorage and redirect to dashboard
          const userObject = {
            id: existingUser.id,
            email: existingUser.email,
            name: existingUser.name,
            onboarded: existingUser.onboarded,
            isRecruiter: Boolean(existingUser.is_recruiter),
            createdAt: existingUser.created_at,
            surveyCompletedAt: existingUser.survey_completed_at,
            surveyCompleted: existingUser.survey_completed_at !== null, // Set based on timestamp
            profileComplete: existingUser.profile_complete,
            hasSurveyResponse: !!surveyResponse, // New flag based on actual survey response
          };
          localStorage.setItem('velric_user', JSON.stringify(userObject));

          console.log('✅ [OAuth Callback] Stored user in localStorage:', userObject);
          console.log('✅ [OAuth Callback] surveyCompleted flag:', userObject.surveyCompleted);
          console.log('✅ [OAuth Callback] hasSurveyResponse flag:', userObject.hasSurveyResponse);
          console.log('✅ [OAuth Callback] Condition check - isRecruiter:', existingUser.is_recruiter, '| hasSurvey:', !!surveyResponse);

          // Redirect based on user type and onboarding status (same logic as email/password login)
          if (existingUser.is_recruiter) {
            console.log('🔄 [OAuth Callback] Redirecting recruiter to /recruiter-dashboard');
            router.push('/recruiter-dashboard');
          } else if (surveyResponse) {
            // User has completed survey (has survey response), send to dashboard
            console.log('🔄 [OAuth Callback] User has survey response, redirecting to /user-dashboard');
            // Small delay to ensure localStorage is fully synced before navigation
            setTimeout(() => {
              router.push('/user-dashboard');
            }, 100);
          } else {
            // User hasn't completed survey yet, send to survey
            console.log('🔄 [OAuth Callback] No survey response found, sending to survey');
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
          return;
        }

        // User doesn't exist, create them
        // Determine if recruiter based on email domain or metadata
        const isRecruiter = authUser.user_metadata?.is_recruiter || false;
        const name = authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "User";

        const { data: newUser, error: createError } = await supabase
          .from("users")
          .insert([
            {
              id: authUser.id,
              email: authUser.email,
              name: name,
              onboarded: false,
              is_recruiter: isRecruiter,
              created_at: new Date().toISOString(),
              survey_completed_at: null,
              profile_complete: false,
            },
          ])
          .select()
          .single();

        if (createError) {
          // Handle unique constraint violation (409) - try to load user instead
          if (createError.code === "23505") {
            console.warn("User already exists (409), attempting to load...");
            // User might have been created by another request, try loading again
            const { data: loadedUser, error: loadError } = await supabase
              .from("users")
              .select("*")
              .eq("id", authUser.id)
              .maybeSingle();

            if (loadError || !loadedUser) {
              console.error("Failed to load user after 409:", loadError);
              setError('User creation conflict. Please try again.');
              setTimeout(() => router.push('/login'), 2000);
              return;
            }

            // Load the user that was created
            const userObject = {
              id: loadedUser.id,
              email: loadedUser.email,
              name: loadedUser.name,
              onboarded: loadedUser.onboarded,
              isRecruiter: Boolean(loadedUser.is_recruiter),
              createdAt: loadedUser.created_at,
              surveyCompletedAt: loadedUser.survey_completed_at,
              surveyCompleted: loadedUser.survey_completed_at !== null, // Set based on timestamp
              profileComplete: loadedUser.profile_complete,
            };
            localStorage.setItem('velric_user', JSON.stringify(userObject));

            // Check if user has survey response
            const { data: surveyResp } = await supabase
              .from("survey_responses")
              .select("id")
              .eq("user_id", loadedUser.id)
              .maybeSingle();

            // Initialize survey for new user if no survey response exists
            if (!surveyResp) {
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
            } else {
              router.push('/user-dashboard');
            }
            return;
          }

          console.error("Error creating user:", createError);
          setError('Failed to create user account: ' + (createError.message || 'Unknown error'));
          setTimeout(() => router.push('/login'), 2000);
          return;
        }

        // Successfully created new user
        // CRITICAL: Clear any old survey data for new users
        localStorage.removeItem('velric_survey_draft');
        localStorage.removeItem('velric_survey_state');

        // Store user in localStorage
        const userObject = {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          onboarded: newUser.onboarded,
          isRecruiter: Boolean(newUser.is_recruiter),
          createdAt: newUser.created_at,
          surveyCompletedAt: newUser.survey_completed_at,
          surveyCompleted: newUser.survey_completed_at !== null, // Set based on timestamp
          profileComplete: newUser.profile_complete,
        };
        localStorage.setItem('velric_user', JSON.stringify(userObject));

        // Initialize fresh survey state for new user (Step 1)
        const freshSurveyState = {
          currentStep: 1,
          currentStepIndex: 0,
          totalSteps: 9,
          completedSteps: [],
          surveyData: {},
          startedAt: new Date().toISOString()
        };
        localStorage.setItem('velric_survey_state', JSON.stringify(freshSurveyState));

        // For new signup users, redirect to survey (Step 1)
        const redirectUrl = new URL(window.location.href).searchParams.get('redirect') || '/onboard/survey';
        router.push(redirectUrl);
      } catch (error: any) {
        console.error('OAuth callback error:', error);
        setError(error.message || 'An error occurred during authentication');
        setTimeout(() => router.push('/login'), 2000);
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-white mt-4">Signing you in...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <p className="text-white/70">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return null;
}
