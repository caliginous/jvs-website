import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { getSanityArticleBySlugCached } from '@/lib/articles/clients/sanity';
import { convertPortableTextToHtml } from '@/lib/articles/dedupe';
import ArticleActionButtons from './ArticleActionButtons';
import BackNavigation from '@/components/BackNavigation';
import type { Post } from '@/lib/types';
import PortableTextRenderer from '@/components/PortableTextRenderer';

// For static generation
export const dynamic = 'force-dynamic';

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
    // Sanity first
    const sanity = await getSanityArticleBySlugCached(slug);
    if (sanity) {
      const contentHtml = convertPortableTextToHtml(sanity.content || []);
      const mapped: Post = {
        id: sanity._id,
        title: sanity.title,
        slug: sanity.slug.current,
        excerpt: sanity.excerpt,
        content: contentHtml,
        date: sanity.publishedAt,
        author: sanity.author ? { node: { name: sanity.author.name } } : undefined,
        featuredImage: (sanity.featuredImage || (sanity as any).externalImageUrl)
          ? { node: { sourceUrl: (sanity as any).externalImageUrl || sanity.featuredImage?.asset?.url, altText: sanity.featuredImage?.alt || sanity.title } }
          : undefined,
        categories: sanity.categories ? { nodes: sanity.categories.map((c: any) => ({ name: c.name, slug: c.slug.current })) } : undefined,
        tags: sanity.tags ? { nodes: sanity.tags.map((t: string) => ({ name: t, slug: t.toLowerCase().replace(/\s+/g, '-') })) } : undefined,
      };
      console.log(`✅ [ARTICLE] Sanity article fetched: ${mapped.title}`);
      return mapped;
    }

    console.log(`❌ [ARTICLE] Article not found: ${slug}`);
    return null;
  } catch (error) {
    console.error('❌ [ARTICLE] Error fetching article:', error);
    return null;
  }
}

// Generate static params for all article slugs
// Disable static params to avoid heavy build-time fetches; rely on dynamic render
export async function generateStaticParams() {
  return [] as { slug: string }[];
}

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const sanity = await getSanityArticleBySlugCached(slug);
  const title = sanity?.seo?.metaTitle || sanity?.title || 'Article';
  const description = sanity?.seo?.metaDescription || sanity?.excerpt || '';
  const ogImage = sanity?.seo?.ogImageUrl || sanity?.externalImageUrl || sanity?.featuredImage?.asset?.url;
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://jvs-vercel.vercel.app'}/articles/${slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    alternates: { canonical: url },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const formattedDate = formatDate(article.date);
  const cleanExcerpt = article.excerpt ? stripHtml(article.excerpt) : '';
  const currentUrl = `https://jvs.org.uk/articles/${slug}`;

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
            
            {/* Categories */}
            {article.categories?.nodes && article.categories.nodes.length > 0 && (
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {article.categories.nodes.map((category, index) => (
                  <span
                    key={index}
                    className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured Image */}
          {article.featuredImage?.node && (
            <div className="mb-8">
              <img
                src={article.featuredImage.node.sourceUrl}
                alt={article.featuredImage.node.altText || article.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg"
              />
            </div>
          )}
          
          {/* Article Actions */}
          <div className="mb-8 flex justify-center">
            <ArticleActionButtons article={article} />
          </div>
          
          <article className="prose prose-lg max-w-none">
            {article.content ? (
              <div
                className="content-links text-neutral-800 leading-relaxed [&_a]:text-accent-sky [&_a]:underline [&_a]:decoration-accent-sky [&_a]:decoration-2 [&_a:hover]:text-primary-500 [&_a:hover]:decoration-primary-500 [&_a]:transition-colors [&_a]:duration-200"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            ) : (
              // If we ever pass Portable Text instead of HTML, render it fully
              <PortableTextRenderer value={(article as any).portableText || []} />
            )}
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
                
                {/* Categories in Footer */}
                {article.categories?.nodes && article.categories.nodes.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="text-sm text-neutral-500 font-medium">Categories:</span>
                    {article.categories.nodes.map((category, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Tags in Footer */}
                {article.tags?.nodes && article.tags.nodes.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="text-sm text-neutral-500 font-medium">Tags:</span>
                    {article.tags.nodes.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
                      >
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                )}
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