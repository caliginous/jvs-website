// workers/ingest-wordpress.ts
// JewishVegV2 — Cron poller for WPGraphQL deltas -> Queue
export interface Env {
  DB: D1Database;
  INGEST_QUEUE: Queue;
  WORDPRESS_GRAPHQL_ENDPOINT: string;
  WORDPRESS_GRAPHQL_TOKEN?: string;
}

const QUERY = `
  query PostsSince($after: String) {
    posts(first: 50, where: { orderby: { field: MODIFIED, order: DESC } }) {
      nodes {
        databaseId
        date
        modified
        slug
        title
        content
        status
      }
    }
  }
`;

export default {
  async scheduled(_event: ScheduledEvent, env: Env, _ctx: ExecutionContext) {
    const cursor = await env.DB.prepare("SELECT last_seen FROM source_cursor WHERE source='wordpress'").first();
    const lastSeen = cursor?.last_seen ?? null;

    const r = await fetch(env.WORDPRESS_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(env.WORDPRESS_GRAPHQL_TOKEN ? { "authorization": `Bearer ${env.WORDPRESS_GRAPHQL_TOKEN}` } : {})
      },
      body: JSON.stringify({ query: QUERY, variables: { after: lastSeen } })
    });
    if (!r.ok) throw new Error("WPGraphQL error " + r.status);
    const j = await r.json();
    const nodes = j?.data?.posts?.nodes || [];

    for (const n of nodes) {
      const deleted = n.status && String(n.status).toLowerCase() == "trash";
      const msg = {
        source: "wordpress",
        source_id: String(n.databaseId),
        type: "post",
        slug: n.slug,
        title: n.title,
        body_json: JSON.stringify({ content: n.content }),
        body_html: n.content || "<div></div>",
        summary: null,
        updated_at: n.modified || new Date().toISOString(),
        published_at: n.date || null,
        deleted
      };
      await env.INGEST_QUEUE.send(msg);
    }

    const newest = nodes[0]?.modified || new Date().toISOString();
    await env.DB.prepare(
      "INSERT INTO source_cursor(source,last_seen) VALUES('wordpress',?) ON CONFLICT(source) DO UPDATE SET last_seen=excluded.last_seen"
    ).bind(newest).run();
  }
} satisfies ExportedHandler<Env>;