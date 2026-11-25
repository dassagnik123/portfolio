import { seeded } from "./palette.js";

// A garland of roses and lilies along the bottom of the portrait, shaped like the sketch: a right
// triangle with a gently curved top edge. It starts as a thin tip at the bottom left, curves up
// slowly, then rises in a gentle slope to the right side, where it is tallest. Every flower is
// shown whole: nothing is cut off by the screen edge, and the lowest blooms hang below the first
// screen. Made from the supplied watercolour cutouts (public/flowers), with a few green
// watercolour leaves at the very back along the curve. Every column alternates rose and lily, so
// each part is a mix of both. The same cutouts are reused at different sizes, angles and
// mirrorings. Decorative only.
//
// Coordinates are in % of the garland box (x across, y down from its top).
const POWER = 1.35; // 1 is a straight diagonal; higher bends it lower for longer and steeper at the end
const ROW_STEP = 52; // vertical distance between rows of blooms (big blooms, so few rows)
// Few columns of big blooms. The last column stops short of the edge so even the biggest one is whole.
const COLUMNS = [6, 19, 33, 47, 60, 71, 82];

const ROSES = ["rose-open", "rose-bud", "rose-open"];
const LILIES = ["lily-open", "lily-a", "lily-b", "lily-c"];

// Top edge of the garland: 100 (bottom) at the left tip, 0 (top) at the right edge.
const topY = (x) => 100 - 100 * Math.pow(Math.min(Math.max(x, 0), 100) / 100, POWER);

// Leaves at the very back along the curve: [image, x, how far above the edge, width, rotation, mirrored].
// Few: just a little green behind the big flowers.
const LEAVES = [
  ["leaf-3", 14, 20, 14, 8, false],
  ["leaf-7", 30, 26, 14, 12, false],
  ["leaf-8", 46, 30, 16, 18, false],
  ["leaf-1", 60, 34, 12, -10, true],
  ["leaf-9", 74, 36, 12, 22, false],
  ["leaf-2", 86, 38, 11, -22, true],
  ["leaf-4", 97, 40, 8, 14, false],
];

function layout() {
  const rand = seeded(2026);
  const blooms = [];
  COLUMNS.forEach((col, c) => {
    const x = col + (rand() - 0.5) * 3;
    const edge = topY(x);
    const height = 100 - edge; // how tall this column of the garland is
    // Bloom size shrinks towards the thin tip on the left.
    const scale = 0.55 + 0.45 * Math.min(1, height / 45);
    for (let row = 0; ; row++) {
      const y = Math.min(edge + 6 + row * ROW_STEP, 93) + (rand() - 0.5) * 6;
      const isRose = (c + row) % 2 === 0; // alternates down and across: a mix everywhere
      const pool = isRose ? ROSES : LILIES;
      blooms.push({
        row,
        src: pool[Math.floor(rand() * pool.length)],
        x,
        y,
        width: 31 * scale * (0.92 + rand() * 0.2),
        rot: Math.round((rand() - 0.5) * 60),
        flip: rand() < 0.5,
      });
      if (edge + 6 + (row + 1) * ROW_STEP > 98) break;
    }
  });
  // Back to front: the upper rows first, so lower rows overlap them.
  return blooms.sort((a, b) => a.row - b.row);
}

const BLOOMS = layout();

const place = (x, y, width, rot, flip, z) => ({
  left: `${x}%`,
  top: `${y}%`,
  width: `${width}%`,
  zIndex: z,
  transform: `translate(-50%, -50%) rotate(${rot}deg)${flip ? " scaleX(-1)" : ""}`,
});

export default function Flowers() {
  return (
    <div className="flowers" aria-hidden>
      {LEAVES.map(([src, x, lift, width, rot, flip], i) => (
        <img key={`leaf-${i}`} src={`/flowers/${src}.webp`} alt="" draggable={false} style={place(x, topY(x) - lift + 8, width, rot, flip, i + 1)} />
      ))}
      {BLOOMS.map(({ src, x, y, width, rot, flip }, i) => (
        <img key={i} src={`/flowers/${src}.webp`} alt="" draggable={false} style={place(x, y, width, rot, flip, LEAVES.length + 1 + i)} />
      ))}
    </div>
  );
}
