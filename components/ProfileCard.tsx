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
        <div className="relative mx-auto mb-6">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center border-2 border-cyan-500/30">
            {userData.avatar ? (
              <img
                src={userData.avatar}
                alt={userData.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-cyan-400" />
            )}
          </div>
          {/* Online indicator */}
          <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-900"></div>
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

        {/* Status Badge */}
        <div className="mb-6">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-full border border-green-500/30">
            <Award className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-semibold">{userData.status}</span>
          </div>
          <p className="text-white/60 text-sm mt-2">
            {userData.statusDescription}
          </p>
        </div>

        {/* Edit Profile Button */}
        <button type="button" className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 rounded-lg font-semibold text-white transition-all duration-200 transform hover:scale-105">
          <Edit3 className="w-4 h-4" />
          <span>Edit Profile</span>
        </button>
      </GlassCard>
    </motion.div>
  );
}