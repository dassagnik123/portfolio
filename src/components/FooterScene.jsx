import PixelArt from "./PixelArt";

// The empty ground below the CONTACT stop: a cyclist rides along a road for ever, past hills
// and trees that slide by at different speeds, with birds and clouds drifting overhead. The
// layers are CSS-animated tiles (see .foot-* in index.css); nothing here reacts to scroll.

const grid = (w, h) => Array.from({ length: h }, () => Array(w).fill("."));
const put = (g, x, y, c) => {
  if (g[y]?.[x] !== undefined) g[y][x] = c;
};
const line = (g, x0, y0, x1, y1, c) => {
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1;
  for (let i = 0; i <= n; i++) put(g, Math.round(x0 + ((x1 - x0) * i) / n), Math.round(y0 + ((y1 - y0) * i) / n), c);
};
const thick = (g, x0, y0, x1, y1, c) => {
  line(g, x0, y0, x1, y1, c);
  line(g, x0 + 1, y0, x1 + 1, y1, c);
};
const box = (g, x, y, w, h, c) => {
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) put(g, x + i, y + j, c);
};
const rows = (g) => g.map((r) => r.join(""));

// ---- the cyclist (28 x 26 art px). Wheels and legs are separate so they can spin / pedal. ----
const RIDER = (() => {
  const g = grid(28, 26);
  [[5, 20, 11, 20], [5, 20, 9, 13], [11, 20, 9, 13], [9, 13, 18, 13], [11, 20, 18, 13], [18, 13, 22, 20]].forEach(
    ([a, b, c, d]) => line(g, a, b, c, d, "F"),
  );
  line(g, 18, 13, 19, 11, "K");
  line(g, 19, 11, 21, 11, "K");
  line(g, 8, 12, 10, 12, "K");
  thick(g, 9, 11, 15, 7, "B"); // back
  line(g, 10, 12, 16, 8, "B");
  box(g, 16, 3, 3, 3, "S"); // head
  box(g, 15, 2, 5, 1, "R"); // cap
  box(g, 19, 3, 3, 1, "R");
  line(g, 16, 8, 20, 11, "S"); // arm
  return rows(g);
})();
const legs = (nearFoot, farFoot) => {
  const g = grid(28, 26);
  const leg = ([fx, fy], c) => {
    const kx = Math.round((9 + fx) / 2) + 2;
    const ky = Math.round((12 + fy) / 2) - 1;
    thick(g, 9, 12, kx, ky, c);
    thick(g, kx, ky, fx, fy, c);
    box(g, fx, fy + 1, 3, 1, "K"); // shoe
  };
  leg(farFoot, "Q");
  leg(nearFoot, "P");
  return rows(g);
};
const LEGS_A = legs([12, 21], [8, 17]);
const LEGS_B = legs([8, 17], [12, 21]);
const WHEEL = (() => {
  const g = grid(11, 11);
  for (let y = 0; y < 11; y++)
    for (let x = 0; x < 11; x++) {
      const d = Math.hypot(x - 5, y - 5);
      if (d >= 4.1 && d <= 5.3) put(g, x, y, "K");
    }
  line(g, 1, 5, 9, 5, "G");
  line(g, 5, 1, 5, 9, "G");
  line(g, 2, 2, 8, 8, "G");
  line(g, 8, 2, 2, 8, "G");
  put(g, 5, 5, "F");
  return rows(g);
})();
const RIDER_PALETTE = { F: "#d9342b", K: "#2a2a33", S: "#f3c9a0", B: "#4bb36b", P: "#3a5a9b", Q: "#2a4275", R: "#d9342b", G: "#8a8a99" };

// ---- birds (wings up / down) and a cloud ----
const BIRD_UP = ["X.......X", ".X.....X.", "..XX.XX..", "....X...."];
const BIRD_DOWN = ["....X....", "..XXXXX..", ".X.XXX.X.", "X.......X"];
const BIRD_PALETTE = { X: "#3a3a48" };
const CLOUD = ["....WWW.....", "..WWWWWWW...", ".WWWWWWWWWW.", "WWWWWWWWWWWW"];
const CLOUD_PALETTE = { W: "#ffffff" };

