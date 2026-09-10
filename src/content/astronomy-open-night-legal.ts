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

/** Named developers, as recorded in the app repository's maintainer list. */
export const aonPublisher = "Leo Alavi and Mohammad Raouf Abedini";

/**
 * Attribution model confirmed by the event team, 2026-09-09, and reaffirmed
 * 2026-09-10. Each party is named for exactly what it does:
 *
 * - Leo Alavi holds the store developer account and is the App Store seller.
 * - The Syllabus Sync team, `aonPublisher`, developed the app.
 * - Astronomy Night - FSE Outreach Team owns the event and the copyright.
 * - The Macquarie University event site is the official event and support source.
 * - The syllabus-sync.app domain is the technical host of this policy and the
 *   web app, and nothing more.
 *
 * "Developed by the Syllabus Sync team" is the team that built it, not a claim
 * that the app is a Syllabus Sync product. Both statements appear together on
 * purpose; do not drop one to tidy the other.
 */
export const aonDeveloperCredit = `the Syllabus Sync team (${aonPublisher})`;

/**
 * Privacy and data-request contact: the developer account holder, confirmed in
 * the app's Play release listing, 2026-09-05. Data requests have to reach the
 * party that can act on them, which is the developer, not the event team.
 */
export const aonContactEmail = "leo@leoalavi.dev";

/**
 * Event-side contact, supplied by the event team 2026-09-09. This is a
 * university address on purpose: the Astronomy Night - FSE Outreach Team owns
 * the event and answers event questions. It is never presented as the app's
 * publisher or as the developers' address.
 */
export const aonEventContactEmail = "astronomyopennight@mq.edu.au";

export const aonLastUpdated = "10 September 2026";

/** Event-side entity and copyright holder (never a university). */
export const aonEventTeam = "Astronomy Night – FSE Outreach Team";
export const aonCopyright = "© 2026 Astronomy Night – FSE Outreach Team";
/** Official event information and support (Macquarie University event site). */
export const aonEventSiteUrl = "https://event.mq.edu.au/astronomy-open-night/";
/** Independent app; this domain supplies hosting, not product ownership. */
export const aonOrigin = "https://aon.syllabus-sync.app";
export const aonWebAppPath = `${aonOrigin}/`;

export const aonLegalSlugs = ["privacy", "support", "terms"] as const;
export type AonLegalSlug = (typeof aonLegalSlugs)[number];

const googleLinks = [
  { label: "Google Privacy Policy", href: "https://policies.google.com/privacy" },
  { label: "Google Maps data disclosure", href: "https://developers.google.com/maps/documentation/android-sdk/play-data-disclosure" },
  { label: "ML Kit data disclosure", href: "https://developers.google.com/ml-kit/android-data-disclosure" },
];

