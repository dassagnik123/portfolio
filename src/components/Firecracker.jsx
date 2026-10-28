import PixelArt from "./PixelArt";

// Pixel fireworks standing in the bottom-left corner while the lights are out: rockets, a
// charki (ground spinner) and a tubri (flower pot). Clicking one has the boy light it with a
// flaming arrow; App runs the show for its type.
const P = 3;

const ROCKET_PALETTE = {
  W: "#f6f0dc", // nose cone and band
  R: "#d9342b", // body
  r: "#9e1f19", // body shade
  B: "#3b5bab", // fins
  S: "#8b5a2b", // stick
  F: "#c9c4b2", // fuse
};

const ROCKET_ART = [
  "...WW...",
  "..WWWW..",
  "..RRRr..",
  "..RRRr..",
  "..WWWW..",
  "..RRRr..",
  "..RRRr..",
  ".BRRRrB.",
  "BB.FF.BB",
  "....S...",
  "....S...",
  "....S...",
  "....S...",
  "....S...",
  "...SSS..",
];

// Charki: a coil of paper wound round a pin.
const CHARKI_PALETTE = { R: "#2bb5a8", Y: "#ffd23f", K: "#2a2a33" };
const CHARKI_ART = [
  "...RRR...",
  ".RRYYYRR.",
  ".RY...YR.",
  "RY.RRR.YR",
  "RY.RKR.YR",
  "RY.RRR.YR",
  ".RY...YR.",
  ".RRYYYRR.",
  "...RRR...",
];

// Tubri: a clay flower pot with a fuse on top.
const TUBRI_PALETTE = { K: "#c9c4b2", W: "#f6f0dc", R: "#e2583f", r: "#a8402c", B: "#8b5a2b" };
const TUBRI_ART = [
  "...KK...",
  "...WW...",
  "..RRRr..",
  "..RRRr..",
  ".RRWWRr.",
  ".RRRRRr.",
  "RRRRRRRr",
  "RRRRRRRr",
  "BBBBBBBB",
];

const KINDS = {
  rocket: { art: ROCKET_ART, palette: ROCKET_PALETTE, label: "rocket" },
  charki: { art: CHARKI_ART, palette: CHARKI_PALETTE, label: "charki" },
  tubri: { art: TUBRI_ART, palette: TUBRI_PALETTE, label: "tubri" },
};

// type: "rocket" | "charki" | "tubri"; colors: overrides for the palette (another rocket colour).
// left/bottom: where it stands; `burning`: it's lit (the charki spins while it burns).
// offset: how far it has skittered from its spot while burning (the charki), in px.
export default function Firecracker({ type, colors, left, bottom, offset, onClick, rocketRef, burning, hint = null }) {
  const kind = KINDS[type];
  return (
    <button
      ref={rocketRef}
      type="button"
      onClick={onClick}
      aria-label={burning ? `The ${kind.label} is lit` : `Light the ${kind.label}`}
      className={`firecracker fc-${type} fixed z-[6] cursor-pointer p-2 ${burning ? "is-burning" : ""}`}
      style={{
        // --fc-spread / --fc-lift: phones pack them closer and stand them above the info box;
        // --fc-x: wide screens move them in from the corner, nearer him.
        left: `calc(${left - 8}px * var(--fc-spread, 1) + var(--fc-x, 0px))`,
        bottom: `calc(${bottom - 8}px + var(--fc-lift, 0px))`,
        transform: offset ? `translate(${offset.x}px, ${offset.y}px)` : undefined,
      }}
    >
      {hint && <span className="tap-hint tap-hint-above">{hint}</span>}
      <PixelArt art={kind.art} palette={{ ...kind.palette, ...colors }} pixel={P} />
    </button>
  );
}
