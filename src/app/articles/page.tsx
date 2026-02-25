import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ArticlesClient from './ArticlesClient';
import { getSanityArticlesCached, getSanityArticlesByCategory, getSanityArticlesByTag, searchSanityArticles } from '@/lib/articles/clients/sanity';
import { normalizeSanityArticle, type UnifiedArticle } from '@/lib/articles/dedupe';
import type { Post } from '@/lib/types';

// Fetch all articles from Sanity at build time
async function getArticles(params?: { q?: string; category?: string; tag?: string }): Promise<Post[]> {
  try {
    const search = params?.q || '';
    const category = params?.category || '';
    const tag = params?.tag || '';

    // Always fetch all articles and filter client-side to avoid server/client mismatch
    // The client-side filtering is more reliable and handles category names correctly
    let sanityArticles: Awaited<ReturnType<typeof getSanityArticlesCached>> = [];
    if (search) {
      sanityArticles = await searchSanityArticles(search);
    } else {
      // For category and tag filtering, fetch all articles and let client handle filtering
      // This prevents server/client hydration mismatches
      sanityArticles = await getSanityArticlesCached();
    }
    const unified: UnifiedArticle[] = sanityArticles.map(normalizeSanityArticle);
    const mapped: Post[] = unified.map((a) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      excerpt: a.excerpt,
      content: a.content,
      date: a.date,
      author: a.author,
      featuredImage: a.featuredImage,
      categories: a.categories,
      tags: a.tags,
    }));

    return mapped;
  } catch (error) {
    console.error('❌ [ARTICLES] Error fetching articles:', error);
    return [];
  }
}

export const revalidate = 3600; // 1 hour

export default async function ArticlesPage({ searchParams }: { searchParams?: { q?: string; category?: string; tag?: string } }) {
  const articles = await getArticles({
    q: searchParams?.q,
    category: searchParams?.category,
    tag: searchParams?.tag,
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <ArticlesClient initialArticles={articles} />
      <Footer />
    </div>
  );
}