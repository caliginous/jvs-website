/**
 * app/[slug]/route.ts — Next-on-Pages Edge Route
 * HOW TO DO IT RIGHT:
 * - runtime=edge + dynamic=force-dynamic
 * - public reads use replicas; preview uses first-primary
 * - explicit cache headers (no-store)
 * - KV cache TTL for public; bypass in preview
 */
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const { env } = getRequestContext();
  const url = new URL(req.url);
  const isPreview = url.searchParams.get("preview") === "1";

  const cacheKey = `content:${params.slug}`;
  if (!isPreview && env.FRAGMENT_CACHE) {
    const hit = await env.FRAGMENT_CACHE.get(cacheKey);
    if (hit) return new Response(hit, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
  }

  const session = isPreview ? env.DB.withSession('first-primary') : env.DB.withSession();
  const row = await session.prepare("SELECT * FROM content WHERE slug=? AND deleted_at IS NULL").bind(params.slug).first();
  if (!row) return new Response("Not found", { status: 404 });

  const html = `<!doctype html>
  <html lang="en">
    <head><meta charset="utf-8"/><title>${row.title}</title></head>
    <body><main>${row.body_html}</main></body>
  </html>`;

  if (!isPreview && env.FRAGMENT_CACHE) {
    await env.FRAGMENT_CACHE.put(cacheKey, html, { expirationTtl: 45 });
  }

  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
}