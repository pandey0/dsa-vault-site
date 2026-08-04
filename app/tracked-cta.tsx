"use client";

import { track } from "@vercel/analytics";
import type { CSSProperties, ReactNode } from "react";
import { UTM_COOKIE_NAME, parseUtmCookie } from "@/lib/utm";

function readUtmCookie(): Record<string, string> {
  const match = document.cookie.split("; ").find((c) => c.startsWith(`${UTM_COOKIE_NAME}=`));
  if (!match) return {};
  return parseUtmCookie(decodeURIComponent(match.slice(match.indexOf("=") + 1)));
}

export function TrackedLink({
  href,
  event,
  style,
  children,
}: {
  href: string;
  event: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <a href={href} style={style} onClick={() => track(event, readUtmCookie())}>
      {children}
    </a>
  );
}

export function TrackedSubmitButton({
  event,
  style,
  children,
}: {
  event: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <button type="submit" style={style} onClick={() => track(event, readUtmCookie())}>
      {children}
    </button>
  );
}
