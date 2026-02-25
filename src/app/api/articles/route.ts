import { NextRequest, NextResponse } from 'next/server';
import { getSanityArticles } from '@/lib/articles/clients/sanity';
import type { Post } from '@/lib/types';

// Fetch articles from Sanity
async function getSanityArticlesData() {
  try {
    const articles = await getSanityArticles();
    console.log(`✅ [ARTICLES API] Total Sanity articles fetched: ${articles.length}`);
    return articles;
  } catch (error) {
    console.error('❌ [ARTICLES API] Error fetching Sanity articles:', error);
    return [];
  }
}

// Main API handler
export async function GET(request: NextRequest) {
  try {
    console.log('🚀 [ARTICLES API] Returning Sanity articles only...');
    const sanityArticles = await getSanityArticlesData();
    const finalArticles: Post[] = sanityArticles.map((a: any) => ({
      id: a._id,
      title: a.title,
      slug: a.slug?.current,
      excerpt: a.excerpt,
      content: '',
      date: a.publishedAt || a._createdAt,
      author: a.author ? { node: { name: a.author.name } } : undefined,
      featuredImage: (a.externalImageUrl || a.featuredImage)
        ? { node: { sourceUrl: a.externalImageUrl || a.featuredImage?.asset?.url, altText: a.featuredImage?.alt || a.title } }
        : undefined,
      categories: Array.isArray(a.categories)
        ? { nodes: a.categories.map((c: any) => ({ name: c.name, slug: c.slug?.current || c.slug })) }
        : undefined,
      tags: Array.isArray(a.tags)
        ? { nodes: a.tags.map((t: string) => ({ name: t, slug: t.toLowerCase().replace(/\s+/g, '-') })) }
        : undefined,
    }));
    
    // Add source information for debugging
    const articlesWithSource = finalArticles.map(article => ({
      ...article,
      source: article.source || 'wordpress', // Default to wordpress for backward compatibility
    }));
    
    console.log(`🎉 [ARTICLES API] Returning ${articlesWithSource.length} articles (Sanity)`);
    
    return NextResponse.json(articlesWithSource, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
    
  } catch (error) {
    console.error('❌ [ARTICLES API] Error in main handler:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}
