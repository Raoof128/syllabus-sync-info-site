import { describe, expect, it } from "vitest";

import { approvedFeatures, approvedProofPoints, projectFacts } from "@/content/project-facts";
import { pageMetadata, pageSlugs, primaryNavigation } from "@/content/site";

describe("public content governance", () => {
  it("never exposes unapproved proof points", () => {
    expect(approvedProofPoints.every((proof) => proof.approved)).toBe(true);
  });

  it("only exposes approved features", () => {
    expect(approvedFeatures.length).toBeGreaterThan(0);
    expect(approvedFeatures.every((feature) => feature.approved)).toBe(true);
  });

  it("keeps navigation paths unique", () => {
    const paths = primaryNavigation.map((item) => item.href);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("builds self-referencing canonical metadata", () => {
    expect(pageMetadata("security").alternates?.canonical).toBe("/security");
  });

  it("includes every required content route", () => {
    expect(pageSlugs).toEqual(expect.arrayContaining(["product", "features", "security", "privacy", "accessibility", "universities", "about", "updates", "contact", "terms", "status"]));
  });

  it("retains the independent-platform statement", () => {
    expect(projectFacts.independenceStatement).toContain("not an official university service");
  });
});
