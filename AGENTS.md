# Syllabus Sync information-site agent rules

## Rules

1. Before any Next.js work, read the version-matched documentation in `node_modules/next/dist/docs/`, especially the relevant App Router, data security, CSP, metadata and testing pages.
2. Read `docs/design-system.md`, `docs/content-governance.md` and `src/content/project-facts.ts` before changing visible content or layout.
3. Preserve React Server Components by default. Add `"use client"` only at the smallest interactive boundary.
4. Never invent user counts, partnerships, endorsements, testimonials, ratings, certifications, feature availability or legal assurances.
5. Never use a university logo, crest or protected visual identity without documented permission.
6. Keep public claims in the typed content source and render only approved proof points.
7. Treat route parameters, form fields, request headers and external responses as untrusted input. Validate on the server, bound input size and do not expose secrets or stack traces.
8. Run `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build` and the relevant Playwright tests before claiming completion. `npm run check` is the first four.
9. Maintain the independence statement: “Syllabus Sync is an independent platform and is not an official university service.”
10. Never write a credential into the repository, a config file, a commit message or a log line. Deploy tokens are read from the environment at call time and stay redacted. Cloudflare secrets belong in `wrangler secret put`.
11. The site runs on Cloudflare Workers, which has no filesystem. Server code that needs a file from `public/` reads it through the `ASSETS` binding, with a filesystem read only as the local fallback. `/opengraph-image` is the route this breaks first.
12. Public prose is written plainly: no em dashes, no “not X, it’s Y” contrasts, no hallmark AI vocabulary, active voice with a named actor. Style only, and it never licenses changing a fact to improve a sentence.
13. Astronomy Open Night store pages have their own rules in `docs/content-governance.md`. They are submitted to Apple and Google, so every statement must trace to that app's own declarations and must not contradict the policy shipped inside the app.
14. Record shipped work in `docs/changelog.md`, and keep `docs/launch-checklist.md` honest about what is still open.

## Project shape

- Next.js App Router, strict TypeScript, Tailwind. Sixteen indexable static routes; `POST /api/contact` is the only dynamic one.
- Content sources: `src/content/site.ts` (navigation, route copy, metadata), `src/content/project-facts.ts` (claims registry), `src/content/astronomy-open-night-legal.ts` (store-facing pages for the Astronomy Open Night app).
- Deployment: `npm run cf:deploy` to Cloudflare Workers via OpenNext. See `docs/deployment.md`.
- Tests: `tests/unit` (Vitest) and `tests/e2e` (Playwright in three engines, axe in Chromium).

`CLAUDE.md` includes this file, so these rules are the single source for every agent working here.

Note: `next dev` appends its own agent-rules block to this file. That block is generated, not reviewed, so revert it rather than committing it.
