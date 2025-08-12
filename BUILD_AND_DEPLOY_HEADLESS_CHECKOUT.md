# JVS Website — Build, Deploy, and Headless Checkout Guide

This document explains how to rebuild and deploy the site from scratch, how the headless checkout works with WooCommerce + Stripe on Cloudflare Workers, and how to diagnose and fix common issues.

## 1) Overview
- Platform: Next.js built with `npx @cloudflare/next-on-pages`, deployed to Cloudflare Pages/Workers.
- Custom Worker: `jvs-website/worker.js` handles routing, CORS, Stripe config, the headless `/api/checkout`, GraphQL proxy, contact/venue-hire, and delegates unhandled API routes to Next assets.
- Data/Secrets:
  - Cloudflare KV: `JVS_SECRETS` stores secrets.
  - Cloudflare D1: Magazine DB (not used by checkout).
- WooCommerce: WordPress backend at `https://backend.jvs.org.uk`.
- Stripe: Frontend uses Publishable Key; backend confirms PaymentIntent using Secret Key.

## 2) Prerequisites
- Node.js LTS (>= 18) and npm.
- Cloudflare Wrangler CLI (`npm i -g wrangler`).
- Access to Cloudflare account with permissions to deploy and to manage KV/D1.
- WooCommerce REST API keys (Read/Write) and Stripe live keys.

## 3) Environments
- Staging and Production are defined in `wrangler.toml`.
- Each env MUST have its own KV namespace bound as `JVS_SECRETS` to keep secrets isolated.

Confirm bindings (production excerpt):
- `JVS_SECRETS`: KV Namespace
- `DB`: D1 database (magazine)
- `ALLOWED_ORIGIN`: `https://jvs.org.uk`
- `WP_GRAPHQL_URL`: `https://backend.jvs.org.uk/graphql`
- `WP_API_URL`: `https://backend.jvs.org.uk/wp-json/wp...`

## 4) Secrets (KV) — required keys
Store in `JVS_SECRETS` for each env (staging, production):

- `STRIPE_PUBLISHABLE_KEY` — pk_live_… (frontend uses via `/api/stripe-config-v5`)
- `STRIPE_SECRET_KEY` — sk_live_… (worker uses to confirm PaymentIntent)
- `WC_CONSUMER_KEY` — WooCommerce REST API key (R/W)
- `WC_CONSUMER_SECRET` — WooCommerce REST API secret (R/W)
- `MAILGUN_API_KEY` — for contact/venue hire (EU region for Mailgun)

Set/get examples (production):
```bash
# Set
wrangler kv key put --env production --binding JVS_SECRETS STRIPE_SECRET_KEY "sk_live_..."
wrangler kv key put --env production --binding JVS_SECRETS STRIPE_PUBLISHABLE_KEY "pk_live_..."
wrangler kv key put --env production --binding JVS_SECRETS WC_CONSUMER_KEY "ck_..."
wrangler kv key put --env production --binding JVS_SECRETS WC_CONSUMER_SECRET "cs_..."
wrangler kv key put --env production --binding JVS_SECRETS MAILGUN_API_KEY "..."

# Verify
wrangler kv key get --env production --binding JVS_SECRETS STRIPE_SECRET_KEY | cat
```

Notes:
- KV updates are read at runtime by the worker; redeploy not required (allow up to ~60s POP propagation).

## 5) Build & Deploy
From `jvs-website/`:
```bash
# Build Next → worker assets
npx @cloudflare/next-on-pages

# Ensure the Next-on-Pages generated static worker is not used
rm -rf .vercel/output/static/_worker.js

# Deploy (staging or production)
wrangler deploy --env staging
# or
wrangler deploy --env production
```

After deploy, you’ll see the bindings list and a current version ID. The public site is at `https://jvs.org.uk`.

## 6) Headless checkout architecture
### Endpoints in the worker
- `/api/stripe-config-v5`
  - Returns `STRIPE_PUBLISHABLE_KEY` from KV.
  - CORS headers include `Authorization` in `Access-Control-Allow-Headers`.

