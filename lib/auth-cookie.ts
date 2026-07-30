import { createHmac, timingSafeEqual } from "node:crypto"

export const GITHUB_AUTH_COOKIE = "dsa_vault_github_user"
export const OAUTH_STATE_COOKIE = "dsa_vault_oauth_state"

function getSecret() {
  const secret = process.env.AUTH_COOKIE_SECRET

  if (!secret) {
    throw new Error("AUTH_COOKIE_SECRET is not set")
  }

  return secret
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("hex")
}

/** value.signature — verified on read so the cookie can't be forged client-side. */
export function signCookieValue(value: string) {
  return `${value}.${sign(value)}`
}

export function verifyCookieValue(signed: string | undefined): string | null {
  if (!signed) {
    return null
  }

  const separatorIndex = signed.lastIndexOf(".")

  if (separatorIndex === -1) {
    return null
  }

  const value = signed.slice(0, separatorIndex)
  const signature = signed.slice(separatorIndex + 1)
  const expected = sign(value)

  const signatureBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expected)

  if (signatureBuffer.length !== expectedBuffer.length || !timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return null
  }

  return value
}
