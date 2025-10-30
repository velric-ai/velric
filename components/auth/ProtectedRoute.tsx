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

          // ✅ DASHBOARD ACCESS - If user is trying to access dashboard
          if (currentPath === '/user-dashboard') {
            console.log('🎯 User accessing dashboard...');
            
            if (userData.onboarded === true) {
              console.log('✅ User is onboarded - ALLOWING DASHBOARD ACCESS');
              setIsAuthorized(true);
              setIsChecking(false);
              return;
            } else {
              console.log('❌ User NOT onboarded yet - redirecting to survey');
              router.replace('/onboard/survey');
              return;
            }
          }

          // ✅ SURVEY ACCESS - If user is trying to access survey
          if (currentPath === '/onboard/survey') {
            console.log('📝 User accessing survey...');
            
            if (userData.onboarded === true) {
              console.log('⚠️ User already onboarded - redirecting to dashboard');
              router.replace('/user-dashboard');
              return;
            } else {
              console.log('✅ User NOT onboarded - ALLOWING SURVEY ACCESS');
              setIsAuthorized(true);
              setIsChecking(false);
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
  
  useEffect(() => {
    console.log('🔒 ProtectedSurveyRoute - Checking access to survey...');
    
    // Quick check - if user is onboarded, redirect immediately
    try {
      const userDataStr = localStorage.getItem('velric_user');
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        if (userData.onboarded === true) {
          console.log('⚠️ User already onboarded - immediate redirect to dashboard');
          router.replace('/user-dashboard');
          return;
        }
      }
    } catch (error) {
      console.error('Error in ProtectedSurveyRoute:', error);
    }
  }, [router]);
  
  return (
    <ProtectedRoute
      requireAuth={true}
      requireNotOnboarded={true}
    >
      {children}
    </ProtectedRoute>
  );
}

// ✅ Dashboard Route Guard - Simplified
export function ProtectedDashboardRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  
  useEffect(() => {
    console.log('🔒 ProtectedDashboardRoute - Checking access to dashboard...');
    
    // Quick check - if user is NOT onboarded, redirect immediately
    try {
      const userDataStr = localStorage.getItem('velric_user');
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        console.log('Dashboard guard - user onboarded status:', userData.onboarded);
        
        if (userData.onboarded !== true) {
          console.log('⚠️ User NOT onboarded - immediate redirect to survey');
          router.replace('/onboard/survey');
          return;
        } else {
          console.log('✅ User is onboarded - allowing dashboard access');
        }
      } else {
        console.log('❌ No user data - redirecting to signup');
        router.replace('/signup');
      }
    } catch (error) {
      console.error('Error in ProtectedDashboardRoute:', error);
      router.replace('/signup');
    }
  }, [router]);
  
  return (
    <ProtectedRoute
      requireAuth={true}
      requireOnboarded={true}
    >
      {children}
    </ProtectedRoute>
  );
}