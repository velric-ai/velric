import { motion } from "framer-motion";
import { useEffect } from "react";
import Image from "next/image";

export default function HeroSection() {
  // Interactive word highlighting animation
  useEffect(() => {
    const words = document.querySelectorAll('.hero-title .word');
    let currentIndex = 0;

    function animateWords() {
      // Remove active class from all
      words.forEach(w => w.classList.remove('active'));

      // Add active class to current word
      if (words[currentIndex]) {
        words[currentIndex].classList.add('active');
      }

      // Move to next word
      currentIndex = (currentIndex + 1) % words.length;
    }

    // Run animation every 1.5 seconds
    const interval = setInterval(animateWords, 1500);

    // Start immediately
    animateWords();

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-section relative w-full min-h-screen bg-gradient-to-br from-[#0a0412] via-[#1a0b2e] to-[#0a0412] overflow-hidden">
      {/* Subtle purple overlay for depth - darker purple tones */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-950/30 via-transparent to-violet-950/30" />
      
      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center text-white text-center px-6 min-h-screen">
        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center text-center px-4">
          <motion.h1
            className="hero-title w-full max-w-full overflow-hidden px-2"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.span
              className="word inline-block break-words"
              data-word="1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Global
            </motion.span>{" "}
            <motion.span
              className="word inline-block break-words"
              data-word="2"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Benchmark
            </motion.span>
            <br />
            <motion.span
              className="word inline-block break-words"
              data-word="3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              For
            </motion.span>{" "}
            <motion.span
              className="word highlight-results inline-block break-words"
              data-word="4"
              data-text="Hiring."
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Hiring.
            </motion.span>
          </motion.h1>

          <motion.p
            className="hero-description text-lg md:text-2xl max-w-3xl mx-auto mt-6 mb-10 text-gray-300 text-center px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Proof driven hiring starts with us.
          </motion.p>



          {/* Company Logos Ticker - Continuous Scroll */}
          <motion.div
            className="university-ticker-container"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <div className="university-ticker">
              <div className="ticker-track-logos">
                <div className="company-logo">
                  <Image
                    src="/assets/multihexa-logo.png"
                    alt="Multihexa"
                    width={150}
                    height={70}
                    className="object-contain max-w-full max-h-full"
                  />
                </div>
                <div className="company-logo">
                  <Image
                    src="/assets/innivec-logo.png"
                    alt="Innivec"
                    width={150}
                    height={70}
                    className="object-contain max-w-full max-h-full"
                  />
                </div>
                <div className="company-logo">
                  <Image
                    src="/assets/msm-unify-logo.png"
                    alt="MSM Unify"
                    width={150}
                    height={70}
                    className="object-contain max-w-full max-h-full"
                  />
                </div>
                <div className="company-logo">
                  <Image
                    src="/assets/eton-college-logo.png"
                    alt="Eton College"
                    width={150}
                    height={70}
                    className="object-contain max-w-full max-h-full"
                  />
                </div>
                <div className="company-logo">
                  <Image
                    src="/assets/florida-coastal-logo.png"
                    alt="Florida Coastal University"
                    width={150}
                    height={70}
                    className="object-contain max-w-full max-h-full"
                  />
                </div>

                {/* Duplicate for seamless loop */}
                <div className="company-logo">
                  <Image
                    src="/assets/multihexa-logo.png"
                    alt="Multihexa"
                    width={150}
                    height={70}
                    className="object-contain max-w-full max-h-full"
                  />
                </div>
                <div className="company-logo">
                  <Image
                    src="/assets/innivec-logo.png"
                    alt="Innivec"
                    width={150}
                    height={70}
                    className="object-contain max-w-full max-h-full"
                  />
                </div>
                <div className="company-logo">
                  <Image
                    src="/assets/msm-unify-logo.png"
                    alt="MSM Unify"
                    width={150}
                    height={70}
                    className="object-contain max-w-full max-h-full"
                  />
                </div>
                <div className="company-logo">
                  <Image
                    src="/assets/eton-college-logo.png"
                    alt="Eton College"
                    width={150}
                    height={70}
                    className="object-contain max-w-full max-h-full"
                  />
                </div>
                <div className="company-logo">
                  <Image
                    src="/assets/florida-coastal-logo.png"
                    alt="Florida Coastal University"
                    width={150}
                    height={70}
                    className="object-contain max-w-full max-h-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}