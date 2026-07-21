import { projectFacts } from "@/content/project-facts";

export const dynamic = "force-static";

export function GET() {
  const body = `Contact: ${projectFacts.informationSiteUrl}/security#responsible-disclosure
Expires: 2027-07-21T00:00:00.000Z
Preferred-Languages: en
Canonical: ${projectFacts.informationSiteUrl}/.well-known/security.txt
Policy: ${projectFacts.informationSiteUrl}/security#responsible-disclosure
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
