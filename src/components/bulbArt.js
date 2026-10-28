// Pixel art for the hanging bulb: lit, broken, and the fresh unlit one the boy carries.
export const PALETTE = {
  D: "#3b3b46", // socket shadow
  S: "#9a9aa8", // socket metal
  O: "#a8550f", // glass outline
  A: "#f39c1a", // amber edge
  Y: "#ffd23f", // glass
  L: "#fff08a", // inner light
  W: "#ffffff", // hot core / highlight
  F: "#fffbe0", // filament
};

// Same colors with the light gone out.
export const BROKEN_PALETTE = { ...PALETTE, Y: "#b8953a", L: "#c9b06a", A: "#9c6a1d", F: "#6b5a3a" };

// A fresh, unlit bulb: the one the boy carries up the ladder.
export const BULB_UNLIT_PALETTE = { ...PALETTE, O: "#8a7a5a", A: "#d8ccaa", Y: "#ece4c8", L: "#f6f0dc", W: "#ffffff", F: "#8a7a5a" };

export const BULB_ART = [
  "...DSSSD...",
  "...DDDDD...",
  "...DSSSD...",
  "...DDDDD...",
  "...OAYAO...",
  "..OYYLYYO..",
  ".OWYLWLYYO.",
  ".OWLWFWLYO.",
  "OYYLWFWLYYO",
  "OYYYLFLYYYO",
  "OYYYYFYYYYO",
  "OAYYYYYYYAO",
  ".OAYYYYYAO.",
  "..OAAYAAO..",
  "...OOOOO...",
];

// Jagged glass left in the socket and a dangling filament; same size so nothing shifts.
export const BROKEN_ART = [
  "...DSSSD...",
  "...DDDDD...",
  "...DSSSD...",
  "...DDDDD...",
  "...OAYAO...",
  "..OY.L.YO..",
  ".OA.....A..",
  "..O.F.F....",
  "....F.F....",
  "....F.F....",
  ".....F.....",
  "...........",
  "...........",
  "...........",
  "...........",
];
