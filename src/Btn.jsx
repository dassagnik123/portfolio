import { useEffect, useRef, useState } from "react";
import { useCursorChoice } from "./cursorChoice.js";

// A pill button that turns into flowers on hover. The pill disappears and a cluster of whole
// flowers blooms in its place with the label on top: roses behind the primary (solid) buttons,
// lilies behind the secondary (outline) ones. Used as <Btn variant="solid"> / <Btn variant="line">
// in place of <a>, and takes the same props (href, target, ...). The cursor is hidden over it
// (see styles.css).
//
// Each flower: [image, x % across the button, y % down it, size as a multiple of the button's
// height, rotation deg, mirrored].
export const SETS = {
  solid: [
    ["rose-open", 7, 50, 2.3, -12, false],
    ["rose-bud", 28, 36, 1.8, 20, true],
    ["rose-open", 50, 60, 2.4, 8, true],
    ["rose-bud", 72, 38, 1.9, -25, false],
    ["rose-open", 93, 52, 2.3, 15, false],
  ],
  line: [
    ["lily-open", 7, 52, 2.4, 10, false],
    ["lily-b", 28, 38, 2.0, -18, true],
    ["lily-a", 50, 60, 2.4, 14, false],
    ["lily-c", 72, 38, 2.0, 22, true],
    ["lily-open", 93, 50, 2.4, -10, true],
  ],
};

// The cluster of flowers itself, used behind buttons, chips and tags. It follows the cursor switch:
// roses when the rose cursor is chosen, lilies when the lily cursor is chosen, on every page. (The
// variant only sets the label colour in the CSS.)
export function Bloom() {
  const flowers = useCursorChoice() === "lily" ? "line" : "solid";
  const ref = useRef(null);
  const [count, setCount] = useState(SETS.solid.length);

  // A long button (such as "Next: ..." on a case study) needs more flowers than a short one to be
  // filled edge to edge: about one flower for every 0.8 button heights of width, never fewer than
  // the usual five.
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const fit = () => {
      const { width, height } = el.getBoundingClientRect();
      if (height > 0) setCount(Math.max(SETS.solid.length, Math.ceil(width / (height * 0.8)) + 1));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const set = SETS[flowers];
  const items =
    count === set.length
      ? set
      : Array.from({ length: count }, (_, i) => {
          const [src, , y, size, rot, flip] = set[i % set.length];
          // Spread evenly over the width; the pattern repeats with a little shift so it is not regular.
          return [src, (i / (count - 1)) * 100, y, size, i % 2 ? -rot : rot, i % 3 === 0 ? !flip : flip];
        });

  return (
    <span ref={ref} className="btn-bloom" aria-hidden>
      {items.map(([src, x, y, size, rot, flip], i) => (
        <img
          key={i}
          src={`/flowers/${src}.webp`}
          alt=""
          draggable={false}
          style={{
            left: `${x}%`,
            top: `${y}%`,
            "--size": size,
            "--rot": `${rot}deg`,
            "--flip": flip ? -1 : 1,
            transitionDelay: `${Math.min(i, 12) * 45}ms`,
          }}
        />
      ))}
    </span>
  );
}

export default function Btn({ variant = "solid", children, ...props }) {
  return (
    <a className={`btn btn-${variant}`} {...props}>
      <Bloom />
      <span className="btn-label">{children}</span>
    </a>
  );
}
