/**
 * Inline status / info alert bar — replaces MUI Alert.
 * Usage: <InfoAlert>No session selected…</InfoAlert>
 */
export default function InfoAlert({ children }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/10 text-white/60 text-sm animate-fade-in">
      <svg className="shrink-0 mt-0.5 text-white/40" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <span>{children}</span>
    </div>
  );
}
