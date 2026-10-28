import { useCallback, useEffect, useRef, useState } from "react";
import Boy, { BOY_H, BOY_W } from "./components/Boy";
import CaseStudy from "./components/CaseStudy";
import Firecracker from "./components/Firecracker";
import Bulb from "./components/Bulb";
import FishingLine from "./components/FishingLine";
import { DigClue, DigFound } from "./components/DigGame";
import FishQuiz, { FishResult } from "./components/FishQuiz";
import { FISH_COLOURS } from "./components/fishArt";
import PathLayer from "./components/PathLayer";
import TopBar from "./components/TopBar";
import StopPanel from "./components/StopPanel";
import { createFx } from "./fx";
import FooterScene from "./components/FooterScene";
import { hasSeen, markSeen } from "./seen";
import { makeCenterPath } from "./centerPath";
import { FLOOR } from "./path";
import { setMusicMood, sfx, startMusic, unlockAudio } from "./sound";

const AIM_MS = 450; // how long he holds the loaded slingshot before letting go
const WALK_SPEED = 0.24; // px per ms
const TRAIL_SPEED = 0.3; // px per ms, walking the path to a clicked stop
// The path down the page. Set to false to hide it (no path drawn, no scrolling; he stays at
// its start). centerPath.js is the current winding path down the middle; path.js keeps the
// earlier edge-to-edge one (makePath), which can be swapped back in below.
const SHOW_PATH = true;
// The fireworks in the bottom-left corner: what kind, and where each stands (px from the left,
// px up from the bottom). `fuse` is where the arrow lands, as a fraction of the sprite's height.
const ROCKETS = [
  { type: "rocket", left: 24, bottom: 18, fuse: 0.55 },
  { type: "charki", left: 64, bottom: 14, fuse: 0.5 },
  { type: "tubri", left: 108, bottom: 14, fuse: 0.08 },
  { type: "rocket", left: 150, bottom: 18, fuse: 0.55, colors: { R: "#b36ad6", r: "#7a3f99" } },
];
const SHOW_MS = { charki: 3400, tubri: 3800 }; // how long the ground fireworks burn
const DRAW_MS = 750; // how long he holds the drawn bow while the arrow catches
// Somewhere high in the left half of the sky for a firework to burst; on wide screens, close
// beside him (he stands mid-screen) on the side away from the info box (`panelSide`), rather
// than out by the edge.
const WIDE = 1400;
const randomSky = (panelSide) => {
  const w = window.innerWidth;
  const away = panelSide === "left" ? 1 : -1;
  return {
    x: w > WIDE ? w / 2 + away * (90 + Math.random() * 280) : w * (0.16 + Math.random() * 0.2),
    y: window.innerHeight * (0.14 + Math.random() * 0.12),
  };
};
// The colour (an index into FISH_COLOURS) of the fish that bites next.
const randomFish = () => Math.floor(Math.random() * FISH_COLOURS.length);
const randomSpot = (count) => Math.floor(Math.random() * count); // where the chest is buried
// Treasure dig: where the fewest digs is kept.
const BEST_KEY = "portfolio-dig-best";
const readBest = () => {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
};
const saveBest = (n) => {
  try {
    localStorage.setItem(BEST_KEY, String(n));
  } catch {
    // no storage (private window): the best just isn't kept
  }
};
// Which side each section's info box opens on: alternating down the path, opposite the
// way the path swings at that stop.
const PANEL_SIDE = { START: "right", WORK: "right", EXPERIENCE: "right", SKILLS: "left", HOBBIES: "right", CONTACT: "left" };
const CLIMB_SPEED = 0.22; // px per ms
const STRIDE_MS = 180; // his legs swap on this beat, however fast he's moving
const LADDER_W = 36;

const centerOf = (el) => {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
};
const homeX = () => Math.round(Math.min(96, Math.max(16, window.innerWidth * 0.06)));
const snap = (v) => Math.round(v / 2) * 2;
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const buildPath = () => makeCenterPath({ width: window.innerWidth, height: window.innerHeight });
const lockScroll = (on) => (document.documentElement.style.overflow = on ? "hidden" : "");

