import { NextResponse } from "next/server"
import { randomBytes } from "node:crypto"
import { OAUTH_STATE_COOKIE } from "@/lib/auth-cookie"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID

  if (!clientId) {
    return NextResponse.json({ error: "GITHUB_OAUTH_CLIENT_ID is not configured." }, { status: 500 })
  }

  const state = randomBytes(16).toString("hex")
  // Pinned to one canonical domain (must exactly match the GitHub OAuth App's registered
  // callback URL) rather than derived per-request — dsa-vault.shop and www.dsa-vault.shop
  // both resolve to this site, but GitHub requires an exact string match.
  const origin = process.env.SITE_URL ?? new URL(request.url).origin
  const redirectUri = `${origin}/api/auth/github/callback`

  const authorizeUrl = new URL("https://github.com/login/oauth/authorize")
  authorizeUrl.searchParams.set("client_id", clientId)
  authorizeUrl.searchParams.set("redirect_uri", redirectUri)
  authorizeUrl.searchParams.set("scope", "read:user")
  authorizeUrl.searchParams.set("state", state)

  const response = NextResponse.redirect(authorizeUrl)

  response.cookies.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10,
  })

  return response
}
