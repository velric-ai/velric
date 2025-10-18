"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Circle, Triangle, Hexagon } from "lucide-react";
import { TypeAnimation } from "react-type-animation";

const RequestDemo = () => {
  useEffect(() => {
    const cursor = document.createElement("div");
    cursor.classList.add("cursor-glow");
    document.body.appendChild(cursor);
    const move = (e: MouseEvent) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    };
    document.addEventListener("mousemove", move);
    return () => {
      document.removeEventListener("mousemove", move);
      if (document.body.contains(cursor)) document.body.removeChild(cursor);
    };
  }, []);

  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="bg-[#0D0D0D] text-white relative overflow-hidden min-h-screen">
      {/* Floating decorative elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute top-20 left-10 text-purple-500/20"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Circle size={60} fill="currentColor" />
        </motion.div>
        <motion.div
          className="absolute top-1/3 right-20 text-purple-400/15"
          animate={{ y: [0, 25, 0] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <Triangle size={40} fill="currentColor" />
        </motion.div>
        <motion.div
          className="absolute bottom-1/4 left-1/4 text-purple-600/10"
          animate={{ y: [0, -30, 0] }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          <Hexagon size={80} fill="currentColor" />
        </motion.div>
        <motion.div
          className="absolute top-1/2 right-10 w-20 h-20 bg-gradient-to-r from-purple-500/10 to-purple-300/10 rounded-full blur-xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-1/3 w-16 h-16 bg-gradient-to-l from-purple-400/15 to-purple-600/15 rounded-lg rotate-45"
          animate={{ rotate: [45, 55, 45] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <Navbar />

      {/* Header Section */}
      <motion.section
        className="text-center pt-44 pb-10 px-4 md:px-8 lg:px-16 max-w-3xl mx-auto relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-400 to-sky-400 text-transparent bg-clip-text">
          Request a Demo
        </h1>

        {/* 👇 Smoothed Typing Animation */}
        <motion.div
          className="text-white/80 text-base md:text-lg mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <TypeAnimation
            sequence={[
              "For recruiting teams and companies evaluating Velric...",
              2500,
              "",
              800,
              "Tell us a bit about your organization and goals.",
              2500,
              "",
              800,
            ]}
            speed={50} // slower typing speed
            deletionSpeed={40} // smoother backspacing
            cursor={true}
            repeat={Infinity}
            wrapper="span"
            style={{
              display: "inline-block",
              color: "rgba(255, 255, 255, 0.85)",
              transition: "all 0.3s ease-in-out",
            }}
          />
        </motion.div>
      </motion.section>

      {/* Form Section */}
      <section className="relative z-10 max-w-3xl mx-auto px-4 md:px-8 lg:px-16 pb-24">
        <motion.div
          className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur p-6 md:p-8 shadow-[0_0_40px_-10px_rgba(124,58,237,0.15)]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9, ease: "easeOut" }}
        >
          {submitted ? (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-semibold mb-2 text-purple-400">
                Request received
              </h2>
              <p className="text-white/70">
                We’ll email you shortly to schedule your demo.
              </p>
            </motion.div>
          ) : (
            <motion.form
              className="space-y-6"
              method="POST"
              action="/api/demo"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 1 }}
            >
              <div className="grid gap-6 md:grid-cols-2">
                <Field label="Company" name="company" required />
                <Field label="Work email" name="email" type="email" required />
                <Field label="Full name" name="name" />
                <Field label="Role" name="role" />
                <div>
                  <label
                    htmlFor="focus-select"
                    className="block text-sm text-white/70 mb-2"
                  >
                    Hiring focus
                  </label>
                  <select
                    id="focus-select"
                    name="focus"
                    className="w-full bg-transparent border border-white/15 rounded-xl px-4 py-3 outline-none focus:border-purple-400"
                    defaultValue="Software"
                  >
                    <option className="bg-[#0D0D0D]">Software</option>
                    <option className="bg-[#0D0D0D]">Data</option>
                    <option className="bg-[#0D0D0D]">Product</option>
                    <option className="bg-[#0D0D0D]">Design</option>
                    <option className="bg-[#0D0D0D]">Other</option>
                  </select>
                </div>
                <Field
                  label="Team size"
                  name="headcount"
                  placeholder="e.g., 5–20 engineers"
                />
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-2">
                  What do you want to see in the demo?
                </label>
                <textarea
                  name="message"
                  rows={5}
                  className="w-full bg-transparent border border-white/15 rounded-xl px-4 py-3 outline-none focus:border-purple-400"
                  placeholder="Share use-cases, timelines, or specific roles you’re hiring for…"
                />
              </div>

              <input type="hidden" name="source" value="request-demo-page" />

              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-sky-400 font-semibold hover:shadow-[0_0_25px_-5px_rgba(124,58,237,0.5)] transition"
              >
                Submit request
              </motion.button>
            </motion.form>
          )}
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default RequestDemo;

/* --- Local reusable input component --- */
const Field = ({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <label className="block text-sm text-white/70 mb-2">{label}</label>
    <input
      type={type}
      name={name}
      required={required}
      placeholder={placeholder}
      className="w-full bg-transparent border border-white/15 rounded-xl px-4 py-3 outline-none focus:border-purple-400"
    />
  </motion.div>
);
