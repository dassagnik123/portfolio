import { useState } from "react";

// The footer: flowers rising from the bottom edge of the page across the full width, with an uneven,
// organic top (a few blooms and leaves reaching higher than the rest) and a solid body below it, so
// no background shows through the flowers. Rows of big roses and lilies overlap each other, alternate
// rose and lily, and green leaves poke up between them. Only the bottom is cut off by the page edge.
// Everything is random, and different on each visit: which picture goes where, its angle (any angle),
// mirroring, size and a small nudge. Same watercolour cutouts as the hero (public/flowers).
// Decorative only.
const ROSES = ["rose-open", "rose-bud"];
const LILIES = ["lily-open", "lily-a", "lily-b", "lily-c"];
const LEAF_IMAGES = ["leaf-1", "leaf-2", "leaf-3", "leaf-4", "leaf-6", "leaf-7", "leaf-8", "leaf-9", "leaf-10"];

const rand = (min, max) => min + Math.random() * (max - min);
const pick = (list) => list[Math.floor(Math.random() * list.length)];

// y is the centre of a row as % of the block's height, from the top; sizes are in vw. The first row is
// sparse and high (it makes the uneven top); the others are dense and overlap, filling the body.
const ROWS = [
  { n: 8, y: 50, size: [10, 14], z: 3, jitter: 16 }, // sparse and uneven: makes the skyline
  { n: 11, y: 68, size: [14, 19], z: 4, jitter: 7 },
  { n: 12, y: 85, size: [16, 21], z: 5, jitter: 5 },
  { n: 12, y: 99, size: [16, 21], z: 6, jitter: 3 },
];

function layout() {
  const items = [];
  // Leaves behind everything: tall ones poking up above the flowers, others filling the body.
  for (let i = 0; i < 12; i++) {
    items.push({ src: pick(LEAF_IMAGES), x: rand(0, 100), y: rand(34, 56), size: rand(7, 11), rot: Math.round(rand(-70, 70)), flip: Math.random() < 0.5, z: 1, leaf: true });
  }
  for (let i = 0; i < 14; i++) {
    items.push({ src: pick(LEAF_IMAGES), x: rand(0, 100), y: rand(50, 100), size: rand(7, 11), rot: Math.round(rand(-40, 40)), flip: Math.random() < 0.5, z: 2, leaf: true });
  }
  let last = null;
  ROWS.forEach((row, r) => {
    for (let i = 0; i < row.n; i++) {
      const isRose = (i + r) % 2 === 0; // alternate, so it is a real mix
      let src;
      do {
        src = pick(isRose ? ROSES : LILIES);
      } while (src === last);
      last = src;
      items.push({
        src,
        // The sparse top row skips the odd spot, so the skyline is uneven.
        x: ((i + 0.5) / row.n) * 100 + rand(-4, 4),
        y: row.y + rand(-row.jitter, row.jitter),
        size: rand(...row.size),
        rot: Math.round(rand(-40, 40)),
        flip: Math.random() < 0.5,
        z: row.z,
        leaf: false,
      });
    }
  });
  // A few leaves in front, poking out between the front blooms.
  for (let i = 0; i < 6; i++) {
    items.push({ src: pick(LEAF_IMAGES), x: rand(3, 97), y: rand(62, 94), size: rand(6, 9), rot: Math.round(rand(-40, 40)), flip: Math.random() < 0.5, z: 7, leaf: true });
  }
  return items;
}

export default function FooterFlowers() {
  const [items] = useState(layout);
  return (
    <div className="footer-flowers" aria-hidden>
      <div className="ff-field">
      {items.map(({ src, x, y, size, rot, flip, z, leaf }, i) => (
        <img
          key={i}
          className={leaf ? "ff-leaf" : "ff-bloom"}
          src={`/flowers/${src}.webp`}
          alt=""
          draggable={false}
          loading="lazy"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            "--w": size,
            zIndex: z,
            transform: `translate(-50%, -50%) rotate(${rot}deg)${flip ? " scaleX(-1)" : ""}`,
          }}
        />
      ))}
      </div>
    </div>
  );
}
