import { useState } from "react";
import { isMuted, setMuted, unlockAudio } from "../sound";
import PixelArt from "./PixelArt";

// Pixel speaker in the corner: sound waves when on, an X when muted. The choice is remembered.
const PALETTE = { K: "currentColor" }; // follows the button's text colour, so it themes with it

const ON = [
  "...K.....",
  "..KK...K.",
  "KKKK.K..K",
  "KKKK.K..K",
  "KKKK.K..K",
  "..KK...K.",
  "...K.....",
];

const OFF = [
  "...K.....",
  "..KK.....",
  "KKKK.K.K.",
  "KKKK..K..",
  "KKKK.K.K.",
  "..KK.....",
  "...K.....",
];

export default function SoundToggle() {
  const [muted, setMutedState] = useState(isMuted);

  const toggle = () => {
    unlockAudio();
    setMuted(!muted);
    setMutedState(!muted);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={muted ? "Turn sound on" : "Turn sound off"}
      aria-pressed={!muted}
      className="sound-btn cursor-pointer border-2 border-(--ui-ink) bg-(--ui-bg) p-2 text-(--ui-ink) shadow-[3px_3px_0_var(--ui-shadow)] transition-transform active:translate-y-px"
    >
      <PixelArt art={muted ? OFF : ON} palette={PALETTE} pixel={3} />
    </button>
  );
}
