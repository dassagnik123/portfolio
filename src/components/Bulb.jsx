import { BROKEN_ART, BROKEN_PALETTE, BULB_ART, PALETTE } from "./bulbArt";
import PixelArt from "./PixelArt";

// 8-bit light bulb hanging on a cord from the top edge, swinging in chunky steps.
// Click it to have the boy shoot it; click the broken socket to fix it.
const P = 2; // one art pixel, in screen px

// decorative: just the hanging bulb, not clickable (used on the case study page).
// hint: a first-visit label by the bulb ("Tap here"), or null; hintSide: "left" (the map) or
// "below" (the case study, where the slide titles sit to its left).
export default function Bulb({ broken, onClick, glassRef, decorative = false, hint = null, hintSide = "left" }) {
  return (
    <div
      className={`bulb pointer-events-none fixed top-0 z-[27] flex flex-col items-center ${
        broken ? "is-broken" : ""
      }`}
    >
      {/* Cord: one art pixel wide */}
      <div className="h-(--cord) bg-[#4a4a56]" style={{ width: P }} />

      <div className="relative">
        {hint && <span className={`tap-hint tap-hint-${hintSide}`}>{hint}</span>}
        {/* Blocky, banded glow around the glass */}
        {!broken && (
          <div className="bulb-glow absolute left-1/2 top-[62%] h-[100px] w-[100px] -translate-x-1/2 -translate-y-1/2" />
        )}

        {decorative ? (
          <span aria-hidden className="relative block">
            <PixelArt art={broken ? BROKEN_ART : BULB_ART} palette={broken ? BROKEN_PALETTE : PALETTE} pixel={P} />
          </span>
        ) : (
          <button
            type="button"
            onClick={onClick}
            aria-label={broken ? "Fix the bulb" : "Shoot the bulb"}
            className="pointer-events-auto relative -m-3 block cursor-pointer p-3"
          >
            <span ref={glassRef} className="block">
              <PixelArt art={broken ? BROKEN_ART : BULB_ART} palette={broken ? BROKEN_PALETTE : PALETTE} pixel={P} />
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
