import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireOnboarded?: boolean;
  requireNotOnboarded?: boolean;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  requireOnboarded = false,
  requireNotOnboarded = false
}: ProtectedRouteProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkTimer = setTimeout(() => {
      const checkAccess = async () => {
        try {
          const currentPath = router.pathname;

          // Get user data from storage
          const userDataStr = localStorage.getItem('velric_user');

          // If auth is required but no user data exists
          if (requireAuth && !userDataStr) {
            router.replace('/signup');
            return;
          }

          // If no auth required, allow access
          if (!requireAuth) {
            setIsAuthorized(true);
            setIsChecking(false);
            return;
          }

          // Parse user data
          const userData = JSON.parse(userDataStr!);

          // ✅ SURVEY ACCESS - If user is trying to access survey
          if (currentPath === '/onboard/survey') {
            const { data: surveyResponse } = await supabase
              .from("survey_responses")
              .select("id")
              .eq("user_id", userData.id)
              .maybeSingle();

            if (surveyResponse) {
              router.replace('/user-dashboard');
              return;
            }
            setIsAuthorized(true);
            setIsChecking(false);
            return;
          }

          // Check onboarding requirements for other routes
          if (requireOnboarded) {
            const { data: surveyResponse } = await supabase
              .from("survey_responses")
              .select("id")
              .eq("user_id", userData.id)
              .maybeSingle();

            if (!surveyResponse) {
              router.replace('/onboard/survey');
              return;
            }
          }

          if (requireNotOnboarded) {
            const { data: surveyResponse } = await supabase
              .from("survey_responses")
              .select("id")
              .eq("user_id", userData.id)
              .maybeSingle();

            if (surveyResponse) {
              router.replace('/user-dashboard');
              return;
            }
          }

          // All checks passed
          setIsAuthorized(true);
          setIsChecking(false);

        } catch (error) {
          console.error('Route protection error:', error);
          router.replace('/signup');
        }
      };

      checkAccess();
    }, 100);
    
    return () => clearTimeout(checkTimer);
  }, [router, requireAuth, requireOnboarded, requireNotOnboarded]);

  // Show loading while checking
  if (isChecking) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-white"
        style={{
          background: 'linear-gradient(135deg, #1a0b2e 0%, #16213e 50%, #0f3460 100%)'
        }}
      >
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Only render children if authorized
  return isAuthorized ? <>{children}</> : null;
}

// ✅ Survey Route Guard - Simplified
export function ProtectedSurveyRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [shouldRender, setShouldRender] = useState(false);
  
  useEffect(() => {
    const checkSurveyStatus = async () => {
      try {
        const userDataStr = localStorage.getItem('velric_user');
        if (!userDataStr) {
          router.replace('/signup');
          return;
        }

        const userData = JSON.parse(userDataStr);
        if (!userData.id) {
          router.replace('/signup');
          return;
        }

        const { data: surveyResponse } = await supabase
          .from("survey_responses")
          .select("id")
          .eq("user_id", userData.id)
          .maybeSingle();
        
        if (surveyResponse) {
          router.replace('/user-dashboard');
          return;
        }
        
        setShouldRender(true);
        setIsChecking(false);
        
      } catch (error) {
        console.error('Error in ProtectedSurveyRoute:', error);
        router.replace('/signup');
      }
    };

    const checkTimer = setTimeout(() => {
      checkSurveyStatus();
    }, 100);
    
    return () => clearTimeout(checkTimer);
  }, [router]);
  
  if (isChecking) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-white"
        style={{
          background: 'linear-gradient(135deg, #1a0b2e 0%, #16213e 50%, #0f3460 100%)'
        }}
      >
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80">Checking survey status...</p>
        </div>
      </div>
    );
  }
  
  return shouldRender ? <>{children}</> : null;
}

// ✅ Dashboard Route Guard - Simplified
export function ProtectedDashboardRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [shouldRender, setShouldRender] = useState(false);
  
  useEffect(() => {
    const checkDashboardAccess = async () => {
      try {
        const userDataStr = localStorage.getItem('velric_user');
        if (!userDataStr) {
          router.replace('/signup');
          return;
        }

        const userData = JSON.parse(userDataStr);
        const currentPath = router.pathname;
        const isRecruiter = Boolean(userData.isRecruiter || userData.is_recruiter);
        const isRecruiterRoute = currentPath.startsWith('/recruiter');
        
        // If accessing recruiter routes, must be a recruiter
        if (isRecruiterRoute && !isRecruiter) {
          const { data: surveyResponse } = await supabase
            .from("survey_responses")
            .select("id")
            .eq("user_id", userData.id)
            .maybeSingle();
          
          if (surveyResponse) {
            router.replace('/user-dashboard');
          } else {
            router.replace('/onboard/survey');
          }
          return;
        }
        
        // If user is a recruiter accessing recruiter routes, allow access
        if (isRecruiter && isRecruiterRoute) {
          setShouldRender(true);
          setIsChecking(false);
          return;
        }
        
        // For professionals, check if user has completed survey
        if (!isRecruiter) {
          const { data: surveyResponse } = await supabase
            .from("survey_responses")
            .select("id")
            .eq("user_id", userData.id)
            .maybeSingle();

          if (!surveyResponse) {
            router.replace('/onboard/survey');
            return;
          }

          setShouldRender(true);
          setIsChecking(false);
          return;
        }
        
        // If recruiter trying to access user-dashboard, redirect to recruiter dashboard
        if (isRecruiter && currentPath === '/user-dashboard') {
          router.replace('/recruiter-dashboard');
          return;
        }
        
        setShouldRender(true);
        setIsChecking(false);
        
      } catch (error) {
        console.error('Error in ProtectedDashboardRoute:', error);
        router.replace('/signup');
      }
    };

    const checkTimer = setTimeout(() => {
      checkDashboardAccess();
    }, 100);
    
    return () => clearTimeout(checkTimer);
  }, [router]);
  
  if (isChecking) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-white"
        style={{
          background: 'linear-gradient(135deg, #1a0b2e 0%, #16213e 50%, #0f3460 100%)'
        }}
      >
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80">Verifying dashboard access...</p>
        </div>
      </div>
    );
  }
  
  return shouldRender ? <>{children}</> : null;
}