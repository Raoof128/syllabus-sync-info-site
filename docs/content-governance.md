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

## Store-facing pages for other apps

`src/content/astronomy-open-night-legal.ts` holds the Astronomy Open Night app's privacy policy, support page and terms. These are submitted to Apple and Google, so they carry stricter rules than marketing copy:

- Every factual statement must come from that app's own sources: the in-app policy body, `PrivacyInfo.xcprivacy`, the Info.plist purpose strings, the Android manifest permissions, and the App Privacy and Data Safety answers. Nothing is inferred, and nothing here may contradict the text shipped inside the app.
- Never claim the app collects nothing. It sends a route origin to Google Maps on consent, and the Android QR scanner reports diagnostics through ML Kit. Understating that is a store-compliance failure, not a wording preference.
- Name the individual publishers. No university is the publisher, no university domain is used for contact, and the private app repository is not linked.
- Claim only accessibility support the app team has verified.
- The contact address is a visible placeholder until a working non-university address is confirmed. It is deliberately not shaped like an email so it cannot be mistaken for one.

`tests/unit/aon-legal.test.ts` guards the publisher wording, the contact shape, the disclosure set and the accessibility claims. `tests/e2e/site.spec.ts` checks the four routes stay live and in the sitemap.
