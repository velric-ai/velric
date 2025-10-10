import Head from "next/head";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CTAButton from "@/components/CTAButton";
import ValuePropCard from "@/components/ValuePropCard";
import WaitlistForm from "@/components/WaitlistForm";
import TeamCard from "@/components/TeamCard";
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
              Students don't learn by <strong className="text-purple-400">watching</strong>. They learn by <strong className="text-purple-300">doing</strong>.
            </motion.h2>
            <motion.p 
              className="text-white/80 text-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <strong className="text-purple-500">Passive learning</strong> doesn't prepare you for real work. <strong className="text-purple-400">Velric</strong> transforms actual projects into interactive <strong className="text-purple-300">AI-driven missions</strong> to help you build real skills with real feedback.
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
                <div className="feature-badge">AI-Powered</div>
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
            {/* Card 1 - No Lectures */}
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
              <h3>No Lectures</h3>
              <p>Skip the boring theory. Jump straight into real professional work and learn by doing.</p>
              <div className="diff-visual">
                <MissionFlow
                  width={320}
                  height={180}
                  text="No Lectures"
                  className="w-full h-full rounded-xl"
                />
              </div>
            </motion.div>

            {/* Card 2 - No Simulations */}
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
              <h3>No Simulations</h3>
              <p>Work on actual deliverables used by real companies. Your practice IS the real thing.</p>
              <div className="diff-visual">
                <HumanAIConnection
                  width={320}
                  height={180}
                  text="Real Work"
                  className="w-full h-full rounded-xl"
                />
              </div>
            </motion.div>

            {/* Card 3 - Real Work. Real Feedback. (Featured) */}
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
              <h3>Real Work. Real Feedback.</h3>
              <p>Get instant AI-powered feedback on actual professional tasks. Build a portfolio that proves your skills.</p>
              <div className="diff-visual">
                <InteractiveDashboard
                  width={320}
                  height={180}
                  text="Real Feedback"
                  className="w-full h-full rounded-xl"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* 👥 Meet the Founders - Enhanced with Animations */}
        <section className="bg-[#0D0D0D] px-4 md:px-8 lg:px-16 py-20 section-spacing relative z-10">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Meet the <span className="text-purple-400 font-bold">Founders</span>
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <TeamCard
                name="Mahir Laul (CEO)"
                role="Vision, Product, External Strategy"
                image="/assets/mahir.png"
                bio="I lead the vision, product direction, and external strategy at Velric. From investor conversations to brand positioning, I make sure we're building something people remember and scaling it like a company that belongs at the top."
                linkedin="https://www.linkedin.com/in/mahir-laul-a77b11224/"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <TeamCard
                name="Sara (CTO)"
                role="AI Development, Infrastructure"
                image="/assets/CTO.png"
                bio="I lead AI development at Velric. My focus is building systems that turn professional workflows, like decks, code, and pitch, into interactive missions. I ensure our tools are fast and stable, so learners can rely on Velric to deliver real work."
                linkedin=""
              />
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
                title: "For Learners",
                icon: "GraduationCap" as keyof typeof import('lucide-react'),
                description: "Gain practical experience, build a strong portfolio, and get discovered for your skills, not just your resume.",
                features: [
                  "→ Build a portfolio of real work.",
                  "→ Receive AI-driven feedback.",
                  "→ Connect with top employers."
                ]
              },
              {
                title: "For Educators",
                icon: "BookOpen" as keyof typeof import('lucide-react'),
                description: "Enhance curriculums with real-world challenges that foster execution and critical thinking.",
                features: [
                  "→ Embed AI-powered missions into courses.",
                  "→ Track learner progress and outcomes.",
                  "→ Prepare students for real-world work."
                ]
              },
              {
                title: "For Companies",
                icon: "Building2" as keyof typeof import('lucide-react'),
                description: "Engage top talent through challenge-based recruitment and continuous learning.",
                features: [
                  "→ Discover talent through real execution.",
                  "→ Use missions to upskill teams.",
                  "→ Build a culture of doing, not watching."
                ]
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                className="bg-[#1C1C1E] p-6 rounded-2xl shadow-md h-full flex flex-col"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: idx * 0.2 }}
              >
                <div className="text-center">
                  {(() => {
                    const LucideIcon = require('lucide-react')[item.icon];
                    return <LucideIcon className="w-14 h-14 mb-4 mx-auto text-white" strokeWidth={1.5} />;
                  })()}
                  <h3 className="text-xl font-semibold mb-2 text-white">{item.title}</h3>
                  <p className="text-gray-300 text-sm mb-4">{item.description}</p>
                </div>
                <motion.div 
                  className="text-left text-white/80 text-sm space-y-1 flex-grow"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.2 + 0.3 }}
                >
                  {item.features.map((feature, featureIdx) => (
                    <motion.p 
                      key={featureIdx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.2 + 0.4 + featureIdx * 0.1 }}
                    >
                      {feature}
                    </motion.p>
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