import { useEffect } from "react";
import { FISH, FISH_COLOURS, FISH_NAMES } from "./fishArt";
import PixelArt from "./PixelArt";

// The question while his line is in the water: guess the fish's colour. Four buttons, each with
// a little fish in that colour and its name. Keys 1–4 answer; Esc reels in without guessing.
// onPick(i): the guess; onSkip: reel in.
export default function FishQuiz({ onPick, onSkip }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onSkip();
      const n = Number(e.key);
      if (n >= 1 && n <= FISH_COLOURS.length) onPick(n - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onPick, onSkip]);

  return (
    <div role="dialog" aria-label="Guess the colour of the fish" className="fish-card fish-quiz">
      <p className="fish-card-title">What colour is the fish?</p>
      <p className="fish-card-hint">Something's nibbling. Take a guess!</p>
      <div className="fish-options">
        {FISH_COLOURS.map((colours, i) => (
          <button key={FISH_NAMES[i]} type="button" onClick={() => onPick(i)}>
            <PixelArt art={FISH} palette={colours} pixel={3} />
            <span>{FISH_NAMES[i]}</span>
          </button>
        ))}
      </div>
      <button type="button" className="fish-skip" onClick={onSkip}>
        Reel in<span className="fish-skip-key"> (Esc)</span>
      </button>
    </div>
  );
}

// The result, in the same spot: "Correct!" or what colour it really was.
export function FishResult({ correct, answer, streak }) {
  const name = FISH_NAMES[answer].toLowerCase();
  const a = /^[aeiou]/.test(name) ? "an" : "a"; // an orange fish, a red one
  return (
    <div role="status" className={`fish-card fish-result ${correct ? "is-win" : "is-miss"}`}>
      <p className="fish-card-title">{correct ? "Correct!" : "So close!"}</p>
      <p className="fish-card-hint">
        {correct
          ? `It was ${a} ${name} fish.${streak > 1 ? ` ${streak} in a row!` : ""}`
          : `It was ${a} ${name} fish. Cast again to try once more.`}
      </p>
    </div>
  );
}
