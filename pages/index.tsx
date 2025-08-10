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
        <title>Velric | Real Work. Real Skills.</title>
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

        {/* 🧠 Problem Statement */}
        <section className="px-4 md:px-8 lg:px-16 py-20 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Students don’t learn by watching. They learn by doing.
            </h2>
            <p className="text-white/80 text-lg">
              Passive learning doesn't prepare you for real work. Velric transforms actual projects into interactive AI-driven missions to help you build real skills with real feedback.
            </p>
          </div>
          <div className="flex justify-center">
            <Image
              src="/icons/hands.png"
              alt="Problem Illustration"
              width={450}
              height={350}
              className="rounded-xl blend-image"
            />
          </div>
        </section>

        {/* ⚙️ How It Works */}
        <section className="bg-[#0D0D0D] px-4 md:px-8 lg:px-16 py-20 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            <ValuePropCard
              title="1. Take Real-World Missions"
              icon="/icons/professional.png"
              description="Convert professional deliverables into interactive missions to gain hands-on experience."
              className="blend-image"
            />
            <ValuePropCard
              title="2. Get Your Velric Score"
              icon="/icons/logo.png"
              description="Our AI engine evaluates your work, providing a comprehensive score and feedback."
              className="blend-image"
            />
            <ValuePropCard
              title="3. Unlock Opportunities"
              icon="/icons/office.png"
              description="Showcase your skills and portfolio to top employers and institutions."
              className="blend-image"
            />
          </div>
        </section>

        {/* 🚀 What Makes Us Different */}
        <section className="px-4 md:px-8 lg:px-16 py-20 max-w-5xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-10">
            What Makes Us Different
          </h2>
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

        {/* 👥 Meet the Founders */}
        <section className="bg-[#0D0D0D] px-4 md:px-8 lg:px-16 py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Meet the Founders
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <TeamCard
              name="Mahir Laul (CEO)"
              role="Vision, Product, External Strategy"
              image="/assets/mahir.png"
              bio="I lead the vision, product direction, and external strategy at Velric. From investor conversations to brand positioning, I make sure we’re building something people remember and scaling it like a company that belongs at the top."
              linkedin="https://www.linkedin.com/in/mahir-laul-a77b11224/"
            />
            <TeamCard
              name="Srinidhi Murthy (CTO)"
              role="AI Development, Infrastructure"
              image="/assets/srinidhi.png"
              bio="I lead AI development at Velric. My focus is building systems that turn professional workflows, like decks, code, and pitch, into interactive missions. I ensure our tools are fast and stable, so learners can rely on Velric to deliver real work."
              linkedin="https://www.linkedin.com/in/srinidhi-murthy-800604261/"
            />
          </div>
        </section>

        {/* 🌍 A Platform for Everyone */}
        <section className="bg-[#0D0D0D] px-4 md:px-8 lg:px-16 py-20 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-12">
            A Platform for Everyone
          </h2>
          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            <div className="bg-[#1C1C1E] p-6 rounded-2xl shadow-md">
              <ValuePropCard
                title="For Learners"
                icon="/icons/students.png"
                description="Gain practical experience, build a strong portfolio, and get discovered for your skills, not just your resume."
                className="blend-image"
              />
              <div className="text-left mt-4 text-white/80 text-sm space-y-1">
                <p>→ Build a portfolio of real work.</p>
                <p>→ Receive AI-driven feedback.</p>
                <p>→ Connect with top employers.</p>
              </div>
            </div>

            <div className="bg-[#1C1C1E] p-6 rounded-2xl shadow-md">
              <ValuePropCard
                title="For Educators"
                icon="/icons/educators.png"
                description="Enhance curriculums with real-world challenges that foster execution and critical thinking."
                className="blend-image"
              />
              <div className="text-left mt-4 text-white/80 text-sm space-y-1">
                <p>→ Embed AI-powered missions into courses.</p>
                <p>→ Track learner progress and outcomes.</p>
                <p>→ Prepare students for real-world work.</p>
              </div>
            </div>

            <div className="bg-[#1C1C1E] p-6 rounded-2xl shadow-md">
              <ValuePropCard
                title="For Companies"
                icon="/icons/companies.png"
                description="Engage top talent through challenge-based recruitment and continuous learning."
                className="blend-image"
              />
              <div className="text-left mt-4 text-white/80 text-sm space-y-1">
                <p>→ Discover talent through real execution.</p>
                <p>→ Use missions to upskill teams.</p>
                <p>→ Build a culture of doing, not watching.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 📝 Waitlist */}
        <section className="px-4 md:px-8 lg:px-16 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Waitlist</h2>
          <p className="mb-8 text-lg text-white/80">
            Be first to access the future of execution-based learning.
          </p>
          <div className="max-w-lg mx-auto">
            <WaitlistForm />
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
