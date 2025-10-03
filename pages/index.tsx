import Head from "next/head";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CTAButton from "@/components/CTAButton";
import ValuePropCard from "@/components/ValuePropCard";
import WaitlistForm from "@/components/WaitlistForm";
import TeamCard from "@/components/TeamCard";
import Footer from "@/components/Footer";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
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

      <main className="bg-[#0D0D0D] text-white font-sans antialiased overflow-x-hidden">
        <Navbar />

        {/* Hero Section */}
        <HeroSection />

        {/* 🧠 Problem Statement - Enhanced with Animations */}
        <section className="px-4 md:px-8 lg:px-16 py-20 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
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
              Students don't learn by watching. They learn by doing.
            </motion.h2>
            <motion.p 
              className="text-white/80 text-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Passive learning doesn't prepare you for real work. Velric transforms actual projects into interactive AI-driven missions to help you build real skills with real feedback.
            </motion.p>
          </motion.div>
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            <Image
              src="/icons/hands.png"
              alt="Problem Illustration"
              width={450}
              height={350}
              className="rounded-xl blend-image"
            />
          </motion.div>
        </section>

        {/* ⚙️ How It Works - Enhanced with Animations */}
        <section className="bg-[#0D0D0D] px-4 md:px-8 lg:px-16 py-20 text-center">
          <motion.h2 
            className="text-4xl md:text-5xl font-extrabold mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            How It Works
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto items-stretch">
            {[
              {
                title: "1. Take Real-World Missions",
                icon: "Briefcase" as keyof typeof import('lucide-react'),
                description: "Convert professional deliverables into interactive missions to gain hands-on experience."
              },
              {
                title: "2. Get Your Velric Score",
                icon: "BarChart3" as keyof typeof import('lucide-react'),
                description: "Our AI engine evaluates your work, providing a comprehensive score and feedback."
              },
              {
                title: "3. Unlock Opportunities",
                icon: "Rocket" as keyof typeof import('lucide-react'),
                description: "Showcase your skills and portfolio to top employers and institutions."
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className="h-full"
              >
                <ValuePropCard
                  title={item.title}
                  icon={item.icon}
                  description={item.description}
                />
              </motion.div>
            ))}
          </div>
        </section>

        {/* 🚀 What Makes Us Different */}
        <section className="px-4 md:px-8 lg:px-16 py-20 max-w-5xl mx-auto text-center">
          <motion.h2 
            className="text-2xl md:text-3xl font-semibold mb-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            What Makes Us Different
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6 text-white/90 text-lg">
            {["No Lectures", "No Simulations", "Real Work. Real Feedback."].map(
              (text, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="bg-[#1C1C1E] p-6 rounded-2xl shadow-md"
                >
                  {text}
                </motion.div>
              )
            )}
          </div>
        </section>

        {/* 👥 Meet the Founders - Enhanced with Animations */}
        <section className="bg-[#0D0D0D] px-4 md:px-8 lg:px-16 py-20">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Meet the Founders
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
                name="Srinidhi Murthy (CTO)"
                role="AI Development, Infrastructure"
                image="/assets/srinidhi.png"
                bio="I lead AI development at Velric. My focus is building systems that turn professional workflows, like decks, code, and pitch, into interactive missions. I ensure our tools are fast and stable, so learners can rely on Velric to deliver real work."
                linkedin="https://www.linkedin.com/in/srinidhi-murthy-800604261/"
              />
            </motion.div>
          </div>
        </section>

        {/* 🌍 A Platform for Everyone - Enhanced with Animations */}
        <section className="bg-[#0D0D0D] px-4 md:px-8 lg:px-16 py-20 text-center">
          <motion.h2 
            className="text-4xl md:text-5xl font-extrabold mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            A Platform for Everyone
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
        <section className="px-4 md:px-8 lg:px-16 py-20 text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Join Waitlist
          </motion.h2>
          <motion.p 
            className="mb-8 text-lg text-white/80"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Be first to access the future of execution-based learning.
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