import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ChevronLeft, 
  Github, 
  Code, 
  Trophy, 
  Check, 
  ExternalLink, 
  AlertCircle,
  Loader2,
  Linkedin
} from "lucide-react";
import { initiateOAuthFlow } from "../../utils/oauthHandlers";

interface StepPlatformConnectionsProps {
  formData: any;
  updateFormData: (updates: any) => void;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  canProceed: boolean;
  isSubmitting: boolean;
}

const PLATFORMS = [
  {
    id: 'github',
    name: 'GitHub',
    icon: Github,
    description: 'Show your repositories, contributions, code quality, and open source work',
    color: '#6366F1',
    buttonText: 'Connect with GitHub'
  },
  {
    id: 'codesignal',
    name: 'CodeSignal',
    icon: Code,
    description: 'Verify your coding assessment scores and demonstrate your technical abilities',
    color: '#10B981',
    buttonText: 'Connect CodeSignal'
  },
  {
    id: 'hackerrank',
    name: 'HackerRank',
    icon: Trophy,
    description: 'Display your problem-solving skills, badges, and challenge achievements',
    color: '#F59E0B',
    buttonText: 'Connect HackerRank'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: Linkedin,
    description: 'Showcase your professional experience, skills, and endorsements to recruiters',
    color: '#0A66C2',
    buttonText: 'Connect with LinkedIn'
  }
];

