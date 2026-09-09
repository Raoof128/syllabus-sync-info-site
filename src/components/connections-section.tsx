export function ConnectionsSection() {
  return (
    <section className="connections-section" id="connections">
      <div className="container">
        <div className="section-heading centered">
          <p className="section-label">How they connect</p>
          <h2>Three products built to connect.</h2>
          <p>
            We are building one student ecosystem where context moves between specialised
            experiences. Today that means a shared identity across the three products, and
            deeper integration is still in development.
          </p>
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
            <p>Event nights: programme, campus map, 360° venue previews and a QR passport, all offline.</p>
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
