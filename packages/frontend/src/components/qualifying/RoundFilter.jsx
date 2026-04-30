const ROUNDS = ['All', 'Q1', 'Q2', 'Q3'];

export default function RoundFilter({ value, onChange }) {
  return (
    <div className="flex items-center gap-1" role="group" aria-label="qualifying round filter">
      {ROUNDS.map((r) => (
        <button
          key={r}
          onClick={() => onChange(r)}
          aria-label={r}
          aria-pressed={value === r}
          className={[
            'px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200',
            value === r
              ? 'bg-[rgba(239,35,60,0.15)] text-[#ef233c] border-[rgba(239,35,60,0.4)]'
              : 'bg-white/5 text-white/50 border-white/10 hover:text-white hover:bg-white/10',
          ].join(' ')}
        >
          {r}
        </button>
      ))}
    </div>
  );
}
