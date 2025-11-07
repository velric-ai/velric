"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement | null>(null);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() =>  {
    if (!isMobile) {
      setHidden(false);
      return;
    }
    const SHOW_AT_TOP = 8;
    const HIDE_DELTA = 8;


    lastY.current = window.scrollY

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;

    if (y <= SHOW_AT_TOP) {
      setHidden(false);
    } else {
      if (delta > HIDE_DELTA) {
        setHidden(true);
      }
    }
    lastY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobile]);

  useEffect(() => {
    const updateBodyPadding = () => {
      if (!navRef.current) return;
      const height = navRef.current.offsetHeight;
      document.body.style.paddingTop = `${height + 4}px`;
    };

    updateBodyPadding();
    window.addEventListener("resize", updateBodyPadding);
    window.addEventListener("load", updateBodyPadding);

    return () => {
      window.removeEventListener("resize", updateBodyPadding);
      window.removeEventListener("load", updateBodyPadding);
      document.body.style.paddingTop = "";
    };
  }, [pathname]);

  return (
    <nav
      ref={navRef}
      className={[
      "fixed top-0 left-0 w-full z-50 bg-black text-white shadow-md",
      "transition-transform duration-300 will-change-transform",
      "pt-[max(env(safe-area-inset-top),0px)]",
      // hide only on mobile
      isMobile && hidden ? "-translate-y-full" : "translate-y-0",
  ].join(" ")}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo */}
        <div className="flex justify-center md:justify-start">
          <Link href="/" className="hover:opacity-85 transition-opacity">
            <Image
              src="/assets/logo.png"
              alt="Velric Logo"
              width={120}
              height={40}
              priority
              className="brightness-110"
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex justify-center gap-5 text-white font-medium text-sm sm:text-base flex-wrap">
          {[
            { name: "Home", href: "/" },
            { name: "About", href: "/about" },
            { name: "Join", href: "/join" },
            { name: "Request Demo", href: "/contact" },
            { name: "Merch", href: "/merch" },
          ].map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="relative group whitespace-nowrap hover:text-purple-400 transition-colors duration-300"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center md:justify-end w-full md:w-auto">
          <Link href="/join">
            <button className="bg-gradient-to-r from-[#9333EA] to-[#06B6D4] text-white px-5 py-2.5 text-sm sm:text-base rounded-full font-semibold hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 whitespace-nowrap">
              Join Early Access
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
