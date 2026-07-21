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

`npm audit` reports a moderate PostCSS advisory through Next.js's exact internal PostCSS 8.4.31 dependency. The site does not accept, transform or render user-supplied CSS, so the advisory's unescaped CSS-stringification path is not reachable in this design. No high or critical advisory is present. Upgrade to an upstream Next.js release that updates the internal dependency when available; do not force-downgrade Next.js as npm currently suggests.

## Remaining production controls

- Shared rate limiting for multi-instance deployment.
- Approved contact transport and retention process.
- Product application security review before publishing auth, encryption, retention or deletion claims.
- Security contact ownership and incident procedure.
