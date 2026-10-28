import { useLayoutEffect, useRef, useState } from "react";
import { about, contact, experience, projects, skills } from "../content";
import { sfx, unlockAudio } from "../sound";
import Arrow from "./Arrow";
import Hobbies from "./Hobbies";
import PixelArt from "./PixelArt";

// An RPG-style dialog box with the portfolio content for the stop he's standing at.
// `side` is which half of the screen it opens on, away from him.

function Start() {
  return (
    <>
      <h2 className="panel-title">HELLO! I'M</h2>
      <p className="panel-name">Sagnik Das</p>
      <p className="panel-lead">{about.headline}</p>
      <p>{about.body}</p>
      <p className="panel-hint">▼ Scroll, or click a flag, to walk the path.</p>
    </>
  );
}

// A tiny padlock for case studies that aren't written yet.
const LOCK = ["..KKK..", ".K...K.", ".K...K.", "KKKKKKK", "KYYKYYK", "KYYYYYK", "KKKKKKK"];
const LOCK_PALETTE = { K: "currentColor", Y: "#f6c445" }; // outline follows the theme's ink

// Level select: one cartridge per case study along the top, the chosen one's details below.
function Work({ onOpenCase }) {
  const [pick, setPick] = useState(0);
  const project = projects[pick];
  const choose = (i) => {
    unlockAudio();
    sfx.select();
    setPick((i + projects.length) % projects.length);
  };

  const several = projects.length > 1;

  return (
    <>
      <h2 className="panel-title">WORK</h2>
      {several && <p className="panel-hint">Select a project ▼</p>}

      <div className="levels" role="tablist" aria-label="Case studies" hidden={!several}>
        {projects.map((p, i) => (
          <button
            key={p.number}
            type="button"
            role="tab"
            aria-selected={i === pick}
            aria-controls="level-detail"
            onClick={() => choose(i)}
            className="level"
          >
            <span className="level-thumb">
              {p.ready ? <img src={p.cover} alt="" /> : <PixelArt art={LOCK} palette={LOCK_PALETTE} pixel={3} />}
            </span>
            <span className="level-number">{p.number}</span>
          </button>
        ))}
      </div>

      <div id="level-detail" role={several ? "tabpanel" : undefined} className="level-detail">
        <ul className="panel-tags">
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        <p className="panel-lead">{project.title}</p>
        {project.ready ? (
          <>
            <img src={project.cover} alt={project.coverAlt} className="panel-cover" />
            {project.caseStudy && (
              <button
                type="button"
                className="panel-cta"
                onClick={() => {
                  unlockAudio();
                  sfx.select();
                  onOpenCase(project);
                }}
              >
                <Arrow />
                <span>READ CASE STUDY</span>
              </button>
            )}
            <p className="panel-more">{project.description}</p>
            <dl className="panel-facts panel-more">
              {project.facts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.text}</dd>
                </div>
              ))}
            </dl>
          </>
        ) : (
          <p className="level-locked">
            <PixelArt art={LOCK} palette={LOCK_PALETTE} pixel={3} />
            <span>Case study in progress — check back soon.</span>
          </p>
        )}
      </div>

      <div className="level-nav" hidden={!several}>
        <button type="button" onClick={() => choose(pick - 1)} aria-label="Previous case study">
          ◀
        </button>
        <span>
          {project.number} / {projects[projects.length - 1].number}
        </span>
        <button type="button" onClick={() => choose(pick + 1)} aria-label="Next case study">
          ▶
        </button>
      </div>
    </>
  );
}

function Experience() {
  return (
    <>
      <h2 className="panel-title">EXPERIENCE</h2>
      <ol className="panel-roles">
        {experience.map((r) => (
          <li key={r.role}>
            <div className="role-head">
              <h3>{r.role}</h3>
              <span>Keross R&amp;D · {r.dates}</span>
            </div>
            <ul>
              {r.points.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </>
  );
}

function Skills() {
  return (
    <>
      <h2 className="panel-title">SKILLS</h2>
      <div className="panel-skills">
        {skills.map((group) => (
          <section key={group.label}>
            <h3>{group.label}</h3>
            <p className="panel-hint">{group.note}</p>
            <ul className="panel-tags">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}

// A small COPY button that puts `value` on the clipboard and says COPIED! for a moment.
function CopyButton({ value, label }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    unlockAudio();
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Older browsers / insecure origins: fall back to a hidden textarea.
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    sfx.select();
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return (
    <button type="button" className="copy-btn" onClick={copy} aria-label={`Copy ${label}`}>
      {copied ? "COPIED!" : "COPY"}
      <span className="sr-only" aria-live="polite">
        {copied ? `${label} copied` : ""}
      </span>
    </button>
  );
}

function Contact() {
  return (
    <>
      <h2 className="panel-title">CONTACT</h2>
      <p className="panel-lead">Thanks for stopping by!</p>
      <p>Hope you enjoyed the walk. I'm looking for full-time UX / Product Design roles, so if you'd like to chat, say hi — I'd love to hear from you.</p>
      <ul className="panel-links">
        <li className="with-copy">
          <a href={`mailto:${contact.email}`}>▶&nbsp;{contact.email}</a>
          <CopyButton value={contact.email} label="email address" />
        </li>
        <li className="with-copy">
          <a href={`tel:${contact.phone}`}>▶&nbsp;{contact.phone}</a>
          <CopyButton value={contact.phone} label="phone number" />
        </li>
        <li>
          <a href={contact.linkedin} target="_blank" rel="noreferrer">
            ▶ LinkedIn
          </a>
        </li>
        <li>
          <a href={contact.resume} target="_blank" rel="noreferrer">
            ▶ Résumé
          </a>
        </li>
      </ul>
    </>
  );
}

const PANELS = { START: Start, WORK: Work, EXPERIENCE: Experience, SKILLS: Skills, HOBBIES: Hobbies, CONTACT: Contact };

export default function StopPanel({ label, side, onOpenCase }) {
  // Its height goes in --panel-h, so on phones (where it runs across the bottom) the fireworks
  // can stand just above it.
  const box = useRef(null);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const root = document.documentElement.style;
    const ro = new ResizeObserver(() => root.setProperty("--panel-h", `${el.offsetHeight}px`));
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.removeProperty("--panel-h");
    };
  }, []);
  const Content = PANELS[label];
  if (!Content) return null;
  return (
    <section ref={box} aria-live="polite" className={`stop-panel stop-panel-${side}`}>
      <Content onOpenCase={onOpenCase} />
    </section>
  );
}
