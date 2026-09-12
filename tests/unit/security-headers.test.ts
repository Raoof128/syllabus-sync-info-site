import { describe, expect, it } from "vitest";

import nextConfig from "../../next.config";

/**
 * Regression guard for the site's security posture. These headers are declared
 * in `next.config.ts` and are easy to weaken or delete by accident during an
 * unrelated edit; this test fails loudly if a core protection disappears.
 *
 * The test imports the config with NODE_ENV=test (i.e. not development), so it
 * also asserts the production CSP does not carry the dev-only `'unsafe-eval'`.
 */
async function globalHeaders() {
  const groups = await nextConfig.headers!();
  const global = groups.find((group) => group.source === "/(.*)" && !("missing" in group && group.missing));
  if (!global) throw new Error("global header group not found");
  return new Map(global.headers.map((header) => [header.key, header.value]));
}

describe("security headers", () => {
  it("sets a locked-down Content-Security-Policy", async () => {
    const csp = (await globalHeaders()).get("Content-Security-Policy") ?? "";
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("form-action 'self'");
  });

  it("does not allow eval in the production CSP", async () => {
    const csp = (await globalHeaders()).get("Content-Security-Policy") ?? "";
    expect(csp).not.toContain("'unsafe-eval'");
  });

  it("keeps the transport, framing and sniffing protections", async () => {
    const headers = await globalHeaders();
    expect(headers.get("Strict-Transport-Security")).toContain("max-age=31536000");
    expect(headers.get("X-Frame-Options")).toBe("DENY");
    expect(headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(headers.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    expect(headers.get("Cross-Origin-Opener-Policy")).toBe("same-origin");
  });
});
