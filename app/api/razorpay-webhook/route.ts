import { NextResponse } from "next/server"
import { createHmac, timingSafeEqual } from "node:crypto"
import { GITHUB_USERNAME_RE, inviteCollaborator } from "@/lib/github-invite"

export const runtime = "nodejs"

function isValidSignature(rawBody: string, signatureHeader: string | null, secret: string) {
  if (!signatureHeader) {
    return false
  }

  const expected = createHmac("sha256", secret).update(rawBody).digest("hex")
  const expectedBuffer = Buffer.from(expected)
  const receivedBuffer = Buffer.from(signatureHeader)

  return expectedBuffer.length === receivedBuffer.length && timingSafeEqual(expectedBuffer, receivedBuffer)
}

type RazorpayNotes = { github_username?: unknown } | null | undefined

export async function POST(request: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET

  if (!secret) {
    console.error("RAZORPAY_WEBHOOK_SECRET is not configured.")
    return NextResponse.json({ error: "Webhook not configured." }, { status: 500 })
  }

  const rawBody = await request.text()
  const signatureHeader = request.headers.get("x-razorpay-signature")

  if (!isValidSignature(rawBody, signatureHeader, secret)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 })
  }

  let body: {
    event?: string
    payload?: {
      payment_link?: { entity?: { notes?: RazorpayNotes } }
      payment?: { entity?: { notes?: RazorpayNotes } }
    }
  }

  try {
    body = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 })
  }

  if (body.event !== "payment_link.paid") {
    // Not an event we care about — acknowledge so Razorpay doesn't retry.
    return NextResponse.json({ ok: true, ignored: true })
  }

  const githubUsername =
    body.payload?.payment_link?.entity?.notes?.github_username ?? body.payload?.payment?.entity?.notes?.github_username

  if (typeof githubUsername !== "string" || !GITHUB_USERNAME_RE.test(githubUsername)) {
    console.error("payment_link.paid webhook missing/invalid github_username in notes:", githubUsername)
    return NextResponse.json({ ok: true, skipped: "invalid_username" })
  }

  await inviteCollaborator(githubUsername)

  return NextResponse.json({ ok: true })
}
