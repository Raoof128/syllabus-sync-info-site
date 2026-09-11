# Launch checklist

Reviewed 9 September 2026.

## Repository gates

- [x] Strict type check
- [x] ESLint with zero warnings
- [x] Production build
- [x] Unit tests (27, three files)
- [x] Playwright and axe coverage (47 passed, 10 intentional skips)
- [x] Static metadata routes
- [x] Security headers
- [x] `noindex` on non-canonical hosts
- [x] Content-gap report
- [x] Asset register
- [x] Three-run local Lighthouse evidence
- [x] Chromium, Firefox and WebKit functional tests
- [x] Automated axe checks on five representative routes
- [x] Desktop and mobile visual-fidelity evidence
- [x] `npm audit` clean

## Deployment gates

- [x] Select hosting provider and supported adapter (Cloudflare Workers, OpenNext)
- [x] Configure `info` DNS and TLS (custom domain, Always Use HTTPS, minimum TLS 1.2)
- [x] Add shared production rate limiting (Cloudflare Rate Limiting binding)
- [x] Verify the deployed build serves every public route, including the server-rendered OG image
- [ ] Run Lighthouse against the deployed production build
- [ ] Validate structured data, Search Console and social-card rendering
- [ ] Decide and document production analytics; none is enabled by default

## Content and legal gates

- [ ] Confirm final ownership/approval of the supplied brand mark
- [ ] Approve the site's own terms and privacy pages
- [ ] Verify support, security, accessibility and partnership contacts
- [ ] Configure and test contact delivery and retention (`CONTACT_WEBHOOK_URL`)
- [ ] Confirm current product features, pricing and supported institutions

## Astronomy Open Night store gates

- [x] Deploy and verify the AON web app and canonical Privacy Policy at `aon.syllabus-sync.app`. Deployed 11 September 2026: the `astronomy-open-night` Worker serves the Flutter build, the custom domain is attached, Cloudflare issued the certificate, and `/` and `/privacy` both answer 200 over HTTPS.
- [x] AON support and terms are live on the information site, and the retired `/astronomy-open-night/app-*` names redirect rather than 404
- [x] Page content audited against the app's own declarations and store data answers
- [x] Working non-university contact address (`leo@leoalavi.dev`, already confirmed in the app release documents). The placeholder is gone and `tests/unit/aon-legal.test.ts` now requires a real address.
- [x] `EventConfig.privacyPolicyUrl` points at `https://aon.syllabus-sync.app/privacy`. The Settings row presents the same policy in-app. The semantic page is generated from the app's own strings by `tool/privacy/gen_privacy_html.py` and guarded by `privacy_html_sync_test.dart`.
- [x] Privacy page carries the event team's scope statement and attribution block, identical in the app (English and Persian), the web app and the hosted page
- [x] Deploy the `astronomy-open-night` Worker, then the information-site redirects. Done in that order on 11 September 2026: the AON policy answered 200 before the info site began redirecting to it.
- [x] The Content-Security-Policy allows the Google Maps origins the app injects at runtime. Without this the map fails with the key present and correct, which reads as a credentials bug. Guarded by `tests/aon/app.spec.ts`.
- [ ] Tighten the Google Cloud keys: web key restricted to Maps JavaScript API and Routes API only (it currently also answers Static Maps and Geocoding), iOS key to Maps SDK for iOS and Routes, Android key to Maps SDK for Android and Routes. Delete the unrestricted key. Set a quota and a billing budget alert before the event.
- [ ] Turn off Cloudflare Web Analytics auto-injection for these hosts. Both sites' CSP already blocks `static.cloudflareinsights.com`, so the beacon collects nothing and only produces a console error on every page load.
- [x] Production web Maps key shipped. The key already existed and is HTTP-referrer restricted to the production host: probed 11 September 2026, Routes returns 200 from `Referer: https://aon.syllabus-sync.app/` and 403 from an empty or foreign referer. It reached the bundle through `.env.web` (git-ignored, in the app repository root) and is verified present in the live `main.dart.js`, with both native route keys verified absent from it. A referrer-locked browser key is public by design, so shipping it in the bundle is intended.
- [ ] After deployment verification, enter `https://aon.syllabus-sync.app/privacy` as the privacy URL and `https://event.mq.edu.au/astronomy-open-night/` as the support URL in App Store Connect and Google Play. Keep the existing App Privacy and Data Safety answer sets; do not replace them with "Data Not Collected".
- [ ] Ship a new signed app build. The native policy and URL fixes do not reach existing TestFlight or Play installs through a website deployment.
- [ ] Add `aon.syllabus-sync.app` to the domain-level Search Console property

## Accessibility gates

- [ ] Complete manual keyboard and screen-reader evaluation with retained evidence
