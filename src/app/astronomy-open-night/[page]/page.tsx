import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContentPage } from "@/components/content-page";
import { aonOrigin, aonLegalPages, aonLegalSlugs, type AonLegalSlug } from "@/content/astronomy-open-night-legal";

function isAonLegalSlug(value: string): value is AonLegalSlug {
  return (aonLegalSlugs as readonly string[]).includes(value);
}

export function generateStaticParams() {
  return aonLegalSlugs.map((page) => ({ page }));
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> {
  const { page } = await params;
  if (!isAonLegalSlug(page)) return {};
  const definition = aonLegalPages[page];
  const path = `${aonOrigin}/${page}`;
  return {
    title: definition.title,
    description: definition.description,
    alternates: { canonical: path },
    openGraph: { title: `${definition.title} | Syllabus Sync`, description: definition.description, url: path, type: "website" },
  };
}

export default async function AonLegalPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  if (!isAonLegalSlug(page)) notFound();
  return <ContentPage page={aonLegalPages[page]} slug={`astronomy-open-night-${page}`} />;
}
