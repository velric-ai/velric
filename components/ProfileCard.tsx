import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import { User, Mail, Award, Edit3 } from 'lucide-react';

interface ProfileCardProps {
  user?: {
    name?: string;
    email?: string;
    avatar?: string;
    status?: string;
    statusDescription?: string;
  };
}

export default function ProfileCard({ user }: ProfileCardProps) {
  // Mock user data if not provided
  const userData = user || {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/assets/default-avatar.png",
    status: "Top 5%",
    statusDescription: "You're in the top 5% of all Velric users"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <GlassCard className="p-8 text-center" glow="cyan">
        {/* Avatar */}
        <div className="relative inline-block mb-6">
          <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center border-2 border-cyan-500/30 overflow-hidden">
            {userData.avatar ? (
              <img
                src={userData.avatar}
                alt={userData.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 md:w-16 md:h-16 text-cyan-400" />
            )}
          </div>
          {/* Online indicator - positioned at bottom right of avatar */}
          <div className="absolute bottom-0 right-0 w-5 h-5 md:w-6 md:h-6 bg-green-500 rounded-full border-[3px] border-white shadow-lg z-10" style={{ boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.3)' }}></div>
        </div>

        {/* User Info */}
        <div className="space-y-4 mb-6">
          <h2 className="text-2xl font-bold text-white">
            {userData.name}
          </h2>
          
          <div className="flex items-center justify-center space-x-2 text-white/60">
            <Mail className="w-4 h-4" />
            <span className="text-sm">{userData.email}</span>
          </div>
        </div>

      </GlassCard>
    </motion.div>
  );
}