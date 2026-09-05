import ImageSlot from "./ImageSlot";

const ExpandIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="h-3.5 w-3.5"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      d="M9 3H5a2 2 0 0 0-2 2v4M15 3h4a2 2 0 0 1 2 2v4M9 21H5a2 2 0 0 1-2-2v-4M15 21h4a2 2 0 0 0 2-2v-4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Polaroid({
  label,
  emoji,
  color,
  rotate,
  offset = 0,
  delay = 0,
  onClick,
  className = "",
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative mx-auto flex w-full max-w-[180px] aspect-[4/5] cursor-pointer flex-col text-left lg:aspect-auto lg:min-h-0 lg:max-h-[228px] lg:flex-1 ${className}`}
    >
      <span
        aria-hidden
        className="absolute inset-0 z-0 translate-x-0 translate-y-0 scale-90 rotate-[-14deg] rounded-sm bg-white p-2 pb-2.5 opacity-0 shadow-md transition-all duration-300 ease-out group-hover:translate-x-[-30px] group-hover:translate-y-[16px] group-hover:rotate-[-22deg] group-hover:scale-100 group-hover:opacity-100"
      >
        <span
          className="block h-full w-full rounded-sm"
          style={{ backgroundColor: color }}
        />
      </span>
      <span
        aria-hidden
        className="absolute inset-0 z-[1] translate-x-0 translate-y-0 scale-95 rotate-[12deg] rounded-sm bg-white p-2 pb-2.5 opacity-0 shadow-md transition-all duration-300 ease-out group-hover:translate-x-[30px] group-hover:translate-y-[12px] group-hover:rotate-[18deg] group-hover:scale-100 group-hover:opacity-100"
      >
        <span
          className="block h-full w-full rounded-sm"
          style={{ backgroundColor: color }}
        />
      </span>

      <span
        className="polaroid-float relative z-10 flex min-h-0 flex-1 flex-col rounded-sm bg-white p-2.5 pb-3 shadow-[0_12px_24px_-8px_rgba(0,0,0,0.25)]"
        style={{
          "--rotate": `${rotate}deg`,
          "--offset": `${offset}px`,
          "--float-delay": `${delay}s`,
        }}
      >
        <div className="relative min-h-0 w-full flex-1 overflow-hidden">
          <ImageSlot
            label={label}
            placeholder={color}
            showLabel={false}
            uploadable={false}
            className="h-full w-full"
          />
        </div>
        <p className="mt-2.5 flex shrink-0 items-center justify-between gap-1.5 text-sm text-neutral-700">
          <span className="flex items-center gap-1.5">
            <span>{emoji}</span>
            <span>{label}</span>
          </span>
          <span className="flex h-5 w-5 shrink-0 scale-75 items-center justify-center rounded-full bg-neutral-900 text-white opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
            <ExpandIcon />
          </span>
        </p>
      </span>
    </button>
  );
}
