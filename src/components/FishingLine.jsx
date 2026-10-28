import { useEffect, useRef, useState } from "react";
import { FISH } from "./fishArt";
import PixelArt from "./PixelArt";

// His fishing line, in screen px: from the rod tip (`from`) to its end (`to`), with a bobber on
// the water (bobber: "fly" while it's cast, "float", or "bite" when a fish takes it) or a fish
// hanging off it (`fish`: its colours). When `to` moves, the end swings over in a short arc.
const BOBBER = [
  ".RR.",
  "RRRR",
  "WWWW",
  ".WW.",
];
const BOBBER_PALETTE = { R: "#d9342b", W: "#f6f0dc" };
const SWING_MS = 380;

export default function FishingLine({ from, to, bobber, fish }) {
  const [end, setEnd] = useState(to);
  const shown = useRef(to);
  useEffect(() => {
    const start = shown.current;
    if (start.x === to.x && start.y === to.y) return;
    const t0 = performance.now();
    let raf = 0;
    const step = (now) => {
      const t = Math.min(1, (now - t0) / SWING_MS);
      const p = {
        x: start.x + (to.x - start.x) * t,
        y: start.y + (to.y - start.y) * t - Math.sin(Math.PI * t) * 40,
      };
      shown.current = p;
      setEnd(p);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to]);

  // a little slack in the line, sagging between the tip and the end
  const sag = { x: (from.x + end.x) / 2, y: Math.max(from.y, end.y) + (fish ? 0 : 18) };
  return (
    <div aria-hidden className="fishing pointer-events-none fixed inset-0 z-[6]">
      <svg className="absolute inset-0 h-full w-full overflow-visible">
        <path
          d={`M ${from.x} ${from.y} Q ${sag.x} ${sag.y} ${end.x} ${end.y}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
      {fish ? (
        <span className="hooked-fish absolute" style={{ left: end.x - 8, top: end.y - 2 }}>
          <PixelArt art={FISH} palette={fish} pixel={3} />
        </span>
      ) : (
        <span className={`bobber absolute ${bobber === "bite" ? "is-bite" : ""}`} style={{ left: end.x - 4, top: end.y - 5 }}>
          <PixelArt art={BOBBER} palette={BOBBER_PALETTE} pixel={2} />
        </span>
      )}
    </div>
  );
}
