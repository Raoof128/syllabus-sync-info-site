import path from "node:path";
import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";

// `script-src 'unsafe-inline'` is a deliberate, reviewed decision, not an
// oversight. Next.js App Router emits inline bootstrap/RSC-streaming scripts
// (e.g. `self.__next_f.push(...)`) on every page. Removing 'unsafe-inline'
// requires per-request nonces via middleware, which forces every route to render
// dynamically and drops this site's static generation (AGENTS.md rule 3, "16
// indexable static routes"). That trade is not justified here: the site renders
// no user-supplied HTML, and the only inline data (JSON-LD) is `<`-escaped and
// built from the typed content registry, so there is no injection sink for an
// inline-script CSP to defend. 'unsafe-eval' is dev-only (React Fast Refresh).
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "media-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  typedRoutes: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  turbopack: {
    // This project is nested inside an unrelated parent repository that also
    // contains a package-lock.json (and its own tools/proxy files). Pin the
    // workspace root so Turbopack doesn't infer the parent directory and pull
    // in unrelated files.
    root: path.resolve(__dirname),
  },
  async redirects() {
    return [
      {
        // The Astronomy Open Night privacy policy has ONE canonical home — the
        // AON app's own page. Any old link to the info-site copy redirects
        // there, so there is a single stable policy URL and no duplicate copy
        // to drift. Support and terms stay here, so they are not redirected.
        source: "/astronomy-open-night/privacy",
        destination: "https://aon.syllabus-sync.app/privacy",
        permanent: true,
      },
      {
        // The web app moved to its own host too. Old links and any printed code
        // pointing at the info-site path still have to land somewhere real.
        source: "/astronomy-open-night/app/:path*",
        destination: "https://aon.syllabus-sync.app/:path*",
        permanent: true,
      },
      // The first published names for these three pages were `app-privacy`,
      // `app-support` and `app-terms`. They were live and publicly reachable
      // before the rename, so they redirect rather than 404: a store console,
      // a bookmark or a printed link may still carry them.
      {
        source: "/astronomy-open-night/app-privacy",
        destination: "https://aon.syllabus-sync.app/privacy",
        permanent: true,
      },
      {
        source: "/astronomy-open-night/app-support",
        destination: "/astronomy-open-night/support",
        permanent: true,
      },
      {
        source: "/astronomy-open-night/app-terms",
        destination: "/astronomy-open-night/terms",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      {
        // Only the production canonical host should be indexable. Any other
        // host that serves this app (e.g. a *.workers.dev preview/staging URL)
        // gets a noindex header, so previews never compete with the real domain
        // in search. The canonical <link> already points at production; this is
        // defence in depth for hosts that reach the app directly.
        source: "/(.*)",
        missing: [{ type: "host", value: "info.syllabus-sync.app" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
