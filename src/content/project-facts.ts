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

export const projectFacts = {
  productName: "Syllabus Sync",
  shortDescription:
    "A clearer way to bring units, deadlines, calendar information, campus context and student events into one academic planning experience.",
  mainApplicationUrl: "https://syllabusing.app",
  informationSiteUrl: "https://info.syllabusing.app",
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
  socialLinks: [] as { label: string; href: string }[],
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
  lastReviewed: "2026-07-21",
} as const;

export const approvedProofPoints = projectFacts.proofPoints.filter(
  (proofPoint) => proofPoint.approved,
);

export const approvedFeatures = projectFacts.features.filter(
  (feature) => feature.approved,
);
