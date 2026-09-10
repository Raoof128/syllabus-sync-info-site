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

- [ ] Deploy and verify the AON web app and canonical Privacy Policy at `aon.syllabus-sync.app`; DNS was not reachable from the final local audit on 10 September 2026
- [x] AON support and terms are implemented on the information site; local route tests pass
- [x] Page content audited against the app's own declarations and store data answers
- [x] Working non-university contact address (`leo@leoalavi.dev`, already confirmed in the app release documents). The placeholder is gone and `tests/unit/aon-legal.test.ts` now requires a real address.
- [x] `EventConfig.privacyPolicyUrl` points at `https://aon.syllabus-sync.app/privacy`. The Settings row presents the same policy in-app. The semantic page is generated from the app's own strings by `tool/privacy/gen_privacy_html.py` and guarded by `privacy_html_sync_test.dart`.
- [x] Privacy page carries the event team's scope statement and attribution block, identical in the app (English and Persian), the web app and the hosted page
- [ ] Deploy the `astronomy-open-night` Worker, then the information-site redirects. Order matters: the new legal pages must answer before the old ones start redirecting to them.
- [ ] After deployment verification, enter `https://aon.syllabus-sync.app/privacy` as the privacy URL and `https://event.mq.edu.au/astronomy-open-night/` as the support URL in App Store Connect and Google Play. Keep the existing App Privacy and Data Safety answer sets; do not replace them with "Data Not Collected".
- [ ] Ship a new signed app build. The native policy and URL fixes do not reach existing TestFlight or Play installs through a website deployment.
- [ ] Add `aon.syllabus-sync.app` to the domain-level Search Console property

## Accessibility gates

- [ ] Complete manual keyboard and screen-reader evaluation with retained evidence
