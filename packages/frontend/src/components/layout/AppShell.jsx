import { useState } from 'react';
import NavBar from './NavBar.jsx';
import RecentSessions from '../session/RecentSessions.jsx';
import SessionSelector from '../session/SessionSelector.jsx';

export default function AppShell({ children }) {
  const [selectorOpen, setSelectorOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#000000] text-white font-sans overflow-x-hidden">

      {/* ── Global Background Layer ── */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        {/* Dark red-tinted gradient from top */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0505] to-black" />
        {/* Subtle red radial bloom in center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-red-600/[0.04] rounded-full blur-[140px]" />
        {/* Fine grid overlay */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
          }}
        />
      </div>

      {/* ── Navbar ── */}
      <NavBar onSessionClick={() => setSelectorOpen(true)} />

      {/* ── Recent Sessions bar ── */}
      <div className="relative z-10 hidden md:flex items-center gap-2 px-6 py-2 border-b border-white/5 bg-black/40 backdrop-blur-sm mt-[72px]">
        <RecentSessions />
      </div>

      {/* ── Main content ── */}
      <main className="relative z-10 px-4 py-6 md:px-8 md:py-8 md:mt-0 mt-[72px]">
        {children}
      </main>

      <SessionSelector open={selectorOpen} onClose={() => setSelectorOpen(false)} />
    </div>
  );
}

