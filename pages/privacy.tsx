// pages/privacy.tsx
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="bg-[#0D0D0D] text-white min-h-screen flex flex-col">
      <Navbar />

      {/* Offset content by navbar height (16) + some extra spacing (8) = 24 (6rem) */}
      <main className="flex-grow max-w-4xl mx-auto px-4 md:px-8 lg:px-16 pt-40 mb-24 space-y-10">
        <section>
          <h1 className="text-4xl md:text-5xl font-bold text-[#F5F5F5] mb-4">
            Privacy Policy
          </h1>
          <p className="text-white/80 text-lg">Last updated: July 28, 2025</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#00D9FF] mb-2">
            1. Introduction
          </h2>
          <p className="text-white/70">
            Velric is committed to protecting your privacy. This Privacy Policy
            explains how we collect, use, and safeguard your information when
            you visit our website or interact with our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#00D9FF] mb-2">
            2. Information We Collect
          </h2>
          <ul className="list-disc pl-6 text-white/70 space-y-1">
            <li>
              <strong>Personal Info:</strong> Name, email, and area of interest
              submitted through forms.
            </li>
            <li>
              <strong>Usage Data:</strong> Pages visited, browser type, device
              info.
            </li>
            <li>
              <strong>Cookies:</strong> We use cookies to enhance user
              experience.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#00D9FF] mb-2">
            3. How We Use Your Data
          </h2>
          <ul className="list-disc pl-6 text-white/70 space-y-1">
            <li>To send waitlist confirmations and updates.</li>
            <li>To personalize your experience with AI-powered challenges.</li>
            <li>To improve site performance and troubleshoot issues.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#00D9FF] mb-2">
            4. Data Sharing
          </h2>
          <p className="text-white/70">
            We do not sell your data. We may share anonymized usage data with
            trusted third-party services for analytics or infrastructure (e.g.,
            AWS, Typeform, Google Sheets) to improve Velric’s performance.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#00D9FF] mb-2">
            5. Your Rights
          </h2>
          <ul className="list-disc pl-6 text-white/70 space-y-1">
            <li>Request access or deletion of your data.</li>
            <li>Opt-out of promotional emails at any time.</li>
            <li>Disable cookies through your browser settings.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#00D9FF] mb-2">
            6. Data Security
          </h2>
          <p className="text-white/70">
            We use secure protocols and infrastructure partners like AWS to
            protect your data. However, no internet transmission is 100%
            secure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#00D9FF] mb-2">
            7. Children’s Privacy
          </h2>
          <p className="text-white/70">
            Velric is not intended for users under the age of 13. We do not
            knowingly collect data from children without parental consent.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#00D9FF] mb-2">
            8. Contact Us
          </h2>
          <p className="text-white/70">
            If you have any questions or concerns about this policy, you can
            contact us.
          </p>
          <p className="text-white/80 mt-2"></p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
