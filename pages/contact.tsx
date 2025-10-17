import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Circle, Triangle, Hexagon } from "lucide-react";

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
        <Circle className="absolute top-20 left-10 text-purple-500/20 floating-element" size={60} fill="currentColor" />
        <Triangle className="absolute top-1/3 right-20 text-purple-400/15 floating-element" size={40} fill="currentColor" />
        <Hexagon className="absolute bottom-1/4 left-1/4 text-purple-600/10 floating-element" size={80} fill="currentColor" />
        <div className="absolute top-1/2 right-10 w-20 h-20 bg-gradient-to-r from-purple-500/10 to-purple-300/10 rounded-full blur-xl floating-element"></div>
        <div className="absolute bottom-20 right-1/3 w-16 h-16 bg-gradient-to-l from-purple-400/15 to-purple-600/15 rounded-lg rotate-45 floating-element"></div>
      </div>

      <Navbar />

      {/* Header */}
      <section className="text-center pt-44 pb-10 px-4 md:px-8 lg:px-16 max-w-3xl mx-auto relative z-10">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Request a Demo</h1>
        <p className="text-white/80">
          For recruiting teams and companies evaluating Velric. Tell us a bit about your org and goals.
        </p>
      </section>

      {/* Form Card */}
      <section className="relative z-10 max-w-3xl mx-auto px-4 md:px-8 lg:px-16 pb-24">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur p-6 md:p-8">
          {submitted ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold mb-2">Request received</h2>
              <p className="text-white/70">We’ll email you shortly to schedule your demo.</p>
            </div>
          ) : (
            <form
              className="space-y-6"
              method="POST"
              action="/api/demo" 
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
            >
              <div className="grid gap-6 md:grid-cols-2">
                <Field label="Company" name="company" required />
                <Field label="Work email" name="email" type="email" required />
                <Field label="Full name" name="name" />
                <Field label="Role" name="role" />
                <div>
                  <label htmlFor="focus-select" className="block text-sm text-white/70 mb-2">Hiring focus</label>
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
                <Field label="Team size" name="headcount" placeholder="e.g., 5–20 engineers" />
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-2">What do you want to see in the demo?</label>
                <textarea
                  name="message"
                  rows={5}
                  className="w-full bg-transparent border border-white/15 rounded-xl px-4 py-3 outline-none focus:border-purple-400"
                  placeholder="Share use-cases, timelines, or specific roles you’re hiring for…"
                />
              </div>

              {/* Hidden context (optional) */}
              <input type="hidden" name="source" value="request-demo-page" />

              <button
                type="submit"
                className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-sky-400 font-semibold hover:opacity-95 transition"
              >
                Submit request
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RequestDemo;

/* --- Local tiny input component --- */
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
  <div>
    <label className="block text-sm text-white/70 mb-2">{label}</label>
    <input
      type={type}
      name={name}
      required={required}
      placeholder={placeholder}
      className="w-full bg-transparent border border-white/15 rounded-xl px-4 py-3 outline-none focus:border-purple-400"
    />
  </div>
);
