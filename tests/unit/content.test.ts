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
    expect(approvedEcosystem.length).toBe(4);
    expect(approvedEcosystem.every((product) => product.approved)).toBe(true);
    expect(approvedEcosystem.map((product) => product.id)).toEqual([
      "platform",
      "sylla",
      "campus-navigation",
      "astronomy-open-night",
    ]);
    expect(approvedEcosystem.every((product) => product.features.length > 0)).toBe(true);
    expect(approvedEcosystem.filter((product) => product.relationship === "Syllabus Sync ecosystem")).toHaveLength(3);
    expect(approvedEcosystem.find((product) => product.id === "astronomy-open-night")?.relationship).toBe("Separate team project");
    expect(approvedEcosystem.every((product) => product.screenshot.src.startsWith("/products/"))).toBe(true);
  });

  it("gives each ecosystem product a status matching its label's actual maturity, not a default", () => {
    const platform = approvedEcosystem.find((p) => p.id === "platform")!;
    const sylla = approvedEcosystem.find((p) => p.id === "sylla")!;
    const campus = approvedEcosystem.find((p) => p.id === "campus-navigation")!;
    const openNight = approvedEcosystem.find((p) => p.id === "astronomy-open-night")!;
    expect(platform.status).toBe("early-access");
    expect(sylla.status).toBe("early-access");
    expect(campus.statusLabel).toBe("Mobile release links coming soon");
    expect(openNight.status).toBe("available");
    expect(openNight.statusLabel).toBe("Published event app");
  });

  it("never links Astronomy Open Night to a repository the public cannot open", () => {
    const openNight = approvedEcosystem.find((p) => p.id === "astronomy-open-night")!;
    expect(openNight.link.external).toBe(false);
    expect(openNight.link.href).toBe("/contact");
  });

  it("does not present Astronomy Open Night as a Syllabus Sync product", () => {
    const openNight = approvedEcosystem.find((p) => p.id === "astronomy-open-night")!;
    // The AON card copy should describe the app on its own terms and must never
    // imply it is a Syllabus Sync product (guardrail; no defensive wording in
    // the visible copy).
    const copy = `${openNight.tagline} ${openNight.description}`;
    expect(copy).not.toMatch(/Syllabus Sync/i);
    expect(copy).toContain("Leo Alavi and Mohammad Raouf Abedini");
  });

  it("gives the Astronomy Open Night card accurate store, APK and public links", () => {
    const openNight = approvedEcosystem.find((p) => p.id === "astronomy-open-night")!;
    expect(openNight.actions?.map((action) => action.href)).toEqual([
      "https://apps.apple.com/au/app/astronomy-open-night-2026/id6808865067",
      "https://info.syllabus-sync.app/astronomy-open-night/android",
      "https://aon.syllabus-sync.app/",
      "https://aon.syllabus-sync.app/privacy",
      "https://event.mq.edu.au/astronomy-open-night/",
    ]);
    // The app, its privacy and the event site all live off this info site.
    expect(openNight.actions?.map((action) => action.external)).toEqual([true, true, true, true, true]);
  });

  it("does not invent a Campus Navigation web app or store URL", () => {
    const campus = approvedEcosystem.find((product) => product.id === "campus-navigation")!;
    expect(campus.link).toBeUndefined();
    expect(campus.actions).toBeUndefined();
    expect(campus.description).toContain("Syllabus Sync-side handoff");
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
    const leo = approvedTeam.find((member) => member.name === "Leo Alavi")!;
    const raouf = approvedTeam.find((member) => member.name.includes("Raouf"))!;
    expect(leo.role).toBe("Co-founder, Software Engineering & Product Development");
    expect(raouf.role).toBe("Co-founder, Backend & Platform Engineering");
    // Founder-confirmed public identity (2026-09-11): the credit standardises on
    // "Leo Alavi", matching the Astronomy Open Night app credit and leo@leoalavi.dev.
    expect(leo.linkedIn).toBe("https://www.linkedin.com/in/leo-alavi/");
    expect(leo.gitHub).toBe("https://github.com/leoalavi");
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
      "Campus Navigation",
      "Projects",
      "Vision",
      "About",
      "Contact",
    ]);
    expect(primaryNavigation.find((item) => item.label === "Platform")?.href).toBe("/#platform");
    expect(primaryNavigation.find((item) => item.label === "Sylla")?.href).toBe("/#sylla");
    expect(primaryNavigation.find((item) => item.label === "Campus Navigation")?.href).toBe("/#campus-navigation");
    expect(primaryNavigation.find((item) => item.label === "Projects")?.href).toBe("/#astronomy-open-night");
  });

  it("footer navigation still reaches every existing standalone page", () => {
    const paths = footerNavigation.map((item) => item.href);
    for (const path of ["/product", "/features", "/security", "/privacy", "/accessibility", "/terms", "/universities", "/about", "/updates", "/contact", "/status"]) {
      expect(paths).toContain(path);
    }
  });

  it("lists the LinkedIn company page under the Syllabus Sync display name", () => {
    const linkedIn = projectFacts.socialLinks.find((link) => link.href.includes("linkedin.com/company"));
    expect(linkedIn).toBeDefined();
    expect(linkedIn?.href).toBe("https://www.linkedin.com/company/syllabuss-sync/");
    expect(linkedIn?.label).toBe("Syllabus Sync on LinkedIn");
  });
});
