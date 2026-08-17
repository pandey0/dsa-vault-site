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
            alignItems: "center",
            gap: 16,
            marginBottom: 28,
          }}
        >
          <svg width="44" height="44" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            <path d="M 132 196 A 68 68 0 0 1 268 196" fill="none" stroke="#6ee7a0" strokeWidth="24" strokeLinecap="round" />
            <rect x="108" y="186" width="184" height="152" rx="26" fill="#6ee7a0" />
            <path d="M 182 228 L 214 262 L 182 296" fill="none" stroke="#0a0d0e" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="224" y="280" width="34" height="16" rx="4" fill="#0a0d0e" />
          </svg>
          <div
            style={{
              display: "flex",
              fontSize: 40,
              fontWeight: 700,
              color: "#eef2f1",
            }}
          >
            dsa_vault<span style={{ color: "#6ee7a0" }}>$</span>
          </div>
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
