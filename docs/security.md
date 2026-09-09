# Security review

## Implemented

- Static-compatible Content Security Policy with restrictive defaults, no third-party script origins, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'` and `frame-ancestors 'none'`.
- HSTS, nosniff, strict referrer policy, COOP, legacy frame denial and restricted browser permissions.
- `X-Robots-Tag: noindex` on any host other than the canonical production host, so preview and staging URLs cannot be indexed.
- Server-side Zod validation, body and field limits, origin check, timing signal and honeypot on contact submissions.
- Edge rate limiting on contact submissions: the Cloudflare `CONTACT_RATE_LIMITER` binding, 5 requests per 60 seconds per hashed key, shared across Worker instances. The bounded in-memory limiter remains as the fallback where the binding is absent.
- HTTPS-only configured webhook with a six-second timeout and filtered DTO.
- Generic client-safe error responses and no message logging.
- `security.txt` at the root and well-known location.
- Zone settings on `syllabus-sync.app`: Always Use HTTPS and Minimum TLS Version 1.2.

## CSP decision

Nonce CSP would force every otherwise-static page into dynamic rendering. Following the installed Next.js documentation, the site uses a static-compatible policy and no third-party scripts. The policy allows framework-required inline scripts/styles. Experimental SRI is not enabled.

## Dependency review

`npm audit` reports **0 vulnerabilities**.

Reviewed 9 September 2026, in two passes.

The first pass surfaced a critical Next.js advisory (unauthenticated RCE in the Image Optimization API), several high Next.js advisories (App Router middleware/proxy bypass, SSRF in Server Actions and rewrites) and transitive `postcss`/`sharp` advisories, all against Next.js `16.2.10`. These were resolved by upgrading to `next` `16.3.4` (a non-major, in-line security release; `eslint-config-next` bumped to match). The remaining transitive build/lint-tooling advisories (`brace-expansion`, `browserslist`, `js-yaml`, `baseline-browser-mapping`) were cleared with a non-forced `npm audit fix`, which adjusted only nested lockfile versions and left the pinned direct dependencies unchanged.

The second pass found four high `sharp` advisories (`GHSA-g89c-p67h-r497` and `GHSA-2jg2-4ch7-h545`, both in bundled libheif) reachable only through `wrangler -> miniflare -> sharp`, which is the local Workers emulator and never part of the deployed bundle. npm offered only a breaking `--force` change, so the fix is an `overrides` entry pinning `sharp` to `^0.35.4`. That is the version Next.js already resolves to, so the override deduplicates the tree rather than adding a second copy.

Do not force-downgrade Next.js as npm sometimes suggests. Continue to track upstream Next.js security releases, and re-check the `sharp` override whenever `wrangler` is upgraded, since it can be dropped once miniflare ships a patched range.

## Remaining production controls

- Approved contact transport and retention process.
- Product application security review before publishing auth, encryption, retention or deletion claims.
- Security contact ownership and incident procedure.
