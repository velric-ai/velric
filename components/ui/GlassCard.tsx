import { ReactNode, HTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary';
  hover?: boolean;
  glow?: 'cyan' | 'green' | 'purple' | 'pink' | 'orange' | 'blue';
  className?: string;
}

export default function GlassCard({ 
  children, 
  variant = 'primary', 
  hover = true, 
  glow,
  className = '',
  ...props 
}: GlassCardProps) {
  const baseClasses = {
    primary: 'glass-card',
    secondary: 'glass-card-secondary', 
    tertiary: 'glass-card-tertiary'
  };

  const glowClasses = {
    cyan: 'hover:shadow-[0_0_30px_rgba(0,245,255,0.3)]',
    green: 'hover:shadow-[0_0_30px_rgba(0,255,135,0.3)]',
    purple: 'hover:shadow-[0_0_30px_rgba(167,139,250,0.3)]',
    pink: 'hover:shadow-[0_0_30px_rgba(244,114,182,0.3)]',
    orange: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]',
    blue: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]'
  };

  const combinedClasses = [
    baseClasses[variant],
    glow ? glowClasses[glow] : '',
    className
  ].filter(Boolean).join(' ');

  if (hover) {
    return (
      <motion.div
        className={combinedClasses}
        whileHover={{
          y: -4,
          scale: 1.02,
        }}
        transition={{
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1]
        }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={combinedClasses} {...props}>
      {children}
    </div>
  );
}