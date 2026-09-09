import { describe, expect, it } from "vitest";

import {
  AON_CONTACT_PLACEHOLDER,
  aonContactEmail,
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
    expect([...aonLegalSlugs]).toEqual(["app-privacy", "app-support", "app-terms"]);
    expect(aonLegalIndex.sections[0]?.links?.map((l) => l.href)).toEqual([
      "/astronomy-open-night/app-privacy",
      "/astronomy-open-night/app-support",
      "/astronomy-open-night/app-terms",
    ]);
  });

  it("names both publishers and never a university as publisher", () => {
    expect(aonPublisher).toBe("Leo Alavi and Mohammad Raouf Abedini");
    expect(allText("app-privacy")).toContain(`published by ${aonPublisher}`);
    for (const slug of aonLegalSlugs) {
      // "published by <a university>" must never appear; "not affiliated with any university" is fine.
      expect(allText(slug)).not.toMatch(/published (by|under) (the |a |an )?(macquarie|university)/i);
    }
  });

  it("does not ship a university or malformed contact address", () => {
    const isPlaceholder = aonContactEmail === AON_CONTACT_PLACEHOLDER;
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(aonContactEmail);
    expect(isPlaceholder || isValidEmail).toBe(true);
    expect(aonContactEmail.toLowerCase()).not.toMatch(/\.edu\.au$|mq\.edu\.au/);
  });

  it("privacy policy discloses the real data flows rather than claiming nothing is collected", () => {
    const privacy = allText("app-privacy");
    expect(privacy).toContain("no account");
    expect(privacy).toContain("Google Maps");
    expect(privacy).toContain("ML Kit");
    expect(privacy).toContain("route origin");
    expect(privacy).toContain("system backups");
    expect(privacy).toContain("Delete my data");
    // The disproven "we collect nothing" framing must not come back.
    expect(privacy).not.toMatch(/collects? nothing/i);
  });

  it("terms flow the Google Maps terms through to end users", () => {
    const terms = aonLegalPages["app-terms"];
    const googleTerms = terms.sections.find((s) => s.heading === "Google Maps");
    expect(googleTerms?.links?.map((l) => l.href)).toContain("https://maps.google.com/help/terms_maps/");
  });
});
