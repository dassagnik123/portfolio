import { contact } from "../content";
import SoundToggle from "./SoundToggle";

// Top-left bar: sound, then quick links to the résumé, LinkedIn and contact.
// `onContact` walks him to the CONTACT stop; without one it opens an email.
export default function TopBar({ onContact }) {
  return (
    <nav aria-label="Quick links" className="top-bar fixed top-4 left-4 z-40 flex flex-wrap items-stretch gap-2">
      <SoundToggle />
      <a className="top-btn" href={contact.resume} target="_blank" rel="noreferrer">
        RESUME
      </a>
      <a className="top-btn" href={contact.linkedin} target="_blank" rel="noreferrer">
        LINKEDIN
      </a>
      {onContact ? (
        <button type="button" className="top-btn" onClick={onContact}>
          CONTACT
        </button>
      ) : (
        <a className="top-btn" href={`mailto:${contact.email}`}>
          CONTACT
        </a>
      )}
    </nav>
  );
}
