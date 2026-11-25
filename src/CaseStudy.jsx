import { useEffect, useRef, useState } from "react";
import Btn from "./Btn.jsx";
import Corner from "./Corner.jsx";
import { projects } from "./data.js";
import { caseStudies } from "./caseStudies/index.js";
import useReveal from "./useReveal.js";

// **bold** in the author's text.
function Rich({ text }) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : <span key={i}>{part}</span>,
  );
}

function Bubble({ block }) {
  const ref = useReveal(0.1);
  if (block.type === "image") {
    return (
      <figure ref={ref} className="cs-figure reveal">
        <img src={block.src} alt={block.alt} loading="lazy" />
        {block.caption && <figcaption>{block.caption}</figcaption>}
      </figure>
    );
  }
  if (block.type === "q") {
    return (
      <p ref={ref} className="cs-bubble cs-q reveal">
        <Rich text={block.text} />
      </p>
    );
  }
  if (block.type === "a") {
    return (
      <p ref={ref} className="cs-bubble cs-a reveal">
        <Rich text={block.text} />
      </p>
    );
  }
  return null;
}

function Cover({ project }) {
  const ref = useRef(null);
  useEffect(() => {
    const video = ref.current;
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    video.play().catch(() => {});
  }, []);
  return (
    <figure className="cs-cover" style={{ "--cover-ratio": project.videoRatio }}>
      <video
        ref={ref}
        src={project.video}
        poster={project.image}
        aria-label={project.imageAlt}
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        controlsList="nodownload noplaybackrate nofullscreen"
      />
    </figure>
  );
}

const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// The section names in the top bar: jump links that scroll to each section, with the one you are
// reading highlighted. They scroll with scrollIntoView rather than #links, because the page address
// (#/case-study/...) is what tells the site which page to show.
function SectionBar({ project, ids }) {
  const [active, setActive] = useState(ids[0].id);
  const stripRef = useRef(null);

  useEffect(() => {
    // A section is "current" while it crosses a line a little below the bar.
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    ids.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [ids]);

  // Keep the highlighted name in view when the strip scrolls sideways (phones, long lists).
  useEffect(() => {
    const strip = stripRef.current;
    const tab = strip?.querySelector(".is-active");
    if (!strip || !tab) return;
    strip.scrollTo({ left: tab.offsetLeft - strip.clientWidth / 2 + tab.clientWidth / 2, behavior: "smooth" });
  }, [active]);

  const jump = (e, id) => {
    e.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <>
    <a className="cs-back-icon" href="#work" aria-label="Back to work" title="Back to work">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M19 12H5" />
        <path d="M11 6l-6 6 6 6" />
      </svg>
    </a>
    <nav className="cs-nav" aria-label="Case study">
      <ul ref={stripRef} className="cs-sections">
        {ids.map(({ id, label }) => (
          <li key={id}>
            <a className={`cs-tab${active === id ? " is-active" : ""}`} href={`#${id}`} aria-current={active === id ? "true" : undefined} onClick={(e) => jump(e, id)}>
              {label}
            </a>
          </li>
        ))}
      </ul>
      <span className="cs-count">
        {project.number} / {String(projects.length).padStart(2, "0")}
      </span>
    </nav>
    </>
  );
}

// One case study as a page: the walkthrough video as the cover, the overview, then the story as
// a conversation (a question on the left, the answer on the right), with images after the answer
// they illustrate.
export default function CaseStudy({ slug }) {
  const project = projects.find((p) => p.slug === slug);
  const study = caseStudies[slug];
  const headRef = useReveal(0.05);

  if (!project || !study) {
    return (
      <main className="cs">
        <a className="cs-back" href="#work">
          ← Back to work
        </a>
        <p>That case study doesn't exist.</p>
      </main>
    );
  }

  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];
  const ids = [{ id: "cs-overview", label: "Overview" }, ...study.sections.map((sec) => ({ id: `cs-${slugify(sec.heading)}`, label: sec.heading }))];

  return (
    <main className="cs">
      <SectionBar project={project} ids={ids} />

      <header ref={headRef} className="cs-head reveal">
        <Corner kind="lilies" at="tr" />
        <ul className="board-tags" aria-label="Tags">
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        <h1 className="cs-title">{study.title}</h1>
        <p className="cs-sub">
          {study.created ? `${study.created} · ` : ""}
          {study.duration}
        </p>
      </header>

      <Cover project={project} />

      <div className="cs-intro" id="cs-overview">
        <div>
          <p className="eyebrow">The story behind the work</p>
          <p className="cs-story">{study.story}</p>
        </div>
        <aside className="cs-overview" aria-label="1-minute overview">
          <p className="eyebrow">1-minute overview</p>
          <dl>
            {study.overview.map((row) => (
              <div key={row.label}>
                <dt>{row.label}</dt>
                <dd>
                  {row.href ? (
                    <a href={row.href} target="_blank" rel="noreferrer">
                      {row.text}
                    </a>
                  ) : (
                    row.text
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>

      {study.sections.map((section) => (
        <section key={section.heading} id={`cs-${slugify(section.heading)}`} className="cs-section">
          <h2 className="cs-heading">{section.heading}</h2>
          <div className="cs-thread">
            {section.blocks.map((block, i) => (
              <Bubble key={i} block={block} />
            ))}
          </div>
        </section>
      ))}

      <Corner kind="roses" at="bl" />
      <footer className="cs-foot">
        <Btn variant="line" href="#work">
          Back to work
        </Btn>
        <Btn variant="solid" href={`#/case-study/${next.slug}`}>
          Next: {next.title.length > 40 ? `${next.title.slice(0, 40).trim()}…` : next.title} →
        </Btn>
      </footer>
    </main>
  );
}
