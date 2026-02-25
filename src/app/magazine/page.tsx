import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MagazineClient from './MagazineClient';

interface Magazine {
  id: string;
  title: string;
  date: string;
  r2_key: string;
  cover_image?: string;
  ocr_text?: string;
  summary?: string;
  pdf_url: string;
  slug?: string;
}

export const dynamic = 'force-dynamic';

// Fetch magazines from Sanity with optional filters
async function getMagazines(params?: { q?: string; category?: string; tag?: string; year?: string }): Promise<Magazine[]> {
  try {
    console.log('🔍 [MAGAZINE] Fetching magazines from Sanity...');
    const { createClient } = await import('@sanity/client');
    const projectId = (process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'lyq4b3pa') as string;
    const dataset = (process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production') as string;
    if (!projectId || !dataset) {
      console.warn('⚠️ [MAGAZINE] Sanity not configured; falling back to empty list');
      return [];
    }
    const token = process.env.SANITY_API_TOKEN;
    const client = createClient({ projectId, dataset, apiVersion: '2024-01-01', useCdn: !token, token, perspective: 'published' as any });

    const filters: string[] = [];
    const q = params?.q?.trim();
    const category = params?.category?.trim();
    const tag = params?.tag?.trim();
    const year = params?.year?.trim();

    if (q) filters.push('(title match $m || summary match $m || ocrText match $m)');
    if (category) filters.push('$category in categories');
    if (tag) filters.push('$tag in tags');
    if (year) filters.push('dateTime(publishedAt).year() == $year');

    const where = ['_type == "magazineIssue"'].concat(filters).join(' && ');
    const groq = `*[$m ? (title match $m || summary match $m || ocrText match $m) : true]`;

    const query = `*[_type == "magazineIssue"${filters.length ? ` && ${filters.join(' && ')}` : ''}] | order(publishedAt desc) {
      _id, title, publishedAt, slug, coverImage, pdfFileUrl, summary, ocrText
    }`;

    let docs = await client.fetch<any[]>(query, {
      m: q ? `*${q}*` : undefined,
      category,
      tag,
      year: year ? Number(year) : undefined,
    });
    if (!docs || docs.length === 0) {
      // Fallback via API route (ensures token-based access in all envs)
      const base = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : '';
      const res = await fetch(`${base}/api/search-magazines?q=${encodeURIComponent(q || '')}`);
      if (res.ok) {
        const data = await res.json();
        return data.map((d: any) => ({ id: d.id, title: d.title, date: d.date, r2_key: d.r2_key, cover_image: undefined, ocr_text: undefined, summary: d.snippet, pdf_url: d.pdf_url, slug: undefined }));
      }
    }
    return docs.map((d) => ({
      id: d._id,
      title: d.title,
      date: d.publishedAt,
      r2_key: d.slug?.current || d._id,
      cover_image: d.coverImage?.asset?.url,
      ocr_text: d.ocrText,
      summary: d.summary,
      pdf_url: d.pdfFileUrl,
      slug: d.slug?.current,
    }));
  } catch (error) {
    console.error('Error fetching magazines:', error);
    return [];
  }
}

export default async function MagazineArchivePage({ searchParams }: { searchParams?: { q?: string; category?: string; tag?: string; year?: string } }) {
  const magazines = await getMagazines(searchParams);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <MagazineClient initialMagazines={magazines} />
      <Footer />
    </div>
  );
} 