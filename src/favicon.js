// Tab icon: the boy's pixel face, animated. Browsers don't reliably animate GIF favicons, so this
// redraws a small canvas and swaps the icon: he blinks every few seconds and glances aside now
// and then. public/face.svg is the still icon shown before this script starts.

const PALETTE = {
  K: "#1f1f2a", // outline
  C: "#d9342b", // cap
  c: "#9e1f19", // cap brim
  H: "#4a2c17", // hair
  S: "#f2c29b", // skin
  s: "#d49a72", // skin shade
  E: "#1b1b1b", // eyes
};

// His head from the sprite (cap, hair, face, chin); the eyes row changes per frame.
const HEAD = (eyes) => [
  "....KKKK....",
  "...KCCCCK...",
  "..KCCCCCCK..",
  "..KccccccccK",
  "..KHSSSSHK..",
  eyes,
  "..KSSSSSSK..",
  "...KSssSK...",
  "....KKKK....",
];
const FRAMES = {
  open: HEAD("..KSESSESK.."),
  blink: HEAD("..KSssSssK.."),
  glance: HEAD("..KESSESSK.."),
};

export function startFavicon() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  let link = document.querySelector('link[rel="icon"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.type = "image/png";

  // Crop to the face itself (no empty margin), so it fills as much of the tab icon as it can.
  const cols = Object.values(FRAMES).flatMap((art) =>
    art.flatMap((row) => [...row].map((c, x) => (PALETTE[c] ? x : -1)).filter((x) => x >= 0)),
  );
  const minX = Math.min(...cols);
  const w = Math.max(...cols) - minX + 1;

  const draw = (art) => {
    const px = Math.floor(size / Math.max(w, art.length)); // 6px per art pixel
    const ox = Math.floor((size - w * px) / 2);
    const oy = Math.floor((size - art.length * px) / 2);
    ctx.clearRect(0, 0, size, size);
    art.forEach((row, y) =>
      [...row].forEach((c, x) => {
        if (!PALETTE[c]) return;
        ctx.fillStyle = PALETTE[c];
        ctx.fillRect(ox + (x - minX) * px, oy + y * px, px, px);
      }),
    );
    link.href = canvas.toDataURL("image/png");
  };

  // A little loop: look ahead, blink, look ahead, glance aside, blink...
  const script = [
    ["open", 2200],
    ["blink", 160],
    ["open", 1800],
    ["glance", 700],
    ["open", 1400],
    ["blink", 160],
    ["open", 120],
    ["blink", 160],
  ];
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return draw(FRAMES.open);
  let i = 0;
  const next = () => {
    const [frame, ms] = script[i];
    draw(FRAMES[frame]);
    i = (i + 1) % script.length;
    setTimeout(next, ms);
  };
  next();
}
