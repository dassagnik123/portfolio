import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./tokens.css";
import "./styles.css";

// A refresh always starts at the top of the home page. The browser would otherwise jump back to the
// section named in the address (#work, #experience...) or to where it was scrolled. A case study or
// gallery page (#/case-study/..., #/about/...) is kept, so refreshing it stays on that page.
if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
if (!/^#\/(case-study|about)\//.test(window.location.hash)) {
  window.history.replaceState(null, "", window.location.pathname + window.location.search);
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
