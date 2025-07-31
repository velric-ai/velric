import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Contact = () => {
  return (
    <div className="bg-[#0D0D0D] text-white">
      <Navbar />

      {/* Page Header */}
      <section className="text-center pt-48 pb-20 px-4 md:px-8 lg:px-16 max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
        <p className="text-lg text-white/80 mb-10">
          Whether you're a student, partner, or investor — we'd love to hear from you.
        </p>

        {/* Contact Info */}
        <div className="text-left space-y-8">
          {/* Email */}
          {/* <div>
            <h3 className="font-semibold text-lg">📧 Email</h3>
            <p className="text-white/70">contact@velric.com</p>
          </div> */}

          {/* LinkedIn */}
          <div>
            <h3 className="font-semibold text-lg">💼 LinkedIn</h3>
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
            <h3 className="font-semibold text-lg">📱 WhatsApp</h3>
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
            <h3 className="font-semibold text-lg">📷 Instagram</h3>
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

