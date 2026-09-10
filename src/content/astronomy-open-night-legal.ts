import type { PageDefinition } from "./site";

/**
 * Store-facing pages for the Astronomy Open Night app.
 *
 * App Store Connect and Google Play both require a live, publicly reachable
 * Privacy Policy URL and Support URL, and the Google Maps Platform terms
 * require the app's Terms of Use to flow Google's Maps/Earth terms through to
 * end users. The app's own release documentation requires these pages to be
 * hosted on a stable HTTPS address that is NOT a university domain, and to
 * never contradict the policy text shipped inside the app.
 *
 * Every factual claim below is taken from the app's own privacy copy
 * (the in-app policy body and its Android privacy policy), which the app
 * holds to a code-checked standard. Nothing here is inferred.
 */

/** Named publishers, as recorded in the app repository's maintainer list. */
export const aonPublisher = "Leo Alavi and Mohammad Raouf Abedini";

/**
 * Contact address for privacy and support questions — the event's own address.
 * A working contact both stores can verify.
 */
export const aonContactEmail = "astronomyopennight@mq.edu.au";
/** Privacy / developer / legal contact (distinct from event support above). */
export const aonPrivacyContact = "leo@leoalavi.dev";

export const aonLastUpdated = "9 September 2026";

/** Event-side entity and copyright holder (never a university). */
export const aonEventTeam = "Astronomy Night – FSE Outreach Team";
export const aonCopyright = "© 2026 Astronomy Night – FSE Outreach Team";
/** Official event information and support (Macquarie University event site). */
export const aonEventSiteUrl = "https://event.mq.edu.au/astronomy-open-night/";
/** The Astronomy Open Night web app — its own subdomain, an independent site. */
export const aonWebAppUrl = "https://aon.syllabus-sync.app/";
/** The single canonical Privacy Policy — the AON app's own page, not this site. */
export const aonPrivacyUrl = "https://aon.syllabus-sync.app/privacy";

export const aonLegalSlugs = ["support", "terms"] as const;
export type AonLegalSlug = (typeof aonLegalSlugs)[number];

export const aonLegalPages: Record<AonLegalSlug, PageDefinition> = {
  "support": {
    title: "Astronomy Open Night app: Support",
    description: "Help with the Astronomy Open Night event app.",
    intro: `Need help with the app? Email ${aonContactEmail} and we will get back to you. On the night itself, the fastest help is at any information point in the Central Courtyard.`,
    sections: [
      {
        heading: "The map does not show where I am",
        body: [
          "Location is optional, and the app works without it. To see the blue dot, allow location access for the app in your device settings. If you are not on campus yet, turn on Preview from anywhere in the Settings tab to see how the map will look on the night.",
        ],
      },
      {
        heading: "How does the Astronomy Passport work?",
        body: [
          "Each venue has a QR sign on the night. Open the passport from the Home tab, tap Scan or enter a code, and scan the sign or type the code printed on it to collect that venue's stamp. Not on campus yet? Practise with Preview the Astronomy Passport in the Settings tab.",
        ],
      },
      {
        heading: "Do I need internet?",
        body: [
          "No. The map, programme, venue information and 360° tours all work offline. Only walking directions on a Google map need a connection, and the app asks first.",
        ],
      },
      {
        heading: "How do I delete what the app has saved?",
        body: ["Open the Settings tab, then Privacy, then Delete my data."],
      },
      {
        heading: "Accessibility",
        body: [
          `The app supports VoiceOver, larger text up to 200% and Reduce Motion. If you hit an accessibility barrier, tell us at ${aonContactEmail}; we want to fix it.`,
        ],
      },
      {
        heading: "Event details",
        body: [
          "Astronomy Open Night, Saturday 19 September 2026, 4pm to 10pm.",
          "Balaclava Road, Macquarie Park NSW 2109, Australia.",
        ],
        links: [
          { label: "Privacy Policy", href: aonPrivacyUrl },
          { label: "Terms of Use", href: "/astronomy-open-night/terms" },
        ],
      },
    ],
  },
  "terms": {
    title: "Astronomy Open Night app: Terms of Use",
    description: "Terms for using the Astronomy Open Night event app.",
    intro: `${aonPublisher} provide the Astronomy Open Night app free of charge to help visitors find their way around the Astronomy Open Night event. It is an independent project developed for the ${aonEventTeam}. Last updated ${aonLastUpdated}. ${aonCopyright}.`,
    sections: [
      {
        heading: "Event information may change",
        body: [
          "Times, locations and activities are as published at the time of release and may change. On the night, event signage and staff instructions take precedence over anything shown in the app.",
        ],
      },
      {
        heading: "Walking directions and the map",
        body: [
          "Walking directions are a guide, not a survey. Follow paths, lighting and event signage, and take care after dark. The app tells you where a route has not yet been checked on foot.",
        ],
      },
      {
        heading: "Google Maps",
        body: [
          "Parts of this app use Google Maps. By using those parts you agree to the Google Maps/Google Earth Additional Terms of Service, which incorporate the Google Privacy Policy.",
        ],
        links: [
          { label: "Google Maps/Google Earth Additional Terms of Service", href: "https://maps.google.com/help/terms_maps/" },
          { label: "Google Privacy Policy", href: "https://policies.google.com/privacy" },
        ],
      },
      {
        heading: "No warranty",
        body: [
          `The app is provided "as is". ${aonPublisher} do not warrant that it will be uninterrupted or error-free, and are not liable for any loss arising from reliance on the information it contains, to the extent permitted by law.`,
        ],
      },
      {
        heading: "Contact",
        body: [`Questions about these terms: ${aonPrivacyContact}`],
        links: [
          { label: "Privacy Policy", href: aonPrivacyUrl },
          { label: "Support", href: "/astronomy-open-night/support" },
        ],
      },
    ],
  },
};

/** Index page listing the three store-facing pages. */
export const aonLegalIndex: PageDefinition = {
  title: "Astronomy Open Night",
  description:
    "The Astronomy Open Night event companion — launch the web app, read the privacy policy, or visit the official event website.",
  intro: `The Astronomy Open Night app is an offline-first event guide and night-time wayfinding companion, built by ${aonPublisher} as an independent project for the ${aonEventTeam}. It is not affiliated with, endorsed or sponsored by any university. Launch the web app, or read its store pages below. ${aonCopyright}.`,
  sections: [
    {
      heading: "The app",
      body: [
        "Use the Astronomy Open Night companion right in your browser — no install needed — for the programme, the campus map, the Astronomy Passport and your saved plan.",
      ],
      links: [
        { label: "Open the web app", href: aonWebAppUrl },
        { label: "Official event website", href: aonEventSiteUrl },
      ],
    },
    {
      heading: "Privacy, support and terms",
      body: ["The same pages are linked from the app's Settings tab."],
      links: [
        { label: "Privacy Policy", href: aonPrivacyUrl },
        { label: "Support", href: "/astronomy-open-night/support" },
        { label: "Terms of Use", href: "/astronomy-open-night/terms" },
      ],
    },
  ],
};
