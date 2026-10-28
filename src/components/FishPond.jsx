import { useEffect, useMemo, useRef } from "react";
import { FISH, FISH_COLOURS } from "./fishArt";
import PixelArt from "./PixelArt";

// A pond on the left of the path, down the EXPERIENCE–SKILLS stretch, with fish leaping out of it.
// Click the pond and the boy walks to the bank and fishes one out with his rod (App runs that);
// another fish takes its place later. Everything here is in path (world) coordinates.

const POND_W = 54; // art px
const POND_H = 19;
// The pond: a stone rim (E) round the water (W), with a couple of ripple lines (w).
const POND = Array.from({ length: POND_H }, (_, y) =>
  Array.from({ length: POND_W }, (_, x) => {
    const dx = (x + 0.5 - POND_W / 2) / (POND_W / 2);
    const dy = (y + 0.5 - POND_H / 2) / (POND_H / 2);
    const r = dx * dx + dy * dy;
    if (r > 1) return ".";
    if (r > 0.72) return "E";
    const ripple = (row, from, to) => y === Math.round(POND_H * row) && x > POND_W * from && x < POND_W * to;
    if (ripple(0.32, 0.24, 0.42) || ripple(0.6, 0.55, 0.76)) return "w";
    return "W";
  }).join(""),
);
const POND_DAY = { E: "#9a9aa8", W: "#5fa8d3", w: "#a8daf2" };
const POND_NIGHT = { E: "#4b516f", W: "#22365a", w: "#3b5784" };

const JUMP_MS = 900;
const RESPAWN_MS = 4000;

export default function FishPond({ path, night, onCatch, apiRef, canCatch }) {
  // The pond sits well down the EXPERIENCE–SKILLS stretch, its right edge clear of the path; on
  // narrow screens it's drawn smaller, to fit between the path and the screen's edge.
  const pond = useMemo(() => {
    const work = path.stops.find((s) => s.label === "EXPERIENCE");
    const skills = path.stops.find((s) => s.label === "SKILLS");
    if (!work || !skills) return null;
    const p = path.pointAt(work.len + (skills.len - work.len) * 0.72);
    const right = p.x - (path.width < 600 ? 76 : 124);
    const px = Math.max(2, Math.min(4, Math.floor((right - 4) / POND_W)));
    const w = POND_W * px;
    const h = POND_H * px;
    return { px, left: right - w, top: p.y - h / 2, w, h, waterY: p.y - 2 * px };
  }, [path]);

  const pondEl = useRef(null);
  const els = useRef([]);
  const ripples = useRef([]);
  const fish = useRef([]);

  // Each fish waits a while under water, then leaps across part of the pond. States: under
  // (between leaps), jumping, caught (on his line, then gone until it respawns).
  useEffect(() => {
    if (!pond) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const plan = (i, now) => {
      const from = pond.left + 24 + Math.random() * (pond.w - 88);
      return { i, state: "under", next: now + 800 + i * 1300 + Math.random() * 1800, from, dir: Math.random() < 0.5 ? -1 : 1 };
    };
    const t0 = performance.now();
    fish.current = FISH_COLOURS.map((_, i) => plan(i, t0));
    let raf = 0;

    const frame = (now) => {
      fish.current.forEach((f, i) => {
        const el = els.current[i];
        const ripple = ripples.current[i];
        if (!el) return;
        let x = f.from;
        let y = pond.waterY;
        let turn = 0;
        let shown = false;
        let splashAt = null;
        if (f.state === "under") {
          if (!still && now >= f.next) Object.assign(f, { state: "jumping", start: now });
        } else if (f.state === "jumping") {
          const t = (now - f.start) / JUMP_MS;
          if (t >= 1) {
            fish.current[i] = plan(i, now);
            splashAt = f.from + f.dir * 44;
          } else {
            x = f.from + f.dir * 44 * t;
            y = pond.waterY - 46 * Math.sin(Math.PI * t);
            turn = f.dir * (-50 + 100 * t);
            shown = true;
            if (t < 0.15) splashAt = f.from;
            if (t > 0.85) splashAt = f.from + f.dir * 44;
          }
        } else if (now - f.caughtAt > RESPAWN_MS) {
          fish.current[i] = plan(i, now);
        }
        f.x = x;
        f.y = y;
        el.style.transform = `translate(${Math.round(x - 14)}px, ${Math.round(y - 8)}px) rotate(${Math.round(turn)}deg) scaleX(${f.dir > 0 ? -1 : 1})`;
        el.style.opacity = shown ? 1 : 0;
        if (ripple) {
          ripple.style.opacity = splashAt === null ? 0 : 1;
          if (splashAt !== null) ripple.style.transform = `translate(${Math.round(splashAt - 12)}px, ${Math.round(pond.waterY - 2)}px)`;
        }
      });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [pond]);

  // For App: where the pond is on screen, and taking a fish out of it (it's on his line now).
  useEffect(() => {
    if (!apiRef || !pond) return;
    apiRef.current = {
      rect: () => pondEl.current?.getBoundingClientRect() ?? null,
      take: (i) => {
        const f = fish.current[i];
        if (f) Object.assign(f, { state: "caught", caughtAt: performance.now() });
      },
      colours: (i) => FISH_COLOURS[i % FISH_COLOURS.length],
    };
  }, [apiRef, pond]);

  if (!pond) return null;
  // The first fish that isn't busy is the one that comes when the pond is clicked.
  const pick = () => {
    const i = fish.current.findIndex((f) => f.state === "under" || f.state === "jumping");
    if (i >= 0) onCatch(i);
  };
  return (
    <>
      <button
        ref={pondEl}
        type="button"
        className={`pond absolute ${canCatch ? "pointer-events-auto cursor-pointer" : "pointer-events-none"}`}
        style={{ left: pond.left, top: pond.top }}
        aria-label="Catch a fish"
        tabIndex={canCatch ? 0 : -1}
        onClick={pick}
      >
        <PixelArt art={POND} palette={night ? POND_NIGHT : POND_DAY} pixel={pond.px} />
      </button>
      {FISH_COLOURS.map((colours, i) => (
        <span key={`ripple${i}`} ref={(el) => (ripples.current[i] = el)} aria-hidden className="pond-ripple absolute top-0 left-0" />
      ))}
      {FISH_COLOURS.map((colours, i) => (
        <span key={`fish${i}`} ref={(el) => (els.current[i] = el)} aria-hidden className="pond-fish absolute top-0 left-0">
          <PixelArt art={FISH} palette={colours} pixel={3} />
        </span>
      ))}
    </>
  );
}
