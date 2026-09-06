import { useEffect, useRef, useState } from "react";
import ImageSlot from "./ImageSlot";
import SectionNav from "./SectionNav";
import TicketDashboardMockup from "./TicketDashboardMockup";

function sectionId(heading) {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const BackIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="h-4 w-4"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function Tag({ children }) {
  return (
    <span className="rounded-full border border-neutral-700 bg-neutral-800/60 px-3 py-1 text-xs font-semibold tracking-wide text-neutral-300">
      {children}
    </span>
  );
}

function Rich({ text }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-white">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

function Block({ block }) {
  switch (block.type) {
    case "h3":
      return (
        <h4 className="font-display text-lg font-bold text-white">
          {block.text}
        </h4>
      );
    case "p":
      return (
        <p className="text-sm leading-relaxed text-neutral-400 sm:text-base">
          <Rich text={block.text} />
        </p>
      );
    case "ul":
      return (
        <ul className="space-y-2">
          {block.items.map((item, i) => (
            <li
              key={i}
              className="flex gap-2.5 text-sm leading-relaxed text-neutral-400 sm:text-base"
            >
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-work" />
              <span>
                <Rich text={item} />
              </span>
            </li>
          ))}
        </ul>
      );
    case "fields":
      return (
        <div className="space-y-1.5">
          {block.items.map((item, i) => (
            <p key={i} className="text-sm text-neutral-400 sm:text-base">
              <Rich text={item} />
            </p>
          ))}
        </div>
      );
    case "quote":
      return (
        <blockquote className="border-l-2 border-accent-work pl-4 text-sm italic leading-relaxed text-neutral-300 sm:text-base">
          <Rich text={block.text} />
        </blockquote>
      );
    case "image":
      return (
        <figure className="my-2 flex flex-col gap-2">
          <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
            <img
              src={block.src}
              alt={block.alt}
              loading="lazy"
              className="w-full"
            />
          </div>
          {block.caption && (
            <figcaption className="text-xs leading-relaxed text-neutral-500 sm:text-sm">
              <Rich text={block.caption} />
            </figcaption>
          )}
        </figure>
      );
    default:
      return null;
  }
}

function CaseStudySection({ section }) {
  return (
    <section
      id={sectionId(section.heading)}
      className="scroll-mt-24 flex flex-col gap-4 border-t border-neutral-800 pt-10 first:border-t-0 first:pt-0"
    >
      <h3 className="font-display text-2xl font-extrabold text-white">
        {section.heading}
      </h3>
      {section.blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </section>
  );
}

function CaseStudyOverview({ rows }) {
  return (
    <section
      id="overview"
      className="scroll-mt-24 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 sm:p-6"
    >
      <div className="mb-4 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-accent-work" />
        <h3 className="font-display text-xs font-bold uppercase tracking-[0.18em] text-neutral-300">
          1-minute overview
        </h3>
      </div>
      <dl className="flex flex-col gap-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[5.5rem_1fr] gap-x-4 border-t border-neutral-800/70 pt-3 first:border-t-0 first:pt-0 sm:grid-cols-[7rem_1fr]"
          >
            <dt className="pt-0.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-500 sm:text-xs">
              {row.label}
            </dt>
            <dd className="text-sm leading-relaxed text-neutral-300 sm:text-base">
              <Rich text={row.text} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default function ProjectDetail({ project, onBack }) {
  const { number, filled, cover, tags, title, description, slotLabel, caseStudy } =
    project;

  const navSections = caseStudy
    ? [
        ...(caseStudy.overview
          ? [{ heading: "Overview", id: "overview" }]
          : []),
        ...caseStudy.sections.map((s) => ({
          heading: s.heading,
          id: sectionId(s.heading),
        })),
      ]
    : [];

  const [activeId, setActiveId] = useState(navSections[0]?.id ?? null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!caseStudy) return undefined;
    const container = scrollRef.current;
    if (!container) return undefined;

    const ids = navSections.map((s) => s.id);
    // Activation line, just below the sticky Back bar.
    const LINE = 140;

    function update() {
      const els = ids
        .map((id) => document.getElementById(id))
        .filter(Boolean);
      if (els.length === 0) return;

      const maxScroll = container.scrollHeight - container.clientHeight;

      // Sections in the final screenful can never scroll their heading up to
      // LINE. Slide the detection line down toward the viewport bottom as the
      // scroll approaches the end, so those trailing sections still activate
      // in order instead of the last reachable one staying stuck.
      let line = LINE;
      if (maxScroll > 4) {
        const overshoot = Math.max(
          0,
          container.scrollTop - (maxScroll - container.clientHeight),
        );
        const t = Math.min(1, overshoot / container.clientHeight);
        line = LINE + t * (container.clientHeight - LINE);
      }

      let current = els[0].id;
      for (const el of els) {
        if (el.getBoundingClientRect().top - line <= 1) {
          current = el.id;
        } else {
          break;
        }
      }

      // Pinned to the bottom → the very last section is the one in view.
      if (maxScroll > 4 && container.scrollTop >= maxScroll - 2) {
        current = els[els.length - 1].id;
      }

      setActiveId(current);
    }

    update();
    container.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      container.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseStudy]);

  function handleNavigate(id) {
    setActiveId(id);
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  const activeIdRef = useRef(activeId);
  activeIdRef.current = activeId;
  const navSectionsRef = useRef(navSections);
  navSectionsRef.current = navSections;

  useEffect(() => {
    if (!caseStudy) return undefined;

    function handleKeyDown(e) {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      e.preventDefault();

      const sections = navSectionsRef.current;
      const currentIndex = sections.findIndex(
        (s) => s.id === activeIdRef.current,
      );
      const delta = e.key === "ArrowDown" ? 1 : -1;
      const nextIndex = Math.min(
        Math.max(currentIndex + delta, 0),
        sections.length - 1,
      );
      const next = sections[nextIndex];
      if (next) handleNavigate(next.id);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseStudy]);

  return (
    <div
      ref={scrollRef}
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-neutral-950 text-white"
    >
      <div className="sticky top-0 z-30 shrink-0 bg-neutral-950/90 px-6 py-4 backdrop-blur-sm sm:px-10">
        <button
          type="button"
          onClick={onBack}
          className="flex w-fit items-center gap-2 rounded-full border-2 border-accent-work px-5 py-2.5 text-sm font-semibold text-accent-work transition hover:bg-accent-work hover:text-neutral-950"
        >
          <BackIcon />
          Back
        </button>
      </div>

      {navSections.length > 0 && (
        <>
          <SectionNav
            sections={navSections}
            activeId={activeId}
            onNavigate={handleNavigate}
          />
          <div className="fixed bottom-6 right-6 z-[60] hidden items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/90 px-4 py-2 text-xs text-neutral-400 backdrop-blur-sm sm:flex">
            <span className="flex items-center gap-1">
              <kbd className="flex h-5 w-5 items-center justify-center rounded border border-neutral-700 bg-neutral-800 font-sans text-[10px] text-neutral-300">
                ↑
              </kbd>
              <kbd className="flex h-5 w-5 items-center justify-center rounded border border-neutral-700 bg-neutral-800 font-sans text-[10px] text-neutral-300">
                ↓
              </kbd>
            </span>
            <span>to navigate sections</span>
          </div>
        </>
      )}

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 pb-16 pt-4 sm:px-10">
        {cover ? (
          <div className="relative overflow-hidden rounded-3xl border border-neutral-800">
            <img
              src={cover}
              alt={title}
              className="w-full object-cover"
            />
            <span className="absolute left-6 top-6 font-display text-sm font-bold text-accent-work">
              {number}
            </span>
          </div>
        ) : (
          <div className="relative flex min-h-[320px] items-start justify-center overflow-hidden rounded-3xl border border-neutral-800 bg-[radial-gradient(ellipse_at_top,_#6b6f76_0%,_#3a3c40_45%,_#1a1b1d_100%)] px-6 pb-10 pt-16">
            <span className="absolute left-6 top-6 font-display text-sm font-bold text-accent-work">
              {number}
            </span>
            {filled ? (
              <TicketDashboardMockup />
            ) : (
              <ImageSlot
                label={slotLabel}
                className="h-64 w-full max-w-md"
                iconClassName="text-neutral-600"
              />
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>

        <h2 className="font-display text-3xl font-extrabold leading-snug sm:text-4xl">
          {title}
        </h2>

        {caseStudy ? (
          <>
            <div className="flex flex-wrap gap-x-8 gap-y-1 text-xs text-neutral-500 sm:text-sm">
              <span>
                <span className="text-neutral-400">Created:</span>{" "}
                {caseStudy.created}
              </span>
              <span>
                <span className="text-neutral-400">Duration:</span>{" "}
                {caseStudy.duration}
              </span>
            </div>

            {caseStudy.overview && (
              <CaseStudyOverview rows={caseStudy.overview} />
            )}

            <div className="flex flex-col gap-10">
              {caseStudy.sections.map((section) => (
                <CaseStudySection key={section.heading} section={section} />
              ))}
            </div>
          </>
        ) : (
          description && (
            <p className="max-w-2xl text-base leading-relaxed text-neutral-400 sm:text-lg">
              {description}
            </p>
          )
        )}
      </div>
    </div>
  );
}
