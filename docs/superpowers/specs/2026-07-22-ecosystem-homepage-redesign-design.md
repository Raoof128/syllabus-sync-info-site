# Ecosystem homepage redesign — design spec

Status: approved by user 2026-07-22, pending write-up review
Owner: Pouya Alavi Naeini
Scope: `syllabus-sync-info-site` homepage + navigation only (Approach A — single-page narrative with anchor navigation). Dedicated `/sylla` and `/mq-navigation` pages are an explicit future enhancement (Approach C), not part of this pass.

## 1. Background and audit findings

Four research passes (2026-07-22) established ground truth across all three products plus the current info-site. Summary of verified facts this spec relies on:

**Syllabus Sync (core platform)** — `/Users/pouya/Documents/Projects/Syllabus-Sync`
- Real, substantive features: unit/academic planning, calendar & deadlines, campus map, feed, gamification, passkey/MFA auth. Not all equally mature — treat as early access, not a blanket "available now."
- Explicitly independent of Macquarie University; already removed a Macquarie crest logo per its own CHANGELOG. No mention of "Macquarie University Incubator" in this repo — that fact rests on founder-provided information (this spec), not repo evidence.
- No AI SDK dependency. Confirms no embedded Sylla panel exists in this codebase; it only links out to Sylla and to the MQ Navigation repo.
- Reusable assets: `docs/images/{Dashboard,Calendar,Campus map}.png`, `public/images/team/{pouya,raouf}.jpg`.
- Contributors: Pouya Alavi Naeini and Mohammad Raouf Abedini (Raoof128), both real per git log and README credits.

**Sylla** — `/Users/pouya/Documents/Projects/Sylla`
- Chat: real Gemini integration via Vercel AI SDK (`@ai-sdk/google`), conditional on `GOOGLE_GENERATIVE_AI_API_KEY`. Per founder confirmation, the product is live and reachable at `sylla.syllabus-sync.app` — present as early access, not fully mature.
- Study tools (summarize, explain, flashcards, quiz, planner): **100% mock/placeholder**, explicitly commented as such in code (`lib/sylla/ai/mock-provider.ts`). Must not be described as functioning AI features.
- Unit context: hardcoded sample units, not real Syllabus Sync data — planned, not live.
- Embeddable panel inside Syllabus Sync: prototype component exists but is unwired anywhere — planned, not live.
- Contributors: only Pouya Alavi Naeini found in this repo's history. Per founder decision, Sylla is presented as primarily Pouya's build within the ecosystem, without implying Raouf had no role in the broader product.
- No product screenshots in the repo (`public/` is Next.js boilerplate only). Use a genuine current screenshot from the live app if one can be captured; otherwise leave a clearly marked asset TODO — do not fabricate.

**MQ Navigation** — `/Users/pouya/Documents/Projects/MQ_Navigation`
- Real Flutter app, confirmed distinct from "MQ Journey" by its own README. Source-only: no built APK/IPA, no store listing; README itself lists a public demo build as future work.
- Deep-link contract (`lib/features/deep_link/deep_link_contract.dart`, `/open?destination=<id>` etc.) is implemented in code, with custom URL schemes registered in the Android manifest and iOS Info.plist. However, the `/open` route is **not yet registered as an OS-level intent-filter / universal link**, so an external app cannot yet trigger a real handoff — this is a prototype integration, not a production one.
- Both Pouya and Raouf Abedini confirmed as real contributors.
- 7 real screenshots in `screenshots/`, approved for reuse.

**Current info-site** — this repo
- Already has a working content-governance model: `src/content/project-facts.ts` / `site.ts` gate every public claim behind `approved: true` plus a source, enforced by `tests/unit/content.test.ts`. Design system is documented in `docs/design-system.md` ("calm academic command centre": cream/navy/blue/teal palette, Geist type, restrained motion).
- Zero existing content anywhere about Sylla, MQ Navigation, ecosystem, roadmap, incubator, or team — `docs/content-gap-report.md` already flags this as a known deferred gap. This is greenfield addition, not a rewrite of existing claims.

