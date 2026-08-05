import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { GITHUB_AUTH_COOKIE, OAUTH_STATE_COOKIE, signCookieValue } from "@/lib/auth-cookie"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const state = searchParams.get("state")

  const cookieStore = await cookies()
  const expectedState = cookieStore.get(OAUTH_STATE_COOKIE)?.value
  // Single-use: clear it now, on every path, instead of only on success — it's already been
  // read into `expectedState`, so there's nothing left that needs it to stick around.
  cookieStore.delete(OAUTH_STATE_COOKIE)

  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(`${origin}/?error=oauth_state_mismatch#pricing`)
  }

  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: "GitHub OAuth is not configured." }, { status: 500 })
  }

  try {
    // Must exactly match the redirect_uri sent to /authorize (and the OAuth App's registered
    // callback URL) — pinned the same way as in the start route, not derived from this request's
    // origin, since dsa-vault.shop and www.dsa-vault.shop both resolve here but only one is registered.
    const canonicalOrigin = process.env.SITE_URL ?? origin

    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: `${canonicalOrigin}/api/auth/github/callback`,
      }),
    })

    const tokenData = await tokenRes.json()

    if (!tokenData.access_token) {
      return NextResponse.redirect(`${origin}/?error=oauth_token_exchange_failed#pricing`)
    }

    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "dsa-vault-site",
      },
    })

    const userData = await userRes.json()

    if (!userRes.ok || typeof userData.login !== "string") {
      return NextResponse.redirect(`${origin}/?error=oauth_user_fetch_failed#pricing`)
    }

    const response = NextResponse.redirect(`${origin}/#pricing`)

    response.cookies.set(GITHUB_AUTH_COOKIE, signCookieValue(userData.login), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    })

    return response
  } catch {
    return NextResponse.redirect(`${origin}/?error=oauth_unexpected_error#pricing`)
  }
}
