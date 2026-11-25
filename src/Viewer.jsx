import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

// The enlarged photo: a dialog over the page. Esc or the backdrop closes it, the arrow keys (or the
// buttons) move between the photos, and focus goes back to where it was. Rendered straight into
// <body>, so it sits above every section and the top bar.
export default function Viewer({ photos, index, onClose, onMove }) {
  const closeRef = useRef(null);
  useEffect(() => {
    const opener = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onMove(1);
      if (e.key === "ArrowLeft") onMove(-1);
    };
    window.addEventListener("keydown", onKey);
    const overflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = overflow;
      if (opener instanceof HTMLElement) opener.focus();
    };
  }, [onClose, onMove]);

  const photo = photos[index];
  return createPortal(
    <div className="viewer" role="dialog" aria-modal="true" aria-label={`${photo.label} photo ${index + 1} of ${photos.length}`} onClick={onClose}>
      <button ref={closeRef} className="viewer-btn viewer-close" onClick={onClose} aria-label="Close photo">
        ×
      </button>
      <button
        className="viewer-btn viewer-prev"
        onClick={(e) => {
          e.stopPropagation();
          onMove(-1);
        }}
        aria-label="Previous photo"
      >
        ‹
      </button>
      <img className="viewer-img" src={photo.src} alt={`${photo.label}, photo ${index + 1}`} onClick={(e) => e.stopPropagation()} />
      <button
        className="viewer-btn viewer-next"
        onClick={(e) => {
          e.stopPropagation();
          onMove(1);
        }}
        aria-label="Next photo"
      >
        ›
      </button>
      <p className="viewer-count" aria-hidden>
        {photo.label} · {index + 1} / {photos.length}
      </p>
    </div>,
    document.body,
  );
}
