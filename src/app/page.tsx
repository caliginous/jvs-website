import { Suspense } from 'react';
import { getSanityArticlesCached } from '@/lib/articles/clients/sanity';
import { normalizeSanityArticle, type UnifiedArticle } from '@/lib/articles/dedupe';
import { getSanityRecipes } from '@/lib/recipes/clients/sanity';
import { fetchTesseraEvents } from '@/lib/tessera-api';
import type { Post, Recipe, TesseraEvent } from '@/lib/types';
import ArticleCard from '@/components/ArticleCard';
import TesseraEventCard from '@/components/TesseraEventCard';
import RecipeCard from '@/components/RecipeCard';
import QuickNav from '@/components/QuickNav';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { decodeHtmlEntities } from '@/lib/utils';
import Link from 'next/link';

// Fetch homepage articles from Sanity and return latest 3
async function getHomepageArticles(): Promise<Post[]> {
  try {
    console.log('🔍 [HOMEPAGE] Fetching Sanity articles...');
    let sanityArticles = [] as Awaited<ReturnType<typeof getSanityArticlesCached>>;
    try {
      sanityArticles = await getSanityArticlesCached();
      console.log(`✅ [HOMEPAGE] Sanity articles fetched: ${sanityArticles.length}`);
    } catch (e) {
      console.warn('⚠️ [HOMEPAGE] Sanity fetch failed');
    }

    // Map Sanity directly
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

    // Latest 3
    return mapped.slice(0, 3);
  } catch (error) {
    console.error('❌ [HOMEPAGE] Error fetching articles:', error);
    return [];
  }
}

export const revalidate = 3600; // 1 hour - events refresh every hour

// Fetch homepage settings singleton from Sanity
async function getHomepageSettingsFromSanity() {
  try {
    const { createClient } = await import('@sanity/client');
    const client = createClient({
      projectId: process.env.SANITY_PROJECT_ID || '',
      dataset: process.env.SANITY_DATASET || 'production',
      apiVersion: '2024-01-01',
      useCdn: true,
    });
    return await client.fetch<any>(`*[_type == "homepageSettings"][0]`);
  } catch (e) {
    console.warn('Failed to fetch homepage settings from Sanity');
    return null;
  }
}

// About content from Sanity homepage settings
const getAboutFromSettings = (s: any) => ({ title: s?.aboutSectionTitle, content: s?.aboutSectionContent });

// Fetch upcoming events from Tessera API at build time
async function getUpcomingEvents(): Promise<TesseraEvent[]> {
  try {
    const allEvents = await fetchTesseraEvents();
    
    // Filter to only show upcoming events
    const upcomingEvents = allEvents.filter((event: TesseraEvent) => {
      const eventDate = new Date(event.nextDate);
      const now = new Date();
      return eventDate > now;
    });

    // Return only the first 3 upcoming events
    return upcomingEvents.slice(0, 3);
  } catch (error) {
    console.error('Error fetching events from Tessera API:', error);
    return [];
  }
}

// Fetch latest recipes from Sanity at build time
async function getLatestRecipes(): Promise<Recipe[]> {
  try {
    const { getSanityRecipes } = await import('@/lib/recipes/clients/sanity');
    const sanityRecipes = await getSanityRecipes();
    sanityRecipes.sort((a: any, b: any) => new Date(b.publishedAt || b._createdAt).getTime() - new Date(a.publishedAt || a._createdAt).getTime());
    return sanityRecipes.slice(0, 3).map((r: any) => ({
      id: r._id,
      title: r.title,
      slug: r.slug.current,
      date: r.publishedAt || r._createdAt,
      excerpt: '',
      content: '',
      featuredImageUrl: r.externalImageUrl || r.featuredImage?.asset?.url,
      ingredients: r.ingredients,
      instructions: r.instructions,
      servings: r.servings,
      preparationTime: r.preparationTime,
      cookTime: r.cookTime,
      difficulty: r.difficulty,
      categories: r.categories,
      tags: r.tags,
      source: 'sanity',
      createdAt: r._createdAt,
      updatedAt: r._updatedAt,
      views: 0,
    }));
  } catch (error) {
    console.error('Error fetching recipes from Sanity:', error);
    return [];
  }
}

// Fetch homepage settings from ACF via WPGraphQL
async function getHomepageSettings() {
  try {
    return null;
  } catch (error) {
    console.error('❌ [HOMEPAGE] Error fetching homepage settings:', error);
    return null;
  }
}