## 2. Information architecture

Primary navigation (`src/components/header.tsx`), all homepage anchors except Contact:

| Label | Target |
|---|---|
| Home | `/` |
| Platform | `#platform` |
| Sylla | `#sylla` |
| MQ Navigation | `#mq-navigation` |
| Vision | `#vision` |
| About | `#team` |
| Contact | `/contact` (existing page, unchanged) |

`#platform`, `#sylla`, and `#mq-navigation` are three directly-linkable anchors inside one ecosystem section (each product's card gets its own `id`), not three separate sections — this keeps Approach A's single-section rhythm while giving each product a stable, nav-linkable identity that a future dedicated page can reuse.

Existing standalone pages (`/privacy`, `/security`, `/accessibility`, `/terms`, `/status`, `/contact`) are unchanged and stay off the anchor flow.

Homepage section order (replaces the current pillars/walkthrough/universities-teaser/origin+FAQ structure — reusable copy from those gets folded into the new sections; anything superseded is removed, not left duplicated):

1. `#hero` — Hero
2. `#problem` — The student problem
3. `#ecosystem` — containing `#platform`, `#sylla`, `#mq-navigation` product cards
4. `#connections` — How Syllabus Sync, Sylla and MQ Navigation connect
5. `#macquarie` — Starting with Macquarie University
6. `#incubator` — Macquarie University Incubator
7. `#vision` — Product roadmap and broader university vision
8. `#team` — Team
9. `#trust` — Privacy, accessibility and trust
10. `#contact-cta` — Final contact CTA

## 3. Content, section by section

### Hero
- Headline: **"One connected ecosystem for university life."** (changed from "platform" to "ecosystem" — accurate because the three products are currently separate-but-related, with some integrations still in development.)
- Supporting copy: close to "Syllabus Sync brings academic planning, AI-powered study support, and campus navigation into one connected student ecosystem — starting at Macquarie University." (final wording drafted at implementation time, reviewed against governance rules)
- CTAs: primary "Explore Syllabus Sync" → `https://www.syllabus-sync.app` (external); secondary "Meet the ecosystem" → `#ecosystem`; tertiary "Open Sylla" → `https://sylla.syllabus-sync.app` (external).
- Must convey: Macquarie-first, multi-university vision, ecosystem (not single app), serious early-stage product, independent (not an official Macquarie service).

### Problem
Fragmentation narrative — separate systems for unit info, assessments, deadlines, study support, campus locations, navigation, university services; consequences (missed deadlines, context-switching, poor campus discovery). Positioning/framing copy, not a factual claim requiring a governance source.

### Ecosystem (three cards, each independently anchorable)

**`#platform` — Syllabus Sync Platform**
- Status label: **"Web platform available in early access"** (not a blanket "available now" — avoids implying every feature is production-ready).
- Feature list with per-feature status, not a single lump claim. Baseline from verified `app/` routes:
  - Academic planning / units — early access
  - Calendar & deadlines — early access
  - Campus map — early access
  - Feed / updates — status to be set individually at implementation time based on maturity (beta/prototype/planned as appropriate — do not default to "available")
  - Gamification — status to be set individually at implementation time (likely beta/prototype)
- Link: `https://www.syllabus-sync.app`
- Screenshots: `Dashboard.png`, `Calendar.png`, `Campus map.png` (optimized copies, sourced from core repo `docs/images/`).

**`#sylla` — Sylla AI Study Assistant**
- Status label: **"AI chat available in early access."**
- Chat: early access, real Gemini-backed.
- Summaries, explanations, flashcards, quizzes, study planning: labelled individually by actual implementation status — currently **prototype/mock**, not functioning AI. Must not be described as fully functioning AI features.
- Embedded assistant panel inside Syllabus Sync: **planned**, not live.
- Link: `https://sylla.syllabus-sync.app`
- Screenshot: genuine current screenshot if obtainable from the live app or repo; otherwise a clearly marked asset TODO. Do not fabricate a product interface.

**`#mq-navigation` — MQ Navigation**
- Status label: **prototype / in development**, not published.
- Integration wording (verbatim direction from founder): "A prototype destination-based deep-linking flow has been implemented between Syllabus Sync and MQ Navigation. Public OS-level linking and the complete production handoff are not yet released." This distinguishes code-level implementation from production availability — more accurate than calling the whole thing merely "planned."
- Link: GitHub repository (no live app/store listing to link to).
- Screenshots: from `MQ_Navigation/screenshots/` (7 available, approved for reuse), optimized copies.

### How they connect (`#connections`)
- Syllabus Sync = academic context and student workspace; Sylla = AI-powered study layer; MQ Navigation = campus wayfinding layer — framed as one ecosystem under a shared brand, not disconnected side projects.
- Describes the *intended* connected experience (shared identity, moving between specialized experiences) without exposing implementation details — no mention of Supabase, auth cookies, or backend architecture in public copy. That detail lives only in `project-facts.ts` source notes for internal/governance reference, not in rendered marketing copy.
- Current reality: mostly independent products today: deep integration (embedded Sylla panel, live deep-linking) is labelled "in development," consistent with the ecosystem card statuses above.

### Starting with Macquarie (`#macquarie`)
- Founder-proximity narrative: building from direct student experience at Macquarie, first implementation and validation environment.
- Retains the site's existing independence statement verbatim (must continue to satisfy `tests/unit/content.test.ts`'s existing check): "Syllabus Sync is an independent platform and is not an official university service."

