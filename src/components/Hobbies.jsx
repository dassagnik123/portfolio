import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { hobbies, hobbiesIntro } from "../content";
import { sfx, unlockAudio } from "../sound";
import Boy from "./Boy";
import PixelArt from "./PixelArt";

// The HOBBIES stop: a row of tabs (travel, painting, anime, cooking, sports, games); the picked one plays a
// little animated pixel scene of the boy, with what it's about and a reel of my own photos of
// it beside that. Laid out to fit the box without scrolling.
// Scenes are drawn at a fixed 360×190 and scaled to fit wherever they sit.

const W = 360;
const H = 190;
const FLOOR = 40; // px of floor under everyone's feet
const K = "#2a2a33";

const TV = [
  "...K......K...",
  "....K....K....",
  ".....K..K.....",
  "KKKKKKKKKKKKKK",
  "KSSSSSSSSSSSDK",
  "KSSSSSSSSSSSDK",
  "KSSSSSSSSSSSDK",
  "KSSSSSSSSSSSDK",
  "KSSSSSSSSSSSDK",
  "KSSSSSSSSSSSDK",
  "KKKKKKKKKKKKKK",
  "...KK....KK...",
];
const TV_PALETTE = { K, S: "#1b2a3a", D: "#9a9aa8" };

const COUCH = [
  "RRRRRRRRRRRRRRRRRRRRRR",
  "RrrrrrrrrrrrrrrrrrrrrR",
  "RrrrrrrrrrrrrrrrrrrrrR",
  "RRRRRRRRRRRRRRRRRRRRRR",
  "RrrrrrrrrrrrrrrrrrrrrR",
  "RRRRRRRRRRRRRRRRRRRRRR",
  ".K..................K.",
  ".K..................K.",
];
const COUCH_PALETTE = { R: "#7a4fd6", r: "#9b74e8", K };

// The phone in his hand, and the same phone held up big so you can see the game on it.
const PHONE_SMALL = [
  "KKKK",
  "KSSK",
  "KSSK",
  "KSSK",
  "KKKK",
];
const PHONE = [
  "KKKKKKKKKKKK",
  "KKKKKGGKKKKK",
  ...Array.from({ length: 16 }, () => "KSSSSSSSSSSK"),
  "KKKKKKKKKKKK",
  "KKKKKWWKKKKK",
  "KKKKKKKKKKKK",
];
const PHONE_PALETTE = { K: "#3b3b46", S: "#10131f", G: "#6b6b78", W: "#9a9aa8" };

const BAT = [
  ".K.",
  ".K.",
  ".K.",
  "WWW",
  "WWW",
  "WWW",
  "WWW",
  "WWW",
  "WWW",
  "WWW",
  ".W.",
];
const BAT_PALETTE = { K, W: "#e3c993" };

const STOVE = [
  "KKKKKKKKKKKKKKKK",
  "KMMMMMMMMMMMMMMK",
  "KMKKKKKKKKKKKKMK",
  "KMKGGGGGGGGGGKMK",
  "KMKGGGGGGGGGGKMK",
  "KMKKKKKKKKKKKKMK",
  "KMMMMMMMMMMMMMMK",
  "KMMDMMDMMDMMDMMK",
  "KKKKKKKKKKKKKKKK",
  ".KK..........KK.",
];
const STOVE_PALETTE = { K: "#3b3b46", M: "#c9c4b2", G: K, D: "#d9342b" };

// Handle on the left, toward him.
const PAN = [
  "....KKKKKKKK",
  "SSSSKKKKKKKK",
];
const PAN_PALETTE = { K: "#3b3b46", S: "#8b5a2b" };

