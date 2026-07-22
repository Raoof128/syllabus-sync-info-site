import Link from "next/link";

import { ConnectionsSection } from "@/components/connections-section";
import { EcosystemSection } from "@/components/ecosystem-section";
import { Icon } from "@/components/icons";
import { IncubatorSection } from "@/components/incubator-section";
import { MacquarieSection } from "@/components/macquarie-section";
import { ProductDemo } from "@/components/product-demo";
import { RoadmapSection } from "@/components/roadmap-section";
import { TeamSection } from "@/components/team-section";
import { projectFacts } from "@/content/project-facts";
import { websiteJsonLd } from "@/lib/metadata";

const faqs = [
  ["What is Syllabus Sync?", "Syllabus Sync is an independent student experience ecosystem: an academic planning platform, an AI study assistant called Sylla, and a campus navigation companion called MQ Navigation."],
  ["Does it replace my university portal?", "No. It is designed as an organisational layer and does not replace official enrolment, learning, policy, assessment or emergency systems."],
  ["Which universities are supported?", "The current implementation is for Macquarie University. Expansion to other Sydney universities, and later across Australia, is a future direction — not a confirmed rollout."],
  ["Is Sylla a fully working AI assistant?", "Sylla's chat is available in early access. Its study tools — summaries, explanations, flashcards, quizzes and study planning — are working prototypes, not yet live AI features."],
  ["Can Syllabus Sync open MQ Navigation directly?", "A prototype destination-based deep-linking flow has been implemented between Syllabus Sync and MQ Navigation. Public OS-level linking and the complete production handoff are not yet released."],
  ["Is Syllabus Sync free?", "Current availability and any pricing are shown in the main application before you create an account."],
  ["Is the platform accessible?", "The information site targets WCAG 2.2 Level AA and includes keyboard, focus, reduced-motion, contrast and semantic support. It does not yet claim formal conformance."],
  ["Can universities work with Syllabus Sync?", "Yes, institutions can explore a pilot or collaboration conversation without any implication of an existing partnership or endorsement."],
] as const;

export default function Home() {
  return (
    <main id="main-content">
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c") }} type="application/ld+json" />
      <section className="hero" id="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <h1>One connected<br />ecosystem for university life.</h1>
            <p className="hero-lead">Syllabus Sync brings academic planning, AI-powered study support and campus navigation into one connected student ecosystem — starting at Macquarie University.</p>
            <p>Three distinct products, one shared direction: Syllabus Sync for planning, Sylla for study support, MQ Navigation for getting where you need to be.</p>
            <div className="button-row">
              <a className="button" href={projectFacts.mainApplicationUrl}>Explore Syllabus Sync <Icon name="arrow" /></a>
              <a className="button button-secondary" href="#ecosystem">Meet the ecosystem <Icon name="arrow" /></a>
            </div>
            <div className="button-row">
              <a className="text-link" href="https://sylla.syllabus-sync.app">Open Sylla <Icon name="arrow" size={17} /></a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="sync-paths" aria-hidden="true"><span /><span /><span /></div>
            <ProductDemo view="today" />
            <div className="phone-demo" aria-hidden="true"><ProductDemo compact view="today" /></div>
          </div>
        </div>
      </section>

      <section className="problem-section" id="problem">
        <div className="container">
          <div className="section-heading centered"><h2>University life is spread across too many places.</h2><p>Assessment dates live inside unit outlines. Classes sit in another timetable. Events arrive through email. Locations hide inside campus maps. Study help and campus navigation are separate systems entirely.</p></div>
          <div className="fragmentation">
            <div className="source-list">
              {["Unit outlines", "Learning system", "Calendar", "Email", "Campus map", "Study help"].map((item, index) => <span key={item}><i className={`source-dot source-${index}`} />{item}</span>)}
            </div>
            <div className="flow-lines" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
            <div className="fragment-demo"><ProductDemo view="overview" /></div>
          </div>
          <p className="problem-close">Syllabus Sync is the connected layer between these fragmented needs.</p>
        </div>
      </section>

      <EcosystemSection />
      <ConnectionsSection />
      <MacquarieSection />
      <IncubatorSection />
      <RoadmapSection />
      <TeamSection />

      <section className="trust-section" id="trust">
        <div className="container trust-inner">
          <span className="trust-mark"><Icon name="shield" size={28} /></span>
          <h2>Student technology should earn trust.</h2>
          <p>Syllabus Sync is designed around privacy, security and responsible data handling. We minimise unnecessary collection, protect public-site interactions and build clear controls around personal information.</p>
          <p>Accessibility and internationalisation are part of the platform foundation, not decorations added after launch. Sylla&apos;s AI features can be wrong or incomplete — treat its output as a study aid, not a source of truth.</p>
          <nav aria-label="Trust information">
            <Link href="/security"><Icon name="shield" size={18} /> Security</Link>
            <Link href="/privacy"><Icon name="lock" size={18} /> Privacy</Link>
            <Link href="/accessibility"><Icon name="compass" size={18} /> Accessibility</Link>
            <Link href="/security#responsible-disclosure"><Icon name="event" size={18} /> Responsible disclosure</Link>
          </nav>
        </div>
      </section>

      <section className="origin-faq" id="faq">
        <div className="container origin-faq-grid">
          <div className="origin-copy"><h2>Built from the<br />student experience.</h2><p>Syllabus Sync began with a simple problem: university life should not require a scavenger hunt through tabs, PDFs, portals, maps and screenshots.</p><strong>We are building a calmer, clearer way for students to navigate their academic day — and the ecosystem to support it.</strong><small>{projectFacts.independenceStatement}</small></div>
          <div className="faq"><h2>Questions, clearly answered.</h2>{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div>
        </div>
      </section>

      <section className="final-cta" id="contact-cta">
        <div className="cta-path cta-path-left" aria-hidden="true" /><div className="cta-path cta-path-right" aria-hidden="true" />
        <div className="container"><h2>Turn semester chaos into a clear plan.</h2><p>See what is happening, understand what matters and move through university life with confidence.</p><div className="button-row"><a className="button" href={projectFacts.mainApplicationUrl}>Open Syllabus Sync <Icon name="arrow" /></a><Link className="button button-on-dark" href="/contact">Contact the team <Icon name="arrow" /></Link></div></div>
      </section>
    </main>
  );
}
