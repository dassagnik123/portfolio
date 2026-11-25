import Corner from "./Corner.jsx";
import { about, hobbies } from "./data.js";
import useReveal from "./useReveal.js";

// How each category card sits: a slight tilt and a little drop, so the row looks scattered, not
// lined up. [rotate deg, drop px]
const SCATTER = [
  [-6, 8],
  [5, -10],
  [-4, 12],
  [6, -6],
  [-5, 10],
];

// The flowers that bloom on a card's bottom corners on hover: a rose bottom-left, a lily bottom-right,
// a different picture for each card.
const ROSE_FOR = ["rose-open", "rose-bud", "rose-open", "rose-bud", "rose-open"];
const LILY_FOR = ["lily-open", "lily-a", "lily-b", "lily-c", "lily-open"];

// One category as a floating polaroid. It drifts up and down on its own; on hover it straightens,
// lifts, and two more photos of the category fan out from behind it. Clicking opens that category's
// gallery page.
function CategoryCard({ hobby, index }) {
  const [rotate, drop] = SCATTER[index % SCATTER.length];
  const [cover, left, right] = [hobby.photos[0], hobby.photos[1] ?? hobby.photos[0], hobby.photos[2] ?? hobby.photos[0]];
  return (
    <li>
      <a
        className="cat-card"
        href={`#/about/${hobby.slug}`}
        aria-label={`${hobby.label}: ${hobby.photos.length} photos`}
        style={{ "--rotate": `${rotate}deg`, "--drop": `${drop}px`, "--float-delay": `${index * -0.9}s` }}
      >
        <span className="cat-back cat-back-left" aria-hidden>
          <img src={left.thumb} alt="" loading="lazy" decoding="async" />
        </span>
        <span className="cat-back cat-back-right" aria-hidden>
          <img src={right.thumb} alt="" loading="lazy" decoding="async" />
        </span>
        <span className="cat-flower cat-flower-bl" aria-hidden>
          <img src={`/flowers/${ROSE_FOR[index % ROSE_FOR.length]}.webp`} alt="" loading="lazy" />
        </span>
        <span className="cat-flower cat-flower-br" aria-hidden>
          <img src={`/flowers/${LILY_FOR[index % LILY_FOR.length]}.webp`} alt="" loading="lazy" />
        </span>
        <span className="cat-front">
          <img src={cover.thumb} alt="" loading="lazy" decoding="async" />
          <span className="cat-label">
            <strong>{hobby.label}</strong>
            <small>{hobby.photos.length} photos</small>
          </span>
        </span>
      </a>
    </li>
  );
}

export default function About() {
  const headRef = useReveal();
  return (
    <section className="about" id="about" aria-labelledby="about-heading">
      <header ref={headRef} className="section-head reveal">
        <p className="eyebrow">After hours</p>
        <h2 id="about-heading" className="section-title">
          About me
        </h2>
        <span className="brush-rule" aria-hidden />
        <p className="about-lead">{about.lead}</p>
        <p className="about-note">{about.sub}</p>
      </header>

      <Corner kind="lilies" at="hr" />
      <ul className="cat-row">
        {hobbies.map((hobby, i) => (
          <CategoryCard key={hobby.slug} hobby={hobby} index={i} />
        ))}
      </ul>
      <p className="cat-hint">Pick a card to see all of its photos.</p>
      <Corner kind="roses" at="bl" />
    </section>
  );
}
