import { GET as securityText } from "../../security.txt/route";

export const dynamic = "force-static";

export function GET() {
  return securityText();
}
