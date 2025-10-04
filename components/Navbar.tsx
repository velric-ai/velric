// components/Navbar.tsx

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const [learnOpen, setLearnOpen] = useState(false);
  return (
    <nav className="w-full bg-black px-6 py-4 border-b border-[#222]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Logo and Links */}
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center group">
            <Image src="/assets/logo.png" alt="Velric V" width={60} height={60} />
          </Link>
          <div className="flex items-center gap-8 ml-6">
            <Link href="/pricing" className="text-white text-base font-medium hover:opacity-80 transition">Pricing</Link>
            <Link href="/enterprise" className="text-white text-base font-medium hover:opacity-80 transition">Enterprise</Link>
            <div className="relative">
              <button
                className="text-white text-base font-medium flex items-center gap-1 hover:opacity-80 transition focus:outline-none"
                onClick={() => setLearnOpen((v) => !v)}
                onBlur={() => setTimeout(() => setLearnOpen(false), 150)}
                aria-haspopup="true"
                aria-expanded={learnOpen}
              >
                Learn
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {learnOpen && (
                <div className="absolute left-0 mt-2 w-40 bg-black border border-[#222] rounded shadow-lg z-10">
                  <Link href="/blog" className="block px-4 py-2 text-white hover:bg-[#181818]">Blog</Link>
                  <Link href="/resources" className="block px-4 py-2 text-white hover:bg-[#181818]">Resources</Link>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Right: CTA Button */}
        <div>
          <Link href="/join">
            <button className="border border-white text-white px-6 py-2 rounded-full font-medium text-base hover:bg-white hover:text-black transition-all">
              Join Early Access
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}