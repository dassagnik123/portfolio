import { useEffect, useRef } from "react";

const TARGETS = ".card, a, button, [role='button'], #grid figure";

// Soft dot that trails the pointer and widens over anything clickable. Shared by 9-5 and 5-9.
export default function CustomCursor() {
  const dotRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const dot = dotRef.current;
    const pos = { x: -100, y: -100, tx: -100, ty: -100 };
    let raf = 0;

    const move = (e) => {
      pos.tx = e.clientX;
      pos.ty = e.clientY;
    };
    const over = (e) => {
      const hit = e.target.closest?.(TARGETS);
      dot.classList.toggle("wide", Boolean(hit));
    };
    const loop = () => {
      pos.x += (pos.tx - pos.x) * 0.2;
      pos.y += (pos.ty - pos.y) * 0.2;
      dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
    };
  }, []);

  return <div ref={dotRef} className="cursor-dot" aria-hidden="true" />;
}
