import type { MetadataRoute } from "next";

import { projectFacts } from "@/content/project-facts";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "GPTBot", disallow: "/" },
    ],
    sitemap: `${projectFacts.informationSiteUrl}/sitemap.xml`,
    host: projectFacts.informationSiteUrl,
  };
}
