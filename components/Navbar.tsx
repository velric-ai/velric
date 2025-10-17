// components/Navbar.tsx
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 px-4 sm:px-6 py-4 transition-all duration-300 ${
      isScrolled 
        ? 'bg-black/90 backdrop-blur-xl shadow-lg' 
        : 'bg-transparent'
    }`}>
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
          <Link href="/" className="whitespace-nowrap hover:text-purple-400 transition-colors duration-300 relative group">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/about" className="whitespace-nowrap hover:text-purple-400 transition-colors duration-300 relative group">
            About
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/join" className="whitespace-nowrap hover:text-purple-400 transition-colors duration-300 relative group">
            Join
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/contact" className="whitespace-nowrap hover:text-purple-400 transition-colors duration-300 relative group">
            Request Demo
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/generate" className="whitespace-nowrap hover:text-purple-400 transition-colors duration-300 relative group">
            Missions
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>

        {/* Join button */}
        <div className="w-full md:w-auto flex justify-center md:justify-end mt-3 md:mt-0">
          <Link href="/join">
            <button className="bg-gradient-to-r from-[#9333EA] to-[#06B6D4] text-white px-6 py-3 text-sm sm:text-base rounded-full font-semibold hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 whitespace-nowrap w-full max-w-xs md:w-auto">
              Join Early Access
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}