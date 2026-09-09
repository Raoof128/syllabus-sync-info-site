export type ApprovalState = "approved" | "unverified";

export type ProofPoint = {
  label: string;
  value: string;
  source: string;
  approved: boolean;
};

export type ProductFeature = {
  name: string;
  description: string;
  status: "Product direction" | "Public site available";
  source: string;
  approved: boolean;
};

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
  id: "platform" | "sylla" | "astronomy-open-night";
  name: string;
  tagline: string;
  description: string;
  statusLabel: string;
  status: FeatureStatus;
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

export const projectFacts = {
  productName: "Syllabus Sync",
  shortDescription:
    "A clearer way to bring units, deadlines, calendar information, campus context and student events into one academic planning experience.",
  mainApplicationUrl: "https://www.syllabus-sync.app",
  informationSiteUrl: "https://info.syllabus-sync.app",
  supportContact: { label: "Contact Syllabus Sync", href: "/contact" },
  securityContact: {
    label: "Responsible disclosure",
    href: "/security#responsible-disclosure",
  },
  organisationalStatus: "Independent platform",
  institutionSupport: "Not publicly listed",
  pricing: "Not verified for public publication",
  privacySummary:
    "The information site is designed to minimise collection. The contact form validates submissions server-side and only delivers them when an approved transport is configured.",
  accessibilityStatus:
    "Designed and tested toward WCAG 2.2 Level AA; no formal conformance claim is made.",
  independenceStatement:
    "Syllabus Sync is an independent platform and is not an official university service.",
  socialLinks: [
    { label: "Syllabus Sync on LinkedIn", href: "https://www.linkedin.com/company/syllabuss-sync/" },
  ] as { label: string; href: string }[],
  proofPoints: [] as ProofPoint[],
  features: [
    {
      name: "Planning",
      description: "Bring academic commitments into one semester view.",
      status: "Product direction",
      source: "Agent-ready product brief, 21 July 2026",
      approved: true,
    },
    {
      name: "Calendar and deadlines",
      description: "Make upcoming classes, tasks and assessment dates easier to see.",
      status: "Product direction",
      source: "Agent-ready product brief, 21 July 2026",
      approved: true,
    },
    {
      name: "Campus context",
      description: "Connect commitments with useful place information.",
      status: "Product direction",
      source: "Agent-ready product brief, 21 July 2026",
      approved: true,
    },
    {
      name: "Events and updates",
      description: "Keep relevant student events and changes visible.",
      status: "Product direction",
      source: "Agent-ready product brief, 21 July 2026",
      approved: true,
    },
    {
      name: "Information website",
      description: "Public product, trust and institutional information.",
      status: "Public site available",
      source: "This repository",
      approved: true,
    },
  ] satisfies ProductFeature[],
  ecosystem: [
    {
      id: "platform",
      name: "Syllabus Sync Platform",
      tagline: "The main workspace and entry point into the ecosystem.",
      description:
        "The core web platform for academic planning, deadlines, the calendar, campus context and the rest of the student day, and the entry point into Sylla.",
      statusLabel: "Web platform available in early access",
      status: "early-access",
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
      status: "early-access",
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
      id: "astronomy-open-night",
      name: "Astronomy Open Night",
      tagline: "The offline-first companion app for open-night events.",
      description:
        "An event guide and night-time wayfinding app: the published programme, an illustrated campus map, 360° venue previews and a QR passport rally. Event data is compiled into the app, so it works with no account, no backend and no network.",
      statusLabel: "In testing ahead of the September 2026 event",
      status: "in-development",
      // The app is not publicly released and its repository is private, so the
      // card points at the contact page rather than a link a visitor cannot open.
      link: { label: "Ask about Astronomy Open Night", href: "/contact", external: false },
      features: [
        { name: "Programme & what's on now", description: "The published activities across the night's venues, filterable by start time and activity type, with a live happening-now view.", status: "in-development", source: "Astronomy Open Night repo README, 2026-09-09", approved: true },
        { name: "Night-time wayfinding", description: "An illustrated campus map with search, favourites, walking directions and a compass mode for moving between car parks and venues in the dark.", status: "in-development", source: "Astronomy Open Night repo README, 2026-09-09", approved: true },
        { name: "360° venue previews", description: "Look inside a venue before walking to it at night.", status: "in-development", source: "Astronomy Open Night repo README, 2026-09-09", approved: true },
        { name: "QR passport rally", description: "Scan or type a venue code to collect a stamp and reveal a short astronomy fact, with manual entry as an offline fallback.", status: "in-development", source: "Astronomy Open Night repo README, 2026-09-09", approved: true },
        { name: "Offline-first, no account", description: "No sign-in, no backend and no developer-operated analytics; saved stamps and favourites stay on the device.", status: "in-development", source: "Astronomy Open Night repo README and privacy audit, 2026-09-09", approved: true },
        { name: "English and Persian", description: "Both languages with full right-to-left support and large-text scaling.", status: "in-development", source: "Astronomy Open Night repo README, 2026-09-09", approved: true },
      ],
      source: "Astronomy Open Night repo (README, ARCHITECTURE, release audits), reviewed 2026-09-09",
      approved: true,
    },
  ] satisfies EcosystemProduct[],
  roadmapPhases: [
    {
      phase: "Phase 1",
      title: "Macquarie University",
      description:
        "Complete and validate the initial ecosystem at Macquarie: strengthen academic planning, improve Sylla, and ship Astronomy Open Night for its September 2026 event, informed by direct student feedback and the Macquarie University Incubator.",
      items: [
        "Validate academic planning workflows",
        "Improve Sylla's study tools",
        "Ship Astronomy Open Night for its September 2026 event",
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
      bio: "Leads software engineering and product direction across Syllabus Sync and Sylla, and is lead developer on Astronomy Open Night, with full-stack and applied-AI implementation work.",
      linkedIn: "https://www.linkedin.com/in/pouya-alavi/",
      gitHub: "https://github.com/mrpouyaalavi",
      photo: "/team/pouya.jpg",
      source: "Founder-provided, 2026-07-22",
      approved: true,
    },
    {
      name: "Mohammad Raouf Abedini",
      role: "Co-founder, Backend & Platform Engineering",
      bio: "Leads backend, security and platform engineering across Syllabus Sync, and co-develops Astronomy Open Night, working on the passport/QR and 360° panorama subsystems.",
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
  lastReviewed: "2026-07-21",
} as const;

export const approvedProofPoints = projectFacts.proofPoints.filter(
  (proofPoint) => proofPoint.approved,
);

export const approvedFeatures = projectFacts.features.filter(
  (feature) => feature.approved,
);

export const approvedEcosystem = projectFacts.ecosystem.filter((product) => product.approved);

export const approvedRoadmapPhases = projectFacts.roadmapPhases.filter((phase) => phase.approved);

export const approvedTeam = projectFacts.team.filter((member) => member.approved);
