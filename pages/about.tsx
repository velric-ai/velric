// pages/about.tsx
import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TeamCard from "@/components/TeamCard";
import { Workflow, Circle, Triangle, Hexagon } from "lucide-react";

const About = () => {
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



  return (
    <div className="bg-[#0D0D0D] text-white relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Circle 
          className="absolute top-20 left-10 text-purple-500/20 floating-element" 
          size={60} 
          fill="currentColor"
        />
        <Triangle 
          className="absolute top-1/3 right-20 text-purple-400/15 floating-element" 
          size={40}
          fill="currentColor"
        />
        <Hexagon 
          className="absolute bottom-1/4 left-1/4 text-purple-600/10 floating-element" 
          size={80}
          fill="currentColor"
        />
        <div className="absolute top-1/2 right-10 w-20 h-20 bg-gradient-to-r from-purple-500/10 to-purple-300/10 rounded-full blur-xl floating-element"></div>
        <div className="absolute bottom-20 right-1/3 w-16 h-16 bg-gradient-to-l from-purple-400/15 to-purple-600/15 rounded-lg rotate-45 floating-element"></div>
      </div>

      <Navbar />

      {/* Page Header - Edit 1: Section Spacing */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 lg:px-16 pt-52 pb-12 text-center section-spacing relative z-10">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-white">
          About
        </h1>
        <p className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
          At <strong className="text-purple-400">Velric</strong>, we believe students don't learn by watching. They learn by <strong className="text-purple-300">doing</strong>. Our mission is to provide immersive <strong className="text-purple-500">AI-powered challenges</strong> that simulate real work, not classroom theory.
        </p>
      </section>

      {/* The Founders - Edit 1: Section Spacing */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 lg:px-16 py-16 section-spacing relative z-10">
        <h2 className="text-3xl font-semibold text-center mb-16">
          Meet the <span className="text-purple-400 font-bold">Founders</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <TeamCard
            name="Mahir Laul (CEO)"
            role="Vision, Product, External Strategy"
            image="/assets/mahir.png"
            bio="I lead Velric's vision, product direction, and external strategy. From investor conversations to brand positioning, I make sure we're building something people remember and scaling it like a company that belongs at the top."
            linkedin="https://www.linkedin.com/in/mahir-laul-a77b11224/"
          />
          <TeamCard
            name="Sara (CTO)"
            role="AI Development, Infrastructure"
            image="/assets/CTO.png"
            bio="I lead AI development at Velric. My focus is building systems that turn professional workflows, like decks, code, and pitch, into interactive missions. I ensure our tools are fast and stable, so learners can rely on Velric to deliver real work."
            linkedin=""
          />
        </div>
      </section>

      {/* Our Values - Edit 3: Hover Effects */}
      <section className="bg-[#0D0D0D] py-28 px-4 md:px-8 lg:px-16 section-spacing relative z-10">
        <h2 className="text-3xl font-semibold text-center mb-12">
          Our <span className="text-purple-400 font-bold">Values</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            "Learn through Execution",
            "Build for the Ambitious", 
            "Learn and Create at Once",
            "Live the Professional Experience",
            "Work on Real Projects",
            "Experience Over Textbook Memorization",
          ].map((value) => (
            <div
              key={value}
              className="value-item bg-[#0D0D0D] rounded-2xl p-6 text-center shadow-md border border-[#E0E0DC]/10 min-h-[160px] flex items-center justify-center"
            >
              <h3 className="text-xl font-bold">{value}</h3>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;