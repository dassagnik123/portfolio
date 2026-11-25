// Two big flowers hanging off a corner of whatever section it sits in (the parent must be
// position: relative). `kind` picks the flowers (roses, or lilies) and `at` picks the corner:
// "tl", "tr", "bl", "br", "mr" for the middle of the right side, or "hr" for the right end of a
// section heading's line (level with the title). They float gently and swell a
// little when hovered (see styles.css). Decorative only.
const KINDS = {
  roses: [
    ["rose-open", "big", 0, false],
    ["rose-bud", "small", -14, true],
  ],
  lilies: [
    ["lily-open", "big", 6, false],
    ["lily-a", "small", 14, true],
  ],
};

export default function Corner({ kind, at }) {
  return (
    <span className={`corner kind-${kind} at-${at}`} aria-hidden>
      {KINDS[kind].map(([src, size, rot, flip]) => (
        <img
          key={src}
          className={`corner-${size}`}
          src={`/flowers/${src}.webp`}
          alt=""
          draggable={false}
          loading="lazy"
          style={{ transform: `rotate(${rot}deg)${flip ? " scaleX(-1)" : ""}` }}
        />
      ))}
    </span>
  );
}