### Incubator (`#incubator`)
- Exact approved wording: **"Selected for the Macquarie University Incubator in May 2026."**
- Expanded context where space allows: "Syllabus Sync was selected for the Macquarie University Incubator in May 2026, providing the team with access to mentoring, customer discovery and founder development opportunities."
- Independence disclaimer retained alongside this section so it cannot be read as Macquarie owning, operating, or officially endorsing the product.

### Roadmap / vision (`#vision`)
- Phase 1 — Macquarie University: complete the initial ecosystem, validate workflows, strengthen Sylla and MQ Navigation integration, gather feedback, incubator development.
- Phase 2 — **"Expansion to other Sydney universities"** (kept broad; no individual universities named, since no partnerships or discussions are confirmed — avoids implying existing relationships).
- Phase 3 — Australia-wide expansion, standardized institution adapters, scalable multi-tenant direction.
- Every phase explicitly labelled as a future direction, not a commitment or confirmed rollout. Visual timeline treatment.

### Team (`#team`)
- Pouya Alavi Naeini — **Co-founder, Software Engineering & Product**. LinkedIn: `https://www.linkedin.com/in/pouya-alavi/`, GitHub: `https://github.com/mrpouyaalavi`.
- Raouf — **Co-founder, Backend & Platform Engineering**. LinkedIn: `https://www.linkedin.com/in/mohammad-raouf-abedini-885a9226a/`, GitHub: `https://github.com/Raoof128`.
- Names/photos link out (name or photo, not both emphasized) — kept modest, product stays the visual focus, not the founders.
- Copy frames the ecosystem as collaborative work across both founders (per the core platform and MQ Navigation's shared authorship) while accurately noting Sylla is primarily Pouya's build, without implying Raouf had no involvement in the broader product.
- Photos: `public/images/team/{pouya,raouf}.jpg`, copied and optimized from the core repo, originals preserved at source.

### Trust (`#trust`)
- Independence statement, privacy-aware framing, explicit AI-uncertainty acknowledgment for Sylla, links to `/privacy`, `/security`, `/accessibility`.
- No unverifiable security/privacy claims.

### Final CTA (`#contact-cta`)
- "Contact the team" / "Get in touch" → existing `/contact` page and its existing form (`src/app/api/contact/route.ts`), unchanged backend.
- No visible raw email address on the standard path.
- If the form errors, show a clear error state; may optionally surface `pouya@syllabus-sync.app` as a fallback. Only one fallback address, not both founders' — avoids unnecessary exposure. Clear success, validation, and error states required (existing form's states should already cover this — verify, don't rebuild, unless a gap is found).

## 4. Data model / content-governance changes

New typed fields added to `src/content/project-facts.ts` (or a sibling file if that keeps the module focused — implementation detail to decide when writing code, following existing file-size/clarity conventions):

- `ecosystem`: per-product entries (Syllabus Sync, Sylla, MQ Navigation) with name, description, link, and a list of features each carrying a **typed status enum** rather than free text:
  ```ts
  type FeatureStatus = "available" | "early-access" | "prototype" | "in-development" | "planned";
  ```
  Used for every feature-level and integration-level claim in the ecosystem, connections, and roadmap sections (e.g. Sylla chat = `"early-access"`, Sylla study tools = `"prototype"`, MQ Navigation deep-link = `"prototype"`, embedded Sylla panel = `"planned"`).
- `roadmapPhases`: the three phases above, each explicitly tagged as a future direction (not a status enum member like the above — these are timeline entries, not feature claims).
- `incubator`: the approved wording plus source/date.
- `team`: founder entries with role, LinkedIn, GitHub, and a short, factual contribution note.

Every new field requires `approved: true` and a source note (e.g. "Founder-provided, 2026-07-22" for incubator/LinkedIn/team facts, "Repo audit, 2026-07-22" for feature-status claims), consistent with the existing governance model in `docs/content-governance.md`. `tests/unit/content.test.ts` gets extended to cover the new fields (approval filtering, no missing sources) rather than bypassed.

## 5. Components

New homepage section components under `src/components/`, composed into `src/app/page.tsx`, following existing conventions (server components by default; `"use client"` only if a section needs interactivity, e.g. a roadmap timeline with hover states):
- `ecosystem-section.tsx` (contains the three anchorable product cards)
- `connections-section.tsx`
- `macquarie-section.tsx`
- `incubator-section.tsx`
- `roadmap-section.tsx`
- `team-section.tsx`

`trust-section.tsx` may reuse/extend an existing trust-related block if the current homepage already has one worth keeping (confirm at implementation time rather than assuming a rewrite). All new components use only tokens/patterns already defined in `docs/design-system.md` — no new visual language, no gradients/glassmorphism, matching the site's existing restrained aesthetic.

`header.tsx` updated for the new anchor set. Footer (`footer.tsx`) may gain the LinkedIn company link (`https://www.linkedin.com/company/syllabuss-sync/`, displayed as "Syllabus Sync" despite the URL slug mismatch — this is a known, temporary LinkedIn URL-lock constraint, not an error).

## 6. Assets

Approved for copying (optimize for web, preserve source originals untouched):
- `docs/images/{Dashboard,Calendar,Campus map}.png` from the core Syllabus Sync repo
- `public/images/team/{pouya,raouf}.jpg` from the core Syllabus Sync repo
- All 7 screenshots from `MQ_Navigation/screenshots/`
- Sylla: genuine current screenshot only if one can be obtained from the live app or its repo; otherwise a clearly marked TODO placeholder in code/content — never a fabricated interface.

## 7. Verification

Before this is considered done: `npm run lint`, `npm run typecheck`, `npm run test` (including the extended content-governance test), `npm run build`, and relevant Playwright e2e tests. Manual pass in-browser for: responsive layout at mobile/tablet/desktop, no console errors, no broken image links, keyboard navigation through the new anchors, and that the independence/incubator disclaimers render as specified.

## 8. Explicit non-goals for this pass

- No dedicated `/sylla` or `/mq-navigation` pages (Approach C, future work).
- No visual/design-system overhaul — extend existing tokens only.
- No naming of specific Sydney universities as roadmap targets.
- No exposing of Supabase/auth implementation details in public copy.
- No fabricated screenshots, metrics, testimonials, or partnerships.
