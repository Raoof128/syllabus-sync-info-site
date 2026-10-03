export function ConnectionsSection() {
  return (
    <section className="connections-section" id="connections">
      <div className="container">
        <div className="section-heading centered">
          <p className="section-label">How they connect</p>
          <h2>Two connected products.</h2>
          <p>
            The Syllabus Sync platform includes the student workspace and Sylla. Campus Navigation
            is its connected mobile wayfinding companion.
          </p>
        </div>
        <div className="connections-grid">
          <article>
            <h3>Syllabus Sync Platform</h3>
            <p>Academic planning, units, deadlines and calendar information in the main workspace, with AI-assisted study support through Sylla.</p>
          </article>
          <article>
            <h3>Campus Navigation</h3>
            <p>A dedicated mobile companion for campus discovery, locations and wayfinding. Its app-side deep-link handoff is ready for integration with Syllabus Sync.</p>
          </article>
        </div>
        <p className="connections-separate-note">
          <strong>Separate team project:</strong> Astronomy Open Night 2026 was developed by Leo Alavi
          and Mohammad Raouf Abedini for Astronomy Night – FSE Outreach Team. It is not part of
          the Syllabus Sync platform.
        </p>
      </div>
    </section>
  );
}
