import { useState } from "react";
import Image from "next/image";
import { User, Bell, LogOut, Settings } from "lucide-react";

interface TopNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userData: any;
}

export default function TopNavigation({ activeTab, setActiveTab, userData }: TopNavigationProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "missions", label: "Missions" },
    { id: "grading", label: "Grading" },
    { id: "analytics", label: "Analytics" },
    { id: "settings", label: "Settings" }
  ];

  const handleLogout = () => {
    localStorage.clear()
    window.location.href = "/";
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/90 backdrop-blur-xl border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 min-h-[4rem]">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center h-8 overflow-hidden">
              <Image
                src="/assets/logo.png"
                alt="Velric Logo"
                width={80}
                height={24}
                className="brightness-110 max-h-6 max-w-[80px] w-auto object-contain"
                style={{ height: 'auto' }}
              />
            </div>
            
            {/* Navigation Tabs */}
            <div className="hidden md:flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Profile Icon */}
            <button
              onClick={() => setActiveTab("profile")}
              className={`p-2 rounded-lg transition-all duration-200 ${
                activeTab === "profile"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
              aria-label="Profile"
              title="Profile"
            >
              <User size={20} />
            </button>

            {/* Notification Bell */}
            <button 
              className="p-2 text-gray-400 hover:text-white transition-colors"
              aria-label="Notifications"
            >
              <Bell size={20} />
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <span className="hidden md:block text-sm font-medium text-white">
                  {userData.name}
                </span>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg border border-gray-700 py-2">
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="text-sm font-medium text-white">{userData.name}</p>
                    <p className="text-xs text-gray-400">{userData.email}</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("settings")}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    <Settings size={16} />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-400 hover:bg-gray-800"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}