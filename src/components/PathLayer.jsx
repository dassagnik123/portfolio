import { useMemo } from "react";
import { STOP_NAMES } from "../path";
import ButterflyBushes from "./ButterflyBushes";
import FishPond from "./FishPond";
import TreasureDig from "./TreasureDig";
import { plantGarden, SPRITES } from "./garden";
import PixelArt from "./PixelArt";

// The garden path, drawn in a layer pinned to the screen and slid by the camera (`cam`, in px),
// with plants along it and a clickable flag at each stop.
const FLAG_PALETTE = { K: "#2a2a33", R: "#d9342b", r: "#9e1f19" };
// The stop he's standing at gets a gold flag.
const HERE_PALETTE = { ...FLAG_PALETTE, R: "#f6c445", r: "#c98a10" };
// At night the pole turns pale so it shows against the dark.
const NIGHT_POLE = "#c9c4b2";
const P = 3;

const FLAG = [
  "KRRR....",
  "KRRRRR..",
  "KRRRRRRr",
  "KRRRRr..",
  "KRrr....",
  "K.......",
  "K.......",
  "K.......",
  "K.......",
  "K.......",
  "KK......",
  "KKK.....",
];

const PATH_W = 40;

// Path colours: "light" is a pale cream path; "dirt" is the earlier darker garden path;
// "night" is used while the bulb is out.
const COLORS = {
  light: { edge: "#eadfc6", surface: "#f8f1df", middle: "#fffaee", pebble: "#e3d4b4", fleck: "#ffffff" },
  dirt: { edge: "#7fb85a", surface: "#c9a46a", middle: "#d8b982", pebble: "#a8834f", fleck: "#efdcae" },
  // Dark mode (the bulb is out): a dusky slate path that still reads against the night.
  night: { edge: "#3d4260", surface: "#2c3048", middle: "#363b56", pebble: "#4b516f", fleck: "#6a7194" },
};

export default function PathLayer({
  path,
  cam,
  current,
  onStop,
  colors = "light",
  onCatchButterfly,
  butterfliesRef,
  canCatch,
  onCatchFish,
  fishRef,
  canFish,
  onDig,
  digRef,
  canDig,
  canRestartDig,
  onRestartDig,
}) {
  const c = COLORS[colors];
  const garden = useMemo(() => plantGarden(path, PATH_W), [path]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-x-0 top-0"
        style={{ height: path.roadHeight, transform: `translateY(${-Math.round(cam)}px)` }}
      >
        <svg width={path.width} height={path.roadHeight} className="absolute top-0 left-0" shapeRendering="crispEdges">
          {/* Edge, surface, a worn middle, then scattered pebbles */}
          <path d={path.d} fill="none" stroke={c.edge} strokeWidth={PATH_W + 12} strokeLinecap="round" strokeLinejoin="round" />
          <path d={path.d} fill="none" stroke={c.surface} strokeWidth={PATH_W} strokeLinecap="round" strokeLinejoin="round" />
          <path d={path.d} fill="none" stroke={c.middle} strokeWidth={PATH_W - 18} strokeLinecap="round" strokeLinejoin="round" />
          <path d={path.d} fill="none" stroke={c.pebble} strokeWidth="4" strokeDasharray="4 26" transform="translate(0 -9)" />
          <path d={path.d} fill="none" stroke={c.fleck} strokeWidth="4" strokeDasharray="4 34" strokeDashoffset="15" />
          <path d={path.d} fill="none" stroke={c.pebble} strokeWidth="4" strokeDasharray="4 30" strokeDashoffset="8" transform="translate(0 9)" />
        </svg>

        {garden.map((item, i) => {
          const sprite = SPRITES[item.kind];
          const w = sprite.art[0].length * sprite.pixel;
          const h = sprite.art.length * sprite.pixel;
          return (
            <div key={i} className="plant absolute" style={{ left: item.x - w / 2, top: item.y - h }}>
              <PixelArt art={sprite.art} palette={sprite.palette} pixel={sprite.pixel} />
            </div>
          );
        })}

        <ButterflyBushes path={path} night={colors === "night"} onCatch={onCatchButterfly} apiRef={butterfliesRef} canCatch={canCatch} />
        <FishPond path={path} night={colors === "night"} onCatch={onCatchFish} apiRef={fishRef} canCatch={canFish} />
        <TreasureDig path={path} night={colors === "night"} canDig={canDig} canRestart={canRestartDig} onDig={onDig} onRestart={onRestartDig} apiRef={digRef} />

        {path.stops.map((stop, i) => (
          <button
            key={stop.label}
            type="button"
            onClick={() => onStop(i)}
            aria-label={`Walk to ${STOP_NAMES[stop.label] ?? stop.label}`}
            aria-current={current === i ? "location" : undefined}
            className={`stop pointer-events-auto absolute flex -translate-y-full cursor-pointer flex-col items-center gap-2 ${
              stop.flag.align === "right" ? "-translate-x-full" : stop.flag.align === "left" ? "" : "-translate-x-1/2"
            }`}
            style={{ left: stop.flag.x, top: stop.flag.y }}
          >
            <span className="stop-label">{STOP_NAMES[stop.label] ?? stop.label}</span>
            <PixelArt
              art={FLAG}
              palette={{ ...(current === i ? HERE_PALETTE : FLAG_PALETTE), ...(colors === "night" && { K: NIGHT_POLE }) }}
              pixel={P}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
