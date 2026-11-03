import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

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
  // getBoundingClientRect keeps sub-pixel precision; the +1 guards against the
  // container's overflow:hidden clipping the final glyph after rounding.
  const measure = useCallback(() => {
    const el = trackRef.current?.children[index];
    if (el) setWidth(Math.ceil(el.getBoundingClientRect().width) + 1);
  }, [index]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  // Re-measure once the web font has actually loaded (first paint often uses
  // fallback metrics) and whenever the viewport resizes the type scale.
  useEffect(() => {
    document.fonts?.ready.then(measure).catch(() => {});
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  return (
    <span
      className="rotating-text"
      style={{ width }}
      aria-label={items[index % items.length]}
    >
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
