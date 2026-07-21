import Link from "next/link";

import { Icon } from "@/components/icons";
import { ProductDemo } from "@/components/product-demo";
import { projectFacts } from "@/content/project-facts";
import { websiteJsonLd } from "@/lib/metadata";

const pillars = [
  { icon: "calendar" as const, heading: "Plan your semester", body: "See units, assignments, exams, events and personal commitments together. Understand busy weeks before they become stressful weeks." },
  { icon: "compass" as const, heading: "Know what comes next", body: "Start each day with a clear view of upcoming classes, deadlines and priorities." },
  { icon: "map" as const, heading: "Connect plans with places", body: "Link academic activities with campus locations so you know what you need to do and where you need to be." },
  { icon: "event" as const, heading: "Stay informed", body: "Keep important dates, student events and changes visible without repeatedly checking multiple systems." },
];

const walkthrough = [
  { number: "01", title: "See the whole semester", body: "Bring your timetable, deadlines and events together so busy weeks are visible before they arrive.", view: "calendar" as const },
  { number: "02", title: "Start with today", body: "Focus on what matters now: today's schedule, the next deadline and useful campus information.", view: "today" as const },
  { number: "03", title: "Understand your workload", body: "See upcoming deadlines across your units and decide what deserves attention next.", view: "deadlines" as const },
  { number: "04", title: "Connect plans with places", body: "Link classes and activities to campus context so the plan includes where you need to be.", view: "campus" as const },
  { number: "05", title: "Keep events in view", body: "Keep useful student events and important changes visible alongside academic commitments.", view: "events" as const },
];

const faqs = [
  ["What is Syllabus Sync?", "Syllabus Sync is an independent academic planning platform designed to bring units, deadlines, calendar information, campus context and student events into one clearer experience."],
  ["Does it replace my university portal?", "No. It is designed as an organisational layer and does not replace official enrolment, learning, policy, assessment or emergency systems."],
  ["Which universities are supported?", "No public institution-support list has been verified for this site. Check the main application for current availability."],
  ["Is Syllabus Sync free?", "Current availability and any pricing are shown in the main application before you create an account."],
  ["What information does it store?", "The main application's complete data inventory requires a product privacy review. This information site only processes contact details you choose to provide when delivery is configured."],
  ["Can I delete my account and data?", "Account and data-deletion controls must be confirmed in the main application. This site does not claim a control that has not been verified."],
  ["Is the platform accessible?", "The information site targets WCAG 2.2 Level AA and includes keyboard, focus, reduced-motion, contrast and semantic support. It does not yet claim formal conformance."],
  ["Can universities work with Syllabus Sync?", "Yes, institutions can explore a pilot or collaboration conversation without any implication of an existing partnership or endorsement."],
] as const;

