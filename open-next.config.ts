import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Default Cloudflare adapter configuration. Caching handlers can be added here
// later if the site introduces ISR / "use cache"; the current site is
// statically generated with a single dynamic route (/api/contact), so the
// defaults are sufficient.
export default defineCloudflareConfig();
