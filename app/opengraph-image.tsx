import { ImageResponse } from "next/og";

export const alt = "Spliit — Split bills smartly";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage:
            "linear-gradient(135deg, #4f46e5 0%, #4338ca 55%, #6b21a8 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ display: "flex", fontSize: 96 }}>🧮</div>
          <div
            style={{
              display: "flex",
              fontSize: 104,
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: -3,
            }}
          >
            Spliit
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 34, color: "#e0e7ff", marginTop: 28 }}>
          Split bills smartly, no awkward conversations.
        </div>
      </div>
    ),
    { ...size }
  );
}
