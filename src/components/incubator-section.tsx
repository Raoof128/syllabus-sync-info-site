import { projectFacts } from "@/content/project-facts";

export function IncubatorSection() {
  return (
    <section id="incubator">
      <div className="container">
        <div className="incubator-section">
          <span className="incubator-badge">Macquarie University Incubator</span>
          <h2>{projectFacts.incubator.headline}</h2>
          <p>{projectFacts.incubator.detail}</p>
          <p className="independence-note">{projectFacts.independenceStatement}</p>
        </div>
      </div>
    </section>
  );
}
