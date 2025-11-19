import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

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
    // ✅ LONGER DELAY - Give localStorage plenty of time to update
    const checkTimer = setTimeout(() => {
      const checkAccess = () => {
        try {
          const currentPath = router.pathname;
          console.log('🔐 ProtectedRoute Check:', {
            path: currentPath,
            requireAuth,
            requireOnboarded,
            requireNotOnboarded,
            timestamp: new Date().toISOString()
          });

          // Get user data from storage
          const userDataStr = localStorage.getItem('velric_user');
          console.log('📦 localStorage data:', userDataStr);

          // If auth is required but no user data exists
          if (requireAuth && !userDataStr) {
            console.log('❌ No user data - redirecting to signup');
            router.replace('/signup');
            return;
          }

          // If no auth required, allow access
          if (!requireAuth) {
            console.log('✅ No auth required - access granted');
            setIsAuthorized(true);
            setIsChecking(false);
            return;
          }

          // Parse user data
          const userData = JSON.parse(userDataStr!);
          console.log('👤 Parsed user data:', {
            onboarded: userData.onboarded,
            surveyCompletedAt: userData.surveyCompletedAt,
            email: userData.email,
            allKeys: Object.keys(userData)
          });

          // 🔴 FIX 1: Ensure both flags exist
          if (!userData.hasOwnProperty('onboarded')) {
            console.warn('⚠️ Missing onboarded flag - setting to false');
            userData.onboarded = false;
          }
          if (!userData.hasOwnProperty('surveyCompleted')) {
            console.warn('⚠️ Missing surveyCompleted flag - setting to false');
            userData.surveyCompleted = false;
          }

          // ✅ DASHBOARD ACCESS - If user is trying to access dashboard or related pages
          if (currentPath === '/user-dashboard' || currentPath === '/dashboard' || currentPath === '/analytics' || currentPath === '/profile') {
            console.log('📊 DASHBOARD ROUTE CHECK:', {
              onboarded: userData.onboarded,
              surveyCompleted: userData.surveyCompleted
            });
            
            // 🔴 FIX 2: STRICT CHECK - Must have BOTH flags as true
            if (userData.onboarded === true && userData.surveyCompleted === true) {
              console.log('✅ User fully onboarded - ALLOWING DASHBOARD ACCESS');
              setIsAuthorized(true);
              setIsChecking(false);
              return;
            }
            
            // If onboarded but survey not done - edge case
            if (userData.onboarded === true && userData.surveyCompleted !== true) {
              console.log('⚠️ Onboarded but survey incomplete - forcing to survey');
              router.replace('/onboard/survey');
              return;
            }
            
            // If not onboarded - go to survey
            if (userData.onboarded === false) {
              console.log('❌ Not onboarded - redirecting to survey');
              router.replace('/onboard/survey');
              return;
            }
          }

          // ✅ SURVEY ACCESS - If user is trying to access survey
          if (currentPath === '/onboard/survey') {
            console.log('📝 SURVEY ROUTE CHECK:', {
              onboarded: userData.onboarded,
              surveyCompleted: userData.surveyCompleted
            });
            
            // 🔴 FIX 3: If BOTH flags are true - survey completed, go to dashboard
            if (userData.onboarded === true && userData.surveyCompleted === true) {
              console.log('⚠️ Survey already completed - redirecting to dashboard');
              router.replace('/user-dashboard');
              return;
            }
            
            // If onboarded is false - allow survey access
            if (userData.onboarded === false) {
              console.log('✅ User not onboarded - ALLOWING SURVEY ACCESS');
              setIsAuthorized(true);
              setIsChecking(false);
              return;
            }
            
            // Edge case - onboarded is true but surveyCompleted is false
            if (userData.onboarded === true && userData.surveyCompleted !== true) {
              console.log('⚠️ Inconsistent state detected - forcing to dashboard');
              router.replace('/user-dashboard');
              return;
            }
          }

          // Check onboarding requirements for other routes
          if (requireOnboarded && userData.onboarded !== true) {
            console.log('❌ Route requires onboarding - redirecting to survey');
            router.replace('/onboard/survey');
            return;
          }

          if (requireNotOnboarded && userData.onboarded === true) {
            console.log('✅ User already onboarded - redirecting to dashboard');
            router.replace('/user-dashboard');
            return;
          }

          // All checks passed
          console.log('✅ ACCESS GRANTED to', currentPath);
          setIsAuthorized(true);
          setIsChecking(false);

        } catch (error) {
          console.error('❌ Route protection error:', error);
          console.error('Error stack:', error);
          // Invalid data - redirect to signup
          localStorage.removeItem('velric_user');
          router.replace('/signup');
        }
      };

      checkAccess();
    }, 300); // ✅ INCREASED to 300ms - Give more time for localStorage
    
    return () => clearTimeout(checkTimer);
  }, [router, requireAuth, requireOnboarded, requireNotOnboarded, router.pathname]); // ✅ Added router.pathname

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
    console.log('🔒 ProtectedSurveyRoute - Checking access to survey...');
    
    const checkTimer = setTimeout(() => {
      try {
        const userDataStr = localStorage.getItem('velric_user');
        if (!userDataStr) {
          console.log('❌ No user data - redirecting to signup');
          router.replace('/signup');
          return;
        }

        const userData = JSON.parse(userDataStr);
        console.log('🔒 Survey Guard Check:', {
          onboarded: userData.onboarded,
          surveyCompleted: userData.surveyCompleted
        });
        
        // If user is onboarded, survey is already completed
        // Allow access if survey not completed, even if onboarded flag was toggled
        if (userData.onboarded === true && userData.surveyCompleted === true) {
          console.log('⚠️ Survey guard - user already completed survey, redirecting to dashboard');
          router.replace('/user-dashboard');
          return;
        }
        
        // If user hasn't completed survey, allow access to survey
        console.log('✅ Survey guard - allowing access to survey');
        setShouldRender(true);
        setIsChecking(false);
        
      } catch (error) {
        console.error('Error in ProtectedSurveyRoute:', error);
        router.replace('/signup');
      }
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
    console.log('🔒 ProtectedDashboardRoute - Checking access to dashboard...');
    
    const checkTimer = setTimeout(() => {
      try {
        const userDataStr = localStorage.getItem('velric_user');
        if (!userDataStr) {
          console.log('❌ Dashboard guard - no user data, redirecting to signup');
          router.replace('/signup');
          return;
        }

        const userData = JSON.parse(userDataStr);
        const currentPath = router.pathname;
        const isRecruiter = Boolean(userData.isRecruiter || userData.is_recruiter);
        
        console.log('🔒 Dashboard Guard Check:', {
          path: currentPath,
          isRecruiter,
          onboarded: userData.onboarded,
          surveyCompleted: userData.surveyCompleted
        });
        
        // If user is a recruiter accessing recruiter dashboard, skip onboarding check
        if (isRecruiter && currentPath === '/recruiter-dashboard') {
          console.log('✅ Dashboard guard - recruiter accessing recruiter dashboard, allowing access');
          setShouldRender(true);
          setIsChecking(false);
          return;
        }
        
        // For professionals or user-dashboard, check if user is onboarded
        if (!isRecruiter && userData.onboarded !== true) {
          console.log('❌ Dashboard guard - professional not onboarded, redirecting to survey');
          router.replace('/onboard/survey');
          return;
        }
        
        // If recruiter trying to access user-dashboard, redirect to recruiter dashboard
        if (isRecruiter && currentPath === '/user-dashboard') {
          console.log('⚠️ Dashboard guard - recruiter trying to access user dashboard, redirecting to recruiter dashboard');
          router.replace('/recruiter-dashboard');
          return;
        }
        
        console.log('✅ Dashboard guard - access granted');
        setShouldRender(true);
        setIsChecking(false);
        
      } catch (error) {
        console.error('Error in ProtectedDashboardRoute:', error);
        router.replace('/signup');
      }
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