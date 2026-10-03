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
  id: "platform" | "sylla" | "campus-navigation" | "astronomy-open-night";
  relationship: "Syllabus Sync ecosystem" | "Separate team project";
  name: string;
  tagline: string;
  description: string;
  statusLabel: string;
  status: FeatureStatus;
  link?: { label: string; href: string; external: boolean };
  /**
   * Optional extra call-to-action buttons rendered on the card. When present,
   * these are shown instead of the single {@link link}. Used by Astronomy Open
   * Night, which launches a web app and links to its privacy policy and the
   * official event site — all public destinations.
   */
  actions?: { label: string; href: string; external: boolean }[];
  screenshot: { src: string; alt: string; width: number; height: number };
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
    "An independent student platform for academic planning, AI-assisted study through Sylla and a connected Campus Navigation companion.",
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
      relationship: "Syllabus Sync ecosystem",
      name: "Syllabus Sync Platform",
      tagline: "The main workspace and entry point into the ecosystem.",
      description:
        "The core web platform for academic planning, deadlines, the calendar, campus context and the rest of the student day, and the entry point into Sylla.",
      statusLabel: "Web platform available in early access",
      status: "early-access",
      link: { label: "Open Syllabus Sync", href: "https://www.syllabus-sync.app", external: true },
      screenshot: { src: "/products/platform-dashboard.png", alt: "Syllabus Sync dashboard showing a semester overview", width: 1569, height: 1600 },
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
      relationship: "Syllabus Sync ecosystem",
      name: "Sylla",
      tagline: "The AI-assisted study layer of the Syllabus Sync platform.",
      description:
        "Sylla has its own study interface within the Syllabus Sync ecosystem. Chat is in early access; the other study tools currently use a mock provider and are prototypes.",
      statusLabel: "AI chat available in early access",
      status: "early-access",
      link: { label: "Open Sylla", href: "https://sylla.syllabus-sync.app", external: true },
      screenshot: { src: "/products/sylla-study-home.png", alt: "Sylla study home with Ask Sylla and study-tool cards", width: 2406, height: 1604 },
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
      id: "campus-navigation",
      relationship: "Syllabus Sync ecosystem",
      name: "Campus Navigation",
      tagline: "A dedicated mobile wayfinding companion for the Syllabus Sync ecosystem.",
      description:
        "An independent iOS and Android app for finding campus places and navigating between them. Its app-side deep-link handoff is implemented; the Syllabus Sync-side handoff and public download links still need confirmation.",
      statusLabel: "Mobile release links coming soon",
      status: "in-development",
      screenshot: { src: "/products/campus-navigation-map.png", alt: "Campus Navigation mobile map showing campus buildings and search", width: 390, height: 844 },
      features: [
        { name: "Campus map and search", description: "Find buildings and services using the illustrated campus map or Google Maps view.", status: "available", source: "Campus Navigation README and screenshots, reviewed 2026-10-03", approved: true },
        { name: "Walking directions", description: "Get campus-specific routes between locations.", status: "available", source: "Campus Navigation README, reviewed 2026-10-03", approved: true },
        { name: "Indoor and 360° views", description: "Preview supported buildings and venues where imagery is available.", status: "available", source: "Campus Navigation README, reviewed 2026-10-03", approved: true },
        { name: "Syllabus Sync handoff", description: "The mobile app accepts destination deep links; the main platform's handoff remains a planned integration.", status: "planned", source: "Campus Navigation README deep-linking section, reviewed 2026-10-03", approved: true },
        { name: "Optional Open Day mode", description: "Opt-in visitor planning and location activities within the mobile app.", status: "available", source: "Campus Navigation README, reviewed 2026-10-03", approved: true },
      ],
      source: "Campus Navigation repository README, screenshots and deep-link contract, reviewed 2026-10-03; founder brief, 2026-10-03",
      approved: true,
    },
    {
      id: "astronomy-open-night",
      relationship: "Separate team project",
      name: "Astronomy Open Night 2026",
      tagline: "An event companion app by Leo Alavi and Mohammad Raouf Abedini for the Astronomy Night – FSE Outreach Team.",
      description:
        "A separate event guide and night-time wayfinding project: the published programme, an illustrated campus map, 360° venue previews and a QR passport rally. It has no account or developer-operated backend.",
      statusLabel: "Published event app",
      status: "available",
      // Kept for the type; the card renders the actions below instead.
      link: { label: "Ask about Astronomy Open Night", href: "/contact", external: false },
      screenshot: { src: "/products/astronomy-open-night-home.png", alt: "Astronomy Open Night app home showing the passport, campus map and venue links", width: 2878, height: 1604 },
      // The app and its privacy live on their own subdomain (hosting only), so
      // these open off-site. The official event site is Macquarie University's.
      actions: [
        { label: "Download on the App Store", href: aonAppStoreUrl, external: true },
        { label: "Get for Android (APK)", href: aonAndroidDownloadUrl, external: true },
        { label: "Open web app", href: aonWebAppUrl, external: true },
        { label: "Privacy Policy", href: aonPrivacyUrl, external: true },
        { label: "Official event website", href: aonEventSiteUrl, external: true },
      ],
      features: [
        { name: "Programme & what's on now", description: "Browse published activities and see what is happening at each venue.", status: "available", source: "Astronomy Open Night App Store listing, checked 2026-10-03", approved: true },
        { name: "Night-time wayfinding", description: "Use the illustrated campus map and written walking directions between venues.", status: "available", source: "Astronomy Open Night App Store listing, checked 2026-10-03", approved: true },
        { name: "360° venue previews", description: "Look inside supported venues before walking to them.", status: "available", source: "Astronomy Open Night App Store listing, checked 2026-10-03", approved: true },
        { name: "QR passport rally", description: "Scan or type a venue code to collect a stamp and an astronomy fact.", status: "available", source: "Astronomy Open Night App Store listing, checked 2026-10-03", approved: true },
        { name: "Local data, no account", description: "Saved stamps and favourites stay on the device; the app does not require sign-in.", status: "available", source: "Astronomy Open Night repo README and privacy audit, 2026-09-10", approved: true },
        { name: "English and Persian", description: "The app provides both languages with right-to-left support.", status: "available", source: "Astronomy Open Night repo README, 2026-09-09", approved: true },
      ],
      source: "Astronomy Open Night repo and live App Store listing, reviewed 2026-10-03; founder brief, 2026-10-03",
      approved: true,
    },
  ] satisfies EcosystemProduct[],
  roadmapPhases: [
    {
      phase: "Phase 1",
      title: "Macquarie University",
      description:
        "Validate the Syllabus Sync workspace, Sylla study experience and Campus Navigation companion at Macquarie, informed by student feedback and the Macquarie University Incubator.",
      items: [
        "Validate academic planning workflows",
        "Improve Sylla's study tools",
        "Validate the Campus Navigation handoff",
        "Gather student feedback",
        "Incubator-supported development",
      ],
      source: "Founder brief, 2026-10-03",
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
      name: "Leo Alavi",
      role: "Co-founder, Software Engineering & Product Development",
      bio: "Leads software engineering and product development across Syllabus Sync and Sylla, with full-stack and applied-AI implementation work. Co-developed Campus Navigation and Astronomy Open Night 2026; the latter is a separate event project.",
      linkedIn: "https://www.linkedin.com/in/leo-alavi/",
      gitHub: "https://github.com/leoalavi",
      photo: "/team/leo.jpg",
      source: "Founder brief, 2026-10-03; Campus Navigation README, reviewed 2026-10-03",
      approved: true,
    },
    {
      name: "Mohammad Raouf Abedini",
      role: "Co-founder, Backend & Platform Engineering",
      bio: "Leads backend, security and platform engineering across Syllabus Sync. Co-developed Campus Navigation and Astronomy Open Night 2026, including passport/QR and 360° panorama work on the separate event project.",
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
  lastReviewed: "2026-10-03",
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
import {
  aonAndroidDownloadUrl,
  aonAppStoreUrl,
  aonEventSiteUrl,
  aonPrivacyUrl,
  aonWebAppUrl,
} from "./astronomy-open-night-legal";
