import type { MetadataRoute } from 'next';
import { getSanityArticles } from '@/lib/articles/clients/sanity';
import { getSanityRecipes } from '@/lib/recipes/clients/sanity';
import { createClient } from '@sanity/client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jvs-vercel.vercel.app';

  const [articles, recipes, magazines] = await Promise.all([
    getSanityArticles().catch(() => []),
    getSanityRecipes().catch(() => []),
    (async () => {
      try {
        const client = createClient({
          projectId: process.env.SANITY_PROJECT_ID || '',
          dataset: process.env.SANITY_DATASET || 'production',
          apiVersion: '2024-01-01',
          useCdn: true,
        });
        return await client.fetch<any[]>(`*[_type == "magazineIssue"]{ slug, _updatedAt, publishedAt }`);
      } catch { return []; }
    })(),
  ]);

  const articleUrls = (articles as any[]).map((a) => ({
    url: `${baseUrl}/articles/${a.slug.current}`,
    lastModified: a._updatedAt || a.publishedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const recipeUrls = (recipes as any[]).map((r) => ({
    url: `${baseUrl}/recipes/${r.slug.current}`,
    lastModified: r._updatedAt || r.publishedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const magazineUrls = (magazines as any[]).map((m) => ({
    url: `${baseUrl}/magazine/${m.slug?.current}`,
    lastModified: m._updatedAt || m.publishedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    { url: baseUrl, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/articles/`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/recipes/`, changeFrequency: 'daily', priority: 0.9 },
    ...articleUrls,
    ...recipeUrls,
    ...magazineUrls,
  ];
}


