import type { Metadata } from "next";

import { projectFacts } from "./project-facts";

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

export type ContentSection = {
  heading: string;
  body: string[];
  items?: string[];
  anchor?: string;
};

export type PageDefinition = {
  title: string;
  description: string;
  intro: string;
  sections: ContentSection[];
};

export const updates = [
  {
    date: "2026-07-21",
    title: "Building a clearer home for Syllabus Sync",
    category: "Project update",
    summary:
      "Work began on a dedicated public information site for product guidance, trust information, accessibility, institutional enquiries and release notes.",
  },
] as const;

export const pages = {
  product: {
    title: "One place for the academic day",
    description: "See how Syllabus Sync is designed to organise the semester.",
    intro:
      "Syllabus Sync turns scattered academic information into a clearer path from semester overview to the next useful action.",
    sections: [
      {
        heading: "From information to a clear plan",
        body: [
          "Add or connect academic information, review the organised semester, see today's priorities, connect commitments with campus context, stay updated and keep control of personal data.",
          "The interface scenes shown here use fictional course information and contain no personal student data.",
        ],
        items: [
          "Review the semester",
          "See what comes next",
          "Understand deadlines",
          "Connect plans with places",
          "Keep events in view",
          "Control personal information",
        ],
      },
      {
        heading: "Product direction, stated honestly",
        body: [
          "The information site explains the intended product experience. Availability can change, so the main application remains the source of truth for the features currently accessible to an account.",
        ],
      },
    ],
  },
  features: {
    title: "Features organised around student outcomes",
    description: "Planning, calendar, deadlines, campus context and events.",
    intro:
      "The product direction centres on reducing the effort required to understand what is happening, what matters and where a student needs to be.",
    sections: [
      {
        heading: "Planning and calendar",
        body: [
          "Bring units, assignments, exams, events and personal commitments into a coherent semester view.",
        ],
        items: ["Semester planning", "Today view", "Weekly calendar"],
      },
      {
        heading: "Deadlines and campus context",
        body: [
          "Keep upcoming work visible and connect academic activities with useful place information.",
        ],
        items: ["Upcoming deadlines", "Workload visibility", "Campus locations"],
      },
      {
        heading: "Events, accessibility and language",
        body: [
          "Accessible interaction and multilingual foundations are design requirements. A formal accessibility conformance claim will only follow documented evaluation.",
        ],
        items: ["Student events", "Keyboard-first interaction", "Internationalisation foundations"],
      },
    ],
  },
  security: {
    title: "Security that earns trust",
    description: "Syllabus Sync security principles and disclosure guidance.",
    intro:
      "Security statements should be useful and verifiable. This page explains the controls implemented by this public information site and avoids claims about the main application that have not been independently confirmed here.",
    sections: [
      {
        heading: "Public-site protections",
        body: [
          "The site uses server-rendered content, strict input validation, bounded request bodies, rate limiting, a honeypot and timing signal for the contact endpoint, and restrictive browser security headers.",
          "No secret is included in the client bundle, and no contact message is logged by the application.",
        ],
        items: [
          "HTTPS required in production",
          "Content Security Policy",
          "Clickjacking protection",
          "Server-side validation",
          "Dependency review",
        ],
      },
      {
        heading: "Responsible disclosure",
        anchor: "responsible-disclosure",
        body: [
          "If you believe you have found a vulnerability, use the contact page and select the security guidance link. Please include clear reproduction steps and avoid accessing data that does not belong to you.",
          "There is currently no public bug-bounty programme or payment promise.",
        ],
      },
      {
        heading: "Main application boundary",
        body: [
          "Authentication, authorisation, encryption, retention and account-deletion controls for the main application require a separate product security review before detailed public claims are added.",
        ],
      },
    ],
  },
  privacy: {
    title: "Privacy in plain English",
    description: "How the Syllabus Sync information site handles information.",
    intro:
      "This public site is designed to work without advertising trackers, session replay or fingerprinting.",
    sections: [
      {
        heading: "What this site collects",
        body: [
          "Normal hosting infrastructure may process technical request data needed to serve and protect the site. The contact form only processes the details you choose to enter.",
          "The repository does not enable analytics by default and does not set an analytics cookie.",
        ],
      },
      {
        heading: "Contact enquiries",
        body: [
          "Contact details are validated on the server. Delivery remains disabled until an approved transport and retention process are configured. Messages are not written to an application database or log by this implementation.",
        ],
      },
      {
        heading: "Product privacy",
        body: [
          "A complete legal policy for the main application must be approved against its real data flows, processors, retention periods and deletion controls. This page does not replace that review.",
        ],
      },
      {
        heading: "Revision date",
        body: ["Last reviewed 21 July 2026."],
      },
    ],
  },
  accessibility: {
    title: "Designed toward WCAG 2.2 Level AA",
    description: "Accessibility approach and current evaluation status.",
    intro:
      "Accessibility is part of the product foundation. This site targets WCAG 2.2 Level AA, but does not claim formal conformance before a documented evaluation is complete.",
    sections: [
      {
        heading: "What is built in",
        body: [
          "The interface uses semantic landmarks, a skip link, logical headings, visible focus, keyboard-operable navigation and accordions, labelled forms, reduced-motion support and responsive reflow.",
        ],
        items: [
          "Keyboard navigation",
          "Visible, unobscured focus",
          "Reduced motion",
          "Colour contrast",
          "Touch-sized controls",
          "Screen-reader semantics",
          "Accessible form errors",
        ],
      },
      {
        heading: "Feedback",
        body: [
          "If something prevents you from using this site, use the contact page and choose Accessibility. Describe the page, task, browser and assistive technology if you are comfortable doing so.",
        ],
      },
    ],
  },
  universities: {
    title: "A clearer student experience",
    description: "Syllabus Sync product direction for institutional stakeholders.",
    intro:
      "Syllabus Sync explores how students can understand academic commitments without creating another disconnected portal.",
    sections: [
      {
        heading: "A student-centred role",
        body: [
          "The platform is designed as a calm organisational layer around the academic day. Potential work with institutions would begin with student needs, accessibility, privacy and clear branding boundaries.",
        ],
        items: [
          "Clearer commitment visibility",
          "Accessible onboarding",
          "Multilingual foundations",
          "Privacy-conscious delivery",
        ],
      },
      {
        heading: "Pilot and integration principles",
        body: [
          "No institution is presented as a customer or partner. Any pilot would require a defined problem, minimal data scope, documented responsibilities, accessibility evaluation and an approved technical review.",
        ],
      },
      {
        heading: "Independent by design",
        body: [projectFacts.independenceStatement],
      },
    ],
  },
  about: {
    title: "Built from the student experience",
    description: "The mission and principles behind Syllabus Sync.",
    intro:
      "University life should not require a scavenger hunt through tabs, PDFs, portals, maps and screenshots.",
    sections: [
      {
        heading: "Our mission",
        body: [
          "We are building a calmer, clearer way for students to navigate their academic day.",
          "The goal is practical: reduce searching, make commitments easier to understand and keep students in control of their information.",
        ],
      },
      {
        heading: "Product principles",
        body: [
          "Clarity before novelty. Evidence before claims. Accessibility and privacy from the start. Deliberate independence from institutional branding.",
        ],
      },
      {
        heading: "Independence",
        body: [projectFacts.independenceStatement],
      },
    ],
  },
  updates: {
    title: "Updates",
    description: "Truthful notes about Syllabus Sync product and site development.",
    intro:
      "A small, readable record of meaningful project changes. No invented release history and no decorative version numbers.",
    sections: updates.map((update) => ({
      heading: update.title,
      body: [`${update.date} · ${update.category}`, update.summary],
    })),
  },
  contact: {
    title: "Contact Syllabus Sync",
    description: "Student support, partnership, accessibility and general enquiries.",
    intro:
      "Choose the enquiry type that best matches what you need. Security reports follow the responsible-disclosure guidance.",
    sections: [
      {
        heading: "Before you send",
        body: [
          "Do not include passwords, authentication codes, student numbers, health information or other highly sensitive material.",
          "Contact delivery is only activated when an approved server-side transport is configured. The form reports that status honestly.",
        ],
      },
    ],
  },
  terms: {
    title: "Website terms",
    description: "Terms for using the Syllabus Sync information website.",
    intro:
      "These plain-language website terms are an operational draft and must receive legal review before a production launch.",
    sections: [
      {
        heading: "Information only",
        body: [
          "This website explains Syllabus Sync and does not replace official university systems, academic advice or emergency communications.",
        ],
      },
      {
        heading: "Acceptable use",
        body: [
          "Do not interfere with the site, attempt unauthorised access, submit harmful content or misuse the contact service.",
        ],
      },
      {
        heading: "Accuracy and availability",
        body: [
          "Product information may change. The main application is the source of truth for current availability. Formal legal approval remains a launch requirement.",
        ],
      },
    ],
  },
  status: {
    title: "Service status",
    description: "Current status information for Syllabus Sync.",
    intro:
      "A verified external status service has not yet been connected, so this page does not display a fictional all-green indicator.",
    sections: [
      {
        heading: "Need help now?",
        body: [
          "If the main application is unavailable, try again later and use the contact page when delivery is enabled. A public status-provider link will be added after the provider and incident process are approved.",
        ],
      },
    ],
  },
} satisfies Record<string, PageDefinition>;

export type PageSlug = keyof typeof pages;
export const pageSlugs = Object.keys(pages) as PageSlug[];

export function pageMetadata(slug: PageSlug): Metadata {
  const page = pages[slug];
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      title: `${page.title} | Syllabus Sync`,
      description: page.description,
      url: `/${slug}`,
      type: "website",
    },
  };
}
