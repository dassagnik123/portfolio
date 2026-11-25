import { useEffect, useState } from "react";
import Btn from "./Btn.jsx";
import { contact } from "./data.js";

// Top navigation: four tabs that scroll to the sections of the page. The tab for the section
// you are in is highlighted, and the bar turns into a soft cream band once you scroll.
const TABS = [
  { id: "home", label: "Home" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export default function Nav() {
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // A section is "current" while it crosses a line a little above the middle of the screen.
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    TABS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <header className={`nav${scrolled ? " is-scrolled" : ""}`}>
      <a className="nav-mark" href="#home">
        Sagnik Das
      </a>
      <nav aria-label="Main">
        <ul className="nav-tabs">
          {TABS.map(({ id, label }) => (
            <li key={id}>
              <a className={`nav-tab${active === id ? " is-active" : ""}`} href={`#${id}`} aria-current={active === id ? "true" : undefined}>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="nav-links">
        <Btn variant="line" href={contact.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </Btn>
        <Btn variant="line" href={contact.resume} target="_blank" rel="noreferrer">
          Resume
        </Btn>
      </div>
    </header>
  );
}
