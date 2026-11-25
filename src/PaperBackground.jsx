import { useEffect, useRef } from "react";
import { PAPER, pick, seeded } from "./palette.js";

// Warm vanilla canvas behind the page: long, loose cream strokes and a faint grain so the
// background reads as painted paper rather than a flat fill or a gradient.
export default function PaperBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const paint = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const rand = seeded(7);

      ctx.fillStyle = PAPER.base;
      ctx.fillRect(0, 0, w, h);

      // Broad strokes, mostly the lighter creams, a few warmer ones.
      ctx.lineCap = "round";
      const count = Math.round((w * h) / 9000);
      for (let i = 0; i < count; i++) {
        const x = rand() * w;
        const y = rand() * h;
        const len = 80 + rand() * 260;
        const angle = -0.35 + (rand() - 0.5) * 0.5;
        const warm = rand() < 0.18;
        ctx.strokeStyle = warm ? pick(PAPER.warm, rand) : pick(PAPER.light, rand);
        ctx.globalAlpha = warm ? 0.07 + rand() * 0.06 : 0.25 + rand() * 0.3;
        ctx.lineWidth = 14 + rand() * 40;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(
          x + Math.cos(angle) * len * 0.5 + (rand() - 0.5) * 30,
          y + Math.sin(angle) * len * 0.5 + (rand() - 0.5) * 30,
          x + Math.cos(angle) * len,
          y + Math.sin(angle) * len,
        );
        ctx.stroke();
      }

      // Pigment grain.
      const grains = Math.round((w * h) / 120);
      for (let i = 0; i < grains; i++) {
        ctx.fillStyle = rand() < 0.5 ? PAPER.grain[0] : PAPER.grain[1];
        ctx.globalAlpha = 0.05 + rand() * 0.07;
        ctx.fillRect(rand() * w, rand() * h, 1, 1);
      }
      ctx.globalAlpha = 1;
    };

    paint();
    window.addEventListener("resize", paint);
    return () => window.removeEventListener("resize", paint);
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="paper" />;
}
