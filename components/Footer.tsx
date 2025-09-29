import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Instagram, Linkedin, MessageCircle } from "lucide-react";

const Footer = () => (
  <footer className="bg-[#0D0D0D] text-white border-t border-[#E0E0DC]/10 px-6 md:px-12 lg:px-20 pt-12 pb-6">
    {/* Tagline */}
    <div className="max-w-7xl mx-auto mb-8 text-center">
      <h2 className="text-xl md:text-2xl font-bold text-[#F5F5F5]">
        The Global Benchmark for Hiring
      </h2>
    </div>

    {/* Centered Nav Links */}
    <nav className="max-w-7xl mx-auto text-sm text-white/90 flex justify-center mb-6 flex-wrap gap-x-6 gap-y-2 text-center">
      <Link href="/" className="hover:text-[#00D9FF] transition">
        Home
      </Link>
      <Link href="/about" className="hover:text-[#00D9FF] transition">
        About
      </Link>
      <Link href="/join" className="hover:text-[#00D9FF] transition">
        Join
      </Link>
      <Link href="/contact" className="hover:text-[#00D9FF] transition">
        Contact
      </Link>
      <Link href="/privacy" className="hover:text-[#00D9FF] transition">
        Privacy Policy
      </Link>
    </nav>

    {/* Logo + Social Icons */}
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 px-2 mb-6">
      {/* Logo */}
      <div className="flex justify-center md:justify-start w-full md:w-auto">
        <Image
          src="/assets/logo.png"
          alt="Velric Logo"
          width={100}
          height={30}
        />
      </div>

      {/* Social Icons using Lucide */}
      <div className="flex justify-center md:justify-end w-full md:w-auto space-x-6">
        {/* WhatsApp */}
        <a
          href="https://wa.me/17787723980"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="hover:opacity-80 transition"
        >
          <MessageCircle size={24} className="text-white" />
        </a>

        {/* LinkedIn */}
        <a
          href="https://www.linkedin.com/company/velric"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="hover:opacity-80 transition"
        >
          <Linkedin size={24} className="text-white" />
        </a>

        {/* Instagram */}
        <a
          href="https://www.instagram.com/velric.ai/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="hover:opacity-80 transition"
        >
          <Instagram size={24} className="text-white" />
        </a>
      </div>
    </div>

    {/* Cookies & Copyright */}
    <div className="max-w-7xl mx-auto text-xs text-white/60 text-center border-t border-white/10 pt-4">
      <p>© {new Date().getFullYear()} Velric. All rights reserved.</p>
      <p className="text-[10px] mt-1">
        This site uses cookies to enhance your experience.
      </p>
    </div>
  </footer>
);

export default Footer;
