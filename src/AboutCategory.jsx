import { useCallback, useMemo, useState } from "react";
import { Bloom } from "./Btn.jsx";
import { hobbies } from "./data.js";
import Viewer from "./Viewer.jsx";
import useReveal from "./useReveal.js";

// How the polaroids in the grid are scattered: a slight tilt and a little drop each, repeating.
const SCATTER = [
  [-4, 8, -6],
  [3, -10, 8],
  [-5, 6, 4],
  [4, -6, -8],
  [-3, 10, 6],
  [5, -8, -4],
];

function Polaroid({ photo, index, onOpen }) {
  const ref = useReveal(0.05);
  const [rotate, drop, shift] = SCATTER[index % SCATTER.length];
  return (
    <li ref={ref} className="reveal">
      <button
        className="polaroid"
        onClick={() => onOpen(index)}
        aria-label={`Open ${photo.label} photo ${index + 1}`}
        style={{
          "--rotate": `${rotate}deg`,
          "--drop": `${drop}px`,
          "--shift": `${shift}px`,
          "--float-delay": `${(index % 6) * -0.7}s`,
        }}
      >
        <img src={photo.thumb} alt="" loading="lazy" decoding="async" />
      </button>
    </li>
  );
}

// The page for one category: every photo of it as a floating polaroid, a switcher to change
// category, and the full-size viewer when a photo is clicked.
export default function AboutCategory({ slug }) {
  const hobby = hobbies.find((h) => h.slug === slug) ?? hobbies[0];
  const photos = useMemo(() => hobby.photos.map((p) => ({ ...p, label: hobby.label })), [hobby]);
  const [open, setOpen] = useState(null);
  const close = useCallback(() => setOpen(null), []);
  const move = useCallback((step) => setOpen((i) => (i === null ? i : (i + step + photos.length) % photos.length)), [photos.length]);

  return (
    <main className="cs catpage">
      <nav className="cs-nav" aria-label="Gallery">
        <a className="cs-back" href="#about">
          <span aria-hidden>←</span> Back to about me
        </a>
        <span className="cs-count">{photos.length} photos</span>
      </nav>

      <header className="cs-head">
        <p className="eyebrow">After hours</p>
        <h1 className="cs-title">{hobby.label}</h1>
        <p className="cs-sub">{hobby.note}</p>
      </header>

      <div className="about-filters" role="group" aria-label="Change category">
        {hobbies.map((h, i) => (
          <a
            key={h.slug}
            className={`chip bloomy ${i % 2 ? "chip-lily" : "chip-rose"}${h.slug === hobby.slug ? " is-on" : ""}`}
            href={`#/about/${h.slug}`}
            aria-current={h.slug === hobby.slug ? "page" : undefined}
          >
            <Bloom />
            <span className="btn-label">{h.label}</span>
          </a>
        ))}
      </div>

      <ul className="polaroids">
        {photos.map((photo, i) => (
          <Polaroid key={photo.src} photo={photo} index={i} onOpen={setOpen} />
        ))}
      </ul>

      {open !== null && <Viewer photos={photos} index={open} onClose={close} onMove={move} />}
    </main>
  );
}
