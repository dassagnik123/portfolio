import { useEffect, useRef, useState } from "react";
import CustomCursor from "./components/CustomCursor";
import PersonalArchive from "./components/PersonalArchive";
import ProjectDetail from "./components/ProjectDetail";
import TopControls from "./components/TopControls";
import WorkPage from "./components/WorkPage";
import { archive } from "./data";

export default function App() {
  const [mode, setMode] = useState("work");
  // The switch flips first (so its slide is visible), then the page crossfades through black.
  const [switchMode, setSwitchMode] = useState("work");
  const [fading, setFading] = useState(false);
  const switching = useRef(false);
  // The name-and-progress screen shown on the way back to 9-5 (5-9 has its own).
  const [returning, setReturning] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  // Where the opened card sat on screen, so its case study can grow out of (and shrink back into) it.
  const [origin, setOrigin] = useState(null);
  const isPersonal = mode === "personal";

  // The case study is a fixed overlay; keep the page behind it from scrolling.
  useEffect(() => {
    if (!activeProject) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeProject]);

  // Warm the cache with the 5-9 thumbnails once 9-5 has settled, so the sphere opens complete.
  useEffect(() => {
    const prefetch = () => archive.shots.forEach((shot) => (new Image().src = shot.thumb));
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1500));
    const start = () => idle(prefetch);
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, []);

  const toggleMode = () => {
    if (switching.current) return;
    const next = switchMode === "work" ? "personal" : "work";
    const swap = () => {
      setActiveProject(null);
      setMode(next);
      window.scrollTo(0, 0);
      if (next === "work") {
        setReturning(true);
        setTimeout(() => setReturning(false), 1100);
      }
    };
    setSwitchMode(next);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      swap();
      return;
    }
    switching.current = true;
    setTimeout(() => setFading(true), 260);
    setTimeout(() => {
      swap();
      requestAnimationFrame(() => {
        setFading(false);
        switching.current = false;
      });
    }, 260 + 340);
  };

  return (
    <>
      {isPersonal ? (
        <>
          <PersonalArchive />
          <TopControls
            mode={switchMode}
            onToggle={toggleMode}
            className="top-controls-fixed fixed right-6 top-[calc(22px+env(safe-area-inset-top))] z-[95] transition-opacity sm:right-10 lg:right-14"
          />
        </>
      ) : (
        <>
          <WorkPage
            controls={<TopControls mode={switchMode} onToggle={toggleMode} />}
            onOpenProject={(project, rect) => {
              setOrigin(rect ?? null);
              setActiveProject(project);
            }}
          />
          {activeProject && (
            <ProjectDetail project={activeProject} origin={origin} onBack={() => setActiveProject(null)} />
          )}
        </>
      )}
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-0 z-[200] bg-black transition-opacity ease-in-out ${
          fading ? "opacity-100 duration-300" : "opacity-0 duration-500"
        }`}
      />
      <div
        aria-hidden={!returning}
        role={returning ? "status" : undefined}
        className={`pointer-events-none fixed inset-0 z-[210] grid place-content-center justify-items-center gap-6 bg-black transition-opacity duration-500 ${
          returning ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className="text-[clamp(32px,4.4vw,56px)] tracking-[-0.01em] text-[#f4f2ef]"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          {archive.name[0]} <em>{archive.name[1]}</em>
        </div>
        <div className="relative h-px w-[clamp(120px,17vw,210px)] overflow-hidden bg-[#f4f2ef]/15">
          {returning && <span className="return-bar absolute inset-0 bg-[#f4f2ef]" />}
        </div>
        <div className="text-[10px] uppercase tracking-[0.26em] text-[#f4f2ef]/40">Working hours</div>
      </div>
      <CustomCursor />
    </>
  );
}
