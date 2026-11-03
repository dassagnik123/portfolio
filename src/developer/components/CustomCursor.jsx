import { useEffect, useRef } from "react";

const TARGETS = ".card, a, button, [role='button'], #grid figure";
// Room needed below the cursor before the label flips above it.
const LABEL_FLIP_ZONE = 80;

// Soft dot that trails the pointer and widens over anything clickable. Elements (or sections)
// with data-cursor="…" also get a small label pill that follows below the cursor. Shared by 9-5 and 5-9.
export default function CustomCursor() {
  const dotRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const dot = dotRef.current;
    const label = labelRef.current;
    const text = label.firstChild;
    const pos = { x: -100, y: -100, tx: -100, ty: -100 };
    let raf = 0;

    const move = (e) => {
      pos.tx = e.clientX;
      pos.ty = e.clientY;
    };
    const over = (e) => {
      const hit = e.target.closest?.(TARGETS);
      dot.classList.toggle("wide", Boolean(hit));
      const labelled = e.target.closest?.("[data-cursor]");
      const next = labelled?.dataset.cursor ?? "";
      if (next) text.textContent = next;
      label.classList.toggle("show", Boolean(next));
    };
    const leave = () => label.classList.remove("show");
    const loop = () => {
      pos.x += (pos.tx - pos.x) * 0.2;
      pos.y += (pos.ty - pos.y) * 0.2;
      const t = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      dot.style.transform = t;
      label.style.transform = t;
      label.classList.toggle("above", pos.y > window.innerHeight - LABEL_FLIP_ZONE);
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    document.documentElement.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={labelRef} className="cursor-label" aria-hidden="true">
        <span />
      </div>
    </>
  );
}
