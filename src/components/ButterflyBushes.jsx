import { useEffect, useMemo, useRef } from "react";
import { SPRITES } from "./garden";
import PixelArt from "./PixelArt";

// Bushes along the left edge of the path between HOBBIES and CONTACT, with butterflies fluttering
// about them. Click one and it lands on a bush so the boy can walk over and catch it in his
// net (App runs that); it vanishes from the net, and another flutters back in later.
// At night (bulb out) they're fireflies (jonaki) instead: slower, blinking their lights, and
// caught the same way. Everything here is in path (world) coordinates.

const P = 3;
const OPEN = [
  "WW.K.WW",
  "WPWKWPW",
  ".WWKWW.",
  "WPWKWPW",
  "WW.K.WW",
];
const SHUT = [
  "..WKW..",
  ".WPKPW.",
  "..WKW..",
  ".WPKPW.",
  "..WKW..",
];
// Wing and spot colours for each butterfly.
const COLOURS = [
  { W: "#f39c1a", P: "#2a2a33", K: "#2a2a33" },
  { W: "#6bb6ff", P: "#ffffff", K: "#2a2a33" },
  { W: "#ffd23f", P: "#e2583f", K: "#2a2a33" },
];

// Firefly: pale wings, dark body, a glowing tail (G); its light blinks on and off.
const FIREFLY = [
  "W.W",
  ".K.",
  ".G.",
];
const FIREFLY_COLOURS = { W: "#cfd8f0", K: "#2a2a33", G: "#e4ff5c", P: "#e4ff5c" };

const RESPAWN_MS = 4000;
const LAND_MS = 650;

// Spots along the path between HOBBIES and CONTACT, `fraction` of the way down that stretch, and
// `side` px to the left of the path there.
function besidePath(path, fraction, side) {
  const from = path.stops.find((s) => s.label === "HOBBIES");
  const to = path.stops.find((s) => s.label === "CONTACT");
  if (!from || !to) return null;
  const p = path.pointAt(from.len + (to.len - from.len) * fraction);
  return { x: p.x - side, y: p.y };
}

