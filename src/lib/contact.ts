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
