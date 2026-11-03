import { Fragment, useEffect, useRef } from "react";
import "../personalArchive.css";
import { archive } from "../data";

const SHOTS = archive.shots;
const N = SHOTS.length;
// The sphere spec is tuned for 21 landscape frames; shrink cards so 54 portrait frames keep similar breathing room.
// Overall size of the sphere; lower is smaller.
const SPHERE_SIZE = 0.85;
const DENSITY = Math.min(1, Math.sqrt(21 / N) * 0.85);
// The spec pushes the headline to 0.62R so only ~4 of 21 cards pass in front of it.
// Keep that same share of the cap in front when there are more cards.
const HEAD_Z = 1 - (1 - 0.62) * Math.min(1, 21 / N);
const BODY_STATES = ["va-on", "revealed", "lit", "spinning"];

const LOADER_MIN = 1000;
const LOADER_MAX = 6000;

// 3x3 rotation matrices, row-major, in CSS axes (same as CSS rotateX / rotateY).
const toRad = (deg) => (deg * Math.PI) / 180;
const rotX = (deg) => {
  const c = Math.cos(toRad(deg));
  const s = Math.sin(toRad(deg));
  return [1, 0, 0, 0, c, -s, 0, s, c];
};
const rotY = (deg) => {
  const c = Math.cos(toRad(deg));
  const s = Math.sin(toRad(deg));
  return [c, 0, s, 0, 1, 0, -s, 0, c];
};
const rotZ = (deg) => {
  const c = Math.cos(toRad(deg));
  const s = Math.sin(toRad(deg));
  return [c, -s, 0, s, c, 0, 0, 0, 1];
};
const mul = (a, b) => {
  const m = new Array(9);
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++)
      m[r * 3 + c] = a[r * 3] * b[c] + a[r * 3 + 1] * b[3 + c] + a[r * 3 + 2] * b[6 + c];
  return m;
};
// Keeps rounding errors from slowly skewing the matrix over many frames.
const orthonormalize = (m) => {
  let [ax, ay, az] = [m[0], m[3], m[6]];
  let n = Math.hypot(ax, ay, az);
  ax /= n; ay /= n; az /= n;
  let [bx, by, bz] = [m[1], m[4], m[7]];
  const d = ax * bx + ay * by + az * bz;
  bx -= d * ax; by -= d * ay; bz -= d * az;
  n = Math.hypot(bx, by, bz);
  bx /= n; by /= n; bz /= n;
  const cx = ay * bz - az * by;
  const cy = az * bx - ax * bz;
  const cz = ax * by - ay * bx;
  return [ax, bx, cx, ay, by, cy, az, bz, cz];
};
// CSS matrix3d is column-major.
const toCss = (m) =>
  `matrix3d(${m[0]},${m[3]},${m[6]},0,${m[1]},${m[4]},${m[7]},0,${m[2]},${m[5]},${m[8]},0,0,0,0,1)`;

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
    const headline = $("#headline");
    const cards = [...root.querySelectorAll("#orb .card")];
    const cardImgs = cards.map((c) => c.querySelector("img"));
    const plate = $(".plate");
    const shotBox = $(".shot");
    const litImg = $("#litImg");
    const lit = $("#lit");

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
    // Offset by half a step so no card sits exactly on a pole: there the first and last cards
    // were crowded against their neighbours and overlapped once the sphere could turn that far.
    const pts = cards.map((_, i) => {
      const y = 1 - (2 * i + 1) / N;
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
    // Each card's place on the sphere; the sphere's rotation is put in front of it every frame.
    const placed = cards.map(() => "");

    function layout(force) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (!force && Math.abs(w - lastW) < 20 && Math.abs(h - lastH) < 20) return;
      lastW = w;
      lastH = h;
      const hr = w <= 380 ? 0.38 : w <= 640 ? 0.42 : 0.46;
      const wr = w <= 380 ? 0.4 : w <= 640 ? 0.44 : h > w ? 0.42 : 0.58;
      const floor = w <= 380 ? 108 : w <= 640 ? 120 : 155;
      R = Math.max(floor, Math.min(480, h * hr, w * wr)) * SPHERE_SIZE;
      const scale = (w <= 380 ? 0.44 : w <= 640 ? 0.46 : 0.47) * DENSITY;
      const cw = Math.round(Math.max(40, R * scale));
      persp = w <= 380 ? 620 : w <= 640 ? 760 : w <= 900 ? 920 : 1150;
      html.style.setProperty("--persp", `${persp}px`);
      html.style.setProperty("--cw", `${cw}px`);
      pts.forEach((p, i) => {
        placed[i] = `translate3d(${p.x * R}px, ${-p.y * R}px, ${p.z * R}px) rotateY(${p.lon}deg) rotateX(${p.lat}deg)`;
      });
    }

    /* ---------- camera loop ---------- */
    const cam = { velX: 0, velY: 0, velZ: 0 };
    // Sphere orientation as a 3x3 rotation matrix (CSS axes: y down, z toward the viewer).
    // Drags rotate it about the screen's axes, trackball-style, so it turns freely in every
    // direction and always follows the pointer, even upside down.
    let rot = mul(rotX(-4), [1, 0, 0, 0, 1, 0, 0, 0, 1]);
    const turn = (dx, dy) => {
      if (dx) rot = mul(rotY(dx), rot);
      if (dy) rot = mul(rotX(dy), rot);
    };
    const AUTO_SPIN = 0.06; // degrees per frame, about one turn every 100s at 60fps
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dragging = false;
    let focused = -1;
    const written = cards.map(() => ({ o: -1, d: -1 }));
    let lastHeadOpacity = -1;
    const HEAD_LAYER = Math.round((HEAD_Z + 1) * 1000);

    function frame() {
      if (!dragging && focused < 0) {
        // Gentle idle spin; drag momentum adds on top of it and eases back into it.
        if (!still) turn(AUTO_SPIN, 0);
        turn(cam.velX, cam.velY);
        if (cam.velZ) rot = mul(rotZ(cam.velZ), rot);
        cam.velX *= 0.94;
        cam.velY *= 0.94;
        cam.velZ *= 0.94;
        if (Math.abs(cam.velX) < 0.002) cam.velX = 0;
        if (Math.abs(cam.velY) < 0.002) cam.velY = 0;
        if (Math.abs(cam.velZ) < 0.002) cam.velZ = 0;
      }
      rot = orthonormalize(rot);

      // Cards and headline are drawn flat, each with its own 3D transform, and stacked back to
      // front by depth here. Letting the browser depth-sort the whole 3D scene instead made far
      // cards flash in front of the headline and edges flicker while the sphere turned.
      const sphere = toCss(rot);
      headline.style.transform = `translateZ(${R * HEAD_Z}px)`;
      headline.style.zIndex = HEAD_LAYER;
      const headOpacity = focused >= 0 ? 0 : 1;
      if (headOpacity !== lastHeadOpacity) {
        headline.style.opacity = headOpacity.toFixed(3);
        lastHeadOpacity = headOpacity;
      }

      const near = persp * 0.66;

      for (let i = 0; i < cards.length; i++) {
        const pt = pts[i];
        // Depth of the card after the sphere's rotation (screen space, y down).
        const zf = rot[6] * pt.x - rot[7] * pt.y + rot[8] * pt.z;
        cards[i].style.transform = `${sphere} ${placed[i]}`;
        cards[i].style.zIndex = Math.round((zf + 1) * 1000);
        const base = 0.14 + 0.86 * Math.pow((zf + 1) / 2, 0.85);
        let dim = 1 - base;
        let fade = 1;
        const absZ = zf * R;
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

    /* ---------- loader ---------- */
    // Held for at least LOADER_MIN and until every photo is ready (or LOADER_MAX passes),
    // so the sphere appears complete instead of popping in photo by photo.
    const loader = $("#loader");
    const loaderBar = $("#loaderBar");
    const born = performance.now();
    let ready = 0;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      loaderBar.style.transform = "scaleX(1)";
      later(() => {
        layout(true);
        loader.classList.add("out");
        body.classList.add("revealed");
        later(() => (loader.style.display = "none"), 650);
      }, 250);
    };
    const report = () => {
      ready++;
      loaderBar.style.transform = `scaleX(${ready / N})`;
      if (ready >= N) later(finish, Math.max(0, LOADER_MIN - (performance.now() - born)));
    };
    later(finish, LOADER_MAX);

    // Pre-sized thumbnails load straight into the cards; a card only counts as ready once
    // its photo is decoded, so nothing pops in blank after the loader lifts.
    SHOTS.forEach((shot, i) => {
      const img = cardImgs[i];
      img.decoding = "async";
      img.onload = () => {
        if (!alive) return;
        decoded[i] = shot.thumb;
        img.decode().catch(() => {}).then(() => {
          if (!alive) return;
          img.classList.add("in");
          img.closest("figure")?.classList.add("loaded");
          report();
        });
      };
      img.onerror = report;
      img.src = shot.thumb;
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
        try {
          stage.setPointerCapture(e.pointerId);
        } catch {
          /* pointer already gone */
        }
        ptr.captured = true;
        dragging = true;
      }
      body.classList.add("spinning");
      const mx = e.clientX - ptr.lx;
      const my = e.clientY - ptr.ly;
      ptr.lx = e.clientX;
      ptr.ly = e.clientY;
      cam.velX = mx * 0.13;
      cam.velY = -my * 0.13;
      turn(cam.velX, cam.velY);
    });

    const endDrag = (e, cancelled) => {
      if (!ptr || e.pointerId !== ptr.id) return;
      const slop = coarse || ptr.type === "touch" ? 14 : 6;
      const { card, moved } = ptr;
      ptr = null;
      dragging = false;
      body.classList.remove("spinning");
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
      const target = cards[i];
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

    on($(".wordmark"), "click", (e) => e.preventDefault());

    on(window, "keydown", (e) => {
      if (e.key === "Escape" && body.classList.contains("lit")) closeShot();
    });

    /* ---------- trackpad (two-finger swipe) rotates the sphere ---------- */
    let wheelIdle = 0;
    // The sphere follows the fingers in any direction; the trackpad's own momentum keeps it
    // gliding. Pinch (ctrl + wheel) is left alone so browser zoom still works.
    on(
      window,
      "wheel",
      (e) => {
        if (focused >= 0 || e.ctrlKey) return;
        e.preventDefault(); // also stops the horizontal swipe from navigating back/forward
        const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
        cam.velX = 0;
        cam.velY = 0;
        turn(-e.deltaX * unit * 0.12, e.deltaY * unit * 0.12);
        body.classList.add("spinning");
        clearTimeout(wheelIdle);
        wheelIdle = later(() => body.classList.remove("spinning"), 200);
      },
      { passive: false },
    );

    /* ---------- trackpad twist (two fingers turning) spins the sphere in place ---------- */
    // Safari reports this gesture (macOS trackpads and iOS); Chrome and Firefox don't expose it.
    // e.rotation is the total twist in degrees since the gesture began, clockwise positive.
    let twistFrom = 0;
    on(
      window,
      "gesturestart",
      (e) => {
        e.preventDefault();
        if (focused >= 0) return;
        twistFrom = e.rotation;
        cam.velX = cam.velY = cam.velZ = 0;
        dragging = true; // the gesture drives the sphere; momentum takes over when it ends
        body.classList.add("spinning");
      },
      { passive: false },
    );
    on(
      window,
      "gesturechange",
      (e) => {
        e.preventDefault();
        if (focused >= 0) return;
        const delta = e.rotation - twistFrom;
        twistFrom = e.rotation;
        rot = mul(rotZ(delta), rot);
        cam.velZ = delta;
      },
      { passive: false },
    );
    on(
      window,
      "gestureend",
      (e) => {
        e.preventDefault();
        dragging = false;
        body.classList.remove("spinning");
      },
      { passive: false },
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

      <div id="stage" data-cursor="Drag">
        <div id="world">
          <div id="orb">
            {SHOTS.map((shot, i) => (
              <div className="card" data-idx={i} key={shot.src} data-cursor="View photo">
                <figure>
                  <img alt={shot.title} draggable={false} />
                </figure>
              </div>
            ))}
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
      </div>

      <div className="vig" aria-hidden="true" />

      <div id="loader" role="status" aria-label="Loading photos">
        <div className="mark">
          <Wordmark />
        </div>
        <div className="bar">
          <s id="loaderBar" />
        </div>
        <div className="tag">{archive.tag}</div>
      </div>

      <header className="chrome">
        <a className="wordmark" href="#" aria-label={archive.name.join(" ")}>
          <img src="/signature-ink.png" alt="" />
        </a>
      </header>

      <div className="bio chrome">
        <p>{archive.bio}</p>
      </div>

      <div className="colophon chrome">{archive.tag}</div>

      <div className="cue chrome">
        <s />
        Drag, swipe or twist to rotate
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
