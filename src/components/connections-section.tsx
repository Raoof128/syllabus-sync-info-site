export function ConnectionsSection() {
  return (
    <section className="connections-section" id="connections">
      <div className="container">
        <div className="section-heading centered">
          <p className="section-label">How they connect</p>
          <h2>Two connected products.</h2>
          <p>
            Syllabus Sync and Sylla are designed to connect academic planning with study support.
            Astronomy Open Night is shown in our portfolio as a separate event project.
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
            <p>A separate event project: programme, campus map, 360° venue previews and a QR passport.</p>
          </article>
        </div>
        <p className="problem-close">
          Syllabus Sync and Sylla share a product direction. Astronomy Open Night has its own
          identity, event team, support channel and privacy policy.
        </p>
      </div>
    </section>
  );
}
