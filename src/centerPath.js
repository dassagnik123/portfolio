// A winding path down the middle of the screen: a gentle S that swings either side of the
// centre without reaching the edges. Same shape API as makePath in path.js (which keeps the
// earlier edge-to-edge path), so PathLayer and App can use either.
import { FLOOR, STOPS } from "./path";

export const STOP_GAP = 420; // vertical step between neighbouring stops, in px (flag-to-flag lands at 420–450)
const SCROLL_PER_PX = 1.3; // scroll distance per pixel walked (higher = he moves less per scroll)
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

export function makeCenterPath({ width, height }) {
  const vh = height;
  const foot = vh * (1 - FLOOR); // his feet, in viewport y
  const cx = width / 2;
  // A gentle swing, kept in a narrow band down the middle so the info boxes have equal room
  // on either side.
  const amp = Math.min(width * 0.1, 150); // how far it swings either side of centre
  const y0 = foot;
  const gaps = STOPS.length - 1;
  const span = STOP_GAP * gaps; // stops sit exactly STOP_GAP apart, top to bottom

  // The swing's phase at each stop: centre at the start, then out to alternate sides at each
  // middle stop, back to the centre at the end. The path is level at every turn, so stepping
  // the phase at a different rate between stops still gives a smooth curve.
  const phases = [0];
  for (let k = 1; k <= gaps; k++) phases.push(phases[k - 1] + (k === 1 || k === gaps ? Math.PI / 2 : Math.PI));

  // x for a given y: a sine swing, so y only ever increases and the camera can follow him down.
  const xAtY = (y) => {
    const u = clamp((y - y0) / STOP_GAP, 0, gaps);
    const k = Math.min(gaps - 1, Math.floor(u));
    return cx + amp * Math.sin(phases[k] + (phases[k + 1] - phases[k]) * (u - k));
  };

  // Arc-length table along the path, so he walks at a steady pace through the curves.
  const SAMPLES = 900;
  const ys = [];
  const lens = [0];
  for (let i = 0; i <= SAMPLES; i++) ys.push(y0 + (span * i) / SAMPLES);
  for (let i = 1; i <= SAMPLES; i++) {
    lens.push(lens[i - 1] + Math.hypot(xAtY(ys[i]) - xAtY(ys[i - 1]), ys[i] - ys[i - 1]));
  }
  const total = lens[SAMPLES];
  // Every stop-to-stop stretch takes the same amount of scrolling, however long its curve.
  const SCROLL_GAP = Math.round(STOP_GAP * SCROLL_PER_PX);
  const range = SCROLL_GAP * gaps;

  const yAtLen = (len) => {
    const L = clamp(len, 0, total);
    let lo = 0;
    let hi = SAMPLES;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (lens[mid] < L) lo = mid;
      else hi = mid;
    }
    const f = (L - lens[lo]) / (lens[hi] - lens[lo] || 1);
    return ys[lo] + (ys[hi] - ys[lo]) * f;
  };
  const lenAtY = (y) => {
    const f = (clamp(y, y0, y0 + span) - y0) / span;
    const i = Math.min(SAMPLES - 1, Math.floor(f * SAMPLES));
    return lens[i] + (lens[i + 1] - lens[i]) * (f * SAMPLES - i);
  };
  const pointAt = (len) => {
    const y = yAtLen(len);
    return { x: xAtY(y), y };
  };

  // The path's line for drawing.
  const pts = [];
  for (let y = y0; y <= y0 + span; y += 6) pts.push(`${pts.length ? "L" : "M"}${xAtY(y).toFixed(1)} ${y.toFixed(1)}`);
  const d = pts.join(" ");

  // Stops: the start (centre), each swing's far point, and the end (centre again).
  const stopYs = STOPS.map((_, k) => y0 + k * STOP_GAP);
  const stopLens = stopYs.map((y) => lenAtY(y));
  const stops = STOPS.map((label, i) => {
    const y = stopYs[i];
    const x = xAtY(y);
    const len = lenAtY(y);
    const side = Math.sign(x - cx); // 0 at the centre stops
    // Flags right beside him at the path's edge, on the inner side at the swings (so they never
    // run under an info box), to the right at the start and end. `align` says which edge of the
    // flag sits at x, the one nearest him.
    const NEAR = 30; // from the path's centre: half his width plus a small gap
    const flag =
      side > 0 ? { x: x - NEAR, y: y + 26, align: "right" } : { x: x + NEAR, y: y + 26, align: "left" };
    return { label, len, scroll: i * SCROLL_GAP, x, y, flag };
  });

  return {
    width,
    vh,
    foot,
    range,
    total,
    pageHeight: range + vh,
    roadHeight: y0 + span + vh,
    d,
    pointAt,
    // Scroll ↔ distance along the path, evened out per stretch between stops.
    lenAt: (scroll) => {
      const u = clamp(scroll, 0, range) / SCROLL_GAP;
      const k = Math.min(gaps - 1, Math.floor(u));
      return stopLens[k] + (stopLens[k + 1] - stopLens[k]) * (u - k);
    },
    scrollAtLen: (len) => {
      const L = clamp(len, 0, total);
      let k = 0;
      while (k < gaps - 1 && L > stopLens[k + 1]) k++;
      return (k + (L - stopLens[k]) / (stopLens[k + 1] - stopLens[k] || 1)) * SCROLL_GAP;
    },
    stops,
  };
}
