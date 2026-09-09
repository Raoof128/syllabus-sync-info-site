# Deployment

The site is deployed to **Cloudflare Workers** and served at
`https://info.syllabus-sync.app`. The Worker is named `syllabus-sync-info` and
lives in the Cloudflare account that owns the `syllabus-sync.app` zone.

## Gates before deploying

```bash
npm ci
npm run check                 # lint, typecheck, unit tests, production build
npx playwright install --with-deps chromium firefox webkit
npm run test:e2e
```

## Cloudflare Workers (OpenNext)

The OpenNext adapter (`@opennextjs/cloudflare`) runs the standard `next build`
and therefore preserves the static/SSG rendering model (only `/api/contact` is
dynamic). `next/font` stays self-hosted, so the `font-src 'self'` CSP is
unchanged.

```bash
npm run cf:build      # opennextjs-cloudflare build -> .open-next/worker.js
npm run cf:preview    # build + run the Worker locally (workerd) to smoke-test
npm run cf:deploy     # build + deploy to Cloudflare Workers
npm run cf:typegen    # regenerate cloudflare-env.d.ts if bindings are added
```

Configuration lives in `wrangler.jsonc` and `open-next.config.ts`
(defaults; add caching handlers there only if ISR or `"use cache"` is
introduced). Build output (`.open-next/`, `.wrangler/`, `cloudflare-env.d.ts`)
is git-ignored.

`wrangler.jsonc` declares:

- `nodejs_compat`, and a compatibility date that must not be moved backwards.
- the `ASSETS` binding over `.open-next/assets`, which is also how server code
  reads files from `public/` at request time.
- `observability`, so Worker logs are queryable.
- the `CONTACT_RATE_LIMITER` rate-limit binding, 5 requests per 60 seconds.

## Credentials

Use `wrangler login`, or a **scoped** `CLOUDFLARE_API_TOKEN` with Workers
Scripts Write on the target account. Never a root or all-permissions token, and
never a token committed to the repository or pasted into a file inside it. A
Workers Scripts Write token cannot touch DNS, zone settings or Email Routing;
those changes are made in the dashboard by an account owner.

Set `CONTACT_WEBHOOK_URL` and `CONTACT_WEBHOOK_TOKEN` as Worker secrets
(`wrangler secret put …`), not in `wrangler.jsonc`, and never with a
`NEXT_PUBLIC_` prefix.

## Environment

- `CONTACT_WEBHOOK_URL`: approved HTTPS receiver for validated contact enquiries.
- `CONTACT_WEBHOOK_TOKEN`: optional bearer token for that receiver.

## DNS and TLS

Done for the production host, and required again for any new host:

1. Attach the custom domain to the Worker (`Workers -> Domains & Routes`, or
   `PUT /accounts/{id}/workers/domains`). Cloudflare creates the proxied DNS
   record.
2. Turn on Always Use HTTPS for the zone.
3. Set Minimum TLS Version to 1.2.
4. Verify the canonical host and certificate before relying on HSTS.
5. Keep non-production hosts out of the index. Any host other than the
   canonical one already receives `X-Robots-Tag: noindex` from
   `next.config.ts`, so a preview URL is safe by default.

## Production verification

After a deploy, check the public routes, the app CTA, contact delivery,
canonical tags, the OG image (it is server-rendered, so it is the route most
likely to break on a runtime change), sitemap, robots, structured data,
security headers, 404 behaviour and mobile rendering.

The Astronomy Open Night store pages are submitted to Apple and Google, so
treat `/astronomy-open-night/app-privacy`, `/astronomy-open-night/app-support`
and `/astronomy-open-night/app-terms` as must-not-404 routes: an outage there is
a store-compliance problem, not only a broken link. Their canonical URLs are
covered by an end-to-end test.

Add the subdomain to the domain-level Search Console property.
