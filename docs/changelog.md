# Change log

Dated record of shipped work, newest first. Every entry names the merged pull
request so the diff is one command away (`gh pr view <n>`). Point-in-time
verification evidence stays in `docs/final-implementation-report.md`; this file
records what changed after that report.

## 12 September 2026

- **Backend security audit: fixed a rate-limit bypass and closed observability
  and test gaps on `/api/contact`.** The limiter keyed on `X-Forwarded-For` /
  `X-Real-IP`, both client-controlled — an attacker could rotate the header to
  get a fresh bucket every request and evade the 5-per-window limit (and the
  Cloudflare edge limiter, which was keyed on the same value). Added
  `resolveClientIp()` in `src/lib/contact.ts`, which prefers the edge-trusted
  `CF-Connecting-IP` (falling back to the forwarded headers only off Cloudflare),
  and pointed the route's key at it. Webhook delivery failures are now logged
  server-side (status/error only — never the token or the submitter's PII) so the
  enabled observability can surface them. Added unit tests for the IP resolution
  (including the spoofing case) and a new `security-headers.test.ts` that locks in
  the CSP, HSTS, framing and sniffing protections from `next.config.ts`. Full
  audit found no injection, IDOR, secret exposure or unauthenticated-access
  issues; the dynamic page routes already allowlist their params and `npm audit`
  reports 0 production vulnerabilities. `npm run check` green (38 unit tests);
  Chromium e2e 19/19.
- **Added CI and documented the CSP decision (audit follow-through).** New
  `.github/workflows/ci.yml` runs `npm run check`, a production `npm audit`, and
  the full three-engine Playwright suite on every push and pull request — rule 8
  was only ever enforced by hand. Verified the three engines pass locally first
  (47 passed / 10 skipped). Also recorded, in `next.config.ts`, why
  `script-src 'unsafe-inline'` stays: removing it needs per-request nonces that
  would force dynamic rendering and drop the static-generation architecture
  (rule 3), and the site has no inline-script injection sink to defend. Deploy is
  intentionally not in CI (needs credentials, stays a human step).

- **Corrected the team credit to the founder's confirmed public identity.** The
  team registry in `src/content/project-facts.ts` still carried the older name,
  LinkedIn and GitHub for the software-engineering co-founder. On 2026-09-11 the
  founder confirmed the public identity is **Leo Alavi**
  (`linkedin.com/in/leo-alavi`, `github.com/leoalavi`), which matches the
  Astronomy Open Night app credit and the `leo@leoalavi.dev` privacy contact.
  Updated the name, both links and the fact's `source` date, renamed the photo
  asset `pouya.jpg` to `leo.jpg` so no old handle remains, and updated the
  `attributes the team accurately` unit test to assert the corrected identity.
  Role and bio are unchanged. `npm run check` green. PR #21.

## 11 September 2026

Astronomy Open Night went live on its own host, which clears the last
website-side blocker to submitting the app for review.

- **Fixed the sibling-path bug that made the AON build and deploy impossible.**
  `scripts/build-aon.sh` and `wrangler.aon.jsonc` both pointed at
  `../../MQ-Astronomy-Open-Night-2026`, one level too deep: the app repository is
  a sibling of this one, not an uncle. The build script died on `cd` and the
  Worker had no asset directory, so neither command had ever run end to end.
- **Deployed `https://aon.syllabus-sync.app`.** The `astronomy-open-night`
  Worker serves the Flutter web build; the custom domain is attached, Cloudflare
  issued the certificate, and `/` and `/privacy` answer 200. The canonical
  privacy policy is now publicly reachable, which is what App Store Connect and
  Google Play require.
- **Then deployed the information site**, in that order, so the old
  `/astronomy-open-night/privacy` path only began redirecting once its
  destination answered. Support and terms are live, and the redirect chain ends
  on a 200.
- **Kept the retired page names alive.** `app-privacy`, `app-support` and
  `app-terms` were publicly reachable for two days before the rename, so they
  now redirect permanently instead of 404ing, and `tests/e2e/site.spec.ts`
  asserts all three.
- **Recorded what deploying actually needs**, in `docs/aon-domain-migration.md`:
  Workers Scripts Edit uploads the Worker, but the zone-scoped Workers Routes
  Edit is what `"custom_domain": true` needs, and the account-level
  `workers/domains` endpoint attaches the hostname without it.

- **Shipped the web Maps key, so the map works.** The first deploy carried an
  empty `MAPS_API_KEY` and the app showed its truthful "map unavailable" state.
  The web build reads `--dart-define-from-file=.env.web`, and that file did not
  exist; the key was in `.env`, which feeds only the native builds. Creating
  `.env.web` (git-ignored, in the app repository root) and rebuilding embeds it.
  Verified on the live bundle: the web key is present and both native route keys
  are absent, so the conditional imports are doing their job.
- **Confirmed the key is restricted before publishing it.** Probed live: Routes
  answers 200 from `Referer: https://aon.syllabus-sync.app/` and 403 from an
  empty or foreign referer. A referrer-locked browser key is public by design,
  which is what makes shipping it in `main.dart.js` safe rather than a leak. The
  two native keys are separate keys, restricted to their own app identities, and
  neither enters the web compilation unit.

A local `flutter run -d chrome` still needs `--dart-define-from-file=.env.web`
or the map reports itself unavailable again, and a referrer-locked key cannot
work from `localhost` at all: test the map on the production host.

- **Let the CSP load Google Maps.** With the key finally in the bundle the map
  still did not appear, and the reason was our own policy: the app injects the
  Maps JavaScript API at runtime, and `script-src` named neither
  `maps.googleapis.com` nor `maps.gstatic.com`, so Chrome refused the script on
  every visit and no Google call left the browser. The policy now allows exactly
  the Maps origins the app uses — script, XHR, tiles, and the fonts Maps pulls
  for its own labels — and nothing else; `default-src 'self'`, `object-src
  'none'`, `frame-ancestors 'self'` and `form-action 'none'` are unchanged.
  `tests/aon/app.spec.ts` now fails if the served policy stops naming the Maps
  origin or if anything the app needs is refused.

  The diagnosis is worth keeping because the symptom lies: a blocked script and
  a wrong key look identical from the app, and the app's own "map unavailable"
  copy points at the key. Isolating it took bypassing the policy and loading the
  same bundle with the same key from the production origin, where Maps answered
  200 with no console error at all.

### The three-key architecture, written down

One key per platform, each with the restriction type its caller can actually
satisfy. Getting this wrong is what broke iOS:

| Key | Restriction | Delivered by | Used for |
|---|---|---|---|
| web | HTTP referrer, production host only | `.env.web` -> `main.dart.js` | Maps JavaScript API, and the browser's direct `computeRoutes` call |
| iOS | iOS app, bundle `au.edu.mq.astronomy.aon2026` | `.env` `MAPS_API_KEY` -> `ios/Flutter/Secrets.xcconfig` -> `Info.plist GMSApiKey` | Maps SDK for iOS and Routes |
| Android | Android app, package plus signing SHA-1 | `android/secrets.properties` -> manifest | Maps SDK for Android and Routes |

`.env` is native only and `.env.web` is web only. A referrer-restricted key in
`.env` reaches the iOS Maps SDK through two paths — the Podfile's secrets sync
and the Dart define, which `AppDelegate` prefers over `Info.plist` — and the SDK
rejects it, because it authenticates by bundle id and sends no `Referer`.

## 10 September 2026

Astronomy Open Night's dedicated host and information-site handoff were prepared
locally. Deployment and DNS verification remain external release actions.

- **Prepared the app and canonical privacy page for `aon.syllabus-sync.app`.**
  A separate static Worker (`wrangler.aon.jsonc`) is configured to serve the
  Flutter web build, with semantic `/privacy` HTML taking precedence and SPA
  fallback for app routes. The information site keeps its AON hub, support and
  terms pages, and configures the old app and privacy paths as redirects.
- **Confirmed the store contact address.** `leo@leoalavi.dev` was already the
  published contact in the app's release documents, so the placeholder is gone
  and the unit test now requires a working address. This was the last item
  blocking store submission of the pages themselves.
- **Made the app an independent project in the site's own copy.** Astronomy
  Open Night is a separate event project, not a Syllabus Sync product; the
  homepage, portfolio, connections and team sections now state that directly.
- **Isolated the web Maps key.** `npm run aon:build` reads `.env.web` when
  present and otherwise uses the empty example file. The Flutter web
  compilation unit reads only `MAPS_API_KEY`; Android and iOS route-key defines
  are excluded by conditional imports. Bundle verification rejects private key
  material, source maps, private files and oversized assets.
- **Adopted the final event identity and policy scope.** Leo Alavi and Mohammad
  Raouf Abedini are credited as developers for Astronomy Night – FSE Outreach
  Team. Privacy questions go to `leo@leoalavi.dev`; event questions go to
  `astronomyopennight@mq.edu.au`. The canonical English semantic policy is
  generated in the app repository, while the in-app presentation is available
  in English and Persian from the same structured policy source.

- **Fixed a duplicate panorama viewer.** The host and the iframe both trigger
  the 360° tour, by design, so `loadTour` ran twice and Pannellum stacked a
  second WebGL canvas and loading box over the first, downloading every panorama
  twice and leaking the first viewer's GL context. The viewer now tears down the
  previous instance before building the next. `tests/aon/app.spec.ts` catches a
  second viewer in all three engines.

## 9 September 2026

The site went from repository-ready to live on `https://info.syllabus-sync.app`
and gained the Astronomy Open Night store pages.

### Platform and security

- **#4 Production-readiness: dependency hardening, doc fixes, IDE cleanup.**
  Upgraded `next` 16.2.10 to 16.3.4 to clear a critical advisory
  (unauthenticated RCE in the Image Optimization API) and several high ones
  (App Router middleware bypass, SSRF in Server Actions and rewrites), with
  `eslint-config-next` bumped to match. Cleared the transitive advisories with a
  non-forced `npm audit fix`. Removed committed IDE artifacts and corrected
  documentation that had gone stale against the code.
- **#5 Cloudflare Workers deployment via the OpenNext adapter.** Added
  `wrangler.jsonc`, `open-next.config.ts` and the `cf:*` scripts. The adapter
  runs the standard `next build`, so the static/SSG rendering model and the
  self-hosted `next/font` CSP are unchanged. The same pull request added the
  `noindex` response header for non-production hosts and the Cloudflare Rate
  Limiting binding (`CONTACT_RATE_LIMITER`, 5 requests per 60 seconds per
  hashed key) that replaces the process-local limiter at the edge.
- **#6 Fixed a 500 on `/opengraph-image` under Workers.** The brand lockup was
  read with `node:fs`, which does not exist in the Workers runtime. It now
  loads through the `ASSETS` binding and keeps the filesystem read as a local
  fallback.
- Attached `info.syllabus-sync.app` to the Worker, then set Always Use HTTPS
  and Minimum TLS 1.2 on the zone.

### Interface

- **#7 Frontend polish.** Content-page hero, ecosystem cards and inline link
  icons.
- **#8 Footer social grouping, dead-CSS cleanup, tablet-hero stacking fix.** A
  `:has(.product-demo)` rule (specificity 0,2,0) was beating the 860 px media
  query, so product, features and universities heroes stayed two-column on
  tablets. The media query now repeats the `:has()` selector.

### Content

- **#9 Replaced MQ Navigation with Astronomy Open Night in the ecosystem.**
  Facts came from the app repository; the app is in testing ahead of the
  September 2026 event, so it renders with an in-development status and no
  screenshot.
- **#10 Copy audit.** Removed AI writing patterns from the public prose.
- **#11, #12 Removed unreferenced product images** left behind by the ecosystem
  change (eight MQ Navigation files, two Platform files).
- **#13 Hosted the Astronomy Open Night app's store-facing pages.** App Store
  Connect and Google Play both require a live privacy policy and support URL on
  a stable HTTPS host that is not a university domain, and the Google Maps
  Platform terms require the app's terms to flow Google's terms through to end
  users. `/astronomy-open-night` plus the three pages are generated from
  `src/content/astronomy-open-night-legal.ts` and covered by unit and end-to-end
  tests.
- **#14 Audited those pages against the app's own declarations** (the in-app
  policy body, `PrivacyInfo.xcprivacy`, the Info.plist purpose strings, the
  Android permissions and both stores' data answers) and fixed four defects: a
  "collects nothing" overclaim in the Children section, backups covering only
  Android, the undisclosed motion sensor behind the compass, and a TalkBack
  claim the app team had not verified.

## 22 July 2026

- **#3 Ecosystem homepage redesign** (with **#2** reverting an unauthorised
  merge of the same work).

## 21 July 2026

- Initial build of the information site: homepage, eleven supporting pages, the
  guarded contact route, discovery files, documentation and automated
  verification. See `docs/final-implementation-report.md`.
