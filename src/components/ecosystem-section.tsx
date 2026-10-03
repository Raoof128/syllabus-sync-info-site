import Image from "next/image";

import { approvedEcosystem, type FeatureStatus } from "@/content/project-facts";

const statusLabels: Record<FeatureStatus, string> = {
  available: "Available",
  "early-access": "Early access",
  prototype: "Prototype",
  "in-development": "In development",
  planned: "Planned",
};

export function EcosystemSection() {
  return (
    <section className="ecosystem-section" id="ecosystem">
      <div className="container">
        <div className="section-heading centered">
          <p className="section-label">Products and projects</p>
          <h2>What we build.</h2>
          <p>
            Syllabus Sync brings together the workspace, Sylla&apos;s AI-assisted study experience
            and the connected Campus Navigation companion. Astronomy Open Night 2026 is shown
            separately as a project by the same team.
          </p>
        </div>
        <div className="ecosystem-grid">
          {approvedEcosystem.map((product) => (
            <article className={`ecosystem-card${product.relationship === "Separate team project" ? " ecosystem-card-independent" : ""}`} id={product.id} key={product.id}>
                <div className={`ecosystem-card-media ecosystem-card-media-${product.id}`}>
                  <Image
                    alt={product.screenshot.alt}
                    height={product.screenshot.height}
                    sizes="(max-width: 700px) 100vw, (max-width: 1200px) 50vw, 580px"
                    src={product.screenshot.src}
                    width={product.screenshot.width}
                  />
                </div>
              <span className="ecosystem-relationship">{product.relationship}</span>
              <div>
                <h3>{product.name}</h3>
                <p className="tagline">{product.tagline}</p>
              </div>
              <p>{product.description}</p>
              <span className={`status-pill status-pill-${product.status}`}>{product.statusLabel}</span>
              <div className="ecosystem-feature-list">
                {product.features.map((feature) => (
                  <div className="ecosystem-feature" key={feature.name}>
                    <div>
                      <span className="ecosystem-feature-name">{feature.name}</span>
                      <p>{feature.description}</p>
                    </div>
                    <span className={`status-pill status-pill-${feature.status}`}>
                      {statusLabels[feature.status]}
                    </span>
                  </div>
                ))}
              </div>
              {product.actions && product.actions.length > 0 ? (
                <div className="ecosystem-card-actions">
                  {product.actions.map((action, index) => (
                    <a
                      className={index === 0 ? "button" : "button button-secondary"}
                      href={action.href}
                      key={action.href}
                      rel={action.external ? "noopener noreferrer" : undefined}
                      target={action.external ? "_blank" : undefined}
                    >
                      {action.label}
                      {action.external && <span className="sr-only"> (opens in a new tab)</span>}
                    </a>
                  ))}
                </div>
              ) : product.link ? (
                <a
                  className="button button-secondary"
                  href={product.link.href}
                  rel={product.link.external ? "noopener noreferrer" : undefined}
                  target={product.link.external ? "_blank" : undefined}
                >
                  {product.link.label}
                  {product.link.external && <span className="sr-only"> (opens in a new tab)</span>}
                </a>
              ) : <p className="ecosystem-release-note">Public download links will appear here once confirmed.</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
