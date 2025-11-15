import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Target, 
  BarChart3, 
  User, 
  Settings,
  LogOut,
  ChevronDown
} from 'lucide-react';

interface DashboardNavigationProps {
  activeTab?: string;
}

export default function DashboardNavigation({ 
  activeTab 
}: DashboardNavigationProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Load user data
  useEffect(() => {
    const userData = localStorage.getItem("velric_user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showUserDropdown && !target.closest('.user-dropdown-container')) {
        setShowUserDropdown(false);
      }
    };

    if (showUserDropdown) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showUserDropdown]);

  const handleLogout = () => {
    localStorage.removeItem("velric_user");
    router.push("/");
  };

  // Determine active tab based on current route
  const getCurrentActiveTab = () => {
    if (activeTab) return activeTab;
    const currentPath = router.pathname;
    
    if (currentPath === '/analytics') return 'analytics';
    if (currentPath === '/profile') return 'profile';
    if (currentPath === '/missions') return 'missions';
    if (currentPath === '/settings') return 'settings';
    if (currentPath === '/dashboard' || currentPath === '/user-dashboard') return 'dashboard';
    return 'dashboard';
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, route: '/user-dashboard' },
    { id: 'missions', label: 'Missions', icon: Target, route: '/missions' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, route: '/analytics' },
    { id: 'settings', label: 'Settings', icon: Settings, route: '/settings' },
  ];

  const currentActiveTab = getCurrentActiveTab();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16" style={{
      background: 'rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
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
            const isActive = currentActiveTab === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => {
                  router.push(tab.route);
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${isActive
                  ? 'bg-purple-500/30 text-white border border-purple-500/50'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Right Side - Profile & User Dropdown */}
        <div className="flex items-center space-x-4">
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

          {/* User Dropdown */}
          <div className="relative user-dropdown-container">
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                setShowUserDropdown(!showUserDropdown);
              }}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                <span className="text-sm font-bold text-white">{user?.name?.charAt(0)?.toUpperCase() || 'V'}</span>
              </div>
              <span className="text-sm font-medium text-white">{user?.name || 'User'}</span>
              <ChevronDown className={`w-4 h-4 text-white/60 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
            </motion.button>

            {/* Dropdown Menu */}
            {showUserDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-full mt-2 w-48 rounded-xl overflow-hidden z-50"
                style={{
                  background: 'rgba(0, 0, 0, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                }}
              >
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUserDropdown(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-white/5 transition-colors"
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-medium text-white">Logout</span>
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}