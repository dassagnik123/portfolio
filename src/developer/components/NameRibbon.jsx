import { useEffect, useRef } from "react";
import * as THREE from "three";

// Hero: a ribbon of cards, one letter of the name on each, spirals past the viewer on a fixed
// 3D rail and then lands as the name. It plays by itself on load. One number drives it all:
// progress p (0 to 1) over INTRO_SECONDS. The letters keep their cards when they land,
// and the children (the intro block) fade in beneath them.

const NAME = "SAGNIK DAS";
const LETTERS = NAME.replace(/\s/g, "").split("");
// Photos shown when a letter card is hovered: one per letter, S A G N I K D A S.
const PHOTOS = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `/personal/Sagnik/${n}.jpg`);
const HOVER_READY = 0.85; // progress after which the landed cards react to the pointer
const CARD_INK = "#f4f1ea";

// True once the intro has played in this page load. It lives only in memory, so a refresh or
// reopening the site plays the intro again, but switching 9-5 / 5-9 and back does not.
let introSeen = false;

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const mix = (a, b, t) => a + (b - a) * t;
const out = (t) => 1 - (1 - t) ** 3;
const span = (p, a, b) => clamp((p - a) / (b - a));

const SAMPLES = 1200;
const PH0 = -1.5;
const PH1 = Math.PI * 2 + 1.35;
const CARD_W = 2.1;
const CARD_H = 1.32;
const CARD_H_PHONE = 2.3; // taller cards on phones, so a photo has room
const GAP = 0.03;
const STEP = CARD_W + GAP;
const NX = 28;
const NY = 3;
const FOV = 35;
const GZ = 8; // depth of the plane the cards land on
const RIB_A = 0.14;
const RIB_B = 0.63;
const INTRO_SECONDS = 6;
const SHOW_ABOUT = [0.78, 0.9];
const NAME_LIFT = 0.1; // fraction of the view height the landed name sits above centre

