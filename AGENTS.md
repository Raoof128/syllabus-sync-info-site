# Syllabus Sync information-site agent rules

1. Before any Next.js work, read the version-matched documentation in `node_modules/next/dist/docs/`, especially the relevant App Router, data security, CSP, metadata and testing pages.
2. Read `docs/design-system.md`, `docs/content-governance.md` and `src/content/project-facts.ts` before changing visible content or layout.
3. Preserve React Server Components by default. Add `"use client"` only at the smallest interactive boundary.
4. Never invent user counts, partnerships, endorsements, testimonials, ratings, certifications, feature availability or legal assurances.
5. Never use a university logo, crest or protected visual identity without documented permission.
6. Keep public claims in the typed content source and render only approved proof points.
7. Treat route parameters, form fields, request headers and external responses as untrusted input. Validate on the server, bound input size and do not expose secrets or stack traces.
8. Run `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build` and the relevant Playwright tests before claiming completion.
9. Maintain the independence statement: “Syllabus Sync is an independent platform and is not an official university service.”
