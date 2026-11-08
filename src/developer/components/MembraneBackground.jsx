import { useEffect, useRef } from "react";

const COLS = 50;
const ROWS = 30;
const SPRING = 0.025;
const DAMPING = 0.93;
const SPREAD = 0.18;
const HOVER_RADIUS = 130;
const HOVER_FORCE = 15;
const PRESS_RADIUS = 200;
const PRESS_FORCE = 30;

// A living mesh that fills the page behind everything else. Vertices sit on a grid and are tied
// back to it with springs; the cursor pushes them away, a press pushes harder, and the motion
// ripples through neighbouring vertices. Listens on the window so the content above it can keep
// its own pointer handling.
export default function MembraneBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let verts = [];
    let raf = 0;
    const mouse = { x: -9999, y: -9999, pressing: false, inside: false };

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      verts = [];
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const x = (c / (COLS - 1)) * width;
          const y = (r / (ROWS - 1)) * height;
          verts.push({ x, y, restX: x, restY: y, vx: 0, vy: 0, offsetZ: 0, velZ: 0 });
        }
      }
    };

    const step = (time) => {
      const t = time * 0.001;
      const radius = mouse.pressing ? PRESS_RADIUS : HOVER_RADIUS;
      const strength = mouse.pressing ? PRESS_FORCE : HOVER_FORCE;

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const v = verts[r * COLS + c];

          const breathe = Math.sin(t * 0.6 + c * 0.15 + r * 0.12) * 2;
          v.velZ += (breathe - v.offsetZ) * 0.002;

          const dx = v.x - mouse.x;
          const dy = v.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < radius && dist > 0.01) {
            const force = (1 - dist / radius) * strength;
            v.velZ += force * 0.4;
            v.vx += (dx / dist) * force * 0.12;
            v.vy += (dy / dist) * force * 0.12;
          }

          v.vx += (v.restX - v.x) * SPRING;
          v.vy += (v.restY - v.y) * SPRING;
          v.velZ -= v.offsetZ * SPRING * 1.5;

          v.vx *= DAMPING;
          v.vy *= DAMPING;
          v.velZ *= DAMPING;

          v.x += v.vx;
          v.y += v.vy;
          v.offsetZ += v.velZ;
        }
      }

      // Waves: each vertex's depth velocity is pulled toward its four neighbours.
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const v = verts[r * COLS + c];
          if (c > 0) v.velZ += (verts[r * COLS + c - 1].offsetZ - v.offsetZ) * SPREAD;
          if (c < COLS - 1) v.velZ += (verts[r * COLS + c + 1].offsetZ - v.offsetZ) * SPREAD;
          if (r > 0) v.velZ += (verts[(r - 1) * COLS + c].offsetZ - v.offsetZ) * SPREAD;
          if (r < ROWS - 1) v.velZ += (verts[(r + 1) * COLS + c].offsetZ - v.offsetZ) * SPREAD;
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;
      const maxDist = Math.hypot(cx, cy);
      const zoneW = width * 0.35;
      const zoneH = height * 0.35;

      ctx.strokeStyle = "rgba(255,255,255,0.018)";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const v = verts[r * COLS + c];
          const sy = v.y - v.offsetZ * 0.3;
          if (c < COLS - 1) {
            const n = verts[r * COLS + c + 1];
            ctx.moveTo(v.x, sy);
            ctx.lineTo(n.x, n.y - n.offsetZ * 0.3);
          }
          if (r < ROWS - 1) {
            const n = verts[(r + 1) * COLS + c];
            ctx.moveTo(v.x, sy);
            ctx.lineTo(n.x, n.y - n.offsetZ * 0.3);
          }
        }
      }
      ctx.stroke();

      for (const v of verts) {
        const sy = v.y - v.offsetZ * 0.3;
        const disp = Math.hypot(v.x - v.restX, v.y - v.restY) + Math.abs(v.offsetZ);
        const centerFactor = Math.pow(1 - Math.min(1, Math.hypot(v.restX - cx, v.restY - cy) / maxDist * 1.4), 1.5);

        let r = 130 + (245 - 130) * centerFactor;
        let g = 130 + (235 - 130) * centerFactor;
        let b = 140 + (210 - 140) * centerFactor;
        if (disp > 3) {
          const k = Math.min(1, (disp - 3) / 12);
          r += (255 - r) * k;
          g += (252 - g) * k;
          b += (245 - b) * k;
        }

        const size = 0.6 + centerFactor * 0.6 + (disp > 0.5 ? disp * 0.03 : 0);
        const baseAlpha = 0.06 + centerFactor * 0.18;
        const activeAlpha = disp > 0.5 ? Math.min(0.9, disp * 0.05) : 0;
        let alpha = Math.max(baseAlpha, activeAlpha);

        // Keep the area behind the content readable while the cursor is on the page.
        if (mouse.inside) {
          const e = ((v.restX - cx) / zoneW) ** 2 + ((v.restY - cy) / zoneH) ** 2;
          if (e < 1) alpha *= 1 - (1 - e) * 0.7;
        }

        const color = `${Math.round(r)},${Math.round(g)},${Math.round(b)}`;
        if (disp > 1.5 || centerFactor > 0.4) {
          ctx.fillStyle = `rgba(${color},${alpha * 0.25})`;
          ctx.beginPath();
          ctx.arc(v.x, sy, size + 4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = `rgba(${color},${alpha})`;
        ctx.beginPath();
        ctx.arc(v.x, sy, size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const frame = (time) => {
      step(time);
      draw();
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.inside = true;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
      mouse.inside = false;
      mouse.pressing = false;
    };
    const onDown = () => {
      mouse.pressing = true;
    };
    const onUp = () => {
      mouse.pressing = false;
    };
    const onResize = () => build();

    build();
    if (reduceMotion) {
      draw();
    } else {
      raf = requestAnimationFrame(frame);
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
      window.addEventListener("pointerup", onUp, { passive: true });
      document.documentElement.addEventListener("mouseleave", onLeave);
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="membrane-bg pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