- `/api/checkout` (headless path; early-guarded so it never passthroughs)
  - Input: form data including billing fields, Stripe PaymentMethod ID, product info, and optionally `tSel` (ticket selections).
  - Flow:
    1. Add-to-cart GET to WP to ensure a Woo session.
    2. Create WooCommerce order via REST API: `POST /wp-json/wc/v3/orders` using both query-string auth (consumer_key/consumer_secret) AND Basic auth header. Includes billing and line items. If `tSel` is provided, selections are stored in order meta.
    3. Compute amount from `tSel` if present (front-end and worker both decode and parse `tSel`, including double-encoding cases) using per-ticket unit prices; fallback to Woo `order.total` when `tSel` absent.
    4. Create + confirm Stripe PaymentIntent using `STRIPE_SECRET_KEY` and the provided PaymentMethod.
       - On SCA: returns `{ requires_action: true, client_secret }` (frontend completes 3DS and re-submits if needed).
       - On success: updates Woo order status to `processing` and returns `{ redirect: "/checkout/success" }`.

- Global CORS
  - Worker replies to `OPTIONS` for all `/api/*` with permissive CORS.
  - GraphQL proxy and other endpoints ensure `Authorization` is allowed.

### Tickets page → checkout
- Tickets page collects per-type selections and redirects to `/checkout?eventId=...&tSel=[...]`.
- Checkout page parses `tSel` robustly and includes it in POST to `/api/checkout`.
- UI reflects per-ticket breakdown and total computed from `tSel` (e.g., Supporter £25, Regular £20, Child £14). Example: one Regular + one Child → £34.

#### tSel transport and decoding
- On tickets page: `const tSel = encodeURIComponent(JSON.stringify(selection))` appended to the checkout URL.
- On checkout page: try `decodeURIComponent(tSel)` then `JSON.parse`; fallback to parsing raw if already decoded. Ignore if not an array.
- On worker: apply the same double-decoding tolerant logic before computing the Stripe amount and storing order meta `jvs_ticket_selections`.

### GraphQL proxy session bridging (Blaze-style)
- `/api/graphql-v5` forwards `woocommerce-session` header to WP GraphQL and persists `woo-session` cookie from responses, keeping the frontend session in sync.

## 7) Recovering from regressions
Use this checklist in order:

