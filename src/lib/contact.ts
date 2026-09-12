import { z } from "zod";

export const enquiryTypes = [
  "Student support",
  "Partnership",
  "Media or collaboration",
  "Accessibility",
  "General",
] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(100),
  email: z.email("Enter a valid email address.").max(254),
  enquiryType: z.enum(enquiryTypes),
  organisation: z.string().trim().max(160).optional().default(""),
  message: z.string().trim().min(20, "Tell us a little more (at least 20 characters).").max(4000),
  privacyAccepted: z.literal(true, { error: "Confirm that you have read the privacy notice." }),
  website: z.string().max(0, "Unable to submit."),
  startedAt: z.number().int().positive(),
});

export type ContactInput = z.infer<typeof contactSchema>;

/**
 * Resolve the client identifier used to key rate limiting.
 *
 * Security: `X-Forwarded-For` and `X-Real-IP` are attacker-controlled — a client
 * can send any value and its leftmost `X-Forwarded-For` hop is the client's own
 * claim. Keying the limiter on those lets an attacker rotate the header to get a
 * fresh bucket on every request and bypass the limit entirely.
 *
 * On Cloudflare, `CF-Connecting-IP` is set by the edge and any client-supplied
 * value is overwritten, so it is the only trustworthy source and is preferred.
 * The forwarded headers remain as a fallback for non-Cloudflare hosts (local
 * dev, Vercel), where there is no spoofing boundary to protect anyway. Returns
 * `"unknown"` when nothing is present, so all such requests share one bucket
 * rather than going unlimited.
 */
export function resolveClientIp(headers: Headers): string {
  const cfConnectingIp = headers.get("cf-connecting-ip")?.trim();
  if (cfConnectingIp) return cfConnectingIp.slice(0, 80);

  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) return realIp.slice(0, 80);

  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (forwarded) return forwarded.slice(0, 80);

  return "unknown";
}

export function validateContactInput(input: unknown, now = Date.now()) {
  const result = contactSchema.safeParse(input);
  if (!result.success) return result;

  const elapsed = now - result.data.startedAt;
  if (elapsed < 1_500 || elapsed > 7_200_000) {
    return {
      success: false as const,
      error: new z.ZodError([
        {
          code: "custom",
          path: ["form"],
          message: "Please refresh the page and try again.",
        },
      ]),
    };
  }

  return result;
}
