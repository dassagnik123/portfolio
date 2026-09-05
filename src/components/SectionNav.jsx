export default function SectionNav({ sections, activeId, onNavigate }) {
  return (
    <nav
      aria-label="Case study sections"
      className="fixed left-4 top-1/2 z-[60] hidden -translate-y-1/2 flex-col items-start gap-2.5 xl:left-8 xl:flex"
    >
      {sections.map((section) => {
        const isActive = section.id === activeId;
        return (
          <button
            key={section.id}
            type="button"
            onClick={() => onNavigate(section.id)}
            aria-current={isActive}
            className="group flex items-center gap-3"
          >
            <span
              className={`h-2 w-2 shrink-0 rounded-full border transition-all duration-200 ${
                isActive
                  ? "scale-125 border-accent-work bg-accent-work"
                  : "border-neutral-600 bg-transparent group-hover:border-accent-work group-hover:bg-accent-work/50"
              }`}
            />
            <span
              className={`whitespace-nowrap text-xs font-medium transition-colors duration-200 ${
                isActive
                  ? "text-accent-work"
                  : "text-neutral-500 group-hover:text-neutral-300"
              }`}
            >
              {section.heading}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
