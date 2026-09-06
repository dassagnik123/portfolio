import { useEffect, useLayoutEffect, useRef, useState } from "react";

// Vertical "scroll up" word rotator. Cycles through `items`, always moving
// upward — an appended clone of the first word makes the wrap seamless.
export default function RotatingText({ items, interval = 2400 }) {
  const loop = [...items, items[0]];
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(true);
  const [width, setWidth] = useState();

  useEffect(() => {
    const reduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return undefined;
    const id = setInterval(() => setIndex((i) => i + 1), interval);
    return () => clearInterval(id);
  }, [interval]);

  // Once we've scrolled onto the trailing clone, snap back to the real first
  // word with the transition disabled so the reset is invisible.
  useEffect(() => {
    if (index !== items.length) return undefined;
    const t = setTimeout(() => {
      setAnimating(false);
      setIndex(0);
    }, 520);
    return () => clearTimeout(t);
  }, [index, items.length]);

  useEffect(() => {
    if (animating) return undefined;
    const r = requestAnimationFrame(() => setAnimating(true));
    return () => cancelAnimationFrame(r);
  }, [animating]);

  // Match the container width to the visible word so the sentence reflows.
  useLayoutEffect(() => {
    const el = trackRef.current?.children[index];
    if (el) setWidth(el.offsetWidth);
  }, [index]);

  return (
    <span className="rotating-text" style={{ width }} aria-label={items[index % items.length]}>
      <span
        ref={trackRef}
        className="rotating-text__track"
        aria-hidden="true"
        style={{
          "--rt-index": index,
          transitionDuration: animating ? undefined : "0s",
        }}
      >
        {loop.map((word, i) => (
          <span key={i} className="rotating-text__item">
            {word}
          </span>
        ))}
      </span>
    </span>
  );
}
