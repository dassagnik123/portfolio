import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ImageSlot from "./ImageSlot";
import TicketDashboardMockup from "./TicketDashboardMockup";

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

const ChevronLeftIcon = () => (
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

const ChevronRightIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="h-4 w-4"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
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

function CaseStudyImage({ src, alt }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex aspect-video items-center justify-center bg-neutral-900 p-6 text-center text-xs text-neutral-500">
        Image unavailable — {alt}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="max-h-[46vh] w-full object-contain"
      onError={() => setFailed(true)}
    />
  );
}

function Block({ block }) {
  switch (block.type) {
    case "h3":
      return (
        <h4 className="font-display text-xl font-bold text-white">
          {block.text}
        </h4>
      );
    case "p":
      return (
        <p className="text-base leading-relaxed text-neutral-300 sm:text-lg">
          <Rich text={block.text} />
        </p>
      );
    case "ul":
      return (
        <ul className="space-y-2.5">
          {block.items.map((item, i) => (
            <li
              key={i}
              className="flex gap-3 text-base leading-relaxed text-neutral-300 sm:text-lg"
            >
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-work" />
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
            <p key={i} className="text-base text-neutral-300 sm:text-lg">
              <Rich text={item} />
            </p>
          ))}
        </div>
      );
    case "quote":
      return (
        <blockquote className="border-l-2 border-accent-work pl-5 text-lg italic leading-relaxed text-neutral-200 sm:text-xl">
          <Rich text={block.text} />
        </blockquote>
      );
    case "image":
      return (
        <figure className="my-1 flex flex-col items-center gap-2.5">
          <div className="flex w-full items-center justify-center overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
            <CaseStudyImage src={block.src} alt={block.alt} />
          </div>
          {block.caption && (
            <figcaption className="text-center text-xs leading-relaxed text-neutral-500 sm:text-sm">
              <Rich text={block.caption} />
            </figcaption>
          )}
        </figure>
      );
    default:
      return null;
  }
}

