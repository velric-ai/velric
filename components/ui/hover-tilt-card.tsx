"use client";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HoverTiltCardProps {
  children: React.ReactNode;
  className?: string;
}

export const HoverTiltCard = ({
  children,
  className,
}: HoverTiltCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = ((y - centerY) / centerY) * 15;
    const rotateY = ((centerX - x) / centerX) * 15;

    setRotation({ x: rotateX, y: rotateY });
    setGlowPosition({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div
      className={cn("w-full h-full", className)}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: "1200px",
      }}
    >
      <motion.div
        animate={{
          rotateX: rotation.x,
          rotateY: rotation.y,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        style={{
          transformStyle: "preserve-3d",
        }}
        className="w-full h-full rounded-2xl"
      >
        {/* Base gradient background */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-900/50 via-purple-800/30 to-purple-700/40 border border-purple-500/40 backdrop-blur-xl shadow-2xl"></div>

        {/* Dynamic gradient glow */}
        <div
          className="absolute inset-0 rounded-2xl transition-all duration-100 opacity-0 hover:opacity-30"
          style={{
            background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, rgba(168, 85, 247, 0.4) 0%, transparent 60%)`,
          }}
        ></div>

        {/* Color shift on hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-500/0 via-purple-400/0 to-cyan-400/0 opacity-0 hover:opacity-15 transition-opacity duration-500"></div>

        {/* Content */}
        <div className="relative w-full h-full p-6 flex flex-col items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
};