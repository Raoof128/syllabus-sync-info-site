import type { MetadataRoute } from "next";

import { projectFacts } from "@/content/project-facts";
import { pageSlugs } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-07-21T00:00:00+10:00");
  return [
    { url: projectFacts.informationSiteUrl, lastModified, changeFrequency: "monthly", priority: 1 },
    ...pageSlugs.map((slug) => ({ url: `${projectFacts.informationSiteUrl}/${slug}`, lastModified, changeFrequency: "monthly" as const, priority: slug === "product" ? 0.9 : 0.7 })),
  ];
}
