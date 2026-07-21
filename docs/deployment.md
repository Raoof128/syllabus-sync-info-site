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

## Environment

- `CONTACT_WEBHOOK_URL`: approved HTTPS receiver for validated contact enquiries.
- `CONTACT_WEBHOOK_TOKEN`: optional bearer token for that receiver.

Secrets must be configured in the deployment platform, never committed or prefixed with `NEXT_PUBLIC_`.

## DNS and TLS

1. Create the provider-specific `info` CNAME or A/AAAA record.
2. Add `info.syllabusing.app` as the production host.
3. Verify automatic TLS and HTTP-to-HTTPS redirection.
4. Verify the canonical host and certificate before relying on HSTS.
5. Keep staging hosts blocked from indexing.

## Production verification

Check every public route, app CTA, contact delivery, canonical tags, OG image, sitemap, robots, structured data, security headers, 404 behaviour and mobile rendering. Add the subdomain to the domain-level Search Console property.
