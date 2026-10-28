import { BULB_ART, BULB_UNLIT_PALETTE } from "./bulbArt";
import PixelArt from "./PixelArt";

// 8-bit boy in a cap, T-shirt, pants and boots. Positioned by App (x along the floor,
// y up the ladder); he bobs while idle and swaps leg frames as he walks or climbs.
const P = 4; // one art pixel, in screen px

const PALETTE = {
  K: "#1f1f2a", // outline
  C: "#d9342b", // cap
  c: "#9e1f19", // cap brim
  H: "#4a2c17", // hair
  S: "#f2c29b", // skin
  s: "#d49a72", // skin shade
  E: "#1b1b1b", // eyes
  T: "#3f9d4b", // T-shirt
  t: "#2d7537", // T-shirt shade
  P: "#3b5bab", // pants
  p: "#2a4180", // pants shade
  B: "#6b4226", // boots
  b: "#3f2616", // boot soles
};

const ART = [
  "....KKKK....",
  "...KCCCCK...",
  "..KCCCCCCK..",
  "..KccccccccK",
  "..KHSSSSHK..",
  "..KSESSESK..",
  "..KSSSSSSK..",
  "...KSssSK...",
  "..KTTTTTTK..",
  ".KTTTTTTTTK.",
  "KSKTTTTTTKSK",
  "KSKtTTTTtKSK",
  ".KKPPPPPPKK.",
  "...KPPKPPK..",
  "...KPpKPpK..",
  "...KPpKPpK..",
  "...KBBKBBK..",
  "..KbbbKbbbK.",
  "..KKKKKKKKK.",
];

// Stride frame: same body, legs apart. Walking alternates this with ART.
const STRIDE_ART = [
  ...ART.slice(0, 13),
  "...KPPKPPK..",
  "..KPpKKPpK..",
  "..KPpK.KPpK.",
  ".KBBK...KBBK",
  ".KbbbK..KbbK",
  ".KKKKK..KKKK",
];

// Y-shaped slingshot held up in his right hand while he aims; the pebble sits in the band.
const SLING_PALETTE = {
  W: "#8b5a2b", // wood
  w: "#5e3b1a", // wood shade
  R: "#2a2a33", // rubber band
  G: "#8d8d98", // pebble
  S: "#f2c29b", // his fist around the handle
  K: "#1f1f2a", // fist outline
};

const SLING_LOADED = [
  "w.....w",
  "W.....W",
  "WR...RW",
  ".WRGRW.",
  "..WWW..",
  "...W...",
  ".KSWSK.",
  ".KSwSK.",
];

const SLING_EMPTY = [
  "w.....w",
  "W.....W",
  "WR...RW",
  ".WRRRW.",
  "..WWW..",
  "...W...",
  ".KSWSK.",
  ".KSwSK.",
];

// Bow held out in his right hand. "drawn": string pulled back with a flaming arrow nocked;
// "loose": just after the shot.
const BOW_PALETTE = {
  W: "#8b5a2b", // bow wood
  R: "#e8e2cf", // string (pale, so it shows at night)
  S: "#c9a46a", // arrow shaft
  A: "#9a9aa8", // arrowhead
  O: "#ff8a3c", // flame
  Y: "#ffd23f", // flame tip
};

const BOW_DRAWN = [
  "...WW......",
  "..R.WW.....",
  ".R...W.....",
  "R.....W....",
  "R.....W..Y.",
  "RSSSSSWSAOY",
  "R.....W..Y.",
  "R.....W....",
  ".R...W.....",
  "..R.WW.....",
  "...WW......",
];

// Butterfly net. "up": raised over his shoulder; "swing": swept out in front; "full": swept out
// with a butterfly inside (its colours come from `netColours`).
const NET_PALETTE = { K: "#3b3b46", M: "#e8e2cf", S: "#8b5a2b" };
const NET_UP = [
  "....KKKK..",
  "...KM.M.K.",
  "...K.M.MK.",
  "...KM.M.K.",
  "....KKKK..",
  "....S.....",
  "...S......",
  "..S.......",
  ".S........",
  "S.........",
];
const NET_SWING = [
  ".......KKKK.",
  "......KM.M.K",
  "SSSSSSK.M.MK",
  "......KM.M.K",
  ".......KKKK.",
];
const NET_FULL = [
  ".......KKKK.",
  "......KMWPMK",
  "SSSSSSKWPWMK",
  "......KMPWMK",
  ".......KKKK.",
];

const BOW_LOOSE = [
  "...WW......",
  "...RWW.....",
  "...R.W.....",
  "...R..W....",
  "...R..W....",
  "...R..W....",
  "...R..W....",
  "...R..W....",
  "...R.W.....",
  "...RWW.....",
  "...WW......",
];

// Fishing rod, handle in his hand: held out over the water (cast), or hauled up (pull).
const ROD_PALETTE = { R: "#8b5a2b", H: "#2a2a33", G: "#9a9aa8" };
const ROD_CAST = [
  "...........R",
  "..........R.",
  ".........R..",
  "........R...",
  ".......R....",
  "......R.....",
  ".....R......",
  "....R.......",
  "...R........",
  "..HG........",
  ".H..........",
];
const ROD_PULL = [
  "....RR",
  "....R.",
  "...R..",
  "...R..",
  "...R..",
  "..R...",
  "..R...",
  ".R....",
  ".R....",
  "HG....",
  "H.....",
];

