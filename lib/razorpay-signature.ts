import { createHmac, timingSafeEqual } from "node:crypto"

/**
 * Verifies the `razorpay_signature` sent on a Payment Link's callback_url redirect.
 * Formula confirmed from Razorpay's official Node SDK (validatePaymentVerification in
 * razorpay-utils.js): HMAC-SHA256 of `paymentLinkId|referenceId|status|paymentId` keyed by
 * the account's key_secret (NOT the separate webhook secret).
 */
export function verifyPaymentLinkSignature(params: {
  paymentLinkId: string
  referenceId: string
  status: string
  paymentId: string
  signature: string
  keySecret: string
}) {
  const payload = `${params.paymentLinkId}|${params.referenceId}|${params.status}|${params.paymentId}`
  const expected = createHmac("sha256", params.keySecret).update(payload).digest("hex")

  const expectedBuffer = Buffer.from(expected)
  const receivedBuffer = Buffer.from(params.signature)

  return expectedBuffer.length === receivedBuffer.length && timingSafeEqual(expectedBuffer, receivedBuffer)
}
