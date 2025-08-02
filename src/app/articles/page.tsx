import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ArticlesClient from './ArticlesClient';
import { ARTICLES_QUERY } from '@/lib/queries';
import type { Post } from '@/lib/types';

// Fetch all articles from WordPress GraphQL at build time
async function getArticles() {
  try {
    console.log('Fetching articles with pagination...');
    let allArticles: unknown[] = [];
    let hasNextPage = true;
    let endCursor: string | null = null;
    let pageCount = 0;
    
    while (hasNextPage && pageCount < 50) { // Safety limit of 50 pages
      console.log(`Fetching page ${pageCount + 1}...`);
      
      const response = await fetch('https://jvs.org.uk/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: ARTICLES_QUERY.loc?.source.body,
          variables: {
            first: 100, // WordPress seems to limit to 100
            after: endCursor,
          }
        }),
      });

      if (!response.ok) {
        console.error('Failed to fetch articles:', response.statusText);
        break;
      }

      const result = await response.json();
      const data = result.data as unknown;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const posts = (data as any)?.posts?.nodes || [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pageInfo = (data as any)?.posts?.pageInfo;
      
      allArticles = [...allArticles, ...posts];
      hasNextPage = pageInfo?.hasNextPage || false;
      endCursor = pageInfo?.endCursor || null;
      pageCount++;
      
      console.log(`Page ${pageCount}: ${posts.length} articles, hasNextPage: ${hasNextPage}`);
      
      if (posts.length === 0) break;
    }
    
    console.log(`Total articles fetched: ${allArticles.length}`);
    return allArticles as Post[];
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <ArticlesClient initialArticles={articles} />
      <Footer />
    </div>
  );
} 