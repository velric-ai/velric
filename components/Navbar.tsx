// components/Navbar.tsx
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/authContext";
import { supabase } from "@/lib/supabaseClient";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 px-4 sm:px-6 py-4 transition-all duration-300 ${
        isScrolled
          ? "bg-black/90 backdrop-blur-xl shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center md:flex-row md:justify-between gap-4">
        {/* Logo (hidden on small screens) */}
        <div className="hidden md:block">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image
              src="/assets/logo.png"
              alt="Velric Logo"
              width={120}
              height={40}
              className="brightness-110"
            />
          </Link>
        </div>

        {/* Menu links */}
        <div className="flex justify-center gap-8 text-white font-medium text-sm sm:text-base flex-wrap w-full md:w-auto">
          <Link
            href="/"
            className="whitespace-nowrap hover:text-purple-400 transition-colors duration-300 relative group"
          >
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            href="/about"
            className="whitespace-nowrap hover:text-purple-400 transition-colors duration-300 relative group"
          >
            About
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            href="/faq"
            className="whitespace-nowrap hover:text-purple-400 transition-colors duration-300 relative group"
          >
            FAQ
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            href="/contact"
            className="whitespace-nowrap hover:text-purple-400 transition-colors duration-300 relative group"
          >
            Request Demo
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            href="/merch"
            className="whitespace-nowrap hover:text-purple-400 transition-colors duration-300 relative group"
          >
            Merch
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>

        {/* Auth buttons or Profile dropdown */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-end mt-3 md:mt-0">
          {loading ? (
            <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
          ) : user ? (
            // Profile dropdown when logged in
            <div className="relative group">
              <button className="flex items-center gap-2 text-white px-4 py-2 rounded-full border border-purple-400 hover:bg-purple-400/10 transition-all duration-300">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {user.user_metadata?.full_name?.charAt(0) ||
                    user.email?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block">
                  {user.user_metadata?.full_name || "Profile"}
                </span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown menu */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-black/90 backdrop-blur-xl border border-purple-400/30 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="p-4 border-b border-purple-400/20">
                  <p className="text-white font-semibold text-sm truncate">
                    {user.user_metadata?.full_name || user.email}
                  </p>
                </div>
                <Link
                  href="/profile"
                  className="block px-4 py-3 text-white hover:bg-purple-400/10 transition-colors duration-300"
                >
                  My Profile
                </Link>
                <Link
                  href="/dashboard"
                  className="block px-4 py-3 text-white hover:bg-purple-400/10 transition-colors duration-300"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-400/10 transition-colors duration-300 border-t border-purple-400/20"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            // Login & Register buttons when not logged in
            <>
              <Link href="/login">
                <button className="text-white px-6 py-3 text-sm sm:text-base rounded-full font-semibold border border-purple-400 hover:bg-purple-400/10 transition-all duration-300 whitespace-nowrap w-full max-w-xs md:w-auto">
                  Login
                </button>
              </Link>
              <Link href="/register">
                <button className="bg-gradient-to-r from-[#9333EA] to-[#06B6D4] text-white px-6 py-3 text-sm sm:text-base rounded-full font-semibold hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 whitespace-nowrap w-full max-w-xs md:w-auto">
                  Register
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
