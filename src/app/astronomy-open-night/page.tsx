import type { Metadata } from "next";

import { ContentPage } from "@/components/content-page";
import { aonLegalIndex } from "@/content/astronomy-open-night-legal";

export const metadata: Metadata = {
  title: aonLegalIndex.title,
  description: aonLegalIndex.description,
  alternates: { canonical: "/astronomy-open-night" },
  openGraph: { title: `${aonLegalIndex.title} | Syllabus Sync`, description: aonLegalIndex.description, url: "/astronomy-open-night", type: "website" },
};

export default function AonIndexPage() {
  return <ContentPage page={aonLegalIndex} slug="astronomy-open-night" />;
}
