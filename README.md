# Syllabus Sync information site

Public information, product education and trust site for Syllabus Sync. Live at
`https://info.syllabus-sync.app`, deployed to Cloudflare Workers.

## Local usage

Requirements: Node.js 20.9 or newer and npm 12 or newer.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Quality gates

```bash
npm run check          # lint, typecheck, unit tests, production build
npx playwright install chromium firefox webkit
npm run test:e2e       # functional in three engines, axe in Chromium
```

The contact form intentionally returns a clear unavailable-delivery response
until `CONTACT_WEBHOOK_URL` is configured with an approved HTTPS transport. See
`.env.example` and `docs/deployment.md`.

## Deploying

```bash
npm run cf:preview     # build and run the Worker locally (workerd)
npm run cf:deploy      # build and deploy to Cloudflare Workers
```

Deploy auth is `wrangler login` or a scoped `CLOUDFLARE_API_TOKEN`. Never a
root token, and never commit one. Details in `docs/deployment.md`.

## Architecture

A standalone Next.js 16.3 App Router project. Public pages are statically
generated; `POST /api/contact` is the only dynamic route. Public claims come
from `src/content/project-facts.ts` and `src/content/site.ts`, and the
Astronomy Open Night store pages come from
`src/content/astronomy-open-night-legal.ts`.

Read `AGENTS.md` before changing anything. Then `docs/architecture.md`,
`docs/content-governance.md`, `docs/security.md` and `docs/changelog.md`.
`docs/launch-checklist.md` tracks what is still open before a full public
launch.
