"use client";

import { useEffect } from "react";
import { UTM_COOKIE_NAME, UTM_KEYS } from "@/lib/utm";

// First-touch attribution: only writes the cookie if one isn't already set,
// so a later organic visit doesn't overwrite the ad click that actually brought
// the visitor here. 30-day window covers the GitHub OAuth + Razorpay round trip.
export function UtmCapture() {
  useEffect(() => {
    const alreadySet = document.cookie.split("; ").some((c) => c.startsWith(`${UTM_COOKIE_NAME}=`));
    if (alreadySet) return;

    const params = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    for (const key of UTM_KEYS) {
      const value = params.get(key);
      if (value) utm[key] = value;
    }
    if (Object.keys(utm).length === 0) return;

    const maxAge = 60 * 60 * 24 * 30;
    document.cookie = `${UTM_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(utm))}; path=/; max-age=${maxAge}; SameSite=Lax`;
  }, []);

  return null;
}
