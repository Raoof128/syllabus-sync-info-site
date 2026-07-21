"use client";

import { FormEvent, useRef, useState } from "react";

import { contactSchema, enquiryTypes } from "@/lib/contact";

type FormStatus = { kind: "idle" | "pending" | "success" | "error"; message?: string };
type FieldErrors = Partial<Record<"name" | "email" | "enquiryType" | "message" | "privacyAccepted", string>>;

export function ContactForm() {
  const startedAt = useRef(0);
  const [status, setStatus] = useState<FormStatus>({ kind: "idle" });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ kind: "pending" });
    const form = new FormData(event.currentTarget);
    const body = {
      name: form.get("name"),
      email: form.get("email"),
      enquiryType: form.get("enquiryType"),
      organisation: form.get("organisation"),
      message: form.get("message"),
      privacyAccepted: form.get("privacyAccepted") === "on",
      website: form.get("website"),
      startedAt: startedAt.current,
    };

    const validation = contactSchema.safeParse(body);
    if (!validation.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of validation.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && field in body && !(field in nextErrors)) {
          nextErrors[field as keyof FieldErrors] = issue.message;
        }
      }
      setFieldErrors(nextErrors);
      setStatus({ kind: "error", message: validation.error.issues[0]?.message ?? "Check the form and try again." });
      return;
    }

    setFieldErrors({});

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });
      const result = (await response.json()) as { message?: string };
      setStatus({
        kind: response.ok ? "success" : "error",
        message: result.message ?? "The request could not be completed.",
      });
      if (response.ok) event.currentTarget.reset();
    } catch {
      setStatus({ kind: "error", message: "The contact service is unavailable. Please try again later." });
    }
  }

  return (
    <form
      className="contact-form"
      noValidate
      onFocusCapture={() => {
        if (startedAt.current === 0) startedAt.current = Date.now();
      }}
      onSubmit={submit}
    >
      <div className="form-grid">
        <label>Name<input aria-describedby={fieldErrors.name ? "name-error" : undefined} aria-invalid={Boolean(fieldErrors.name)} autoComplete="name" maxLength={100} name="name" required />{fieldErrors.name && <span className="field-error" id="name-error">{fieldErrors.name}</span>}</label>
        <label>Email<input aria-describedby={fieldErrors.email ? "email-error" : undefined} aria-invalid={Boolean(fieldErrors.email)} autoComplete="email" inputMode="email" maxLength={254} name="email" required type="email" />{fieldErrors.email && <span className="field-error" id="email-error">{fieldErrors.email}</span>}</label>
        <label>Enquiry type<select aria-describedby={fieldErrors.enquiryType ? "enquiry-error" : undefined} aria-invalid={Boolean(fieldErrors.enquiryType)} defaultValue="" name="enquiryType" required><option disabled value="">Choose one</option>{enquiryTypes.map((type) => <option key={type}>{type}</option>)}</select>{fieldErrors.enquiryType && <span className="field-error" id="enquiry-error">{fieldErrors.enquiryType}</span>}</label>
        <label>Organisation <span>(optional)</span><input autoComplete="organization" maxLength={160} name="organisation" /></label>
      </div>
      <label>Message<textarea aria-describedby={fieldErrors.message ? "message-error" : undefined} aria-invalid={Boolean(fieldErrors.message)} maxLength={4000} minLength={20} name="message" required rows={7} />{fieldErrors.message && <span className="field-error" id="message-error">{fieldErrors.message}</span>}</label>
      <label className="checkbox-label"><input aria-describedby={fieldErrors.privacyAccepted ? "privacy-error" : undefined} aria-invalid={Boolean(fieldErrors.privacyAccepted)} name="privacyAccepted" required type="checkbox" /> <span>I have read the privacy notice and have not included highly sensitive information.</span></label>
      {fieldErrors.privacyAccepted && <p className="field-error" id="privacy-error">{fieldErrors.privacyAccepted}</p>}
      <label className="honeypot" aria-hidden="true">Website<input autoComplete="off" name="website" tabIndex={-1} /></label>
      <button className="button" disabled={status.kind === "pending"} type="submit">{status.kind === "pending" ? "Sending…" : "Send enquiry"}</button>
      <p aria-live="polite" className={`form-status ${status.kind}`}>{status.message}</p>
    </form>
  );
}
