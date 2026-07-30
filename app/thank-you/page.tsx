import { JetBrains_Mono } from "next/font/google";
import Link from "next/link";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const codeTag = { background: "rgba(255,255,255,.06)", padding: "2px 5px", borderRadius: 3 };

const STEPS = [
  { n: "1", body: <>Accept the invite in your GitHub notifications or email.</> },
  {
    n: "2",
    body: (
      <>
        <code style={codeTag}>git clone</code> the repo, then <code style={codeTag}>npm install</code>.
      </>
    ),
  },
  {
    n: "3",
    body: (
      <>
        Make sure you&apos;re logged into the Claude CLI, then <code style={codeTag}>npm run dev</code> and open
        localhost:3000.
      </>
    ),
  },
];

export default function ThankYou() {
  return (
    <div
      className={`${jetbrainsMono.className} dsa-landing`}
      style={{ background: "#0a0d0e", color: "#d8dee2", minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <div style={{ display: "flex", alignItems: "center", padding: "18px clamp(20px,5vw,64px)", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
        <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.02em", color: "#eef2f1" }}>
          dsa_vault<span style={{ color: "#6ee7a0" }}>$</span>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(32px,6vw,64px) 20px" }}>
        <div style={{ maxWidth: 560, width: "100%" }}>
          <div
            style={{
              border: "1px solid rgba(255,255,255,.1)",
              borderRadius: 8,
              background: "#0d1214",
              overflow: "hidden",
              boxShadow: "0 30px 80px -20px rgba(0,0,0,.6)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "11px 14px",
                background: "#12181a",
                borderBottom: "1px solid rgba(255,255,255,.06)",
              }}
            >
              <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#ff5f57" }} />
              <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#febc2e" }} />
              <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#28c840" }} />
              <div style={{ marginLeft: 10, fontSize: 12, color: "#5c6b70" }}>zsh — checkout</div>
            </div>
            <div style={{ padding: "24px 24px 26px", fontSize: 13.5, lineHeight: 2, color: "#c7d1d4" }}>
              <div>
                <span style={{ color: "#6ee7a0" }}>$</span>{" "}razorpay verify --payment ✓
              </div>
              <div>
                <span style={{ color: "#6ee7a0" }}>$</span>{" "}github invite --collaborator ✓
              </div>
              <div style={{ color: "#6ee7a0", fontWeight: 700 }}>
                &gt; access granted
                <span
                  style={{
                    display: "inline-block",
                    width: 8,
                    height: 15,
                    background: "#6ee7a0",
                    marginLeft: 6,
                    verticalAlign: -2,
                    animation: "dsa-landing-blink 1s step-end infinite",
                  }}
                />
              </div>
            </div>
          </div>

          <h1 style={{ fontSize: "clamp(24px,4vw,32px)", color: "#f2f5f4", margin: "32px 0 12px", fontWeight: 800, letterSpacing: "-0.02em" }}>
            You&apos;re in.
          </h1>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "#aeb8bc", margin: "0 0 32px" }}>
            A GitHub collaborator invite is on its way to the email you checked out with — usually within a
            minute. Here&apos;s what to do once it lands:
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 36 }}>
            {STEPS.map((step, i) => (
              <div
                key={step.n}
                style={{
                  display: "flex",
                  gap: 16,
                  padding: "16px 0",
                  borderTop: "1px solid rgba(255,255,255,.08)",
                  borderBottom: i === STEPS.length - 1 ? "1px solid rgba(255,255,255,.08)" : undefined,
                }}
              >
                <div style={{ fontSize: 16, fontWeight: 800, color: "#2a3236", width: 24, flexShrink: 0 }}>{step.n}</div>
                <div style={{ fontSize: 13.5, lineHeight: 1.6, color: "#c7d1d4" }}>{step.body}</div>
              </div>
            ))}
          </div>

          <div
            style={{
              border: "1px solid rgba(255,180,84,.3)",
              background: "rgba(255,180,84,.05)",
              borderRadius: 6,
              padding: "16px 18px",
              fontSize: 13,
              lineHeight: 1.65,
              color: "#d8c9ae",
              marginBottom: 32,
            }}
          >
            No invite after 10 minutes? Check spam, then email{" "}
            <a href="mailto:arpit242002@gmail.com">arpit242002@gmail.com</a> with your Razorpay payment ID.
          </div>

          <Link href="/" style={{ textDecoration: "none", fontSize: 13, color: "#5c6b70", borderBottom: "1px dashed rgba(92,107,112,.5)" }}>
            ← back to dsa_vault
          </Link>
        </div>
      </div>
    </div>
  );
}
