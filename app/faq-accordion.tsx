"use client";

import { useState } from "react";

const FAQ_ITEMS = [
  {
    q: "Do I need an API key or Claude credits?",
    a: "No. Everything runs through your existing `claude` CLI login (Pro, Max, or Code). This repo never talks to the Anthropic API directly and never adds usage of its own.",
  },
  {
    q: "Is this a subscription?",
    a: "No — one-time payment. You get permanent collaborator access to the private repo and can `git pull` for updates whenever they ship.",
  },
  {
    q: "What if I don't have Claude Code set up?",
    a: "Then this isn't the right fit yet. You need a Claude subscription you can run non-interactively from a terminal — set that up first.",
  },
  {
    q: "Can I use a language other than Java for practice?",
    a: "Yes. The base solutions are Java, but the conversion feature ports any solution into the language you actually interview in.",
  },
  {
    q: "Can I share this with a friend?",
    a: "No — it's licensed to your GitHub account specifically. The app checks live that you're still a collaborator before it'll run, so it won't work under someone else's account.",
  },
  {
    q: "Refunds?",
    a: "No refunds once GitHub access has been granted — it's a digital product, delivered and usable immediately.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {FAQ_ITEMS.map((item, i) => {
        const isOpen = openIndex === i;

        return (
          <div key={item.q} style={{ borderTop: "1px solid rgba(255,255,255,.08)" }}>
            <div
              onClick={() => setOpenIndex((current) => (current === i ? -1 : i))}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "18px 0",
                cursor: "pointer",
                gap: 16,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 600, color: "#eef2f1" }}>{item.q}</div>
              <div style={{ fontSize: 16, color: "#6ee7a0", flexShrink: 0 }}>{isOpen ? "−" : "+"}</div>
            </div>
            {isOpen ? (
              <div style={{ fontSize: 13, lineHeight: 1.7, color: "#8a969b", padding: "0 0 20px", maxWidth: 640 }}>
                {item.a}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
