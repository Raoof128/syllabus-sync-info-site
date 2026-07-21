import { projectFacts } from "@/content/project-facts";

export const dynamic = "force-static";

export function GET() {
  const body = `# Syllabus Sync

Syllabus Sync is an independent academic planning platform designed to bring units, deadlines, calendar information, campus context and student events into one clearer experience.

- [Main product](${projectFacts.mainApplicationUrl})
- [Product information](${projectFacts.informationSiteUrl}/product)
- [Security](${projectFacts.informationSiteUrl}/security)
- [Privacy](${projectFacts.informationSiteUrl}/privacy)
- [Accessibility](${projectFacts.informationSiteUrl}/accessibility)
- [Universities](${projectFacts.informationSiteUrl}/universities)
- [Updates](${projectFacts.informationSiteUrl}/updates)
- [Contact](${projectFacts.informationSiteUrl}/contact)
- [Responsible disclosure](${projectFacts.informationSiteUrl}/security#responsible-disclosure)

${projectFacts.independenceStatement}
`;
  return new Response(body, { headers: { "Content-Type": "text/markdown; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
