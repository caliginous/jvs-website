===============================================================================
JEWISHVEGV2 — CLOUDFLARE WORKERS + D1 + NEXT.JS IMPLEMENTATION GUIDE (ASCII)
===============================================================================
Last updated: 2025-08-07T21:46:58.442482Z

SCOPE
-----
This package implements:
- Ingest from Sanity + WordPress (WPGraphQL cron) -> Cloudflare Queues
- Queue consumer -> D1 normalized schema (canonical JSON + sanitized HTML)
- Next.js (next-on-pages) Edge Routes reading D1 to render dynamic HTML
- KV micro-cache for hot pages (TTL 30–60s)
- Global read replicas for public; primary for preview/admin
- R2 mirroring for media (Decision #17)

NON-NEGOTIABLE FUNCTIONAL REQUIREMENTS (MUST RETAIN)
---------------------------------------------------
The migration MUST keep all existing site features fully working:
- Articles: listing page(s) + individual articles
- Recipes: listing page(s) + individual recipes
- Events: listing page(s) + individual events
- Tickets & checkout flows
- Magazine archive and reading pages
- Mailchimp integration
- Mailgun integration (transactional/marketing emails)
- Tailwind-based design and styling
- Current branding and layouts
- Any other existing functionality not explicitly listed above

NAMING CONVENTION (CLOUDFLARE RESOURCES)
----------------------------------------
All resources MUST follow:
  JewishVegV2-Production-<Component>
  JewishVegV2-Staging-<Component>
  JewishVegV2-Dev-<Component>

Examples:
  JewishVegV2-Production-DB
  JewishVegV2-Staging-INGEST-Worker
  JewishVegV2-Dev-FRAGMENT_CACHE
  JewishVegV2-Production-ContentQueue
  JewishVegV2-Production-MediaBucket (R2)

HOW TO DO IT RIGHT — GUARDRAILS
-------------------------------
1) One router in charge of HTML:
   - Next-on-Pages owns ALL public HTML routes.
   - Ingest/cron/queue workers use separate subdomains (e.g., hooks.jvs.org.uk) or strict path prefixes.
2) Declare dynamic intent per route:
   - In Next Edge Route/handler: export const runtime = 'edge'
   - For truly dynamic pages: export const dynamic = 'force-dynamic'
3) Preview/admin freshness:
   - Use D1 Sessions: env.DB.withSession('first-primary')
4) Public reads = replicas:
   - Default session: env.DB.withSession() (unconstrained)
5) Explicit caching headers:
   - Dynamic responses: cache-control: no-store (or tight max-age)
   - KV micro-cache: TTL 30–60s; BYPASS on preview/admin
6) Do NOT call env.ASSETS.fetch() unless assets are bound and intended.
7) No catch-all custom Worker overlapping Next routes.
8) Separate per-env bindings in wrangler; never reuse production IDs elsewhere.
9) Sanitization:
   - Store canonical JSON (raw) + sanitized HTML for render.
10) Deletes:
   - Soft delete (deleted_at), periodic purge after 30 days.

DEPLOY ORDER (ALWAYS)
---------------------
1) D1 schema/migrations
2) Queue consumer
3) Ingest workers (Sanity webhook endpoint, WP cron)
4) Next.js renderer

FRESHNESS SLO
-------------
< 60 seconds from source update to live public page.

OBSERVABILITY
-------------
- Monitor Queues DLQ (>0 items = alert)
- Track Workers exceptions and latency
- Track D1 error rates and slow queries

See /tests/CHECKLIST.txt for verification steps.