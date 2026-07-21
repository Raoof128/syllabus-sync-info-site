import Link from "next/link";

import type { PageDefinition } from "@/content/site";

import { ContactForm } from "./contact-form";
import { Icon } from "./icons";
import { ProductDemo } from "./product-demo";

export function ContentPage({ page, slug }: { page: PageDefinition; slug: string }) {
  const showDemo = slug === "product" || slug === "features" || slug === "universities";
  return (
    <main id="main-content">
      <section className="page-hero">
        <div className="container page-hero-grid">
          <div>
            <Link className="back-link" href="/"><span aria-hidden="true">←</span> Home</Link>
            <h1>{page.title}</h1>
            <p>{page.intro}</p>
          </div>
          {showDemo && <ProductDemo view={slug === "universities" ? "overview" : slug === "features" ? "calendar" : "today"} />}
        </div>
      </section>
      <div className="container prose-sections">
        {page.sections.map((section) => (
          <section id={section.anchor} key={section.heading}>
            <div className="section-number"><Icon name="spark" size={18} /></div>
            <div>
              <h2>{section.heading}</h2>
              {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.items && <ul>{section.items.map((item) => <li key={item}><Icon name="check" size={18} />{item}</li>)}</ul>}
            </div>
          </section>
        ))}
        {slug === "features" && (
          <section className="feature-status-table" aria-labelledby="feature-status-heading">
            <div className="section-number"><Icon name="calendar" size={18} /></div>
            <div><h2 id="feature-status-heading">Availability language</h2><p>Product scenes communicate the approved direction. The main application is the source of truth for current account-level availability.</p></div>
          </section>
        )}
        {slug === "contact" && <section className="contact-section"><div className="section-number"><Icon name="event" size={18} /></div><div><h2>Send an enquiry</h2><ContactForm /></div></section>}
      </div>
    </main>
  );
}
