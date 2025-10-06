import Image from "next/image";
import { motion } from "framer-motion";

const companies = [
  { name: "Microsoft", src: "/assets/microsoft.png", width: 120, height: 40 },
  { name: "Google", src: "/assets/google.png", width: 120, height: 40 },
  { name: "Amazon", src: "/assets/amazon.png", width: 120, height: 40 },
  { name: "Meta", src: "/assets/meta.png", width: 120, height: 40 },
  { name: "Apple", src: "/assets/apple.png", width: 120, height: 40 },
  { name: "Netflix", src: "/assets/netflix.png", width: 120, height: 40 },
  { name: "Tesla", src: "/assets/tesla.png", width: 120, height: 40 },
  { name: "Spotify", src: "/assets/spotify.png", width: 120, height: 40 },
];

export default function ScreenshotSection() {
  return (
    <section className="bg-[#0D0D0D] px-4 md:px-8 lg:px-16 py-20 text-center max-w-7xl mx-auto">
      <motion.h2
        className="text-3xl md:text-4xl font-bold mb-12 text-white"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Powering recruitment for leading enterprises
      </motion.h2>
      <motion.div
        className="grid grid-cols-4 grid-rows-2 gap-8 items-center justify-center max-w-5xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {companies.map((company) => (
          <div key={company.name} className="flex justify-center">
            <Image
              src={company.src}
              alt={company.name}
              width={company.width}
              height={company.height}
              className="object-contain filter invert brightness-200"
              priority={true}
            />
          </div>
        ))}
      </motion.div>
      <motion.p
        className="mt-12 text-white/70 max-w-3xl mx-auto text-lg"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        Velric works directly with businesses and universities who pay to recruit the best talent through proof not claims.
      </motion.p>
    </section>
  );
}