export const aonLegalPages: Record<AonLegalSlug, PageDefinition> = {
  "privacy": {
    title: "Astronomy Open Night app: Privacy Policy",
    description: "How the Astronomy Open Night event app handles information.",
    intro: `This Privacy Policy applies specifically to the Astronomy Open Night 2026 app, and covers its iOS, Android and web versions. It does not apply to other Syllabus Sync products or to the Macquarie University website. Astronomy Open Night was developed by ${aonDeveloperCredit} for the ${aonEventTeam}, which runs the event and holds the copyright. It is published under Leo Alavi's store developer account, and Leo Alavi is the App Store seller. The app is not affiliated with, endorsed or sponsored by any university, and the developers do not own or run the event; official event information and support are provided through the official event website. The syllabus-sync.app domain is the technical host of this policy and the web app, which does not make Astronomy Open Night a Syllabus Sync product. This policy covers everyone who uses the app. Last updated ${aonLastUpdated}.`,
    sections: [
      {
        heading: "What the app collects",
        body: [
          "There is no account, sign-in, advertising or developer-operated analytics service. There is no tracking, and we do not sell your personal data. We do not operate a server that holds your saved plan or stamps.",
          "The app stores passport stamps, favourites, your saved plan, Google Maps consent and your preferences on your device. The web version stores these in your browser. Your device's own backup (iCloud or device backups on iOS; system backups or device transfers on Android) may include that local data, according to your device settings.",
        ],
      },
      {
        heading: "Location",
        body: [
          "Location is optional and the app works without it. If you allow it, the app uses your location on your device to show where you are on the campus map and to point the compass toward a venue. The compass also reads your device's motion sensor to tell which way you are facing; that reading never leaves your device.",
          "When you request walking directions and agree to Google Maps, the app sends the route origin (which may be your precise or approximate location) and the destination to Google over HTTPS. Until you agree, the app loads no Google map and sends no request.",
        ],
      },
      {
        heading: "Google Maps and walking directions",
        body: [
          "The campus map is an image stored inside the app and works offline. Walking directions on a Google map are the one exception, and the app asks before using them.",
          "To provide and improve its services, Google Maps also receives map requests, your IP address, device and app information, an SDK-specific identifier, crash and performance diagnostics, usage data and map interactions. On web, Google receives device and browser information with map and directions requests. You can revoke your Google Maps choice at any time in Settings.",
        ],
        links: googleLinks,
      },
      {
        heading: "Camera and QR scanning",
        body: [
          "The app uses the camera for one purpose: reading the QR code on a venue sign for the Astronomy Passport. It starts only when you tap Scan. The app processes camera images on your device and never saves or uploads them.",
          "On Android, the QR scanner uses Google ML Kit, which reports device and app information, installation identifiers, and performance and usage diagnostics to Google over HTTPS. You can type the printed station code instead of using the camera.",
          "The web version does not open the camera: the Astronomy Passport uses manual code entry, where you type the printed station code. No image is captured or uploaded.",
        ],
      },
      {
        heading: "Web hosting and external links",
        body: [
          "Cloudflare hosts the web app and these pages. Loading them sends your IP address, requested URL and browser request information to Cloudflare so it can deliver and protect the site. This hosting traffic is separate from the app's locally saved plan and stamps.",
          "Opening an external link, including the official event website or Google Maps, sends a request to that provider. Its own privacy policy then applies.",
        ],
        links: [{ label: "Cloudflare Privacy Policy", href: "https://www.cloudflare.com/privacypolicy/" }],
      },
      {
        heading: "Retention and deletion",
        body: [
          "Saved stamps, favourites and plans remain until you delete them. In the app, Settings, then Delete my data, clears these items and your Google Maps consent; language and appearance preferences are retained.",
          "Deleting data in the app does not delete data that Google has already received, or copies held in system backups. Google controls retention and deletion of its own service data under its privacy policy. Removing the mobile app removes its local app data but may leave system backups. On web, clear this site's data in your browser to remove all locally saved preferences as well.",
        ],
      },
      {
        heading: "Security",
        body: [
          "Mobile local storage uses the operating system's app sandbox. The web version uses browser storage for this site. Neither provides a promise of absolute security.",
        ],
      },
      {
        heading: "Children",
        body: [
          "The app is intended for general audiences attending a public event. It has no account and asks for no personal details from anyone, including children. The third-party services and hosting described above still process their disclosed data when used. The app does not link saved plans or stamps to an account.",
        ],
      },
      {
        heading: "Changes",
        body: ["If this policy changes, we will update this page and the date above."],
      },
      {
        heading: "Contact",
        body: [
          `Privacy questions and data requests about the app: ${aonContactEmail}. That address reaches the developer account holder, who can act on the app itself.`,
          `Event information and event support: ${aonEventContactEmail}, or the official event website.`,
        ],
        links: [{ label: "Official event website", href: aonEventSiteUrl }],
      },
      {
        heading: "Astronomy Open Night 2026",
        body: [
          `Developed by ${aonDeveloperCredit} for the ${aonEventTeam}.`,
          `Official event information and support: ${aonEventSiteUrl}`,
          `Contact: ${aonEventContactEmail}`,
        ],
        links: [{ label: "Official event website", href: aonEventSiteUrl }],
      },
    ],
  },
  "support": {
    title: "Astronomy Open Night app: Support",
    description: "Help with the Astronomy Open Night event app.",
    intro: `Need help with the app? Email ${aonContactEmail} and we will get back to you. For questions about the event itself, contact ${aonEventContactEmail} or the official event website. On the night itself, the fastest help is at any information point in the Central Courtyard.`,
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
          "The installed mobile app includes the map, programme, venue information and 360° tours for offline use. The web version needs a connection to load the app and any assets that are not already cached. Google walking directions need a connection, and the app asks first.",
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
          "Astronomy Open Night, Saturday 110 September 2026, 4pm to 10pm.",
          "Balaclava Road, Macquarie Park NSW 2109, Australia.",
        ],
        links: [
          { label: "Privacy Policy", href: `${aonOrigin}/privacy` },
          { label: "Terms of Use", href: `${aonOrigin}/terms` },
        ],
      },
    ],
  },
  "terms": {
    title: "Astronomy Open Night app: Terms of Use",
    description: "Terms for using the Astronomy Open Night event app.",
    intro: `Astronomy Open Night is developed by ${aonDeveloperCredit} for the ${aonEventTeam} and provided free of charge. Last updated ${aonLastUpdated}. ${aonCopyright}.`,
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
        body: [`Questions about these terms: ${aonContactEmail}`],
        links: [
          { label: "Privacy Policy", href: `${aonOrigin}/privacy` },
          { label: "Support", href: `${aonOrigin}/support` },
        ],
      },
    ],
  },
};

/** Index page listing the three store-facing pages. */
export const aonLegalIndex: PageDefinition = {
  title: "Astronomy Open Night",
  description:
    "The Astronomy Open Night event companion. Launch the web app, read the privacy policy, or visit the official event website.",
  intro: `The Astronomy Open Night app is an offline-first event guide and night-time wayfinding companion, developed by ${aonDeveloperCredit} for the ${aonEventTeam}. It is not affiliated with, endorsed or sponsored by any university, and it is not a Syllabus Sync product. Launch the web app, or read its store pages below. ${aonCopyright}.`,
  sections: [
    {
      heading: "The app",
      body: [
        "Use the Astronomy Open Night companion right in your browser without installing it, for the programme, the campus map, the Astronomy Passport and your saved plan.",
      ],
      links: [
        { label: "Open the web app", href: aonWebAppPath },
        { label: "Official event website", href: aonEventSiteUrl },
      ],
    },
    {
      heading: "Privacy, support and terms",
      body: ["The same pages are linked from the app's Settings tab."],
      links: [
        { label: "Privacy Policy", href: `${aonOrigin}/privacy` },
        { label: "Support", href: `${aonOrigin}/support` },
        { label: "Terms of Use", href: `${aonOrigin}/terms` },
      ],
    },
  ],
};
