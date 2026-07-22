export function ConnectionsSection() {
  return (
    <section className="connections-section" id="connections">
      <div className="container">
        <div className="section-heading centered">
          <p className="section-label">How they connect</p>
          <h2>Built to connect, not to compete for attention.</h2>
          <p>
            The goal is not three disconnected apps. It is one student ecosystem where context can
            move between specialised experiences — starting with a shared identity today, with
            deeper integration in development.
          </p>
        </div>
        <div className="connections-grid">
          <article>
            <h3>Syllabus Sync</h3>
            <p>Academic context: units, assessments, deadlines and the student workspace.</p>
          </article>
          <article>
            <h3>Sylla</h3>
            <p>The AI-powered study layer: summaries, explanations, flashcards, quizzes and planning support.</p>
          </article>
          <article>
            <h3>MQ Navigation</h3>
            <p>Campus wayfinding: destination handoff, maps and mobile navigation.</p>
          </article>
        </div>
        <p className="problem-close">
          Today, each product is independently usable under one shared brand. Deeper integration —
          like an embedded Sylla panel inside Syllabus Sync, and a full destination handoff to MQ
          Navigation — is in development.
        </p>
      </div>
    </section>
  );
}
