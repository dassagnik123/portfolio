import { useEffect, useMemo, useRef, useState } from "react";
import PixelArt from "./PixelArt";

// A patch of ground to the right of the path between SKILLS and HOBBIES with marked dig spots.
// A chest is buried under one of them. Click a spot and the boy walks over and digs (App runs
// that); each hole tells you how close the chest is: cold, warm or hot. Everything here is in
// path (world) coordinates; App drives the spots through apiRef.

const X_MARK = [
  "K...K",
  ".K.K.",
  "..K..",
  ".K.K.",
  "K...K",
];
const HOLE = [
  ".dddddd.",
  "dKKKKKKd",
  "KKKKKKKK",
  ".KKKKKK.",
];
const CHEST_OPEN = [
  "KK........KK",
  "KBKKKKKKKKBK",
  "KBBBBBBBBBBK",
  "KKKYYYYYYKKK",
  "KBYYYYYYYYBK",
  "KBYYYYYYYYBK",
  "KBBBBBBBBBBK",
  ".KKKKKKKKKK.",
];
const PALETTE = {
  K: "#2a2a33",
  D: "#c9a46a",
  d: "#8b5a2b",
  B: "#a8541c",
  b: "#7a3b12",
  Y: "#ffd23f",
};

const TEMPS = { cold: "COLD", warm: "WARM", hot: "HOT" };

function layout(path) {
  const narrow = path.width < 600;
  return {
    px: narrow ? 3 : 4,
    cols: narrow ? 3 : 4,
    rows: 2,
    narrow,
    dx: narrow ? 76 : 96,
    dy: narrow ? 66 : 92,
    gap: narrow ? 40 : 150,
    lift: narrow ? 110 : 50, // phones: higher up, clear of the info box along the bottom
  };
}

// state: 'none' (marked, not dug), 'cold' | 'warm' | 'hot' (dug: a hole and its hint), 'chest'
export default function TreasureDig({ path, night, canDig, canRestart, onDig, onRestart, apiRef }) {
  const spot = useMemo(() => {
    const skills = path.stops.find((s) => s.label === "SKILLS");
    const hobbies = path.stops.find((s) => s.label === "HOBBIES");
    if (!skills || !hobbies) return null;
    const p = path.pointAt(skills.len + (hobbies.len - skills.len) * 0.5);
    const l = layout(path);
    // The field lies to the right of the path.
    const cols = Math.max(2, Math.min(l.cols, Math.floor((path.width - 24 - (p.x + l.gap)) / l.dx)));
    return { ...l, cols, left: p.x + l.gap, top: p.y - l.lift, w: cols * l.dx, h: l.rows * l.dy };
  }, [path]);

  const count = spot ? spot.cols * spot.rows : 0;
  const [state, setState] = useState(() => Array.from({ length: 8 }, () => "none"));
  const live = useRef(state);
  const els = useRef([]);
  const set = (i, v) => {
    live.current = live.current.map((s, j) => (j === i ? v : s));
    setState(live.current);
  };

  useEffect(() => {
    if (!apiRef || !spot) return;
    apiRef.current = {
      count,
      cols: spot.cols,
      rect: (i) => {
        const r = els.current[i]?.getBoundingClientRect();
        return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2, bottom: r.bottom } : null;
      },
      isNone: (i) => live.current[i] === "none",
      set,
      reset: () => {
        live.current = live.current.map(() => "none");
        setState(live.current);
      },
    };
  }, [apiRef, spot, count]);

  if (!spot) return null;
  const px = spot.px;
  return (
    <div className={`dig absolute ${night ? "is-night" : ""}`} style={{ left: spot.left, top: spot.top, width: spot.w, height: spot.h }}>
      {Array.from({ length: count }, (_, i) => {
        const c = i % spot.cols;
        const r = Math.floor(i / spot.cols);
        const st = state[i];
        const art = st === "chest" ? CHEST_OPEN : st === "none" ? X_MARK : HOLE;
        const w = art[0].length * px;
        return (
          <button
            key={i}
            ref={(el) => (els.current[i] = el)}
            type="button"
            className={`dig-spot absolute ${canDig && st === "none" ? "pointer-events-auto cursor-pointer" : "pointer-events-none"} ${st === "chest" ? "dig-chest is-found" : ""}`}
            style={{ left: c * spot.dx + spot.dx / 2 - w / 2 - 6, top: r * spot.dy + (spot.narrow ? 30 : 40), padding: 6 }}
            aria-label={st === "none" ? "Dig here" : "Dug"}
            tabIndex={canDig && st === "none" ? 0 : -1}
            onClick={() => onDig(i)}
          >
            {st === "none" && <PixelArt art={X_MARK} palette={{ K: "#b3321f" }} pixel={px} />}
            {st !== "none" && (
              <>
                <PixelArt art={art} palette={PALETTE} pixel={px} />
                {TEMPS[st] && <span className={`dig-tag is-${st}`} style={{ top: -16 }}>{TEMPS[st]}</span>}
              </>
            )}
          </button>
        );
      })}
      {canRestart && state.some((s) => s !== "none") && (
        <button
          type="button"
          className="dig-restart pointer-events-auto cursor-pointer"
          style={spot.narrow ? { top: -8, left: 4, translate: "none" } : { top: 0, left: "50%" }}
          onClick={onRestart}
        >
          ↻ RESTART
        </button>
      )}
      {canDig && state.every((s) => s === "none") && <span className="dig-hint" style={spot.narrow ? { top: -8, left: 4, translate: "none" } : { top: 0 }}>
          {spot.narrow ? "▶ DIG!" : "▶ DIG FOR TREASURE"}
        </span>}
    </div>
  );
}
