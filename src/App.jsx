import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import Btn from "./Btn.jsx";
import CaseStudy from "./CaseStudy.jsx";
import { contact } from "./data.js";
import About from "./About.jsx";
import AboutCategory from "./AboutCategory.jsx";
import Contact from "./Contact.jsx";
import Experience from "./Experience.jsx";
import Flowers from "./Flowers.jsx";
import Loader from "./Loader.jsx";
import Nav from "./Nav.jsx";
import Portrait from "./Portrait.jsx";
import Projects from "./Projects.jsx";
import PaperBackground from "./PaperBackground.jsx";
import RoseTrail from "./RoseTrail.jsx";


// "#/case-study/<slug>" opens a case study, "#/about/<category>" opens a photo gallery; anything
// else is the home page.
const readRoute = () => {
  const match = window.location.hash.match(/^#\/(case-study|about)\/([\w-]+)/);
  return match ? { page: match[1], slug: match[2] } : null;
};

export default function App() {
  const [route, setRoute] = useState(readRoute);
  // The loading screen is only for opening (or refreshing) the home page. It is not shown on a case
  // study or gallery page, not when you open one of them directly or refresh it, and not when you
  // come back to the home page from one of them: those pages simply stay as they are.
  const [loading, setLoading] = useState(() => readRoute() === null);
  const doneLoading = useCallback(() => setLoading(false), []);

  useEffect(() => {
    const onHash = () => setRoute(readRoute());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // The plain cream screen from index.html goes as soon as the app is there (on the home page the
  // loading screen removes it itself, a moment earlier).
  useLayoutEffect(() => {
    document.getElementById("boot")?.remove();
  }, []);

  // New page: start at the top. Back to the home page: land on the section named in the address
  // (#work, #about...).
  useEffect(() => {
    if (route) window.scrollTo(0, 0);
    else {
      const id = window.location.hash.slice(1);
      if (id) document.getElementById(id)?.scrollIntoView();
    }
  }, [route]);

  if (route) {
    return (
      <>
        <PaperBackground />
        {route.page === "about" ? <AboutCategory slug={route.slug} /> : <CaseStudy slug={route.slug} />}
        <RoseTrail />
      </>
    );
  }

  return (
    <>
      <PaperBackground />
      <Nav />
      <main className="hero" id="home">
        <section className="hero-text">
          <p className="eyebrow">Design Engineer · UX &amp; Product Design</p>
          <h1 className="name">Sagnik Das</h1>
          <span className="brush-rule" aria-hidden />
          <p className="lead">
            I'm Sagnik — a <b>Design Engineer</b> with 4+ years of experience bridging{" "}
            <b>frontend engineering</b> and <b>product design</b>. I've worked on{" "}
            <b>B2B SaaS dashboards</b>, customer support tools, procurement workflows, and HR
            portals, turning complex requirements into intuitive, scalable, and visually polished
            interfaces.
          </p>
          <div className="actions">
            <Btn variant="solid" href="#work">
              View My Work
            </Btn>
            <div className="actions-extra">
              <Btn variant="line" href={contact.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </Btn>
              <Btn variant="line" href={contact.resume} target="_blank" rel="noreferrer">
                Resume
              </Btn>
            </div>
          </div>
        </section>
        <figure className="portrait-wrap">
          <Portrait />
          <Flowers />
        </figure>
      </main>
      <Projects />
      <Experience />
      <About />
      <Contact />
      <RoseTrail />
      {loading && <Loader onDone={doneLoading} />}
    </>
  );
}
