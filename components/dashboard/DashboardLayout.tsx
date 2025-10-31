import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface DashboardLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function DashboardLayout({ children, className = '' }: DashboardLayoutProps) {
  return (
    <div className={`min-h-screen ${className}`} style={{
      background: 'linear-gradient(135deg, #1a0b2e 0%, #16213e 50%, #0f3460 100%)'
    }}>
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Ambient Lighting Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-cyan-500/10 to-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-full blur-3xl animate-spin" style={{ animationDuration: '60s' }} />
        
        {/* Subtle Grain Texture */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)
            `,
            backgroundSize: '20px 20px'
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-16">
        {children}
      </div>
    </div>
  );
}

interface DashboardGridProps {
  children: ReactNode;
  className?: string;
}

export function DashboardGrid({ children, className = '' }: DashboardGridProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`max-w-7xl mx-auto px-4 py-8 ${className}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {children}
      </div>
    </motion.div>
  );
}

interface DashboardColumnProps {
  children: ReactNode;
  span?: number;
  className?: string;
}

export function DashboardColumn({ children, span = 6, className = '' }: DashboardColumnProps) {
  return (
    <div className={`lg:col-span-${span} space-y-6 ${className}`}>
      {children}
    </div>
  );
}