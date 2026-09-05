import { useState } from "react";
import ModeToggle from "./components/ModeToggle";
import Polaroid from "./components/Polaroid";
import ProjectCard from "./components/ProjectCard";
import { contact, hobbyColumns, modes, projects } from "./data";

function Badge({ children, active, accentClass }) {
  return (
    <span
      className={`rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wide ${
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
  const isPersonal = mode === "personal";
  const content = modes[mode];

  const accentClass = isPersonal
    ? { text: "text-accent-personal", border: "border-accent-personal" }
    : { text: "text-accent-work", border: "border-accent-work" };

  return (
    <div
      className={`min-h-screen border-t-4 border-black transition-colors duration-500 ${
        isPersonal ? "bg-cream text-neutral-900" : "bg-neutral-950 text-white"
      }`}
    >
      <header className="flex flex-wrap items-center justify-between gap-4 px-6 py-7 sm:px-10 lg:px-14">
        <span className="font-display text-2xl font-extrabold">SD.</span>
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium tracking-wide sm:gap-6 sm:text-sm">
          <span className="opacity-70">{contact.email.toUpperCase()}</span>
          <span className="opacity-30">/</span>
          <span className="opacity-70">{contact.phone}</span>
          <ModeToggle mode={mode} onToggle={() => setMode(isPersonal ? "work" : "personal")} />
        </div>
      </header>

      <main className="grid grid-cols-1 items-start gap-10 px-6 pb-16 sm:px-10 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-12 lg:px-14">
        <section className="flex flex-col justify-start gap-6 pt-4">
          <div className="flex flex-wrap gap-2">
            {content.badges.map((badge, i) => (
              <Badge key={badge} active={i === 0} accentClass={accentClass}>
                {badge}
              </Badge>
            ))}
          </div>

          <h1 className="font-display text-6xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl">
            {content.name[0]}
            <br />
            {content.name[1]}
          </h1>

          <p className="max-w-md text-lg leading-relaxed opacity-90">
            {content.lead}
          </p>
          <p className="max-w-md text-base leading-relaxed opacity-60">
            {content.sub}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={`mailto:${contact.email}`}
              className={`rounded-full border-2 px-6 py-3 text-sm font-semibold transition hover:text-neutral-950 ${accentClass.border} ${accentClass.text} ${
                isPersonal ? "hover:bg-accent-personal" : "hover:bg-accent-work"
              }`}
            >
              Email me
            </a>
            <a
              href={`tel:${contact.phone}`}
              className="rounded-full border-2 border-current/20 px-6 py-3 text-sm font-semibold opacity-80"
            >
              {contact.phone}
            </a>
          </div>
        </section>

        <section>
          {isPersonal ? (
            <div className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3">
              {hobbyColumns.map((column, colIndex) => (
                <div key={colIndex} className="flex flex-col gap-6">
                  {column.map((hobby) => (
                    <Polaroid
                      key={hobby.label}
                      {...hobby}
                      className={colIndex === 2 ? "hidden sm:block" : undefined}
                    />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:grid-rows-2">
              <ProjectCard
                project={projects[0]}
                className="sm:col-span-2 sm:row-span-2"
              />
              <ProjectCard project={projects[1]} className="sm:col-start-3" />
              <ProjectCard project={projects[2]} className="sm:col-start-3" />
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
