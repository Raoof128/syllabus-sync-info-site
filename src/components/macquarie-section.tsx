import { projectFacts } from "@/content/project-facts";

export function MacquarieSection() {
  return (
    <section className="macquarie-section" id="macquarie">
      <div className="container">
        <div className="section-heading centered">
          <p className="section-label">Starting with Macquarie</p>
          <h2>We are starting where we know the student experience firsthand.</h2>
          <p>
            Macquarie University is our first implementation and validation environment. Building
            here first means unit information, campus context and student workflows can be tested
            against real student needs before expanding elsewhere.
          </p>
          <p className="independence-note">{projectFacts.independenceStatement}</p>
        </div>
      </div>
    </section>
  );
}
