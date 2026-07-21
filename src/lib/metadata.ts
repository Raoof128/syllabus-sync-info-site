import type { Metadata } from "next";

import { projectFacts } from "@/content/project-facts";

export const rootMetadata: Metadata = {
  metadataBase: new URL(projectFacts.informationSiteUrl),
  title: {
    default: "Syllabus Sync | Your Semester, Finally Organised",
    template: "%s | Syllabus Sync",
  },
  description:
    "Bring units, deadlines, calendar information, campus context and student events into one clear academic planning experience.",
  applicationName: projectFacts.productName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: projectFacts.productName,
    title: "Syllabus Sync | Your Semester, Finally Organised",
    description:
      "One clear place for the academic day: units, deadlines, calendar, campus context and student events.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Syllabus Sync | Your Semester, Finally Organised",
    description:
      "One clear place for the academic day: units, deadlines, calendar, campus context and student events.",
    images: ["/opengraph-image"],
  },
  robots: { index: true, follow: true },
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: projectFacts.productName,
  url: projectFacts.informationSiteUrl,
  description: projectFacts.shortDescription,
  inLanguage: "en-AU",
};
