import { describe, expect, it } from "vitest";

import {
  aonContactEmail,
  aonLegalIndex,
  aonLegalPages,
  aonLegalSlugs,
  aonPrivacyUrl,
  aonPublisher,
} from "@/content/astronomy-open-night-legal";

const allText = (slug: keyof typeof aonLegalPages) => {
  const page = aonLegalPages[slug];
  return [page.title, page.intro, ...page.sections.flatMap((s) => [s.heading, ...s.body])].join("\n");
};

describe("Astronomy Open Night pages on the info site", () => {
  it("hosts only support and terms — the privacy policy lives on the AON app", () => {
    // Privacy has ONE canonical home: the AON app's own page. The info site
    // does not host a duplicate; the old route redirects there (next.config).
    expect([...aonLegalSlugs]).toEqual(["support", "terms"]);
    expect(aonPrivacyUrl).toBe("https://aon.syllabus-sync.app/privacy");

    const legalSection = aonLegalIndex.sections.find((s) => s.heading === "Privacy, support and terms");
    expect(legalSection?.links?.map((l) => l.href)).toEqual([
      aonPrivacyUrl,
      "/astronomy-open-night/support",
      "/astronomy-open-night/terms",
    ]);
    // The index also launches the app and links the official event site.
    const appSection = aonLegalIndex.sections.find((s) => s.heading === "The app");
    expect(appSection?.links?.map((l) => l.href)).toEqual([
      "https://aon.syllabus-sync.app/",
      "https://event.mq.edu.au/astronomy-open-night/",
    ]);
  });

  it("credits the individual developers and never presents Syllabus Sync as owner/publisher", () => {
    expect(aonPublisher).toBe("Leo Alavi and Mohammad Raouf Abedini");
    // The developer credit appears (on the terms page and the index).
    expect(`${allText("terms")}\n${aonLegalIndex.intro}`).toContain(aonPublisher);
    for (const slug of aonLegalSlugs) {
      // Never present a university, or Syllabus Sync, as the publisher/owner.
      expect(allText(slug)).not.toMatch(/published (by|under) (the |a |an )?(macquarie|university)/i);
      expect(allText(slug)).not.toContain("Syllabus Sync");
    }
    expect(aonLegalIndex.intro).not.toContain("Syllabus Sync");
  });

  it("uses a working event contact address", () => {
    // The event's own address is fine — being hosted on aon.syllabus-sync.app
    // does not require a non-university contact.
    expect(aonContactEmail).toBe("astronomyopennight@mq.edu.au");
    expect(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(aonContactEmail)).toBe(true);
  });

  it("copyright is the event team, never a university or the developers", () => {
    const terms = allText("terms");
    expect(terms).toContain("© 2026 Astronomy Night – FSE Outreach Team");
    expect(terms).toContain(`developed for the Astronomy Night – FSE Outreach Team`);
    expect(terms).not.toMatch(/©\s*Macquarie University/i);
    expect(terms).not.toMatch(/©\s*20\d\d\s*(Leo Alavi|Mohammad|Syllabus Sync)/i);
  });

  it("support page claims only the accessibility support the app team verified", () => {
    const support = allText("support");
    expect(support).toContain("VoiceOver");
    expect(support).not.toContain("TalkBack");
    // Support links out to the canonical privacy, not an info-site copy.
    const links = aonLegalPages["support"].sections.flatMap((s) => s.links ?? []);
    expect(links.some((l) => l.href === aonPrivacyUrl)).toBe(true);
  });

  it("terms flow the Google Maps terms through to end users", () => {
    const terms = aonLegalPages["terms"];
    const googleTerms = terms.sections.find((s) => s.heading === "Google Maps");
    expect(googleTerms?.links?.map((l) => l.href)).toContain("https://maps.google.com/help/terms_maps/");
  });
});
