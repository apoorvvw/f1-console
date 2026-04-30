import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSessionContext } from '../../context/SessionContext.jsx';

const NAV_TABS = [
  { label: 'Lap Times', path: '/lap-times' },
  { label: 'Track', path: '/track' },
  { label: 'Qualifying', path: '/qualifying' },
  { label: 'Championship', path: '/championship' },
];

export default function NavBar({ onSessionClick }) {
  const location = useLocation();
  const { activeSession } = useSessionContext();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const sessionLabel = activeSession
    ? `${activeSession.year} – ${activeSession.event} ${activeSession.sessionType}`
    : 'Select Session';

  return (
    <>
      {/* Fixed top navbar */}
      <header className="fixed top-0 left-0 w-full z-50 px-4 pt-4 pb-2">
        <nav className="max-w-6xl mx-auto flex items-center justify-between bg-black/70 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-3 shadow-glass">

          {/* Brand */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-5 h-5 bg-[#ef233c] rounded-sm rotate-45 shadow-red-glow-sm" />
            <span className="text-base font-bold font-display tracking-tight text-white">
              F1 Console
            </span>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_TABS.map((tab) => {
              const active = location.pathname.startsWith(tab.path);
              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className={[
                    'px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                    active
                      ? 'bg-[rgba(239,35,60,0.12)] text-[#ef233c] border border-[rgba(239,35,60,0.3)]'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5',
                  ].join(' ')}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>

          {/* Session selector button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onSessionClick}
              className="shiny-cta hidden md:inline-flex items-center gap-2 max-w-[200px]"
              title={sessionLabel}
            >
              <span className="truncate">{sessionLabel}</span>
            </button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Open navigation menu"
              onClick={() => setDrawerOpen(true)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div className={[
        'fixed top-0 left-0 h-full w-72 z-50 flex flex-col md:hidden',
        'bg-[#0a0a0a] border-r border-white/10',
        'transition-transform duration-300 ease-in-out',
        drawerOpen ? 'translate-x-0' : '-translate-x-full',
      ].join(' ')}>
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 bg-[#ef233c] rounded-sm rotate-45" />
            <span className="text-base font-bold font-display tracking-tight">F1 Console</span>
          </div>
          <button
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-4 flex-1">
          {NAV_TABS.map((tab) => {
            const active = location.pathname.startsWith(tab.path);
            return (
              <Link
                key={tab.path}
                to={tab.path}
                onClick={() => setDrawerOpen(false)}
                className={[
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                  active
                    ? 'bg-[rgba(239,35,60,0.12)] text-[#ef233c] border border-[rgba(239,35,60,0.25)]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5',
                ].join(' ')}
              >
                {active && <span className="w-1.5 h-1.5 rounded-full bg-[#ef233c]" />}
                {tab.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => { setDrawerOpen(false); onSessionClick(); }}
            className="w-full shiny-cta text-center"
          >
            {sessionLabel}
          </button>
        </div>
      </div>
    </>
  );
}

