// scripts/backfill.ts (stub)
// Usage: run with miniflare or a tiny worker task to paginate WPGraphQL and/or Sanity
export interface Env {
  DB: D1Database;
  WORDPRESS_GRAPHQL_ENDPOINT: string;
  WORDPRESS_GRAPHQL_TOKEN?: string;
}

export default {
  async fetch(_req: Request, env: Env) {
    // TODO: implement pagination over WPGraphQL + Sanity,
    // normalize to canonical JSON + HTML, and upsert via same SQL as consumer.
    return new Response("Backfill stub");
  }
} satisfies ExportedHandler<Env>;