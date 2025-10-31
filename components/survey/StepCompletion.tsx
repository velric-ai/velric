import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { Check, ArrowRight, Edit3, Sparkles } from "lucide-react";

interface StepCompletionProps {
  formData: any;
  updateFormData: (updates: any) => void;
  onNext: () => void;
  onPrev: () => void;
  canProceed: boolean;
  isSubmitting: boolean;
}

export function StepCompletion({ 
  formData, 
  updateFormData, 
  onNext, 
  onPrev, 
  canProceed, 
  isSubmitting 
}: StepCompletionProps) {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(false);
  const [autoRedirectCountdown, setAutoRedirectCountdown] = useState(3); // ✅ REDUCED to 3 seconds

  // Trigger confetti animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // ✅ NUCLEAR OPTION: Force redirect on mount + countdown
  useEffect(() => {
    console.log("=== STEPCOMPLETION MOUNTED ===");
    console.log("Current localStorage:", localStorage.getItem("velric_user"));
    
    // Check localStorage immediately on mount
    try {
      const userDataStr = localStorage.getItem("velric_user");
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        console.log("User data on mount:", {
          onboarded: userData.onboarded,
          surveyCompletedAt: userData.surveyCompletedAt
        });
        
        // If already onboarded, set up immediate redirect
        if (userData.onboarded === true) {
          console.log("✅ User already marked as onboarded on mount!");
        }
      }
    } catch (error) {
      console.error("Error checking localStorage on mount:", error);
    }
  }, []);

  // ✅ COUNTDOWN + FORCE REDIRECT
  useEffect(() => {
    console.log("Countdown:", autoRedirectCountdown);
    
    if (autoRedirectCountdown > 0) {
      const timer = setTimeout(() => {
        setAutoRedirectCountdown(prev => prev - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      // ✅ COUNTDOWN FINISHED - FORCE REDIRECT NO MATTER WHAT
      console.log("=== COUNTDOWN FINISHED - FORCING REDIRECT ===");
      
      const forceRedirect = () => {
        try {
          const userDataStr = localStorage.getItem("velric_user");
          console.log("Final localStorage check:", userDataStr);
          
          if (userDataStr) {
            const userData = JSON.parse(userDataStr);
            console.log("Final user data:", {
              onboarded: userData.onboarded,
              surveyCompletedAt: userData.surveyCompletedAt
            });
            
            if (userData.onboarded === true) {
              console.log("✅ onboarded is TRUE - Redirecting...");
            } else {
              console.warn("⚠️ onboarded is FALSE - Force setting to true...");
              userData.onboarded = true;
              localStorage.setItem("velric_user", JSON.stringify(userData));
              console.log("✅ Force-set onboarded to true");
            }
          } else {
            console.warn("⚠️ No user data - Creating it...");
            localStorage.setItem("velric_user", JSON.stringify({
              onboarded: true,
              surveyCompletedAt: Date.now()
            }));
          }
        } catch (error) {
          console.error("Error in final check:", error);
        }
        
        // ✅ FORCE REDIRECT - Try ALL methods
        console.log("🚀 ATTEMPTING REDIRECT TO /user-dashboard");
        
        // Method 1: router.replace
        console.log("Method 1: router.replace()");
        router.replace("/user-dashboard");
        
        // Method 2: router.push as backup (after 500ms)
        setTimeout(() => {
          console.log("Method 2: router.push() [backup]");
          router.push("/user-dashboard");
        }, 500);
        
        // Method 3: window.location as last resort (after 1000ms)
        setTimeout(() => {
          console.log("Method 3: window.location.href [last resort]");
          window.location.href = "/user-dashboard";
        }, 1000);
      };
      
      forceRedirect();
    }
  }, [autoRedirectCountdown, router]);

  const handleGoToDashboard = () => {
    console.log('=== MANUAL BUTTON CLICK - FORCING REDIRECT ===');
    
    // Force-set onboarded to true
    try {
      const userDataStr = localStorage.getItem('velric_user');
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        userData.onboarded = true;
        localStorage.setItem('velric_user', JSON.stringify(userData));
        console.log('✅ Force-set onboarded to true');
      } else {
        localStorage.setItem('velric_user', JSON.stringify({
          onboarded: true,
          surveyCompletedAt: Date.now()
        }));
        console.log('✅ Created user data with onboarded: true');
      }
    } catch (error) {
      console.error('Error:', error);
    }
    
    // Try all redirect methods
    console.log('🚀 MANUAL REDIRECT ATTEMPT');
    router.replace('/user-dashboard');
    
    setTimeout(() => {
      router.push('/user-dashboard');
    }, 300);
    
    setTimeout(() => {
      window.location.href = '/user-dashboard';
    }, 600);
  };

  const handleEditProfile = () => {
    // Go back to first step to edit
    updateFormData({
      currentStep: 1
    });
  };

  // Calculate completion stats
  const completionStats = {
    strengthsSelected: formData.strengthAreas.value.length,
    platformsConnected: Object.values(formData.platformConnections).filter(
      (platform: any) => platform.connected
    ).length,
    hasPortfolio: !!(formData.portfolio.file || formData.portfolio.url),
    totalTimeSpent: Object.values(formData.timeSpentPerStep).reduce(
      (sum: number, time: number) => sum + time, 0
    )
  };

  const formatTime = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="max-w-3xl mx-auto text-center"
    >
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: ['#F472B6', '#60A5FA', '#34D399', '#FBBF24', '#A78BFA'][i % 5],
                left: `${Math.random() * 100}%`,
                top: '-10px'
              }}
              initial={{ y: -10, opacity: 1, rotate: 0 }}
              animate={{ 
                y: window.innerHeight + 10, 
                opacity: 0, 
                rotate: 360,
                x: Math.random() * 200 - 100
              }}
              transition={{ 
                duration: 3 + Math.random() * 2, 
                delay: Math.random() * 2,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}

      {/* Success Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          delay: 0.2, 
          duration: 0.6, 
          type: "spring", 
          stiffness: 200 
        }}
        className="mb-8"
      >
        <div className="relative inline-flex items-center justify-center">
          {/* Animated Rings */}
          <motion.div
            className="absolute w-32 h-32 rounded-full border-4 border-green-400/30"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.1, 0.3]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute w-24 h-24 rounded-full border-4 border-green-400/50"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.2, 0.5]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
          
          {/* Success Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/50">
            <Check className="w-10 h-10 text-white" strokeWidth={3} />
          </div>
        </div>
      </motion.div>

      {/* Success Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-5xl font-bold text-white mb-4 flex items-center justify-center space-x-3">
          <span>Profile Complete!</span>
          <Sparkles className="w-8 h-8 text-yellow-400" />
        </h2>
        <p className="text-xl text-white/80 mb-2">
          Your Velric profile is ready. Get ready to prove your work.
        </p>
        <p className="text-white/60">
          Welcome to the future of skill verification and career growth.
        </p>
      </motion.div>

      {/* Completion Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mb-8 p-8 rounded-2xl backdrop-blur-sm border border-white/10"
        style={{
          background: 'rgba(255, 255, 255, 0.05)'
        }}
      >
        <h3 className="text-white font-semibold text-lg mb-6 flex items-center justify-center space-x-2">
          <Check className="w-5 h-5 text-green-400" />
          <span>Profile Summary</span>
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-400 mb-1">
              {completionStats.strengthsSelected}
            </div>
            <div className="text-white/60 text-sm">
              Strengths Selected
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {completionStats.platformsConnected}
            </div>
            <div className="text-white/60 text-sm">
              Platforms Connected
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {completionStats.hasPortfolio ? '✓' : '—'}
            </div>
            <div className="text-white/60 text-sm">
              Portfolio Added
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {formatTime(completionStats.totalTimeSpent)}
            </div>
            <div className="text-white/60 text-sm">
              Time Invested
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="space-y-4"
      >
        <button
          onClick={handleGoToDashboard}
          className="w-full md:w-auto px-12 py-4 bg-gradient-to-r from-purple-500 to-cyan-400 text-white font-semibold text-lg rounded-xl hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 flex items-center justify-center space-x-3 mx-auto"
        >
          <span>Go to Dashboard</span>
          <ArrowRight className="w-6 h-6" />
        </button>
        
        <div className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-6">
          <button
            onClick={handleEditProfile}
            className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
          
          <div className="text-white/40 text-sm">
            Redirecting in {autoRedirectCountdown}s...
          </div>
        </div>
      </motion.div>

      {/* Welcome Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-12 p-6 rounded-xl bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20"
      >
        <h4 className="text-white font-semibold mb-2">What's Next?</h4>
        <p className="text-white/70 text-sm leading-relaxed">
          Explore personalized missions, track your skill growth, and connect with opportunities 
          that match your expertise. Your journey to prove your work starts now.
        </p>
      </motion.div>

      {/* Floating Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full"
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/3 w-1 h-1 bg-cyan-400 rounded-full"
          animate={{
            y: [0, -15, 0],
            opacity: [0.4, 0.9, 0.4]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-green-400 rounded-full"
          animate={{
            y: [0, -10, 0],
            opacity: [0.2, 0.7, 0.2]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
      </div>
    </motion.div>
  );
}