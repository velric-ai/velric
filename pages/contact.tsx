import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Circle, Triangle, Hexagon } from "lucide-react";

const Contact = () => {
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
      <section className="text-center pt-48 pb-20 px-4 md:px-8 lg:px-16 max-w-2xl mx-auto relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
        <p className="text-lg text-white/80 mb-10">
          Whether you're a student, partner, or investor, we would love to hear from you.
        </p>

        {/* Contact Info */}
        <div className="text-left space-y-8">
          {/* Email */}
          {/* <div>
            <h3 className="font-semibold text-lg">Email</h3>
            <p className="text-white/70">contact@velric.com</p>
          </div> */}

          {/* LinkedIn */}
          <div>
            <h3 className="font-semibold text-lg">LinkedIn</h3>
            <p className="text-white/70">
              <a
                href="https://www.linkedin.com/company/velric"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#00D9FF] transition"
              >
                Connect with us on LinkedIn
              </a>
            </p>
          </div>

          {/* WhatsApp */}
          <div>
            <h3 className="font-semibold text-lg">WhatsApp</h3>
            <p className="text-white/70">
              <a
                href="https://wa.me/17787723980"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#00D9FF] transition"
              >
                Chat with us on WhatsApp
              </a>
            </p>
          </div>

          {/* Instagram */}
          <div>
            <h3 className="font-semibold text-lg">Instagram</h3>
            <p className="text-white/70">
              <a
                href="https://www.instagram.com/velric.ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#00D9FF] transition"
              >
                Follow us @velric.ai
              </a>
            </p>
          </div>

          {/* Location */}
          {/* <div>
            <h3 className="font-semibold text-lg">📍 Location</h3>
            <p className="text-white/70">Remote-first. Built globally.</p>
          </div> */}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;

