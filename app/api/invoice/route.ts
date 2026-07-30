import { NextResponse } from "next/server"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { verifyPaymentLinkSignature } from "@/lib/razorpay-signature"

export const runtime = "nodejs"

type RazorpayPayment = {
  id: string
  amount: number
  currency: string
  status: string
  method?: string
  description?: string
  email?: string
  contact?: string
  created_at: number
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const paymentId = searchParams.get("razorpay_payment_id")
  const paymentLinkId = searchParams.get("razorpay_payment_link_id")
  const referenceId = searchParams.get("razorpay_payment_link_reference_id")
  const status = searchParams.get("razorpay_payment_link_status")
  const signature = searchParams.get("razorpay_signature")

  if (!paymentId || !paymentLinkId || !referenceId || !status || !signature) {
    return NextResponse.json({ error: "Missing required parameters." }, { status: 400 })
  }

  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  if (!keyId || !keySecret) {
    return NextResponse.json({ error: "Razorpay is not configured." }, { status: 500 })
  }

  const validSignature = verifyPaymentLinkSignature({
    paymentLinkId,
    referenceId,
    status,
    paymentId,
    signature,
    keySecret,
  })

  if (!validSignature) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 })
  }

  // Never trust amount/status from query params for display — re-fetch the authoritative
  // record directly from Razorpay using our own server-side credentials.
  const paymentRes = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}`, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
    },
  })

  if (!paymentRes.ok) {
    return NextResponse.json({ error: "Could not verify payment with Razorpay." }, { status: 502 })
  }

  const payment = (await paymentRes.json()) as RazorpayPayment

  const pdfBytes = await buildReceiptPdf(payment)

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="dsa-vault-receipt-${payment.id}.pdf"`,
    },
  })
}

async function buildReceiptPdf(payment: RazorpayPayment) {
  const doc = await PDFDocument.create()
  const page = doc.addPage([420, 560])
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const bold = await doc.embedFont(StandardFonts.HelveticaBold)

  const black = rgb(0.05, 0.05, 0.05)
  const gray = rgb(0.4, 0.44, 0.46)
  const accent = rgb(0.24, 0.75, 0.55)

  let y = 500

  const draw = (text: string, options: { size?: number; f?: typeof font; color?: typeof black; x?: number } = {}) => {
    page.drawText(text, {
      x: options.x ?? 40,
      y,
      size: options.size ?? 11,
      font: options.f ?? font,
      color: options.color ?? black,
    })
  }

  draw("DSA Vault", { size: 20, f: bold, color: accent })
  y -= 22
  draw("Payment Receipt", { size: 12, color: gray })
  y -= 40

  const amount = (payment.amount / 100).toFixed(2)
  const date = new Date(payment.created_at * 1000).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  })

  const rows: Array<[string, string]> = [
    ["Amount", `${payment.currency} ${amount}`],
    ["Status", payment.status],
    ["Payment ID", payment.id],
    ["Date", date],
    ["Description", "DSA Vault — lifetime access"],
    ["Method", payment.method ?? "-"],
    ["Email", payment.email ?? "-"],
  ]

  for (const [label, value] of rows) {
    draw(label, { size: 10, color: gray })
    draw(value, { size: 11, f: bold, x: 160 })
    y -= 28
  }

  y -= 20
  draw("This is a payment receipt, not a GST tax invoice.", { size: 9, color: gray })

  return doc.save()
}
