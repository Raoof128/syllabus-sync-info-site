import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContentPage } from "@/components/content-page";
import { aonLegalPages, aonLegalSlugs, type AonLegalSlug } from "@/content/astronomy-open-night-legal";

function isAonLegalSlug(value: string): value is AonLegalSlug {
  return (aonLegalSlugs as readonly string[]).includes(value);
}

// Astronomy Open Night is an independent project, not a Syllabus Sync product,
// so its pages use an ABSOLUTE title (no site-wide "| Syllabus Sync" suffix).
const aonPageTitles: Record<AonLegalSlug, string> = {
  support: "Astronomy Open Night 2026 — Support",
  terms: "Astronomy Open Night 2026 — Terms",
};

export function generateStaticParams() {
  return aonLegalSlugs.map((page) => ({ page }));
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> {
  const { page } = await params;
  if (!isAonLegalSlug(page)) return {};
  const definition = aonLegalPages[page];
  const path = `/astronomy-open-night/${page}`;
  const title = aonPageTitles[page];
  return {
    title: { absolute: title },
    description: definition.description,
    alternates: { canonical: path },
    openGraph: { title, description: definition.description, url: path, type: "website" },
  };
}

export default async function AonLegalPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  if (!isAonLegalSlug(page)) notFound();
  return <ContentPage page={aonLegalPages[page]} slug={`astronomy-open-night-${page}`} />;
}
