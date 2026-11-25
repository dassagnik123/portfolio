import Corner from "./Corner.jsx";
import FooterFlowers from "./FooterFlowers.jsx";
import { contact } from "./data.js";
import Btn from "./Btn.jsx";
import useReveal from "./useReveal.js";

export default function Contact() {
  const ref = useReveal();
  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-heading">
      <div className="contact">
      <Corner kind="lilies" at="hr" />
      <div ref={ref} className="contact-inner reveal">
        <p className="eyebrow">Contact</p>
        <h2 id="contact-heading" className="contact-title">
          Looking for a designer <em>who can also ship?</em>
        </h2>
        <p className="contact-text">
          Thanks for stopping by. I'm looking for full-time Design Engineer or UX / Product Design roles, so if
          you'd like to chat, say hi. I'd love to hear from you.
        </p>
        <div className="contact-actions">
          <Btn variant="solid" href={`mailto:${contact.email}`}>
            Email me
          </Btn>
          <Btn variant="line" href={contact.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </Btn>
        </div>
        <p className="contact-detail">
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
          <span aria-hidden> · </span>
          <a href={`tel:${contact.phone}`}>{contact.phone}</a>
        </p>
      </div>
      <p className="footer-note">© {new Date().getFullYear()} Sagnik Das</p>
      </div>
      <FooterFlowers />
    </section>
  );
}