// ---- tiles that repeat sideways, drawn once as an SVG image ----
const tileUrl = (art, palette, pixel) => {
  let rects = "";
  art.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const c = row[x];
      let n = 1;
      while (row[x + n] === c) n++;
      if (palette[c]) rects += `<rect x="${x}" y="${y}" width="${n}" height="1" fill="${palette[c]}"/>`;
      x += n;
    }
  });
  const w = art[0].length;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w * pixel}" height="${art.length * pixel}" viewBox="0 0 ${w} ${art.length}" shape-rendering="crispEdges">${rects}</svg>`;
  return { url: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`, width: w * pixel };
};

// Far hills: two sine waves whose periods divide the tile, so it joins up with itself.
const HILLS = (() => {
  const w = 160;
  const g = grid(w, 14);
  for (let x = 0; x < w; x++) {
    const top = Math.round(6 + 2.6 * Math.sin((2 * Math.PI * 2 * x) / w) + 1.6 * Math.sin((2 * Math.PI * 5 * x) / w + 1));
    for (let y = top; y < 14; y++) put(g, x, y, y === top ? "L" : "H");
  }
  return rows(g);
})();
const HILLS_PALETTE = { L: "#a7d6a0", H: "#8cc58f" };

// Roadside trees: pines and round trees at fixed spots across the tile.
const TREES = (() => {
  const w = 240;
  const h = 22;
  const g = grid(w, h);
  const base = h - 1;
  const pine = (cx) => {
    box(g, cx, base - 3, 2, 4, "T");
    for (let r = 0; r < 14; r++) {
      const half = 1 + Math.floor(r / 2);
      box(g, cx + 1 - half, base - 17 + r, half * 2, 1, r % 4 < 2 ? "G" : "g");
    }
  };
  const round = (cx) => {
    box(g, cx, base - 5, 2, 6, "T");
    for (let y = -5; y <= 5; y++)
      for (let x = -5; x <= 5; x++) if (x * x + y * y <= 27) put(g, cx + 1 + x, base - 11 + y, y < -1 ? "g" : "G");
  };
  [12, 70, 140, 205].forEach(pine);
  [40, 105, 175, 228].forEach(round);
  return rows(g);
})();
const TREES_PALETTE = { G: "#3f8f56", g: "#56ab6b", T: "#7a5a3c" };

// Grass tufts and flowers along the near edge of the road.
const GRASS = (() => {
  const w = 120;
  const g = grid(w, 6);
  [4, 19, 33, 52, 66, 81, 97, 111].forEach((x, i) => {
    line(g, x, 5, x, 2 + (i % 2), "G");
    line(g, x + 2, 5, x + 3, 3, "G");
    line(g, x - 2, 5, x - 3, 3, "G");
  });
  [11, 44, 74, 104].forEach((x, i) => {
    put(g, x, 3, i % 2 ? "Y" : "P");
    put(g, x, 4, "G");
    put(g, x, 5, "G");
  });
  return rows(g);
})();
const GRASS_PALETTE = { G: "#5fa84f", Y: "#f6c445", P: "#e96fa0" };

// Birds: [top %, size, flight seconds, delay]. They all fly the way he rides.
const BIRDS = [
  { top: 6, px: 5, dur: 19, delay: -3 },
  { top: 18, px: 4, dur: 26, delay: -9 },
  { top: 30, px: 5, dur: 22, delay: -12 },
  { top: 12, px: 3, dur: 31, delay: -17 },
  { top: 38, px: 4, dur: 17, delay: -6 },
  { top: 24, px: 4, dur: 24, delay: -19 },
  { top: 4, px: 3, dur: 28, delay: -24 },
];
// Stars for the night sky: [left %, top %, size px], placed by a fixed stride so they stay put.
const STARS = Array.from({ length: 34 }, (_, i) => ({
  left: (i * 29 + 7) % 97 + 1,
  top: (i * 41 + 11) % 88 + 2,
  size: i % 5 === 0 ? 4 : 3,
  dur: 1.6 + (i % 7) * 0.5,
  delay: -((i * 13) % 9) * 0.4,
}));
// A flying saucer that roams the night sky (dark mode only, see .foot-ufo in the CSS).
const UFO = [
  "......GGGG......",
  ".....GDDDDG.....",
  "....GDDDDDDG....",
  "..SSSSSSSSSSSS..",
  ".SSLSSLSSLSSLSS.",
  "..SSSSSSSSSSSS..",
  "....S..SS..S....",
];
const UFO_PALETTE = { G: "#9ef7d6", D: "#5fd1b0", S: "#a9b1c6", L: "#ffd23f" };
const CLOUDS = [
  { top: 12, px: 6, dur: 90, delay: -30 },
  { top: 30, px: 5, dur: 120, delay: -80 },
];

export default function FooterScene() {
  const hills = tileUrl(HILLS, HILLS_PALETTE, 6);
  const trees = tileUrl(TREES, TREES_PALETTE, 4);
  const grass = tileUrl(GRASS, GRASS_PALETTE, 4);
  const tile = (t) => ({ backgroundImage: t.url, "--tile": `${t.width}px` });
  return (
    <div aria-hidden className="foot-scene">
      <div className="foot-sky">
        <span className="foot-ufo">
          <span className="foot-ufo-fly">
            <span className="foot-ufo-beam" />
            <PixelArt art={UFO} palette={UFO_PALETTE} pixel={5} />
            <span className="foot-ufo-lights" />
          </span>
        </span>
        {STARS.map((t, i) => (
          <span
            key={`star${i}`}
            className="foot-star"
            style={{ left: `${t.left}%`, top: `${t.top}%`, width: t.size, height: t.size, animationDuration: `${t.dur}s`, animationDelay: `${t.delay}s` }}
          />
        ))}
        {CLOUDS.map((c, i) => (
          <span key={`cloud${i}`} className="foot-drift" style={{ top: `${c.top}%`, animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s` }}>
            <PixelArt art={CLOUD} palette={CLOUD_PALETTE} pixel={c.px} />
          </span>
        ))}
        {BIRDS.map((b, i) => (
          <span key={`bird${i}`} className="foot-drift" style={{ top: `${b.top}%`, animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s` }}>
            <span className="foot-bob" style={{ animationDuration: `${1.2 + i * 0.25}s` }}>
              <span className="foot-swap-a block"><PixelArt art={BIRD_UP} palette={BIRD_PALETTE} pixel={b.px} /></span>
              <span className="foot-swap-b absolute inset-0 block"><PixelArt art={BIRD_DOWN} palette={BIRD_PALETTE} pixel={b.px} /></span>
            </span>
          </span>
        ))}
      </div>
      <div className="foot-layer foot-hills" style={tile(hills)} />
      <div className="foot-grass" />
      <div className="foot-layer foot-trees" style={tile(trees)} />
      <div className="foot-road" />
      <div className="foot-ride">
        <div className="foot-ride-bob">
          <span className="foot-wheel" style={{ left: 0 }}><PixelArt art={WHEEL} palette={RIDER_PALETTE} pixel={4} /></span>
          <span className="foot-wheel" style={{ left: 68 }}><PixelArt art={WHEEL} palette={RIDER_PALETTE} pixel={4} /></span>
          <span className="absolute inset-0 block"><PixelArt art={RIDER} palette={RIDER_PALETTE} pixel={4} /></span>
          <span className="foot-swap-a absolute inset-0 block"><PixelArt art={LEGS_A} palette={RIDER_PALETTE} pixel={4} /></span>
          <span className="foot-swap-b absolute inset-0 block"><PixelArt art={LEGS_B} palette={RIDER_PALETTE} pixel={4} /></span>
        </div>
      </div>
      <div className="foot-layer foot-grass-front" style={tile(grass)} />
    </div>
  );
}
