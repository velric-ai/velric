// pages/about.tsx
import React, { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TeamCard from "@/components/TeamCard";
import ShaderBackground from "@/components/ui/shader-background";
import { Workflow, Circle, Triangle, Hexagon } from "lucide-react";

/**
 * FuturisticValues - mobile-friendly animated values (drop-in)
 * - Use this to replace the old OrbitingValues
 * - Respects prefers-reduced-motion
 */
const FuturisticValues: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  const values = [
    { title: "Execution", text: "We build and ship fast, focusing on outcomes." },
    { title: "Integrity", text: "Honesty, ownership, and clear communication." },
    { title: "Curiosity", text: "Experiment, learn, and improve every day." },
    { title: "Empathy", text: "Design for humans — not metrics alone." },
    { title: "Impact", text: "Measure success by real change we create." },
  ];

  const blobAnim = shouldReduceMotion
    ? {}
    : {
        animate: {
          scale: [1, 1.06, 1],
          rotate: [0, 6, 0],
          opacity: [0.6, 0.95, 0.6],
        },
        transition: { duration: 8, repeat: Infinity, ease: "easeInOut" },
      };

  return (
    <div className="w-full max-w-6xl mx-auto relative flex flex-col items-center">
      {/* soft animated background blobs (pure CSS + framer for motion) */}
      <motion.div
        className="pointer-events-none absolute -left-10 top-6 w-44 h-44 md:w-64 md:h-64 rounded-full bg-gradient-to-r from-purple-600/20 to-indigo-500/20 blur-3xl"
        {...blobAnim}
      />
      <motion.div
        className="pointer-events-none absolute -right-10 bottom-6 w-56 h-56 md:w-80 md:h-80 rounded-full bg-gradient-to-l from-indigo-500/10 to-purple-600/18 blur-4xl"
        {...blobAnim}
        style={{ transitionDelay: "1s" } as any}
      />

      {/* core values grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 w-full px-4">
        {values.map((v, i) => (
          <motion.div
            key={v.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
            whileHover={shouldReduceMotion ? {} : { scale: 1.04, y: -6 }}
            className="bg-[#0E0E10]/60 border border-white/6 rounded-2xl p-5 flex flex-col items-center text-center min-h-[120px] justify-center"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-400/8 to-indigo-400/8 mb-3">
              <div className="text-purple-300 font-medium">{i + 1}</div>
            </div>
            <h4 className="text-sm md:text-base font-semibold text-white/90 mb-2">
              {v.title}
            </h4>
            <p className="text-xs md:text-sm text-white/70">{v.text}</p>
          </motion.div>
        ))}
      </div>

      {/* subtle separator line (responsive) */}
      <div className="w-full max-w-3xl mt-8 h-px bg-gradient-to-r from-transparent via-white/6 to-transparent" />
    </div>
  );
};

const About = () => {
  // Custom cursor glow effect
  useEffect(() => {
    const cursor = document.createElement("div");
    cursor.classList.add("cursor-glow");
    document.body.appendChild(cursor);

    const handleMouseMove = (e: MouseEvent) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      if (document.body.contains(cursor)) {
        document.body.removeChild(cursor);
      }
    };
  }, []);

  return (
    <div className="relative overflow-hidden">
      <ShaderBackground />
      <div className="relative bg-[#0D0D0D] bg-opacity-90 text-white">
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
            Resumes have been around since the 1930s. It's time for something
            better. <strong className="text-purple-400">Velric</strong> is
            redefining how the world measures talent - through real execution,
            not credentials. Our AI creates proof of work missions that quantify
            skill, consistency, and problem solving personalized for each user.
            The result is the <strong className="text-purple-500">Velric Score</strong>, the new global language of ability.
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
              name="Sara Pedron (CTO)"
              role="AI Development, Infrastructure"
              image="/assets/CTO.png"
              bio="I lead AI development at Velric. My focus is building systems that turn professional workflows, like decks, code, and pitch, into interactive missions. I ensure our tools are fast and stable, so learners can rely on Velric to deliver real work."
              linkedin="https://www.linkedin.com/in/sara-pedron-9929271b6/"
            />
          </div>
        </section>

        {/* Our Values - Futuristic (REPLACED) */}
        <section className="bg-[#0D0D0D] py-28 px-4 md:px-8 lg:px-16 section-spacing relative z-10">
          <h2 className="text-3xl font-semibold text-center mb-12">
            Our <span className="text-purple-400 font-bold">Values</span>
          </h2>
          <div className="flex items-center justify-center">
            <FuturisticValues />
          </div>
        </section>

        {/* Contact section at bottom */}
        <section className="max-w-3xl mx-auto px-4 md:px-8 lg:px-16 py-20 relative z-10 text-center">
          <h2 className="text-3xl font-semibold mb-4">
            Get in <span className="text-purple-400 font-bold">Touch</span>
          </h2>
          <p className="text-white/80 mb-10">
            For press, partnerships, or general questions — we’d love to hear from you.
          </p>

          <div className="grid gap-6 sm:grid-cols-2">
            <a
              href="mailto:mahir@velric.ai"
              className="border border-white/10 rounded-xl p-5 hover:border-purple-400/40 transition"
            >
              <h3 className="text-sm text-white/60 mb-1">Email</h3>
              <p className="font-medium">mahir@velric.ai</p>
            </a>

            <a
              href="https://www.linkedin.com/company/velric"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/10 rounded-xl p-5 hover:border-purple-400/40 transition"
            >
              <h3 className="text-sm text-white/60 mb-1">LinkedIn</h3>
              <p className="font-medium">Connect with us</p>
            </a>

            <a
              href="https://wa.me/17787723980"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/10 rounded-xl p-5 hover:border-purple-400/40 transition"
            >
              <h3 className="text-sm text-white/60 mb-1">WhatsApp</h3>
              <p className="font-medium">Chat with us</p>
            </a>

            <a
              href="https://www.instagram.com/velric.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/10 rounded-xl p-5 hover:border-purple-400/40 transition"
            >
              <h3 className="text-sm text.white/60 mb-1">Instagram</h3>
              <p className="font-medium">@velric.ai</p>
            </a>
          </div>
          <Footer />
        </section>
      </div>
    </div>
  );
};

export default About;
