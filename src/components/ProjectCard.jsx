import ImageSlot from "./ImageSlot";
import TicketDashboardMockup from "./TicketDashboardMockup";

const ArrowIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="h-4 w-4"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M7 17L17 7M17 7H9M17 7V15" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function Tag({ children }) {
  return (
    <span className="rounded-full border border-neutral-700 bg-neutral-800/60 px-3 py-1 text-[10px] font-semibold tracking-wide text-neutral-300">
      {children}
    </span>
  );
}

export default function ProjectCard({ project, onClick, className = "" }) {
  const { number, large, filled, tags, title, description, slotLabel } =
    project;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900 text-left transition hover:border-neutral-700 ${className}`}
    >
      <div className="relative min-h-0 flex-1 overflow-hidden">
        {filled ? (
          <div className="absolute inset-0 flex items-start justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top,_#6b6f76_0%,_#3a3c40_45%,_#1a1b1d_100%)] px-6 pb-6 pt-16">
            <TicketDashboardMockup />
          </div>
        ) : (
          <ImageSlot
            label={slotLabel}
            className="absolute inset-0 bg-neutral-800/60"
            iconClassName="text-neutral-600"
          />
        )}

        <span className="absolute left-5 top-5 font-display text-sm font-bold text-accent-work">
          {number}
        </span>
        <span
          aria-hidden
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-white/90 backdrop-blur-sm transition group-hover:bg-white/10"
        >
          <ArrowIcon />
        </span>
      </div>

      <div className={`shrink-0 ${large ? "p-5 md:p-6" : "p-4 md:p-5"}`}>
        <div className="mb-3 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
        <h3
          className={`font-display font-extrabold leading-snug text-white ${
            large ? "text-lg md:text-xl lg:text-2xl" : "text-base md:text-lg"
          }`}
        >
          {title}
        </h3>
        {description && (
          <p className="mt-2 text-xs leading-relaxed text-neutral-400 md:text-sm">
            {description}
          </p>
        )}
      </div>
    </button>
  );
}
