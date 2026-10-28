import PixelArt from "./PixelArt";

// A small pixel pointer for buttons ("◀ BACK", "NEXT ▶"). Drawn rather than typed so it centres
// with the label; it takes the button's text colour.
const RIGHT = ["K...", "KK..", "KKK.", "KKKK", "KKK.", "KK..", "K..."];
const LEFT = RIGHT.map((row) => [...row].reverse().join(""));
const PALETTE = { K: "currentColor" };

export default function Arrow({ dir = "right", pixel = 2 }) {
  return <PixelArt art={dir === "left" ? LEFT : RIGHT} palette={PALETTE} pixel={pixel} />;
}
