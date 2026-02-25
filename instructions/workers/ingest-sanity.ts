// workers/ingest-sanity.ts
// JewishVegV2 — Sanity webhook -> Queue
export interface Env {
  DB: D1Database;
  INGEST_QUEUE: Queue;
  SANITY_WEBHOOK_SECRET: string; // `wrangler secret put`
}

function verifySanitySignature(secret: string, req: Request, body: string): boolean {
  // TODO: implement HMAC verification per Sanity docs
  return !!secret && !!body;
}

export default {
  async fetch(req: Request, env: Env) {
    const url = new URL(req.url);
    if (url.pathname !== "/webhooks/sanity") return new Response("Not found", { status: 404 });

    const text = await req.text();
    if (!verifySanitySignature(env.SANITY_WEBHOOK_SECRET, req, text)) {
      return new Response("unauthorized", { status: 401 });
    }
    const payload = JSON.parse(text);

    const doc = payload?.transition?.to || payload?.after || payload?.document || payload;
    if (!doc || !doc._id) return new Response("bad request", { status: 400 });

    const msg = {
      source: "sanity",
      source_id: String(doc._id),
      type: String(doc._type || "article"),
      slug: String(doc.slug?.current || doc._id),
      title: String(doc.title || "(untitled)"),
      body_json: JSON.stringify(doc),
      body_html: "<div><!-- TODO: render from portable text --></div>",
      summary: doc.excerpt || null,
      updated_at: doc._updatedAt || new Date().toISOString(),
      published_at: doc._createdAt || null,
      deleted: !!doc._deleted
    };

    await env.INGEST_QUEUE.send(msg);
    return new Response("queued", { status: 202 });
  }
} satisfies ExportedHandler<Env>;