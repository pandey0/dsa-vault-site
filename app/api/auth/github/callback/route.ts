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

  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(`${origin}/?error=oauth_state_mismatch`)
  }

  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: "GitHub OAuth is not configured." }, { status: 500 })
  }

  try {
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: `${origin}/api/auth/github/callback`,
      }),
    })

    const tokenData = await tokenRes.json()

    if (!tokenData.access_token) {
      return NextResponse.redirect(`${origin}/?error=oauth_token_exchange_failed`)
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
      return NextResponse.redirect(`${origin}/?error=oauth_user_fetch_failed`)
    }

    const response = NextResponse.redirect(`${origin}/`)

    response.cookies.set(GITHUB_AUTH_COOKIE, signCookieValue(userData.login), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    })
    response.cookies.delete(OAUTH_STATE_COOKIE)

    return response
  } catch {
    return NextResponse.redirect(`${origin}/?error=oauth_unexpected_error`)
  }
}
