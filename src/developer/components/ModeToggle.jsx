const OPTIONS = [
  { key: "work", label: "9-5" },
  { key: "personal", label: "5-9" },
];

export default function ModeToggle({ mode, onToggle }) {
  const isPersonal = mode === "personal";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isPersonal}
      aria-label="Toggle between work and personal mode"
      onClick={onToggle}
      className="relative grid h-9 w-[120px] shrink-0 cursor-pointer select-none grid-cols-2 overflow-hidden rounded-full bg-[#1f1f1f] p-1 ring-1 ring-white/15 transition-[transform,box-shadow] duration-200 ease-out hover:ring-white/30 active:scale-[0.94]"
    >
      <span
        aria-hidden
        className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-white shadow-sm transition-transform duration-500 ease-[cubic-bezier(0.34,1.25,0.64,1)] ${
          isPersonal ? "translate-x-full" : "translate-x-0"
        }`}
      />
      {OPTIONS.map(({ key, label }) => {
        const active = mode === key;
        return (
          <span
            key={key}
            className={`font-condensed relative z-10 flex items-center justify-center text-sm font-semibold uppercase tracking-wide transition-colors duration-300 delay-100 ${
              active ? "text-black" : "text-white/40"
            }`}
          >
            {label}
          </span>
        );
      })}
    </button>
  );
}