// An easel with a sketch pad on it; the drawing inks itself in (see .paint-art in the CSS).
const EASEL = [
  "KKKKKKKKKKKKKK",
  ...Array.from({ length: 9 }, () => "KWWWWWWWWWWWWK"),
  "KKKKKKKKKKKKKK",
  "..B........B..",
  "..B........B..",
  ".B....BB....B.",
  ".B....BB....B.",
  "B.....BB.....B",
  "B.....BB.....B",
  "B............B",
];
const EASEL_PALETTE = { K, W: "#fbf6e9", B: "#8b5a2b" };
// A pen: ink-dark body, silver grip, a sharp nib.
const BRUSH = [".K", ".K", "SK", "S.", "N.", "N."];
const BRUSH_PALETTE = { K: "#2a2a33", S: "#9a9aa8", N: "#1b1b1b" };

const BACKPACK = [
  ".KKKK.",
  "KBBBBK",
  "KBbbBK",
  "KBBBBK",
  "KBbbBK",
  "KBBBBK",
  ".KKKK.",
];
const BACKPACK_PALETTE = { K, B: "#d97a2b", b: "#a8541c" };

const CLOUD = [
  "...WWWW...",
  ".WWWWWWWW.",
  "WWWWWWWWWW",
  ".WWWWWWWW.",
];
// The moon takes the sun's place at night (when the bulb is out).
const MOON = [
  "..YYYY..",
  ".YYYYYY.",
  "YYYYYY..",
  "YYYYY...",
  "YYYYY...",
  "YYYYYY..",
  ".YYYYYY.",
  "..YYYY..",
];
const SUN = [
  "..YYYY..",
  ".YYYYYY.",
  "YYYYYYYY",
  "YYYYYYYY",
  "YYYYYYYY",
  "YYYYYYYY",
  ".YYYYYY.",
  "..YYYY..",
];

// Two snow-capped peaks, 40×12, built rather than typed out.
const MOUNTAINS = Array.from({ length: 12 }, (_, y) =>
  Array.from({ length: 40 }, (_, x) => {
    const peak = [
      [10, 11],
      [30, 8],
    ].find(([px, h]) => 12 - y <= h - Math.abs(x - px));
    if (!peak) return ".";
    const top = 12 - (peak[1] - Math.abs(x - peak[0]));
    return y - top < 2 && peak[1] - Math.abs(x - peak[0]) > 5 ? "W" : "M";
  }).join(""),
);

const at = (left, bottom, extra) => ({ position: "absolute", left, bottom, ...extra });

// The boy standing on the floor at x, facing right.
function Him({ x, pose = "idle", step = 0 }) {
  return (
    <div className="absolute inset-x-0 top-0" style={{ bottom: FLOOR - 6 }}>
      <Boy x={x} y={0} facing={1} pose={pose} step={step} placement="inline" />
    </div>
  );
}

function TvScene() {
  return (
    <div className="scene" style={{ background: "#f3e6c8" }}>
      <div className="scene-floor" style={{ background: "#c9a46a" }} />
      <div style={at(232, FLOOR, { width: 72, height: 14, background: "#8b5a2b" })} />
      <div style={at(240, FLOOR + 14)}>
        <PixelArt art={TV} palette={TV_PALETTE} pixel={4} />
        <div className="tv-screen" style={{ position: "absolute", left: 4, top: 16, width: 44, height: 24 }} />
      </div>
      <Him x={92} />
      <div style={at(64, FLOOR - 4, { zIndex: 6 })}>
        <PixelArt art={COUCH} palette={COUCH_PALETTE} pixel={4} />
      </div>
    </div>
  );
}

function GamesScene() {
  return (
    <div className="scene" style={{ background: "#dfe8f3" }}>
      <div className="scene-floor" style={{ background: "#7d8fb3" }} />
      <Him x={110} />
      <div className="in-hand" style={at(148, FLOOR + 24, { zIndex: 6 })}>
        <PixelArt art={PHONE_SMALL} palette={{ ...PHONE_PALETTE, S: "#7dff8a" }} pixel={3} />
      </div>
      <div style={at(236, FLOOR + 10)}>
        <PixelArt art={PHONE} palette={PHONE_PALETTE} pixel={4} />
        <div className="game-screen phone-screen" style={{ position: "absolute", left: 4, top: 8, width: 40, height: 64 }}>
          <span className="game-hero" />
          <span className="game-block" />
          <span className="phone-coin" />
        </div>
      </div>
    </div>
  );
}