// canCatch: he's on the HOBBIES–CONTACT stretch, so clicking one sends him after it.
export default function ButterflyBushes({ path, night, onCatch, apiRef, canCatch }) {
  // Bushes hugging the path's left edge, and a home spot above some of them for each butterfly.
  const scene = useMemo(() => {
    const bushes = [
      [0.22, 62, 5],
      [0.38, 70, 6],
      [0.54, 64, 5],
      [0.7, 72, 6],
      [0.86, 64, 5],
    ]
      .map(([f, side, s]) => {
        const at = besidePath(path, f, side);
        return at && { ...at, s };
      })
      .filter(Boolean);
    const homes = [0.25, 0.52, 0.78].map((f) => besidePath(path, f, 95)).filter(Boolean);
    return { bushes, homes };
  }, [path]);

  const els = useRef([]);
  const bugs = useRef([]);

  // Each butterfly wanders and bobs about its home. States: flying, landing (heading for a
  // bush top), resting, caught (in the net, then gone until a new one comes in).
  useEffect(() => {
    const t0 = performance.now();
    const fresh = (i, now) => ({ i, state: "flying", t0, enter: now, seed: i * 1.9 });
    bugs.current = scene.homes.map((_, i) => fresh(i, t0));
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    const frame = (now) => {
      bugs.current.forEach((b, i) => {
        const el = els.current[i];
        const home = scene.homes[i];
        if (!el || !home) return;
        let x;
        let y;
        let flapMs = 90;
        let opacity = 1;
        const t = still ? 0 : (now - b.t0) / 1000;
        if (b.state === "flying" && night) {
          // fireflies drift lazily, and blink
          x = home.x + 54 * Math.sin(t * 0.45 + b.seed) + 12 * Math.sin(t * 1.3 + b.seed * 2);
          y = home.y - 50 + 30 * Math.sin(t * 0.7 + b.seed) + 6 * Math.sin(t * 2.1 + b.seed);
          const e = Math.min(1, (now - b.enter) / 1000);
          x += (1 - e) * 220;
          y -= (1 - e) * 120;
        } else if (b.state === "flying") {
          x = home.x + 46 * Math.sin(t * 0.9 + b.seed) + 8 * Math.sin(t * 3.7 + b.seed);
          y = home.y - 46 + 26 * Math.sin(t * 1.5 + b.seed) + 5 * Math.sin(t * 9 + b.seed);
          const e = Math.min(1, (now - b.enter) / 1000); // a new one flutters in from the right
          x += (1 - e) * 220;
          y -= (1 - e) * 120;
        } else if (b.state === "landing" || b.state === "resting") {
          const e = Math.min(1, (now - b.landAt) / LAND_MS);
          const ease = 1 - (1 - e) * (1 - e);
          x = b.from.x + (b.spot.x - b.from.x) * ease;
          y = b.from.y + (b.spot.y - b.from.y) * ease - Math.sin(Math.PI * e) * 14;
          if (e >= 1) b.state = "resting";
          flapMs = b.state === "resting" ? 420 : 90;
        } else {
          // caught: hidden (it's in the net, then gone); a new one comes in a little later
          x = b.spot.x;
          y = b.spot.y;
          opacity = 0;
          if (now - b.caughtAt > RESPAWN_MS) bugs.current[i] = fresh(i, now);
        }
        b.x = x;
        b.y = y;
        el.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
        el.style.opacity = opacity;
        el.dataset.wings = still ? "open" : Math.floor(now / flapMs) % 2 ? "open" : "shut";
        // a firefly's light: on most of the time, off for a beat now and then
        el.dataset.glow = still || Math.floor((now + b.seed * 900) / 500) % 4 ? "on" : "off";
        el.disabled = b.state !== "flying";
      });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [scene, night]);

  // For App: land a butterfly on the nearest bush, where it is on screen, catch it, let it go.
  useEffect(() => {
    if (!apiRef) return;
    apiRef.current = {
      land: (i) => {
        const b = bugs.current[i];
        if (!b || b.state !== "flying") return false;
        const near = scene.bushes.reduce((best, k) =>
          Math.hypot(k.x - b.x, k.y - b.y) < Math.hypot(best.x - b.x, best.y - b.y) ? k : best,
        );
        const bushTop = near.y - SPRITES.bush.art.length * near.s;
        Object.assign(b, { state: "landing", landAt: performance.now(), from: { x: b.x, y: b.y }, spot: { x: near.x - 10, y: bushTop - 12 } });
        return true;
      },
      rect: (i) => {
        const el = els.current[i];
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      },
      catch: (i) => {
        const b = bugs.current[i];
        if (b) Object.assign(b, { state: "caught", caughtAt: performance.now() });
      },
      colours: (i) => (night ? FIREFLY_COLOURS : COLOURS[i % COLOURS.length]),
    };
  }, [apiRef, scene, night]);

  const bush = SPRITES.bush;
  return (
    <>
      {scene.bushes.map((b, i) => (
        <div
          key={`bush${i}`}
          className="plant absolute"
          style={{ left: b.x - (bush.art[0].length * b.s) / 2, top: b.y - bush.art.length * b.s }}
        >
          <PixelArt art={bush.art} palette={bush.palette} pixel={b.s} />
        </div>
      ))}
      {scene.homes.map((_, i) => (
        <button
          key={`${night ? "fly" : "bug"}${i}`}
          ref={(el) => (els.current[i] = el)}
          type="button"
          className={`${night ? "firefly" : "butterfly"} absolute top-0 left-0 -m-2 p-2 ${canCatch ? "pointer-events-auto cursor-pointer" : "pointer-events-none"}`}
          aria-label={night ? "Catch the firefly" : "Catch the butterfly"}
          tabIndex={canCatch ? 0 : -1}
          onClick={() => onCatch(i)}
        >
          {night ? (
            <PixelArt art={FIREFLY} palette={FIREFLY_COLOURS} pixel={P} />
          ) : (
            <>
              <PixelArt art={OPEN} palette={COLOURS[i % COLOURS.length]} pixel={P} className="wings-open" />
              <PixelArt art={SHUT} palette={COLOURS[i % COLOURS.length]} pixel={P} className="wings-shut" />
            </>
          )}
        </button>
      ))}
    </>
  );
}
