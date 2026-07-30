import { JetBrains_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { GITHUB_AUTH_COOKIE, verifyCookieValue } from "@/lib/auth-cookie";
import { FaqAccordion } from "./faq-accordion";
import { FAQ_ITEMS } from "./faq-data";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// Structured data: what both Google's FAQ rich results and AI answer engines actually parse for
// reliable Q&A/pricing extraction, independent of the accordion's client-side visual state.
const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

const PRODUCT_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "DSA Vault",
  description:
    "An AI-assisted DSA interview trainer built on the Striver's A2Z DSA Sheet, with a Socratic AI coach that runs through your own Claude subscription.",
  offers: {
    "@type": "Offer",
    price: "199",
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
    url: "https://dsa-vault.shop/",
  },
};

const ERROR_MESSAGES: Record<string, string> = {
  oauth_state_mismatch: "GitHub sign-in failed a security check — please try connecting again.",
  oauth_token_exchange_failed: "Could not complete GitHub sign-in — please try again.",
  oauth_user_fetch_failed: "Could not read your GitHub profile — please try again.",
  oauth_unexpected_error: "Something went wrong during GitHub sign-in — please try again.",
  not_signed_in: "Please connect GitHub before buying.",
  payment_link_failed: "Could not start checkout — please try again in a moment.",
};

