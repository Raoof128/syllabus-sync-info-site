import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Syllabus Sync",
    short_name: "Syllabus Sync",
    description: "One clear place for the academic day.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f5ef",
    theme_color: "#f7f5ef",
    icons: [{ src: "/icon", sizes: "512x512", type: "image/png" }],
  };
}
