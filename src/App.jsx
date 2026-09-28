import { useEffect, useRef, useState } from "react";
import CustomCursor from "./components/CustomCursor";
import PersonalArchive from "./components/PersonalArchive";
import ProjectDetail from "./components/ProjectDetail";
import TopControls from "./components/TopControls";
import WorkPage from "./components/WorkPage";

export default function App() {
  const [mode, setMode] = useState("work");
  // The switch flips first (so its slide is visible), then the page crossfades through black.
  const [switchMode, setSwitchMode] = useState("work");
  const [fading, setFading] = useState(false);
  const switching = useRef(false);
  const [activeProject, setActiveProject] = useState(null);
  const isPersonal = mode === "personal";

  // The case study is a fixed overlay; keep the page behind it from scrolling.
  useEffect(() => {
    if (!activeProject) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeProject]);

  const toggleMode = () => {
    if (switching.current) return;
    const next = switchMode === "work" ? "personal" : "work";
    const swap = () => {
      setActiveProject(null);
      setMode(next);
      window.scrollTo(0, 0);
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
            onOpenProject={setActiveProject}
          />
          {activeProject && (
            <ProjectDetail project={activeProject} onBack={() => setActiveProject(null)} />
          )}
        </>
      )}
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-0 z-[200] bg-black transition-opacity ease-in-out ${
          fading ? "opacity-100 duration-300" : "opacity-0 duration-500"
        }`}
      />
      <CustomCursor />
    </>
  );
}
