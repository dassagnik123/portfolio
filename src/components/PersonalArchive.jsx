import { Fragment, useEffect, useRef } from "react";
import "../personalArchive.css";
import { archive } from "../data";

const SHOTS = archive.shots;
const N = SHOTS.length;
// The sphere spec is tuned for 21 landscape frames; shrink cards so 54 portrait frames keep similar breathing room.
const DENSITY = Math.min(1, Math.sqrt(21 / N) * 0.85);
// The spec pushes the headline to 0.62R so only ~4 of 21 cards pass in front of it.
// Keep that same share of the cap in front when there are more cards.
const HEAD_Z = 1 - (1 - 0.62) * Math.min(1, 21 / N);
const BODY_STATES = ["va-on", "revealed", "deep", "gridview", "lit"];

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

function Wordmark() {
  return (
    <>
      {archive.name[0]} <em>{archive.name[1]}</em>
    </>
  );
}

export default function PersonalArchive() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const $ = (sel) => root.querySelector(sel);
    const html = document.documentElement;
    const body = document.body;

    const stage = $("#stage");
    const world = $("#world");
    const headline = $("#headline");
    const cards = [...root.querySelectorAll("#orb .card")];
    const cardImgs = cards.map((c) => c.querySelector("img"));
    const gridFigs = [...root.querySelectorAll("#grid figure")];
    const gridImgs = gridFigs.map((f) => f.querySelector("img"));
    const plate = $(".plate");
    const shotBox = $(".shot");
    const litImg = $("#litImg");
    const lit = $("#lit");
    const gridBtn = $("#gridBtn");

    let alive = true;
    let raf = 0;
    const disposers = [];
    const timers = new Set();
    const blobs = [];
    const on = (target, type, fn, opts) => {
      target.addEventListener(type, fn, opts);
      disposers.push(() => target.removeEventListener(type, fn, opts));
    };
    const later = (fn, ms) => {
      const id = setTimeout(() => {
        timers.delete(id);
        if (alive) fn();
      }, ms);
      timers.add(id);
      return id;
    };

    html.classList.add("va-on");
    body.classList.add("va-on");
    window.scrollTo(0, 0);

    /* ---------- Fibonacci sphere ---------- */
    const GA = Math.PI * (3 - Math.sqrt(5));
    const pts = cards.map((_, i) => {
      const y = 1 - (i / (N - 1)) * 2;
      const rad = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = i * GA;
      const x = Math.cos(theta) * rad;
      const z = Math.sin(theta) * rad;
      return {
        x,
        y,
        z,
        lat: (Math.asin(y) * 180) / Math.PI,
        lon: (Math.atan2(x, z) * 180) / Math.PI,
      };
    });

    let R = 300;
    let persp = 1150;
    let lastW = 0;
    let lastH = 0;

    function layout(force) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (!force && Math.abs(w - lastW) < 20 && Math.abs(h - lastH) < 20) return;
      lastW = w;
      lastH = h;
      const hr = w <= 380 ? 0.38 : w <= 640 ? 0.42 : 0.46;
      const wr = w <= 380 ? 0.4 : w <= 640 ? 0.44 : h > w ? 0.42 : 0.58;
      const floor = w <= 380 ? 108 : w <= 640 ? 120 : 155;
      R = Math.max(floor, Math.min(480, h * hr, w * wr));
      const scale = (w <= 380 ? 0.44 : w <= 640 ? 0.46 : 0.47) * DENSITY;
      const cw = Math.round(Math.max(40, R * scale));
      persp = w <= 380 ? 620 : w <= 640 ? 760 : w <= 900 ? 920 : 1150;
      html.style.setProperty("--persp", `${persp}px`);
      html.style.setProperty("--cw", `${cw}px`);
      cards.forEach((card, i) => {
        const p = pts[i];
        card.style.transform = `translate3d(${p.x * R}px, ${-p.y * R}px, ${p.z * R}px) rotateY(${p.lon}deg) rotateX(${p.lat}deg)`;
      });
    }

    /* ---------- camera loop ---------- */
    const cam = { spin: 0, tilt: -4, camZ: 0, dragX: 0, dragY: 0, velX: 0, velY: 0 };
    const PITCH = 32;
    const AUTO_SPIN = 0.06; // degrees per frame, about one turn every 100s at 60fps
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dragging = false;
    let focused = -1;
    const written = cards.map(() => ({ o: -1, d: -1 }));
    let lastHeadOpacity = -1;
    let deep = false;


    function frame() {
      if (!dragging && focused < 0) {
        // Gentle idle spin; drag momentum adds on top of it and eases back into it.
        if (!still && !body.classList.contains("gridview")) cam.spin += AUTO_SPIN;
        cam.dragX += cam.velX;
        cam.dragY += cam.velY;
        cam.velX *= 0.94;
        cam.velY *= 0.94;
        if (Math.abs(cam.velX) < 0.002) cam.velX = 0;
        if (Math.abs(cam.velY) < 0.002) cam.velY = 0;
      }
      cam.dragY = clamp(cam.dragY, -PITCH - cam.tilt, PITCH - cam.tilt);

      const p = clamp(window.scrollY / (window.innerHeight * 0.16), 0, 1);
      if (p > 0.35 !== deep) {
        deep = p > 0.35;
        body.classList.toggle("deep", deep);
      }
      const camZTarget = p * Math.min(64, R * 0.12);
      cam.camZ += (camZTarget - cam.camZ) * 0.075;

      const sx = cam.tilt + cam.dragY;
      const sy = cam.spin + cam.dragX;
      world.style.transform = `translateZ(${cam.camZ}px) rotateY(${sy}deg) rotateX(${sx}deg)`;
      headline.style.transform = `rotateX(${-sx}deg) rotateY(${-sy}deg) translateZ(${R * HEAD_Z}px)`;
      const headOpacity = focused >= 0 ? 0 : Math.max(0, 1 - p * 0.55);
      if (headOpacity !== lastHeadOpacity) {
        headline.style.opacity = headOpacity.toFixed(3);
        lastHeadOpacity = headOpacity;
      }

      const rx = (sx * Math.PI) / 180;
      const ry = (sy * Math.PI) / 180;
      const cx = Math.cos(rx);
      const snx = Math.sin(rx);
      const cy = Math.cos(ry);
      const sny = Math.sin(ry);
      const shade = 1 - Math.min(1, p * 1.6);
      const near = persp * 0.66;

      for (let i = 0; i < cards.length; i++) {
        const pt = pts[i];
        // Screen-space unit vector (y down), rotated like #world: rotateX first, then rotateY.
        const py = -pt.y;
        const z1 = py * snx + pt.z * cx;
        const zf = -pt.x * sny + z1 * cy;
        const base = 0.14 + 0.86 * Math.pow((zf + 1) / 2, 0.85);
        let dim = shade * (1 - base);
        let fade = 1;
        const absZ = zf * R + cam.camZ;
        if (absZ > near) fade = Math.max(0, 1 - (absZ - near) / 190);
        if (focused >= 0) {
          dim = Math.min(1, dim + 0.78);
          if (i === focused) fade = 0;
        }
        const o = Math.round(fade * 1000) / 1000;
        const d = Math.round(dim * 1000) / 1000;
        const w = written[i];
        if (w.o !== o) {
          cards[i].style.opacity = o;
          w.o = o;
        }
        if (w.d !== d) {
          cards[i].style.setProperty("--d", d);
          w.d = d;
        }
      }
    }

    function loop() {
      if (!alive) return;
      frame();
      raf = requestAnimationFrame(loop);
    }

    layout(true);
    frame();
    raf = requestAnimationFrame(loop);

    /* ---------- image decode ---------- */
    const decoded = new Array(N).fill(null);
    const capFor = (w) => (w <= 380 ? 420 : w <= 640 ? 520 : w <= 900 ? 640 : 760);

    function downscale(src, cap) {
      return new Promise((resolve) => {
        const probe = new Image();
        probe.crossOrigin = "anonymous";
        probe.decoding = "async";
        probe.onload = () => {
          if (!alive) return resolve(src);
          if (probe.naturalWidth <= cap) return resolve(src);
          try {
            const k = cap / probe.naturalWidth;
            const canvas = document.createElement("canvas");
            canvas.width = cap;
            canvas.height = Math.round(probe.naturalHeight * k);
            canvas.getContext("2d").drawImage(probe, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(
              (blob) => {
                // Safari silently falls back to PNG; the original is smaller then.
                if (!blob || blob.type !== "image/webp") return resolve(src);
                const url = URL.createObjectURL(blob);
                if (!alive) {
                  URL.revokeObjectURL(url);
                  return resolve(src);
                }
                blobs.push(url);
                resolve(url);
              },
              "image/webp",
              0.88,
            );
          } catch {
            resolve(src);
          }
        };
        probe.onerror = () => resolve(src);
        probe.src = src;
      });
    }

    SHOTS.forEach((shot, i) => {
      cardImgs[i].onload = () => cardImgs[i].classList.add("in");
      downscale(shot.src, capFor(window.innerWidth)).then((url) => {
        if (!alive) return;
        decoded[i] = url;
        cardImgs[i].src = url;
        gridImgs[i].src = url;
      });
    });
    downscale(archive.avatar, 160).then((url) => {
      if (alive) $("#avatar").src = url;
    });

    // No splash or intro film: the sphere is laid out and revealed straight away.
    requestAnimationFrame(() => {
      if (!alive) return;
      layout(true);
      body.classList.add("revealed");
    });

    /* ---------- drag ---------- */
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    let ptr = null;

    on(stage, "pointerdown", (e) => {
      if (focused >= 0 || (e.button !== undefined && e.button !== 0)) return;
      const card = e.target.closest ? e.target.closest(".card") : null;
      ptr = {
        id: e.pointerId,
        x0: e.clientX,
        y0: e.clientY,
        lx: e.clientX,
        ly: e.clientY,
        card,
        type: e.pointerType,
        captured: false,
        moved: 0,
      };
      cam.velX = 0;
      cam.velY = 0;
      if (e.pointerType !== "touch") {
        try {
          stage.setPointerCapture(e.pointerId);
        } catch {
          /* pointer already gone */
        }
        ptr.captured = true;
        dragging = true;
      }
    });

    on(stage, "pointermove", (e) => {
      if (!ptr || e.pointerId !== ptr.id) return;
      const dx = e.clientX - ptr.x0;
      const dy = e.clientY - ptr.y0;
      ptr.moved = Math.max(ptr.moved, Math.hypot(dx, dy));
      if (!ptr.captured) {
        if (Math.hypot(dx, dy) < 10) return;
        if (Math.abs(dy) > Math.abs(dx) * 1.15) {
          ptr = null;
          return;
        }
        try {
          stage.setPointerCapture(e.pointerId);
        } catch {
          /* pointer already gone */
        }
        ptr.captured = true;
        dragging = true;
      }
      const mx = e.clientX - ptr.lx;
      const my = e.clientY - ptr.ly;
      ptr.lx = e.clientX;
      ptr.ly = e.clientY;
      cam.velX = mx * 0.13;
      cam.velY = -my * 0.13;
      cam.dragX += cam.velX;
      cam.dragY += cam.velY;
    });

    const endDrag = (e, cancelled) => {
      if (!ptr || e.pointerId !== ptr.id) return;
      const slop = coarse || ptr.type === "touch" ? 14 : 6;
      const { card, moved } = ptr;
      ptr = null;
      dragging = false;
      if (!cancelled && moved < slop && card) openShot(Number(card.dataset.idx), card);
    };
    on(stage, "pointerup", (e) => endDrag(e, false));
    on(stage, "pointercancel", (e) => endDrag(e, true));

    /* ---------- lightbox ---------- */
    let openToken = 0;
    let openedAt = 0;

    function flipTransform(rect) {
      const shot = shotBox.getBoundingClientRect();
      const pr = plate.getBoundingClientRect();
      plate.style.transformOrigin = `50% ${shot.top - pr.top + shot.height / 2}px`;
      const dx = rect.left + rect.width / 2 - (shot.left + shot.width / 2);
      const dy = rect.top + rect.height / 2 - (shot.top + shot.height / 2);
      const s = Math.max(0.04, rect.width / shot.width);
      return `translate(${dx}px, ${dy}px) scale(${s})`;
    }

    function openShot(i, source) {
      const shot = SHOTS[i];
      if (!shot) return;
      const token = ++openToken;
      focused = i;
      openedAt = performance.now();
      litImg.src = decoded[i] || shot.src;
      litImg.alt = shot.title;
      const full = new Image();
      full.onload = () => {
        if (alive && token === openToken) litImg.src = shot.src;
      };
      full.src = shot.src;
      $("#litTitle").textContent = shot.title;
      $("#litWhere").textContent = shot.place;
      $("#litNote").textContent = shot.note;
      html.style.overflow = "hidden";
      lit.scrollTop = 0;
      body.classList.add("lit");

      plate.style.transition = "none";
      plate.style.transform = "none";
      plate.style.opacity = "";
      const t = flipTransform(source.getBoundingClientRect());
      plate.style.transform = t;
      plate.style.opacity = "0";
      void plate.offsetWidth;
      plate.style.transition = "";
      plate.style.transform = "";
      plate.style.opacity = "";
    }

    function closeShot() {
      if (!body.classList.contains("lit")) return;
      const i = focused;
      focused = -1;
      const token = ++openToken;
      body.classList.remove("lit");
      html.style.overflow = "";
      const target = body.classList.contains("gridview") ? gridFigs[i] : cards[i];
      if (target) {
        plate.style.transform = flipTransform(target.getBoundingClientRect());
        plate.style.opacity = "0";
      }
      later(() => {
        if (token !== openToken) return;
        plate.style.transition = "none";
        plate.style.transform = "";
        plate.style.opacity = "";
        void plate.offsetWidth;
        plate.style.transition = "";
      }, 640);
    }

    on(lit, "click", (e) => {
      if (e.target.closest("[data-close]")) closeShot();
      // A tap opens on pointerup; ignore the click that follows it landing on the scrim.
      else if (e.target.classList.contains("scrim") && performance.now() - openedAt > 400) closeShot();
    });

    /* ---------- grid ---------- */
    const setGrid = (onOff) => body.classList.toggle("gridview", onOff);
    on(gridBtn, "click", () => setGrid(!body.classList.contains("gridview")));
    gridFigs.forEach((fig) => on(fig, "click", () => openShot(Number(fig.dataset.idx), fig)));

    on($(".wordmark"), "click", (e) => {
      e.preventDefault();
      setGrid(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    on(window, "keydown", (e) => {
      if (e.key !== "Escape") return;
      if (body.classList.contains("lit")) closeShot();
      else if (body.classList.contains("gridview")) setGrid(false);
    });

    /* ---------- scroll + resize ---------- */
    on(
      window,
      "scroll",
      () => {
        const max = window.innerHeight * 0.16;
        if (window.scrollY > max + 1) window.scrollTo(0, max);
      },
      { passive: true },
    );
    on(window, "resize", () => layout(false));
    on(window, "orientationchange", () => later(() => layout(true), 220));
    if (window.visualViewport) {
      on(window.visualViewport, "resize", () => layout(false));
      on(window.visualViewport, "scroll", () => layout(false));
    }

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      disposers.forEach((off) => off());
      timers.forEach((id) => clearTimeout(id));
      timers.clear();
      blobs.forEach((url) => URL.revokeObjectURL(url));
      BODY_STATES.forEach((c) => body.classList.remove(c));
      html.classList.remove("va-on");
      html.style.overflow = "";
      html.style.removeProperty("--persp");
      html.style.removeProperty("--cw");
      window.scrollTo(0, 0);
    };
  }, []);

  return (
    <div className="va" ref={rootRef}>
      <div id="scrolltrack" aria-hidden="true" />

      <div id="stage">
        <div id="world">
          <div id="orb">
            {SHOTS.map((shot, i) => (
              <div className="card" data-idx={i} key={shot.src}>
                <figure>
                  <img alt={shot.title} draggable={false} />
                </figure>
              </div>
            ))}
          </div>
          <h1 id="headline">
            <span className="inner">
              {archive.headline.map((word, i) => (
                <Fragment key={word + i}>
                  {i > 0 && " "}
                  <span style={{ "--i": i }}>{word}</span>
                </Fragment>
              ))}
            </span>
          </h1>
        </div>
      </div>

      <div className="vig" aria-hidden="true" />

      <div id="grid">
        <div className="rows">
          {SHOTS.map((shot, i) => (
            <figure data-idx={i} key={shot.src}>
              <img alt={shot.title} loading="lazy" />
              <figcaption>{shot.title}</figcaption>
            </figure>
          ))}
        </div>
      </div>

      <header className="chrome">
        <a className="wordmark" href="#" aria-label={archive.name.join(" ")}>
          <Wordmark />
        </a>
      </header>

      <div className="bio chrome">
        <div className="who">
          <img id="avatar" alt={archive.name.join(" ")} />
          <b>{archive.name.join(" ")}</b>
        </div>
        <p>{archive.bio}</p>
      </div>

      <div className="colophon chrome">{archive.tag}</div>

      <button type="button" id="gridBtn" className="gridbtn" aria-label="Toggle grid view">
        <b />
        <b />
        <b />
        <b />
      </button>

      <div className="cue chrome">
        <s />
        Drag to rotate
      </div>

      <div id="lit">
        <div className="scrim" />
        <div className="plate">
          <div className="shot">
            <img id="litImg" alt="" />
            <button type="button" className="close" data-close>
              Close
            </button>
          </div>
          <div className="meta">
            <div>
              <h2 id="litTitle" />
              <div className="where" id="litWhere" />
            </div>
            <p className="note" id="litNote" />
          </div>
        </div>
      </div>

    </div>
  );
}
