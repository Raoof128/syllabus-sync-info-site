import { readFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";

export const alt = "Syllabus Sync — Your semester, finally organised";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The card design is unchanged; only the placeholder diamond and typed product
 * name are replaced by the real lockup. A compact copy of the artwork is used
 * because Satori has to inline the image as a data URI.
 */
async function lockupDataUri() {
  const file = await readFile(path.join(process.cwd(), "public", "brand", "og-lockup.png"));
  return `data:image/png;base64,${file.toString("base64")}`;
}

export default async function Image() {
  const lockup = await lockupDataUri();

  return new ImageResponse(
    <div style={{ background: "#f7f5ef", color: "#071a3a", display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between", padding: "76px 84px", position: "relative", width: "100%" }}>
      {/* Satori renders a plain <img>; next/image is not available in an ImageResponse. */}
      <img alt="Syllabus Sync" height={92} src={lockup} style={{ objectFit: "contain" }} width={184} />
      <div style={{ display: "flex", flexDirection: "column" }}><span style={{ fontSize: 74, fontWeight: 750, letterSpacing: "-4px", lineHeight: 1.02 }}>Your semester,<br />finally organised.</span><span style={{ color: "#526078", fontSize: 28, marginTop: 30 }}>One clear place for the academic day.</span></div>
      <div style={{ bottom: 80, display: "flex", gap: 20, position: "absolute", right: 84 }}><span style={{ background: "#e5243d", borderRadius: 99, height: 12, width: 150 }} /><span style={{ background: "#1460d2", borderRadius: 99, height: 12, width: 220 }} /></div>
    </div>,
    size,
  );
}
