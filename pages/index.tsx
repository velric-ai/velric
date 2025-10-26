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
import { motion } from "framer-motion";
import { useEffect } from "react";
import { Circle, Triangle } from "lucide-react";

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

        {/* ⚙️ How Velric Works - NEW DESIGN */}
        <section className="px-4 md:px-8 lg:px-16 py-20 section-spacing relative z-10">
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
              {/* CARD 1: GLASSMORPHIC MISSIONS */}
              <motion.div
                className="h-[380px] w-full"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                <div className="relative group w-full h-full rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl">
                  {/* Background Image */}
                  <img
                    src="/assets/missions.jpg"
                    alt="Take Real-World Missions"
                    className="w-full h-full object-cover"
                  />

                  {/* Glassmorphic Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-purple-400/10 to-transparent backdrop-blur-md border border-white/20 shadow-xl"></div>

                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <h3 className="text-3xl font-bold text-white text-center mb-2 drop-shadow-lg">
                      Take Real-World
                    </h3>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent text-center drop-shadow-lg">
                      Missions
                    </h3>

                    <p className="text-sm text-white/80 text-center mt-4 max-w-xs drop-shadow-md px-4">
                      Convert professional deliverables into interactive missions to gain hands-on experience
                    </p>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-purple-400/0 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl"></div>
                </div>
              </motion.div>

              {/* CARD 2: COMPARE SLIDER */}
              <motion.div
                className="h-[380px] w-full"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="w-full h-full rounded-2xl border border-white/10 shadow-xl bg-gradient-to-br from-purple-900/30 via-purple-800/20 to-purple-700/30 backdrop-blur-sm overflow-hidden flex flex-col">
                  
                  {/* Title - Inside card at top */}
                  <div className="px-6 pt-4 pb-2 text-center border-b border-white/5">
                    <h3 className="text-lg font-bold text-white">
                      Get Your Velric Score
                    </h3>
                  </div>

                  {/* Compare Slider - Full height */}
                  <div className="flex-1 flex items-center justify-center p-4">
                    <Compare
                      firstImage="/assets/resume-template.jpg"
                      secondImage="/assets/velric-score.jpg"
                      className="w-full h-full rounded-lg"
                      firstImageClassName="object-contain"
                      secondImageClassname="object-contain"
                      initialSliderPercentage={50}
                      slideMode="hover"
                      showHandlebar={true}
                    />
                  </div>
                </div>
              </motion.div>

              {/* CARD 3: HOVER TILT CARD */}
              <motion.div
                className="h-[380px] w-full"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <HoverTiltCard className="w-full h-full">
                  <div className="flex flex-col items-center justify-center text-center gap-6 h-full">
                    {/* Title */}
                    <h3 className="text-2xl font-bold text-white">
                      Unlock Career<br />Opportunities
                    </h3>

                    {/* Icons */}
                    <div className="flex gap-12 items-center justify-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg">
                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                        </div>
                        <p className="text-sm text-gray-300">Talent</p>
                      </div>

                      <div className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg">
                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                          </svg>
                        </div>
                        <p className="text-sm text-gray-300">Companies</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-300 max-w-xs">
                      Showcase your skills and portfolio to top employers. Let your real work speak louder than your resume.
                    </p>
                  </div>
                </HoverTiltCard>
              </motion.div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden space-y-8 max-w-2xl mx-auto">
            {/* Step 1 */}
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
              <div className="bg-gradient-to-br from-[#1C1C1E] to-[#2A1A3A] p-4 rounded-xl border border-purple-500/20 flex-1">
                <div className="mb-4">
                  <CircularProgressRing />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Take Real-World Missions</h3>
                <p className="text-gray-300 text-sm">
                  Convert professional deliverables into interactive missions to gain hands-on experience with actual industry work.
                </p>
              </div>
            </motion.div>

            {/* Step 2 */}
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
              <div className="bg-gradient-to-br from-[#1C1C1E] to-[#2A1A3A] p-4 rounded-xl border border-blue-500/20 flex-1">
                <div className="mb-4">
                  <AnimatedDashboard />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Get Your Velric Score</h3>
                <p className="text-gray-300 text-sm">
                  Our AI engine evaluates your work in real-time, providing comprehensive feedback and a detailed performance score.
                </p>
              </div>
            </motion.div>

            {/* Step 3 */}
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
                <div className="mb-4">
                  <ConnectionAnimation />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Unlock Career Opportunities</h3>
                <p className="text-gray-300 text-sm">
                  Showcase your skills and portfolio to top employers. Let your real work speak louder than your resume.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 🚀 What Makes Us Different - NEW DESIGN */}
        <section className="px-4 md:px-8 lg:px-16 py-20 section-spacing relative z-10">
          <motion.h2
            className="text-4xl md:text-5xl font-extrabold mb-16 text-center text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            What Makes Us <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">Different</span>
          </motion.h2>

          <div className="max-w-7xl mx-auto">
            {/* Desktop Layout - 2x2 Grid with bottom card spanning full width */}
            <div className="hidden lg:block">
              {/* Top Row - 2 Cards */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                {/* Card 1 - No Resumes */}
                <motion.div
                  className="bg-gradient-to-br from-[#1C1C1E] to-[#2A1A3A] p-8 rounded-2xl border border-purple-500/20 relative overflow-hidden"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <div className="absolute top-6 left-6 w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="pt-20">
                    <h3 className="text-2xl font-bold text-white mb-4">No Resumes</h3>
                    <p className="text-gray-300 text-sm leading-relaxed mb-6">
                      Resumes were invented in the 1930s and haven&apos;t evolved since. Velric replaces them with personalized proof of work missions that reveal how candidates actually think, build, and perform.
                    </p>
                    <div className="bg-[#2A2A2E] rounded-xl p-4 h-32 flex items-center justify-center">
                      <MissionFlow width={280} height={120} text="No Resumes" className="w-full h-full" />
                    </div>
                  </div>
                </motion.div>

                {/* Card 2 - No Guesswork */}
                <motion.div
                  className="bg-gradient-to-br from-[#1C1C1E] to-[#2A1A3A] p-8 rounded-2xl border border-blue-500/20 relative overflow-hidden"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <div className="absolute top-6 left-6 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <div className="pt-20">
                    <h3 className="text-2xl font-bold text-white mb-4">No Guesswork</h3>
                    <p className="text-gray-300 text-sm leading-relaxed mb-6">
                      Recruiters waste hours screening candidates based on buzzwords. Velric&apos;s AI evaluates real work, generating a Velric Score that quantifies skill, consistency, and problem solving ability.
                    </p>
                    <div className="bg-[#2A2A2E] rounded-xl p-4 h-32 flex items-center justify-center">
                      <HumanAIConnection width={280} height={120} text="No Guesswork" className="w-full h-full" />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Bottom Row - Full Width Card */}
              <motion.div
                className="bg-gradient-to-br from-[#1C1C1E] to-[#2A1A3A] p-8 rounded-2xl border border-green-500/20 relative overflow-hidden"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ y: -8, scale: 1.01 }}
              >
                <div className="flex items-start space-x-8">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-6">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="max-w-md">
                      <h3 className="text-2xl font-bold text-white mb-4">No Bias</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Every candidate is measured by the same standard. The Velric Score levels the playing field, removing subjective judgment and giving companies data backed confidence in every hire.
                      </p>
                    </div>
                  </div>
                  <div className="flex-1 bg-[#2A2A2E] rounded-xl p-6 h-48 flex items-center justify-center">
                    <InteractiveDashboard width={400} height={180} text="AI Dashboard" className="w-full h-full" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Mobile Layout */}
            <div className="lg:hidden space-y-6">
              {/* Card 1 - No Resumes */}
              <motion.div
                className="bg-gradient-to-br from-[#1C1C1E] to-[#2A1A3A] p-6 rounded-2xl border border-purple-500/20"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">No Resumes</h3>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  Resumes were invented in the 1930s and haven&apos;t evolved since. Velric replaces them with personalized proof of work missions.
                </p>
                <div className="bg-[#2A2A2E] rounded-xl p-4 h-24">
                  <MissionFlow width={240} height={80} text="No Resumes" className="w-full h-full" />
                </div>
              </motion.div>

              {/* Card 2 - No Guesswork */}
              <motion.div
                className="bg-gradient-to-br from-[#1C1C1E] to-[#2A1A3A] p-6 rounded-2xl border border-blue-500/20"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">No Guesswork</h3>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  Velric&apos;s AI evaluates real work, generating a Velric Score that quantifies skill, consistency, and problem solving ability.
                </p>
                <div className="bg-[#2A2A2E] rounded-xl p-4 h-24">
                  <HumanAIConnection width={240} height={80} text="No Guesswork" className="w-full h-full" />
                </div>
              </motion.div>

              {/* Card 3 - No Bias */}
              <motion.div
                className="bg-gradient-to-br from-[#1C1C1E] to-[#2A1A3A] p-6 rounded-2xl border border-green-500/20"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">No Bias</h3>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  The Velric Score levels the playing field, removing subjective judgment and giving companies data backed confidence.
                </p>
                <div className="bg-[#2A2A2E] rounded-xl p-4 h-24">
                  <InteractiveDashboard width={240} height={80} text="AI Dashboard" className="w-full h-full" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>



        {/* 🌍 A Platform for Everyone - NEW DESIGN */}
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
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <span className="text-purple-400 mt-1">•</span>
                    <span className="text-gray-300 text-sm">Earn your Velric Score, a measurable signal of ability</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-purple-400 mt-1">•</span>
                    <span className="text-gray-300 text-sm">Get hired by companies looking for proven execution</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-purple-400 mt-1">•</span>
                    <span className="text-gray-300 text-sm">Build a portfolio backed by data</span>
                  </div>
                </div>
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
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <span className="text-blue-400 mt-1">•</span>
                    <span className="text-gray-300 text-sm">Access a global pool of pre validated talent</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-blue-400 mt-1">•</span>
                    <span className="text-gray-300 text-sm">Filter candidates by Velric Score and real performance data</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-blue-400 mt-1">•</span>
                    <span className="text-gray-300 text-sm">Replace guesswork with AI driven evaluation</span>
                  </div>
                </div>
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
                  Join the movement redefining how the world hires.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <span className="text-green-400 mt-1">•</span>
                    <span className="text-gray-300 text-sm">Integrate Velric missions into training or hiring workflows</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-green-400 mt-1">•</span>
                    <span className="text-gray-300 text-sm">Gain insights into skill benchmarks across industries</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-green-400 mt-1">•</span>
                    <span className="text-gray-300 text-sm">Build your brand around proof based opportunity</span>
                  </div>
                </div>
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
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <span className="text-purple-400 text-xs mt-1">•</span>
                    <span className="text-gray-300 text-xs">Earn your Velric Score, a measurable signal of ability</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-purple-400 text-xs mt-1">•</span>
                    <span className="text-gray-300 text-xs">Get hired by companies looking for proven execution</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-purple-400 text-xs mt-1">•</span>
                    <span className="text-gray-300 text-xs">Build a portfolio backed by data</span>
                  </div>
                </div>
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
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-400 text-xs mt-1">•</span>
                    <span className="text-gray-300 text-xs">Access a global pool of pre validated talent</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-400 text-xs mt-1">•</span>
                    <span className="text-gray-300 text-xs">Filter candidates by Velric Score and real performance data</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-400 text-xs mt-1">•</span>
                    <span className="text-gray-300 text-xs">Replace guesswork with AI driven evaluation</span>
                  </div>
                </div>
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
                <p className="text-gray-300 text-sm mb-4">Join the movement redefining how the world hires.</p>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <span className="text-green-400 text-xs mt-1">•</span>
                    <span className="text-gray-300 text-xs">Integrate Velric missions into training or hiring workflows</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-400 text-xs mt-1">•</span>
                    <span className="text-gray-300 text-xs">Gain insights into skill benchmarks across industries</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-400 text-xs mt-1">•</span>
                    <span className="text-gray-300 text-xs">Build your brand around proof based opportunity</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Footer */}
        {/* Auth buttons */}
        <div className="w-full md:w-auto flex justify-center md:justify-end mt-3 md:mt-0 gap-3">
          <Link href="/login">
            <button className="border border-purple-500/50 text-white px-4 py-2 text-sm sm:text-base rounded-full font-medium hover:bg-purple-500/10 hover:border-purple-400 transition-all duration-300 whitespace-nowrap">
              Login
            </button>
          </Link>
          <Link href="/signup">
            <button className="bg-gradient-to-r from-[#9333EA] to-[#06B6D4] text-white px-4 py-2 text-sm sm:text-base rounded-full font-semibold hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 whitespace-nowrap">
              Sign Up
            </button>
          </Link>
        </div>

        <Footer />
      </main>
    </>
  );
}