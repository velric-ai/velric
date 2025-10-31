import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { X, Sparkles } from 'lucide-react';

export function WelcomeMessage() {
  const router = useRouter();
  const [showWelcome, setShowWelcome] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Check if user just came from survey completion
    const fromSurvey = router.query.fromSurvey === 'true' || 
                      (typeof window !== 'undefined' && 
                       window.history.state?.fromSurvey);

    if (fromSurvey) {
      // Get user name
      try {
        const userData = localStorage.getItem('velric_user');
        if (userData) {
          const user = JSON.parse(userData);
          setUserName(user.name || 'there');
        }
      } catch (error) {
        console.warn('Failed to get user name:', error);
        setUserName('there');
      }

      setShowWelcome(true);

      // Auto-hide after 8 seconds
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [router.query]);

  const handleClose = () => {
    setShowWelcome(false);
  };

  return (
    <AnimatePresence>
      {showWelcome && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative max-w-md w-full p-8 rounded-2xl text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(0, 212, 255, 0.1))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
            }}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-white/60" />
            </button>

            {/* Success Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mb-6"
            >
              <div className="relative inline-flex items-center justify-center">
                {/* Animated Rings */}
                <motion.div
                  className="absolute w-20 h-20 rounded-full border-2 border-green-400/30"
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
                
                {/* Success Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
            </motion.div>

            {/* Welcome Message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-white mb-3">
                Welcome to Velric, {userName}! 🎉
              </h2>
              <p className="text-white/80 mb-6 leading-relaxed">
                Your profile is complete and ready to go. Explore personalized missions, 
                track your progress, and prove your work with confidence.
              </p>
            </motion.div>

            {/* Action Button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              onClick={handleClose}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-cyan-400 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300"
            >
              Let's Get Started
            </motion.button>

            {/* Floating Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
              <motion.div
                className="absolute top-4 left-4 w-1 h-1 bg-purple-400 rounded-full"
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute top-8 right-8 w-1.5 h-1.5 bg-cyan-400 rounded-full"
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
                className="absolute bottom-6 left-6 w-0.5 h-0.5 bg-green-400 rounded-full"
                animate={{
                  y: [0, -8, 0],
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}