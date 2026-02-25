// workers/queue-consumer.ts
// JewishVegV2 — Queue consumer -> D1 upsert (idempotent, updated_at guard)
export interface Env { DB: D1Database; }

type Msg = {
  source: string; source_id: string; type: string; slug: string; title: string;
  body_json: string; body_html: string; summary?: string | null;
  updated_at: string; published_at?: string | null; deleted?: boolean;
};

export default {
  async queue(batch: MessageBatch<Msg>, env: Env) {
    for (const m of batch.messages) {
      const id = `${m.body.source}:${m.body.source_id}`;
      const current = await env.DB.prepare("SELECT updated_at FROM content WHERE id=?").bind(id).first();
      if (current && String(current.updated_at) >= String(m.body.updated_at)) { m.ack(); continue; }

      if (m.body.deleted) {
        await env.DB.prepare("UPDATE content SET deleted_at=? WHERE id=?").bind(new Date().toISOString(), id).run();
        m.ack(); continue;
      }

      await env.DB.prepare(
        `INSERT INTO content (id,type,slug,title,body_json,body_html,summary,source,source_id,updated_at,published_at,version,deleted_at)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,NULL)
         ON CONFLICT(id) DO UPDATE SET
           type=excluded.type, slug=excluded.slug, title=excluded.title,
           body_json=excluded.body_json, body_html=excluded.body_html,
           summary=excluded.summary, source=excluded.source, source_id=excluded.source_id,
           updated_at=excluded.updated_at, published_at=excluded.published_at,
           version=content.version+1, deleted_at=NULL`
      ).bind(
        id, m.body.type, m.body.slug, m.body.title, m.body.body_json, m.body.body_html,
        m.body.summary ?? null, m.body.source, m.body.source_id, m.body.updated_at,
        m.body.published_at ?? null, 1
      ).run();

      m.ack();
    }
  }
} satisfies ExportedHandler<Env>;
