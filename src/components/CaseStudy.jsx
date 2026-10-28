import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createFx } from "../fx";
import { sfx, unlockAudio } from "../sound";
import Boy, { BOY_H, BOY_W } from "./Boy";
import Arrow from "./Arrow";
import Bulb from "./Bulb";
import { hasSeen, markSeen } from "../seen";
import Plane, { PLANE_SEAT, PLANE_SEAT_UP, PLANE_W } from "./Plane";
import SoundToggle from "./SoundToggle";

// Slide-style case study over the map: a cover/overview slide, then one slide per section.
// The boy walks a track along the bottom to the current slide's post, and the bulb hangs at
// the top in whatever state the map's bulb is in. Click it and he shoots it out with his
// slingshot (the whole site goes dark); click the broken one and a plane flies him up
// to swap in a new one.
// ← → or ↑ ↓ move between slides, Esc goes back to the map, swiping works on touch screens.

const WALK_SPEED = 0.5; // px per ms along the track
const MAX_WALK_MS = 1100; // long jumps still arrive quickly
const STRIDE_MS = 180;
const AIM_MS = 450;
const BOY_SCALE = 0.8; // he is drawn a little smaller here than on the map
const PLANE_SPEED = 0.85; // px per ms
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const centerOf = (el) => {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
};

// Turns **bold** spans in the copy into <strong>.
function Rich({ text }) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : part,
  );
}

const label = (h) => h.replace("->", "→");

function Block({ block }) {
  if (block.type === "p")
    return (
      <p>
        <Rich text={block.text} />
      </p>
    );
  if (block.type === "ul")
    return (
      <ul className="cs-list">
        {block.items.map((item) => (
          <li key={item}>
            <Rich text={item} />
          </li>
        ))}
      </ul>
    );
  if (block.type === "quote")
    return (
      <blockquote className="cs-quote">
        <Rich text={block.text} />
      </blockquote>
    );
  if (block.type === "image")
    return (
      <figure className="cs-figure">
        <img src={block.src} alt={block.alt} />
        {block.caption && (
          <figcaption>
            <Rich text={block.caption} />
          </figcaption>
        )}
      </figure>
    );
  return null;
}

