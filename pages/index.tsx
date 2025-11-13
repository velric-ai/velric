import Head from "next/head";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";

import Footer from "@/components/Footer";


import InteractiveAIVisual from "@/components/InteractiveAIVisual";
import HumanAIConnection from "@/components/HumanAIConnection";
import InteractiveDashboard from "@/components/InteractiveDashboard";
import MissionFlow from "@/components/MissionFlow";
import CircularProgressRing from "@/components/CircularProgressRing";
import AnimatedDashboard from "@/components/AnimatedDashboard";
import ConnectionAnimation from "@/components/ConnectionAnimation";
import { Compare } from "@/components/ui/compare";
import { HoverTiltCard } from "@/components/ui/hover-tilt-card";
import { motion, useInView } from "framer-motion";
import React, { useRef, useEffect } from "react";
import { Circle, Triangle } from "lucide-react";
import { AnimatedCircularProgress, AnimatedAIDashboard, AnimatedTalentCompanies } from "@/components/ui/animated-dashboard-components";
import { Timeline } from "@/components/TimelineScroll";

export default function Home() {
  // Custom cursor glow effect
  useEffect(() => {
    const cursor = document.createElement('div');
    cursor.classList.add('cursor-glow');
    document.body.appendChild(cursor);

    const handleMouseMove = (e: MouseEvent) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (document.body.contains(cursor)) {
        document.body.removeChild(cursor);
      }
    };
  }, []);

  // Advanced purple bar removal
  useEffect(() => {
    const removePurpleBars = () => {
      // Find all elements that could be bars
      const allElements = document.querySelectorAll('div, section, hr');

      allElements.forEach(element => {
        const htmlElement = element as HTMLElement;
        const styles = window.getComputedStyle(element);
        const height = htmlElement.offsetHeight;
        const width = htmlElement.offsetWidth;
        const bgColor = styles.backgroundColor;

        // Check if element is a thin horizontal bar with purple color
        const isBar = (
          height <= 15 &&
          width > 100 &&
          (
            bgColor.includes('147, 51, 234') ||
            bgColor.includes('168, 85, 247') ||
            bgColor.includes('192, 132, 252') ||
            bgColor.includes('147, 51, 234')
          )
        );

        if (isBar) {
          htmlElement.style.display = 'none';
          element.remove(); // Completely remove from DOM
        }
      });

      // Remove all HR elements
      document.querySelectorAll('hr').forEach(hr => hr.remove());

      // Remove pseudo-elements by hiding parent
      const elementsWithBars = document.querySelectorAll('section, .section, .hero-section, .about-section');
      elementsWithBars.forEach(el => {
        (el as HTMLElement).style.setProperty('--remove-bars', 'none', 'important');
      });
    };

    // Execute immediately
    removePurpleBars();

    // Execute after DOM is fully loaded
    const timeout1 = setTimeout(removePurpleBars, 500);
    const timeout2 = setTimeout(removePurpleBars, 1500);

    // Create a mutation observer to catch dynamically added bars
    const observer = new MutationObserver(removePurpleBars);
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <Head>
        <title>Velric | Global Benchmark for Hiring </title>
        <meta
          name="description"
          content="AI-powered challenges built from actual work."
        />
        <link rel="icon" href="/assets/logo.png" />
      </Head>

      <main className="bg-[#0D0D0D] text-white font-sans antialiased overflow-x-hidden relative">
        {/* Floating decorative elements */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <Circle
            className="absolute top-32 left-16 text-purple-500/15 floating-element"
            size={80}
            fill="currentColor"
          />
          <Triangle
            className="absolute top-1/2 right-24 text-purple-400/10 floating-element"
            size={60}
            fill="currentColor"
          />

          <div className="absolute top-2/3 right-16 w-24 h-24 bg-gradient-to-r from-purple-500/8 to-purple-300/8 rounded-full blur-xl floating-element"></div>
          <div className="absolute bottom-32 left-20 w-20 h-20 bg-gradient-to-l from-purple-400/12 to-purple-600/12 rounded-lg rotate-45 floating-element"></div>
        </div>

        <Navbar />

        {/* Hero Section */}
        <HeroSection />

        {/* 🎥 Hero Demo Video */}
        {(() => {
          const videoRef = React.useRef<HTMLVideoElement>(null);
          const sectionRef = React.useRef(null);
          const isInView = useInView(sectionRef, { amount: 0.1 });

          React.useEffect(() => {
            const video = videoRef.current;
            if (!video) return;

            let timeout: NodeJS.Timeout;

            const handleEnded = () => {
              timeout = setTimeout(() => {
                video.currentTime = 0;
                video.play();
              }, 1000); 
            };

            if (isInView) {
              video.currentTime = 0;
              video.play();
              video.addEventListener("ended", handleEnded);
            } else {
              video.pause();
              video.removeEventListener("ended", handleEnded);
            }

            return () => {
              clearTimeout(timeout);
              video.removeEventListener("ended", handleEnded);
            };
          }, [isInView]);

          return (
            <section
              ref={sectionRef}
              className="relative flex justify-center items-center bg-black py-12"
            >
              <motion.video
                ref={videoRef}
                className="rounded-2xl shadow-2xl w-[90%] max-w-5xl border border-purple-500/20"
                src="/velricdemo.mp4"
                muted
                playsInline
              />
            </section>
          );
        })()}



        {/* 🧠 Problem Statement - Enhanced with Animations */}
        <section className="next-section px-4 md:px-8 lg:px-16 py-20 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center section-spacing relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Companies recruit through <strong className="text-purple-400">AI missions</strong>, and every candidate earns a <strong className="text-purple-300">Velric Score</strong> that proves real ability.
            </motion.h2>
            <motion.p
              className="text-white/80 text-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              The resume is a <strong className="text-purple-400">1930s invention</strong>. We&apos;re building its <strong className="text-purple-300">replacement</strong>. <strong className="text-purple-400">Velric</strong> turns real work into measurable proof. <strong className="text-purple-300">AI built missions</strong> test ability, and your <strong className="text-purple-500">Velric Score</strong> becomes the new standard companies hire through.
            </motion.p>
          </motion.div>
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            <div className="w-full max-w-md">
              <InteractiveAIVisual />
            </div>
          </motion.div>
        </section>

{/* ⚙️ How Velric Works - CUSTOM ANIMATIONS */}
<section className="px-4 md:px-8 lg:px-16 py-12 section-spacing relative z-10">
  <motion.h2
    className="text-4xl md:text-5xl font-extrabold mb-16 text-center text-white"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
  >
    How <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">Velric</span> Works
  </motion.h2>

  {/* Desktop Layout */}
  <div className="hidden lg:block max-w-7xl mx-auto">
    {/* Timeline Line */}
    <div className="relative flex items-center justify-between mb-20">
      <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 transform -translate-y-1/2 z-0 rounded-full"></div>

      {/* Step Numbers */}
      <motion.div
        className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        1
      </motion.div>
      <motion.div
        className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-lg"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        2
      </motion.div>
      <motion.div
        className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-xl font-bold shadow-lg"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        3
      </motion.div>
    </div>

    {/* Cards Row */}
    <div className="grid grid-cols-3 gap-6 mt-16">
      {/* CARD 1: ANIMATED CHESS PIECES */}
      <motion.div
        className="h-[380px] w-full"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        <div className="relative group w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#1C1C1E] to-[#2A1A3A] border border-purple-500/20 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105">
          {/* Animated Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-transparent opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>

          {/* Grid Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: 'linear-gradient(rgba(147, 51, 234, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(147, 51, 234, 0.3) 1px, transparent 1px)',
              backgroundSize: '30px 30px'
            }}></div>
          </div>

          {/* Content Container */}
          <div className="relative z-10 flex flex-col items-center justify-between h-full p-6">
            {/* Title */}
            <div className="text-center pt-4">
              <h3 className="text-2xl font-bold text-white mb-2">
                Take Real-World
              </h3>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
                Missions
              </h3>
            </div>

            {/* Animated Chess Pieces */}
            <div className="flex-1 flex items-center justify-center w-full relative">
              {/* King - Center - Most Detailed */}
              <motion.div
                className="absolute"
                style={{ bottom: '25%' }}
                animate={{
                  y: [0, -10, 0],
                  scale: [1, 1.08, 1],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0
                }}
              >
                <svg width="90" height="90" viewBox="0 0 100 100" fill="none" className="drop-shadow-2xl">
                  {/* Cross on top */}
                  <rect x="46" y="8" width="8" height="16" rx="2" fill="url(#purpleGrad)" stroke="#c084fc" strokeWidth="1"/>
                  <rect x="42" y="12" width="16" height="8" rx="2" fill="url(#purpleGrad)" stroke="#c084fc" strokeWidth="1"/>
                  {/* Crown top */}
                  <circle cx="50" cy="30" r="6" fill="url(#purpleGrad)" stroke="#c084fc" strokeWidth="1.5"/>
                  {/* Crown body with points */}
                  <path d="M35 35 L40 45 L45 38 L50 48 L55 38 L60 45 L65 35 Z" fill="url(#purpleGrad)" stroke="#c084fc" strokeWidth="1.5"/>
                  {/* Main body */}
                  <path d="M38 45 Q36 50 38 60 L62 60 Q64 50 62 45 Z" fill="rgba(147, 51, 234, 0.4)" stroke="#a855f7" strokeWidth="2"/>
                  <ellipse cx="50" cy="60" rx="16" ry="4" fill="rgba(147, 51, 234, 0.3)" stroke="#a855f7" strokeWidth="1.5"/>
                  {/* Base */}
                  <path d="M32 60 L32 70 Q32 75 37 75 L63 75 Q68 75 68 70 L68 60 Z" fill="url(#purpleGrad)" stroke="#c084fc" strokeWidth="2"/>
                  <ellipse cx="50" cy="75" rx="20" ry="5" fill="rgba(147, 51, 234, 0.5)" stroke="#a855f7" strokeWidth="2"/>
                  <defs>
                    <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#c084fc" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>

              {/* Queen - Left */}
              <motion.div
                className="absolute"
                style={{ left: '12%', bottom: '22%' }}
                animate={{
                  y: [0, -12, 0],
                  rotate: [-3, 3, -3],
                }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.3
                }}
              >
                <svg width="75" height="75" viewBox="0 0 100 100" fill="none" className="drop-shadow-xl">
                  {/* Crown with 5 points */}
                  <circle cx="30" cy="20" r="4" fill="#c084fc"/>
                  <circle cx="42" cy="15" r="4" fill="#c084fc"/>
                  <circle cx="50" cy="12" r="5" fill="#c084fc"/>
                  <circle cx="58" cy="15" r="4" fill="#c084fc"/>
                  <circle cx="70" cy="20" r="4" fill="#c084fc"/>
                  {/* Crown base */}
                  <path d="M28 22 L30 35 L42 28 L50 38 L58 28 L70 35 L72 22 Z" fill="rgba(147, 51, 234, 0.4)" stroke="#a855f7" strokeWidth="2"/>
                  {/* Body */}
                  <path d="M35 35 Q33 45 36 62 L64 62 Q67 45 65 35 Z" fill="rgba(147, 51, 234, 0.4)" stroke="#a855f7" strokeWidth="2"/>
                  <ellipse cx="50" cy="62" rx="18" ry="4" fill="rgba(147, 51, 234, 0.3)" stroke="#a855f7" strokeWidth="1.5"/>
                  {/* Base */}
                  <path d="M30 62 L30 72 Q30 77 35 77 L65 77 Q70 77 70 72 L70 62 Z" fill="url(#purpleGrad2)" stroke="#c084fc" strokeWidth="2"/>
                  <ellipse cx="50" cy="77" rx="22" ry="5" fill="rgba(147, 51, 234, 0.5)" stroke="#a855f7" strokeWidth="2"/>
                  <defs>
                    <linearGradient id="purpleGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#c084fc" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>

              {/* Rook - Right */}
              <motion.div
                className="absolute"
                style={{ right: '12%', bottom: '24%' }}
                animate={{
                  y: [0, -8, 0],
                  scale: [1, 1.06, 1],
                }}
                transition={{
                  duration: 2.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.6
                }}
              >
                <svg width="70" height="70" viewBox="0 0 100 100" fill="none" className="drop-shadow-xl">
                  {/* Battlements */}
                  <rect x="30" y="15" width="10" height="12" fill="url(#purpleGrad3)" stroke="#c084fc" strokeWidth="1.5"/>
                  <rect x="45" y="15" width="10" height="12" fill="url(#purpleGrad3)" stroke="#c084fc" strokeWidth="1.5"/>
                  <rect x="60" y="15" width="10" height="12" fill="url(#purpleGrad3)" stroke="#c084fc" strokeWidth="1.5"/>
                  {/* Top platform */}
                  <rect x="28" y="27" width="44" height="8" rx="2" fill="rgba(147, 51, 234, 0.5)" stroke="#a855f7" strokeWidth="2"/>
                  {/* Tower body */}
                  <path d="M32 35 L32 65 L68 65 L68 35 Z" fill="rgba(147, 51, 234, 0.4)" stroke="#a855f7" strokeWidth="2"/>
                  {/* Decorative band */}
                  <rect x="32" y="48" width="36" height="4" fill="rgba(147, 51, 234, 0.6)"/>
                  {/* Base */}
                  <path d="M28 65 L28 73 Q28 77 32 77 L68 77 Q72 77 72 73 L72 65 Z" fill="url(#purpleGrad3)" stroke="#c084fc" strokeWidth="2"/>
                  <ellipse cx="50" cy="77" rx="24" ry="5" fill="rgba(147, 51, 234, 0.5)" stroke="#a855f7" strokeWidth="2"/>
                  <defs>
                    <linearGradient id="purpleGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#c084fc" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>

              {/* Bishop - Far Left */}
              <motion.div
                className="absolute"
                style={{ left: '2%', bottom: '28%' }}
                animate={{
                  y: [0, -7, 0],
                  rotate: [-2, 2, -2],
                }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.9
                }}
              >
                <svg width="65" height="65" viewBox="0 0 100 100" fill="none" className="drop-shadow-lg">
                  {/* Top sphere with cross */}
                  <circle cx="50" cy="18" r="6" fill="#c084fc" stroke="#e9d5ff" strokeWidth="1.5"/>
                  <line x1="50" y1="24" x2="50" y2="30" stroke="#e9d5ff" strokeWidth="2"/>
                  {/* Mitre top */}
                  <ellipse cx="50" cy="30" rx="8" ry="4" fill="rgba(147, 51, 234, 0.5)" stroke="#a855f7" strokeWidth="1.5"/>
                  {/* Curved body - bishop's mitre shape */}
                  <path d="M42 30 Q38 40 38 50 Q38 58 42 65 L58 65 Q62 58 62 50 Q62 40 58 30 Z" fill="rgba(147, 51, 234, 0.4)" stroke="#a855f7" strokeWidth="2"/>
                  {/* Decorative diagonal cut */}
                  <line x1="42" y1="45" x2="58" y2="45" stroke="#c084fc" strokeWidth="2"/>
                  {/* Neck */}
                  <ellipse cx="50" cy="65" rx="12" ry="3" fill="rgba(147, 51, 234, 0.3)" stroke="#a855f7" strokeWidth="1.5"/>
                  {/* Base */}
                  <path d="M35 65 L35 73 Q35 77 39 77 L61 77 Q65 77 65 73 L65 65 Z" fill="url(#purpleGrad4)" stroke="#c084fc" strokeWidth="2"/>
                  <ellipse cx="50" cy="77" rx="18" ry="5" fill="rgba(147, 51, 234, 0.5)" stroke="#a855f7" strokeWidth="2"/>
                  <defs>
                    <linearGradient id="purpleGrad4" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#c084fc" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>

              {/* Knight - Far Right */}
              <motion.div
                className="absolute"
                style={{ right: '2%', bottom: '26%' }}
                animate={{
                  y: [0, -9, 0],
                  x: [0, 3, 0],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.2
                }}
              >
                <svg width="68" height="68" viewBox="0 0 100 100" fill="none" className="drop-shadow-lg">
                  {/* Horse head - most complex piece */}
                  {/* Ear */}
                  <path d="M48 20 L45 28 L50 26 Z" fill="url(#purpleGrad5)" stroke="#c084fc" strokeWidth="1.5"/>
                  {/* Head and neck curve */}
                  <path d="M50 25 Q45 30 42 38 Q40 45 42 52 L45 54 Q48 50 52 50 Q56 50 58 48 L60 45 Q62 38 60 32 Q58 26 54 24 Z" fill="rgba(147, 51, 234, 0.4)" stroke="#a855f7" strokeWidth="2"/>
                  {/* Snout */}
                  <ellipse cx="42" cy="45" rx="5" ry="7" fill="rgba(147, 51, 234, 0.5)" stroke="#a855f7" strokeWidth="1.5"/>
                  {/* Eye */}
                  <circle cx="52" cy="38" r="2.5" fill="#c084fc"/>
                  {/* Mane */}
                  <path d="M48 28 Q46 32 47 36" stroke="#c084fc" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M51 26 Q49 30 50 34" stroke="#c084fc" strokeWidth="2" strokeLinecap="round"/>
                  {/* Neck base */}
                  <path d="M42 52 L38 62 L62 62 L58 52 Z" fill="rgba(147, 51, 234, 0.4)" stroke="#a855f7" strokeWidth="2"/>
                  {/* Base */}
                  <path d="M33 62 L33 72 Q33 76 37 76 L63 76 Q67 76 67 72 L67 62 Z" fill="url(#purpleGrad5)" stroke="#c084fc" strokeWidth="2"/>
                  <ellipse cx="50" cy="76" rx="20" ry="5" fill="rgba(147, 51, 234, 0.5)" stroke="#a855f7" strokeWidth="2"/>
                  <defs>
                    <linearGradient id="purpleGrad5" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#c084fc" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>

              {/* Glowing Particles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 bg-purple-400 rounded-full"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    bottom: `${20 + Math.random() * 60}%`,
                  }}
                  animate={{
                    scale: [0, 1.5, 0],
                    opacity: [0, 0.8, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    delay: i * 0.4,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-300 text-center max-w-xs">
              Convert professional deliverables into interactive missions to gain hands-on experience
            </p>
          </div>

          {/* Hover Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-purple-400/0 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl"></div>
        </div>
      </motion.div>

      {/* CARD 2: ANIMATED BAR CHARTS */}
      <motion.div
        className="h-[380px] w-full"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="relative group w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#1C1C1E] to-[#2A1A3A] border border-blue-500/20 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105">
          {/* Animated Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>

          {/* Content Container */}
          <div className="relative z-10 flex flex-col items-center justify-between h-full p-6">
            {/* Title */}
            <div className="text-center pt-4">
              <h3 className="text-2xl font-bold text-white mb-2">
                Get Your Velric Score
              </h3>
            </div>

            {/* Animated Bar Charts */}
            <div className="flex-1 flex items-end justify-center w-full gap-3 px-8 pb-8">
              {/* Bar 1 */}
              <motion.div
                className="relative flex flex-col items-center gap-2"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: '35%', opacity: 1 }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              >
                <motion.div
                  className="w-12 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg relative overflow-hidden h-full"
                  animate={{
                    boxShadow: [
                      '0 0 10px rgba(147, 51, 234, 0.3)',
                      '0 0 20px rgba(147, 51, 234, 0.6)',
                      '0 0 10px rgba(147, 51, 234, 0.3)',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-white/20 to-transparent"></div>
                </motion.div>
                <motion.span
                  className="text-purple-300 text-sm font-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  65
                </motion.span>
              </motion.div>

              {/* Bar 2 */}
              <motion.div
                className="relative flex flex-col items-center gap-2"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: '52%', opacity: 1 }}
                transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
              >
                <motion.div
                  className="w-12 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg relative overflow-hidden h-full"
                  animate={{
                    boxShadow: [
                      '0 0 10px rgba(147, 51, 234, 0.3)',
                      '0 0 20px rgba(147, 51, 234, 0.6)',
                      '0 0 10px rgba(147, 51, 234, 0.3)',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                >
                  <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-white/20 to-transparent"></div>
                </motion.div>
                <motion.span
                  className="text-purple-300 text-sm font-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.7 }}
                >
                  78
                </motion.span>
              </motion.div>

              {/* Bar 3 */}
              <motion.div
                className="relative flex flex-col items-center gap-2"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: '68%', opacity: 1 }}
                transition={{ duration: 1, delay: 0.9, ease: "easeOut" }}
              >
                <motion.div
                  className="w-12 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-lg relative overflow-hidden h-full"
                  animate={{
                    boxShadow: [
                      '0 0 10px rgba(6, 182, 212, 0.3)',
                      '0 0 20px rgba(6, 182, 212, 0.6)',
                      '0 0 10px rgba(6, 182, 212, 0.3)',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                >
                  <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-white/20 to-transparent"></div>
                </motion.div>
                <motion.span
                  className="text-cyan-300 text-sm font-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.9 }}
                >
                  85
                </motion.span>
              </motion.div>

              {/* Bar 4 */}
              <motion.div
                className="relative flex flex-col items-center gap-2"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: '80%', opacity: 1 }}
                transition={{ duration: 1, delay: 1.1, ease: "easeOut" }}
              >
                <motion.div
                  className="w-12 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-lg relative overflow-hidden h-full"
                  animate={{
                    boxShadow: [
                      '0 0 10px rgba(6, 182, 212, 0.3)',
                      '0 0 20px rgba(6, 182, 212, 0.6)',
                      '0 0 10px rgba(6, 182, 212, 0.3)',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.9 }}
                >
                  <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-white/20 to-transparent"></div>
                </motion.div>
                <motion.span
                  className="text-cyan-300 text-sm font-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.1 }}
                >
                  92
                </motion.span>
              </motion.div>

              {/* Bar 5 */}
              <motion.div
                className="relative flex flex-col items-center gap-2"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: '95%', opacity: 1 }}
                transition={{ duration: 1, delay: 1.3, ease: "easeOut" }}
              >
                <motion.div
                  className="w-12 bg-gradient-to-t from-green-600 to-green-400 rounded-t-lg relative overflow-hidden h-full"
                  animate={{
                    boxShadow: [
                      '0 0 10px rgba(34, 197, 94, 0.3)',
                      '0 0 20px rgba(34, 197, 94, 0.6)',
                      '0 0 10px rgba(34, 197, 94, 0.3)',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}
                >
                  <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-white/20 to-transparent"></div>
                  {/* Trophy Icon on Tallest Bar */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                    <motion.div
                      animate={{
                        y: [0, -5, 0],
                        rotate: [-5, 5, -5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M6 9C6 10.5 7 11.5 8 12C8 13 8 14 9 14.5C9.5 15 10.5 15 12 15C13.5 15 14.5 15 15 14.5C16 14 16 13 16 12C17 11.5 18 10.5 18 9" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" fill="rgba(251, 191, 36, 0.2)"/>
                        <path d="M12 15V17M10 17H14V19H10V17Z" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round"/>
                        <rect x="5" y="7" width="3" height="4" rx="0.5" stroke="#fbbf24" strokeWidth="1.5" fill="rgba(251, 191, 36, 0.2)"/>
                        <rect x="16" y="7" width="3" height="4" rx="0.5" stroke="#fbbf24" strokeWidth="1.5" fill="rgba(251, 191, 36, 0.2)"/>
                      </svg>
                    </motion.div>
                  </div>
                </motion.div>
                <motion.span
                  className="text-green-300 text-sm font-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.3 }}
                >
                  96
                </motion.span>
              </motion.div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-300 text-center max-w-xs">
              Our AI engine evaluates your work in real-time, providing comprehensive feedback and performance scores
            </p>
          </div>

          {/* Hover Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-400/0 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl"></div>
        </div>
      </motion.div>

      {/* CARD 3: MATCHED STYLE (NO TILT) */}
<motion.div
  className="h-[380px] w-full"
  initial={{ opacity: 0, y: 60 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8, delay: 0.5 }}
>
  <div className="relative group w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#1C1C1E] to-[#2A1A3A] border border-purple-500/20 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105">
    {/* Animated Background Gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-transparent opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>

    {/* Content Container */}
    <div className="relative z-10 flex flex-col items-center justify-center text-center gap-6 h-full p-6">
      {/* Title */}
      <h3 className="text-2xl font-bold text-white">
        Unlock Career<br />Opportunities
      </h3>

      {/* Icons */}
      <div className="flex gap-12 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <p className="text-sm text-gray-300 text-center">Talent</p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
          </div>
          <p className="text-sm text-gray-300 text-center">Companies</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-300 max-w-xs">
        Showcase your skills and portfolio to top employers. Let your real work speak louder than your resume.
      </p>
    </div>

    {/* Hover Glow Effect */}
    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-purple-400/0 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl"></div>
  </div>
</motion.div>

    </div>
  </div>

  {/* Mobile Layout */}
  <div className="lg:hidden space-y-8 max-w-2xl mx-auto">
    {/* Step 1 - Mobile */}
    <motion.div
      className="flex items-start space-x-6"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.1 }}
    >
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
        1
      </div>
      <div className="bg-gradient-to-br from-[#1C1C1E] to-[#2A1A3A] p-6 rounded-xl border border-purple-500/20 flex-1">
        <div className="mb-4 flex justify-center relative h-32">
          {/* Mobile Chess Pieces - More Realistic */}
          {/* King */}
          <motion.svg width="70" height="70" viewBox="0 0 100 100" fill="none" className="absolute" style={{ bottom: '5%', left: '20%' }}
            animate={{ y: [0, -8, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <rect x="46" y="8" width="8" height="12" rx="2" fill="url(#mobileGrad1)" stroke="#c084fc" strokeWidth="1"/>
            <rect x="42" y="12" width="16" height="6" rx="2" fill="url(#mobileGrad1)" stroke="#c084fc" strokeWidth="1"/>
            <circle cx="50" cy="28" r="5" fill="url(#mobileGrad1)" stroke="#c084fc" strokeWidth="1.5"/>
            <path d="M38 32 L42 40 L46 35 L50 43 L54 35 L58 40 L62 32 Z" fill="url(#mobileGrad1)" stroke="#c084fc" strokeWidth="1.5"/>
            <path d="M40 40 Q38 45 40 55 L60 55 Q62 45 60 40 Z" fill="rgba(147, 51, 234, 0.4)" stroke="#a855f7" strokeWidth="2"/>
            <path d="M35 55 L35 63 Q35 67 39 67 L61 67 Q65 67 65 63 L65 55 Z" fill="url(#mobileGrad1)" stroke="#c084fc" strokeWidth="2"/>
            <ellipse cx="50" cy="67" rx="18" ry="4" fill="rgba(147, 51, 234, 0.5)" stroke="#a855f7" strokeWidth="1.5"/>
            <defs>
              <linearGradient id="mobileGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
          </motion.svg>
          
          {/* Rook */}
          <motion.svg width="60" height="60" viewBox="0 0 100 100" fill="none" className="absolute" style={{ bottom: '8%', right: '20%' }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          >
            <rect x="32" y="15" width="9" height="10" fill="url(#mobileGrad2)" stroke="#c084fc" strokeWidth="1.5"/>
            <rect x="46" y="15" width="9" height="10" fill="url(#mobileGrad2)" stroke="#c084fc" strokeWidth="1.5"/>
            <rect x="60" y="15" width="9" height="10" fill="url(#mobileGrad2)" stroke="#c084fc" strokeWidth="1.5"/>
            <rect x="30" y="25" width="40" height="6" rx="2" fill="rgba(147, 51, 234, 0.5)" stroke="#a855f7" strokeWidth="2"/>
            <path d="M34 31 L34 60 L66 60 L66 31 Z" fill="rgba(147, 51, 234, 0.4)" stroke="#a855f7" strokeWidth="2"/>
            <path d="M30 60 L30 68 Q30 72 34 72 L66 72 Q70 72 70 68 L70 60 Z" fill="url(#mobileGrad2)" stroke="#c084fc" strokeWidth="2"/>
            <ellipse cx="50" cy="72" rx="22" ry="4" fill="rgba(147, 51, 234, 0.5)" stroke="#a855f7" strokeWidth="2"/>
            <defs>
              <linearGradient id="mobileGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
          </motion.svg>
        </div>
        <h3 className="text-lg font-bold text-white mb-3">Take Real-World Missions</h3>
        <p className="text-gray-300 text-sm">
          Convert professional deliverables into interactive missions to gain hands-on experience with actual industry work.
        </p>
      </div>
    </motion.div>

    {/* Step 2 - Mobile */}
    <motion.div
      className="flex items-start space-x-6"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
        2
      </div>
      <div className="bg-gradient-to-br from-[#1C1C1E] to-[#2A1A3A] p-6 rounded-xl border border-blue-500/20 flex-1">
        <div className="mb-4 flex items-end justify-center gap-2 h-32">
          {/* Mobile Bar Charts */}
          {[35, 52, 68, 80, 95].map((height, i) => (
            <motion.div
              key={i}
              className="relative flex flex-col items-center gap-1"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: `${height}%`, opacity: 1 }}
              transition={{ duration: 0.8, delay: i * 0.2, ease: "easeOut" }}
            >
              <div className={`w-8 rounded-t-lg h-full ${
                i < 2 ? 'bg-gradient-to-t from-purple-600 to-purple-400' :
                i < 4 ? 'bg-gradient-to-t from-cyan-600 to-cyan-400' :
                'bg-gradient-to-t from-green-600 to-green-400'
              }`}>
                <div className="w-full h-full bg-gradient-to-b from-white/20 to-transparent rounded-t-lg"></div>
              </div>
            </motion.div>
          ))}
        </div>
        <h3 className="text-lg font-bold text-white mb-3">Get Your Velric Score</h3>
        <p className="text-gray-300 text-sm">
          Our AI engine evaluates your work in real-time, providing comprehensive feedback and a detailed performance score.
        </p>
      </div>
    </motion.div>

    {/* Step 3 - Mobile - FIXED TO MATCH DESKTOP */}
    <motion.div
      className="flex items-start space-x-6"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
        3
      </div>
      <div className="bg-gradient-to-br from-[#1C1C1E] to-[#2A1A3A] p-4 rounded-xl border border-green-500/20 flex-1">
        <HoverTiltCard className="w-full h-full">
          <div className="flex flex-col items-center justify-center text-center gap-4 h-full py-4">
            {/* Title */}
            <h3 className="text-lg font-bold text-white">
              Unlock Career<br />Opportunities
            </h3>

            {/* Icons - Same as desktop but smaller for mobile */}
            <div className="flex gap-8 items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <p className="text-xs text-gray-300 break-words text-center max-w-full overflow-hidden">Talent</p>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                </div>
                <p className="text-xs text-gray-300 break-words text-center max-w-full overflow-hidden">Companies</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-gray-300 max-w-xs text-center">
              Showcase your skills and portfolio to top employers. Let your real work speak louder than your resume.
            </p>
          </div>
        </HoverTiltCard>
      </div>
    </motion.div>
  </div>
</section>

        {/* 🚀 What Makes Us Different - ENHANCED ANIMATED VERSION */}
      <motion.h2
  className="text-4xl md:text-5xl font-extrabold mb-0 text-center text-white"
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
  What Makes Us{" "}
  <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
    Different
  </span>
</motion.h2>

        <Timeline
  data={[
    {
      title: "No Resumes",
      content: (
        <div className="bg-gradient-to-br from-[#1C1C1E] to-[#2A1A3A] p-8 rounded-2xl border border-purple-500/20">
          <h3 className="text-2xl font-bold text-white mb-4">No Resumes</h3>
          <p className="text-gray-300 text-sm leading-relaxed mb-6">
            Resumes were invented in the 1930s and haven’t evolved since.
            Velric replaces them with personalized proof-of-work missions that
            reveal how candidates actually think, build, and perform.
          </p>
          <div className="rounded-xl p-4 h-48 flex items-center justify-center">
            <AnimatedCircularProgress width={280} height={180} />
          </div>
        </div>
      ),
    },
    {
      title: "No Guesswork",
      content: (
        <div className="bg-gradient-to-br from-[#1C1C1E] to-[#2A1A3A] p-8 rounded-2xl border border-blue-500/20">
          <h3 className="text-2xl font-bold text-white mb-4">No Guesswork</h3>
          <p className="text-gray-300 text-sm leading-relaxed mb-6">
            Recruiters waste hours screening candidates based on buzzwords.
            Velric’s AI evaluates real work, generating a Velric Score that
            quantifies skill, consistency, and problem-solving ability.
          </p>
          <div className="rounded-xl p-4 h-48 flex items-center justify-center">
            <AnimatedTalentCompanies width={280} height={180} compact={false} />
          </div>
        </div>
      ),
    },
    {
      title: "No Bias",
      content: (
        <div className="bg-gradient-to-br from-[#1C1C1E] to-[#2A1A3A] p-8 rounded-2xl border border-green-500/20">
          <h3 className="text-2xl font-bold text-white mb-4">No Bias</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            Every candidate is measured by the same standard. The Velric Score
            levels the playing field, removing subjective judgment and giving
            companies data-backed confidence in every hire.
          </p>
          <div className="flex-1 rounded-xl p-6 h-56 flex items-center justify-center">
            <AnimatedAIDashboard width={400} height={220} compact={false} />
          </div>
        </div>
      ),
    },
  ]}
/>
       {/* 🌍 A Platform for Everyone - FIXED ALIGNMENT */}
<section className="px-4 md:px-8 lg:px-16 py-20 text-center section-spacing relative z-10">
  <motion.h2
    className="text-4xl md:text-5xl font-extrabold mb-16 text-white"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
  >
    A Platform for <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">Everyone</span>
  </motion.h2>

  <div className="max-w-7xl mx-auto">
    {/* Desktop Layout */}
    <div className="hidden lg:grid lg:grid-cols-3 gap-8 mb-20">
      {/* Card 1 - For Talent */}
      <motion.div
        className="bg-gradient-to-br from-[#1C1C1E] to-[#2A1A3A] p-8 rounded-2xl border border-purple-500/20 text-left"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
        whileHover={{ y: -8, scale: 1.02 }}
      >
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">For Talent</h3>
        <p className="text-gray-300 text-sm mb-6 leading-relaxed">
          Prove your skills with personalized AI missions.
        </p>
        <ul className="space-y-3 list-none">
          <li className="flex gap-3 text-gray-300 text-sm">
            <span className="text-purple-400 mt-1">•</span>
            <span>Earn your Velric Score, a measurable signal of ability</span>
          </li>
          <li className="flex gap-3 text-gray-300 text-sm">
            <span className="text-purple-400 mt-1">•</span>
            <span>Get hired by companies looking for proven execution</span>
          </li>
          <li className="flex gap-3 text-gray-300 text-sm">
            <span className="text-purple-400 mt-1">•</span>
            <span>Build a portfolio backed by data</span>
          </li>
        </ul>
      </motion.div>

      {/* Card 2 - For Employers */}
      <motion.div
        className="bg-gradient-to-br from-[#1C1C1E] to-[#2A1A3A] p-8 rounded-2xl border border-blue-500/20 text-left"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
        whileHover={{ y: -8, scale: 1.02 }}
      >
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">For Employers</h3>
        <p className="text-gray-300 text-sm mb-6 leading-relaxed">
          Hire through proof, NOT resumes.
        </p>
        <ul className="space-y-3 list-none">
          <li className="flex gap-3 text-gray-300 text-sm">
            <span className="text-blue-400 mt-1">•</span>
            <span>Access a global pool of pre-validated talent and top performers</span>
          </li>
          <li className="flex gap-3 text-gray-300 text-sm">
            <span className="text-blue-400 mt-1">•</span>
            <span>Filter candidates by Velric Score and real performance data</span>
          </li>
          <li className="flex gap-3 text-gray-300 text-sm">
            <span className="text-blue-400 mt-1">•</span>
            <span>Replace guesswork with AI driven evaluation</span>
          </li>
        </ul>
      </motion.div>

      {/* Card 3 - For Partners */}
      <motion.div
        className="bg-gradient-to-br from-[#1C1C1E] to-[#2A1A3A] p-8 rounded-2xl border border-green-500/20 text-left"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.3 }}
        whileHover={{ y: -8, scale: 1.02 }}
      >
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">For Partners</h3>
        <p className="text-gray-300 text-sm mb-6 leading-relaxed">
          Redefining how the world hires.
        </p>
        <ul className="space-y-3 list-none">
          <li className="flex gap-3 text-gray-300 text-sm">
            <span className="text-green-400 mt-1">•</span>
            <span>Integrate Velric missions into training or hiring workflows</span>
          </li>
          <li className="flex gap-3 text-gray-300 text-sm">
            <span className="text-green-400 mt-1">•</span>
            <span>Gain insights into skill benchmarks across industries</span>
          </li>
          <li className="flex gap-3 text-gray-300 text-sm">
            <span className="text-green-400 mt-1">•</span>
            <span>Build your brand on proven opportunity</span>
          </li>
        </ul>
      </motion.div>
    </div>

    {/* Mobile Layout */}
    <div className="lg:hidden space-y-6 mb-16">
      {/* Card 1 - For Talent */}
      <motion.div
        className="bg-gradient-to-br from-[#1C1C1E] to-[#2A1A3A] p-6 rounded-2xl border border-purple-500/20 text-left"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white">For Talent</h3>
        </div>
        <p className="text-gray-300 text-sm mb-4">Earn proof of work through personalized AI skill missions.</p>
        <ul className="space-y-3 list-none">
          <li className="flex gap-3 text-gray-300 text-sm">
            <span className="text-purple-400 mt-1">•</span>
            <span>Earn your Velric Score, a measurable signal of ability</span>
          </li>
          <li className="flex gap-3 text-gray-300 text-sm">
            <span className="text-purple-400 mt-1">•</span>
            <span>Get hired by companies looking for proven execution</span>
          </li>
          <li className="flex gap-3 text-gray-300 text-sm">
            <span className="text-purple-400 mt-1">•</span>
            <span>Build a portfolio backed by data</span>
          </li>
        </ul>
      </motion.div>

      {/* Card 2 - For Employers */}
      <motion.div
        className="bg-gradient-to-br from-[#1C1C1E] to-[#2A1A3A] p-6 rounded-2xl border border-blue-500/20 text-left"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white">For Employers</h3>
        </div>
        <p className="text-gray-300 text-sm mb-4">Hire through proof, NOT resumes.</p>
        <ul className="space-y-3 list-none">
          <li className="flex gap-3 text-gray-300 text-sm">
            <span className="text-blue-400 mt-1">•</span>
            <span>Access a global pool of pre-validated talent and top performers</span>
          </li>
          <li className="flex gap-3 text-gray-300 text-sm">
            <span className="text-blue-400 mt-1">•</span>
            <span>Filter candidates by Velric Score and real performance data</span>
          </li>
          <li className="flex gap-3 text-gray-300 text-sm">
            <span className="text-blue-400 mt-1">•</span>
            <span>Replace guesswork with AI driven evaluation</span>
          </li>
        </ul>
      </motion.div>

      {/* Card 3 - For Partners */}
      <motion.div
        className="bg-gradient-to-br from-[#1C1C1E] to-[#2A1A3A] p-6 rounded-2xl border border-green-500/20 text-left"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white">For Partners</h3>
        </div>
        <p className="text-gray-300 text-sm mb-4">Redefining how the world hires.</p>
        <ul className="space-y-3 list-none">
          <li className="flex gap-3 text-gray-300 text-sm">
            <span className="text-green-400 mt-1">•</span>
            <span>Integrate Velric missions into training or hiring workflows</span>
          </li>
          <li className="flex gap-3 text-gray-300 text-sm">
            <span className="text-green-400 mt-1">•</span>
            <span>Gain insights into skill benchmarks across industries</span>
          </li>
          <li className="flex gap-3 text-gray-300 text-sm">
            <span className="text-green-400 mt-1">•</span>
            <span>Build your brand on proven opportunity</span>
          </li>
        </ul>
      </motion.div>
    </div>
  </div>
</section> 
        {/* Footer */}
{/* Footer */}
<Footer />
      </main>
    </>
  );
}