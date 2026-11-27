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
  // The questions are not shown: the slide is the heading and the author's text.
  if (block.type === "a") {
    return (
      <p ref={ref} className="cs-text reveal">
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

const Chevron = ({ d }) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);

// The top bar: the slide names (click one to jump to it) and where you are in the deck.
function SlideBar({ project, labels, slide, onGo }) {
  const stripRef = useRef(null);

  // Keep the highlighted name in view when the strip scrolls sideways (phones, long lists).
  useEffect(() => {
    const strip = stripRef.current;
    const tab = strip?.querySelector(".is-active");
    if (!strip || !tab) return;
    strip.scrollTo({ left: tab.offsetLeft - strip.clientWidth / 2 + tab.clientWidth / 2, behavior: "smooth" });
  }, [slide]);

  return (
    <>
      <a className="cs-back-icon" href="#work" aria-label="Back to work" title="Back to work">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M19 12H5" />
          <path d="M11 6l-6 6 6 6" />
        </svg>
      </a>
      <nav className="cs-nav" aria-label="Slides">
        <ul ref={stripRef} className="cs-sections">
          {labels.map((label, i) => (
            <li key={label}>
              <button type="button" className={`cs-tab${slide === i ? " is-active" : ""}`} aria-current={slide === i ? "true" : undefined} onClick={() => onGo(i)}>
                {label}
              </button>
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

// The first slide: title, the story and the walkthrough on one side, the 1-minute overview on the other.
function CoverSlide({ project, study }) {
  return (
    <div className="cs-cover-slide">
      <header className="cs-head">
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
        <p className="cs-story">{study.story}</p>
      </header>
      <div className="cs-cover-side">
        <Cover project={project} />
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
    </div>
  );
}

// A section slide: its heading, then the conversation. When the section has images they sit in a
// column of their own beside the text.
function SectionSlide({ section }) {
  const images = section.blocks.filter((b) => b.type === "image");
  const talk = section.blocks.filter((b) => b.type !== "image");
  return (
    <section className={`cs-section${images.length ? " has-images" : ""}`}>
      <h2 className="cs-heading">{section.heading}</h2>
      <div className="cs-thread">
        {talk.map((block, i) => (
          <Bubble key={i} block={block} />
        ))}
      </div>
      {images.length > 0 && (
        <div className="cs-shots">
          {images.map((block, i) => (
            <Bubble key={i} block={block} />
          ))}
        </div>
      )}
    </section>
  );
}

// One case study as a slide deck: a cover slide, then one slide per section. Move with the buttons,
// the section names, the arrow keys or a swipe.
export default function CaseStudy({ slug }) {
  const project = projects.find((p) => p.slug === slug);
  const study = caseStudies[slug];
  const [slide, setSlide] = useState(0);
  const [dir, setDir] = useState(1);
  const touch = useRef(null);
  const stageRef = useRef(null);

  const total = study ? study.sections.length + 1 : 0;

  const go = (to) => {
    setSlide((from) => {
      const next = Math.min(Math.max(to, 0), total - 1);
      if (next !== from) setDir(next > from ? 1 : -1);
      return next;
    });
  };

  // A different case study starts on its first slide.
  useEffect(() => {
    setSlide(0);
  }, [slug]);

  // Every slide opens at its top.
  useEffect(() => {
    stageRef.current?.scrollTo(0, 0);
  }, [slide]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "ArrowRight") go(slide + 1);
      else if (e.key === "ArrowLeft") go(slide - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Scrolling down past the end of a slide moves on to the next one; scrolling up past its top goes
  // back. One move per scroll gesture: the wheel is ignored for a moment after each move.
  const wheelLock = useRef(0);
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) < 8 || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      const now = Date.now();
      if (now < wheelLock.current) return;
      const atEnd = stage.scrollTop + stage.clientHeight >= stage.scrollHeight - 2;
      const atTop = stage.scrollTop <= 0;
      if (e.deltaY > 0 && atEnd && slide < total - 1) go(slide + 1);
      else if (e.deltaY < 0 && atTop && slide > 0) go(slide - 1);
      else return;
      wheelLock.current = now + 900;
    };
    stage.addEventListener("wheel", onWheel, { passive: true });
    return () => stage.removeEventListener("wheel", onWheel);
  });

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

  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  const labels = ["Overview", ...study.sections.map((sec) => sec.heading)];
  const last = slide === total - 1;

  const onTouchEnd = (e) => {
    const start = touch.current;
    touch.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    go(dx < 0 ? slide + 1 : slide - 1);
  };

  return (
    <main className="cs">
      <SlideBar project={project} labels={labels} slide={slide} onGo={go} />

      <div
        ref={stageRef}
        key={slide}
        className={`cs-stage ${dir >= 0 ? "from-right" : "from-left"}`}
        onTouchStart={(e) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })}
        onTouchEnd={onTouchEnd}
      >
        {slide === 0 ? <CoverSlide project={project} study={study} /> : <SectionSlide section={study.sections[slide - 1]} />}
        {last && (
          <footer className="cs-foot">
            <Btn variant="line" href="#work">
              Back to work
            </Btn>
            <Btn variant="solid" href={`#/case-study/${next.slug}`}>
              Next: {next.title.length > 40 ? `${next.title.slice(0, 40).trim()}…` : next.title} →
            </Btn>
          </footer>
        )}
      </div>

      <div className="cs-controls">
        <div className="cs-steps">
          <button type="button" className="cs-step" onClick={() => go(slide - 1)} disabled={slide === 0} aria-label="Previous slide">
            <Chevron d="M15 6l-6 6 6 6" />
          </button>
          <span className="cs-dots" aria-hidden>
            {labels.map((label, i) => (
              <i key={label} className={i === slide ? "is-active" : ""} />
            ))}
          </span>
          <button type="button" className="cs-step" onClick={() => go(slide + 1)} disabled={last} aria-label="Next slide">
            <Chevron d="M9 6l6 6-6 6" />
          </button>
        </div>
        <p className="cs-hint">
          <span className="cs-hint-keys">Use ← → keys to navigate</span>
          <span className="cs-hint-swipe">Swipe left or right to navigate</span>
        </p>
      </div>
    </main>
  );
}