function SectionSlide({ section }) {
  const images = section.blocks.filter((b) => b.type === "image");
  const content = section.blocks.filter((b) => b.type !== "image");

  if (images.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <h3 className="font-display text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
          {section.heading}
        </h3>
        <div className="flex flex-col gap-6">
          {content.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 lg:h-full lg:flex-row lg:items-stretch">
      <div className="order-2 flex shrink-0 flex-col gap-5 lg:order-none lg:h-full lg:w-[46%] lg:min-h-0 lg:overflow-y-auto lg:pr-2">
        {images.map((block, i) => (
          <Block key={i} block={block} />
        ))}
      </div>
      <div className="order-1 flex flex-1 flex-col gap-6 lg:order-none lg:h-full lg:min-h-0 lg:overflow-y-auto lg:pr-2">
        <h3 className="font-display text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
          {section.heading}
        </h3>
        <div className="flex flex-col gap-6">
          {content.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CaseStudyOverview({ rows, story }) {
  return (
    <section className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 sm:p-6">
      {story && (
        <div className="mb-5 border-b border-neutral-800/70 pb-5">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-work" />
            <h3 className="font-display text-xs font-bold uppercase tracking-[0.18em] text-neutral-300">
              The story behind the work
            </h3>
          </div>
          <p className="text-sm leading-relaxed text-neutral-300 sm:text-base">{story}</p>
        </div>
      )}
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
              {row.href ? (
                <a
                  href={row.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent-work underline underline-offset-4 hover:text-white"
                >
                  {row.text}
                </a>
              ) : (
                <Rich text={row.text} />
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function CoverSlide({ project, coverFailed, onCoverError }) {
  const { number, filled, cover, cover2, tags, title, slotLabel, caseStudy } =
    project;

  // Phones stack everything. From lg up: title and tags on top, then the cover and the
  // overview side by side as two equal boxes.
  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:gap-x-10 lg:gap-y-6">
      {cover ? (
        <div className="flex flex-col gap-4 lg:order-4">
          <div className="relative overflow-hidden rounded-3xl border border-neutral-800 lg:min-h-[240px] lg:flex-1 lg:bg-neutral-900">
            {coverFailed ? (
              <div className="flex min-h-[220px] items-center justify-center bg-neutral-900 p-6 text-center text-xs text-neutral-500 lg:h-full">
                Image unavailable
              </div>
            ) : (
              <img
                src={cover}
                alt={title}
                className="max-h-[38vh] w-full object-cover lg:absolute lg:inset-0 lg:h-full lg:max-h-none lg:object-contain"
                onError={onCoverError}
              />
            )}
            <span className="absolute left-5 top-5 rounded-full bg-black/70 px-2.5 py-1 font-display text-xs font-bold text-white backdrop-blur-sm">
              {number}
            </span>
          </div>
          {cover2 && !coverFailed && (
            <div className="relative hidden overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900 lg:block lg:min-h-[240px] lg:flex-1">
              <img
                src={cover2}
                alt=""
                className="absolute inset-0 h-full w-full object-contain"
              />
            </div>
          )}
        </div>
      ) : (
        <div className="relative flex min-h-[280px] items-start justify-center overflow-hidden rounded-3xl border border-neutral-800 bg-[radial-gradient(ellipse_at_top,_#6b6f76_0%,_#3a3c40_45%,_#1a1b1d_100%)] px-6 pb-10 pt-16 lg:order-4">
          <span className="absolute left-6 top-6 font-display text-sm font-bold text-accent-work">
            {number}
          </span>
          {filled ? (
            <TicketDashboardMockup />
          ) : (
            <ImageSlot
              label={slotLabel}
              className="h-56 w-full max-w-md"
              iconClassName="text-neutral-600"
            />
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2 lg:order-2 lg:col-span-2">
        {tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>

      <h2 className="font-display text-3xl font-extrabold leading-tight sm:text-4xl lg:order-1 lg:col-span-2 lg:text-5xl">
        {title}
      </h2>

      {caseStudy && (
        <>
          <div className="flex flex-wrap gap-x-8 gap-y-1 text-xs text-neutral-500 sm:text-sm lg:order-3 lg:col-span-2">
            {caseStudy.created && (
              <span>
                <span className="text-neutral-400">Created:</span>{" "}
                {caseStudy.created}
              </span>
            )}
            <span>
              <span className="text-neutral-400">Duration:</span>{" "}
              {caseStudy.duration}
            </span>
          </div>

          {caseStudy.overview && (
            <div className="flex flex-col lg:order-5 [&>section]:flex-1">
              <CaseStudyOverview rows={caseStudy.overview} story={caseStudy.story} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

// The overlay is clipped to the card it came from, then opened out to the full screen.
const insetFor = (rect) =>
  `inset(${rect.top}px ${window.innerWidth - rect.right}px ${window.innerHeight - rect.bottom}px ${rect.left}px round 32px)`;
const FULL = "inset(0px 0px 0px 0px round 0px)";

export default function ProjectDetail({ project, origin, onBack }) {
  const rootRef = useRef(null);
  const closing = useRef(false);
  const calm = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useLayoutEffect(() => {
    if (!origin || calm()) return undefined;
    const open = rootRef.current.animate([{ clipPath: insetFor(origin) }, { clipPath: FULL }], {
      duration: 650,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    });
    return () => open.cancel();
  }, [origin]);

  const handleBack = () => {
    if (closing.current) return;
    if (!origin || calm()) {
      onBack();
      return;
    }
    closing.current = true;
    const close = rootRef.current.animate([{ clipPath: FULL }, { clipPath: insetFor(origin) }], {
      duration: 480,
      easing: "cubic-bezier(0.65, 0, 0.35, 1)",
      fill: "forwards",
    });
    close.onfinish = onBack;
  };

  const { description, caseStudy } = project;

  const slides = caseStudy
    ? [
        { type: "cover" },
        ...caseStudy.sections.map((s) => ({ type: "section", section: s })),
      ]
    : [];

  const [slide, setSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [coverFailed, setCoverFailed] = useState(false);
  const slideNavRef = useRef(null);

  // Keep the current slide's title in view when the labels overflow the top bar.
  useEffect(() => {
    const nav = slideNavRef.current;
    const current = nav?.querySelector('[aria-current="true"]');
    if (!current || nav.scrollWidth <= nav.clientWidth) return;
    const navBox = nav.getBoundingClientRect();
    const box = current.getBoundingClientRect();
    const left =
      nav.scrollLeft + box.left - navBox.left - (navBox.width - box.width) / 2;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    nav.scrollTo({ left, behavior: still ? "auto" : "smooth" });
  }, [slide]);

  const total = slides.length;
  const isFirst = slide === 0;
  const isLast = slide === total - 1;
  const slideLabels = caseStudy
    ? ["Overview", ...caseStudy.sections.map((s) => s.heading)]
    : [];
  const currentHasImages =
    slides[slide]?.type === "section" &&
    slides[slide].section.blocks.some((b) => b.type === "image");

  function goTo(index) {
    setDirection(index > slide ? 1 : -1);
    setSlide(Math.min(Math.max(index, 0), total - 1));
  }

  function nextSlide() {
    if (!isLast) goTo(slide + 1);
  }

  function prevSlide() {
    if (!isFirst) goTo(slide - 1);
  }

  const touchStart = useRef(null);

  function handleTouchStart(e) {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  }

  function handleTouchEnd(e) {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const deltaX = t.clientX - touchStart.current.x;
    const deltaY = t.clientY - touchStart.current.y;
    touchStart.current = null;

    const SWIPE_THRESHOLD = 50;
    if (
      Math.abs(deltaX) < SWIPE_THRESHOLD ||
      Math.abs(deltaX) < Math.abs(deltaY) * 1.5
    ) {
      return;
    }

    if (deltaX < 0) {
      nextSlide();
    } else {
      prevSlide();
    }
  }

  useEffect(() => {
    if (!caseStudy) return undefined;

    function handleKeyDown(e) {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setSlide((s) => {
          const next = Math.min(s + 1, total - 1);
          if (next !== s) setDirection(1);
          return next;
        });
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setSlide((s) => {
          const prev = Math.max(s - 1, 0);
          if (prev !== s) setDirection(-1);
          return prev;
        });
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [caseStudy, total]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-neutral-950 text-white [color-scheme:dark]"
    >
      {caseStudy && (
        <div className="absolute inset-x-0 top-0 z-20 h-1 bg-neutral-900 xl:hidden">
          <div
            className="h-full bg-accent-work transition-all duration-500 ease-out"
            style={{ width: `${((slide + 1) / total) * 100}%` }}
          />
        </div>
      )}

      <div className="case-in relative z-30 grid shrink-0 grid-cols-[auto_1fr] items-center gap-x-4 px-6 py-4 sm:px-10 xl:grid-cols-[auto_1fr_auto]">
        <button
          type="button"
          onClick={handleBack}
          className="liquid-glass flex items-center gap-2 rounded-full text-sm text-white transition-transform hover:scale-[1.03] w-fit cursor-pointer px-6 py-3"
        >
          <BackIcon />
          Back
        </button>

        {caseStudy && (
          <>
            <nav
              ref={slideNavRef}
              aria-label="Slides"
              className="hidden items-center gap-x-1.5 overflow-x-auto whitespace-nowrap px-2 [scrollbar-width:none] xl:flex xl:[justify-content:safe_center] [&::-webkit-scrollbar]:hidden"
            >
              {slideLabels.map((label, i) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-current={i === slide}
                  className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1 font-display transition-colors duration-300 ${
                    i === slide
                      ? "text-sm font-bold text-accent-work lg:text-base"
                      : "text-[11px] font-medium text-neutral-600 hover:text-neutral-400 lg:text-xs"
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>

            <span className="hidden text-right font-display text-xs font-semibold tracking-widest text-neutral-500 xl:block">
              {String(slide + 1).padStart(2, "0")} /{" "}
              {String(total).padStart(2, "0")}
            </span>

            <span className="text-right font-display text-xs font-semibold tracking-widest text-neutral-500 xl:hidden">
              {String(slide + 1).padStart(2, "0")} /{" "}
              {String(total).padStart(2, "0")}
            </span>
          </>
        )}
      </div>

      {caseStudy ? (
        <>
          <div
            key={slide}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className={`relative z-10 flex flex-1 px-6 pb-6 pt-4 sm:px-10 ${
              currentHasImages
                ? "items-stretch overflow-y-auto lg:overflow-hidden"
                : "[align-items:safe_center] [justify-content:safe_center] overflow-y-auto"
            } ${direction >= 0 ? "slide-in-right" : "slide-in-left"}`}
          >
            <div
              className={`mx-auto w-full ${
                currentHasImages
                  ? "max-w-6xl"
                  : slides[slide].type === "cover"
                    ? "max-w-3xl lg:max-w-6xl"
                    : "max-w-3xl"
              }`}
            >
              {slides[slide].type === "cover" ? (
                <CoverSlide
                  project={project}
                  coverFailed={coverFailed}
                  onCoverError={() => setCoverFailed(true)}
                />
              ) : (
                <SectionSlide section={slides[slide].section} />
              )}
            </div>
          </div>

          <div className="case-in relative z-20 flex shrink-0 flex-col items-center gap-3 px-6 pb-6 pt-2 sm:pb-8">
            <div className="hidden items-center gap-2 sm:flex">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === slide}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === slide
                      ? "w-6 bg-accent-work"
                      : "w-1.5 bg-neutral-700 hover:bg-neutral-500"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={prevSlide}
                disabled={isFirst}
                className="bg-white font-medium flex items-center gap-2 rounded-full text-sm text-black transition-transform hover:scale-[1.03] cursor-pointer px-6 py-3 disabled:pointer-events-none disabled:opacity-30 sm:px-8"
              >
                <ChevronLeftIcon />
                Previous
              </button>

              <span className="font-display text-xs font-semibold tracking-widest text-neutral-500">
                {String(slide + 1).padStart(2, "0")} /{" "}
                {String(total).padStart(2, "0")}
              </span>

              <button
                type="button"
                onClick={nextSlide}
                disabled={isLast}
                className="bg-white font-medium flex items-center gap-2 rounded-full text-sm text-black transition-transform hover:scale-[1.03] cursor-pointer px-6 py-3 disabled:pointer-events-none disabled:opacity-30 sm:px-8"
              >
                Next
                <ChevronRightIcon />
              </button>
            </div>

            <p className="hidden text-xs text-neutral-300 sm:block">
              Use ← → keys to navigate
            </p>
            <p className="text-xs text-neutral-300 sm:hidden">
              Swipe left or right to navigate
            </p>
          </div>
        </>
      ) : (
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 overflow-y-auto px-6 pb-16 pt-24 sm:px-10">
          <CoverSlide
            project={project}
            coverFailed={coverFailed}
            onCoverError={() => setCoverFailed(true)}
          />
          {description && (
            <p className="max-w-2xl text-base leading-relaxed text-neutral-400 sm:text-lg">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
