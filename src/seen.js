// First-visit hints: remembers, per hint, that the visitor has already tried the thing, so the
// hint never shows again. Without storage (a private window) the hint just shows each visit.
const key = (name) => `portfolio-seen-${name}`;

export const hasSeen = (name) => {
  try {
    return localStorage.getItem(key(name)) === "1";
  } catch {
    return false;
  }
};

export const markSeen = (name) => {
  try {
    localStorage.setItem(key(name), "1");
  } catch {
    // no storage: nothing to remember
  }
};
