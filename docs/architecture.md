# Architecture

## Decision

The information site is a standalone Next.js 16.3.4 application. The workspace contained only the approved implementation brief and brand images, so a separate deployment boundary is the simplest architecture and avoids coupling public content to the authenticated product.

## Rendering model

- App Router and strict TypeScript.
- Server Components by default.
- Static generation for the homepage, eleven supporting pages, the Astronomy Open Night index and its three store-facing pages: sixteen indexable HTML routes, all present in the sitemap.
- Two dynamic segments, both fully prerendered through `generateStaticParams`: `/[slug]` and `/astronomy-open-night/[page]`. An unknown value in either returns the 404 page.
- File-based metadata routes for sitemap, robots, web manifest, icons and Open Graph media.
- Static route handlers for `llms.txt` and both security-text locations.
- One dynamic `POST /api/contact` Route Handler.
- Client JavaScript limited to mobile navigation and the contact form.

## Content model

`src/content/project-facts.ts` is the claims registry. `src/content/site.ts` owns navigation, route copy and metadata. `src/content/astronomy-open-night-legal.ts` owns the Astronomy Open Night store pages and must not contradict the policy text shipped inside that app. No CMS is required for the current publishing volume.

## Runtime

The site runs on Cloudflare Workers through the OpenNext adapter. Two consequences shape the code:

- There is no filesystem. Anything under `public/` that server code needs at request time is read through the `ASSETS` binding, as `src/app/opengraph-image.tsx` does, with a filesystem read kept only as the local-development fallback.
- Worker instances are not shared, so process-local state cannot carry a limit. The contact route uses the Cloudflare Rate Limiting binding for that.

## Contact boundary

The contact route validates and normalises input, enforces a 16 KiB body limit, checks origin, uses a honeypot and timing signal, and forwards only a minimal DTO to an approved HTTPS webhook. No message is persisted or logged by this application.

Rate limiting is the `CONTACT_RATE_LIMITER` binding declared in `wrangler.jsonc`: 5 requests per 60 seconds per hashed key, applied at the edge across instances. The binding is eventually consistent, so the limit engages within a request or two of the threshold rather than exactly on it. The previous bounded in-memory limiter remains as the fallback for local development and for any host without the binding.
