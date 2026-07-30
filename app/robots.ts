import type { MetadataRoute } from "next"

const SITE_URL = "https://dsa-vault.shop"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/api/",
      },
      // Explicitly allowed rather than left to the default -- these are the crawlers behind
      // AI answer engines / agentic browsing tools, the actual audience this file is for.
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-Web",
          "anthropic-ai",
          "PerplexityBot",
          "Google-Extended",
          "CCBot",
          "Applebot-Extended",
        ],
        allow: "/",
        disallow: "/api/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
