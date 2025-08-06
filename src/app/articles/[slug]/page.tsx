import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import type { Post } from '@/lib/types';
import { ARTICLE_QUERY, ARTICLES_QUERY } from '@/lib/queries';
import { wpClient } from '@/lib/wpClient';
import ArticleActionButtons from './ArticleActionButtons';
import BackNavigation from '@/components/BackNavigation';

// Helper function to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Helper function to strip HTML tags
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

async function getArticle(slug: string): Promise<Post | null> {
  try {
    const { data } = await wpClient.query({
      query: ARTICLE_QUERY,
      variables: { slug },
      fetchPolicy: 'no-cache'
    });

    return data?.post || null;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

// Generate static params for all article slugs (required for static export)
export async function generateStaticParams() {
  try {
    // Get all articles to generate static paths
    const { data } = await wpClient.query({
      query: ARTICLES_QUERY,
      variables: { first: 100 },
      fetchPolicy: 'no-cache',
    });

    const articles = data?.posts?.nodes || [];
    const articleSlugs = articles.map((article: Post) => ({ 
      slug: article.slug 
    }));

    console.log('=== ARTICLE STATIC PARAMS DEBUG ===');
    console.log('Article slugs:', articleSlugs.map((s: { slug: string }) => s.slug));
    console.log('Total article slugs to generate:', articleSlugs.length);
    console.log('=== END DEBUG ===');

    // If no articles found, return a fallback to prevent build error
    if (articleSlugs.length === 0) {
      console.log('No articles found, returning fallback');
      return [{ slug: 'sample-article' }];
    }

    return articleSlugs;
  } catch (error) {
    console.error('Error generating static params for articles:', error);
    // Return fallback to prevent build error
    return [{ slug: 'sample-article' }];
  }
}

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const formattedDate = formatDate(article.date);
  const cleanExcerpt = article.excerpt ? stripHtml(article.excerpt) : '';
      const currentUrl = `/articles/${slug}`;

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-[#E1F0D1] text-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            {/* Back to Articles Link */}
            <BackNavigation href="/articles" label="Back to Articles" />
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              {article.title}
            </h1>
            
            <div className="flex items-center justify-center text-lg text-neutral-700 mb-4">
              <span>{formattedDate}</span>
              {article.author && (
                <>
                  <span className="mx-3">•</span>
                  <span>By {article.author.node.name}</span>
                </>
              )}
            </div>
            
            {cleanExcerpt && (
              <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
                {cleanExcerpt}
              </p>
            )}
            
            {/* Article Action Buttons */}
            <div className="mt-6 flex justify-center">
              <ArticleActionButtons article={article} />
            </div>
            
            {/* Categories and Tags */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {article.categories?.nodes && article.categories.nodes.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2">
                  {article.categories.nodes.map((category, index) => (
                    <span
                      key={index}
                      className="inline-block px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
              )}
              {article.tags?.nodes && article.tags.nodes.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2">
                  {article.tags.nodes.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image Section */}
      {article.featuredImage && (
        <section className="py-8 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative">
              <img
                src={article.featuredImage.node.sourceUrl}
                alt={article.featuredImage.node.altText || article.title}
                className="w-full h-64 md:h-80 lg:h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </section>
      )}

      {/* Article Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Article Actions */}
          <div className="mb-8 flex justify-center">
            <ArticleActionButtons article={article} />
          </div>
          
          <article className="prose prose-lg max-w-none">
            <div 
              className="content-links text-neutral-800 leading-relaxed [&_a]:text-accent-sky [&_a]:underline [&_a]:decoration-accent-sky [&_a]:decoration-2 [&_a:hover]:text-primary-500 [&_a:hover]:decoration-primary-500 [&_a]:transition-colors [&_a]:duration-200"
              dangerouslySetInnerHTML={{ __html: article.content || '' }}
            />
          </article>
          
          {/* Article Footer */}
          <div className="mt-12 pt-8 border-t border-neutral-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="mb-4 sm:mb-0">
                <p className="text-neutral-600">
                  Published on {formattedDate}
                  {article.author && (
                    <span> by {article.author.node.name}</span>
                  )}
                </p>
                
                {/* Categories and Tags in Footer */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {article.categories?.nodes && article.categories.nodes.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm text-neutral-500 font-medium">Categories:</span>
                      {article.categories.nodes.map((category, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>
                  )}
                  {article.tags?.nodes && article.tags.nodes.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm text-neutral-500 font-medium">Tags:</span>
                      {article.tags.nodes.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                        >
                          #{tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <Link 
                href="/articles" 
                className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                View All Articles
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 