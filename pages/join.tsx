// pages/join.tsx
import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WaitlistForm from "@/components/WaitlistForm";
import { Circle, Triangle, Hexagon } from "lucide-react";

const Join = () => {
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

      {/* Page Header */}
      <section className="text-center pt-48 pb-12 px-4 md:px-8 lg:px-16 max-w-3xl mx-auto relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Get Early Access to Velric</h1>
        <p className="text-lg text-white/80">
          Train with real challenges from real work.
        </p>
      </section>

      {/* Waitlist Form */}
      <section className="bg-[#0D0D0D] py-20 px-4 md:px-8 lg:px-16 relative z-10">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">Waitlist Form</h2>
          <WaitlistForm />
        </div>
      </section>

      {/* Social Proof Section */}
      {/* <section className="text-center py-16 px-4">
        <p className="text-white/70 text-sm uppercase tracking-wide mb-2">Social Proof</p>
        <h3 className="text-2xl md:text-3xl font-semibold">Join other early adopters</h3>
        <p className="text-white/50 mt-2">Student stories and testimonials coming soon.</p>
      </section> */}

      {/* Future: Add logos/photos/testimonials */}

      {/* Optional: Testimonials (future) */}
      {/* <section className="py-20 px-4 text-center">
        <h3 className="text-2xl font-bold mb-4">What People Are Saying</h3>
        <p className="text-white/50">Testimonials will appear here once available.</p>
      </section> */}

      <Footer />
    </div>
  );
};

export default Join;
