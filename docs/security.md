# Security review

## Implemented

- Static-compatible Content Security Policy with restrictive defaults, no third-party script origins, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'` and `frame-ancestors 'none'`.
- HSTS, nosniff, strict referrer policy, COOP, legacy frame denial and restricted browser permissions.
- Server-side Zod validation, body and field limits, origin check, bounded rate limiting, timing signal and honeypot on contact submissions.
- HTTPS-only configured webhook with a six-second timeout and filtered DTO.
- Generic client-safe error responses and no message logging.
- `security.txt` at the root and well-known location.

## CSP decision

Nonce CSP would force every otherwise-static page into dynamic rendering. Following the installed Next.js 16.2 documentation, the site uses a static-compatible policy and no third-party scripts. The policy allows framework-required inline scripts/styles. Experimental SRI is not enabled.

## Dependency review

`npm audit` currently reports **0 vulnerabilities**.

Reviewed 2026-09-09: an earlier audit surfaced a critical Next.js advisory (unauthenticated RCE in the Image Optimization API), several high Next.js advisories (App Router middleware/proxy bypass, SSRF in Server Actions and rewrites) and transitive `postcss`/`sharp` advisories, all against Next.js `16.2.10`. These were resolved by upgrading to `next` `16.3.4` (a non-major, in-line security release; `eslint-config-next` bumped to match). The remaining transitive build/lint-tooling advisories (`brace-expansion`, `browserslist`, `js-yaml`, `baseline-browser-mapping`) were cleared with a non-forced `npm audit fix`, which adjusted only nested lockfile versions and left the pinned direct dependencies unchanged. Continue to track upstream Next.js security releases; do not force-downgrade Next.js as npm sometimes suggests.

## Remaining production controls

- Shared rate limiting for multi-instance deployment.
- Approved contact transport and retention process.
- Product application security review before publishing auth, encryption, retention or deletion claims.
- Security contact ownership and incident procedure.
