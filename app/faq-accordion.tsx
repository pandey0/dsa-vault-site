"use client";

import { useState } from "react";
import { FAQ_ITEMS } from "./faq-data";

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
            {/* Always rendered (not conditionally mounted) so every answer exists in the
                server-rendered HTML for crawlers that don't execute JS -- visibility is purely
                a CSS toggle here, the content itself is never removed from the DOM. */}
            <div
              style={{
                fontSize: 13,
                lineHeight: 1.7,
                color: "#8a969b",
                maxWidth: 640,
                display: isOpen ? "block" : "none",
                padding: isOpen ? "0 0 20px" : 0,
              }}
            >
              {item.a}
            </div>
          </div>
        );
      })}
    </div>
  );
}
