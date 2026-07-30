# DSA Vault — marketing site + checkout

Storefront for [dsa-vault-pro](https://github.com/pandey0/dsa-vault-pro): landing page, "Connect GitHub" sign-in, a Razorpay Payment Link checkout, and a webhook that automatically invites the buyer as a collaborator on [dsa-vault-pro-build](https://github.com/pandey0/dsa-vault-pro-build) — a separate, build-output-only repo, not the app's real source — no manual per-sale fulfillment.

## How it works

1. Buyer clicks **Connect GitHub** → `/api/auth/github/start` → GitHub OAuth → `/api/auth/github/callback` verifies it and stores the verified username in a signed, httpOnly cookie. No password/email form — the username is real, not typed in.
2. Buyer clicks **Buy Now** → `GET /api/create-payment-link` reads that cookie, calls the Razorpay API to create a Payment Link with `notes: { github_username }`, and redirects to it.
3. Buyer pays on Razorpay's hosted page. Razorpay redirects them back to `/thank-you` (UX only — not the fulfillment trigger).
4. Razorpay sends a `payment_link.paid` webhook to `/api/razorpay-webhook`. After verifying the signature, it reads `github_username` back out of the payment's `notes` and calls the GitHub API to add that user as a **read-only** collaborator on `pandey0/dsa-vault-pro-build` — a separate repo that only ever contains a compiled build (published by a GitHub Action in the real `dsa-vault-pro` source repo on each tagged release), never the app's actual source or git history.
5. Buyer gets a GitHub invite email, accepts it, follows the build repo's own README (`node server.js`, no `npm install`) to get running.

## Environment variables

| Variable | Purpose |
|---|---|
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Razorpay API credentials (dashboard → Settings → API Keys), used to create Payment Links |
| `RAZORPAY_AMOUNT_PAISE` | Price in paise (e.g. `99900` = ₹999) |
| `RAZORPAY_WEBHOOK_SECRET` | Set when you configure the webhook in the Razorpay dashboard — used to verify `X-Razorpay-Signature` |
| `GITHUB_TOKEN` | A **fine-grained PAT** scoped only to `dsa-vault-pro-build` (the build-output repo, not the real source repo), with repository "Administration: write" permission (needed to add collaborators). Separate from the OAuth credentials below, and separate from the `BUILD_REPO_TOKEN` secret used by `dsa-vault-pro`'s own CI to push builds. |
| `GITHUB_OAUTH_CLIENT_ID` / `GITHUB_OAUTH_CLIENT_SECRET` | From a GitHub OAuth App (Developer Settings → OAuth Apps) — powers the "Connect GitHub" sign-in, unrelated to `GITHUB_TOKEN` |
| `AUTH_COOKIE_SECRET` | Any random string (e.g. `openssl rand -hex 32`) — signs the post-login cookie so it can't be forged |

## One-time setup checklist

1. **GitHub OAuth App**: Developer Settings → OAuth Apps → New OAuth App. Set "Authorization callback URL" to `https://<your-domain>/api/auth/github/callback`. Copy the Client ID and generate a Client Secret.
2. **GitHub PAT**: Settings → Developer settings → Fine-grained tokens → New token. Resource owner: `pandey0`. Repository access: only `dsa-vault-pro-build`. Permissions: Administration → Read and write.
3. **Razorpay**: create the account (KYC required), grab API keys from Settings → API Keys.
4. **Deploy** (e.g. Vercel), set all env vars above in the project settings.
5. **Razorpay webhook**: Settings → Webhooks → Add New Webhook. URL: `https://<your-domain>/api/razorpay-webhook`. Active event: `payment_link.paid`. Set a secret and put the same value in `RAZORPAY_WEBHOOK_SECRET`.
6. Test with a real (or Razorpay test-mode) purchase — confirm the collaborator invite lands on `dsa-vault-pro-build`.

## Local development

```bash
npm install
npm run dev
```

Set the env vars above in `.env.local` for full functionality. Without `RAZORPAY_KEY_ID`/`SECRET` the Buy button will fail gracefully (redirects back with an error) but the landing page and GitHub sign-in still work.

A pre-commit hook (`.husky/pre-commit`, via `npm run lint && npm run build`) runs automatically on every commit — a broken build/lint never lands in history.

## Notes on fulfillment

The webhook, not the `/thank-you` redirect, is the source of truth for granting access — Razorpay's `callback_url` redirect happens in the buyer's browser and could be spoofed or dropped, while the webhook is a signed, server-to-server call. Never wire the actual invite to the callback page.
