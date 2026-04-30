export default function RoundSelector({ value, totalRounds, onChange }) {
  const max = totalRounds || 24;

  return (
    <div className="px-2">
      <p className="text-xs font-medium text-white/40 uppercase tracking-widest mb-3">
        Round <span className="text-white/80">{value}</span> of {max}
      </p>
      <input
        type="range"
        min={1}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="championship round selector"
        className="w-full h-1.5 appearance-none rounded-full cursor-pointer"
        style={{
          background: `linear-gradient(to right, #ef233c ${((value - 1) / (max - 1)) * 100}%, rgba(255,255,255,0.1) 0%)`,
          accentColor: '#ef233c',
        }}
      />
    </div>
  );
}
