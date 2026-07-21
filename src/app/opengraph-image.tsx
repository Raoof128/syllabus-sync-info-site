import { ImageResponse } from "next/og";

export const alt = "Syllabus Sync — Your semester, finally organised";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div style={{ background: "#f7f5ef", color: "#071a3a", display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between", padding: "76px 84px", position: "relative", width: "100%" }}>
      <div style={{ alignItems: "center", display: "flex", fontSize: 32, fontWeight: 700, gap: 18 }}><span style={{ background: "#e5243d", height: 18, transform: "rotate(45deg)", width: 18 }} />Syllabus Sync</div>
      <div style={{ display: "flex", flexDirection: "column" }}><span style={{ fontSize: 74, fontWeight: 750, letterSpacing: "-4px", lineHeight: 1.02 }}>Your semester,<br />finally organised.</span><span style={{ color: "#526078", fontSize: 28, marginTop: 30 }}>One clear place for the academic day.</span></div>
      <div style={{ bottom: 80, display: "flex", gap: 20, position: "absolute", right: 84 }}><span style={{ background: "#e5243d", borderRadius: 99, height: 12, width: 150 }} /><span style={{ background: "#1460d2", borderRadius: 99, height: 12, width: 220 }} /></div>
    </div>,
    size,
  );
}
