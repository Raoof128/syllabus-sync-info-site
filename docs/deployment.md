# Deployment

## Build

```bash
npm ci
npm run check
npx playwright install --with-deps chromium firefox webkit
npm run test:e2e
npm run start
```

Use a current Node.js host with Next.js App Router support. Vercel works directly. Other platforms must use a currently supported adapter and pass the same production-build and route tests.

## Cloudflare Workers (OpenNext)

The site is configured to deploy to Cloudflare Workers via the OpenNext adapter
(`@opennextjs/cloudflare`), which runs the standard `next build` and therefore
preserves the static/SSG rendering model (only `/api/contact` is dynamic).
`next/font` stays self-hosted, so the `font-src 'self'` CSP is unchanged.

```bash
npm run cf:build      # opennextjs-cloudflare build -> .open-next/worker.js
npm run cf:preview    # build + run the Worker locally (workerd) to smoke-test
npm run cf:deploy     # build + deploy to Cloudflare Workers (needs wrangler auth)
npm run cf:typegen    # regenerate cloudflare-env.d.ts if bindings are added
```

Configuration lives in `wrangler.jsonc` (`nodejs_compat`, `.open-next/assets`
served via the `ASSETS` binding, observability on) and `open-next.config.ts`
(defaults; add caching handlers here only if ISR / `"use cache"` is introduced).
Build output (`.open-next/`, `.wrangler/`, `cloudflare-env.d.ts`) is git-ignored.

Deploy auth: use `wrangler login`, or a **scoped** `CLOUDFLARE_API_TOKEN` with
Workers Scripts Write on the target account — never a root/all-permissions token.
Set `CONTACT_WEBHOOK_URL` / `CONTACT_WEBHOOK_TOKEN` as Worker secrets
(`wrangler secret put …`), not in `wrangler.jsonc`.

The custom domain (`info.syllabus-sync.app`) is attached to the Worker in the
Cloudflare dashboard/API and requires DNS + TLS on the `syllabus-sync.app` zone
(see below) — a token with Workers Scripts Write alone cannot create it.

## Environment

- `CONTACT_WEBHOOK_URL`: approved HTTPS receiver for validated contact enquiries.
- `CONTACT_WEBHOOK_TOKEN`: optional bearer token for that receiver.

Secrets must be configured in the deployment platform, never committed or prefixed with `NEXT_PUBLIC_`.

## DNS and TLS

1. Create the provider-specific `info` CNAME or A/AAAA record.
2. Add `info.syllabus-sync.app` as the production host.
3. Verify automatic TLS and HTTP-to-HTTPS redirection.
4. Verify the canonical host and certificate before relying on HSTS.
5. Keep staging hosts blocked from indexing.

## Production verification

Check every public route, app CTA, contact delivery, canonical tags, OG image, sitemap, robots, structured data, security headers, 404 behaviour and mobile rendering. Add the subdomain to the domain-level Search Console property.