const VERT = `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const FRAG = `uniform sampler2D map,photo;uniform vec2 photoCover;uniform float aspect,radius,fade,reveal,hasPhoto;varying vec2 vUv;
void main(){
  vec2 q=(abs(vUv-.5)-.5)*vec2(aspect,1.)+radius;
  float d=length(max(q,0.))+min(max(q.x,q.y),0.)-radius;
  float px=fwidth(d),a=1.-smoothstep(-px,px,d);
  if(a<.01)discard;
  vec2 uv=vUv;if(!gl_FrontFacing)uv.x=1.-uv.x;
  vec4 t=texture2D(map,(uv-.5)*vec2(aspect,1.)+.5); // square letter texture, as tall as the card
  vec3 c=mix(vec3(.067,.067,.075),t.rgb,t.a);
  // The photo rises into the card from below as reveal goes 0 to 1.
  vec2 pu=vUv-vec2(0.,1.-reveal);
  if(hasPhoto>.5&&pu.y>=0.)c=texture2D(photo,(pu-.5)*photoCover+.5).rgb;
  float edge=smoothstep(-.012-px,-.012,d)*(1.-fade);
  gl_FragColor=vec4(mix(c,vec3(1.),edge*.1),a*mix(1.,t.a,fade));
}`;

function drawLetter(canvas, letter) {
  const ctx = canvas.getContext("2d");
  const { width: w, height: h } = canvas;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = CARD_INK;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.font = `400 ${Math.round(h * 0.78)}px "Instrument Serif", serif`;
  ctx.fillText(letter, w / 2, h * 0.76);
}

export default function NameRibbon({ children }) {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const aboutRef = useRef(null);
  const cueRef = useRef(null);
  const canvasRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const capRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current; // one screen tall, so the name sits mid-screen
    const canvas = canvasRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // No WebGL (old device, blocked GPU): leave the section empty instead of breaking the page.
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch {
      return undefined;
    }
    renderer.setClearColor(0, 0);
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);

    /* ---------- ribbon rail ---------- */
    const pathP = [];
    const pathT = [];
    let pathLength = 1;
    const pts = [];
    for (let i = 0; i <= 160; i++) {
      const t = i / 160;
      const ph = mix(PH0, PH1, t);
      const cs = Math.cos(ph);
      const u = 2 * t - 1;
      // a shallow arc close to the camera, then long runs far behind it
      const depth = cs > 0 ? 7.6 + 16.4 * cs ** 0.9 : 7.6 + 2.2 * cs;
      const edge = 0.84 + 0.5 * span(0.14 - t, 0, 0.14) + 0.8 * span(t, 0.84, 1);
      pts.push(
        new THREE.Vector3(
          edge * Math.sin(ph) * depth * 0.561,
          0.5 * Math.sign(u) * Math.abs(u) ** 1.4 * depth * 0.63,
          -depth,
        ),
      );
    }
    const curve = new THREE.CatmullRomCurve3(pts, false, "centripetal");
    curve.arcLengthDivisions = 1500;
    pathLength = curve.getLength();
    for (let i = 0; i <= SAMPLES; i++) {
      pathP.push(curve.getPointAt(i / SAMPLES));
      pathT.push(curve.getTangentAt(i / SAMPLES));
    }
    const at = (s, outP, outT) => {
      const f = clamp(s / pathLength) * SAMPLES;
      const i = Math.min(SAMPLES - 1, Math.floor(f));
      const k = f - i;
      outP.lerpVectors(pathP[i], pathP[i + 1], k);
      outT.lerpVectors(pathT[i], pathT[i + 1], k).normalize();
    };

    /* ---------- cards: one letter each ---------- */
    let disposed = false;
    // Card height: the same on the ribbon and once landed. Set in resize().
    let cardH = CARD_H;
    const setCover = (c) => {
      const ca = CARD_W / cardH;
      const va = c.photoAspect;
      c.mat.uniforms.photoCover.value.set(va > ca ? ca / va : 1, va > ca ? 1 : va / ca);
    };
    // Card i carries letter i. On the close pass the lead card is on the right, so the
    // name reads left to right as the strip sweeps past.
    const cards = LETTERS.map((letter, i) => {
      const k = i;
      const letterCanvas = document.createElement("canvas");
      letterCanvas.width = 640;
      letterCanvas.height = 640;
      drawLetter(letterCanvas, letter);
      const tex = new THREE.CanvasTexture(letterCanvas);
      tex.colorSpace = THREE.NoColorSpace;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.anisotropy = 4;
      const geo = new THREE.PlaneGeometry(1, 1, NX, NY);
      const mat = new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        side: THREE.DoubleSide,
        uniforms: {
          map: { value: tex },
          aspect: { value: CARD_W / CARD_H },
          radius: { value: 0.018 },
          fade: { value: 0 }, // 0 = card behind the letter; raise to 1 to show letters only
          photo: { value: null },
          photoCover: { value: new THREE.Vector2(1, 1) },
          reveal: { value: 0 },
          hasPhoto: { value: 0 },
        },
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.frustumCulled = false;
      mesh.visible = false;
      scene.add(mesh);
      const card = { i, k, letter, letterCanvas, tex, geo, mat, mesh, rev: 0, want: 0, photoIdx: k % PHOTOS.length, photoAspect: 1 };
      return card;
    });

    // The photos are shared: a card shows one of them at a time and can switch between them.
    const photos = PHOTOS.map(() => null);
    const applyPhoto = (c) => {
      const ph = photos[c.photoIdx];
      c.mat.uniforms.hasPhoto.value = ph ? 1 : 0;
      if (!ph) return;
      c.photoAspect = ph.aspect;
      c.mat.uniforms.photo.value = ph.tex;
      setCover(c);
    };
    // How many photos have finished (loaded or failed); the one-time wave waits for all of them.
    let photosSettled = 0;
    PHOTOS.forEach((url, idx) => {
      new THREE.TextureLoader().load(
        url,
        (tex) => {
          photosSettled++;
          if (disposed) {
            tex.dispose();
            return;
          }
          tex.colorSpace = THREE.NoColorSpace;
          photos[idx] = { tex, aspect: tex.image.width / tex.image.height };
          cards.forEach((c) => c.photoIdx === idx && applyPhoto(c));
        },
        undefined,
        () => {
          photosSettled++;
        },
      );
    });

    // The name uses a webfont: redraw the letters once it is ready.
    document.fonts?.load('400 100px "Instrument Serif"').then(() => {
      if (disposed) return;
      cards.forEach((c) => {
        drawLetter(c.letterCanvas, c.letter);
        c.tex.needsUpdate = true;
      });
    });

    /* ---------- layout ---------- */
    let W = 1;
    let H = 1;
    let asp = 1;
    let rows = [6, 3];
    let tanH = 0.3153;
    function resize() {
      W = stage.clientWidth || window.innerWidth;
      H = stage.clientHeight || window.innerHeight;
      asp = W / H;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H, false);
      camera.aspect = asp;
      camera.fov = asp < 16 / 9 ? (Math.atan(0.561 / asp) * 360) / Math.PI : FOV;
      camera.updateProjectionMatrix();
      tanH = Math.tan((camera.fov * Math.PI) / 360);
      rows = asp < 0.9 ? [3, 3, 3] : [6, 3]; // SAGNIK / DAS, or SAG / NIK / DAS on phones
      cardH = asp < 0.9 ? CARD_H_PHONE : CARD_H;
      cards.forEach((c) => {
        c.mat.uniforms.aspect.value = CARD_W / cardH;
        setCover(c);
      });
    }

    // Where letter i lands: rows are centred, so the name sits in the middle of the screen.
    function slot(i) {
      const vh = 2 * GZ * tanH;
      const vw = vh * asp;
      const widest = Math.max(...rows);
      const gw = vw * (asp < 0.9 ? 0.55 : 0.84);
      const gap = gw * 0.017;
      const cw = (gw - gap * (widest - 1)) / widest;
      const ch = cw / (CARD_W / cardH);
      const gh = ch * rows.length + gap * 1.6 * (rows.length - 1);
      let r = 0;
      let c = i;
      while (c >= rows[r]) {
        c -= rows[r];
        r++;
      }
      const n = rows[r];
      return {
        x: (c - (n - 1) / 2) * (cw + gap),
        y: gh / 2 - ch / 2 - r * (ch + gap * 1.6) + vh * NAME_LIFT,
        w: cw,
        h: ch,
        vw,
        vh,
        c,
        r,
        n,
      };
    }

    /* ---------- poses ---------- */
    const op = new THREE.Vector3();
    const ot = new THREE.Vector3();
    const up = new THREE.Vector3();
    const Y = new THREE.Vector3(0, 1, 0);
    const vp = new THREE.Vector3();

    function poseRibbon(c, head) {
      const pos = c.geo.attributes.position;
      const centre = head - c.i * STEP;
      for (let iy = 0; iy <= NY; iy++) {
        for (let ix = 0; ix <= NX; ix++) {
          const k = iy * (NX + 1) + ix;
          const lu = ix / NX - 0.5;
          const lv = 0.5 - iy / NY;
          at(centre + lu * CARD_W, op, ot);
          // keep the sheet upright, leaning a little into the turn
          up.copy(Y).addScaledVector(ot, -Y.dot(ot)).normalize();
          vp.copy(op).addScaledVector(up, lv * cardH);
          pos.setXYZ(k, vp.x, vp.y, vp.z);
        }
      }
      pos.needsUpdate = true;
    }

    function poseGrid(c, q) {
      const g = slot(c.k);
      const pos = c.geo.attributes.position;
      const dx = (g.c - (g.n - 1) / 2) * 1.2;
      const dy = g.r < rows.length / 2 ? 1 : -1;
      const central = Math.abs(g.c - (g.n - 1) / 2) < 1;
      const ox = dx * g.vw * 0.62 * (1 - q);
      const oy = dy * g.vh * (central ? 0.95 : 0.34) * (1 - q);
      const tilt = (1 - q) * 0.22 * (g.c - (g.n - 1) / 2 || 0.5) * dy * 0.5;
      const cs = Math.cos(tilt);
      const sn = Math.sin(tilt);
      for (let iy = 0; iy <= NY; iy++) {
        for (let ix = 0; ix <= NX; ix++) {
          const k = iy * (NX + 1) + ix;
          const x = (ix / NX - 0.5) * g.w;
          const y = (0.5 - iy / NY) * g.h;
          pos.setXYZ(
            k,
            g.x + ox + x * cs - y * sn,
            g.y + oy + x * sn + y * cs,
            -GZ - (1 - q) * 0.6 * Math.sin((ix / NX) * Math.PI),
          );
        }
      }
      pos.needsUpdate = true;
    }

    /* ---------- frame ---------- */
    const l1 = line1Ref.current;
    const l2 = line2Ref.current;
    const cap = capRef.current;
    function render(p) {
      const rise = 1 - out(span(p, 0, 0.12));
      const run = mix(-50, 76, span(p, 0, 0.58));
      l1.style.transform = `translate3d(${run}vw,${rise * 34}vh,0)`;
      l2.style.transform = `translate3d(${-run}vw,${rise * 34}vh,0)`;
      cap.style.opacity = 1 - span(p, 0.52, 0.57);
      cap.style.transform = `translate(-50%,calc(-50% + ${rise * 34}vh))`;

      const head = mix(0, pathLength + cards.length * STEP, span(p, RIB_A, RIB_B));
      const end = pathLength - CARD_W;
      for (const c of cards) {
        const s = head - c.i * STEP;
        if (s < end) {
          c.mesh.visible = s > CARD_W;
          if (c.mesh.visible) poseRibbon(c, head);
        } else {
          // each card flies to its slot the moment it leaves the rail
          const st = mix(RIB_A, RIB_B, (end + c.i * STEP) / (pathLength + cards.length * STEP));
          const q = out(span(p, st, st + 0.13));
          c.mesh.visible = q > 0.001;
          if (c.mesh.visible) poseGrid(c, q);
        }
      }
      const about = out(span(p, SHOW_ABOUT[0], SHOW_ABOUT[1]));
      aboutRef.current.style.opacity = about;
      aboutRef.current.style.transform = `translateY(${(1 - about) * 18}px)`;
      aboutRef.current.style.pointerEvents = about > 0.5 ? "auto" : "none";
      // The scroll cue arrives with the intro text and leaves once the page has been scrolled.
      cueRef.current.style.opacity = window.scrollY > 40 ? 0 : about;
      renderer.render(scene, camera);
    }

    /* ---------- loop ---------- */
    const skipIntro = reduceMotion || introSeen;
    let p = skipIntro ? 1 : 0.02;
    let raf = 0;
    let running = false;
    let last = 0;
    // Once the name lands the photos rise one letter at a time and go back down, once. On
    // touch screens it doubles as a hint that the letters can be touched. It pauses while a
    // card is being hovered.
    let waveT = 0;
    let waveDone = skipIntro;
    let userHover = false;
    const WAVE_STEP = 0.32;
    const WAVE_HOLD = 0.75;
    const ROUND = cards.length * WAVE_STEP + WAVE_HOLD;
    const tick = (now) => {
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
      last = now;
      let dirty = false;
      if (p < 1) {
        p = Math.min(1, p + dt / INTRO_SECONDS);
        if (p >= 1) introSeen = true;
        dirty = true;
      }
      if (!waveDone && p >= 1 && !userHover && photosSettled >= PHOTOS.length) {
        waveT += dt;
        for (const c of cards) {
          const t0 = c.i * WAVE_STEP;
          c.want = waveT >= t0 && waveT < t0 + WAVE_HOLD ? 1 : 0;
        }
        if (waveT > ROUND) waveDone = true;
      }
      // Hovered cards slide their photo up; released ones slide it back down.
      for (const c of cards) {
        const d = c.want - c.rev;
        if (d === 0) continue;
        c.rev = Math.abs(d) < 0.002 ? c.want : c.rev + d * Math.min(1, dt * 8);
        c.mat.uniforms.reveal.value = c.rev * c.rev * (3 - 2 * c.rev);
        dirty = true;
      }
      if (dirty) render(p);
      raf = running ? requestAnimationFrame(tick) : 0;
    };
    const start = () => {
      if (running) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    // Only animate while the hero is on screen; it picks up where it left off.
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    io.observe(stage);

    const onResize = () => {
      resize();
      render(p);
    };
    resize();
    render(p);
    window.addEventListener("resize", onResize);
    const onScroll = () => render(p);
    window.addEventListener("scroll", onScroll, { passive: true });

    /* ---------- hover: find the landed card under the pointer ---------- */
    let releaseTimer = 0;
    const hover = (e) => {
      waveDone = true; // the visitor has found it; stop the hint
      clearTimeout(releaseTimer);
      let hit = -1;
      if (p >= HOVER_READY) {
        const box = stage.getBoundingClientRect();
        const first = slot(0);
        const x = ((e.clientX - box.left) / W - 0.5) * first.vw;
        const y = (0.5 - (e.clientY - box.top) / H) * first.vh;
        for (const c of cards) {
          const g = slot(c.k);
          if (Math.abs(x - g.x) < g.w / 2 && Math.abs(y - g.y) < g.h / 2) hit = c.i;
        }
      }
      userHover = hit >= 0;
      cards.forEach((c) => (c.want = c.i === hit ? 1 : 0));
      root.style.cursor = hit >= 0 ? "pointer" : "";
    };
    const unhover = () => {
      clearTimeout(releaseTimer);
      userHover = false;
      cards.forEach((c) => (c.want = 0));
      root.style.cursor = "";
    };
    // A finger lifting should not snap the photo away; let it linger a moment.
    const lift = (e) => {
      if (e.pointerType === "mouse") return;
      clearTimeout(releaseTimer);
      releaseTimer = setTimeout(unhover, 1400);
    };
    const leave = (e) => {
      if (e.pointerType !== "mouse") return;
      unhover();
    };
    root.addEventListener("pointermove", hover);
    root.addEventListener("pointerdown", hover);
    root.addEventListener("pointerleave", leave);
    root.addEventListener("pointerup", lift);
    root.addEventListener("pointercancel", lift);

    return () => {
      disposed = true;
      stop();
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      root.removeEventListener("pointermove", hover);
      root.removeEventListener("pointerdown", hover);
      root.removeEventListener("pointerleave", leave);
      root.removeEventListener("pointerup", lift);
      root.removeEventListener("pointercancel", lift);
      clearTimeout(releaseTimer);
      cards.forEach((c) => {
        c.geo.dispose();
        c.mat.dispose();
        c.tex.dispose();
      });
      photos.forEach((ph) => ph?.tex.dispose());
      renderer.dispose();
    };
  }, []);

  const headline = {
    fontFamily: "'Instrument Serif', serif",
    fontSize: "clamp(40px, 6.7vw, 130px)",
    lineHeight: 1,
    letterSpacing: "-0.055em",
  };

  return (
    <section
      ref={rootRef}
      aria-label={NAME}
      className="relative z-10 flex min-h-dvh touch-pan-y flex-col overflow-hidden"
    >
      <h1 className="sr-only">{NAME}</h1>
      {/* The animation lives in a box exactly one screen tall, whatever the content below. */}
      <div ref={stageRef} className="absolute inset-x-0 top-0 h-svh overflow-hidden">
        <div
          ref={line1Ref}
          aria-hidden
          className="absolute left-0 right-0 whitespace-nowrap text-center text-white will-change-transform"
          style={{ ...headline, top: "calc(50% - .98em)" }}
        >
          <span className="mr-[15vw] inline-block">FRONTEND</span>
        </div>
        <div
          ref={line2Ref}
          aria-hidden
          className="absolute left-0 right-0 whitespace-nowrap text-center text-white will-change-transform"
          style={{ ...headline, top: "calc(50% + .03em)" }}
        >
          <span className="ml-[15vw] inline-block">UX</span>
        </div>
        <div
          ref={capRef}
          aria-hidden
          className="absolute left-1/2 top-1/2 w-[15em] text-center font-medium uppercase leading-[1.3] tracking-[0.03em] text-white"
          style={{ fontSize: "clamp(9px, .74vw, 13px)" }}
        >
          Frontend engineer moving into UX
        </div>
        <canvas
          ref={canvasRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 block h-full w-full"
        />
        {/* Scroll cue: sits at the bottom middle of the first screen. */}
        <div
          ref={cueRef}
          aria-hidden
          className="pointer-events-none absolute bottom-5 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 opacity-0 sm:flex pointer-coarse:hidden transition-opacity duration-500"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Scroll</span>
          <span className="relative h-9 w-px overflow-hidden bg-white/20">
            <span className="scroll-cue-dot absolute inset-x-0 top-0 h-3 bg-white" />
          </span>
        </div>
      </div>
      {/* Sits below the landed name; fades in once the animation has finished. */}
      <div
        ref={aboutRef}
        className="relative z-10 flex flex-col items-center px-6 pb-[12vh] pt-[63svh] text-center opacity-0 sm:pt-[58svh]"
      >
        {children}
      </div>
    </section>
  );
}