export default async function HomePage() {
  const [articles, events, homepageSettings, recipes] = await Promise.all([
    getHomepageArticles(),
    getUpcomingEvents(),
    getHomepageSettingsFromSanity(),
    getLatestRecipes(),
  ]);

  console.log('🔍 [HOMEPAGE] All data received:');
  console.log('🔍 [HOMEPAGE] homepageSettings:', homepageSettings);
  console.log('🔍 [HOMEPAGE] events count:', events.length);
  console.log('🔍 [HOMEPAGE] recipes count:', recipes.length);
  console.log('🔍 [HOMEPAGE] articles count:', articles.length);

  const posts = articles;

  // Use ACF fields if available, otherwise fallback to previous values
  const heroTitle = homepageSettings?.heroTitle || 'Jewish, Vegan & Sustainable';
  const heroSubtitle = homepageSettings?.heroSubtitle || "JVS is the UK Jewish community's non-profit dedicated to promoting food ethics, sustainability, and concern for all living creatures.";
  const heroCtaPrimary = homepageSettings?.heroCtaPrimary || 'View Events';
  const heroCtaSecondary = homepageSettings?.heroCtaSecondary || 'Read Articles';
  const eventsSectionTitle = homepageSettings?.eventsSectionTitle || 'Upcoming Events';
  const articlesSectionTitle = homepageSettings?.articlesSectionTitle || 'Latest Articles';
  const recipesSectionTitle = homepageSettings?.recipesSectionTitle || 'Latest Recipes';
  const eventsCtaText = homepageSettings?.eventsCtaText || 'View All Events →';
  const articlesCtaText = homepageSettings?.articlesCtaText || 'View All Articles →';
  const recipesCtaText = homepageSettings?.recipesCtaText || 'View All Recipes →';
  const aboutSectionTitle = homepageSettings?.aboutSectionTitle || 'About the Jewish Vegetarian Society';
  const aboutSectionContent = homepageSettings?.aboutSectionContent;
  const aboutCtaText = homepageSettings?.aboutCtaText || 'Learn More About Us';

  console.log('🔍 [HOMEPAGE] Final values being used:');
  console.log('🔍 [HOMEPAGE] heroTitle:', heroTitle);
  console.log('🔍 [HOMEPAGE] eventsSectionTitle:', eventsSectionTitle);
  console.log('🔍 [HOMEPAGE] articlesSectionTitle:', articlesSectionTitle);
  console.log('🔍 [HOMEPAGE] recipesSectionTitle:', recipesSectionTitle);
  console.log('🔍 [HOMEPAGE] aboutSectionTitle:', aboutSectionTitle);
  console.log('🔍 [HOMEPAGE] aboutSectionContent:', aboutSectionContent);
  console.log('🔍 [HOMEPAGE] aboutCtaText:', aboutCtaText);
  console.log('🔍 [HOMEPAGE] homepageSettings?.aboutSectionTitle:', homepageSettings?.aboutSectionTitle);

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-[#E1F0D1] text-gray-900">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="mb-8">
            <div className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              {/* Use ACF title */}
              <h1 className="text-3xl md:text-4xl font-bold mb-6">
                {heroTitle}
              </h1>
              {/* Description */}
              <div className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                {heroSubtitle && (
                  <div dangerouslySetInnerHTML={{ __html: heroSubtitle }} />
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/events/"
              className="bg-white text-[#2E7D32] px-8 py-3 rounded-lg font-semibold hover:bg-neutral-100 transition-colors"
            >
              {heroCtaPrimary}
            </Link>
            <Link
              href="/articles/"
              className="bg-[#E1F0D1] text-[#2E7D32] px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#2E7D32] transition-colors border-2 border-[#2E7D32]"
            >
              {heroCtaSecondary}
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      {events.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-neutral-900">{eventsSectionTitle}</h2>
              <Link
                href="/events"
                className="text-[#4FC3F7] hover:text-[#558B2F] font-semibold"
              >
                {eventsCtaText}
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <TesseraEventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Articles Section */}
      {posts.length > 0 && (
        <section className="py-16 bg-neutral-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-neutral-900">{articlesSectionTitle}</h2>
              <Link
                href="/articles"
                className="text-[#4FC3F7] hover:text-[#558B2F] font-semibold"
              >
                {articlesCtaText}
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post: Post) => (
                <ArticleCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Recipes Section */}
      {recipes.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-neutral-900">{recipesSectionTitle}</h2>
              <Link
                href="/recipes"
                className="text-[#4FC3F7] hover:text-[#558B2F] font-semibold"
              >
                {recipesCtaText}
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recipes.map((recipe: Recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-neutral-900 mb-6">
              {aboutSectionTitle}
            </h2>
            <div 
              className="text-lg text-neutral-700 mb-8 prose prose-lg mx-auto"
            >
              {aboutSectionContent ? (
                <div dangerouslySetInnerHTML={{ __html: aboutSectionContent }} />
              ) : (
                <p>We are a community dedicated to exploring the intersection of Jewish values and veganism. Through events, education, and advocacy, we promote ethical eating, environmental stewardship, and compassionate living in line with Jewish traditions.</p>
              )}
            </div>
            <Link
              href="/about"
              className="bg-[#8BC34A] hover:bg-[#558B2F] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              {aboutCtaText}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
