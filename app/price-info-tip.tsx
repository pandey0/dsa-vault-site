"use client";

import { useEffect, useRef, useState } from "react";

export function PriceInfoTip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  // Tap-outside-to-close: native `title` tooltips don't fire on tap on mobile,
  // so this needs real open/close state instead.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <span ref={ref} style={{ position: "relative", display: "inline-flex" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Pricing details"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 18,
          height: 18,
          borderRadius: "50%",
          border: "1px solid #5c6b70",
          background: "transparent",
          color: "#5c6b70",
          fontSize: 11,
          fontWeight: 700,
          cursor: "pointer",
          padding: 0,
          fontFamily: "inherit",
        }}
      >
        i
      </button>
      {open ? (
        <span
          role="tooltip"
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: 0,
            zIndex: 20,
            width: 240,
            fontSize: 12,
            lineHeight: 1.6,
            fontWeight: 400,
            color: "#d8dee2",
            background: "#141a1c",
            border: "1px solid rgba(255,255,255,.14)",
            borderRadius: 6,
            padding: "10px 12px",
            boxShadow: "0 8px 24px rgba(0,0,0,.4)",
          }}
        >
          {text}
        </span>
      ) : null}
    </span>
  );
}