export function StepPlatformConnections({ 
  formData, 
  updateFormData, 
  onNext, 
  onPrev, 
  onSkip,
  canProceed, 
  isSubmitting 
}: StepPlatformConnectionsProps) {
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);

  // 🔴 FIX: Initialize platformConnections if it doesn't exist
  const platformConnections = formData.platformConnections || {};

  // 🔴 FIX: Ensure all platforms have default structure
  const getPlatformConnection = (platformId: string) => {
    const connection = platformConnections[platformId];
    
    if (!connection) {
      return {
        connected: false,
        username: '',
        userId: '',
        avatar: '',
        profile: {},
        error: null,
        loading: false,
        score: null,
        rank: null
      };
    }
    
    return connection;
  };

  const handleConnect = async (platformId: string) => {
    setConnectingPlatform(platformId);
    
    // Update loading state
    updateFormData({
      platformConnections: {
        ...platformConnections,
        [platformId]: {
          ...getPlatformConnection(platformId),
          loading: true,
          error: null
        }
      }
    });

    try {
      const authCode = await initiateOAuthFlow(platformId);
      
      // Simulate API call to exchange code for user data
      // In real implementation, this would call your backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful connection data
      const mockUserData = {
        github: {
          username: 'johndoe',
          userId: '12345',
          avatar: 'https://github.com/johndoe.png',
          profile: {
            followers: 150,
            repos: 42,
            stars: 1200
          }
        },
        codesignal: {
          username: 'johndoe',
          userId: '67890',
          avatar: '',
          score: 1500,
          profile: {
            tier: 'Expert',
            completedChallenges: 85
          }
        },
        hackerrank: {
          username: 'johndoe',
          userId: '54321',
          avatar: '',
          rank: '5-star',
          profile: {
            badges: 12,
            problemsSolved: 200
          }
        },
        linkedin: {
          username: 'johndoe',
          userId: '98765',
          avatar: 'https://media.licdn.com/dms/image/johndoe.png',
          profile: {
            headline: 'Full Stack Developer',
            connections: 500,
            endorsements: 125
          }
        }
      };

      const userData = mockUserData[platformId as keyof typeof mockUserData];
      
      // Update with successful connection
      updateFormData({
        platformConnections: {
          ...platformConnections,
          [platformId]: {
            ...userData,
            connected: true,
            loading: false,
            error: null
          }
        }
      });

    } catch (error) {
      console.error(`${platformId} connection error:`, error);
      
      // Update with error
      updateFormData({
        platformConnections: {
          ...platformConnections,
          [platformId]: {
            ...getPlatformConnection(platformId),
            connected: false,
            loading: false,
            error: (error as Error).message || `Failed to connect ${platformId}. Please try again.`
          }
        }
      });
    } finally {
      setConnectingPlatform(null);
    }
  };

  const handleDisconnect = (platformId: string) => {
    updateFormData({
      platformConnections: {
        ...platformConnections,
        [platformId]: {
          connected: false,
          username: '',
          userId: '',
          avatar: '',
          profile: {},
          error: null,
          loading: false,
          score: null,
          rank: null
        }
      }
    });
  };

  const handleRetry = (platformId: string) => {
    // Clear error and retry
    updateFormData({
      platformConnections: {
        ...platformConnections,
        [platformId]: {
          ...getPlatformConnection(platformId),
          error: null
        }
      }
    });
    
    handleConnect(platformId);
  };

  const connectedCount = Object.values(platformConnections).filter(
    (platform: any) => platform?.connected === true
  ).length;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canProceed && !isSubmitting) {
      onNext();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold text-white mb-4"
        >
          Connect your platforms
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-white/70 mb-2"
        >
          Link your GitHub, CodeSignal, HackerRank, and LinkedIn to showcase your proof of work
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-white/50"
        >
          All connections are optional. You can add or remove them anytime.
        </motion.p>
      </div>

      <div 
        className="p-8 rounded-2xl backdrop-blur-sm border border-white/10 space-y-6"
        style={{
          background: 'rgba(255, 255, 255, 0.05)'
        }}
      >
        {/* Platform Cards */}
        <div className="space-y-6">
          {PLATFORMS.map((platform, index) => {
            // 🔴 FIX: Use getPlatformConnection instead of direct access
            const connection = getPlatformConnection(platform.id);
            const isConnected = connection.connected;
            const isLoading = connection.loading;
            const hasError = !!connection.error;
            const Icon = platform.icon;
            
            return (
              <motion.div
                key={platform.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`p-6 rounded-xl border transition-all duration-300 ${
                  isConnected
                    ? 'border-green-500/50 bg-green-500/5'
                    : hasError
                    ? 'border-red-500/50 bg-red-500/5'
                    : 'border-white/20 bg-white/5 hover:border-white/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  {/* Platform Info */}
                  <div className="flex items-center space-x-4 flex-1">
                    <div 
                      className="w-16 h-16 rounded-xl flex items-center justify-center"
                      style={{
                        background: `${platform.color}20`,
                        border: `1px solid ${platform.color}30`
                      }}
                    >
                      <Icon 
                        className="w-8 h-8" 
                        style={{ color: platform.color }} 
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-white font-semibold text-lg">
                          {platform.name}
                        </h3>
                        {isConnected && (
                          <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-green-500/20 border border-green-500/30">
                            <Check className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 text-xs font-medium">Connected</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-white/60 text-sm mb-3 leading-relaxed">
                        {platform.description}
                      </p>
                      
                      {/* Connected User Info */}
                      {isConnected && (
                        <div className="flex items-center space-x-3">
                          {connection.avatar && (
                            <img
                              src={connection.avatar}
                              alt={`${connection.username} avatar`}
                              className="w-8 h-8 rounded-full"
                            />
                          )}
                          <div>
                            <p className="text-white font-medium text-sm">
                              @{connection.username}
                            </p>
                            {connection.score && (
                              <p className="text-white/60 text-xs">
                                Score: {connection.score}
                              </p>
                            )}
                            {connection.rank && (
                              <p className="text-white/60 text-xs">
                                Rank: {connection.rank}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Error Message */}
                      {hasError && (
                        <div className="flex items-center space-x-2 text-red-400">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm">{connection.error}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3">
                    {isConnected ? (
                      <>
                        <button
                          onClick={() => window.open(`https://${platform.id}.com/${connection.username}`, '_blank')}
                          className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                          title="View profile"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDisconnect(platform.id)}
                          className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                        >
                          Disconnect
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => hasError ? handleRetry(platform.id) : handleConnect(platform.id)}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                        className={`px-6 py-3 rounded-lg font-medium text-white transition-all duration-300 flex items-center space-x-2 ${
                          isLoading
                            ? 'bg-gray-600 cursor-not-allowed'
                            : hasError
                            ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300'
                            : 'hover:scale-105'
                        }`}
                        style={{
                          background: !isLoading && !hasError 
                            ? `linear-gradient(135deg, ${platform.color}, ${platform.color}cc)`
                            : undefined
                        }}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Connecting...</span>
                          </>
                        ) : hasError ? (
                          <span>Try Again</span>
                        ) : (
                          <span>{platform.buttonText}</span>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Connection Summary */}
        {connectedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <div className="inline-flex items-center space-x-3 px-6 py-3 rounded-full bg-green-500/20 border border-green-500/30">
              <Check className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-medium">
                {connectedCount} platform{connectedCount !== 1 ? 's' : ''} connected
              </span>
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-between items-center pt-6"
        >
          <button
            onClick={onPrev}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="flex items-center space-x-4">
            <button
              onClick={onSkip}
              className="px-6 py-3 rounded-xl text-white/60 hover:text-white/80 hover:bg-white/5 transition-all duration-300"
            >
              Skip for now
            </button>
            
            <button
              onClick={onNext}
              disabled={isSubmitting}
              className="px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 bg-gradient-to-r from-purple-500 to-cyan-400 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
            >
              {isSubmitting ? 'Processing...' : 'Continue'}
            </button>
          </div>
        </motion.div>

        {/* OAuth Security Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <p className="text-white/40 text-xs">
            🔒 All connections are secure and can be removed at any time
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}