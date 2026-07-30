import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { GITHUB_AUTH_COOKIE, verifyCookieValue } from "@/lib/auth-cookie"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const { origin } = new URL(request.url)
  const cookieStore = await cookies()
  const githubUsername = verifyCookieValue(cookieStore.get(GITHUB_AUTH_COOKIE)?.value)

  if (!githubUsername) {
    return NextResponse.redirect(`${origin}/?error=not_signed_in`)
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
      return NextResponse.redirect(`${origin}/?error=payment_link_failed`)
    }

    return NextResponse.redirect(data.short_url as string)
  } catch (err) {
    console.error("Razorpay payment link creation error:", err)
    return NextResponse.redirect(`${origin}/?error=payment_link_failed`)
  }
}
