import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function IconImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#f7f5ef",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(145deg, #e5243d 0 46%, #071a3a 47% 55%, #1460d2 56%)",
          borderRadius: "48% 48% 42% 42%",
          boxShadow: "0 24px 50px rgba(7, 26, 58, .18)",
          color: "white",
          display: "flex",
          fontSize: 176,
          fontWeight: 800,
          height: 360,
          justifyContent: "center",
          letterSpacing: -24,
          paddingRight: 22,
          position: "relative",
          width: 310,
        }}
      >
        SS
        <span
          style={{
            background: "#c89122",
            border: "12px solid #f7f5ef",
            borderRadius: 999,
            bottom: 70,
            display: "flex",
            height: 54,
            position: "absolute",
            width: 54,
          }}
        />
      </div>
    </div>,
    size,
  );
}
