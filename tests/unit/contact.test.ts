import { describe, expect, it } from "vitest";

import { resolveClientIp, validateContactInput } from "@/lib/contact";

const validInput = {
  name: "Alex Student",
  email: "alex@example.test",
  enquiryType: "General",
  organisation: "",
  message: "I would like to understand the current product direction.",
  privacyAccepted: true,
  website: "",
  startedAt: 1_000,
} as const;

describe("contact validation", () => {
  it("accepts a bounded, complete enquiry", () => {
    expect(validateContactInput(validInput, 3_000).success).toBe(true);
  });

  it("rejects a submission completed too quickly", () => {
    expect(validateContactInput(validInput, 1_500).success).toBe(false);
  });

  it("rejects missing privacy acknowledgement", () => {
    expect(validateContactInput({ ...validInput, privacyAccepted: false }, 3_000).success).toBe(false);
  });

  it("rejects oversized messages", () => {
    expect(validateContactInput({ ...validInput, message: "x".repeat(4_001) }, 3_000).success).toBe(false);
  });
});

describe("rate-limit client identity", () => {
  it("prefers CF-Connecting-IP, the only edge-trusted source", () => {
    const headers = new Headers({ "cf-connecting-ip": "203.0.113.7", "x-real-ip": "10.0.0.1" });
    expect(resolveClientIp(headers)).toBe("203.0.113.7");
  });

  it("ignores a spoofed X-Forwarded-For when CF-Connecting-IP is present", () => {
    // The attack: rotate X-Forwarded-For to get a fresh rate-limit bucket. It
    // must not win over the edge-set CF-Connecting-IP.
    const headers = new Headers({
      "cf-connecting-ip": "203.0.113.7",
      "x-forwarded-for": "1.2.3.4, 5.6.7.8",
    });
    expect(resolveClientIp(headers)).toBe("203.0.113.7");
  });

  it("falls back to X-Real-IP, then the first X-Forwarded-For hop, off Cloudflare", () => {
    expect(resolveClientIp(new Headers({ "x-real-ip": "198.51.100.9" }))).toBe("198.51.100.9");
    expect(resolveClientIp(new Headers({ "x-forwarded-for": "198.51.100.10, 10.0.0.1" }))).toBe("198.51.100.10");
  });

  it("returns a shared 'unknown' bucket rather than going unlimited", () => {
    expect(resolveClientIp(new Headers())).toBe("unknown");
  });

  it("bounds the identifier length to stop key-cardinality abuse", () => {
    const headers = new Headers({ "cf-connecting-ip": "9".repeat(500) });
    expect(resolveClientIp(headers).length).toBe(80);
  });
});
