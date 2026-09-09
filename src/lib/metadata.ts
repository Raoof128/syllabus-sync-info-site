import type { Metadata } from "next";

import { projectFacts } from "@/content/project-facts";
import { brandIcons } from "@/lib/brand";

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

const absolute = (pathname: string) =>
  new URL(pathname, projectFacts.informationSiteUrl).toString();

/**
 * Search engines expect an absolute, square-ish logo URL. The 512px app icon is
 * used because it is the logomark on an opaque brand backdrop, which renders
 * predictably in knowledge panels that do not handle transparency.
 */
export const organisationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: projectFacts.productName,
  url: projectFacts.informationSiteUrl,
  logo: {
    "@type": "ImageObject",
    url: absolute(brandIcons.icon512.src),
    width: brandIcons.icon512.size,
    height: brandIcons.icon512.size,
  },
  description: projectFacts.shortDescription,
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: projectFacts.productName,
  url: projectFacts.informationSiteUrl,
  description: projectFacts.shortDescription,
  inLanguage: "en-AU",
  publisher: { "@type": "Organization", name: projectFacts.productName, url: projectFacts.informationSiteUrl },
};
