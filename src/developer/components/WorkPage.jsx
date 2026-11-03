import { useEffect, useRef, useState } from "react";
import NameRibbon from "./NameRibbon";
import { EmailIcon, PhoneIcon } from "./icons";
import { contact, experience, projects, skills } from "../data";

const serif = { fontFamily: "'Instrument Serif', serif" };

const NAV_LINKS = [
  { label: "Home", href: "#top" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

const ArrowIcon = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8">
    <path d="M7 17L17 7M17 7H9M17 7V15" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function Tag({ children }) {
  return (
    <span className="rounded-full border border-white/15 px-3 py-1 text-[11px] tracking-wide text-muted-foreground">
      {children}
    </span>
  );
}

// One tile in the project grid; opens its case study.
// Fades and lifts its child into place the first time it scrolls into view. `index` staggers
// siblings so a row of cards arrives one after another.
function Reveal({ index = 0, children }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        io.disconnect();
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal h-full ${shown ? "reveal-in" : ""}`} style={{ "--d": `${index * 140}ms` }}>
      {children}
    </div>
  );
}

function ProjectTile({ project, onOpen }) {
  const [coverFailed, setCoverFailed] = useState(false);

  return (
    <button
      type="button"
      onClick={(e) => onOpen(e.currentTarget.getBoundingClientRect())}
      data-cursor="View case study"
      className="liquid-glass group flex h-full w-full cursor-pointer flex-col rounded-[2rem] p-4 text-left transition-transform duration-300 ease-out hover:scale-[1.03] sm:p-5"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-white/5">
        {project.cover && !coverFailed && (
          <img
            src={project.cover}
            alt={project.title}
            onError={() => setCoverFailed(true)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between gap-6 px-2 pb-2 pt-6">
        <div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{project.number} — Case study</span>
            <span className="liquid-glass flex h-10 w-10 items-center justify-center rounded-full text-foreground transition group-hover:scale-[1.06]">
              <ArrowIcon />
            </span>
          </div>
          <h3
            className="mt-5 text-2xl leading-[1.08] tracking-[-0.5px] text-foreground sm:text-3xl"
            style={serif}
          >
            {project.title}
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {project.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      </div>
    </button>
  );
}

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Eased window scroll; duration grows gently with distance so long jumps still glide.
function smoothScrollTo(targetY, onDone) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  if (Math.abs(distance) < 2) return () => {};
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo(0, targetY);
    return () => {};
  }
  const duration = Math.min(1600, 700 + Math.abs(distance) * 0.45);
  const start = performance.now();
  let raf = requestAnimationFrame(function step(now) {
    const t = Math.min(1, (now - start) / duration);
    window.scrollTo(0, startY + distance * easeInOutCubic(t));
    if (t < 1) raf = requestAnimationFrame(step);
    else onDone?.();
  });
  return () => cancelAnimationFrame(raf);
}

export default function WorkPage({ controls, onOpenProject }) {
  const cancelScroll = useRef(() => {});
  const rootRef = useRef(null);
  const navRef = useRef(null);
  const [active, setActive] = useState("#top");

  // The fixed nav's backdrop and which nav link is current.
  useEffect(() => {
    const root = rootRef.current;
    const nav = navRef.current;
    const sections = ["#projects", "#experience", "#contact"].map((id) => [id, root.querySelector(id)]);
    let raf = 0;

    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const vh = window.innerHeight;
      nav.dataset.scrolled = String(y > 24);

      let current = "#top";
      for (const [id, el] of sections) if (el.getBoundingClientRect().top < vh * 0.45) current = id;
      if (window.innerHeight + y >= document.documentElement.scrollHeight - 4) current = "#contact";
      setActive(current);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  // Any manual wheel/touch/key input takes over from an in-progress glide.
  useEffect(() => {
    const stop = () => cancelScroll.current();
    const opts = { passive: true };
    window.addEventListener("wheel", stop, opts);
    window.addEventListener("touchstart", stop, opts);
    window.addEventListener("keydown", stop);
    return () => {
      stop();
      window.removeEventListener("wheel", stop, opts);
      window.removeEventListener("touchstart", stop, opts);
      window.removeEventListener("keydown", stop);
    };
  }, []);

  const handleAnchorClick = (e) => {
    const link = e.target.closest?.('a[href^="#"]');
    if (!link) return;
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    cancelScroll.current();
    const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
    let y = target.getBoundingClientRect().top + window.scrollY - margin;
    // Sections can name an element that must end up fully on screen (e.g. the project card).
    // Prefer the section heading sitting just below the top edge; if the element would still be
    // cut off at the bottom, scroll further until it fits (or pin its top when it's too tall).
    const fit = target.dataset.scrollFit && target.querySelector(target.dataset.scrollFit);
    if (fit) {
      const heading = target.querySelector("h2") ?? fit;
      const box = fit.getBoundingClientRect();
      const top = box.top + window.scrollY;
      const bottom = top + box.height;
      const gap = 32;
      const inset = navRef.current?.offsetHeight ?? 0;
      y = heading.getBoundingClientRect().top + window.scrollY - Math.max(48, inset + 16);
      if (box.height + gap * 2 > window.innerHeight - inset) y = top - inset - gap;
      else if (bottom + gap > y + window.innerHeight) y = bottom + gap - window.innerHeight;
    }
    y = Math.max(0, y);
    cancelScroll.current = smoothScrollTo(y);
  };


  return (
    <>
      <div
        id="top"
        ref={rootRef}
        onClick={handleAnchorClick}
        className="work-theme relative isolate min-h-dvh bg-background text-foreground"
      >
        {/* Stays pinned while scrolling; gains a soft dark backdrop once the page moves. */}
        <nav
          ref={navRef}
          data-scrolled="false"
          className="fixed inset-x-0 top-0 z-40 flex w-full items-center justify-between gap-6 px-6 pb-4 pt-[calc(22px+env(safe-area-inset-top))] transition-[background-color,backdrop-filter,box-shadow] duration-500 data-[scrolled=true]:bg-black/75 data-[scrolled=true]:shadow-[0_1px_0_rgba(255,255,255,0.06)] data-[scrolled=true]:backdrop-blur-md sm:px-10 lg:px-14"
        >
          <a href="#top" aria-label="Sagnik Das">
            {/* White strokes on a transparent background. */}
            <img
              src="/signature-ink.png"
              alt="Sagnik Das"
              className="h-14 w-14 object-contain sm:h-16 sm:w-16"
            />
          </a>
          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                aria-current={active === link.href ? "true" : undefined}
                className={`text-sm transition-colors hover:text-foreground ${
                  active === link.href ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
          {controls}
        </nav>

        {/* Landing: the name flies in letter by letter, then a short intro and the "View my work" button fade in below it */}
        <NameRibbon>
          <h1 className="sr-only">I design for the people who use software all day.</h1>
          <p
            className="max-w-3xl text-pretty text-[17px] leading-relaxed text-muted-foreground sm:text-xl"
            style={{ fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif" }}
          >
            I'm Sagnik — a frontend engineer moving into UX. For 4+ years I've worked where design
            meets code on B2B dashboards, support tools, procurement flows and HR portals, and what I
            care about most is turning complex, multi-role workflows into interfaces teams can move
            through without thinking.
          </p>
          <a
            href="#projects"
            className="mt-8 cursor-pointer rounded-full bg-white px-12 py-4 text-base font-medium text-black transition-transform hover:scale-[1.03] sm:px-14 sm:py-5"
          >
            View my work
          </a>
        </NameRibbon>

        {/* Projects */}
        <section id="projects" data-scroll-fit="[data-scroll-fit-target]" className="relative z-10 scroll-mt-6 px-6 py-24 sm:px-10 sm:py-32 lg:px-14">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <h2
                className="max-w-3xl text-4xl font-normal leading-[0.95] tracking-[-1.5px] sm:text-6xl"
                style={serif}
              >
                Selected work, <em className="not-italic text-muted-foreground">built around real problems.</em>
              </h2>
              <p className="max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">
                Each project starts with how people actually work — then removes whatever is in their way.
              </p>
            </div>

            <div data-scroll-fit-target className="mt-14 grid gap-6 sm:mt-20 md:grid-cols-2 lg:gap-8">
              {projects.map((project, i) => (
                <Reveal key={project.number} index={i}>
                  <ProjectTile project={project} onOpen={(rect) => onOpenProject(project, rect)} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Experience */}
        <section id="experience" className="relative z-10 scroll-mt-24 px-6 pb-24 pt-4 sm:px-10 sm:pb-32 lg:px-14">
          <div className="mx-auto max-w-7xl">
            <h2
              className="max-w-3xl text-4xl font-normal leading-[0.95] tracking-[-1.5px] sm:text-6xl"
              style={serif}
            >
              Experience
            </h2>
            <ol className="mt-12 border-t border-white/10 sm:mt-16">
              {experience.map((job) => (
                <li
                  key={job.role}
                  className="grid gap-4 border-b border-white/10 py-8 sm:py-10 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-10"
                >
                  <div className="text-sm text-muted-foreground sm:text-base">
                    <p>{job.dates}</p>
                    <p className="mt-1">{job.company}</p>
                  </div>
                  <div>
                    <h3 className="text-2xl leading-tight text-foreground sm:text-3xl" style={serif}>
                      {job.role}
                    </h3>
                    <ul className="mt-4 flex flex-col gap-2.5">
                      {job.points.map((point) => (
                        <li
                          key={point}
                          className="flex gap-3 text-sm leading-relaxed text-muted-foreground sm:text-base"
                        >
                          <span aria-hidden className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-white/50" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Skills: design first, engineering as the way I prototype and ship. */}
        <section id="skills" className="relative z-10 px-6 pb-8 pt-4 sm:px-10 sm:pb-16 lg:px-14">
          <div className="mx-auto max-w-7xl">
            <h2
              className="max-w-3xl text-4xl font-normal leading-[0.95] tracking-[-1.5px] sm:text-6xl"
              style={serif}
            >
              Design it. <em className="not-italic text-muted-foreground">Then build it.</em>
            </h2>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {skills.map((group) => (
                <div key={group.label} className="liquid-glass rounded-[2rem] p-6 sm:p-8">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-3xl text-foreground" style={serif}>
                      {group.label}
                    </h3>
                    <span className="text-right text-sm text-muted-foreground">{group.note}</span>
                  </div>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li key={item}>
                        <Tag>{item}</Tag>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section
          id="contact"
          className="relative z-10 flex flex-col overflow-hidden px-6 sm:px-10 lg:px-14"
        >
          <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center pb-24 pt-24 text-center sm:pt-32">
            <h2
              className="max-w-4xl text-4xl font-normal leading-[0.95] tracking-[-1.5px] sm:text-6xl"
              style={serif}
            >
              Looking for a designer <em className="not-italic text-muted-foreground">who can also ship?</em>
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Thanks for stopping by. I'm looking for full-time{" "}
              <span className="whitespace-nowrap">UX / Product Design</span> roles, so if you'd like to
              chat, say hi — I'd love to hear from you.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href={`mailto:${contact.email}`}
                className="liquid-glass flex items-center gap-2 rounded-full px-8 py-4 text-sm text-foreground transition-transform hover:scale-[1.03] sm:text-base"
              >
                <EmailIcon />
                {contact.email}
              </a>
              <a
                href={`tel:${contact.phone}`}
                className="liquid-glass flex items-center gap-2 rounded-full px-8 py-4 text-sm text-foreground transition-transform hover:scale-[1.03] sm:text-base"
              >
                <PhoneIcon />
                {contact.phone}
              </a>
            </div>
            <p className="mt-10 text-xs text-muted-foreground">© 2026 Sagnik Das</p>
          </div>
        </section>
      </div>
    </>
  );
}
