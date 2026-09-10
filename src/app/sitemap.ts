import type { MetadataRoute } from "next";

import { aonLegalSlugs } from "@/content/astronomy-open-night-legal";
import { projectFacts } from "@/content/project-facts";
import { pageSlugs } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-07-21T00:00:00+10:00");
  const aonLastModified = new Date("2026-09-09T00:00:00+10:00");
  return [
    { url: projectFacts.informationSiteUrl, lastModified, changeFrequency: "monthly", priority: 1 },
    ...pageSlugs.map((slug) => ({ url: `${projectFacts.informationSiteUrl}/${slug}`, lastModified, changeFrequency: "monthly" as const, priority: slug === "product" ? 0.9 : 0.7 })),
    // Store-facing pages for the Astronomy Open Night app; the stores follow these URLs.
    { url: `${projectFacts.informationSiteUrl}/astronomy-open-night`, lastModified: aonLastModified, changeFrequency: "monthly" as const, priority: 0.6 },
    ...aonLegalSlugs.map((slug) => ({ url: `${projectFacts.informationSiteUrl}/astronomy-open-night/${slug}`, lastModified: aonLastModified, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