// Cricket: a ball is bowled in from the right, he swings and sends it over the top, in front
// of his stumps.
function SportsScene() {
  return (
    <div className="scene" style={{ background: "linear-gradient(#9fd3f5, #e3f3fb)" }}>
      <div className="scene-floor pitch" style={{ background: "#5fae4e" }} />
      <div style={at(90, FLOOR - 6, { width: 260, height: 10, background: "#d8c08a" })} />
      <div className="stumps" style={at(118, FLOOR, { width: 16, height: 34 })} />
      <div className="bat" style={at(178, FLOOR + 2)}>
        <PixelArt art={BAT} palette={BAT_PALETTE} pixel={3} />
      </div>
      <Him x={140} />
      <span className="cricket-ball" style={at(182, FLOOR + 6, { zIndex: 7, width: 6, height: 6, background: "#c8202a" })} />
    </div>
  );
}

function TravelScene() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((s) => s + 1), 180);
    return () => clearInterval(id);
  }, []);
  const strip = (art, palette, pixel, n, cls, bottom) => (
    <div className={cls} style={at(0, bottom, { display: "flex", width: "max-content" })}>
      {Array.from({ length: n }, (_, i) => (
        <PixelArt key={i} art={art} palette={palette} pixel={pixel} />
      ))}
    </div>
  );
  return (
    <div className="scene sky-scene">
      <span className="stars" />
      <div className="sun" style={at(290, 120)}>
        <PixelArt art={SUN} palette={{ Y: "#ffd23f" }} pixel={4} />
      </div>
      <div className="moon" style={at(290, 120)}>
        <PixelArt art={MOON} palette={{ Y: "#f3eecb" }} pixel={4} />
      </div>
      <div className="clouds" style={at(0, 128, { display: "flex", gap: 90, width: "max-content" })}>
        {Array.from({ length: 6 }, (_, i) => (
          <PixelArt key={i} art={CLOUD} palette={{ W: "#ffffff" }} pixel={4} />
        ))}
      </div>
      {strip(MOUNTAINS, { M: "#6d8a6a", W: "#f6f0dc" }, 4, 6, "mountains", FLOOR)}
      <div className="scene-floor road" style={{ background: "#c9a46a" }} />
      <div style={at(142, FLOOR + 24, { zIndex: 4 })}>
        <PixelArt art={BACKPACK} palette={BACKPACK_PALETTE} pixel={4} />
      </div>
      <Him x={150} pose="walk" step={step} />
    </div>
  );
}

function PaintingScene() {
  return (
    <div className="scene" style={{ background: "#efe6f6" }}>
      <div className="scene-floor" style={{ background: "#b9a3c9" }} />
      <div style={at(224, FLOOR - 4)}>
        <PixelArt art={EASEL} palette={EASEL_PALETTE} pixel={4} />
        <div className="paint-art">
          <span className="pa-sky" />
          <span className="pa-hill" />
          <span className="pa-sun" />
          <span className="pa-flower" />
        </div>
      </div>
      <Him x={150} />
      <div className="brush" style={at(194, FLOOR + 22, { zIndex: 6 })}>
        <PixelArt art={BRUSH} palette={BRUSH_PALETTE} pixel={4} />
      </div>
    </div>
  );
}

function CookingScene() {
  return (
    <div className="scene" style={{ background: "#fbe9d6" }}>
      <div className="scene-floor" style={{ background: "#b9a07a" }} />
      <div style={at(200, FLOOR)}>
        <PixelArt art={STOVE} palette={STOVE_PALETTE} pixel={4} />
      </div>
      <div className="flames" style={at(214, FLOOR + 40, { width: 32, height: 8 })}>
        <span />
        <span />
        <span />
      </div>
      <div style={at(192, FLOOR + 46)}>
        <PixelArt art={PAN} palette={PAN_PALETTE} pixel={4} />
      </div>
      <span className="food" style={at(222, FLOOR + 54, { width: 8, height: 6, background: "#ffd23f" })} />
      <span className="steam" style={at(214, FLOOR + 62)} />
      <span className="steam s2" style={at(228, FLOOR + 62)} />
      <span className="steam s3" style={at(240, FLOOR + 62)} />
      <Him x={140} />
    </div>
  );
}

