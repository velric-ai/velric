// pages/join.tsx
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WaitlistForm from "@/components/WaitlistForm";

const Join = () => {
  return (
    <div className="bg-[#0D0D0D] text-white antialiased">
      <Navbar />

      {/* Page Header */}
      <section className="text-center pt-48 pb-12 px-4 md:px-8 lg:px-16 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Get Early Access to Velric</h1>
        <p className="text-lg text-white/80">
          Train with real challenges from real work.
        </p>
      </section>

      {/* Waitlist Form */}
      <section className="bg-[#0D0D0D] py-20 px-4 md:px-8 lg:px-16">
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
