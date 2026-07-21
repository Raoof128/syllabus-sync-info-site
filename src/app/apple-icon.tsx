import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIconImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#f7f5ef",
        borderRadius: 36,
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
          color: "white",
          display: "flex",
          fontSize: 62,
          fontWeight: 800,
          height: 126,
          justifyContent: "center",
          letterSpacing: -9,
          paddingRight: 8,
          position: "relative",
          width: 108,
        }}
      >
        SS
        <span
          style={{
            background: "#c89122",
            border: "4px solid #f7f5ef",
            borderRadius: 999,
            bottom: 24,
            display: "flex",
            height: 20,
            position: "absolute",
            width: 20,
          }}
        />
      </div>
    </div>,
    size,
  );
}
