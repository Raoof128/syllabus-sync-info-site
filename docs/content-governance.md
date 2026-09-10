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

`src/content/astronomy-open-night-legal.ts` holds the Astronomy Open Night support and terms pages. The canonical Privacy Policy is generated only from the app repository's localisation source and served at `https://aon.syllabus-sync.app/privacy`.

- Every factual statement must come from that app's own sources: the in-app policy body, `PrivacyInfo.xcprivacy`, the Info.plist purpose strings, the Android manifest permissions, and the App Privacy and Data Safety answers. Nothing is inferred, and nothing here may contradict the text shipped inside the app.
- Never claim the app collects nothing. It sends a route origin to Google Maps on consent, and the Android QR scanner reports diagnostics through ML Kit. Understating that is a store-compliance failure, not a wording preference.
- Name the people, not an institution. No university is the publisher, and the private app repository is not linked.
- Claim only accessibility support the app team has verified.
- Use the attribution model the event team confirmed on 2026-09-09 and reaffirmed on 2026-09-10, naming each party for exactly what it does:
  - Leo Alavi is the privacy, developer and App Review contact.
  - Leo Alavi and Mohammad Raouf Abedini developed the app. Both names stay with the credit.
  - Astronomy Night - FSE Outreach Team runs the event and holds the copyright.
  - The Macquarie University event site and `astronomyopennight@mq.edu.au` are the official event and support source.
  - The `syllabus-sync.app` domain is the technical host of the policy and the web app, and nothing more.
- Astronomy Open Night is a separate event project, not a Syllabus Sync product. Neutral portfolio placement is permitted, but Syllabus Sync must not be named as its publisher, owner or parent product.
- Privacy and data requests go to `leo@leoalavi.dev`, because data requests have to reach the party that can act on them. Event questions go to the event team's own address. Never merge the two.
- The policy applies specifically to the Astronomy Open Night 2026 iOS, Android and web applications and must not imply that it applies to unrelated products, applications or websites.
- The hosted policy exporter must verify exact English parity with the app policy before publishing. See `docs/aon-domain-migration.md`.

`tests/unit/aon-legal.test.ts` guards the publisher wording, the contact shape, the disclosure set and the accessibility claims. `tests/e2e/site.spec.ts` checks the four routes stay live and in the sitemap.
