// The road down the page: straight, U-turn, straight, U-turn... Scrolling moves the boy
// along it at a steady pace (scroll position ↔ distance along the road), and a camera
// follows him so his feet stay at the floor line while the road slides past.

export const FLOOR = 0.6; // fraction of the viewport below his feet
// What a flag says, where it differs from the stop's name in the code.
export const STOP_NAMES = { HOBBIES: "THE REAL ME" };
export const STOPS = ["START", "WORK", "EXPERIENCE", "SKILLS", "HOBBIES", "CONTACT"];
const SCROLL_PER_PX = 1.3; // scroll distance per pixel walked (higher = he moves less per scroll)

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// left/right: the x range his centre may reach (the outside of the turns).
export function makePath({ width, height, left, right }) {
  const vh = height;
  const foot = vh * (1 - FLOOR); // his feet, in viewport y
  const turns = STOPS.length - 2; // a stop at the start, one per turn, one at the end
  const r = Math.round(clamp(vh * 0.17, 90, 160)); // turn radius; rows are 2r apart
  const y0 = foot; // the first straight sits on the floor line at the top of the page

  // Build the segments: straights run between the turn centres, turns bulge out to the edges.
  const segs = [];
  let x = left;
  let y = y0;
  for (let i = 0; i <= turns; i++) {
    const goingRight = i % 2 === 0;
    const last = i === turns;
    // The last straight runs all the way to the edge; the others stop where the turn begins.
    const endX = last ? (goingRight ? right : left) : goingRight ? right - r : left + r;
    segs.push({ type: "line", x0: x, y0: y, x1: endX, y1: y, len: Math.abs(endX - x) });
    x = endX;
    if (!last) {
      const dir = goingRight ? 1 : -1; // which way the U bulges
      segs.push({ type: "turn", cx: x, cy: y + r, r, dir, len: Math.PI * r });
      y += 2 * r;
    }
  }
  let acc = 0;
  for (const s of segs) {
    s.start = acc;
    acc += s.len;
  }
  const total = acc;
  const range = Math.round(total * SCROLL_PER_PX);

  // Point on the road at distance `len` from the start.
  const pointAt = (len) => {
    const L = clamp(len, 0, total);
    const s = segs.find((seg) => L <= seg.start + seg.len) ?? segs[segs.length - 1];
    const t = s.len ? (L - s.start) / s.len : 0;
    if (s.type === "line") return { x: s.x0 + (s.x1 - s.x0) * t, y: s.y0 };
    const a = Math.PI * t; // 0 at the top of the U, π at the bottom
    return { x: s.cx + s.dir * s.r * Math.sin(a), y: s.cy - s.r * Math.cos(a) };
  };

  // SVG path for the road's centre line.
  const d = segs
    .map((s, i) => {
      if (s.type === "line") return `${i ? "L" : "M"}${s.x0} ${s.y0} L${s.x1} ${s.y1}`;
      return `A${s.r} ${s.r} 0 0 ${s.dir > 0 ? 1 : 0} ${s.cx} ${s.cy + s.r}`;
    })
    .join(" ");

  // Stops: the start, the far point of each turn, the end.
  const turnSegs = segs.filter((s) => s.type === "turn");
  const stopLens = [0, ...turnSegs.map((s) => s.start + s.len / 2), total];
  const stops = STOPS.map((label, i) => {
    const len = stopLens[i];
    const p = pointAt(len);
    const turn = turnSegs[i - 1];
    // Flags: just inside each turn, beside where he stops; just above the path at the start and end.
    const flag = turn
      ? { x: p.x - turn.dir * 76, y: p.y + 30 }
      : { x: p.x + (p.x < width / 2 ? 1 : -1) * 70, y: p.y - 26 };
    return { label, len, scroll: (len / total) * range, x: p.x, y: p.y, flag };
  });

  return {
    width,
    vh,
    foot,
    range,
    total,
    pageHeight: range + vh, // the page is only as tall as the scrolling needs
    roadHeight: y + vh, // the road layer's own height
    d,
    pointAt,
    lenAt: (scroll) => (clamp(scroll, 0, range) / range) * total,
    scrollAtLen: (len) => (clamp(len, 0, total) / total) * range,
    stops,
  };
}
