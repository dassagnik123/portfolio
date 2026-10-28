// Pixel plants for the garden along the path, and where to put them.

const G = "#5f9e45"; // leaf
const g = "#3f7a2e"; // leaf shade
const T = "#7a4f2a"; // trunk
const Y = "#ffd23f"; // flower centre

const TUFT = ["G..G..G", ".G.G.G.", ".gGgGg."];

const FLOWER = [".R.R.", "RRYRR", ".RRR.", "..G..", ".GG..", "..G.."];

const BUSH = ["...GGGG...", ".GGgGGGGG.", "GGGGGgGGGG", "GgGGGGGGgG", "GGGgGGGGGG", ".gggggggg."];

const TREE = [
  "....GGGG....",
  "..GGGGGGGG..",
  ".GGgGGGGGGG.",
  "GGGGGGGgGGGG",
  "GGgGGGGGGGGG",
  "GGGGGGGGGgGG",
  ".GGGGgGGGGG.",
  "..GGGGGGGG..",
  "....GGGG....",
  ".....TT.....",
  ".....TT.....",
  ".....TT.....",
  ".....TT.....",
  "....TTTT....",
];

const FLOWER_COLORS = ["#e2583f", "#f6c445", "#b36ad6", "#ffffff", "#f08fb0"];

export const SPRITES = {
  tuft: { art: TUFT, pixel: 3, palette: { G, g } },
  bush: { art: BUSH, pixel: 3, palette: { G, g } },
  tree: { art: TREE, pixel: 4, palette: { G, g, T } },
  ...Object.fromEntries(
    FLOWER_COLORS.map((R, i) => [`flower${i}`, { art: FLOWER, pixel: 3, palette: { R, Y, G } }]),
  ),
};

// Plants switched off for now; flip back to true to bring them back.
const SHOW_TREES = false;
const SHOW_GRASS = false;

// Small seeded random, so the garden comes out the same on every visit.
function seeded(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Plants along both sides of the path: small ones close to its edge, trees further back.
// Each item is { kind, x, y } with (x, y) where its base sits.
export function plantGarden(path, pathWidth) {
  const rand = seeded(7);
  const items = [];
  const edge = pathWidth / 2;
  const clearOfFlags = (x, y) => path.stops.every((s) => Math.hypot(x - s.flag.x, y - (s.flag.y - 30)) > 70);
  const onScreen = (x) => x > 12 && x < path.width - 12;

  // The path's sideways direction at a point, to step off it to either side.
  const normalAt = (len) => {
    const a = path.pointAt(len - 1);
    const b = path.pointAt(len + 1);
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const n = Math.hypot(dx, dy) || 1;
    return { x: -dy / n, y: dx / n };
  };

  const place = (kind, len, offset) => {
    const p = path.pointAt(len);
    const n = normalAt(len);
    const x = p.x + n.x * offset;
    const y = p.y + n.y * offset;
    if (onScreen(x) && clearOfFlags(x, y)) items.push({ kind, x: Math.round(x), y: Math.round(y) });
  };

  for (let len = 20; len < path.total; len += 44) {
    if (rand() > 0.7) continue;
    const side = rand() < 0.5 ? -1 : 1;
    const r = rand();
    const kind = r < 0.5 ? "tuft" : r < 0.82 ? `flower${Math.floor(rand() * FLOWER_COLORS.length)}` : "bush";
    const offset = side * (edge + 12 + rand() * 40);
    if (kind !== "tuft" || SHOW_GRASS) place(kind, len, offset);
  }
  for (let len = 120; len < path.total; len += 210 + rand() * 120) {
    const offset = (rand() < 0.5 ? -1 : 1) * (edge + 90 + rand() * 60);
    if (SHOW_TREES) place("tree", len, offset);
  }
  // Far-back plants first, so nearer (lower) ones overlap them.
  return items.sort((a, b) => a.y - b.y);
}
