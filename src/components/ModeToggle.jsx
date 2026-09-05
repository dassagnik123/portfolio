export default function ModeToggle({ mode, onToggle }) {
  const isPersonal = mode === "personal";

  return (
    <div className="flex items-center gap-2 select-none">
      <span
        className={`text-xs font-semibold tracking-wide transition-opacity ${
          isPersonal ? "opacity-40" : "opacity-100"
        }`}
      >
        9-5
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={isPersonal}
        aria-label="Toggle between work and personal mode"
        onClick={onToggle}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 cursor-pointer ${
          isPersonal ? "bg-accent-personal" : "bg-neutral-700"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full shadow-sm transition-all duration-300 ${
            isPersonal
              ? "left-[calc(100%-1.375rem)] bg-white"
              : "left-0.5 bg-accent-work"
          }`}
        />
      </button>
      <span
        className={`text-xs font-semibold tracking-wide transition-opacity ${
          isPersonal ? "opacity-100" : "opacity-40"
        }`}
      >
        5-9
      </span>
    </div>
  );
}
