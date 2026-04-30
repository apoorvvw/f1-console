export default function LapSelector({ lapCount = 0, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-medium text-white/40 uppercase tracking-widest mb-2">Lap</label>
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
        className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#ef233c] transition-colors"
      >
        <option value="" className="bg-[#111]">Fastest Lap</option>
        {Array.from({ length: lapCount }, (_, i) => i + 1).map((n) => (
          <option key={n} value={n} className="bg-[#111]">
            Lap {n}
          </option>
        ))}
      </select>
    </div>
  );
}
