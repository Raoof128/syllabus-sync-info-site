import "server-only";

import { createHash } from "node:crypto";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest } from "next/server";

import { validateContactInput } from "@/lib/contact";

type RateEntry = { count: number; resetAt: number };
const rateLimits = new Map<string, RateEntry>();
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT = 5;
const MAX_TRACKED_CLIENTS = 5_000;
const MAX_BODY_BYTES = 16_384;

/**
 * Cloudflare Workers Rate Limiting binding (GA). Declared in wrangler.jsonc as
 * CONTACT_RATE_LIMITER (5 requests / 60s per key). Colo-distributed, so it holds
 * across the many isolates a Worker deployment runs — unlike the per-isolate
 * in-memory map below, which is only a fallback for local dev / non-Cloudflare
 * hosts (e.g. Vercel) where the binding is absent.
 */
type RateLimitBinding = { limit: (options: { key: string }) => Promise<{ success: boolean }> };

async function edgeRateLimited(key: string): Promise<boolean | null> {
  try {
    const { env } = getCloudflareContext();
    const limiter = (env as Record<string, unknown>).CONTACT_RATE_LIMITER as RateLimitBinding | undefined;
    if (!limiter) return null;
    const { success } = await limiter.limit({ key });
    return !success;
  } catch {
    return null;
  }
}

function rateLimitKey(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim().slice(0, 80);
  const candidate = forwarded || request.headers.get("x-real-ip")?.slice(0, 80) || "unknown";
  return createHash("sha256").update(candidate).digest("hex");
}

function isRateLimited(key: string, now = Date.now()) {
  if (rateLimits.size > MAX_TRACKED_CLIENTS) {
    for (const [entryKey, entry] of rateLimits) {
      if (entry.resetAt <= now) rateLimits.delete(entryKey);
    }
  }

  const current = rateLimits.get(key);
  if (!current || current.resetAt <= now) {
    rateLimits.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > RATE_LIMIT;
}

function validWebhookUrl(value: string | undefined) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return null;
    return url;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin) {
    let originHost: string;
    try {
      originHost = new URL(origin).host;
    } catch {
      return Response.json({ message: "This submission origin is not allowed." }, { status: 403 });
    }

    // Proxies may rewrite NextRequest.nextUrl. Compare with the forwarded or
    // direct Host header so same-origin submissions remain valid after deploy.
    const requestHosts = new Set(
      [
        request.headers.get("x-forwarded-host")?.split(",")[0]?.trim(),
        request.headers.get("host"),
        request.nextUrl.host,
      ].filter((host): host is string => Boolean(host)),
    );
    if (!requestHosts.has(originHost)) {
      return Response.json({ message: "This submission origin is not allowed." }, { status: 403 });
    }
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > MAX_BODY_BYTES) {
    return Response.json({ message: "The submission is too large." }, { status: 413 });
  }

  const rateKey = rateLimitKey(request);
  const edgeLimited = await edgeRateLimited(rateKey);
  const limited = edgeLimited ?? isRateLimited(rateKey);
  if (limited) {
    return Response.json({ message: "Too many attempts. Please wait before trying again." }, { status: 429 });
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return Response.json({ message: "The request body could not be read." }, { status: 400 });
  }
  if (Buffer.byteLength(rawBody, "utf8") > MAX_BODY_BYTES) {
    return Response.json({ message: "The submission is too large." }, { status: 413 });
  }

  let input: unknown;
  try {
    input = JSON.parse(rawBody);
  } catch {
    return Response.json({ message: "The request must contain valid JSON." }, { status: 400 });
  }

  if (typeof input === "object" && input !== null && "website" in input && input.website) {
    return Response.json({ message: "Thank you." });
  }

  const result = validateContactInput(input);
  if (!result.success) {
    const firstIssue = result.error.issues[0]?.message ?? "Check the form and try again.";
    return Response.json({ message: firstIssue }, { status: 400 });
  }

  const webhookUrl = validWebhookUrl(process.env.CONTACT_WEBHOOK_URL);
  if (!webhookUrl) {
    return Response.json(
      { message: "Your message is valid, but delivery has not been configured yet. Please try again after launch." },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.CONTACT_WEBHOOK_TOKEN ? { Authorization: `Bearer ${process.env.CONTACT_WEBHOOK_TOKEN}` } : {}),
      },
      body: JSON.stringify({
        name: result.data.name,
        email: result.data.email,
        enquiryType: result.data.enquiryType,
        organisation: result.data.organisation,
        message: result.data.message,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(6_000),
    });
    if (!response.ok) throw new Error(`Contact transport returned ${response.status}`);
    return Response.json({ message: "Thanks, your enquiry has been sent." });
  } catch {
    return Response.json({ message: "The contact service is temporarily unavailable. Please try again later." }, { status: 502 });
  }
}
