import { projectFacts } from "@/content/project-facts";

export function MacquarieSection() {
  return (
    <section className="macquarie-section" id="macquarie">
      <div className="container">
        <div className="section-heading centered">
          <p className="section-label">Starting with Macquarie</p>
          <h2>We are starting where we know the student experience firsthand.</h2>
          <p>
            Macquarie University is where we build and test first. Unit information, campus context
            and student workflows get checked against real student needs before we expand anywhere
            else.
          </p>
          <p className="independence-note">{projectFacts.independenceStatement}</p>
        </div>
      </div>
    </section>
  );
}
