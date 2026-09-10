import { describe, expect, it } from "vitest";

import {
  aonContactEmail,
  aonCopyright,
  aonDeveloperCredit,
  aonEventContactEmail,
  aonLegalIndex,
  aonLegalPages,
  aonLegalSlugs,
  aonPublisher,
} from "@/content/astronomy-open-night-legal";

const allText = (slug: keyof typeof aonLegalPages) => {
  const page = aonLegalPages[slug];
  return [page.title, page.intro, ...page.sections.flatMap((s) => [s.heading, ...s.body])].join("\n");
};

describe("Astronomy Open Night store pages", () => {
  it("publishes exactly the three store-facing pages plus an index", () => {
    expect([...aonLegalSlugs]).toEqual(["privacy", "support", "terms"]);
    const legalSection = aonLegalIndex.sections.find((s) => s.heading === "Privacy, support and terms");
    expect(legalSection?.links?.map((l) => l.href)).toEqual([
      "https://aon.syllabus-sync.app/privacy",
      "https://aon.syllabus-sync.app/support",
      "https://aon.syllabus-sync.app/terms",
    ]);
    // The index also launches the app and links the official event site.
    const appSection = aonLegalIndex.sections.find((s) => s.heading === "The app");
    expect(appSection?.links?.map((l) => l.href)).toEqual([
      "https://aon.syllabus-sync.app/",
      "https://event.mq.edu.au/astronomy-open-night/",
    ]);
  });

  it("names both developers and never a university as publisher", () => {
    expect(aonPublisher).toBe("Leo Alavi and Mohammad Raouf Abedini");
    // The event team's attribution model: the Syllabus Sync team built it, and
    // both developers are named. Neither half may be dropped.
    expect(aonDeveloperCredit).toBe(`the Syllabus Sync team (${aonPublisher})`);
    expect(allText("privacy")).toContain(`developed by the Syllabus Sync team (${aonPublisher})`);
    expect(allText("privacy")).toContain("Mohammad Raouf Abedini");
    for (const slug of aonLegalSlugs) {
      // "published by <a university>" must never appear; "not affiliated with any university" is fine.
      expect(allText(slug)).not.toMatch(/published (by|under) (the |a |an )?(macquarie|university)/i);
    }
  });

  it("routes privacy to the developer and event questions to the event team", () => {
    const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    expect(isValidEmail(aonContactEmail)).toBe(true);
    expect(isValidEmail(aonEventContactEmail)).toBe(true);
    // Data requests must reach the developer, never a university mailbox that
    // cannot act on the app.
    expect(aonContactEmail.toLowerCase()).not.toMatch(/\.edu\.au$|mq\.edu\.au/);
    // The event team owns the event, so its own address is the event contact.
    expect(aonEventContactEmail).toBe("astronomyopennight@mq.edu.au");
    const privacy = allText("privacy");
    expect(privacy).toContain(`Privacy questions and data requests about the app: ${aonContactEmail}`);
    expect(privacy).toContain(`Contact: ${aonEventContactEmail}`);
  });

  it("scopes the policy exactly as the event team asked", () => {
    const privacy = allText("privacy");
    expect(privacy).toContain("This Privacy Policy applies specifically to the Astronomy Open Night 2026 app");
    expect(privacy).toContain("It does not apply to other Syllabus Sync products or to the Macquarie University website.");
    // The scope sentence must not shrink the policy to mobile only: the web
    // version stores data in the browser and is served by Cloudflare.
    expect(privacy).toContain("covers its iOS, Android and web versions");
  });

  it("privacy policy discloses the real data flows rather than claiming nothing is collected", () => {
    const privacy = allText("privacy");
    expect(privacy).toContain("no account");
    expect(privacy).toContain("Google Maps");
    expect(privacy).toContain("ML Kit");
    expect(privacy).toContain("route origin");
    expect(privacy).toContain("system backups");
    expect(privacy).toContain("Delete my data");
    // The disproven "we collect nothing" framing must not come back, in any wording:
    // a route origin and Google SDK diagnostics do leave the device.
    expect(privacy).not.toMatch(/collects? (nothing|no personal (information|data))/i);
    // Both platforms' backups are covered, and the compass sensor is disclosed.
    expect(privacy).toMatch(/iCloud/);
    expect(privacy).toMatch(/motion sensor/);
  });

  it("support page claims only the accessibility support the app team verified", () => {
    const support = allText("support");
    expect(support).toContain("VoiceOver");
    expect(support).not.toContain("TalkBack");
  });

  it("frames identity as the Syllabus Sync team for the FSE outreach team, with the confirmed copyright", () => {
    const privacy = allText("privacy");
    expect(privacy).toContain("Astronomy Night – FSE Outreach Team");
    expect(aonCopyright).toBe("© 2026 Astronomy Night – FSE Outreach Team");
    expect(privacy).not.toMatch(/©\s*Macquarie University/i);
  });

  it("scopes the policy to Astronomy Open Night and discloses the web camera fallback and no data sale", () => {
    const privacy = allText("privacy");
    expect(privacy).toContain("covers its iOS, Android and web versions");
    expect(privacy).toContain("manual code entry");
    expect(privacy).toContain("do not sell your personal data");
  });

  it("terms flow the Google Maps terms through to end users", () => {
    const terms = aonLegalPages["terms"];
    const googleTerms = terms.sections.find((s) => s.heading === "Google Maps");
    expect(googleTerms?.links?.map((l) => l.href)).toContain("https://maps.google.com/help/terms_maps/");
  });
});
