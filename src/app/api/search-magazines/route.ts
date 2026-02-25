import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    // If no query provided, return all magazine issues (for archive fallback)

    const { createClient } = await import('@sanity/client');
    const projectId = (process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) as string;
    const dataset = (process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production') as string;
    if (!projectId || !dataset) return NextResponse.json([]);

    const token = process.env.SANITY_API_TOKEN;
    const client = createClient({ projectId, dataset, apiVersion: '2024-01-01', useCdn: !token, token, perspective: 'published' as any });
    const q = query && query.trim().length > 0
      ? `*[_type == "magazineIssue" && (title match $m || summary match $m || ocrText match $m)] | order(publishedAt desc) {
          _id, title, publishedAt, slug, summary, pdfFileUrl
        }`
      : `*[_type == "magazineIssue"] | order(publishedAt desc) {
          _id, title, publishedAt, slug, summary, pdfFileUrl
        }`;
    const params = query && query.trim().length > 0 ? { m: `*${query}*` } : {};
    const docs = await client.fetch<any[]>(q, params);
    const results = docs.map((d) => ({
      id: d._id,
      title: d.title,
      date: d.publishedAt,
      r2_key: d.slug?.current || d._id,
      snippet: d.summary || '',
      pdf_url: d.pdfFileUrl,
    }));
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error searching magazines:', error);
    return NextResponse.json(
      { error: 'Failed to search magazines' },
      { status: 500 }
    );
  }
}