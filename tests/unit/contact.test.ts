import { describe, expect, it } from "vitest";

import { validateContactInput } from "@/lib/contact";

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
