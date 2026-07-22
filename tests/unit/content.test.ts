import { describe, expect, it } from "vitest";

import {
  approvedEcosystem,
  approvedFeatures,
  approvedProofPoints,
  approvedRoadmapPhases,
  approvedTeam,
  projectFacts,
} from "@/content/project-facts";
import { footerNavigation, pageMetadata, pageSlugs, primaryNavigation } from "@/content/site";

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

  it("uses the real production domain, not the stale placeholder", () => {
    expect(projectFacts.mainApplicationUrl).toBe("https://www.syllabus-sync.app");
    expect(projectFacts.informationSiteUrl).toBe("https://info.syllabus-sync.app");
  });

  it("only exposes approved ecosystem products, each with an id and at least one feature", () => {
    expect(approvedEcosystem.length).toBe(3);
    expect(approvedEcosystem.every((product) => product.approved)).toBe(true);
    expect(approvedEcosystem.map((product) => product.id)).toEqual([
      "platform",
      "sylla",
      "mq-navigation",
    ]);
    expect(approvedEcosystem.every((product) => product.features.length > 0)).toBe(true);
  });

  it("never claims Sylla's study tools are anything more than a prototype", () => {
    const sylla = approvedEcosystem.find((product) => product.id === "sylla")!;
    const chat = sylla.features.find((feature) => feature.name === "AI chat")!;
    const studyTools = sylla.features.filter((feature) => feature.name !== "AI chat" && feature.name !== "Embedded assistant panel inside Syllabus Sync");
    expect(chat.status).toBe("early-access");
    expect(studyTools.every((feature) => feature.status === "prototype")).toBe(true);
  });

  it("keeps the roadmap's Sydney phase free of named universities", () => {
    const sydneyPhase = approvedRoadmapPhases.find((phase) => phase.phase === "Phase 2")!;
    expect(sydneyPhase.title).toBe("Expansion to other Sydney universities");
    for (const named of ["University of Sydney", "UNSW", "UTS", "Western Sydney University"]) {
      expect(sydneyPhase.description).not.toContain(named);
      expect(sydneyPhase.items.join(" ")).not.toContain(named);
    }
  });

  it("attributes the team accurately", () => {
    expect(approvedTeam).toHaveLength(2);
    expect(approvedTeam.every((member) => member.approved)).toBe(true);
    const pouya = approvedTeam.find((member) => member.name.startsWith("Pouya"))!;
    const raouf = approvedTeam.find((member) => member.name.startsWith("Raouf") || member.name.includes("Raouf"))!;
    expect(pouya.role).toBe("Co-founder, Software Engineering & Product");
    expect(raouf.role).toBe("Co-founder, Backend & Platform Engineering");
  });

  it("states the incubator fact with the exact approved wording", () => {
    expect(projectFacts.incubator.headline).toBe(
      "Selected for the Macquarie University Incubator in May 2026.",
    );
    expect(projectFacts.incubator.approved).toBe(true);
  });

  it("primary navigation reflects the ecosystem anchor structure", () => {
    expect(primaryNavigation.map((item) => item.label)).toEqual([
      "Home",
      "Platform",
      "Sylla",
      "MQ Navigation",
      "Vision",
      "About",
      "Contact",
    ]);
    expect(primaryNavigation.find((item) => item.label === "Platform")?.href).toBe("/#platform");
    expect(primaryNavigation.find((item) => item.label === "Sylla")?.href).toBe("/#sylla");
    expect(primaryNavigation.find((item) => item.label === "MQ Navigation")?.href).toBe("/#mq-navigation");
  });

  it("footer navigation still reaches every existing standalone page", () => {
    const paths = footerNavigation.map((item) => item.href);
    for (const path of ["/product", "/features", "/security", "/privacy", "/accessibility", "/terms", "/universities", "/about", "/updates", "/contact", "/status"]) {
      expect(paths).toContain(path);
    }
  });
});
