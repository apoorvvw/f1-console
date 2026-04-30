/**
 * Glassmorphic dark card — replaces MUI Paper for content sections.
 * Usage: <Card className="p-4">...</Card>
 *        <Card glow>...</Card>  — adds red glow border on hover
 */
export default function Card({ children, className = '', glow = false }) {
  return (
    <div
      className={[
        'glass-card rounded-2xl',
        glow
          ? 'hover:border-[rgba(239,35,60,0.3)] hover:shadow-red-glow-sm transition-all duration-300'
          : 'hover:border-white/15 transition-colors duration-200',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}
