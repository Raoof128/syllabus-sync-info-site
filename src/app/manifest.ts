import type { MetadataRoute } from "next";

import { brandIcons } from "@/lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Syllabus Sync",
    short_name: "Syllabus Sync",
    description: "One clear place for the academic day.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f5ef",
    theme_color: "#f7f5ef",
    icons: [
      { src: brandIcons.icon192.src, sizes: "192x192", type: "image/png", purpose: "any" },
      { src: brandIcons.icon512.src, sizes: "512x512", type: "image/png", purpose: "any" },
      // Padded so launchers that crop to a circle or squircle never clip the mark.
      { src: brandIcons.maskable512.src, sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
