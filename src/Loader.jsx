import { useEffect, useLayoutEffect, useRef, useState } from "react";

// The loading screen: the whole screen is covered with roses, lilies and leaves, with the name in
// the middle. The flowers bloom outward from the centre while the page loads (the progress line is
// real: it counts the fonts and the first images). When the page is ready, the flowers fly off the
// screen in every direction and the name glides and shrinks into the exact spot where the hero's
// name sits, so the loading screen turns into the page. If the hero's name is not on screen (a
// case study or gallery page, or a very short phone screen) the name just fades with the flowers.
// With reduced motion there is no bloom and no flight, only a short fade.
// What the page needs for its first screen (the progress counts these)...
const ASSETS = [
  "/portrait/sagnik-das.webp",
  "/flowers/rose-open.webp",
  "/flowers/rose-bud.webp",
  "/flowers/lily-open.webp",
  "/flowers/lily-a.webp",
  "/flowers/lily-b.webp",
  "/flowers/lily-c.webp",
  "/flowers/leaf-3.webp",
  "/flowers/leaf-7.webp",
  "/flowers/leaf-8.webp",
];
// ...and the small copies of the flowers that the loading screen itself shows. They are tiny, so
// the screen can bloom almost at once, even on a slow phone connection while the big images load.
const SMALL = ["rose-open", "rose-bud", "lily-open", "lily-a", "lily-b", "lily-c", "leaf-3", "leaf-7", "leaf-8"];
const SMALL_WAIT_MS = 1500; // bloom anyway after this long
const MIN_MS = 2300; // never shorter than this, so the bloom is seen
const MAX_MS = 6500; // never longer than this, however slow the connection
const FLIGHT_MS = 1000; // the name's trip to the hero
const END_MS = 1500; // from the start of leaving to the loader being removed

const ROSES = ["rose-open", "rose-bud"];
const LILIES = ["lily-open", "lily-a", "lily-b", "lily-c"];
const LEAVES = ["leaf-3", "leaf-7", "leaf-8"];
const rand = (a, b) => a + Math.random() * (b - a);

// The box of an element's text itself (a heading's own box is as wide as its column, not its words).
function textRect(el) {
  const range = document.createRange();
  range.selectNodeContents(el);
  return range.getBoundingClientRect();
}
const pick = (list) => list[Math.floor(Math.random() * list.length)];

// A jittered grid of blooms (rose and lily alternating) covering the whole screen, with leaves
// scattered behind and between them. Positions are % of the screen, sizes are in vmax. The flowers
// nearest the centre bloom first, so it radiates outward.
function layout() {
  const portrait = window.innerWidth < window.innerHeight;
  const cols = portrait ? 5 : 8;
  const rows = portrait ? 8 : 5;
  const items = [];
  const add = (src, x, y, size, z, leaf) => {
    const dx = x - 50;
    const dy = y - 50;
    const len = Math.hypot(dx, dy) || 1;
    const dist = Math.min(1, len / 70);
    items.push({
      src,
      x,
      y,
      size,
      z,
      leaf,
      ax: dx / len,
      ay: dy / len,
      rot: Math.round(rand(-40, 40)),
      arrive: 0.15 + dist * 1.0 + rand(0, 0.2),
      exit: (1 - dist) * 0.3 + rand(0, 0.1),
    });
  };
  for (let i = 0; i < 24; i++) add(pick(LEAVES), rand(0, 100), rand(0, 100), rand(10, 15), 1, true);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const src = (r + c) % 2 === 0 ? pick(ROSES) : pick(LILIES);
      add(src, ((c + 0.5) / cols) * 100 + rand(-4, 4), ((r + 0.5) / rows) * 100 + rand(-5, 5), rand(17, 23), 2 + ((r + c) % 2), false);
    }
  }
  for (let i = 0; i < 10; i++) add(pick(LEAVES), rand(2, 98), rand(2, 98), rand(8, 12), 5, true);
  return items;
}

