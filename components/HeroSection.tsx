import { motion } from "framer-motion";
import CTAButton from "./CTAButton";

export default function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center bg-[#0D0D0D] text-white text-center px-6 pt-20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large purple gradient orbs */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-r from-[#6A0DAD]/20 to-[#8A2BE2]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gradient-to-l from-[#9370DB]/20 to-[#6A0DAD]/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#6A0DAD]/10 to-[#8A2BE2]/10 rounded-full blur-3xl animate-spin" style={{animationDuration: '60s'}}></div>
      </div>

      {/* Tech Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(106, 13, 173, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(106, 13, 173, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Floating Tech Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-[#6A0DAD]/30 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Circuit-like decorative elements */}
      <div className="absolute top-20 left-10 w-16 h-16 border border-[#6A0DAD]/30 rounded-lg rotate-45 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-12 h-12 border border-[#8A2BE2]/30 rounded-lg rotate-12 animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/3 right-20 w-8 h-8 border border-[#9370DB]/30 rounded-full animate-ping"></div>

      {/* Main Content */}
      <div className="relative z-10">
        <motion.h1 
          className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold leading-tight"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.span 
            className="block bg-gradient-to-r from-white via-purple-200 to-[#6A0DAD] bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Real Work.
          </motion.span>
          <motion.span 
            className="block bg-gradient-to-r from-[#6A0DAD] via-purple-300 to-white bg-clip-text text-transparent"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Real Skills.
          </motion.span>
          <motion.span 
            className="block bg-gradient-to-r from-white via-[#8A2BE2] to-[#6A0DAD] bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Real Results.
          </motion.span>
        </motion.h1>

        <motion.p 
          className="text-lg md:text-2xl max-w-2xl mt-4 text-gray-300"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          AI-powered challenges built from actual work done by top professionals.
        </motion.p>

        <motion.div 
          className="mt-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.0, type: "spring", stiffness: 100 }}
        >
          <CTAButton />
        </motion.div>
      </div>

      {/* Bottom fade effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0D0D0D] to-transparent"></div>
    </section>
  );
}