import { useState } from "react";
import Gallery from "./components/Gallery";
import {
  EmailIcon,
  LinkedInIcon,
  PhoneIcon,
  ResumeIcon,
  TwitterIcon,
} from "./components/icons";
import ModeToggle from "./components/ModeToggle";
import Polaroid from "./components/Polaroid";
import ProjectCard from "./components/ProjectCard";
import ProjectDetail from "./components/ProjectDetail";
import { contact, hobbyColumns, modes, projects, socials } from "./data";

function Badge({ children, active, accentClass }) {
  return (
    <span
      className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold tracking-wide ${
        active
          ? `${accentClass.border} ${accentClass.text}`
          : "border-current/25 text-current/70"
      }`}
    >
      {children}
    </span>
  );
}

export default function App() {
  const [mode, setMode] = useState("work");
  const [activeHobby, setActiveHobby] = useState(null);
  const [activeProject, setActiveProject] = useState(null);
  const isPersonal = mode === "personal";
  const content = modes[mode];

  const accentClass = isPersonal
    ? { text: "text-accent-personal", border: "border-accent-personal" }
    : { text: "text-accent-work", border: "border-accent-work" };

  return (
    <div
      className={`flex h-dvh flex-col overflow-hidden border-t-4 border-black transition-colors duration-500 ${
        isPersonal ? "bg-cream text-neutral-900" : "bg-neutral-950 text-white"
      }`}
    >
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-4 px-6 py-5 sm:px-10 lg:px-14">
        <span className="font-display text-2xl font-extrabold">SD.</span>
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium tracking-wide sm:gap-6 sm:text-sm">
          <div className="flex items-center gap-3.5">
            <a
              href={socials.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="opacity-70 transition hover:opacity-100"
            >
              <LinkedInIcon />
            </a>
            <a
              href={socials.twitter}
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
              className="opacity-70 transition hover:opacity-100"
            >
              <TwitterIcon />
            </a>
            <a
              href={socials.resume}
              target="_blank"
              rel="noreferrer"
              aria-label="Resume"
              className="flex items-center gap-1.5 opacity-70 transition hover:opacity-100"
            >
              <ResumeIcon />
              <span>Resume</span>
            </a>
          </div>
          <ModeToggle mode={mode} onToggle={() => setMode(isPersonal ? "work" : "personal")} />
        </div>
      </header>

      <main className="grid min-h-0 flex-1 grid-cols-1 items-stretch gap-6 overflow-hidden px-6 pb-6 sm:px-10 lg:grid-cols-[minmax(0,480px)_1fr] lg:gap-10 lg:px-14">
        <section className="flex min-h-0 flex-col justify-start gap-5 overflow-hidden pt-10 lg:pt-16">
          <div className="flex flex-nowrap gap-1.5">
            {content.badges.map((badge, i) => (
              <Badge key={badge} active={i === 0} accentClass={accentClass}>
                {badge}
              </Badge>
            ))}
          </div>

          <h1 className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            {content.name[0]}
            <br />
            {content.name[1]}
          </h1>

          <p className="max-w-md text-base leading-relaxed opacity-90 lg:text-lg">
            {content.lead}
          </p>
          <p className="max-w-md text-sm leading-relaxed opacity-60 lg:text-base">
            {content.sub}
          </p>

          <div className="flex flex-col gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${contact.email}`}
                className={`flex items-center gap-2 rounded-full border-2 px-6 py-3 text-sm font-semibold transition hover:text-neutral-950 ${accentClass.border} ${accentClass.text} ${
                  isPersonal ? "hover:bg-accent-personal" : "hover:bg-accent-work"
                }`}
              >
                <EmailIcon />
                Email me
              </a>
              <a
                href={`tel:${contact.phone}`}
                className="flex items-center gap-2 rounded-full border-2 border-current/20 px-6 py-3 text-sm font-semibold opacity-80"
              >
                <PhoneIcon />
                {contact.phone}
              </a>
            </div>
            <a
              href={`mailto:${contact.email}`}
              className="flex w-fit items-center gap-1.5 text-sm opacity-60 transition hover:opacity-100 hover:underline"
            >
              <EmailIcon className="h-3.5 w-3.5" />
              {contact.email}
            </a>
          </div>
        </section>

        <section className="min-h-0">
          {isPersonal ? (
            <div className="grid h-full grid-cols-2 gap-x-10 gap-y-6 p-8 sm:grid-cols-3">
              {hobbyColumns.map((column, colIndex) => (
                <div
                  key={colIndex}
                  className="flex h-full flex-col justify-center gap-10"
                >
                  {column.map((hobby, itemIndex) => (
                    <Polaroid
                      key={hobby.label}
                      {...hobby}
                      delay={colIndex * 0.4 + itemIndex * 0.7}
                      onClick={() => setActiveHobby(hobby)}
                      className={colIndex === 2 ? "hidden sm:flex" : ""}
                    />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full gap-3">
              <div className="flex w-6 shrink-0 items-center justify-center">
                <span className="[writing-mode:vertical-rl] rotate-180 text-xs font-semibold tracking-[0.3em] text-neutral-500">
                  PROJECTS
                </span>
              </div>
              <ProjectCard
                project={projects[0]}
                onClick={() => setActiveProject(projects[0])}
                className="min-h-0 h-full flex-1"
              />
            </div>
          )}
        </section>
      </main>

      {activeHobby && (
        <Gallery hobby={activeHobby} onBack={() => setActiveHobby(null)} />
      )}
      {activeProject && (
        <ProjectDetail
          project={activeProject}
          onBack={() => setActiveProject(null)}
        />
      )}
    </div>
  );
}
