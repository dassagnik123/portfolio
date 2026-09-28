import { LinkedInIcon, ResumeIcon } from "./icons";
import ModeToggle from "./ModeToggle";
import { socials } from "../data";

export default function TopControls({ mode, onToggle, className = "" }) {
  return (
    <div
      className={`flex items-center gap-4 text-xs font-medium tracking-wide text-white sm:gap-6 sm:text-sm ${className}`}
    >
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
          href={socials.resume}
          target="_blank"
          rel="noreferrer"
          aria-label="Resume"
          className="flex items-center gap-1.5 opacity-70 transition hover:opacity-100"
        >
          <ResumeIcon />
          <span className="hidden sm:inline">Resume</span>
        </a>
      </div>
      <ModeToggle mode={mode} onToggle={onToggle} />
    </div>
  );
}
