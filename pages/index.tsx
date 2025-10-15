import Head from "next/head";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CTAButton from "@/components/CTAButton";
import ValuePropCard from "@/components/ValuePropCard";
import WaitlistForm from "@/components/WaitlistForm";

import Footer from "@/components/Footer";

import InteractiveAIVisual from "@/components/InteractiveAIVisual";
import HumanAIConnection from "@/components/HumanAIConnection";
import InteractiveDashboard from "@/components/InteractiveDashboard";
import MissionFlow from "@/components/MissionFlow";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { Circle, Triangle, Hexagon } from "lucide-react";

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
        const styles = window.getComputedStyle(element);
        const height = element.offsetHeight;
        const width = element.offsetWidth;
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
          element.style.display = 'none';
          element.remove(); // Completely remove from DOM
        }
      });

      // Remove all HR elements
      document.querySelectorAll('hr').forEach(hr => hr.remove());

      // Remove pseudo-elements by hiding parent
      const elementsWithBars = document.querySelectorAll('section, .section, .hero-section, .about-section');
      elementsWithBars.forEach(el => {
        el.style.setProperty('--remove-bars', 'none', 'important');
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
          <Hexagon
            className="absolute bottom-1/3 left-1/3 text-purple-600/8 floating-element"
            size={100}
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
              The resume is a <strong className="text-purple-400">1930s invention</strong>. We're building its <strong className="text-purple-300">replacement</strong>. <strong className="text-purple-400">Velric</strong> turns real work into measurable proof. <strong className="text-purple-300">AI built missions</strong> test ability, and your <strong className="text-purple-500">Velric Score</strong> becomes the new standard companies hire through.
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

        {/* ⚙️ How Velric Works - Cluely-style Feature Cards */}
        <section className="features-section section-spacing relative z-10">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            How <span className="highlight">Velric</span> Works
          </motion.h2>

          <div className="features-grid">
            {/* Card 1 */}
            <motion.div
              className="feature-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="feature-visual">
                <MissionFlow
                  width={400}
                  height={280}
                  text="Mission Interface"
                  className="w-full h-full rounded-2xl"
                />
                <div className="feature-badge">No simulations</div>
              </div>
              <h3>Take Real-World Missions</h3>
              <p>Convert professional deliverables into interactive missions to gain hands-on experience with actual industry work.</p>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              className="feature-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="feature-visual">
                <InteractiveDashboard
                  width={400}
                  height={280}
                  text="Score Dashboard"
                  className="w-full h-full rounded-2xl"
                />
              </div>
              <h3>Get Your Velric Score</h3>
              <p>Our AI engine evaluates your work in real-time, providing comprehensive feedback and a detailed performance score.</p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              className="feature-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="feature-visual">
                <HumanAIConnection
                  width={400}
                  height={280}
                  text="Career Opportunities"
                  className="w-full h-full rounded-2xl"
                />
                <div className="feature-badge">Get Hired</div>
              </div>
              <h3>Unlock Career Opportunities</h3>
              <p>Showcase your skills and portfolio to top employers. Let your real work speak louder than your resume.</p>
            </motion.div>
          </div>
        </section>

        {/* 🚀 What Makes Us Different - Cluely Style */}
        <section className="differentiators-section section-spacing relative z-10">
          <motion.h2
            className="section-heading"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            What Makes Us <span className="gradient-text">Different</span>
          </motion.h2>

          <div className="diff-grid">
            {/* Card 1 - No Resumes */}
            <motion.div
              className="diff-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="diff-icon">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3>1. No Resumes</h3>
              <p>Resumes were invented in the 1930s and haven't evolved since. Velric replaces them with personalized proof of work missions that reveal how candidates actually think, build, and perform.</p>
              <div className="diff-visual">
                <MissionFlow
                  width={320}
                  height={180}
                  text="No Resumes"
                  className="w-full h-full rounded-xl diff-size"
                />
              </div>
            </motion.div>

            {/* Card 2 - No Guesswork */}
            <motion.div
              className="diff-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="diff-icon">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3>2. No Guesswork</h3>
              <p>Recruiters waste hours screening candidates based on buzzwords. Velric's AI evaluates real work, generating a Velric Score that quantifies skill, consistency, and problem solving ability.</p>
              <div className="diff-visual">
                <HumanAIConnection
                  width={320}
                  height={180}
                  text="No Guesswork"
                  className="w-full h-full rounded-xl diff-size"
                />
              </div>
            </motion.div>

            {/* Card 3 - No Bias (Featured) */}
            <motion.div
              className="diff-card featured"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="diff-icon">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3>3. No Bias</h3>
              <p>Every candidate is measured by the same standard. The Velric Score levels the playing field, removing subjective judgment and giving companies data backed confidence in every hire.</p>
              <div className="diff-visual">
                <InteractiveDashboard
                  width={320}
                  height={180}
                  text="No Bias"
                  className="w-full h-full rounded-xl diff-size"
                />
              </div>
            </motion.div>
          </div>
        </section>



        {/* 🌍 A Platform for Everyone - Enhanced with Animations */}
        <section className="bg-[#0D0D0D] px-4 md:px-8 lg:px-16 py-20 text-center section-spacing relative z-10">
          <motion.h2
            className="text-4xl md:text-5xl font-extrabold mb-12 text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            A Platform for <span className="text-purple-400">Everyone</span>
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {[
              {
                title: "For Talent",
                icon: "GraduationCap" as keyof typeof import('lucide-react'),
                description: "Prove your skills through personalized AI built proof of work missions.",
                features: [
                  "→ Earn your Velric Score, a measurable signal of ability.",
                  "→ Get hired by companies looking for proven execution.",
                  "→ Build a portfolio backed by data."
                ]
              },
              {
                title: "For Employers",
                icon: "Building2" as keyof typeof import('lucide-react'),
                description: "Hire through proof, NOT resumes.",
                features: [
                  "→ Access a global pool of pre validated talent.",
                  "→ Filter candidates by Velric Score and real performance data.",
                  "→ Replace guesswork with AI driven evaluation."
                ]
              },
              {
                title: "For Partners",
                icon: "BookOpen" as keyof typeof import('lucide-react'),
                description: "Join the movement redefining how the world hires.",
                features: [
                  "→ Integrate Velric missions into training or hiring workflows.",
                  "→ Gain insights into skill benchmarks across industries.",
                  "→ Build your brand around proof based opportunity."
                ]
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="bg-gradient-to-br from-[#1C1C1E] to-[#2A1A3A] p-6 rounded-2xl shadow-lg border border-purple-500/20 h-full flex flex-col relative overflow-hidden group cursor-pointer"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: idx * 0.2 }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(147, 51, 234, 0.3)"
                }}
              >
                {/* Background Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                
                {/* Animated Border Glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
                
                {/* Floating Particles */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  {[...Array(3)].map((_, particleIdx) => (
                    <motion.div
                      key={particleIdx}
                      className="absolute w-1 h-1 bg-purple-400 rounded-full"
                      style={{
                        left: `${20 + particleIdx * 30}%`,
                        top: `${30 + (particleIdx % 2) * 40}%`,
                      }}
                      animate={{
                        y: [0, -15, 0],
                        opacity: [0.3, 1, 0.3],
                        scale: [1, 1.5, 1]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: particleIdx * 0.3
                      }}
                    />
                  ))}
                </div>
                
                <div className="text-center relative z-10">
                  <motion.div
                    className="relative inline-block"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {(() => {
                      const LucideIcon = require('lucide-react')[item.icon];
                      return (
                        <div className="relative">
                          <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <LucideIcon className="w-14 h-14 mb-4 mx-auto text-white group-hover:text-purple-300 transition-colors duration-300 relative z-10" strokeWidth={1.5} />
                        </div>
                      );
                    })()}
                  </motion.div>
                  <motion.h3 
                    className="text-xl font-semibold mb-2 text-white group-hover:text-purple-200 transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    {item.title}
                  </motion.h3>
                  <p className="text-gray-300 group-hover:text-gray-200 text-sm mb-4 transition-colors duration-300">{item.description}</p>
                </div>
                <motion.div
                  className="text-left text-white/80 text-sm space-y-2 flex-grow relative z-10"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.2 + 0.3 }}
                >
                  {item.features.map((feature, featureIdx) => (
                    <motion.div
                      key={featureIdx}
                      className="relative group/feature"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.2 + 0.4 + featureIdx * 0.1 }}
                      whileHover={{ x: 5 }}
                    >
                      <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-purple-500 to-blue-500 opacity-0 group-hover/feature:opacity-100 transition-opacity duration-300 rounded-full" />
                      <p className="pl-4 group-hover/feature:text-purple-200 transition-colors duration-300 relative">
                        <span className="text-purple-400 group-hover/feature:text-purple-300 transition-colors duration-300">→</span>
                        <span className="ml-2">{feature.substring(2)}</span>
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 📝 Waitlist - Enhanced with Animations */}
        <section className="px-4 md:px-8 lg:px-16 py-20 text-center section-spacing relative z-10">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Join <span className="text-purple-400 font-bold">Waitlist</span>
          </motion.h2>
          <motion.p
            className="mb-8 text-lg text-white/80"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Be first to access the future of <strong className="text-purple-300">execution-based learning</strong>.
          </motion.p>
          <motion.div
            className="max-w-lg mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <WaitlistForm />
          </motion.div>
        </section>

        <Footer />
      </main>
    </>
  );
}