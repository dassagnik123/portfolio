// The treasure dig's card (same pixel look as the fish game's): the clue after each dig, and
// the result when the chest is found.

const CLUES = {
  cold: ["Cold…", "Nothing here. The chest is far from this spot."],
  warm: ["Warm!", "Getting closer. The chest is a couple of spots away."],
  hot: ["HOT!", "Very close! The chest is right next to this spot."],
};

export function DigClue({ level, digs }) {
  const [title, hint] = CLUES[level];
  return (
    <div role="status" className="fish-card fish-result is-miss">
      <p className="fish-card-title">{title}</p>
      <p className="fish-card-hint">
        {hint} Digs so far: {digs}.
      </p>
    </div>
  );
}

export function DigFound({ digs, best, isBest }) {
  return (
    <div role="status" className="fish-card fish-result is-win">
      <p className="fish-card-title">{isBest ? "New record!" : "You found it!"}</p>
      <p className="fish-card-hint">
        Treasure in {digs} {digs === 1 ? "dig" : "digs"}. Best: {best}. Click a spot to play again.
      </p>
    </div>
  );
}
