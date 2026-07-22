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
          <p className="section-label">The ecosystem</p>
          <h2>One ecosystem, three connected products.</h2>
          <p>
            Syllabus Sync is the main platform and student workspace. Sylla is the AI-assisted study
            companion. MQ Navigation is the campus navigation companion. Each is a distinct product,
            built to work together.
          </p>
        </div>
        <div className="ecosystem-grid">
          {approvedEcosystem.map((product) => (
            <article className="ecosystem-card" id={product.id} key={product.id}>
              {product.screenshot && (
                <div className="ecosystem-card-media">
                  <Image
                    alt={product.screenshot.alt}
                    height={360}
                    src={product.screenshot.src}
                    width={640}
                  />
                </div>
              )}
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
              <a
                className="button button-secondary"
                href={product.link.href}
                rel={product.link.external ? "noreferrer" : undefined}
                target={product.link.external ? "_blank" : undefined}
              >
                {product.link.label}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
