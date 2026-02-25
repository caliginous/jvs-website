import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  try {
    const { createClient } = await import('@sanity/client');
    const projectId = (process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) as string;
    const dataset = (process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production') as string;
    const token = process.env.SANITY_API_TOKEN;
    const client = createClient({ projectId, dataset, apiVersion: '2024-01-01', useCdn: !token, token, perspective: 'published' as any });
    const count = await client.fetch<number>(`count(*[_type == "magazineIssue"])`);
    const first = await client.fetch<any>(`*[_type == "magazineIssue"][0]{_id, title, slug}`);
    return NextResponse.json({ ok: true, projectId, dataset, count, first });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'debug error' }, { status: 500 });
  }
}























