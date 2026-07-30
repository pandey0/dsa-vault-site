import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { GITHUB_AUTH_COOKIE, verifyCookieValue } from "@/lib/auth-cookie"

export const runtime = "nodejs"

// POST only (not GET): creating a payment link is a state-changing action tied to the
// signed-in user. A plain GET link would be triggerable cross-site (SameSite=Lax cookies
// still ride along on top-level cross-origin GET navigation) — POST is not, since Lax
// cookies are withheld on cross-site POSTs, so a form/link on another site can't trigger
// this on a signed-in visitor's behalf.
export async function POST(request: Request) {
  const { origin } = new URL(request.url)
  const cookieStore = await cookies()
  const githubUsername = verifyCookieValue(cookieStore.get(GITHUB_AUTH_COOKIE)?.value)

  if (!githubUsername) {
    return NextResponse.redirect(`${origin}/?error=not_signed_in`, 303)
  }

  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  const amount = process.env.RAZORPAY_AMOUNT_PAISE

  if (!keyId || !keySecret || !amount) {
    return NextResponse.json({ error: "Razorpay is not configured." }, { status: 500 })
  }

  try {
    const res = await fetch("https://api.razorpay.com/v1/payment_links/", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Number(amount),
        currency: "INR",
        description: "DSA Vault — lifetime access",
        reference_id: `${githubUsername}-${Date.now()}`,
        notes: {
          github_username: githubUsername,
        },
        callback_url: `${origin}/thank-you`,
        callback_method: "get",
        notify: { sms: false, email: true },
      }),
    })

    const data = await res.json()

    if (!res.ok || !data.short_url) {
      console.error("Razorpay payment link creation failed:", data)
      return NextResponse.redirect(`${origin}/?error=payment_link_failed`, 303)
    }

    // 303 forces the browser to follow with GET — Razorpay's checkout page (and our own
    // page routes) only handle GET, and the default redirect status (307) would incorrectly
    // preserve this request's POST method on the follow-up request.
    return NextResponse.redirect(data.short_url as string, 303)
  } catch (err) {
    console.error("Razorpay payment link creation error:", err)
    return NextResponse.redirect(`${origin}/?error=payment_link_failed`, 303)
  }
}
