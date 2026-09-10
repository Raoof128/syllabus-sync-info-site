import type { Metadata } from "next";

import { ContentPage } from "@/components/content-page";
import { aonLegalIndex } from "@/content/astronomy-open-night-legal";

// Independent project — no site-wide "| Syllabus Sync" title suffix.
const aonIndexTitle = "Astronomy Open Night 2026";

export const metadata: Metadata = {
  title: { absolute: aonIndexTitle },
  description: aonLegalIndex.description,
  alternates: { canonical: "/astronomy-open-night" },
  openGraph: { title: aonIndexTitle, description: aonLegalIndex.description, url: "/astronomy-open-night", type: "website" },
};

export default function AonIndexPage() {
  return <ContentPage page={aonLegalIndex} slug="astronomy-open-night" />;
}
