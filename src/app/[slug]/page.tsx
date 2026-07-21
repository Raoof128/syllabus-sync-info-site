import { notFound } from "next/navigation";

import { ContentPage } from "@/components/content-page";
import { pageMetadata, pages, pageSlugs, type PageSlug } from "@/content/site";

export function generateStaticParams() {
  return pageSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!pageSlugs.includes(slug as PageSlug)) return {};
  return pageMetadata(slug as PageSlug);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!pageSlugs.includes(slug as PageSlug)) notFound();
  const typedSlug = slug as PageSlug;
  return <ContentPage page={pages[typedSlug]} slug={typedSlug} />;
}
