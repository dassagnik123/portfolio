import { useEffect, useRef } from "react";
import { getCursorChoice, setCursorChoice, useCursorChoice } from "./cursorChoice.js";

// The rose cursor's little extras. The cursor itself is a CSS image (see styles.css); this adds
// small roses that now and then come off it as the mouse moves: some float up and fade, others
// are simply left behind where the pointer was and fade out there. Mouse only, and not at all
// with reduced motion. Roses are created and removed straight in the DOM, so moving the mouse
// never re-renders React.
const SPRITES = {
  rose: ["/cursors/trail-rose.png", "/cursors/trail-bud.png", "/cursors/trail-rose.png"],
  lily: ["/cursors/trail-lily.png", "/cursors/trail-lily-b.png", "/cursors/trail-lily.png"],
};
const CHOICES = [
  { id: "rose", label: "Rose cursor", icon: "/cursors/rose-52.png" },
  { id: "lily", label: "Lily cursor", icon: "/cursors/lily-52.png" },
];
const MAX_LIVE = 14;
const rand = (min, max) => min + Math.random() * (max - min);

export default function RoseTrail() {
  const layerRef = useRef(null);
  const flower = useCursorChoice();

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduceMotion) return undefined;

    const layer = layerRef.current;
    let last = null;
    let travelled = 0;
    let next = rand(70, 150); // pixels of movement until the next rose

    const spawn = (x, y) => {
      if (layer.childElementCount >= MAX_LIVE) return;
      const img = document.createElement("img");
      const rises = Math.random() < 0.55;
      const size = rand(22, 40);
      const sprites = SPRITES[getCursorChoice()];
      img.src = sprites[Math.floor(Math.random() * sprites.length)];
      img.alt = "";
      img.draggable = false;
      img.className = rises ? "trail-rose trail-rise" : "trail-rose trail-stay";
      img.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size}px;--dx:${rand(-26, 26).toFixed(0)}px;--rot:${rand(-35, 35).toFixed(0)}deg;--dur:${rand(1.1, 1.7).toFixed(2)}s`;
      img.addEventListener("animationend", () => img.remove(), { once: true });
      layer.appendChild(img);
    };

    // The cursor "dissolves" as you land on a link: a rose the size of the pointer appears where it
    // was and fades and shrinks away, while the real cursor is hidden (see styles.css).
    let overLink = false;
    const dissolve = (x, y) => {
      const img = document.createElement("img");
      img.src = `/cursors/${getCursorChoice()}-40.png`;
      img.alt = "";
      img.draggable = false;
      img.className = "trail-rose trail-dissolve";
      img.style.cssText = `left:${x}px;top:${y}px;width:40px;height:40px`;
      img.addEventListener("animationend", () => img.remove(), { once: true });
      layer.appendChild(img);
    };

    const onMove = (e) => {
      if (e.pointerType !== "mouse") return;
      const onLink = e.target instanceof Element && e.target.closest("a") !== null;
      if (onLink && !overLink) dissolve(e.clientX, e.clientY);
      overLink = onLink;
      // Over the cursor switch the normal pointer shows, so no trail there either.
      if (e.target instanceof Element && e.target.closest(".cursor-switch")) {
        last = null;
        return;
      }
      // No trail over a button or link: the cursor is hidden there.
      if (onLink) {
        last = null;
        return;
      }
      if (last) travelled += Math.hypot(e.clientX - last.x, e.clientY - last.y);
      last = { x: e.clientX, y: e.clientY };
      if (travelled >= next) {
        travelled = 0;
        next = rand(70, 170);
        spawn(e.clientX, e.clientY);
      }
    };
    const onLeave = () => {
      last = null;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <>
      <div ref={layerRef} className="trail-layer" aria-hidden />
      <div className="cursor-switch" role="radiogroup" aria-label="Cursor">
        {CHOICES.map(({ id, label, icon }) => (
          <button key={id} type="button" role="radio" aria-checked={flower === id} aria-label={label} title={label} className={`cursor-choice${flower === id ? " is-on" : ""}`} onClick={() => setCursorChoice(id)}>
            <img src={icon} alt="" draggable={false} />
          </button>
        ))}
      </div>
    </>
  );
}
