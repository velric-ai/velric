// pages/about.tsx
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TeamCard from "@/components/TeamCard";
import Image from "next/image";

const About = () => {
  return (
    <div className="bg-[#0D0D0D] text-white">
      <Navbar />

      {/* Page Header */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 lg:px-16 pt-52 pb-12 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-white">
          About
        </h1>
        <p className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
          At Velric, we believe students don’t learn by watching — they learn by doing. Our mission is to provide immersive AI-powered challenges that simulate real work, not classroom theory.
        </p>
      </section>

      {/* Workflow */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 lg:px-16 pt-6 pb-16 text-center">
        <h2 className="text-3xl font-semibold mb-10">How Velric Works</h2>
        <Image
          src="/icons/velric_layout.png"
          alt="Velric Workflow"
          width={800}
          height={480}
          className="mx-auto"
        />
      </section>

      {/* The Founders */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 lg:px-16 py-16">
        <h2 className="text-3xl font-semibold text-center mb-16">Meet the Founders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <TeamCard
            name="Mahir Laul (CEO)"
            role="Vision, Product, External Strategy"
            image="/assets/mahir.png"
            bio="I lead Velric's vision, product direction, and external strategy. From investor conversations to brand positioning, I make sure we’re building something people remember and scaling it like a company that belongs at the top."
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

      {/* Our Values */}
      <section className="bg-[#1C1C1E] py-28 px-4 md:px-8 lg:px-16">
        <h2 className="text-3xl font-semibold text-center mb-12">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            "Learn through Execution",
            "Build for the Ambitious",
            "Learn and Create at Once",
            "Live the Professional Experience",
            "Work on Real Projects",
            "Experience Over Textbook Memorization"
          ].map((value) => (
            <div
              key={value}
              className="bg-[#0D0D0D] rounded-2xl p-6 text-center hover:scale-105 transition shadow-md border border-[#E0E0DC]/10 min-h-[160px] flex items-center justify-center"
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
