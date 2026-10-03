import { projectFacts } from "@/content/project-facts";

export const dynamic = "force-static";

export function GET() {
  const body = `# Syllabus Sync

Syllabus Sync is an independent student platform for academic planning. Sylla is its AI-assisted study layer, and Campus Navigation is a connected mobile wayfinding companion. Astronomy Open Night 2026 is a separate event project by the same team, not a Syllabus Sync product.

- [Main product](${projectFacts.mainApplicationUrl})
- [Sylla](https://sylla.syllabus-sync.app)
- [Campus Navigation](${projectFacts.informationSiteUrl}/#campus-navigation)
- [Separate Astronomy Open Night project](${projectFacts.informationSiteUrl}/astronomy-open-night)
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