const codeTag = { background: "rgba(255,255,255,.06)", padding: "2px 5px", borderRadius: 3 };

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const cookieStore = await cookies();
  const githubUsername = verifyCookieValue(cookieStore.get(GITHUB_AUTH_COOKIE)?.value);

  return (
    <div
      className={`${jetbrainsMono.className} dsa-landing`}
      style={{ background: "#0a0d0e", color: "#d8dee2", minHeight: "100vh", overflowX: "hidden" }}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PRODUCT_JSON_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }} />
      {/* NAV */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px clamp(20px,5vw,64px)",
          borderBottom: "1px solid rgba(255,255,255,.08)",
          background: "rgba(10,13,14,.85)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.02em", color: "#eef2f1" }}>
          dsa_vault<span style={{ color: "#6ee7a0" }}>$</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "clamp(14px,3vw,32px)", fontSize: 13, color: "#8a969b" }}>
          <a href="#included" style={{ textDecoration: "none", color: "inherit" }}>
            features
          </a>
          <a href="#how" style={{ textDecoration: "none", color: "inherit", display: "none" }}>
            how it works
          </a>
          <a href="#faq" style={{ textDecoration: "none", color: "inherit" }}>
            faq
          </a>
          <a
            href="#pricing"
            style={{ textDecoration: "none", background: "#6ee7a0", color: "#0a0d0e", padding: "8px 16px", borderRadius: 3, fontWeight: 600 }}
          >
            get access
          </a>
        </div>
      </div>

      {/* HERO */}
      <div style={{ maxWidth: 920, margin: "0 auto", padding: "clamp(56px,9vw,104px) clamp(20px,5vw,64px) clamp(40px,6vw,72px)" }}>
        <div
          style={{
            display: "inline-block",
            fontSize: 12,
            color: "#6ee7a0",
            border: "1px solid rgba(110,231,160,.35)",
            background: "rgba(110,231,160,.06)",
            padding: "5px 10px",
            borderRadius: 3,
            marginBottom: 24,
          }}
        >
          built on the Striver A2Z DSA Sheet
        </div>
        <h1
          style={{
            fontSize: "clamp(32px,5.2vw,52px)",
            lineHeight: 1.08,
            letterSpacing: "-0.02em",
            color: "#f2f5f4",
            margin: "0 0 20px",
            fontWeight: 800,
            textWrap: "pretty",
          }}
        >
          Stop grinding DSA problems blind.
        </h1>
        <p style={{ fontSize: "clamp(15px,1.6vw,18px)", lineHeight: 1.65, color: "#aeb8bc", maxWidth: 600, margin: "0 0 36px", textWrap: "pretty" }}>
          A Socratic AI coach that runs on the Claude subscription you already pay for. Talk through your intuition
          before you see the answer, convert solutions to any language, get graded, and watch a step-by-step dry
          run of the algorithm underneath.
        </p>
        <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap", marginBottom: 48 }}>
          <a
            href="#pricing"
            style={{ textDecoration: "none", background: "#6ee7a0", color: "#0a0d0e", padding: "13px 24px", borderRadius: 3, fontWeight: 700, fontSize: 14 }}
          >
            Get access — ₹199
          </a>
          <div
            style={{
              fontSize: 12,
              color: "#6ee7a0",
              border: "1px solid rgba(110,231,160,.35)",
              background: "rgba(110,231,160,.06)",
              padding: "8px 14px",
              borderRadius: 3,
              fontWeight: 600,
            }}
          >
            one-time · lifetime access
          </div>
          <a href="#included" style={{ textDecoration: "none", color: "#aeb8bc", fontSize: 14, borderBottom: "1px dashed rgba(174,184,188,.4)" }}>
            see what&apos;s inside ↓
          </a>
        </div>

        {/* terminal mock */}
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
            <div style={{ marginLeft: 10, fontSize: 12, color: "#5c6b70" }}>zsh — dsa-vault</div>
          </div>
          <div style={{ padding: "20px 22px", fontSize: 13.5, lineHeight: 2.1, color: "#c7d1d4" }}>
            <div>
              <span style={{ color: "#6ee7a0" }}>$</span>{" "}git clone git@github.com:you/dsa-vault-pro-build.git
            </div>
            <div>
              <span style={{ color: "#6ee7a0" }}>$</span>{" "}node start.js
            </div>
            <div style={{ color: "#7a8790" }}>&gt; one-time GitHub sign-in to verify your license...</div>
            <div style={{ color: "#7a8790" }}>&gt; using your local `claude` login — no API key needed</div>
            <div style={{ color: "#7a8790" }}>
              &gt; ready on http://localhost:3000
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
      </div>

      {/* REQUIREMENT CALLOUT */}
      <div style={{ maxWidth: 920, margin: "0 auto", padding: "0 clamp(20px,5vw,64px) clamp(56px,8vw,88px)" }}>
        <div
          style={{
            border: "1px solid rgba(255,180,84,.3)",
            background: "rgba(255,180,84,.05)",
            borderRadius: 6,
            padding: "20px 22px",
            display: "flex",
            gap: 14,
          }}
        >
          <div style={{ color: "#ffb454", fontSize: 16, lineHeight: 1.4 }}>⚠</div>
          <div style={{ fontSize: 13.5, lineHeight: 1.7, color: "#d8c9ae" }}>
            <strong style={{ color: "#ffb454" }}>Before you buy:</strong> this requires your own Claude Pro, Max, or
            Code login. This repo is the workflow layer — it does not include any AI usage or API access of its
            own. Every generation runs through your <code style={codeTag}>claude</code> login, using your usage. No
            subscription you can run non-interactively? Not the right fit yet.
          </div>
        </div>
      </div>

      {/* DEMO VIDEO */}
      <div style={{ maxWidth: 920, margin: "0 auto", padding: "0 clamp(20px,5vw,64px) clamp(56px,8vw,88px)" }}>
        <div style={{ fontSize: 12, color: "#6ee7a0", marginBottom: 10, letterSpacing: ".04em" }}>{"// see it in action"}</div>
        <h2 style={{ fontSize: "clamp(22px,3vw,30px)", color: "#f2f5f4", margin: "0 0 24px", fontWeight: 700, letterSpacing: "-0.01em" }}>
          Watch a real session, not a mockup.
        </h2>
        <div
          style={{
            position: "relative",
            paddingTop: "56.25%",
            border: "1px solid rgba(255,255,255,.1)",
            borderRadius: 8,
            overflow: "hidden",
            background: "#0d1214",
            boxShadow: "0 30px 80px -20px rgba(0,0,0,.6)",
          }}
        >
          <iframe
            src="https://www.youtube-nocookie.com/embed/CHiYdGXEcgY"
            title="DSA Vault demo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
          />
        </div>
      </div>

      {/* WHAT'S INCLUDED */}
      <div id="included" style={{ maxWidth: 920, margin: "0 auto", padding: "clamp(40px,6vw,64px) clamp(20px,5vw,64px)", borderTop: "1px solid rgba(255,255,255,.08)" }}>
        <div style={{ fontSize: 12, color: "#6ee7a0", marginBottom: 10, letterSpacing: ".04em" }}>{"// what's included"}</div>
        <h2 style={{ fontSize: "clamp(22px,3vw,30px)", color: "#f2f5f4", margin: "0 0 36px", fontWeight: 700, letterSpacing: "-0.01em" }}>
          Five things you get, nothing you don&apos;t.
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: 1,
            background: "rgba(255,255,255,.08)",
            border: "1px solid rgba(255,255,255,.08)",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          {[
            {
              n: "01",
              title: "Full A2Z sheet, browsable",
              body: "Every problem in Striver's A2Z DSA Sheet, indexed with working Java solutions you can search and jump into.",
            },
            {
              n: "02",
              title: "Socratic coach chat",
              body: "Talk through your own intuition first. The coach questions your approach before it ever shows you the write-up.",
            },
            {
              n: "03",
              title: "Language conversion",
              body: "Port any solution from Java into whatever language your interview loop actually uses.",
            },
            {
              n: "04",
              title: "Graded practice attempts",
              body: "Submit your own attempt and get it graded against the pattern — not just pass/fail on test cases.",
            },
            {
              n: "05",
              title: "Visual step-by-step dry runs",
              body: "Generate a visual trace of any algorithm executing, step by step — see the state changes, not just the code.",
            },
          ].map((item) => (
            <div key={item.n} style={{ background: "#0d1214", padding: "26px 24px" }}>
              <div style={{ fontSize: 12, color: "#6ee7a0", marginBottom: 10 }}>{item.n}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#eef2f1", marginBottom: 8 }}>{item.title}</div>
              <div style={{ fontSize: 13, lineHeight: 1.65, color: "#8a969b" }}>{item.body}</div>
            </div>
          ))}
          <div style={{ background: "#0d1214", padding: "26px 24px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontSize: 13, lineHeight: 1.65, color: "#5c6b70" }}>
              Runs entirely through the Claude CLI already on your machine. No API keys, no added usage.
            </div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div id="how" style={{ maxWidth: 920, margin: "0 auto", padding: "clamp(40px,6vw,64px) clamp(20px,5vw,64px)", borderTop: "1px solid rgba(255,255,255,.08)" }}>
        <div style={{ fontSize: 12, color: "#6ee7a0", marginBottom: 10, letterSpacing: ".04em" }}>{"// how it works"}</div>
        <h2 style={{ fontSize: "clamp(22px,3vw,30px)", color: "#f2f5f4", margin: "0 0 36px", fontWeight: 700, letterSpacing: "-0.01em" }}>
          Three steps, no back-and-forth.
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {[
            { n: "01", title: "Pay once via Razorpay", body: "₹199, one-time. No account creation required beyond checkout." },
            {
              n: "02",
              title: "Get invited to the repo automatically",
              body: "A webhook fires on payment and sends a GitHub collaborator invite to your GitHub account — usually within a minute.",
            },
          ].map((step, i) => (
            <div key={step.n} style={{ display: "flex", gap: 20, padding: "20px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,.08)" : undefined }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#2a3236", width: 36, flexShrink: 0 }}>{step.n}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#eef2f1", marginBottom: 6 }}>{step.title}</div>
                <div style={{ fontSize: 13, lineHeight: 1.6, color: "#8a969b" }}>{step.body}</div>
              </div>
            </div>
          ))}
          <div style={{ display: "flex", gap: 20, padding: "20px 0" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#2a3236", width: 36, flexShrink: 0 }}>03</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#eef2f1", marginBottom: 6 }}>Clone it and run it locally</div>
              <div style={{ fontSize: 13, lineHeight: 1.6, color: "#8a969b" }}>
                <code style={codeTag}>git clone</code>, <code style={codeTag}>node start.js</code> — nothing else
                to install. A one-time GitHub sign-in confirms it&apos;s really you, then it runs on your machine,
                on your Claude login, for good.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PRICING */}
      <div id="pricing" style={{ maxWidth: 920, margin: "0 auto", padding: "clamp(48px,7vw,80px) clamp(20px,5vw,64px)", borderTop: "1px solid rgba(255,255,255,.08)" }}>
        <div
          style={{
            border: "1px solid rgba(110,231,160,.3)",
            borderRadius: 10,
            background: "linear-gradient(180deg,rgba(110,231,160,.06),rgba(110,231,160,0) 60%)",
            padding: "clamp(28px,5vw,44px)",
            display: "flex",
            flexWrap: "wrap",
            gap: 32,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: 12, color: "#6ee7a0", letterSpacing: ".04em", marginBottom: 10 }}>{"// one-time purchase"}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: "clamp(34px,5vw,48px)", fontWeight: 800, color: "#f2f5f4" }}>₹199</span>
              <span style={{ fontSize: 14, color: "#5c6b70" }}>/ lifetime access</span>
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.7, color: "#8a969b", maxWidth: 420 }}>
              Private GitHub repo access. <code style={codeTag}>git pull</code> anytime for updates. No subscription,
              no recurring charge.
            </div>

            {error ? (
              <div style={{ marginTop: 16, fontSize: 13, color: "#ffb454", maxWidth: 420 }}>
                {ERROR_MESSAGES[error] ?? "Something went wrong — please try again."}
              </div>
            ) : null}

            {githubUsername ? (
              <div style={{ marginTop: 16, fontSize: 13, color: "#8a969b" }}>
                Signed in as <strong style={{ color: "#eef2f1" }}>@{githubUsername}</strong>
              </div>
            ) : null}
          </div>

          {githubUsername ? (
            <form action="/api/create-payment-link" method="POST">
              <button
                type="submit"
                style={{
                  border: "none",
                  cursor: "pointer",
                  background: "#6ee7a0",
                  color: "#0a0d0e",
                  padding: "16px 32px",
                  borderRadius: 4,
                  fontWeight: 700,
                  fontSize: 15,
                  fontFamily: "inherit",
                  whiteSpace: "nowrap",
                }}
              >
                Pay with Razorpay →
              </button>
            </form>
          ) : (
            <a
              href="/api/auth/github/start"
              style={{
                textDecoration: "none",
                background: "#6ee7a0",
                color: "#0a0d0e",
                padding: "16px 32px",
                borderRadius: 4,
                fontWeight: 700,
                fontSize: 15,
                whiteSpace: "nowrap",
              }}
            >
              Connect GitHub to continue →
            </a>
          )}
        </div>
      </div>

      {/* FAQ */}
      <div id="faq" style={{ maxWidth: 920, margin: "0 auto", padding: "clamp(40px,6vw,64px) clamp(20px,5vw,64px)", borderTop: "1px solid rgba(255,255,255,.08)" }}>
        <div style={{ fontSize: 12, color: "#6ee7a0", marginBottom: 10, letterSpacing: ".04em" }}>{"// faq"}</div>
        <h2 style={{ fontSize: "clamp(22px,3vw,30px)", color: "#f2f5f4", margin: "0 0 28px", fontWeight: 700, letterSpacing: "-0.01em" }}>
          Questions worth answering upfront.
        </h2>
        <FaqAccordion />
      </div>

      {/* FOOTER */}
      <div
        style={{
          maxWidth: 920,
          margin: "0 auto",
          padding: "32px clamp(20px,5vw,64px) 48px",
          borderTop: "1px solid rgba(255,255,255,.08)",
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: 12, color: "#5c6b70" }}>dsa_vault$ — one-time purchase, private repo, forever yours.</div>
        <div style={{ fontSize: 12, color: "#5c6b70" }}>no refunds after repo access is granted</div>
      </div>
    </div>
  );
}
