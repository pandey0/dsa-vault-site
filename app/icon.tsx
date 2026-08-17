import { ImageResponse } from "next/og"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0d0e",
          borderRadius: 7,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
          <path d="M 132 196 A 68 68 0 0 1 268 196" fill="none" stroke="#6ee7a0" strokeWidth="24" strokeLinecap="round" />
          <rect x="108" y="186" width="184" height="152" rx="26" fill="#6ee7a0" />
          <path d="M 182 228 L 214 262 L 182 296" fill="none" stroke="#0a0d0e" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="224" y="280" width="34" height="16" rx="4" fill="#0a0d0e" />
        </svg>
      </div>
    ),
    { ...size }
  )
}
