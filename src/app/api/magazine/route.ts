import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Magazine ID is required' },
        { status: 400 }
      );
    }

    const { createClient } = await import('@sanity/client');
    const projectId = (process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) as string;
    const dataset = (process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production') as string;
    if (!projectId || !dataset) {
      return NextResponse.json(
        { error: 'Sanity not configured' },
        { status: 500 }
      );
    }

    const token = process.env.SANITY_API_TOKEN;
    const client = createClient({ projectId, dataset, apiVersion: '2024-01-01', useCdn: !token, token, perspective: 'published' as any });
    const normalized = id.replace('-online-', '-');
    const query = `*[_type == "magazineIssue" && (
        _id == $id || slug.current == $id || slug.current == $normalized
      )][0]{
      _id,
      title,
      publishedAt,
      slug,
      coverImage,
      pdfFileUrl,
      ocrText,
      summary
    }`;
    let doc = await client.fetch<any>(query, { id, normalized });
    if (!doc) {
      // Fallback: fuzzy match by normalizing to alphanumerics only
      const list = await client.fetch<any[]>(`*[_type == "magazineIssue"]{ _id, title, slug }`);
      const norm = (s: string) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const target = norm(id)
        .replace('online', '')
        .replace('magonline', '')
        .replace('mag', 'mag');
      const found = list.find((d) => {
        const s = norm(d.slug?.current || d._id || '');
        const t = norm(d.title || '');
        return s === target || s.includes(target) || target.includes(s) || t.includes(target);
      });
      if (found) {
        doc = await client.fetch<any>(
          `*[_type == "magazineIssue" && _id == $id][0]{ _id, title, publishedAt, slug, coverImage, pdfFileUrl, ocrText, summary }`,
          { id: found._id }
        );
      }
    }
    if (!doc) return NextResponse.json({ error: 'Magazine not found' }, { status: 404 });
    return NextResponse.json({
      id: doc._id,
      title: doc.title,
      date: doc.publishedAt,
      r2_key: doc.slug?.current || doc._id,
      cover_image: doc.coverImage?.asset?.url,
      ocr_text: doc.ocrText,
      summary: doc.summary,
      pdf_url: doc.pdfFileUrl,
    });
  } catch (error) {
    console.error('Error fetching magazine:', error);
    return NextResponse.json(
      { error: 'Failed to fetch magazine' },
      { status: 500 }
    );
  }
}