// Shovel in his hands, blade at his feet: "down" is pressed into the ground, "up" has lifted a
// scoop of dirt (D).
const SHOVEL_PALETTE = { H: "#8b5a2b", S: "#a8734a", M: "#b4b4c0", D: "#8b5a2b" };
const SHOVEL_DOWN = [
  "HHH",
  ".S.",
  ".S.",
  ".S.",
  ".S.",
  ".S.",
  ".S.",
  ".S.",
  "MMM",
  "MMM",
  ".M.",
];
const SHOVEL_UP = [
  "HHH",
  ".S.",
  ".S.",
  ".S.",
  ".S.",
  ".S.",
  ".S.",
  ".S.",
  "DDD",
  "MMM",
  ".M.",
];

export const BOY_W = ART[0].length * P;
export const BOY_H = ART.length * P;

// x/y: offset from his spot on the floor at the screen's left edge.
// facing: 1 = right, -1 = left. pose: "idle" | "walk" | "climb", with `step` picking the frame.
// sling: "loaded" while he aims, "empty" just after the shot, or null. carrying: a new bulb in hand.
// bow: "drawn" (flaming arrow ready) or "loose" (just shot), or null.
// net: "up" | "swing" | "full" (with netColours for the butterfly inside), or null.
// dig: "down" | "up" (a shovel in his hands: blade in the ground, or lifting a scoop), or null.
// rod: "cast" | "pull" (a fishing rod; rodRef is its box, for where the line hangs), or null.
// placement: "floor" pins him to the map's floor line; "inline" places him at the bottom of
// whatever positioned box he's in (the case study's track); "screen" pins him `bottom` px up
// from the bottom of the screen (the case study's repair scene). scale: 1 is full size.
export default function Boy({
  x,
  y,
  facing,
  pose,
  step,
  sling,
  slingRef,
  carrying,
  bow,
  bowRef,
  net,
  netColours,
  netRef,
  rod,
  rodRef,
  dig,
  boyRef,
  placement = "floor",
  bottom = 0,
  scale = 1,
}) {
  const stride = pose !== "idle" && step % 2 === 1;
  return (
    <div
      ref={boyRef}
      aria-hidden
      className={`boy-root pointer-events-none left-0 z-[5] ${
        placement === "floor" ? "fixed bottom-(--floor)" : placement === "screen" ? "fixed" : "absolute bottom-0"
      }`}
      style={{
        // scale shrinks him about his feet (the case study draws him a little smaller)
        transform: `translate(${x}px, ${y}px)${scale !== 1 ? ` scale(${scale})` : ""}`,
        transformOrigin: "50% 100%",
        ...(placement === "screen" && { bottom }),
      }}
    >
      <div className={pose === "idle" ? "boy" : ""}>
        <div className="relative" style={{ transform: facing < 0 ? "scaleX(-1)" : undefined }}>
          <PixelArt art={stride ? STRIDE_ART : ART} palette={PALETTE} pixel={P} />
          {sling && (
            // Handle sits in his right hand (art column 10, row 11).
            <span ref={slingRef} className="absolute block" style={{ left: 10 * P, top: 4 * P }}>
              <PixelArt art={sling === "loaded" ? SLING_LOADED : SLING_EMPTY} palette={SLING_PALETTE} pixel={P} />
            </span>
          )}
          {bow && (
            // Grip in his right hand; the arrow points the way he's facing.
            <span ref={bowRef} className="absolute block" style={{ left: 9 * P, top: 5 * P }}>
              <PixelArt
                art={bow === "drawn" ? BOW_DRAWN : BOW_LOOSE}
                palette={BOW_PALETTE}
                pixel={P}
              />
            </span>
          )}
          {net && (
            // Handle in his right hand: raised over his shoulder, or swept out in front.
            <span
              ref={netRef}
              className="absolute block"
              style={net === "up" ? { left: 10 * P, top: 2 * P } : { left: 10 * P, top: 9 * P }}
            >
              <PixelArt
                art={net === "up" ? NET_UP : net === "full" ? NET_FULL : NET_SWING}
                palette={{ ...NET_PALETTE, ...netColours }}
                pixel={P}
              />
            </span>
          )}
          {rod && (
            <span ref={rodRef} className="absolute block" style={{ left: 9 * P, top: -1 * P }}>
              <PixelArt art={rod === "cast" ? ROD_CAST : ROD_PULL} palette={ROD_PALETTE} pixel={3} />
            </span>
          )}
          {dig && (
            <span
              className="absolute block"
              style={{ left: 11 * P, top: dig === "down" ? 19 * P - 11 * 4 + 2 : 19 * P - 11 * 4 - 14 }}
            >
              <PixelArt art={dig === "down" ? SHOVEL_DOWN : SHOVEL_UP} palette={SHOVEL_PALETTE} pixel={4} />
            </span>
          )}
          {carrying && (
            // The replacement bulb, held up in his right hand.
            <span className="absolute block" style={{ left: 10 * P, top: 5 * P }}>
              <PixelArt art={BULB_ART} palette={BULB_UNLIT_PALETTE} pixel={2} />
            </span>
          )}
        </div>
      </div>
      {/* Flat pixel shadow on the floor; it stays behind when he climbs. */}
      {y === 0 && <div className="mx-auto mt-[2px] h-[4px] w-[40px] bg-[#1f1f2a]/15" />}
    </div>
  );
}
