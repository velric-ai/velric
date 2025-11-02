import { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Target, 
  BarChart3, 
  User, 
  Settings,
  Bell
} from 'lucide-react';

interface DashboardNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  notificationCount?: number;
}

export default function DashboardNavigation({ 
  activeTab, 
  onTabChange, 
  notificationCount = 3 
}: DashboardNavigationProps) {
  const router = useRouter();
  
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, route: '/dashboard' },
    { id: 'missions', label: 'Missions', icon: Target, route: '/missions' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, route: '/analytics' },
    { id: 'settings', label: 'Settings', icon: Settings, route: '/settings' },
  ];

  const handleTabClick = (tab: any) => {
    if (tab.id === 'analytics') {
      router.push('/analytics');
    } else if (tab.id === 'profile') {
      router.push('/profile');
    } else if (tab.id === 'dashboard') {
      router.push('/user-dashboard');
    } else {
      // Use existing tab change logic for other tabs
      onTabChange(tab.id);
    }
  };

  // Determine active tab based on current route
  const getCurrentActiveTab = () => {
    const currentPath = router.pathname;
    if (currentPath === '/analytics') return 'analytics';
    if (currentPath === '/profile') return 'profile';
    if (currentPath === '/dashboard' || currentPath === '/user-dashboard') return 'dashboard';
    return activeTab;
  };

  return (
    <nav className="glass-nav fixed top-0 left-0 right-0 z-50 h-16">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <img
            src="/assets/logo.png"
            alt="Velric Logo"
            className="h-8 brightness-110"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = getCurrentActiveTab() === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className={`glass-tab flex items-center space-x-2 ${isActive ? 'active' : ''}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Right Side - Notifications & Profile */}
        <div className="flex items-center space-x-4">
          {/* Notification Bell */}
          <motion.button
            className="relative p-2 rounded-lg hover:bg-white/5 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Bell className="w-5 h-5 text-white/80" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </motion.button>

          {/* Profile Icon */}
          <motion.button
            onClick={() => router.push('/profile')}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            title="Go to Profile"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <User className="w-5 h-5 text-white/70 hover:text-white" />
          </motion.button>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <span className="text-sm font-bold text-white">V</span>
            </div>
            <span className="text-sm font-medium text-white">Velric AI</span>
          </div>
        </div>
      </div>
    </nav>
  );
}