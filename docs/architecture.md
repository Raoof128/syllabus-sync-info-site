# Architecture

## Decision

The information site is a standalone Next.js 16.2.10 application. The workspace contained only the approved implementation brief and brand images, so a separate deployment boundary is the simplest architecture and avoids coupling public content to the authenticated product.

## Rendering model

- App Router and strict TypeScript.
- Server Components by default.
- Static generation for the homepage and eleven supporting pages.
- File-based metadata routes for sitemap, robots, web manifest, icons and Open Graph media.
- Static route handlers for `llms.txt` and both security-text locations.
- One dynamic `POST /api/contact` Route Handler.
- Client JavaScript limited to mobile navigation and the contact form.

## Content model

`src/content/project-facts.ts` is the claims registry. `src/content/site.ts` owns navigation, route copy and metadata. No CMS is required for the current publishing volume.

## Contact boundary

The contact route validates and normalises input, enforces a 16 KiB body limit, applies a bounded in-memory rate limiter, checks origin, uses a honeypot and timing signal, and forwards only a minimal DTO to an approved HTTPS webhook. No message is persisted or logged by this application.

The in-memory limiter is suitable as defence in depth for a single process. Multi-instance production deployment must add a shared edge or datastore-backed limiter.
