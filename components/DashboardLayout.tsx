import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Home,
  User,
  FileText,
  MessageSquare,
  Bell,
  HelpCircle,
  LogOut,
  Menu,
  X,
  ChevronDown
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("velric_user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      // Redirect to login if no user data found
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("velric_user");
    router.push("/login");
  };

  const navigationItems = [
    { name: "Overview", href: "/dashboard", icon: Home },
    { name: "Profile", href: "/dashboard/profile", icon: User },
    { name: "Applications", href: "/dashboard/applications", icon: FileText },
    { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
    { name: "Support", href: "/dashboard/support", icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1C1C1E] transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
          <Link href="/dashboard">
            <img
              src="/assets/logo.png"
              alt="Velric Logo"
              className="h-8 brightness-110"
            />
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-white/70 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          {navigationItems.map((item) => {
            const isActive = router.pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-colors ${
                  isActive
                    ? "bg-purple-500/20 text-purple-400"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="h-16 bg-[#1C1C1E]/80 backdrop-blur-xl border-b border-white/10 fixed top-0 right-0 left-0 lg:left-64 z-40">
          <div className="h-full px-4 flex items-center justify-between">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-white/70 hover:text-white"
            >
              <Menu size={24} />
            </button>

            {/* Right section */}
            <div className="flex items-center gap-4 ml-auto">
              {/* Notifications */}
              <button className="text-white/70 hover:text-white relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
              </button>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 text-sm hover:text-white/90 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-medium">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="hidden sm:block">{user?.name || "User"}</span>
                  <ChevronDown size={16} />
                </button>

                {/* Dropdown menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#1C1C1E] border border-white/10 rounded-lg shadow-lg py-1">
                    <Link
                      href="/dashboard/profile"
                      className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5"
                    >
                      Your Profile
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/5"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="pt-16 min-h-screen">{children}</main>
      </div>

      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}