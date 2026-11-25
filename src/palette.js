// Colours for the canvas background: the warm vanilla cream family (colors.md §10). CSS uses the
// same base through tokens.css.
export const PAPER = {
  base: "#F1E6C4",
  light: ["#F8F0D8", "#F4E9CC", "#F1E6C4"],
  warm: ["#E9D2A3", "#DCC08A"],
  grain: ["#F8F0D8", "#C9AA6B"],
};

// Small seeded random generator so the background comes out the same on every load.
export function seeded(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const pick = (list, rand) => list[Math.floor(rand() * list.length)];
