import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import { Github, Code, Trophy, MessageCircle, Linkedin, X, Plus } from 'lucide-react';

interface PlatformConnection {
  name: string;
  icon: 'github' | 'codesignal' | 'hackerrank' | 'discord' | 'linkedin';
  connected: boolean;
  status: 'public' | 'private' | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

interface ConnectedPlatformsSectionProps {
  platforms: PlatformConnection[];
  onConnectMore: () => void;
}

export default function ConnectedPlatformsSection({ 
  platforms, 
  onConnectMore 
}: ConnectedPlatformsSectionProps) {
  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'github':
        return Github;
      case 'codesignal':
        return Code;
      case 'hackerrank':
        return Trophy;
      case 'discord':
        return MessageCircle;
      case 'linkedin':
        return Linkedin;
      default:
        return Github;
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-white">Connected Platforms</h3>
      
      <GlassCard className="p-6">
        <div className="space-y-4">
          {platforms.map((platform, index) => {
            const Icon = getIcon(platform.icon);
            
            return (
              <motion.div
                key={platform.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
              >
                {/* Platform Info */}
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{platform.name}</h4>
                    <p className="text-white/60 text-sm">
                      {platform.connected ? 'Connected' : 'Not Connected'}
                    </p>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center space-x-3">
                  {platform.connected ? (
                    <>
                      {/* Status Badge */}
                      <span className={`badge ${
                        platform.status === 'public' ? 'badge-public' : 'badge-private'
                      }`}>
                        {platform.status}
                      </span>
                      
                      {/* Disconnect Button */}
                      <motion.button
                        onClick={platform.onDisconnect}
                        className="w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center text-red-400 hover:text-red-300 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    </>
                  ) : (
                    /* Connect Button */
                    <motion.button
                      onClick={platform.onConnect}
                      className="badge-connect px-4 py-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Connect
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Connect More Platforms Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: platforms.length * 0.1 + 0.2, duration: 0.5 }}
            onClick={onConnectMore}
            className="w-full p-4 border-2 border-dashed border-white/20 rounded-lg hover:border-white/40 hover:bg-white/5 transition-colors flex items-center justify-center space-x-2 text-white/60 hover:text-white/80"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Connect More Platforms</span>
          </motion.button>
        </div>
      </GlassCard>
    </div>
  );
}