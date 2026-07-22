import { approvedRoadmapPhases } from "@/content/project-facts";

export function RoadmapSection() {
  return (
    <section className="roadmap-section" id="vision">
      <div className="container">
        <div className="section-heading centered">
          <p className="section-label">Vision</p>
          <h2>A realistic path from Macquarie to Australia.</h2>
          <p>Every phase below is a future direction, not a commitment or a confirmed rollout.</p>
        </div>
        <div className="roadmap-timeline">
          {approvedRoadmapPhases.map((phase) => (
            <article className="roadmap-phase" key={phase.phase}>
              <span className="phase-label">{phase.phase}</span>
              <h3>{phase.title}</h3>
              <p>{phase.description}</p>
              <ul>
                {phase.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
