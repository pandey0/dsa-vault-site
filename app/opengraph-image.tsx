import { ImageResponse } from "next/og"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "#0a0d0e",
          padding: "0 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 40,
            fontWeight: 700,
            color: "#eef2f1",
            marginBottom: 28,
          }}
        >
          dsa_vault<span style={{ color: "#6ee7a0" }}>$</span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 60,
            fontWeight: 800,
            color: "#f2f5f4",
            lineHeight: 1.15,
            maxWidth: 980,
          }}
        >
          Stop grinding DSA problems blind.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#8a969b",
            marginTop: 32,
          }}
        >
          A Socratic AI coach for DSA interviews · one-time · lifetime access
        </div>
      </div>
    ),
    { ...size }
  )
}
