/**
 * Page heading with gradient text + optional meta badge.
 * Usage: <PageHeader title="Lap Times" subtitle="2024 – Bahrain Grand Prix" />
 */
export default function PageHeader({ title, subtitle, badge }) {
  return (
    <div className="mb-6 animate-fade-up">
      {badge && (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-3">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#ef233c]" />
          </span>
          <span className="text-xs font-medium text-red-100/80 tracking-wide font-display">
            {badge}
          </span>
        </div>
      )}

      <h1 className="text-2xl md:text-3xl font-bold font-display tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50">
        {title}
      </h1>

      {subtitle && (
        <p className="mt-1 text-sm text-white/50 font-medium">
          {subtitle}
        </p>
      )}
    </div>
  );
}
