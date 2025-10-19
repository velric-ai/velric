import React, { useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { Circle, Triangle, Hexagon } from "lucide-react";
import { motion } from "framer-motion";

const Merch = () => {
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

  const merchItems = useMemo(() => [
    {
      name: "PRICE TAG Proof Tee",
      price: "$100",
      image: "/assets/Price-Tag-Proof-Tee.png",
      description: "Show your commitment to proof over promises"
    },
    {
      name: "Founder Hoodie",
      price: "$180",
      image: "/assets/Founder-Hoodie.png",
      description: "Premium hoodie for the ambitious builders"
    },
    {
      name: "Global Cap",
      price: "$65",
      image: "/assets/Global-Cap.png",
      description: "Represent the global standard of talent"
    },
    {
      name: "Core Crewneck",
      price: "$150",
      image: "/assets/Core-Crowneck.png",
      description: "Essential wear for the execution-focused"
    }
  ], []);

  // Debug: Log the image paths and test accessibility
  useEffect(() => {
    console.log("Merch items with image paths:", merchItems.map(item => ({ name: item.name, image: item.image })));

    // Test if images are accessible
    merchItems.forEach(item => {
      const img = new Image();
      img.onload = () => console.log(`✅ Image accessible: ${item.image}`);
      img.onerror = () => console.error(`❌ Image NOT accessible: ${item.image}`);
      img.src = item.image;
    });
  }, [merchItems]);

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
      <section className="max-w-6xl mx-auto px-4 md:px-8 lg:px-16 pt-52 pb-12 text-center relative z-10">
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold mb-6 text-white"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Velric <span className="text-purple-400">Merch</span>
        </motion.h1>
        <motion.p
          className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Wear your commitment to <strong className="text-purple-400">proof over promises</strong>.
          Each piece represents the movement toward <strong className="text-purple-300">execution-based hiring</strong>.
        </motion.p>
      </section>

      {/* Merch Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
          {merchItems.map((item, index) => (
            <motion.div
              key={index}
              className="bg-gradient-to-br from-[#1C1C1E] to-[#2A1A3A] rounded-3xl overflow-hidden shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 hover:scale-105 border border-purple-500/10 hover:border-purple-500/30 group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{
                y: -8,
                boxShadow: "0 25px 50px rgba(147, 51, 234, 0.4)"
              }}
            >
              {/* Product Image */}
              <div className="relative h-80 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-8 overflow-hidden rounded-t-3xl product-image-container">
                <div className="relative w-full h-full flex items-center justify-center min-h-[200px]">
                  {/* Enhanced Image Display */}
                  <div className="relative w-full h-full max-w-xs max-h-xs bg-white/70 rounded-lg p-4 backdrop-blur-sm border border-white/20 shadow-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="merch-product-image w-full h-full object-contain hover:scale-110 transition-transform duration-500 drop-shadow-2xl"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        display: 'block',
                        margin: 'auto',
                        opacity: 1,
                        visibility: 'visible'
                      }}
                      onLoad={(e) => {
                        console.log(`Successfully loaded image: ${item.image}`);
                        e.currentTarget.style.opacity = '1';
                        e.currentTarget.style.visibility = 'visible';
                      }}
                      onError={(e) => {
                        console.error(`Failed to load image: ${item.image}`);
                        console.error(`Full path attempted: ${window.location.origin}${item.image}`);
                        // Show fallback with better styling
                        const fallback = document.createElement('div');
                        fallback.className = 'w-full h-full flex items-center justify-center text-purple-400 text-6xl font-bold bg-gradient-to-br from-purple-900/20 to-purple-700/20 rounded-lg border border-purple-500/30';
                        fallback.innerHTML = item.name.charAt(0);
                        e.currentTarget.parentNode?.appendChild(fallback);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-purple-500 text-white text-sm px-3 py-1 rounded-full font-semibold shadow-lg">
                  {item.price}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-8 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ opacity: 0 }} />
                <h3 className="text-2xl font-bold text-white mb-3 relative z-10">{item.name}</h3>
                <p className="text-gray-300 text-base mb-6 leading-relaxed relative z-10">{item.description}</p>

                <div className="flex items-center justify-between relative z-10">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
                    {item.price}
                  </div>
                  <motion.button
                    className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                  >
                    Buy Now
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-4xl mx-auto px-4 md:px-8 lg:px-16 py-20 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join the <span className="text-purple-400">Movement</span>
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Be part of the community that values <strong className="text-purple-300">execution over credentials</strong>.
            Shop our exclusive merch collection and represent the movement.
          </p>
          <motion.button
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
          >
            Shop All Items
          </motion.button>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Merch;