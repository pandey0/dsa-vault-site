export const UTM_COOKIE_NAME = "dsa_utm";
export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign"] as const;

export function parseUtmCookie(raw: string | undefined | null): Record<string, string> {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}