export default function App() {
  // idle → aiming → flying → broken → (click the socket) → fixing → idle
  const [phase, setPhase] = useState("idle");
  const [lit, setLit] = useState(true);
  const [lights, setLights] = useState(""); // room overlay: "" | "on" (dark) | "lighting"
  const [boy, setBoy] = useState(() => ({ x: homeX(), y: 0, facing: 1, pose: "idle", step: 0, carrying: false }));
  const [ladder, setLadder] = useState(null); // { x, height } while he's up there
  const [path, setPath] = useState(buildPath);
  const [here, setHere] = useState(0); // the stop he's standing at, or -1 between stops
  const [cam, setCam] = useState(0); // how far the road has rolled up under him
  const [shown, setShown] = useState(0); // the stop whose info is on screen: the last one he reached
  const [caseStudy, setCaseStudy] = useState(null); // the project whose case study page is open
  // The fireworks in the corner while the lights are out: each is hidden while it's in the air.
  const [rocketsUp, setRocketsUp] = useState(() => ROCKETS.map(() => true));
  const [burning, setBurning] = useState(-1); // the rocket whose fuse is lit
  const [skitter, setSkitter] = useState(null); // { i, x, y }: a burning charki wandering about
  const [bow, setBow] = useState(null);
  const rocketRefs = useRef([]);
  const butterfliesRef = useRef(null);
  const fishRef = useRef(null);
  const [net, setNet] = useState(null);
  const [netColours, setNetColours] = useState(null);
  const netRef = useRef(null);
  const [rod, setRod] = useState(null);
  const rodRef = useRef(null);
  const [line, setLine] = useState(null); // the fishing line: { from, to, bobber | fish }
  // The fish game: `quiz` is up while he waits for your guess (quizAnswer settles it); `result`
  // shows how it went; `streak` counts right guesses in a row.
  const [quiz, setQuiz] = useState(false);
  const quizAnswer = useRef(null);
  const [result, setResult] = useState(null);
  const streak = useRef(0);
  const resultTimer = useRef(0);
  // The treasure dig: digRef drives the spots; `dig` is the round so far ({ treasure, digs,
  // clue }), `digResult` the end card, `digging` the shovel pose ("down" | "up").
  const digRef = useRef(null);
  const [dig, setDig] = useState(null);
  const [digResult, setDigResult] = useState(null);
  const [digging, setDigging] = useState(null);
  const digBusy = useRef(false);
  const showResult = (r) => {
    clearTimeout(resultTimer.current);
    setResult(r);
    resultTimer.current = setTimeout(() => setResult(null), 5000);
  };
  const clearResult = () => {
    clearTimeout(resultTimer.current);
    setResult(null);
  };
  const bowRef = useRef(null);

  const fxCanvas = useRef(null);
  const fx = useRef(null);
  const glassRef = useRef(null);
  const slingRef = useRef(null);
  const boyRef = useRef(null);
  const alive = useRef(true);
  const pathRef = useRef(path);
  const scripted = useRef(false); // true while a scene (the bulb repair) moves him, not the scroll
  const follow = useRef(() => {});

  useEffect(() => {
    alive.current = true;
    fx.current = createFx(fxCanvas.current);
    return () => {
      alive.current = false;
      fx.current.destroy();
    };
  }, []);

  // Bulb out = dark mode: CSS switches the UI to its night colours off this attribute,
  // and the music slips into its slower night tune.
  useEffect(() => {
    document.documentElement.dataset.theme = lit ? "light" : "dark";
    setMusicMood(lit ? "day" : "night");
  }, [lit]);

  // Background music starts on the first click or key press (browsers block sound before one).
  useEffect(() => {
    const start = () => {
      unlockAudio();
      startMusic();
    };
    window.addEventListener("pointerdown", start, { once: true });
    window.addEventListener("keydown", start, { once: true });
    return () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
    };
  }, []);

  // The floor height lives here; CSS reads it as --floor.
  useEffect(() => {
    document.documentElement.style.setProperty("--floor", `${FLOOR * 100}vh`);
  }, []);

  // Scrolling walks him along the road: the scroll sets how far along it he is, his x comes
  // from the road there, and the camera rolls the road so his feet stay on the floor line.
  useEffect(() => {
    let lastX = null;
    let lastCam = 0;
    let lastStep = 0;
    let idle = 0;
    follow.current = () => {
      if (scripted.current) return;
      const p = pathRef.current;
      const scroll = window.scrollY;
      const len = p.lenAt(scroll);
      const at = p.pointAt(len);
      const x = snap(at.x - BOY_W / 2);
      const camY = at.y - p.foot;
      const walking = lastX !== null && (x !== lastX || camY !== lastCam);
      const step = walking ? Math.floor(performance.now() / STRIDE_MS) : lastStep;
      if (walking && step !== lastStep && step % 2 === 0) sfx.step("walk");
      const dx = lastX === null ? 0 : x - lastX;
      lastX = x;
      lastCam = camY;
      lastStep = step;
      setCam(camY);
      setBoy((b) => ({
        ...b,
        x,
        y: 0,
        step,
        pose: walking ? "walk" : b.pose,
        facing: dx > 0 ? 1 : dx < 0 ? -1 : b.facing,
      }));
      // Stand still once the scrolling stops.
      clearTimeout(idle);
      idle = setTimeout(() => setBoy((b) => (b.pose === "walk" ? { ...b, pose: "idle", step: 0 } : b)), 140);
      const stopHere = p.stops.findIndex((stop) => Math.abs(stop.len - len) < 6);
      setHere(stopHere);
      // The info box shows the section of the stretch he's on: the last stop at or above him.
      // Walking down, it changes as he reaches the next stop; walking back up, it changes as
      // soon as he leaves one.
      let section = 0;
      p.stops.forEach((stop, k) => {
        if (stop.len <= len + 6) section = k;
      });
      setShown(section);
    };
    const onScroll = () => follow.current();
    const onResize = () => {
      pathRef.current = buildPath();
      setPath(pathRef.current);
      follow.current();
    };
    follow.current();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(idle);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Hold the aim for a beat, then fire the pebble from the top of the slingshot.
  useEffect(() => {
    if (phase !== "aiming") return;
    const id = setTimeout(() => {
      const sling = slingRef.current.getBoundingClientRect();
      const from = { x: sling.left + sling.width / 2, y: sling.top + 6 };
      setPhase("flying");
      sfx.shoot();
      // Aim a little below the box's centre (its box includes the socket).
      fx.current.firePebble(
        from,
        () => {
          const c = centerOf(glassRef.current);
          return { x: c.x, y: c.y + 4 };
        },
        (at) => {
          fx.current.shatter(at);
          sfx.shatter();
          setTimeout(sfx.lightsOut, 250);
          setLit(false);
          setLights("on");
          setPhase("broken");
        },
      );
    }, AIM_MS);
    return () => clearTimeout(id);
  }, [phase]);

  /* ---------- scripted moves ---------- */
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Moves him along one axis at a steady speed, swapping leg frames as he goes.
  const move = (axis, from, to, speed, pose) =>
    new Promise((resolve) => {
      const ms = Math.max(1, Math.abs(to - from) / speed); // (no distance: done next frame)
      const t0 = performance.now();
      let lastStep = 0;
      const frame = (now) => {
        if (!alive.current) return resolve();
        const t = Math.min(1, (now - t0) / ms);
        const v = snap(from + (to - from) * t);
        const step = Math.floor((now - t0) / STRIDE_MS);
        // A footstep (or rung) sound on every other leg frame.
        if (step !== lastStep && step % 2 === 0) sfx.step(pose);
        lastStep = step;
        setBoy((b) => ({ ...b, [axis]: v, pose, step }));
        if (t < 1) requestAnimationFrame(frame);
        else resolve();
      };
      requestAnimationFrame(frame);
    });

  // Scrolls the page so he walks the trail to `target` (a scroll position) at a steady pace.
  // Scrolling, swiping or a key press takes over and stops the walk.
  const walkAlong = (target) =>
    new Promise((resolve) => {
      const p = pathRef.current;
      const fromLen = p.lenAt(window.scrollY);
      const toLen = p.lenAt(target);
      const dist = Math.abs(toLen - fromLen);
      if (dist < 2 || reducedMotion()) {
        window.scrollTo(0, target);
        return resolve();
      }
      let cancelled = false;
      const cancel = () => (cancelled = true);
      const events = ["wheel", "touchstart", "keydown"];
      events.forEach((e) => window.addEventListener(e, cancel, { passive: true }));
      const done = () => {
        events.forEach((e) => window.removeEventListener(e, cancel));
        resolve();
      };
      const ms = dist / TRAIL_SPEED;
      const t0 = performance.now();
      const frame = (now) => {
        if (cancelled || !alive.current) return done();
        const t = Math.min(1, (now - t0) / ms);
        window.scrollTo(0, p.scrollAtLen(fromLen + (toLen - fromLen) * t));
        if (t < 1) requestAnimationFrame(frame);
        else done();
      };
      requestAnimationFrame(frame);
    });

  const walkTo = (from, to) => {
    setBoy((b) => ({ ...b, facing: to < from ? -1 : 1 }));
    return move("x", from, to, WALK_SPEED, "walk");
  };

  // Gets him from `from` to `to` by the shorter way: straight across, or off one edge of
  // the screen and back in from the other (the screen wraps around, like an old game).
  const travel = async (from, to) => {
    const offLeft = -BOY_W - 16;
    const offRight = window.innerWidth + 16;
    const direct = Math.abs(to - from);
    const viaLeft = from - offLeft + (offRight - to); // exit left, enter right
    const viaRight = offRight - from + (to - offLeft); // exit right, enter left
    if (direct <= Math.min(viaLeft, viaRight)) return walkTo(from, to);
    const [exit, enter] = viaLeft < viaRight ? [offLeft, offRight] : [offRight, offLeft];
    await walkTo(from, exit);
    await wait(400);
    setBoy((b) => ({ ...b, x: enter }));
    await walkTo(enter, to);
  };

  // Lights out: from where he stands, he draws a bow, sets the arrow alight and shoots it at the
  // rocket's fuse; it fizzes, flies up and bursts. Another can go as soon as the arrow lands.
  const shootFirework = async (i) => {
    const vh = window.innerHeight;
    const kind = ROCKETS[i];
    const rocket = rocketRefs.current[i].getBoundingClientRect();
    const spriteH = rocket.height - 16; // the button has 8px padding round the sprite
    const fuse = { x: rocket.left + rocket.width / 2, y: rocket.top + 8 + spriteH * kind.fuse };
    const nose = { x: fuse.x, y: rocket.top + 14 };
    const sky = randomSky(PANEL_SIDE[pathRef.current.stops[shown].label]);
    const respawn = (ms) => setTimeout(() => setRocketsUp((up) => up.map((v, j) => (j === i ? true : v))), ms);
    const hide = () => setRocketsUp((up) => up.map((v, j) => (j === i ? false : v)));
    // Charki and tubri burn where they stand, then are spent.
    const burnOnGround = () => {
      const ms = SHOW_MS[kind.type];
      if (kind.type === "charki") {
        // It skitters and hops about the ground while it spins; the sparks follow it.
        const t0 = performance.now();
        const wander = (now) => {
          const t = (now - t0) / 1000;
          if (now - t0 >= ms || !alive.current) return setSkitter(null);
          // Loops about the open ground just above the row, hopping as it goes.
          const x = Math.round(30 * Math.sin(t * 2.3) + 10 * Math.sin(t * 6.1));
          const y = -Math.round(34 * (1 - Math.cos(t * 1.8)) + Math.abs(Math.sin(t * 9)) * 5);
          setSkitter({ i, x, y });
          requestAnimationFrame(wander);
        };
        requestAnimationFrame(wander);
        fx.current.spinner(() => {
          const el = rocketRefs.current[i];
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
        }, ms);
        sfx.spin(ms / 1000);
      } else {
        fx.current.fountain({ x: fuse.x, y: rocket.top + 10 }, ms);
        sfx.spray(ms / 1000);
      }
      setTimeout(() => {
        hide();
        setBurning((b) => (b === i ? -1 : b));
        respawn(2500);
      }, ms);
    };
    const goUp = () => {
      setRocketsUp((up) => up.map((v, j) => (j === i ? false : v)));
      setBurning(-1);
      sfx.whistle();
      fx.current.launch(nose, sky, (at) => {
        fx.current.firework(at);
        sfx.boom();
      });
      // A fresh one stands back up a little after the show.
      respawn(3200);
    };

    if (reducedMotion()) {
      if (kind.type === "rocket") {
        fx.current.firework(sky);
        sfx.boom();
      }
      return setPhase("broken");
    }

    // Hold still (no scrolling) while he aims.
    scripted.current = true;
    lockScroll(true);
    const centre = boy.x + BOY_W / 2;
    setBoy((b) => ({ ...b, facing: fuse.x < centre ? -1 : 1, pose: "idle", step: 0 }));
    setBow("drawn");
    sfx.stretch();
    await wait(120);
    sfx.ignite();
    const tipFlame = () => {
      const r = bowRef.current?.getBoundingClientRect();
      if (!r) return null;
      const facingLeft = fuse.x < centre;
      return { x: facingLeft ? r.left + 2 : r.right - 2, y: r.top + r.height / 2 };
    };
    const crackle = setInterval(() => {
      const tip = tipFlame();
      if (tip) fx.current.fizz(tip);
    }, 70);
    await wait(DRAW_MS);
    clearInterval(crackle);

    // Loose: the flaming arrow arcs down onto the fuse.
    const from = tipFlame() ?? { x: centre, y: vh * (1 - FLOOR) - 40 };
    setBow("loose");
    sfx.twang();
    await new Promise((resolve) => fx.current.fireArrow(from, fuse, resolve));
    setBurning(i);
    setBow(null);
    lockScroll(false);
    scripted.current = false;
    follow.current();
    setPhase("broken"); // free to light the next one while this one goes
    if (kind.type !== "rocket") return burnOnGround();
    sfx.fuse(0.6);
    const fizz = setInterval(() => fx.current.fizz(fuse), 60);
    await wait(600);
    clearInterval(fizz);
    goUp();
  };

  // A butterfly (or firefly): it lands on a bush, he steps off the path and walks over with his
  // net, swings, catches it; it vanishes from the net and he walks back to where he was.
  // bugs: their API (land, rect, catch, colours); after: the phase to go back to ("idle" by
  // day, "broken" at night).
  const catchButterfly = async (bugs, i, after) => {
    if (!bugs?.land(i)) return setPhase(after);
    scripted.current = true;
    lockScroll(true);
    const vh = window.innerHeight;
    const rest = vh * (1 - FLOOR) - 6; // where his feet are on the path
    setNet("up");
    setNetColours(bugs.colours(i));
    await wait(700); // let it settle on the bush
    const at = bugs.rect(i);
    // Stand so the swept-out hoop (10–21 art px right, row 11 down) lands on it.
    const startX = boy.x;
    const standX = Math.round(at.x - 16 * 4 - 2);
    const standY = Math.round(at.y - 11 * 4 + BOY_H - rest);
    const pace = WALK_SPEED * 1.4;
    setBoy((b) => ({ ...b, facing: standX < startX ? -1 : standX > startX ? 1 : b.facing }));
    await move("y", boy.y, Math.min(boy.y, standY), pace, "walk");
    await move("x", startX, standX, pace, "walk");
    await move("y", Math.min(boy.y, standY), standY, pace, "walk");
    setBoy((b) => ({ ...b, facing: 1, pose: "idle", step: 0 }));
    await wait(200);

    // Swish... got it.
    setNet("swing");
    sfx.swish();
    await wait(130);
    bugs.catch(i);
    setNet("full");
    sfx.caught();
    fx.current.sparkle(at);
    await wait(1100);

    // It vanishes from the net with a little sparkle.
    const hoop = netRef.current?.getBoundingClientRect();
    setNet("swing");
    if (hoop) fx.current.sparkle({ x: hoop.right - 12, y: hoop.top + hoop.height / 2 });
    await wait(400);
    setNet("up");

    setNet(null);
    stayOut(startX, after);
  };

  // Is he on the stretch of path between these two stops? He can only reach the butterflies
  // from HOBBIES–CONTACT, and the pond from EXPERIENCE–SKILLS.
  const onStretch = (from, to) => {
    const p = pathRef.current;
    const a = p.stops.find((s) => s.label === from);
    const b = p.stops.find((s) => s.label === to);
    const len = p.lenAt(window.scrollY);
    return a && b && len >= a.len - 6 && len <= b.len + 6;
  };

  const onButterflyClick = (i) => {
    unlockAudio();
    if (!["idle", "broken", "away"].includes(phase) || !onStretch("HOBBIES", "CONTACT")) return;
    setPhase("netting");
    catchButterfly(butterfliesRef.current, i, away?.after ?? phase);
  };

  // Fishing, as a guessing game: he walks to the pond's bank (it's left of the path) and casts.
  // While the float bobs you guess the colour of the fish on the line (four to pick from). Then
  // he hauls it up: right guess, confetti and a little dance; wrong, it slips back in. Either
  // way he stays by the pond for another go until BACK TO PATH. after: the phase to go back to.
  const goFishing = async (after) => {
    const pond = fishRef.current;
    const box = pond?.rect();
    if (!box) return setPhase(after);
    scripted.current = true;
    lockScroll(true);
    clearResult();
    const rest = window.innerHeight * (1 - FLOOR) - 6; // where his feet are on the path
    // Stand on the bank just right of the water, feet level with the middle of the pond.
    const startX = boy.x;
    const standX = Math.round(box.right + 2);
    const standY = Math.round(box.top + box.height * 0.55 - rest);
    const pace = WALK_SPEED * 1.4;
    setBoy((b) => ({ ...b, facing: standX < startX ? -1 : standX > startX ? 1 : b.facing }));
    await move("y", boy.y, Math.min(boy.y, standY), pace, "walk");
    await move("x", startX, standX, pace, "walk");
    await move("y", Math.min(boy.y, standY), standY, pace, "walk");
    setBoy((b) => ({ ...b, facing: -1, pose: "idle", step: 0 }));
    await wait(200);

    // Cast: the bobber flies out onto the water.
    setRod("cast");
    sfx.swish();
    await wait(30);
    const tipOf = () => {
      const r = rodRef.current?.getBoundingClientRect();
      return r ? { x: r.left, y: r.top } : { x: box.right, y: box.top };
    };
    const tip = tipOf();
    const spot = { x: Math.round(box.left + box.width * 0.42), y: Math.round(box.top + box.height * 0.5) };
    setLine({ from: tip, to: tip, bobber: "fly" });
    await wait(20);
    setLine({ from: tip, to: spot, bobber: "float" });
    await wait(900);

    // The question: which colour is the fish that's about to bite?
    const answer = randomFish();
    setQuiz(true);
    const pick = await new Promise((resolve) => (quizAnswer.current = resolve));
    setQuiz(false);
    if (pick === null) {
      // reeled in without a guess
      setLine(null);
      setRod("pull");
      await wait(400);
      setRod(null);
      return stayOut(startX, after);
    }

    // A bite!
    setLine({ from: tip, to: spot, bobber: "bite" });
    sfx.pop();
    await wait(600);

    // Haul it up: the fish swings out and dangles from the raised rod, in its real colour.
    setRod("pull");
    pond.take(answer);
    fx.current.sparkle(spot);
    await wait(30);
    const top = tipOf();
    const hang = { x: top.x, y: top.y + 34 };
    setLine({ from: top, to: hang, fish: pond.colours(answer) });
    const right = pick === answer;
    await wait(900);

    if (right) {
      streak.current += 1;
      sfx.win();
      showResult({ correct: true, answer, streak: streak.current });
      fx.current.sparkle(hang);
      setLine(null);
      setRod(null);
      const head = boyRef.current?.getBoundingClientRect();
      if (head) fx.current.confetti({ x: head.left + head.width / 2, y: head.top });
      // a little dance: a hop and a turn on every beat
      for (let k = 1; k <= 9; k++) {
        setBoy((b) => ({ ...b, facing: k % 2 ? 1 : -1, pose: "walk", step: k, y: standY - (k % 2 ? 10 : 0) }));
        await wait(170);
      }
      setBoy((b) => ({ ...b, facing: 1, pose: "idle", step: 0, y: standY }));
      await wait(500);
    } else {
      streak.current = 0;
      sfx.lose();
      showResult({ correct: false, answer, streak: 0 });
      // it wriggles free and drops back in
      setLine({ from: top, to: { x: hang.x - 10, y: spot.y }, fish: pond.colours(answer) });
      await wait(500);
      fx.current.sparkle({ x: hang.x - 10, y: spot.y });
      setLine(null);
      await wait(500);
      setRod(null);
    }
    stayOut(startX, after);
  };

  // Treasure dig: a chest is buried under one of the marked spots. Click a spot: he walks over,
  // digs, and the hole says cold, warm or hot by how near the chest is. Find it in as few digs
  // as you can; then confetti, a dance, and he stays out (play again, or BACK TO PATH).
  const digAt = async (i, after) => {
    const field = digRef.current;
    const at = field?.rect(i);
    if (!field || !at) return setPhase(after);
    scripted.current = true;
    lockScroll(true);
    digBusy.current = true;
    setDigResult(null);
    // A new round starts with the first dig: bury the chest somewhere.
    let round = dig;
    if (!round) {
      round = { treasure: randomSpot(field.count), digs: 0, clue: null };
      field.reset();
    }
    const rest = window.innerHeight * (1 - FLOOR) - 6; // where his feet are on the path
    // Stand just left of the spot, feet level with it, shovel blade over the spot.
    const startX = boy.x;
    const standX = Math.round(at.x - 58);
    const standY = Math.round(at.y + 10 - rest);
    const pace = WALK_SPEED * 1.4;
    setBoy((b) => ({ ...b, facing: standX < startX ? -1 : standX > startX ? 1 : b.facing }));
    await move("y", boy.y, Math.min(boy.y, standY), pace, "walk");
    await move("x", startX, standX, pace, "walk");
    await move("y", Math.min(boy.y, standY), standY, pace, "walk");
    setBoy((b) => ({ ...b, facing: 1, pose: "idle", step: 0 }));
    await wait(150);

    // Dig: down, up with a scoop, a few times.
    for (let k = 0; k < 3; k++) {
      setDigging("up");
      await wait(220);
      setDigging("down");
      sfx.dig();
      fx.current.puff({ x: at.x, y: at.y + 8 }, 24);
      await wait(260);
    }
    setDigging(null);

    // The clue: how far is this spot from the chest? (in spots, across the grid)
    const cols = field.cols;
    const dist = Math.hypot((i % cols) - (round.treasure % cols), Math.floor(i / cols) - Math.floor(round.treasure / cols));
    const digs = round.digs + 1;
    if (i === round.treasure) {
      field.set(i, "chest");
      sfx.win();
      fx.current.sparkle({ x: at.x, y: at.y });
      const head = boyRef.current?.getBoundingClientRect();
      if (head) fx.current.confetti({ x: head.left + head.width / 2, y: head.top });
      const best = readBest();
      const isBest = !best || digs < best;
      if (isBest) saveBest(digs);
      setDig(null);
      setDigResult({ digs, best: isBest ? digs : best, isBest });
      for (let k = 1; k <= 9; k++) {
        setBoy((b) => ({ ...b, facing: k % 2 ? 1 : -1, pose: "walk", step: k, y: standY - (k % 2 ? 10 : 0) }));
        await wait(170);
      }
      setBoy((b) => ({ ...b, facing: -1, pose: "idle", step: 0, y: standY }));
    } else {
      const level = dist <= 1 ? "hot" : dist <= 2 ? "warm" : "cold";
      field.set(i, level);
      sfx.hint(level);
      setDig({ ...round, digs, clue: level });
      await wait(300);
    }
    digBusy.current = false;
    stayOut(startX, after);
  };

  // RESTART: fill the holes back in and bury the chest afresh; he stays where he is.
  const restartDig = () => {
    if (digBusy.current) return;
    unlockAudio();
    sfx.select();
    digRef.current?.reset();
    setDig(null);
    setDigResult(null);
  };

  const onDigClick = (i) => {
    unlockAudio();
    if (digBusy.current || !["idle", "broken", "away"].includes(phase) || !onStretch("SKILLS", "HOBBIES")) return;
    if (!digRef.current?.isNone(i)) return;
    setPhase("digging");
    digAt(i, away?.after ?? phase);
  };

  // After a catch he stays out there (to catch another, if you like) until BACK TO PATH walks
  // him back. away: where on the path he left from (x) and the phase to go back to.
  const [away, setAway] = useState(null);
  const stayOut = (fromX, after) => {
    setBoy((b) => ({ ...b, pose: "idle", step: 0 }));
    setAway((a) => a ?? { x: fromX, after });
    setPhase("away");
  };
  const backToPath = async () => {
    if (phase !== "away" || !away) return;
    unlockAudio();
    sfx.select();
    setPhase("returning");
    clearResult();
    setDigResult(null);
    setDig((d) => d && { ...d, clue: null });
    const pace = WALK_SPEED * 1.4;
    await move("y", boy.y, 0, pace, "walk");
    setBoy((b) => ({ ...b, facing: away.x < boy.x ? -1 : 1 }));
    await move("x", boy.x, away.x, pace, "walk");
    setBoy((b) => ({ ...b, facing: 1, pose: "idle", step: 0 }));
    lockScroll(false);
    scripted.current = false;
    follow.current();
    setAway(null);
    setPhase(away.after);
  };

  const onFishClick = () => {
    unlockAudio();
    if (!["idle", "broken", "away"].includes(phase) || !onStretch("EXPERIENCE", "SKILLS")) return;
    setPhase("fishing");
    goFishing(away?.after ?? phase);
  };

  const onRocketClick = (i) => {
    unlockAudio();
    if (phase !== "broken" || burning === i) return;
    setPhase("firework");
    shootFirework(i);
  };

  const fixBulb = async () => {
    // The bulb, the ladder and he are all pinned to the screen, so he can fix it from
    // wherever he is on the trail; the scene takes over from the scroll until he's back.
    scripted.current = true;
    lockScroll(true);
    const p = pathRef.current;
    const start = snap(p.pointAt(p.lenAt(window.scrollY)).x - BOY_W / 2);

    // 1. New bulb in hand, head from his spot to just under the broken one.
    const glass = glassRef.current.getBoundingClientRect();
    const underX = snap(glass.left + glass.width / 2 - BOY_W / 2);
    setBoy((b) => ({ ...b, carrying: true }));
    await travel(start, underX);

    // 2. A ladder pops in from the floor up to the bulb.
    const floorTop = boyRef.current.getBoundingClientRect().top; // his head, standing
    const floorY = floorTop + BOY_H;
    const ladderTop = glass.bottom + 6;
    setLadder({ x: snap(glass.left + glass.width / 2 - LADDER_W / 2), height: snap(floorY + 6 - ladderTop) });
    fx.current.puff({ x: glass.left + glass.width / 2, y: floorY - 10 }, 50);
    sfx.pop();
    setBoy((b) => ({ ...b, pose: "idle" }));
    await wait(350);

    // 3. Climb until his head is just under the bulb, the new one held up beside it.
    const climbTo = snap(glass.bottom + 2 - floorTop);
    await move("y", 0, climbTo, CLIMB_SPEED, "climb");
    await wait(300);

    // 4. New bulb in, sparkle, lights flicker back on.
    setBoy((b) => ({ ...b, carrying: false, pose: "idle" }));
    setLit(true);
    setLights("lighting");
    fx.current.sparkle(centerOf(glassRef.current));
    sfx.fixed();
    await wait(700);

    // 5. Down the ladder, which pops away again.
    await move("y", climbTo, 0, CLIMB_SPEED, "climb");
    setBoy((b) => ({ ...b, pose: "idle" }));
    setLadder(null);
    fx.current.puff({ x: glass.left + glass.width / 2, y: floorY - 10 }, 50);
    sfx.pop();
    setLights("");
    await wait(300);

    // 6. Back to where he was standing, then face the room again.
    await travel(underX, start);
    setBoy((b) => ({ ...b, facing: 1, pose: "idle", step: 0 }));
    lockScroll(false);
    scripted.current = false;
    follow.current();
    setPhase("idle");
  };

  const onStop = (i) => {
    unlockAudio();
    if (phase !== "idle" && phase !== "broken") return;
    walkAlong(pathRef.current.stops[i].scroll);
  };

  // The case study page sits over the map; the map stays put (no scrolling) underneath.
  const openCase = (project) => {
    lockScroll(true);
    setCaseStudy(project);
  };
  const closeCase = useCallback(() => {
    sfx.select();
    lockScroll(false);
    setCaseStudy(null);
  }, []);

  // The case study page has its own bulb; it drives the same lit/dark state as the map's.
  const breakFromCase = useCallback(() => {
    setLit(false);
    setLights("on");
    setPhase("broken");
  }, []);
  const fixFromCase = useCallback(() => {
    setLit(true);
    setLights("lighting");
    setPhase("idle");
    setTimeout(() => setLights(""), 700);
  }, []);

  // First-visit hints (see seen.js): each goes away for good once that thing has been tapped.
  const [seen, setSeen] = useState(() => ({ shoot: hasSeen("shoot"), fix: hasSeen("fix") }));
  const tried = (name) => {
    markSeen(name);
    setSeen((s) => ({ ...s, [name]: true }));
  };

  const onBulbClick = () => {
    unlockAudio();
    if (phase === "broken") {
      tried("fix");
      if (reducedMotion()) {
        setLit(true);
        setLights("");
        return setPhase("idle");
      }
      setPhase("fixing");
      fixBulb();
      return;
    }
    if (phase !== "idle") return;
    tried("shoot");
    if (reducedMotion()) {
      setLit(false);
      setLights("on");
      return setPhase("broken");
    }
    sfx.stretch();
    setPhase("aiming");
  };

  const sling = phase === "aiming" ? "loaded" : phase === "flying" ? "empty" : null;
  const showPanel = SHOW_PATH && phase !== "fixing";

  return (
    <main className="relative overflow-hidden" style={{ height: SHOW_PATH ? path.pageHeight : "100dvh" }}>
      {/* The room goes dark once the bulb breaks, and flickers back when it's fixed. It sits
          behind everything else, which switches to night colours instead of being dimmed. */}
      <div aria-hidden className={`room-dark ${lights}`} />
      {SHOW_PATH && <FooterScene />}
      {SHOW_PATH && (
        <PathLayer
          path={path}
          cam={cam}
          current={here}
          onStop={onStop}
          colors={lit ? "light" : "night"}
          onCatchButterfly={onButterflyClick}
          canCatch={shown === 4 || here === 5}
          butterfliesRef={butterfliesRef}
          onCatchFish={onFishClick}
          canFish={shown === 2 || here === 3}
          fishRef={fishRef}
          onDig={onDigClick}
          digRef={digRef}
          canDig={shown === 3}
          canRestartDig={shown === 3 && phase !== "digging" && phase !== "returning"}
          onRestartDig={restartDig}
        />
      )}
      {ladder && (
        <div
          aria-hidden
          className="ladder pointer-events-none fixed bottom-(--floor) z-[4]"
          style={{ left: ladder.x, width: LADDER_W, height: ladder.height }}
        />
      )}
      <Boy
        {...boy}
        sling={sling}
        slingRef={slingRef}
        bow={bow}
        bowRef={bowRef}
        net={net}
        netColours={netColours}
        netRef={netRef}
        rod={rod}
        rodRef={rodRef}
        dig={digging}
        boyRef={boyRef}
      />
      {line && <FishingLine {...line} />}
      {quiz && <FishQuiz onPick={(i) => quizAnswer.current?.(i)} onSkip={() => quizAnswer.current?.(null)} />}
      {!quiz && result && phase !== "returning" && <FishResult {...result} />}
      {phase !== "returning" && dig?.clue && <DigClue level={dig.clue} digs={dig.digs} />}
      {phase !== "returning" && digResult && <DigFound {...digResult} />}
      {phase === "away" && (
        // just under his feet
        <button
          type="button"
          className="back-to-path fixed z-[26]"
          style={{ left: boy.x + BOY_W / 2, top: window.innerHeight * (1 - FLOOR) + boy.y + 10 }}
          onClick={backToPath}
        >
          ▲ BACK TO PATH
        </button>
      )}
      <Bulb
        broken={!lit}
        onClick={onBulbClick}
        glassRef={glassRef}
        hint={lit ? (!seen.shoot && phase === "idle" ? "Tap here" : null) : !seen.fix && phase === "broken" ? "Tap to fix it" : null}
      />
      {!lit &&
        phase !== "fixing" &&
        ROCKETS.map(
          (r, i) =>
            rocketsUp[i] && (
              <Firecracker
                key={i}
                type={r.type}
                colors={r.colors}
                left={r.left}
                offset={skitter?.i === i ? skitter : undefined}
                bottom={r.bottom}
                onClick={() => onRocketClick(i)}
                rocketRef={(el) => (rocketRefs.current[i] = el)}
                burning={burning === i}
              />
            ),
        )}
      {/* Keyed by stop so it pops in fresh each time he arrives somewhere new. */}
      {showPanel && (
        <StopPanel
          key={shown}
          label={path.stops[shown].label}
          side={PANEL_SIDE[path.stops[shown].label]}
          onOpenCase={openCase}
        />
      )}
      <TopBar onContact={SHOW_PATH ? () => onStop(path.stops.findIndex((s) => s.label === "CONTACT")) : undefined} />
      {caseStudy && (
        <CaseStudy project={caseStudy} lit={lit} onClose={closeCase} onBreak={breakFromCase} onFix={fixFromCase} />
      )}
      <canvas ref={fxCanvas} aria-hidden className="pointer-events-none fixed inset-0 z-30" />
    </main>
  );
}
