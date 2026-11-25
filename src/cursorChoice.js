import { useSyncExternalStore } from "react";

// Which flower the visitor picked with the cursor switch: "rose" or "lily". It lives here, outside
// React, so every page (home, About me, case studies) and every button, chip and cursor trail
// reads the same choice, and moving between pages keeps it. It is also written on <html> as
// data-cursor so the CSS can swap the cursor image.
// The choice is saved in localStorage, so it survives a refresh.
const KEY = "cursor-flower";
const saved = (() => {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
})();
let choice = saved === "lily" ? "lily" : "rose";
const listeners = new Set();
document.documentElement.dataset.cursor = choice;

// The browser tab's icon follows the choice: a rose or a lily.
const setFavicon = () => {
  const link = document.querySelector('link[rel="icon"]');
  if (link) link.href = `/favicon-${choice}.png`;
};

setFavicon();

export const getCursorChoice = () => choice;

export function setCursorChoice(next) {
  if (next === choice) return;
  choice = next;
  document.documentElement.dataset.cursor = next;
  try {
    localStorage.setItem(KEY, next);
  } catch {
    // Storage can be blocked (private mode); the choice then lasts until the next refresh.
  }
  setFavicon();
  listeners.forEach((fn) => fn());
}

const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export const useCursorChoice = () => useSyncExternalStore(subscribe, getCursorChoice);