function CoverSlide({ project, study }) {
  return (
    <div className="cs-slide-grid">
      <div className="cs-col">
        <ul className="cs-tags">
          {study.tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <h1 id="cs-title">{study.title}</h1>
        <p className="cs-meta">
          <span>
            <b>DURATION</b> {study.duration}
          </span>
        </p>
        <figure className="cs-figure cs-cover">
          <img src={project.cover} alt={project.coverAlt} />
        </figure>
      </div>
      <section className="cs-col cs-overview" aria-labelledby="cs-overview">
        <p id="cs-overview" className="cs-kicker">
          1-MINUTE OVERVIEW
        </p>
        <dl>
          {study.overview.map((o) => (
            <div key={o.label}>
              <dt>{o.label}</dt>
              <dd>
                {o.href ? (
                  <a href={o.href} target="_blank" rel="noreferrer">
                    {o.text}
                  </a>
                ) : (
                  o.text
                )}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}

function SectionSlide({ section, index }) {
  const images = section.blocks.filter((b) => b.type === "image");
  const text = section.blocks.filter((b) => b.type !== "image");
  return (
    <div className={images.length ? "cs-slide-grid" : "cs-slide-single"}>
      <div className="cs-col cs-text">
        <p className="cs-kicker">LEVEL {String(index).padStart(2, "0")}</p>
        <h2>{label(section.heading)}</h2>
        {text.map((b, i) => (
          <Block key={i} block={b} />
        ))}
      </div>
      {images.length > 0 && (
        <div className="cs-col cs-images">
          {images.map((b, i) => (
            <Block key={i} block={b} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CaseStudy({ project, lit, onClose, onBreak, onFix }) {
  const study = project.caseStudy;
  const labels = ["Overview", ...study.sections.map((s) => label(s.heading))];
  const total = labels.length;
  const [slide, setSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const backRef = useRef(null);
  const trackRef = useRef(null);
  const tabsRef = useRef(null);
  const [trackW, setTrackW] = useState(0);
  const [boy, setBoy] = useState({ x: 0, facing: 1, pose: "idle", step: 0 });
  const boyX = useRef(0);
  const walk = useRef(0);
  const fxCanvas = useRef(null);
  const fx = useRef(null);
  const glassRef = useRef(null);
  const slingRef = useRef(null);
  const [sling, setSling] = useState(null);
  const shooting = useRef(false); // busy: shooting or repairing; slides stay put meanwhile
  // The repair scene: he leaves the track and is pinned to the screen until he's back.
  const [scene, setScene] = useState(null); // { x, y, bottom, facing, pose, step, carrying }
  const [plane, setPlane] = useState(null); // { x, up, bottom, dir }
  const sceneBoyRef = useRef(null);
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  // Moves the scene boy along one axis at a steady speed, swapping leg frames as he goes.
  const move = (axis, from, to, speed, pose) =>
    new Promise((resolve) => {
      const ms = Math.max(1, Math.abs(to - from) / speed);
      const t0 = performance.now();
      let lastStep = -1;
      const frame = (now) => {
        if (!alive.current) return resolve();
        const t = Math.min(1, (now - t0) / ms);
        const v = Math.round(from + (to - from) * t);
        const step = Math.floor((now - t0) / STRIDE_MS);
        if (step !== lastStep && step % 2 === 0) sfx.step(pose);
        lastStep = step;
        setScene((b) => ({ ...b, [axis]: v, pose, step, ...(axis === "x" && { facing: to > from ? 1 : -1 }) }));
        if (t < 1) requestAnimationFrame(frame);
        else resolve();
      };
      requestAnimationFrame(frame);
    });

  // Moves the plane (and him, once he's in it) in a smooth line from one spot to another.
  const glide = (from, to, aboard, dir) =>
    new Promise((resolve) => {
      const ms = Math.min(1700, Math.max(520, Math.hypot(to.x - from.x, to.up - from.up) / PLANE_SPEED));
      const t0 = performance.now();
      const frame = (now) => {
        if (!alive.current) return resolve();
        const t = Math.min(1, (now - t0) / ms);
        const e = t * t * (3 - 2 * t);
        const x = Math.round(from.x + (to.x - from.x) * e);
        const up = Math.round(from.up + (to.up - from.up) * e);
        setPlane((p) => ({ ...p, x, up, dir }));
        if (aboard) setScene((b) => ({ ...b, x: x + PLANE_SEAT, y: -(up + PLANE_SEAT_UP), facing: dir }));
        if (t < 1) requestAnimationFrame(frame);
        else resolve();
      };
      requestAnimationFrame(frame);
    });

  // The repair: a plane flies him up to the bulb, brings him back, he climbs out, and it flies away.
  const flyRepair = async () => {
    shooting.current = true;
    const track = trackRef.current.getBoundingClientRect();
    const bottom = Math.round(window.innerHeight - track.bottom);
    const start = Math.round(track.left + boyX.current);
    setScene({ x: start, y: 0, bottom, facing: 1, pose: "idle", step: 0, carrying: true });

    const glass = glassRef.current.getBoundingClientRect();
    const glassX = glass.left + glass.width / 2;
    const land = Math.max(8, Math.min(start - PLANE_SEAT, window.innerWidth - PLANE_W - 8));
    const ground = { x: land, up: 0 };
    const cruise = 140;

    // It flies in from the left and lands with its seat beside him.
    setPlane({ x: -PLANE_W - 40, up: cruise, bottom, dir: 1 });
    await glide({ x: -PLANE_W - 40, up: cruise }, { x: land, up: cruise }, false, 1);
    await glide({ x: land, up: cruise }, ground, false, 1);
    fx.current.puff({ x: land + PLANE_W / 2, y: window.innerHeight - bottom - 6 }, 40);
    sfx.pop();
    await wait(240);

    // He hops in (the plane takes him to its seat) and they take off for the bulb.
    const aboardX = land + PLANE_SEAT;
    setScene((b) => ({ ...b, x: aboardX, y: -PLANE_SEAT_UP, facing: 1 }));
    await wait(290);
    const boyUp = window.innerHeight - bottom - BOY_H * BOY_SCALE - (glass.bottom + 2); // his head just under the glass
    const atBulb = { x: Math.round(glassX - BOY_W / 2 - PLANE_SEAT), up: boyUp - PLANE_SEAT_UP };
    const dir = atBulb.x >= land ? 1 : -1;
    await glide(ground, atBulb, true, dir);
    await wait(180);

    setScene((b) => ({ ...b, carrying: false, pose: "idle" }));
    fx.current.sparkle(centerOf(glassRef.current));
    sfx.fixed();
    onFix();
    await wait(520);

    // Back to where it landed.
    await glide(atBulb, { x: land, up: cruise }, true, atBulb.x >= land ? -1 : 1);
    await glide({ x: land, up: cruise }, ground, true, 1);
    fx.current.puff({ x: land + PLANE_W / 2, y: window.innerHeight - bottom - 6 }, 40);
    sfx.pop();
    await wait(240);

    // He steps out and walks to the plane's other side, then it flies off.
    const outX = Math.min(land + PLANE_W + 14, window.innerWidth - BOY_W - 8);
    setScene((b) => ({ ...b, x: aboardX, y: 0, facing: 1 }));
    await wait(80);
    await move("x", aboardX, outX, WALK_SPEED * 0.8, "walk");
    setScene((b) => ({ ...b, pose: "idle", facing: -1 }));
    await wait(180);
    sfx.pop();
    await glide(ground, { x: land, up: cruise }, false, 1);
    const gone = glide({ x: land, up: cruise }, { x: window.innerWidth + 60, up: cruise + 60 }, false, 1);
    await wait(330);
    const back = Math.round(trackRef.current.getBoundingClientRect().left + boyX.current);
    await move("x", outX, back, WALK_SPEED * 0.8, "walk");
    await gone;
    setPlane(null);
    setBoy((b) => ({ ...b, facing: 1, pose: "idle" }));
    setScene(null);
    shooting.current = false;
  };

  useEffect(() => {
    fx.current = createFx(fxCanvas.current);
    return () => fx.current.destroy();
  }, []);

  // The bulb: he shoots it out from the track, or it's swapped back in with a sparkle.
  // First-visit hints, kept apart from the map's (this bulb has its own animations).
  const [seen, setSeen] = useState(() => ({ csShoot: hasSeen("cs-shoot"), csFix: hasSeen("cs-fix") }));
  const tried = (name, key) => {
    markSeen(name);
    setSeen((s) => ({ ...s, [key]: true }));
  };

  const onBulb = () => {
    unlockAudio();
    if (shooting.current) return;
    if (lit) tried("cs-shoot", "csShoot");
    else tried("cs-fix", "csFix");
    if (!lit) {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return onFix();
      flyRepair();
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return onBreak();
    shooting.current = true;
    sfx.stretch();
    setBoy((b) => ({ ...b, facing: 1, pose: "idle" }));
    setSling("loaded");
    setTimeout(() => {
      const r = slingRef.current.getBoundingClientRect();
      setSling("empty");
      sfx.shoot();
      fx.current.firePebble(
        { x: r.left + r.width / 2, y: r.top + 6 },
        () => {
          const c = centerOf(glassRef.current);
          return { x: c.x, y: c.y + 4 };
        },
        (at) => {
          fx.current.shatter(at);
          sfx.shatter();
          setTimeout(sfx.lightsOut, 250);
          setSling(null);
          shooting.current = false;
          onBreak();
        },
      );
    }, AIM_MS);
  };

  // Every slide change goes through here: buttons, posts, tabs, keys and swipes.
  const slideRef = useRef(0);
  const go = useCallback(
    (i) => {
      const next = Math.min(Math.max(i, 0), total - 1);
      if (next === slideRef.current || shooting.current) return;
      sfx.select();
      setDirection(next > slideRef.current ? 1 : -1);
      slideRef.current = next;
      setSlide(next);
    },
    [total],
  );

  // Keyboard: arrows move between slides, Esc returns to the map.
  useEffect(() => {
    backRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        go(slideRef.current + 1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        go(slideRef.current - 1);
      } else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  // Track width (kept live, so he stays on it whatever the window does). Posts are placed in
  // percent; his walk needs the pixels.
  useLayoutEffect(() => {
    const el = trackRef.current;
    const measure = () => setTrackW(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const postPct = (i) => (total > 1 ? (100 * i) / (total - 1) : 0);

  // Walk the boy to the current slide's post.
  useEffect(() => {
    if (!trackW) return;
    const to = (total > 1 ? (trackW * slide) / (total - 1) : 0) - BOY_W / 2;
    const resized = walk.trackW !== undefined && walk.trackW !== trackW;
    walk.trackW = trackW;
    const from = resized ? to : boyX.current || to;
    cancelAnimationFrame(walk.current);
    const dist = Math.abs(to - from);
    if (dist < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      boyX.current = to;
      setBoy((b) => ({ ...b, x: to, pose: "idle" }));
      return;
    }
    const ms = Math.min(MAX_WALK_MS, dist / WALK_SPEED);
    const t0 = performance.now();
    let lastStep = -1;
    const frame = (now) => {
      const t = Math.min(1, (now - t0) / ms);
      const x = Math.round(from + (to - from) * t);
      const step = Math.floor((now - t0) / STRIDE_MS);
      if (step !== lastStep && step % 2 === 0) sfx.step("walk");
      lastStep = step;
      boyX.current = x;
      setBoy({ x, facing: to > from ? 1 : -1, pose: t < 1 ? "walk" : "idle", step });
      if (t < 1) walk.current = requestAnimationFrame(frame);
    };
    walk.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(walk.current);
  }, [slide, trackW, total]);

  // Hang the bulb just past the last slide title, as close to the middle (and him) as the titles
  // allow; when they fill the bar (or are hidden, on phones), it stays in its corner spot (the
  // CSS default).
  const [bulbX, setBulbX] = useState(null);
  useLayoutEffect(() => {
    const tabs = tabsRef.current;
    const place = () => {
      const last = tabs.lastElementChild?.getBoundingClientRect();
      const box = tabs.getBoundingClientRect();
      const overflowing = tabs.scrollWidth > tabs.clientWidth + 1;
      setBulbX(overflowing || !last || !tabs.offsetWidth ? null : Math.round(Math.min(last.right, box.right) + 36));
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(tabs);
    document.fonts?.ready.then(place);
    return () => ro.disconnect();
  }, []);

  // Keep the current tab in view in the tab row.
  useEffect(() => {
    tabsRef.current?.querySelector("[aria-current]")?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [slide]);

  // Scrolling changes slides after a few clicks of scroll. A long slide scrolls through first; near
  // its bottom (or top) the next scroll moves on. A trackpad keeps firing fading "momentum"
  // events after a flick; those are ignored, so one flick = one slide, but a fresh flick (a
  // pause, or a sudden bigger scroll) moves on straight away.
  const stageRef = useRef(null);
  const wheel = useRef({ sum: 0, lastTime: 0, lastAbs: 0, fading: false, coasting: false });
  useEffect(() => {
    const THRESHOLD = 240; // px of scrolling at an edge before it counts: about 2–3 mouse-wheel clicks
    const EDGE = 40; // this close to a long slide's end counts as the end
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return; // sideways scrolls aren't for this
      const now = performance.now();
      const w = wheel.current;
      const abs = Math.abs(e.deltaY);
      // A new flick: after a pause, or a scroll that was fading out suddenly picks up again.
      // (A flick ramps up before it fades, so a rise alone doesn't count.)
      if (now - w.lastTime > 600) w.sum = 0; // scrolls spread far apart don't add up
      const fresh = now - w.lastTime > 160 || (w.fading && abs > w.lastAbs * 1.6 + 4);
      w.fading = now - w.lastTime <= 160 && abs < w.lastAbs;
      w.lastTime = now;
      w.lastAbs = abs;
      if (fresh) w.coasting = false;

      const el = stageRef.current;
      const down = e.deltaY > 0;
      const atEdge = !el || (down ? el.scrollTop + el.clientHeight >= el.scrollHeight - EDGE : el.scrollTop <= EDGE);
      if (!atEdge) {
        w.sum = 0; // let the slide scroll normally
        return;
      }
      e.preventDefault();
      if (w.coasting) return; // the tail of the flick that already changed the slide
      w.sum += e.deltaY;
      if (Math.abs(w.sum) < THRESHOLD) return;
      w.sum = 0;
      w.coasting = true;
      go(slideRef.current + (down ? 1 : -1));
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [go]);

  // Swipe left/right on touch screens.
  const touch = useRef(null);
  const onTouchStart = (e) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY });
  const onTouchEnd = (e) => {
    if (!touch.current) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(slide + (dx < 0 ? 1 : -1));
  };

  const count = (n) => String(n).padStart(2, "0");

  return (
    <div
      className="cs"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cs-title"
      style={bulbX ? { "--cs-bulb-x": `${bulbX}px` } : undefined}
    >
      <Bulb
        broken={!lit}
        onClick={onBulb}
        glassRef={glassRef}
        hintSide="below"
        hint={lit ? (!seen.csShoot ? "Tap for something new!" : null) : !seen.csFix && !scene ? "Tap to fix it" : null}
      />
      {plane && <Plane {...plane} />}
      {scene && <Boy {...scene} placement="screen" boyRef={sceneBoyRef} scale={BOY_SCALE} />}
      <canvas ref={fxCanvas} aria-hidden className="cs-fx" />

      <header className="cs-bar">
        <div className="cs-left">
          <button ref={backRef} type="button" className="cs-btn" onClick={onClose}>
            <Arrow dir="left" />
            <span>BACK TO MAP</span>
          </button>
          <SoundToggle />
        </div>
        <nav ref={tabsRef} className="cs-tabs" aria-label="Slides">
          {labels.map((l, i) => (
            <button key={l} type="button" aria-current={i === slide ? "step" : undefined} onClick={() => go(i)}>
              {l}
            </button>
          ))}
        </nav>
      </header>

      <main
        ref={stageRef}
        key={slide}
        className={`cs-stage ${direction > 0 ? "cs-from-right" : "cs-from-left"}`}
      >
        {slide === 0 ? (
          <CoverSlide project={project} study={study} />
        ) : (
          <SectionSlide section={study.sections[slide - 1]} index={slide} />
        )}
      </main>

      <footer className="cs-foot">
        <button type="button" className="cs-btn" onClick={() => go(slide - 1)} disabled={slide === 0}>
          <Arrow dir="left" />
          <span>PREV</span>
        </button>

        {/* The boy's track: one post per slide; click a post to send him there. */}
        <div className="cs-track-wrap">
          <div ref={trackRef} className="cs-track">
            {labels.map((l, i) => (
              <button
                key={l}
                type="button"
                className="cs-post"
                style={{ left: `${postPct(i)}%` }}
                aria-label={`Slide ${i + 1}: ${l}`}
                aria-current={i === slide ? "step" : undefined}
                onClick={() => go(i)}
              >
                <span>{count(i + 1)}</span>
              </button>
            ))}
            {!scene && <Boy {...boy} y={0} placement="inline" sling={sling} slingRef={slingRef} scale={BOY_SCALE} />}
          </div>
          <p className="cs-hint">
            {count(slide + 1)} / {count(total)}
            <span className="cs-hint-keys"> · ◀ ▶ to move · Esc for map</span>
            <span className="cs-hint-swipe"> · swipe to move</span>
          </p>
        </div>

        <button type="button" className="cs-btn" onClick={() => go(slide + 1)} disabled={slide === total - 1}>
          <span>NEXT</span>
          <Arrow />
        </button>
      </footer>
    </div>
  );
}