export default function Loader({ onDone }) {
  const [items] = useState(layout);
  const [shown, setShown] = useState(0); // the percentage on screen, eased towards the real one
  const [leaving, setLeaving] = useState(false);
  const [ready, setReady] = useState(false); // the small flowers have arrived: time to bloom
  const target = useRef(0);
  const start = useRef(performance.now());
  const nameRef = useRef(null);
  const reduce = useRef(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  // The plain cream screen from index.html has done its job: this screen takes over before the next paint.
  useLayoutEffect(() => {
    document.getElementById("boot")?.remove();
  }, []);

  // The name in the middle is 1.5x the hero's, but never wider than 84% of the screen. It is measured
  // after mount: during the very first render the page's DOM does not exist yet.
  const [nameSize, setNameSize] = useState(() => Math.min(96, window.innerWidth * 0.14));
  useLayoutEffect(() => {
    const hero = document.querySelector(".name");
    if (!hero) return undefined;
    const size = parseFloat(getComputedStyle(hero).fontSize);
    const ratio = textRect(hero).width / size || 5;
    setNameSize(Math.min(size * 1.5, (window.innerWidth * 0.84) / ratio));
    // The real hero name stays hidden until the flight has landed there.
    document.documentElement.classList.add("name-flying");
    return () => document.documentElement.classList.remove("name-flying");
  }, []);

  // The loading screen's own flowers: bloom as soon as they have arrived (or after a short wait).
  useEffect(() => {
    let left = SMALL.length;
    const done = () => {
      left -= 1;
      if (left <= 0) setReady(true);
    };
    SMALL.forEach((name) => {
      const img = new Image();
      img.onload = done;
      img.onerror = done;
      img.src = `/flowers/sm/${name}.webp`;
    });
    const id = setTimeout(() => setReady(true), SMALL_WAIT_MS);
    return () => clearTimeout(id);
  }, []);

  // Count what has loaded. The big images are only requested once the small flowers are in, so the
  // little ones get the whole connection first.
  useEffect(() => {
    if (!ready) return;
    let loaded = 0;
    const total = ASSETS.length + 1; // the images, plus the fonts
    const tick = () => {
      loaded += 1;
      target.current = (loaded / total) * 100;
    };
    ASSETS.forEach((src) => {
      const img = new Image();
      img.onload = tick;
      img.onerror = tick; // a missing image must not hold the screen forever
      img.src = src;
    });
    (document.fonts?.ready ?? Promise.resolve()).then(tick);
  }, [ready]);

  // The number: it creeps up on its own (slowing towards 88%) so it never sits still while the big
  // images download on a slow connection, jumps ahead when the real progress is ahead of it, and
  // eases to 100 once everything has loaded. It leaves when it reaches 100 and the screen has been
  // up for the minimum time (or when time is up).
  useEffect(() => {
    let raf = 0;
    const min = reduce.current ? 350 : MIN_MS;
    let value = 0;
    const frame = (now) => {
      const elapsed = now - start.current;
      const creep = 88 * (1 - Math.exp(-elapsed / 1300));
      const goal = target.current >= 100 && elapsed >= min * 0.6 ? 100 : Math.max(creep, Math.min(target.current, 95));
      value += (goal - value) * 0.1;
      setShown(value);
      if ((value > 99.4 && elapsed >= min) || elapsed >= MAX_MS) {
        setShown(100);
        setLeaving(true);
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  // No scrolling under the screen. It is blocked with events, not with overflow: hidden, because that
  // removes the scrollbar, and the page would get 14px wider and re-flow when the loader leaves (the
  // hero's name, which the name flies to, would then not be where it was aimed).
  useEffect(() => {
    const stop = (e) => e.preventDefault();
    const stopKeys = (e) => {
      if ([" ", "PageDown", "PageUp", "ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) e.preventDefault();
    };
    window.addEventListener("wheel", stop, { passive: false });
    window.addEventListener("touchmove", stop, { passive: false });
    window.addEventListener("keydown", stopKeys);
    return () => {
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchmove", stop);
      window.removeEventListener("keydown", stopKeys);
    };
  }, []);

  // Leaving: the name flies to the hero (the flowers scatter through CSS), then the loader goes.
  useEffect(() => {
    if (!leaving) return undefined;
    let flight;
    let timer;
    const el = nameRef.current;
    // Looked up now, when the page is certainly there.
    const hero = document.querySelector(".name");
    if (!reduce.current && hero && el) {
      const to = textRect(hero);
      const from = textRect(el);
      // Glide whenever any of the hero's name is on screen (only a name below the fold just fades).
      if (to.width > 0 && from.width > 0 && to.top < window.innerHeight - 8) {
        // Scale about the text's own top-left corner, so it lands exactly on the hero's text.
        const box = el.getBoundingClientRect();
        el.style.transformOrigin = `${from.left - box.left}px ${from.top - box.top}px`;
        flight = el.animate(
          [{ transform: "none" }, { transform: `translate(${to.left - from.left}px, ${to.top - from.top}px) scale(${to.width / from.width})` }],
          { duration: FLIGHT_MS, delay: 250, easing: "cubic-bezier(0.65, 0, 0.25, 1)", fill: "forwards" },
        );
      }
    }
    if (flight) {
      // Wait for the name to land before the loader goes, so the hero name takes over seamlessly.
      flight.finished.then(onDone, () => {});
      timer = setTimeout(onDone, END_MS + 1000); // safety net
    } else {
      timer = setTimeout(onDone, reduce.current ? 250 : END_MS);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [leaving, onDone]);

  return (
    <div className={`loader${ready ? " is-ready" : ""}${leaving ? " is-leaving" : ""}`} role="status" aria-live="polite" aria-label="Loading">
      <div className="loader-bg" aria-hidden />
      <div className="loader-field" aria-hidden>
        {items.map(({ src, x, y, size, z, leaf, ax, ay, rot, arrive, exit }, i) => (
          <span
            key={i}
            className={`loader-item ${leaf ? "loader-leaf" : "loader-bloom"}`}
            style={{ left: `${x}%`, top: `${y}%`, "--w": `${size}vmax`, "--ax": ax, "--ay": ay, "--exit": `${exit}s`, zIndex: z }}
          >
            <img src={`/flowers/sm/${src}.webp`} alt="" draggable={false} style={{ "--r": `${rot}deg`, "--arrive": `${arrive}s` }} />
          </span>
        ))}
      </div>

      <div className="loader-center" aria-hidden>
        <div className="loader-glow" />
        <p ref={nameRef} className="loader-name" style={{ fontSize: `${nameSize}px` }}>
          Sagnik Das
        </p>
        <div className="loader-meter">
          <div className="loader-bar">
            <span style={{ transform: `scaleX(${shown / 100})` }} />
          </div>
          <p className="loader-count">{Math.round(shown)}</p>
        </div>
      </div>
    </div>
  );
}
