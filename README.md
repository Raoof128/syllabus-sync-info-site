# Syllabus Sync information site

Production-oriented public information, product education and trust site for `info.syllabusing.app`.

## Local usage

Requirements: Node.js 20.9 or newer and npm 12 or newer.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Quality gates

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npx playwright install chromium firefox webkit
npm run test:e2e
```

The contact form intentionally returns a clear unavailable-delivery response until `CONTACT_WEBHOOK_URL` is configured with an approved HTTPS transport. See `.env.example` and `docs/deployment.md`.

## Architecture

This is a standalone Next.js 16.2 App Router project. Public pages are statically generated; the contact route is the only dynamic endpoint. Public claims come from `src/content/project-facts.ts` and `src/content/site.ts`.

See `docs/architecture.md`, `docs/launch-checklist.md`, `docs/content-gap-report.md` and `docs/final-implementation-report.md` before production launch.
