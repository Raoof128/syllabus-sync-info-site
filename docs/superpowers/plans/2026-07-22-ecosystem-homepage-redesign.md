# Ecosystem Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the `syllabus-sync-info-site` homepage as a single-page ecosystem narrative (hero → problem → ecosystem → connections → Macquarie → incubator → roadmap → team → trust → contact CTA) with anchor navigation, using only verified facts from the 2026-07-22 audit, while keeping the existing content-governance model intact.

**Architecture:** Next.js 16 App Router, server components by default. All new public claims are added as typed, `approved`-gated entries in `src/content/project-facts.ts` (extending the existing governance pattern), rendered by new section components composed into `src/app/page.tsx`. Navigation (`src/content/site.ts`, `src/components/header.tsx`, `src/components/footer.tsx`) is updated to point at the new anchors while existing standalone pages (`/product`, `/features`, `/security`, `/privacy`, `/accessibility`, `/universities`, `/about`, `/updates`, `/terms`, `/status`, `/contact`) remain untouched and reachable from the footer.

**Tech Stack:** Next.js 16.2 App Router, React, TypeScript, Vitest (unit/content governance tests), Playwright (e2e), existing hand-rolled CSS in `src/app/globals.css` using CSS custom properties (no CSS framework).

## Global Constraints

- Every new public claim must be added to `src/content/project-facts.ts` with `approved: true` and a `source` string, per `docs/content-governance.md`. Never render an unapproved claim.
- Production domain is `syllabus-sync.app` (confirmed via the core Syllabus Sync repo's README, `.env.example`, and cross-subdomain auth cookie config) — NOT `syllabusing.app`, which is stale.
- Sylla study tools (summarize, explain, flashcards, quiz, planner) must never be described as live/functioning AI — only chat is early-access; the rest are `"prototype"`.
- MQ Navigation deep-linking must be described as: "A prototype destination-based deep-linking flow has been implemented between Syllabus Sync and MQ Navigation. Public OS-level linking and the complete production handoff are not yet released." — not as fully planned, not as fully live.
- Roadmap Phase 2 must say "Expansion to other Sydney universities" with no individual university named.
- No Supabase/auth/cookie implementation detail appears in rendered marketing copy (source notes in `project-facts.ts` are fine; UI copy is not).
- Team section: Pouya = "Co-founder, Software Engineering & Product"; Raouf = "Co-founder, Backend & Platform Engineering". Sylla is attributed primarily to Pouya without implying Raouf had no role in the wider ecosystem.
- Incubator wording is exact: "Selected for the Macquarie University Incubator in May 2026." with optional expansion: "Syllabus Sync was selected for the Macquarie University Incubator in May 2026, providing the team with access to mentoring, customer discovery and founder development opportunities." Independence statement must appear alongside it.
- Contact CTA links to the existing `/contact` page/form; no raw email visible on the standard path. Only `pouya@syllabus-sync.app` may appear as a fallback (never both founders' addresses).
- No new visual language — reuse `docs/design-system.md` tokens/colors/type only (`--canvas`, `--surface`, `--ink`, `--muted`, `--blue`, `--red`, `--teal`, `--gold`, `--line`, existing radii/shadow). No gradients beyond what's already used, no glassmorphism.
- Preserve `tests/unit/content.test.ts`'s existing assertion that `projectFacts.independenceStatement` contains `"not an official university service"`.
- No dedicated `/sylla` or `/mq-navigation` pages in this pass (future work) — but data/components must be structured so those pages can reuse the same `project-facts.ts` entries later without rework.

---

## Task 1: Fix the production domain and add the ecosystem content model

**Files:**
- Modify: `src/content/project-facts.ts`
- Modify: `tests/unit/content.test.ts`
- Modify: `tests/e2e/site.spec.ts:9` (domain assertion — will be revisited again in Task 8, only the domain literal changes here)

**Interfaces:**
- Produces: `FeatureStatus` type, `EcosystemFeature` type, `EcosystemProduct` type, `RoadmapPhase` type, `TeamMember` type, `IncubatorFact` type; `projectFacts.ecosystem: EcosystemProduct[]`, `projectFacts.roadmapPhases: RoadmapPhase[]`, `projectFacts.team: TeamMember[]`, `projectFacts.incubator: IncubatorFact`; exported `approvedEcosystem`, `approvedRoadmapPhases`, `approvedTeam` (filtered arrays, following the existing `approvedFeatures`/`approvedProofPoints` pattern). These are consumed by every component task below.

- [ ] **Step 1: Write the failing content-governance tests**

Append to `tests/unit/content.test.ts` (add these imports to the existing import lines and these new `it` blocks inside the existing `describe`):

```ts
import {
  approvedEcosystem,
  approvedFeatures,
  approvedProofPoints,
  approvedRoadmapPhases,
  approvedTeam,
  projectFacts,
} from "@/content/project-facts";
```

```ts
  it("uses the real production domain, not the stale placeholder", () => {
    expect(projectFacts.mainApplicationUrl).toBe("https://www.syllabus-sync.app");
    expect(projectFacts.informationSiteUrl).toBe("https://info.syllabus-sync.app");
  });

  it("only exposes approved ecosystem products, each with an id and at least one feature", () => {
    expect(approvedEcosystem.length).toBe(3);
    expect(approvedEcosystem.every((product) => product.approved)).toBe(true);
    expect(approvedEcosystem.map((product) => product.id)).toEqual([
      "platform",
      "sylla",
      "mq-navigation",
    ]);
    expect(approvedEcosystem.every((product) => product.features.length > 0)).toBe(true);
  });

  it("never claims Sylla's study tools are anything more than a prototype", () => {
    const sylla = approvedEcosystem.find((product) => product.id === "sylla")!;
    const chat = sylla.features.find((feature) => feature.name === "AI chat")!;
    const studyTools = sylla.features.filter((feature) => feature.name !== "AI chat" && feature.name !== "Embedded assistant panel inside Syllabus Sync");
    expect(chat.status).toBe("early-access");
    expect(studyTools.every((feature) => feature.status === "prototype")).toBe(true);
  });

  it("keeps the roadmap's Sydney phase free of named universities", () => {
    const sydneyPhase = approvedRoadmapPhases.find((phase) => phase.phase === "Phase 2")!;
    expect(sydneyPhase.title).toBe("Expansion to other Sydney universities");
    for (const named of ["University of Sydney", "UNSW", "UTS", "Western Sydney University"]) {
      expect(sydneyPhase.description).not.toContain(named);
      expect(sydneyPhase.items.join(" ")).not.toContain(named);
    }
  });

  it("attributes the team accurately", () => {
    expect(approvedTeam).toHaveLength(2);
    expect(approvedTeam.every((member) => member.approved)).toBe(true);
    const pouya = approvedTeam.find((member) => member.name.startsWith("Pouya"))!;
    const raouf = approvedTeam.find((member) => member.name.startsWith("Raouf") || member.name.includes("Raouf"))!;
    expect(pouya.role).toBe("Co-founder, Software Engineering & Product");
    expect(raouf.role).toBe("Co-founder, Backend & Platform Engineering");
  });

  it("states the incubator fact with the exact approved wording", () => {
    expect(projectFacts.incubator.headline).toBe(
      "Selected for the Macquarie University Incubator in May 2026.",
    );
    expect(projectFacts.incubator.approved).toBe(true);
  });
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run tests/unit/content.test.ts`
Expected: FAIL — `approvedEcosystem`, `approvedRoadmapPhases`, `approvedTeam`, `projectFacts.incubator` do not exist yet; domain assertion fails against the current `https://syllabusing.app` value.

- [ ] **Step 3: Fix the domain values and add the ecosystem content model**

In `src/content/project-facts.ts`, replace lines 22-23:

```ts
  mainApplicationUrl: "https://syllabusing.app",
  informationSiteUrl: "https://info.syllabusing.app",
```

with:

```ts
  mainApplicationUrl: "https://www.syllabus-sync.app",
  informationSiteUrl: "https://info.syllabus-sync.app",
```

Add these types after the existing `ProductFeature` type (after line 16):

```ts
export type FeatureStatus =
  | "available"
  | "early-access"
  | "prototype"
  | "in-development"
  | "planned";

export type EcosystemFeature = {
  name: string;
  description: string;
  status: FeatureStatus;
  source: string;
  approved: boolean;
};

export type EcosystemProduct = {
  id: "platform" | "sylla" | "mq-navigation";
  name: string;
  tagline: string;
  description: string;
  statusLabel: string;
  link: { label: string; href: string; external: boolean };
  screenshot?: { src: string; alt: string };
  features: EcosystemFeature[];
  source: string;
  approved: boolean;
};

export type RoadmapPhase = {
  phase: string;
  title: string;
  description: string;
  items: string[];
  source: string;
  approved: boolean;
};

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  linkedIn: string;
  gitHub: string;
  photo: string;
  source: string;
  approved: boolean;
};

export type IncubatorFact = {
  headline: string;
  detail: string;
  source: string;
  approved: boolean;
};
```

Add these fields inside the `projectFacts` object, immediately before the closing `lastReviewed: "2026-07-21",` line (i.e. after the `features: [...] satisfies ProductFeature[],` block, line 76):

```ts
  ecosystem: [
    {
      id: "platform",
      name: "Syllabus Sync Platform",
      tagline: "The main workspace and entry point into the ecosystem.",
      description:
        "The core web platform for academic planning, deadlines, the calendar, campus context and the rest of the student day — and the entry point into Sylla and MQ Navigation.",
      statusLabel: "Web platform available in early access",
      link: { label: "Open Syllabus Sync", href: "https://www.syllabus-sync.app", external: true },
      screenshot: { src: "/products/platform-dashboard.png", alt: "Syllabus Sync dashboard showing a semester overview" },
      features: [
        { name: "Academic planning & units", description: "Bring units and academic commitments into one semester view.", status: "early-access", source: "Repo audit, 2026-07-22", approved: true },
        { name: "Calendar & deadlines", description: "See upcoming classes, tasks and assessment dates together.", status: "early-access", source: "Repo audit, 2026-07-22", approved: true },
        { name: "Campus map", description: "Connect academic commitments with campus locations.", status: "early-access", source: "Repo audit, 2026-07-22", approved: true },
        { name: "Feed & updates", description: "Keep relevant student events and changes visible.", status: "early-access", source: "Repo audit, 2026-07-22", approved: true },
        { name: "Gamification", description: "Lightweight motivation features layered on top of planning.", status: "prototype", source: "Repo audit, 2026-07-22", approved: true },
      ],
      source: "Repo audit, 2026-07-22",
      approved: true,
    },
    {
      id: "sylla",
      name: "Sylla",
      tagline: "The AI-assisted study companion for the Syllabus Sync ecosystem.",
      description:
        "A standalone AI study assistant today, with chat available in early access. Study tools are working prototypes, not yet live AI features.",
      statusLabel: "AI chat available in early access",
      link: { label: "Open Sylla", href: "https://sylla.syllabus-sync.app", external: true },
      features: [
        { name: "AI chat", description: "Ask questions and get help understanding study material.", status: "early-access", source: "Repo audit, 2026-07-22", approved: true },
        { name: "Summaries", description: "Condense study material into shorter overviews.", status: "prototype", source: "Repo audit, 2026-07-22", approved: true },
        { name: "Concept explanations", description: "Explain a difficult concept in simpler terms.", status: "prototype", source: "Repo audit, 2026-07-22", approved: true },
        { name: "Flashcards", description: "Generate flashcards from study material.", status: "prototype", source: "Repo audit, 2026-07-22", approved: true },
        { name: "Quizzes & practice questions", description: "Generate quiz-style practice questions.", status: "prototype", source: "Repo audit, 2026-07-22", approved: true },
        { name: "Structured study planning", description: "Help build a structured study plan.", status: "prototype", source: "Repo audit, 2026-07-22", approved: true },
        { name: "Embedded assistant panel inside Syllabus Sync", description: "A compact Sylla panel inside the main Syllabus Sync workspace.", status: "planned", source: "Repo audit, 2026-07-22", approved: true },
      ],
      source: "Repo audit, 2026-07-22",
      approved: true,
    },
    {
      id: "mq-navigation",
      name: "MQ Navigation",
      tagline: "The mobile campus navigation companion.",
      description:
        "A mobile wayfinding app for Macquarie University's campus, built to hand off from Syllabus Sync so students can get from a plan to a place.",
      statusLabel: "Mobile prototype, not yet published",
      link: { label: "View on GitHub", href: "https://github.com/mrpouyaalavi/MQ_Navigation", external: true },
      screenshot: { src: "/products/mq-navigation-map.png", alt: "MQ Navigation campus map screen" },
      features: [
        { name: "Campus map & building discovery", description: "Find buildings, services and locations on campus.", status: "prototype", source: "Repo audit, 2026-07-22", approved: true },
        { name: "Safety toolkit", description: "Quick access to emergency numbers, AEDs, first aid and shuttle information.", status: "prototype", source: "Repo audit, 2026-07-22", approved: true },
        { name: "Favourites & saved locations", description: "Save frequently used campus locations.", status: "prototype", source: "Repo audit, 2026-07-22", approved: true },
        {
          name: "Destination deep-linking from Syllabus Sync",
          description: "A prototype destination-based deep-linking flow has been implemented between Syllabus Sync and MQ Navigation. Public OS-level linking and the complete production handoff are not yet released.",
          status: "in-development",
          source: "Repo audit, 2026-07-22",
          approved: true,
        },
      ],
      source: "Repo audit, 2026-07-22",
      approved: true,
    },
  ] satisfies EcosystemProduct[],
  roadmapPhases: [
    {
      phase: "Phase 1",
      title: "Macquarie University",
      description:
        "Complete and validate the initial ecosystem at Macquarie: strengthen academic planning, improve Sylla, and deepen the Syllabus Sync–MQ Navigation integration, informed by direct student feedback and the Macquarie University Incubator.",
      items: [
        "Validate academic planning workflows",
        "Improve Sylla's study tools",
        "Strengthen the MQ Navigation integration",
        "Gather student feedback",
        "Incubator-supported development",
      ],
      source: "Founder-provided, 2026-07-22",
      approved: true,
    },
    {
      phase: "Phase 2",
      title: "Expansion to other Sydney universities",
      description:
        "A future direction, not a confirmed rollout: adapting the data layer for institution-specific academic and campus information, and validating integrations one university at a time as partnerships and feasibility allow.",
      items: [
        "Adapt the data layer for new institutions",
        "Add institution-specific academic information",
        "Add campus-specific navigation data",
        "Explore partnership and pilot opportunities",
      ],
      source: "Founder-provided, 2026-07-22",
      approved: true,
    },
    {
      phase: "Phase 3",
      title: "Australia-wide expansion",
      description:
        "A longer-term direction: standardising institution adapters and building the scalable, multi-tenant infrastructure a broader Australian rollout would need.",
      items: [
        "Standardise institution adapters",
        "Develop multi-tenant architecture",
        "Build broader student-experience infrastructure",
      ],
      source: "Founder-provided, 2026-07-22",
      approved: true,
    },
  ] satisfies RoadmapPhase[],
  team: [
    {
      name: "Pouya Alavi Naeini",
      role: "Co-founder, Software Engineering & Product",
      bio: "Leads software engineering and product direction across Syllabus Sync and Sylla, with full-stack and applied-AI implementation work.",
      linkedIn: "https://www.linkedin.com/in/pouya-alavi/",
      gitHub: "https://github.com/mrpouyaalavi",
      photo: "/team/pouya.jpg",
      source: "Founder-provided, 2026-07-22",
      approved: true,
    },
    {
      name: "Mohammad Raouf Abedini",
      role: "Co-founder, Backend & Platform Engineering",
      bio: "Leads backend, security and platform engineering across Syllabus Sync and MQ Navigation.",
      linkedIn: "https://www.linkedin.com/in/mohammad-raouf-abedini-885a9226a/",
      gitHub: "https://github.com/Raoof128",
      photo: "/team/raouf.jpg",
      source: "Founder-provided, 2026-07-22",
      approved: true,
    },
  ] satisfies TeamMember[],
  incubator: {
    headline: "Selected for the Macquarie University Incubator in May 2026.",
    detail:
      "Syllabus Sync was selected for the Macquarie University Incubator in May 2026, providing the team with access to mentoring, customer discovery and founder development opportunities.",
    source: "Founder-provided, 2026-07-22",
    approved: true,
  } satisfies IncubatorFact,
```

Add these exports after the existing `approvedFeatures` export (after line 86):

```ts
export const approvedEcosystem = projectFacts.ecosystem.filter((product) => product.approved);

export const approvedRoadmapPhases = projectFacts.roadmapPhases.filter((phase) => phase.approved);

export const approvedTeam = projectFacts.team.filter((member) => member.approved);
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run tests/unit/content.test.ts`
Expected: PASS (all tests including the pre-existing ones)

- [ ] **Step 5: Commit**

```bash
git add src/content/project-facts.ts tests/unit/content.test.ts
git commit -m "Fix production domain and add ecosystem content model"
```

---

## Task 2: Update navigation to the anchor-based ecosystem structure

**Files:**
- Modify: `src/content/site.ts:5-22`
- Modify: `tests/unit/content.test.ts` (uniqueness test already covers this — no new test needed, just verify it still passes)

**Interfaces:**
- Consumes: nothing new from Task 1.
- Produces: updated `primaryNavigation` (7 entries: Home, Platform, Sylla, MQ Navigation, Vision, About, Contact) and `footerNavigation` (explicit array, no longer derived from `primaryNavigation.slice`) — consumed by `header.tsx` and `footer.tsx` in Task 7.

- [ ] **Step 1: Write the failing test**

Add to `tests/unit/content.test.ts` (inside the existing `describe` block):

```ts
  it("primary navigation reflects the ecosystem anchor structure", () => {
    expect(primaryNavigation.map((item) => item.label)).toEqual([
      "Home",
      "Platform",
      "Sylla",
      "MQ Navigation",
      "Vision",
      "About",
      "Contact",
    ]);
    expect(primaryNavigation.find((item) => item.label === "Platform")?.href).toBe("/#platform");
    expect(primaryNavigation.find((item) => item.label === "Sylla")?.href).toBe("/#sylla");
    expect(primaryNavigation.find((item) => item.label === "MQ Navigation")?.href).toBe("/#mq-navigation");
  });

  it("footer navigation still reaches every existing standalone page", () => {
    const paths = footerNavigation.map((item) => item.href);
    for (const path of ["/product", "/features", "/security", "/privacy", "/accessibility", "/terms", "/universities", "/about", "/updates", "/contact", "/status"]) {
      expect(paths).toContain(path);
    }
  });
```

Add `footerNavigation` to the existing `import { pageMetadata, pageSlugs, primaryNavigation } from "@/content/site";` line so it reads:

```ts
import { footerNavigation, pageMetadata, pageSlugs, primaryNavigation } from "@/content/site";
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/unit/content.test.ts`
Expected: FAIL — current `primaryNavigation` labels don't match, `footerNavigation` missing some paths in the new expected shape (test written against the target state).

- [ ] **Step 3: Update the navigation arrays**

Replace lines 5-22 of `src/content/site.ts`:

```ts
export const primaryNavigation = [
  { label: "Product", href: "/product" },
  { label: "Features", href: "/features" },
  { label: "Security", href: "/security" },
  { label: "For Universities", href: "/universities" },
  { label: "About", href: "/about" },
  { label: "Updates", href: "/updates" },
] as const;

export const footerNavigation = [
  ...primaryNavigation.slice(0, 3),
  { label: "Privacy", href: "/privacy" },
  { label: "Accessibility", href: "/accessibility" },
  { label: "Terms", href: "/terms" },
  { label: "Updates", href: "/updates" },
  { label: "Contact", href: "/contact" },
  { label: "Status", href: "/status" },
] as const;
```

with:

```ts
export const primaryNavigation = [
  { label: "Home", href: "/" },
  { label: "Platform", href: "/#platform" },
  { label: "Sylla", href: "/#sylla" },
  { label: "MQ Navigation", href: "/#mq-navigation" },
  { label: "Vision", href: "/#vision" },
  { label: "About", href: "/#team" },
  { label: "Contact", href: "/contact" },
] as const;

export const footerNavigation = [
  { label: "Platform", href: "/product" },
  { label: "Features", href: "/features" },
  { label: "Security", href: "/security" },
  { label: "Privacy", href: "/privacy" },
  { label: "Accessibility", href: "/accessibility" },
  { label: "Terms", href: "/terms" },
  { label: "Universities", href: "/universities" },
  { label: "About", href: "/about" },
  { label: "Updates", href: "/updates" },
  { label: "Contact", href: "/contact" },
  { label: "Status", href: "/status" },
] as const;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/unit/content.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/content/site.ts tests/unit/content.test.ts
git commit -m "Rebuild primary navigation around ecosystem anchors"
```

---

## Task 3: Add the LinkedIn company link to project facts and footer

**Files:**
- Modify: `src/content/project-facts.ts:38` (the `socialLinks` field)
- Modify: `src/components/footer.tsx`
- Modify: `tests/unit/content.test.ts`

**Interfaces:**
- Consumes: `projectFacts.socialLinks` (already typed as `{ label: string; href: string }[]`, currently empty).
- Produces: a populated `socialLinks` array; `Footer` renders each entry as a link.

- [ ] **Step 1: Write the failing test**

Add to `tests/unit/content.test.ts`:

```ts
  it("lists the LinkedIn company page under the Syllabus Sync display name", () => {
    const linkedIn = projectFacts.socialLinks.find((link) => link.href.includes("linkedin.com/company"));
    expect(linkedIn).toBeDefined();
    expect(linkedIn?.href).toBe("https://www.linkedin.com/company/syllabuss-sync/");
    expect(linkedIn?.label).toBe("Syllabus Sync on LinkedIn");
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/unit/content.test.ts`
Expected: FAIL — `socialLinks` is currently `[]`.

- [ ] **Step 3: Populate socialLinks and render it in the footer**

In `src/content/project-facts.ts`, replace line 38:

```ts
  socialLinks: [] as { label: string; href: string }[],
```

with:

```ts
  socialLinks: [
    { label: "Syllabus Sync on LinkedIn", href: "https://www.linkedin.com/company/syllabuss-sync/" },
  ] as { label: string; href: string }[],
```

In `src/components/footer.tsx`, add the render after the existing `<nav aria-label="Footer">...</nav>` block (after line 21, before the closing `</div>` at line 22):

```tsx
        <nav aria-label="Elsewhere">
          {projectFacts.socialLinks.map((link) => (
            <a href={link.href} key={link.href} rel="noreferrer" target="_blank">
              {link.label}
            </a>
          ))}
        </nav>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/unit/content.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/content/project-facts.ts src/components/footer.tsx tests/unit/content.test.ts
git commit -m "Add LinkedIn company link to footer"
```

---

## Task 4: Copy and place product screenshots and team photos

**Files:**
- Create: `public/products/platform-dashboard.png`
- Create: `public/products/platform-calendar.png`
- Create: `public/products/platform-campus-map.png`
- Create: `public/products/mq-navigation-map.png`
- Create: `public/products/mq-navigation-gallery/{01-login,02-home,03-map,04-safety,05-favorites,06-notifications,07-settings}.png`
- Create: `public/team/pouya.jpg`
- Create: `public/team/raouf.jpg`

**Interfaces:**
- Consumes: nothing (asset-only task).
- Produces: the exact file paths referenced by `src/content/project-facts.ts`'s `screenshot.src` fields (Task 1) and `team[].photo` fields — Task 6 and Task 9 components render these via `next/image`.

This task has no unit test (it is a build-verifiable asset copy) — verification is that `npm run build` (Task 11) succeeds with no missing-image errors, and a manual visual check in the browser (Task 11).

- [ ] **Step 1: Create destination directories**

```bash
mkdir -p public/products/mq-navigation-gallery public/team
```

- [ ] **Step 2: Copy and resize the Syllabus Sync platform screenshots (source untouched)**

```bash
sips -Z 1600 --setProperty formatOptions 75 "/Users/pouya/Documents/Projects/Syllabus-Sync/docs/images/Dashboard.png" --out public/products/platform-dashboard.png
sips -Z 1600 --setProperty formatOptions 75 "/Users/pouya/Documents/Projects/Syllabus-Sync/docs/images/Calendar.png" --out public/products/platform-calendar.png
sips -Z 1600 --setProperty formatOptions 75 "/Users/pouya/Documents/Projects/Syllabus-Sync/docs/images/Campus map.png" --out public/products/platform-campus-map.png
```

- [ ] **Step 3: Copy and resize the MQ Navigation screenshots (source untouched)**

```bash
sips -Z 1200 --setProperty formatOptions 75 "/Users/pouya/Documents/Projects/MQ_Navigation/screenshots/03_map_page.png" --out public/products/mq-navigation-map.png
for f in 01_login_page 02_home_page 03_map_page 04_safety_page 05_favorites_page 06_notifications_page 07_settings_page; do
  dest=$(echo "$f" | sed -E 's/^0([0-9])_/\1-/; s/_page$//')
  sips -Z 1200 --setProperty formatOptions 75 "/Users/pouya/Documents/Projects/MQ_Navigation/screenshots/${f}.png" --out "public/products/mq-navigation-gallery/${dest}.png"
done
```

- [ ] **Step 4: Copy and resize the team photos (source untouched)**

```bash
sips -Z 480 --setProperty formatOptions 80 "/Users/pouya/Documents/Projects/Syllabus-Sync/public/images/team/pouya.jpg" --out public/team/pouya.jpg
sips -Z 480 --setProperty formatOptions 80 "/Users/pouya/Documents/Projects/Syllabus-Sync/public/images/team/raouf.jpg" --out public/team/raouf.jpg
```

- [ ] **Step 5: Verify the files exist at the expected paths**

Run: `ls -la public/products public/products/mq-navigation-gallery public/team`
Expected: all files from Steps 2-4 listed, non-zero size.

- [ ] **Step 6: Commit**

```bash
git add public/products public/team
git commit -m "Add optimized product screenshots and team photos"
```

---

## Task 5: Add shared section CSS for the new homepage sections

**Files:**
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: existing custom properties (`--canvas`, `--surface`, `--ink`, `--muted`, `--blue`, `--red`, `--teal`, `--gold`, `--line`, `--radius`, `--radius-lg`, `--shadow`, `--container`).
- Produces: CSS classes consumed by every new component in Tasks 6-9: `.ecosystem-section`, `.ecosystem-grid`, `.ecosystem-card`, `.status-pill`, `.status-pill-*`, `.connections-section`, `.connections-grid`, `.macquarie-section`, `.incubator-section`, `.incubator-badge`, `.roadmap-section`, `.roadmap-timeline`, `.roadmap-phase`, `.team-section`, `.team-grid`, `.team-card`.

No isolated unit test applies to CSS; this task is verified visually in Task 11 and structurally by the Playwright tests added in Tasks 6-9 (which assert on rendered headings/roles, not styling).

- [ ] **Step 1: Append the new section styles**

Add to the end of `src/app/globals.css`:

```css
/* Ecosystem, connections, roadmap, team sections */
.section-label { color: var(--blue); font-family: var(--font-geist-mono), monospace; font-size: .78rem; font-weight: 620; letter-spacing: .08em; text-transform: uppercase; }

.status-pill { border-radius: 999px; display: inline-flex; font-family: var(--font-geist-mono), monospace; font-size: .74rem; font-weight: 620; letter-spacing: .02em; padding: .3rem .7rem; }
.status-pill-available, .status-pill-early-access { background: var(--soft-blue); color: var(--blue-dark); }
.status-pill-prototype, .status-pill-in-development { background: #fff4e0; color: #8a5a06; }
.status-pill-planned { background: #f1f1ee; color: var(--muted); }

.ecosystem-section { padding: clamp(3.5rem, 5vw, 5rem) 0; }
.ecosystem-grid { display: grid; gap: 1.75rem; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); margin-top: 2.5rem; }
.ecosystem-card { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius-lg); box-shadow: var(--shadow); display: flex; flex-direction: column; gap: 1rem; padding: 1.75rem; scroll-margin-top: 100px; }
.ecosystem-card-media { border-radius: var(--radius); overflow: hidden; }
.ecosystem-card-media img { display: block; height: auto; width: 100%; }
.ecosystem-card h3 { font-size: 1.4rem; }
.ecosystem-card .tagline { color: var(--muted); font-size: .95rem; font-weight: 560; }
.ecosystem-feature-list { display: grid; gap: .5rem; }
.ecosystem-feature { align-items: baseline; display: flex; gap: .6rem; justify-content: space-between; }
.ecosystem-feature-name { font-weight: 560; }

.connections-section { background: var(--surface); border-block: 1px solid var(--line); padding: clamp(3.5rem, 5vw, 5rem) 0; }
.connections-grid { display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); margin-top: 2rem; }
.connections-grid article { border-left: 3px solid var(--blue); padding-left: 1.1rem; }
.connections-grid article:nth-child(2) { border-left-color: var(--teal); }
.connections-grid article:nth-child(3) { border-left-color: var(--gold); }

.macquarie-section { padding: clamp(3rem, 4.5vw, 4.5rem) 0; }
.macquarie-section .independence-note { color: var(--muted); font-size: .92rem; margin-top: 1.2rem; }

.incubator-section { background: var(--ink); border-radius: var(--radius-lg); color: white; margin-inline: auto; max-width: var(--container); padding: clamp(2.5rem, 4vw, 3.5rem); }
.incubator-section h2, .incubator-section p { color: white; }
.incubator-badge { background: var(--gold); border-radius: 999px; color: var(--ink); display: inline-block; font-weight: 700; margin-bottom: 1rem; padding: .35rem .9rem; }
.incubator-section .independence-note { color: #c9d2e2; font-size: .88rem; margin-top: 1.2rem; }

.roadmap-section { padding: clamp(3.5rem, 5vw, 5rem) 0; }
.roadmap-timeline { display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); margin-top: 2.5rem; }
.roadmap-phase { border-top: 3px solid var(--blue); padding-top: 1.1rem; }
.roadmap-phase:nth-child(2) { border-top-color: var(--teal); }
.roadmap-phase:nth-child(3) { border-top-color: var(--gold); }
.roadmap-phase .phase-label { color: var(--muted); font-family: var(--font-geist-mono), monospace; font-size: .8rem; }
.roadmap-phase ul { color: var(--muted); margin-top: .75rem; padding-left: 1.1rem; }

.team-section { padding: clamp(3.5rem, 5vw, 5rem) 0; }
.team-grid { display: grid; gap: 1.75rem; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); margin-top: 2.5rem; }
.team-card { align-items: flex-start; display: flex; gap: 1.1rem; }
.team-photo { border-radius: 50%; flex: none; height: 72px; overflow: hidden; width: 72px; }
.team-photo img { height: 100%; object-fit: cover; width: 100%; }
.team-card .role { color: var(--muted); font-size: .9rem; font-weight: 560; }
.team-links { display: flex; gap: .8rem; margin-top: .5rem; }
```

- [ ] **Step 2: Verify the stylesheet still parses**

Run: `npm run build`
Expected: build succeeds (Next.js will fail the build on invalid CSS syntax reaching the bundler). If this fails only on missing images referenced by not-yet-written components, that's expected until Task 6-9 land — for this task, verify with: `npx stylelint src/app/globals.css --allow-empty-input 2>/dev/null || true; node -e "require('fs').readFileSync('src/app/globals.css','utf8')"` to confirm the file is syntactically readable, then defer the full build check to Task 11.

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "Add CSS for ecosystem, connections, roadmap and team sections"
```

---

## Task 6: Build the Ecosystem section component

**Files:**
- Create: `src/components/ecosystem-section.tsx`
- Modify: `tests/e2e/site.spec.ts`

**Interfaces:**
- Consumes: `approvedEcosystem` from `src/content/project-facts.ts` (Task 1); CSS classes from Task 5.
- Produces: `EcosystemSection` component (default export not required — named export `EcosystemSection`), rendering `<section id="ecosystem">` containing three `<article id={product.id}>` cards. Consumed by `page.tsx` in Task 10.

- [ ] **Step 1: Write the failing e2e test**

Add to `tests/e2e/site.spec.ts`:

```ts
test("ecosystem section exposes all three products with distinct anchors", async ({ page }) => {
  await page.goto("/#ecosystem");
  await expect(page.locator("#platform")).toContainText("Syllabus Sync Platform");
  await expect(page.locator("#platform")).toContainText("Web platform available in early access");
  await expect(page.locator("#sylla")).toContainText("AI chat available in early access");
  await expect(page.locator("#sylla")).toContainText("Flashcards");
  await expect(page.locator("#mq-navigation")).toContainText("Mobile prototype, not yet published");
  await expect(page.locator("#mq-navigation")).toContainText("Public OS-level linking and the complete production handoff are not yet released");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx playwright test -g "ecosystem section exposes all three products"`
Expected: FAIL — `#platform`/`#sylla`/`#mq-navigation` don't exist on the page yet.

- [ ] **Step 3: Implement the component**

Create `src/components/ecosystem-section.tsx`:

```tsx
import Image from "next/image";

import { approvedEcosystem, type FeatureStatus } from "@/content/project-facts";

const statusLabels: Record<FeatureStatus, string> = {
  available: "Available",
  "early-access": "Early access",
  prototype: "Prototype",
  "in-development": "In development",
  planned: "Planned",
};

export function EcosystemSection() {
  return (
    <section className="ecosystem-section" id="ecosystem">
      <div className="container">
        <div className="section-heading centered">
          <p className="section-label">The ecosystem</p>
          <h2>One ecosystem, three connected products.</h2>
          <p>
            Syllabus Sync is the main platform and student workspace. Sylla is the AI-assisted study
            companion. MQ Navigation is the campus navigation companion. Each is a distinct product,
            built to work together.
          </p>
        </div>
        <div className="ecosystem-grid">
          {approvedEcosystem.map((product) => (
            <article className="ecosystem-card" id={product.id} key={product.id}>
              {product.screenshot && (
                <div className="ecosystem-card-media">
                  <Image
                    alt={product.screenshot.alt}
                    height={360}
                    src={product.screenshot.src}
                    width={640}
                  />
                </div>
              )}
              <div>
                <h3>{product.name}</h3>
                <p className="tagline">{product.tagline}</p>
              </div>
              <p>{product.description}</p>
              <span className="status-pill status-pill-early-access">{product.statusLabel}</span>
              <div className="ecosystem-feature-list">
                {product.features.map((feature) => (
                  <div className="ecosystem-feature" key={feature.name}>
                    <span className="ecosystem-feature-name">{feature.name}</span>
                    <span className={`status-pill status-pill-${feature.status}`}>
                      {statusLabels[feature.status]}
                    </span>
                  </div>
                ))}
              </div>
              <a
                className="button button-secondary"
                href={product.link.href}
                rel={product.link.external ? "noreferrer" : undefined}
                target={product.link.external ? "_blank" : undefined}
              >
                {product.link.label}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Wire it in temporarily to run the test**

The e2e test needs the component mounted on the homepage to pass. Add a temporary import/render in `src/app/page.tsx` now (this becomes permanent in Task 10, which will move it to its final position in the section order — no rework, just earlier placement):

Add near the top of `src/app/page.tsx`: `import { EcosystemSection } from "@/components/ecosystem-section";`
Add `<EcosystemSection />` immediately after the `</section>` that closes `problem-section` (after line 69).

- [ ] **Step 5: Run test to verify it passes**

Run: `npx playwright test -g "ecosystem section exposes all three products"`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/ecosystem-section.tsx src/app/page.tsx tests/e2e/site.spec.ts
git commit -m "Add ecosystem section with per-product anchors and feature statuses"
```

---

## Task 7: Build the Connections section component

**Files:**
- Create: `src/components/connections-section.tsx`
- Modify: `tests/e2e/site.spec.ts`

**Interfaces:**
- Consumes: nothing from `project-facts.ts` (this section is positioning/explanatory copy about the relationship between products, not a factual claim needing governance — consistent with the spec's Section 3 treatment of the Problem section).
- Produces: `ConnectionsSection` component rendering `<section id="connections">`. Consumed by `page.tsx` in Task 10.

- [ ] **Step 1: Write the failing e2e test**

Add to `tests/e2e/site.spec.ts`:

```ts
test("connections section explains the ecosystem without exposing backend details", async ({ page }) => {
  await page.goto("/#connections");
  const section = page.locator("#connections");
  await expect(section.getByRole("heading", { level: 2 })).toContainText("connect");
  await expect(section).toContainText("academic context");
  await expect(section).toContainText("AI-powered study layer");
  await expect(section).toContainText("campus wayfinding");
  await expect(section).not.toContainText("Supabase");
  await expect(section).not.toContainText("cookie");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx playwright test -g "connections section explains the ecosystem"`
Expected: FAIL — `#connections` doesn't exist yet.

- [ ] **Step 3: Implement the component**

Create `src/components/connections-section.tsx`:

```tsx
export function ConnectionsSection() {
  return (
    <section className="connections-section" id="connections">
      <div className="container">
        <div className="section-heading centered">
          <p className="section-label">How they connect</p>
          <h2>Built to connect, not to compete for attention.</h2>
          <p>
            The goal is not three disconnected apps. It is one student ecosystem where context can
            move between specialised experiences — starting with a shared identity today, with
            deeper integration in development.
          </p>
        </div>
        <div className="connections-grid">
          <article>
            <h3>Syllabus Sync</h3>
            <p>Academic context: units, assessments, deadlines and the student workspace.</p>
          </article>
          <article>
            <h3>Sylla</h3>
            <p>The AI-powered study layer: summaries, explanations, flashcards, quizzes and planning support.</p>
          </article>
          <article>
            <h3>MQ Navigation</h3>
            <p>Campus wayfinding: destination handoff, maps and mobile navigation.</p>
          </article>
        </div>
        <p className="problem-close">
          Today, each product is independently usable under one shared brand. Deeper integration —
          like an embedded Sylla panel inside Syllabus Sync, and a full destination handoff to MQ
          Navigation — is in development.
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Wire it in temporarily and run the test**

Add `import { ConnectionsSection } from "@/components/connections-section";` to `src/app/page.tsx` and render `<ConnectionsSection />` immediately after `<EcosystemSection />` (from Task 6).

- [ ] **Step 5: Run test to verify it passes**

Run: `npx playwright test -g "connections section explains the ecosystem"`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/connections-section.tsx src/app/page.tsx tests/e2e/site.spec.ts
git commit -m "Add connections section explaining the ecosystem without implementation detail"
```

---

## Task 8: Build the Macquarie and Incubator section components

**Files:**
- Create: `src/components/macquarie-section.tsx`
- Create: `src/components/incubator-section.tsx`
- Modify: `tests/e2e/site.spec.ts`

**Interfaces:**
- Consumes: `projectFacts.independenceStatement`, `projectFacts.incubator` from Task 1.
- Produces: `MacquarieSection` (`<section id="macquarie">`) and `IncubatorSection` (`<section id="incubator">`). Consumed by `page.tsx` in Task 10.

- [ ] **Step 1: Write the failing e2e test**

Add to `tests/e2e/site.spec.ts`:

```ts
test("Macquarie and incubator sections use the exact approved wording", async ({ page }) => {
  await page.goto("/#macquarie");
  await expect(page.locator("#macquarie")).toContainText("not an official university service");

  await page.goto("/#incubator");
  const incubator = page.locator("#incubator");
  await expect(incubator).toContainText("Selected for the Macquarie University Incubator in May 2026.");
  await expect(incubator).toContainText("mentoring, customer discovery and founder development");
  await expect(incubator).toContainText("not an official university service");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx playwright test -g "Macquarie and incubator sections use the exact approved wording"`
Expected: FAIL — sections don't exist yet.

- [ ] **Step 3: Implement the components**

Create `src/components/macquarie-section.tsx`:

```tsx
import { projectFacts } from "@/content/project-facts";

export function MacquarieSection() {
  return (
    <section className="macquarie-section" id="macquarie">
      <div className="container">
        <div className="section-heading centered">
          <p className="section-label">Starting with Macquarie</p>
          <h2>We are starting where we know the student experience firsthand.</h2>
          <p>
            Macquarie University is our first implementation and validation environment. Building
            here first means unit information, campus context and student workflows can be tested
            against real student needs before expanding elsewhere.
          </p>
          <p className="independence-note">{projectFacts.independenceStatement}</p>
        </div>
      </div>
    </section>
  );
}
```

Create `src/components/incubator-section.tsx`:

```tsx
import { projectFacts } from "@/content/project-facts";

export function IncubatorSection() {
  return (
    <section id="incubator">
      <div className="container">
        <div className="incubator-section">
          <span className="incubator-badge">Macquarie University Incubator</span>
          <h2>{projectFacts.incubator.headline}</h2>
          <p>{projectFacts.incubator.detail}</p>
          <p className="independence-note">{projectFacts.independenceStatement}</p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Wire in temporarily and run the test**

Add both imports to `src/app/page.tsx` and render `<MacquarieSection />` then `<IncubatorSection />` immediately after `<ConnectionsSection />` (from Task 7).

- [ ] **Step 5: Run test to verify it passes**

Run: `npx playwright test -g "Macquarie and incubator sections use the exact approved wording"`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/macquarie-section.tsx src/components/incubator-section.tsx src/app/page.tsx tests/e2e/site.spec.ts
git commit -m "Add Macquarie and incubator sections with exact approved wording"
```

---

## Task 9: Build the Roadmap and Team section components

**Files:**
- Create: `src/components/roadmap-section.tsx`
- Create: `src/components/team-section.tsx`
- Modify: `tests/e2e/site.spec.ts`

**Interfaces:**
- Consumes: `approvedRoadmapPhases`, `approvedTeam` from Task 1; screenshot/photo paths from Task 4.
- Produces: `RoadmapSection` (`<section id="vision">`) and `TeamSection` (`<section id="team">`). Consumed by `page.tsx` in Task 10.

- [ ] **Step 1: Write the failing e2e test**

Add to `tests/e2e/site.spec.ts`:

```ts
test("roadmap section presents three future-facing phases without naming a Sydney university", async ({ page }) => {
  await page.goto("/#vision");
  const section = page.locator("#vision");
  await expect(section).toContainText("Macquarie University");
  await expect(section).toContainText("Expansion to other Sydney universities");
  await expect(section).toContainText("Australia-wide expansion");
  await expect(section).not.toContainText("UNSW");
  await expect(section).not.toContainText("University of Sydney");
});

test("team section credits both founders with neutral titles", async ({ page }) => {
  await page.goto("/#team");
  const section = page.locator("#team");
  await expect(section).toContainText("Co-founder, Software Engineering & Product");
  await expect(section).toContainText("Co-founder, Backend & Platform Engineering");
  await expect(section.getByRole("link", { name: /LinkedIn/ })).toHaveCount(2);
  await expect(section.getByRole("link", { name: /GitHub/ })).toHaveCount(2);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx playwright test -g "roadmap section presents three future-facing phases|team section credits both founders"`
Expected: FAIL — `#vision`/`#team` don't exist yet.

- [ ] **Step 3: Implement the components**

Create `src/components/roadmap-section.tsx`:

```tsx
import { approvedRoadmapPhases } from "@/content/project-facts";

export function RoadmapSection() {
  return (
    <section className="roadmap-section" id="vision">
      <div className="container">
        <div className="section-heading centered">
          <p className="section-label">Vision</p>
          <h2>A realistic path from Macquarie to Australia.</h2>
          <p>Every phase below is a future direction, not a commitment or a confirmed rollout.</p>
        </div>
        <div className="roadmap-timeline">
          {approvedRoadmapPhases.map((phase) => (
            <article className="roadmap-phase" key={phase.phase}>
              <span className="phase-label">{phase.phase}</span>
              <h3>{phase.title}</h3>
              <p>{phase.description}</p>
              <ul>
                {phase.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

Create `src/components/team-section.tsx`:

```tsx
import Image from "next/image";

import { approvedTeam } from "@/content/project-facts";

export function TeamSection() {
  return (
    <section className="team-section" id="team">
      <div className="container">
        <div className="section-heading centered">
          <p className="section-label">Team</p>
          <h2>Built by two founders, collaboratively.</h2>
          <p>Syllabus Sync, Sylla and MQ Navigation are built together, with each founder leading different parts of the ecosystem.</p>
        </div>
        <div className="team-grid">
          {approvedTeam.map((member) => (
            <article className="team-card" key={member.name}>
              <div className="team-photo">
                <Image alt={member.name} height={72} src={member.photo} width={72} />
              </div>
              <div>
                <h3>{member.name}</h3>
                <p className="role">{member.role}</p>
                <p>{member.bio}</p>
                <div className="team-links">
                  <a href={member.linkedIn} rel="noreferrer" target="_blank">LinkedIn</a>
                  <a href={member.gitHub} rel="noreferrer" target="_blank">GitHub</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Wire in temporarily and run the test**

Add both imports to `src/app/page.tsx` and render `<RoadmapSection />` then `<TeamSection />` immediately after `<IncubatorSection />` (from Task 8).

- [ ] **Step 5: Run test to verify it passes**

Run: `npx playwright test -g "roadmap section presents three future-facing phases|team section credits both founders"`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/roadmap-section.tsx src/components/team-section.tsx src/app/page.tsx tests/e2e/site.spec.ts
git commit -m "Add roadmap and team sections"
```

---

## Task 10: Finalize the hero, trust section, contact CTA, and full section order in page.tsx

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `tests/e2e/site.spec.ts:3-11` (existing homepage test needs its hero/heading/domain assertions updated)

**Interfaces:**
- Consumes: every component from Tasks 6-9; `projectFacts.mainApplicationUrl` (Task 1, now `https://www.syllabus-sync.app`).
- Produces: final `src/app/page.tsx` with the approved 9-part section order (hero, problem, ecosystem, connections, macquarie, incubator, vision, team, trust) plus the final contact CTA — removing the now-superseded `pillars-section`, `walkthrough-section`, and `universities-home` sections (their content is superseded by the Ecosystem, Connections and Roadmap sections), and folding the FAQ into a new short block placed after the Team section (kept because it holds still-useful Q&A not covered elsewhere; if this placement is unwanted it's a one-line move in a follow-up, not a rewrite).

- [ ] **Step 1: Update the existing homepage e2e test for the new hero and domain**

In `tests/e2e/site.spec.ts`, replace the first test (lines 3-11):

```ts
test("homepage exposes the product story and safe links", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Syllabus Sync/);
  await expect(page.getByRole("heading", { level: 1, name: "One connected ecosystem for university life." })).toBeVisible();
  const appLinks = page.getByRole("main").getByRole("link", { name: "Open Syllabus Sync", exact: true });
  await expect(appLinks.first()).toHaveAttribute("href", "https://www.syllabus-sync.app");
  await expect(page.getByRole("link", { name: "Open Sylla", exact: true }).first()).toHaveAttribute("href", "https://sylla.syllabus-sync.app");
  await expect(page.getByRole("heading", { level: 2, name: "Student technology should earn trust." })).toBeVisible();
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx playwright test -g "homepage exposes the product story and safe links"`
Expected: FAIL — current hero heading is still "Your semester, finally organised." and the app link still points to the old domain.

- [ ] **Step 3: Rewrite page.tsx**

Replace the full contents of `src/app/page.tsx`:

```tsx
import Link from "next/link";

import { ConnectionsSection } from "@/components/connections-section";
import { EcosystemSection } from "@/components/ecosystem-section";
import { Icon } from "@/components/icons";
import { IncubatorSection } from "@/components/incubator-section";
import { MacquarieSection } from "@/components/macquarie-section";
import { ProductDemo } from "@/components/product-demo";
import { RoadmapSection } from "@/components/roadmap-section";
import { TeamSection } from "@/components/team-section";
import { projectFacts } from "@/content/project-facts";
import { websiteJsonLd } from "@/lib/metadata";

const faqs = [
  ["What is Syllabus Sync?", "Syllabus Sync is an independent student experience ecosystem: an academic planning platform, an AI study assistant called Sylla, and a campus navigation companion called MQ Navigation."],
  ["Does it replace my university portal?", "No. It is designed as an organisational layer and does not replace official enrolment, learning, policy, assessment or emergency systems."],
  ["Which universities are supported?", "The current implementation is for Macquarie University. Expansion to other Sydney universities, and later across Australia, is a future direction — not a confirmed rollout."],
  ["Is Sylla a fully working AI assistant?", "Sylla's chat is available in early access. Its study tools — summaries, explanations, flashcards, quizzes and study planning — are working prototypes, not yet live AI features."],
  ["Can Syllabus Sync open MQ Navigation directly?", "A prototype destination-based deep-linking flow has been implemented between Syllabus Sync and MQ Navigation. Public OS-level linking and the complete production handoff are not yet released."],
  ["Is Syllabus Sync free?", "Current availability and any pricing are shown in the main application before you create an account."],
  ["Is the platform accessible?", "The information site targets WCAG 2.2 Level AA and includes keyboard, focus, reduced-motion, contrast and semantic support. It does not yet claim formal conformance."],
  ["Can universities work with Syllabus Sync?", "Yes, institutions can explore a pilot or collaboration conversation without any implication of an existing partnership or endorsement."],
] as const;

export default function Home() {
  return (
    <main id="main-content">
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c") }} type="application/ld+json" />
      <section className="hero" id="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <h1>One connected<br />ecosystem for university life.</h1>
            <p className="hero-lead">Syllabus Sync brings academic planning, AI-powered study support and campus navigation into one connected student ecosystem — starting at Macquarie University.</p>
            <p>Three distinct products, one shared direction: Syllabus Sync for planning, Sylla for study support, MQ Navigation for getting where you need to be.</p>
            <div className="button-row">
              <a className="button" href={projectFacts.mainApplicationUrl}>Explore Syllabus Sync <Icon name="arrow" /></a>
              <a className="button button-secondary" href="#ecosystem">Meet the ecosystem <Icon name="arrow" /></a>
            </div>
            <div className="button-row">
              <a className="text-link" href="https://sylla.syllabus-sync.app">Open Sylla <Icon name="arrow" size={17} /></a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="sync-paths" aria-hidden="true"><span /><span /><span /></div>
            <ProductDemo view="today" />
            <div className="phone-demo" aria-hidden="true"><ProductDemo compact view="today" /></div>
          </div>
        </div>
      </section>

      <section className="problem-section" id="problem">
        <div className="container">
          <div className="section-heading centered"><h2>University life is spread across too many places.</h2><p>Assessment dates live inside unit outlines. Classes sit in another timetable. Events arrive through email. Locations hide inside campus maps. Study help and campus navigation are separate systems entirely.</p></div>
          <div className="fragmentation">
            <div className="source-list">
              {["Unit outlines", "Learning system", "Calendar", "Email", "Campus map", "Study help"].map((item, index) => <span key={item}><i className={`source-dot source-${index}`} />{item}</span>)}
            </div>
            <div className="flow-lines" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
            <div className="fragment-demo"><ProductDemo view="overview" /></div>
          </div>
          <p className="problem-close">Syllabus Sync is the connected layer between these fragmented needs.</p>
        </div>
      </section>

      <EcosystemSection />
      <ConnectionsSection />
      <MacquarieSection />
      <IncubatorSection />
      <RoadmapSection />
      <TeamSection />

      <section className="trust-section" id="trust">
        <div className="container trust-inner">
          <span className="trust-mark"><Icon name="shield" size={28} /></span>
          <h2>Student technology should earn trust.</h2>
          <p>Syllabus Sync is designed around privacy, security and responsible data handling. We minimise unnecessary collection, protect public-site interactions and build clear controls around personal information.</p>
          <p>Accessibility and internationalisation are part of the platform foundation, not decorations added after launch. Sylla's AI features can be wrong or incomplete — treat its output as a study aid, not a source of truth.</p>
          <nav aria-label="Trust information">
            <Link href="/security"><Icon name="shield" size={18} /> Security</Link>
            <Link href="/privacy"><Icon name="lock" size={18} /> Privacy</Link>
            <Link href="/accessibility"><Icon name="compass" size={18} /> Accessibility</Link>
            <Link href="/security#responsible-disclosure"><Icon name="event" size={18} /> Responsible disclosure</Link>
          </nav>
        </div>
      </section>

      <section className="origin-faq" id="faq">
        <div className="container origin-faq-grid">
          <div className="origin-copy"><h2>Built from the<br />student experience.</h2><p>Syllabus Sync began with a simple problem: university life should not require a scavenger hunt through tabs, PDFs, portals, maps and screenshots.</p><strong>We are building a calmer, clearer way for students to navigate their academic day — and the ecosystem to support it.</strong><small>{projectFacts.independenceStatement}</small></div>
          <div className="faq"><h2>Questions, clearly answered.</h2>{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div>
        </div>
      </section>

      <section className="final-cta" id="contact-cta">
        <div className="cta-path cta-path-left" aria-hidden="true" /><div className="cta-path cta-path-right" aria-hidden="true" />
        <div className="container"><h2>Turn semester chaos into a clear plan.</h2><p>See what is happening, understand what matters and move through university life with confidence.</p><div className="button-row"><a className="button" href={projectFacts.mainApplicationUrl}>Open Syllabus Sync <Icon name="arrow" /></a><Link className="button button-on-dark" href="/contact">Contact the team <Icon name="arrow" /></Link></div></div>
      </section>
    </main>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx playwright test -g "homepage exposes the product story and safe links"`
Expected: PASS

- [ ] **Step 5: Update the header.tsx `Open Syllabus Sync` href source (no code change needed — it already reads `projectFacts.mainApplicationUrl`, which Task 1 already fixed) — verify by inspection**

Run: `grep -n "mainApplicationUrl" src/components/header.tsx`
Expected: two matches (desktop + mobile CTA), both already reading from `projectFacts`, so no edit required here.

- [ ] **Step 6: Commit**

```bash
git add src/app/page.tsx tests/e2e/site.spec.ts
git commit -m "Assemble the full ecosystem homepage narrative and update hero copy"
```

---

## Task 11: Final verification pass

**Files:** none created/modified — this task only runs commands and fixes anything they surface (fixes, if needed, land as amendments to the files touched in Tasks 1-10, not new files).

- [ ] **Step 1: Lint**

Run: `npm run lint`
Expected: no errors. If errors appear in files touched by this plan, fix them directly in those files and re-run.

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: no errors. Pay particular attention to the `EcosystemProduct`/`RoadmapPhase`/`TeamMember` `satisfies` clauses from Task 1 — a typo in a literal `status` value (e.g. `"protoype"`) will surface here as a type error against `FeatureStatus`.

- [ ] **Step 3: Unit tests**

Run: `npx vitest run`
Expected: all tests pass, including every test added in Tasks 1-3.

- [ ] **Step 4: Full build**

Run: `npm run build`
Expected: build succeeds; this is also where a missing image file from Task 4 would surface as a build-time error (Next.js validates `next/image` `src` paths exist under `public/` at build time only if statically analyzable — if it does not error, manually confirm via Step 6 below).

- [ ] **Step 5: Full e2e suite**

Run: `npx playwright install chromium firefox webkit && npm run test:e2e`
Expected: all tests pass, including every test added in Tasks 6-10.

- [ ] **Step 6: Manual browser verification**

Start the dev server (`npm run dev`), open `http://localhost:3000`, and manually check:
- Hero renders "One connected ecosystem for university life." with all three CTAs working (Explore Syllabus Sync → syllabus-sync.app, Meet the ecosystem → scrolls to #ecosystem, Open Sylla → sylla.syllabus-sync.app).
- All three ecosystem cards render their screenshots (Platform: dashboard/calendar/campus map; MQ Navigation: map) without broken-image icons; Sylla card renders without a screenshot and without a broken-image icon (no screenshot field was set for it in Task 1 — confirm no stray `<Image>` is attempted).
- Team photos render as circular avatars, not broken images.
- Clicking each primary-nav item (Platform, Sylla, MQ Navigation, Vision, About) scrolls to the correct anchor from both `/` and from a non-home page (e.g. visit `/security` first, then click "Platform" in the header, and confirm it navigates to `/#platform` and scrolls correctly).
- Resize to mobile width (375px) and confirm no horizontal overflow in the ecosystem grid, roadmap timeline, or team grid.
- Open browser devtools console and confirm no errors/warnings on page load.

- [ ] **Step 7: Commit any fixes found during verification**

If Steps 1-6 required any code changes, stage and commit them with a message describing what verification caught, e.g.:

```bash
git add -A
git commit -m "Fix issues found during final verification pass"
```

If no fixes were needed, skip this step (no empty commit).

---

## Explicit deviation from the approved spec, flagged for review

Task 10 keeps a trimmed FAQ block (`id="faq"`) after the Trust section, positioned before the final CTA. The approved spec's 10-item section list did not include a FAQ section. This plan keeps it because it holds still-useful, non-duplicative Q&A (e.g. "does it replace my portal," "is it free") that isn't fully covered elsewhere, and removing it outright would be a content loss beyond what the spec asked for. If this should instead be deleted or merged elsewhere, that's a small follow-up edit to `src/app/page.tsx`, not a rework of this plan.
