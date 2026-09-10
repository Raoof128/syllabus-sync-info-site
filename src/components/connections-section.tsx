import { projectFacts } from "@/content/project-facts";

export function ConnectionsSection() {
  return (
    <section className="connections-section" id="connections">
      <div className="container">
        <div className="section-heading centered">
          <p className="section-label">How they connect</p>
          <h2>{projectFacts.presentation.connectionsTitle}</h2>
          <p>{projectFacts.presentation.connectionsDescription}</p>
        </div>
        <div className="connections-grid">
          <article>
            <h3>Syllabus Sync</h3>
            <p>Academic context: units, assessments, deadlines and the student workspace.</p>
          </article>
          <article>
            <h3>Sylla</h3>
            <p>The AI-assisted study layer: summaries, explanations, flashcards, quizzes and planning support.</p>
          </article>
          <article>
            <h3>Astronomy Open Night</h3>
            <p>{projectFacts.presentation.aonConnection}</p>
          </article>
        </div>
        <p className="problem-close">
          Each product is usable on its own today, under one shared brand. Deeper integration, such
          as an embedded Sylla panel inside Syllabus Sync, is still in development.
        </p>
      </div>
    </section>
  );
}
