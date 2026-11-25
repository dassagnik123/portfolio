import Corner from "./Corner.jsx";
import { experience } from "./data.js";
import useReveal from "./useReveal.js";

function Job({ job }) {
  const ref = useReveal();
  return (
    <article ref={ref} className="job reveal">
      <p className="job-dates">{job.dates}</p>
      <div>
        <h3 className="job-role">{job.role}</h3>
        <p className="job-company">{job.company}</p>
        <ul className="job-points">
          {job.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default function Experience() {
  const headRef = useReveal();
  return (
    <section className="experience" id="experience" aria-labelledby="experience-heading">
      <header ref={headRef} className="section-head reveal">
        <p className="eyebrow">Where I've worked</p>
        <h2 id="experience-heading" className="section-title">
          Experience
        </h2>
        <span className="brush-rule" aria-hidden />
      </header>
      <Corner kind="lilies" at="hr" />
      <Corner kind="roses" at="bl" />
      <div className="jobs">
        {experience.map((job) => (
          <Job key={job.role} job={job} />
        ))}
      </div>
    </section>
  );
}