const SCENES = { anime: TvScene, sports: SportsScene, games: GamesScene, travel: TravelScene, painting: PaintingScene, cooking: CookingScene };

// Scales a fixed W×H scene to the width of its box, showing only the bottom VISIBLE of it: a
// wide, shorter rectangle (the sky above is cropped).
const VISIBLE = 0.76;
function Fit({ children }) {
  const box = useRef(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const el = box.current;
    const measure = () => setScale(el.clientWidth / W);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={box} className="scene-box" style={{ height: H * scale * VISIBLE }}>
      <div style={{ position: "absolute", top: -H * scale * (1 - VISIBLE), left: 0, width: W, height: H, transform: `scale(${scale})`, transformOrigin: "0 0" }}>
        {children}
      </div>
    </div>
  );
}

const REEL_MS = 2800;

// The hobby's photos: a big one that changes on its own, ◀ ▶ to step, click to see it full size.
function Reel({ photos, index, onStep }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onStep]);
  const p = photos[index];
  const n = (k) => String(k).padStart(2, "0");
  return (
    <div className="reel">
      <button type="button" className="reel-photo" onClick={() => setOpen(true)} aria-label="See this photo full size">
        <img key={p.thumb} src={p.thumb} alt="" />
      </button>
      <div className="level-nav">
        <button type="button" onClick={() => onStep(-1)} aria-label="Previous photo">
          ◀
        </button>
        <span>
          {n(index + 1)} / {n(photos.length)}
        </span>
        <button type="button" onClick={() => onStep(1)} aria-label="Next photo">
          ▶
        </button>
      </div>
      {open &&
        createPortal(
          <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo" onClick={() => setOpen(false)}>
            <img src={p.full} alt="" />
            <span>
              {n(index + 1)} / {n(photos.length)} · ◀ ▶ · Esc to close
            </span>
          </div>,
          document.body,
        )}
    </div>
  );
}

export default function Hobbies() {
  const [pick, setPick] = useState(0);
  const choose = (i) => {
    unlockAudio();
    sfx.select();
    setPick(i);
    setPhoto(0);
  };
  const hobby = hobbies[pick];
  const Scene = SCENES[hobby.key];

  // Which photo is showing: it moves on by itself, and ◀ ▶ step it (restarting the timer).
  const [photo, setPhoto] = useState(0);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (hobby.photos.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setPhoto((k) => (k + 1) % hobby.photos.length), REEL_MS);
    return () => clearInterval(id);
  }, [hobby, tick]);
  const step = (d) => {
    sfx.select();
    setPhoto((k) => (k + d + hobby.photos.length) % hobby.photos.length);
    setTick((t) => t + 1);
  };

  return (
    <>
      <h2 className="panel-title">THE REAL ME</h2>
      <p className="panel-hint hobbies-intro">{hobbiesIntro}</p>
      <div className="hobby-tabs" role="tablist" aria-label="Hobbies">
        {hobbies.map((h, i) => (
          <button
            key={h.key}
            type="button"
            role="tab"
            aria-selected={i === pick}
            className="hobby-tab"
            onClick={() => choose(i)}
          >
            {h.label}
          </button>
        ))}
      </div>
      <div key={hobby.key} role="tabpanel" className="hobby-detail">
        <Fit>
          <Scene />
        </Fit>
        <div className="hobby-body">
          <div>
            <p className="panel-lead">{hobby.title}</p>
            <p>{hobby.note}</p>
          </div>
          {hobby.photos.length > 0 && <Reel photos={hobby.photos} index={photo} onStep={step} />}
        </div>
      </div>
    </>
  );
}
