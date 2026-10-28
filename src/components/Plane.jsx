import PixelArt from "./PixelArt";

// A little red plane that carries him up to the case study's bulb when the screen is too tall
// for a ladder. Drawn facing right (flipped with `dir`); his torso shows above the fuselage.
const P = 4; // one art pixel, in screen px
const COLS = 30;
const ROWS = 16;
export const PLANE_W = COLS * P;
export const PLANE_SEAT = ((COLS - 12) / 2) * P; // where his left edge sits, centred on the plane
export const PLANE_SEAT_UP = 3 * P; // his boots rest this far above the plane's lowest pixel

const ART = (() => {
  const g = Array.from({ length: ROWS }, () => Array(COLS).fill("."));
  const box = (x, y, w, h, c) => {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) g[y + j][x + i] = c;
  };
  box(6, 8, 21, 6, "R"); // fuselage
  box(3, 9, 3, 4, "R"); // tail taper
  box(0, 10, 3, 2, "R");
  box(27, 9, 2, 4, "D"); // nose cone
  box(6, 11, 21, 1, "W"); // cream stripe
  box(6, 13, 21, 1, "D"); // belly
  box(1, 4, 3, 6, "R"); // tail fin
  box(1, 4, 1, 6, "D");
  box(0, 8, 7, 1, "D"); // tailplane
  box(21, 5, 1, 3, "L"); // windscreen
  box(21, 5, 2, 1, "K");
  box(9, 12, 14, 2, "D"); // wing
  box(9, 12, 14, 1, "W");
  box(10, 14, 1, 1, "K"); // wheels and struts
  box(9, 15, 3, 1, "K");
  box(20, 14, 1, 1, "K");
  box(19, 15, 3, 1, "K");
  return g.map((r) => r.join(""));
})();
const PALETTE = { R: "#d9342b", D: "#9e1f19", W: "#f6f0dc", K: "#2a2a33", L: "#9ed0ee" };

// x: left edge (screen px), up: lift above the track, bottom: the track's distance from the
// screen's bottom.
export default function Plane({ x, up, bottom, dir }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-0 z-[6]"
      style={{ transform: `translate(${x}px, ${-up}px)`, bottom }}
    >
      <div style={{ transform: dir < 0 ? "scaleX(-1)" : undefined }}>
        <div className="plane-bob relative">
          <PixelArt art={ART} palette={PALETTE} pixel={P} />
          <span className="plane-prop absolute block" style={{ left: 29 * P, top: 6 * P }} />
        </div>
      </div>
    </div>
  );
}