1) KV bindings exist for the environment (production/staging) in `wrangler.toml`, especially `JVS_SECRETS`.
2) Required KV keys are set:
   - `STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `WC_CONSUMER_KEY`, `WC_CONSUMER_SECRET`, `MAILGUN_API_KEY`.
3) Deploy from `jvs-website/` only, never from repo root.
4) Verify routing:
   - `/api/checkout` is handled by early-guard (worker logs show `Early route: Handling Checkout API via worker`).
   - Passthrough never intercepts `/api/checkout`.
5) Verify Stripe keys match the account used to create the PaymentMethod (ownership check is implemented).
6) Verify Woo REST works:
   - We authenticate with both query-string credentials and Basic headers, plus UA/Origin/Referer.
   - 403s typically indicate missing/incorrect keys, domain restrictions, or server-side WAF blocking — confirm keys and allowlist the worker’s calls on the WP host if needed.
7) Nonces/sessions (if using wc-ajax):
   - We avoid Woo AJAX for final order creation to reduce nonce/session flakiness; the REST path is primary.

## 8) Troubleshooting quick reference
- "TypeError: Cannot read properties of undefined (reading 'fetch')" with passthrough
  - Cause: `env.ASSETS.fetch` missing when falling through.
  - Fix: Early-guard `/api/checkout` and safety-check inside `/api/*` passthrough; return 502 JSON if assets unavailable.

- CORS/Preflight 404s
  - Ensure the global `OPTIONS` handler covers `/api/*` and GraphQL success responses include `Authorization` in `Access-Control-Allow-Headers`.

- Stripe account mismatch
  - Server checks PaymentMethod ownership. Ensure frontend `pk_` and backend `sk_` belong to the same Stripe account.

- Woo 403 creating orders
  - Ensure `WC_CONSUMER_KEY`/`WC_CONSUMER_SECRET` are R/W.
  - We now send both query-string credentials and Basic auth headers; also include UA/Origin/Referer.
  - If still blocked, check host WAF or REST permission scopes.

- "Session expired" from Woo / nonces missing
  - We no longer rely on Woo AJAX for finalisation. REST path avoids nonce timing.

- Incorrect total when mixing ticket types (e.g., adult + child)
  - Ensure `tSel` is present on the checkout URL; the checkout page will render a per-ticket breakdown and compute the total from `tSel`.
  - The worker will compute Stripe `amount` from `tSel` if present; otherwise falls back to `order.total`.
  - If totals look wrong, inspect the URL param and worker logs to confirm `tSel` was decoded and parsed; look for `metadata[ticket_selections]` on the PaymentIntent if needed.

- KV changes not taking effect
  - KV is read at runtime; propagation across POPs can take ~60s. No redeploy needed.

## 9) From-scratch setup (clean machine)
```bash
# 1. Clone
git clone https://github.com/caliginous/jvs-website.git
cd jvs-website

# 2. Install wrangler
npm i -g wrangler
wrangler login

# 3. Ensure KV namespace bindings exist in wrangler.toml for staging/prod (JVS_SECRETS)
#    If not, create namespace in Cloudflare dashboard and paste IDs into wrangler.toml.

# 4. Set required KV keys for each env (see Section 4)
wrangler kv key put --env production --binding JVS_SECRETS STRIPE_SECRET_KEY "sk_live_..."
wrangler kv key put --env production --binding JVS_SECRETS STRIPE_PUBLISHABLE_KEY "pk_live_..."
wrangler kv key put --env production --binding JVS_SECRETS WC_CONSUMER_KEY "ck_..."
wrangler kv key put --env production --binding JVS_SECRETS WC_CONSUMER_SECRET "cs_..."
wrangler kv key put --env production --binding JVS_SECRETS MAILGUN_API_KEY "..."

# 5. Build
npx @cloudflare/next-on-pages
rm -rf .vercel/output/static/_worker.js

# 6. Deploy
wrangler deploy --env production

# 7. Verify
# Logs (one-off or tail)
wrangler tail --env production --format pretty

# Test endpoints
curl -i https://jvs.org.uk/api/stripe-config-v5
# Use browser to add tickets → /checkout → submit
```

## 10) Operational notes
- Do not commit `.wrangler/` into git (already in `.gitignore`).
- Changing bindings in `wrangler.toml` requires a deploy to apply; changing KV values does not.
- Keep separate KV namespaces for staging and production to avoid cross-env leakage.
- If you must re-enable Woo AJAX for debugging, do so temporarily; the REST+Stripe approach is the stable default.
- After deployments that change CSS or checkout markup, hard-refresh or invalidate CDN cache if the UI appears stale. The button uses global classes `bg-deep-green` + `text-white` (from `src/app/globals.css`) and shows a spinner with text "Processing Payment…" when disabled.

## 11) Contact and venue hire (Mailgun EU)
- `src/lib/email.ts` reads `MAILGUN_API_KEY` from KV (preferred) or `process.env` fallback for local dev.
- API routes pass `env` to the mailer so Workers can access KV.

## 12) Change log highlights (recent)
- Early guard + safety in `/api/*` passthrough prevents Next.js assets calls from intercepting `/api/checkout`.
- Headless `/api/checkout` revisited to exclusively use Woo REST + Stripe.
- Woo REST auth hardened (query-string + Basic; UA/Origin/Referer added) to bypass 403 on some hosts.
- GraphQL proxy and client adjusted to forward/persist `woocommerce-session` (Blaze pattern).
- Global CORS consolidated; headers include `Authorization` on success.
- tSel handling hardened end-to-end (tickets page → checkout page → worker) with double-decoding tolerance; frontend shows per-ticket breakdown; backend computes Stripe amount from `tSel`.
- Checkout pay button styling fixed to avoid white-on-white: uses `bg-deep-green text-white` with hover `bg-primary-green`, disabled state opacity, and spinner.

---
If you encounter a regression not covered here, tail production logs, reproduce, and use the exact error text to drive the fix. This guide should make rebuilds and recoveries fast and deterministic.
