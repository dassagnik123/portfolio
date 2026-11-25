import { useEffect, useRef } from "react";
import Btn from "./Btn.jsx";
import Corner from "./Corner.jsx";
import { projects } from "./data.js";
import useReveal from "./useReveal.js";

// The walkthrough video as the project's cover: muted, looping, no controls, with the screenshot
// as its poster. It only plays while on screen, and not at all with reduced motion.
function ProjectCover({ project }) {
  const ref = useRef(null);
  useEffect(() => {
    const video = ref.current;
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <figure className="board-image" style={{ "--cover-ratio": project.videoRatio }}>
      <video
        ref={ref}
        src={project.video}
        poster={project.image}
        aria-label={project.imageAlt}
        muted
        loop
        playsInline
        preload="metadata"
        disablePictureInPicture
        controlsList="nodownload noplaybackrate nofullscreen"
      />
    </figure>
  );
}

// A project as an art board (design.md §35): text and the case study button on the left, the
// walkthrough video on the right, flowers on two corners.
function ProjectBoard({ project }) {
  const ref = useReveal();
  return (
    <article ref={ref} className="board reveal">
      <ProjectCover project={project} />
      <div className="board-text">
        <p className="board-number">{project.number}</p>
        <h3 className="board-title">{project.title}</h3>
        <p className="board-description">{project.description}</p>
        <ul className="board-tags" aria-label="Tags">
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        <dl className="board-meta">
          {project.meta.map((row) => (
            <div key={row.label}>
              <dt>{row.label}</dt>
              <dd>{row.text}</dd>
            </div>
          ))}
        </dl>
        <div className="board-actions">
          <Btn variant="solid" href={`#/case-study/${project.slug}`}>
            View Case Study
          </Btn>
          {project.link && (
            <a className="board-link" href={project.link.href} target="_blank" rel="noreferrer">
              {project.link.label} <span aria-hidden>↗</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  const headingRef = useReveal();
  return (
    <section className="projects" id="work" aria-labelledby="work-heading">
      <header ref={headingRef} className="section-head reveal">
        <p className="eyebrow">Selected work</p>
        <h2 id="work-heading" className="section-title">
          Case studies
        </h2>
        <span className="brush-rule" aria-hidden />
      </header>
      <Corner kind="lilies" at="hr" />
      <div className="boards">
        {projects.map((project) => (
          <ProjectBoard key={project.number} project={project} />
        ))}
      </div>
      <Corner kind="roses" at="bl" />
    </section>
  );
}
