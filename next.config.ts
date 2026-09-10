import path from "node:path";
import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";

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
