# Content governance

Every public claim needs an owner, source, review date and approval state. The typed registry in `src/content/project-facts.ts` is the enforcement point.

## Categories

- Stable brand copy: project owner; annual review.
- Product capabilities: product owner; review on every release.
- Legal and privacy: approved legal owner; review before launch and after data-flow changes.
- Security: engineering/security owner; review each quarter and after material incidents.
- Accessibility: accessibility owner; review after evaluation and major UI change.
- Institutional: partnership owner; written approval before naming an institution.
- Proof points: explicit source and `approved: true` required to render.
- Updates: dated, factual and tied to shipped or documented work.

## Prohibited claims

Do not publish user counts, revenue, adoption, university relationships, testimonials, ratings, awards, certifications or detailed feature availability without documentary evidence and approval.

`tests/unit/content.test.ts` checks approval filtering, canonical metadata and route coverage.
