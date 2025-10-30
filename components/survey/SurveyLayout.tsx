import { ReactNode } from "react";
import Link from "next/link";

interface SurveyLayoutProps {
  children: ReactNode;
}

export function SurveyLayout({ children }: SurveyLayoutProps) {
  return (
    <div 
      className="min-h-screen text-white font-sans antialiased flex flex-col"
      style={{
        background: 'linear-gradient(135deg, #1a0b2e 0%, #16213e 50%, #0f3460 100%)'
      }}
    >
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-cyan-500/10 to-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <img
              src="/assets/logo.png"
              alt="Velric Logo"
              className="h-10 brightness-110"
            />
            <span className="text-xl font-bold text-white">Velric</span>
          </Link>
          
          <div className="text-sm text-white/60">
            Complete your profile to get started
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-white/40 text-sm">
            Need help? <Link href="/contact" className="text-cyan-400 hover:text-cyan-300 transition-colors">Contact support</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}