export default function Home() {
  return (
    <main id="main-content">
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c") }} type="application/ld+json" />
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <h1>Your semester,<br />finally organised.</h1>
            <p className="hero-lead">Syllabus Sync brings your units, deadlines, calendar, campus locations and student events into one clear experience.</p>
            <p>Spend less time searching through portals and more time knowing what comes next.</p>
            <div className="button-row">
              <a className="button" href={projectFacts.mainApplicationUrl}>Open Syllabus Sync <Icon name="arrow" /></a>
              <a className="button button-secondary" href="#how-it-works">See how it works <Icon name="arrow" /></a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="sync-paths" aria-hidden="true"><span /><span /><span /></div>
            <ProductDemo view="today" />
            <div className="phone-demo" aria-hidden="true"><ProductDemo compact view="today" /></div>
          </div>
        </div>
      </section>

      <section className="problem-section">
        <div className="container">
          <div className="section-heading centered"><h2>University life is spread across too many places.</h2><p>Assessment dates live inside unit outlines. Classes sit in another timetable. Events arrive through email. Locations hide inside campus maps. Personal reminders end up somewhere else entirely.</p></div>
          <div className="fragmentation">
            <div className="source-list">
              {["Unit outlines", "Learning system", "Calendar", "Email", "Campus map", "Reminders"].map((item, index) => <span key={item}><i className={`source-dot source-${index}`} />{item}</span>)}
            </div>
            <div className="flow-lines" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
            <div className="fragment-demo"><ProductDemo view="overview" /></div>
          </div>
          <p className="problem-close">Syllabus Sync connects these fragments into one organised academic view.</p>
        </div>
      </section>

      <section className="pillars-section">
        <div className="container pillars">
          {pillars.map((pillar) => <article key={pillar.heading}><span className="pillar-icon"><Icon name={pillar.icon} size={26} /></span><h3>{pillar.heading}</h3><p>{pillar.body}</p></article>)}
        </div>
        <div className="path-divider" aria-hidden="true"><span /><span /></div>
      </section>

      <section className="walkthrough-section" id="how-it-works">
        <div className="container">
          <div className="section-heading centered"><p className="section-label">Product walkthrough</p><h2>Syllabus Sync in action</h2><p>A clear path from overview to action.</p></div>
          <div className="walkthrough-list">
            {walkthrough.map((step, index) => <article className={`walkthrough-row ${index % 2 ? "reverse" : ""}`} key={step.title}><div className="walkthrough-copy"><span>{step.number}</span><h3>{step.title}</h3><p>{step.body}</p><Link href="/product">Explore this view <Icon name="arrow" size={17} /></Link></div><ProductDemo view={step.view} /></article>)}
          </div>
        </div>
      </section>

      <section className="trust-section">
        <div className="container trust-inner">
          <span className="trust-mark"><Icon name="shield" size={28} /></span>
          <h2>Student technology should earn trust.</h2>
          <p>Syllabus Sync is designed around privacy, security and responsible data handling. We minimise unnecessary collection, protect public-site interactions and build clear controls around personal information.</p>
          <p>Accessibility and internationalisation are part of the platform foundation, not decorations added after launch.</p>
          <nav aria-label="Trust information">
            <Link href="/security"><Icon name="shield" size={18} /> Security</Link>
            <Link href="/privacy"><Icon name="lock" size={18} /> Privacy</Link>
            <Link href="/accessibility"><Icon name="compass" size={18} /> Accessibility</Link>
            <Link href="/security#responsible-disclosure"><Icon name="event" size={18} /> Responsible disclosure</Link>
          </nav>
        </div>
      </section>

      <section className="universities-home">
        <div className="container universities-grid">
          <div><h2>A clearer student experience without another disconnected portal.</h2><p>Syllabus Sync helps students understand academic commitments while giving institutions a foundation for clearer, more accessible and privacy-conscious digital experiences.</p><Link className="button" href="/universities">Explore institutional partnerships <Icon name="arrow" /></Link></div>
          <ul>{["Better visibility of academic commitments", "Easier onboarding", "Accessible student services", "Multilingual experiences", "Integration-ready architecture", "Privacy-conscious delivery"].map((item) => <li key={item}><Icon name="check" size={18} />{item}</li>)}</ul>
          <div className="university-demo"><ProductDemo view="overview" /></div>
        </div>
      </section>

      <section className="origin-faq">
        <div className="container origin-faq-grid">
          <div className="origin-copy"><h2>Built from the<br />student experience.</h2><p>Syllabus Sync began with a simple problem: university life should not require a scavenger hunt through tabs, PDFs, portals, maps and screenshots.</p><strong>We are building a calmer, clearer way for students to navigate their academic day.</strong><small>{projectFacts.independenceStatement}</small></div>
          <div className="faq"><h2>Questions, clearly answered.</h2>{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div>
        </div>
      </section>

      <section className="final-cta">
        <div className="cta-path cta-path-left" aria-hidden="true" /><div className="cta-path cta-path-right" aria-hidden="true" />
        <div className="container"><h2>Turn semester chaos into a clear plan.</h2><p>See what is happening, understand what matters and move through university life with confidence.</p><div className="button-row"><a className="button" href={projectFacts.mainApplicationUrl}>Open Syllabus Sync <Icon name="arrow" /></a><Link className="button button-on-dark" href="/product">Explore the product <Icon name="arrow" /></Link></div></div>
      </section>
    </main>
  );
}
