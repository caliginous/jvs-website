import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import EventCard from '@/components/EventCard';
import RecipeCard from '@/components/RecipeCard';
import { HOMEPAGE_QUERY, EVENTS_QUERY, HERO_QUERY, ABOUT_QUERY, GET_RECIPES } from '@/lib/queries';
import Link from 'next/link';
import type { Post, EventProduct, Recipe } from '@/lib/types';
import { decodeHtmlEntities } from '@/lib/utils';

// Fetch homepage data from WordPress GraphQL at build time
async function getHomepageData() {
  try {
    const response = await fetch('https://jvs.org.uk/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: HOMEPAGE_QUERY.loc?.source.body,
      }),
    });

    if (!response.ok) {
      console.error('Failed to fetch homepage data:', response.statusText);
      return { posts: { nodes: [] } };
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    // Return fallback data if GraphQL fails
    return {
      posts: { nodes: [] },
    };
  }
}

// Fetch hero content from WordPress GraphQL at build time
async function getHeroContent() {
  try {
    const response = await fetch('https://jvs.org.uk/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: HERO_QUERY.loc?.source.body,
      }),
    });

    if (!response.ok) {
      console.error('Failed to fetch hero content:', response.statusText);
      return null;
    }

    const result = await response.json();
    return result.data?.post || null;
  } catch (error) {
    console.error('Error fetching hero content:', error);
    return null;
  }
}

// Fetch about page content from WordPress GraphQL at build time
async function getAboutPageContent() {
  try {
    const response = await fetch('https://jvs.org.uk/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: ABOUT_QUERY.loc?.source.body,
      }),
    });

    if (!response.ok) {
      console.error('Failed to fetch about page content:', response.statusText);
      return null;
    }

    const result = await response.json();
    return result.data?.page || null;
  } catch (error) {
    console.error('Error fetching about page content:', error);
    return null;
  }
}

// Fetch upcoming events from WordPress GraphQL at build time
async function getUpcomingEvents(): Promise<EventProduct[]> {
  try {
    const response = await fetch('https://jvs.org.uk/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: EVENTS_QUERY.loc?.source.body,
      }),
    });

    if (!response.ok) {
      console.error('Failed to fetch events:', response.statusText);
      return [];
    }

    const result = await response.json();
    const allEvents = result.data?.eventProducts || [];
    
    // Filter to only show upcoming events
    const upcomingEvents = allEvents.filter((event: EventProduct) => {
      const eventDate = new Date(event.eventDate);
      const now = new Date();
      return eventDate > now;
    });

    // Return only the first 3 upcoming events
    return upcomingEvents.slice(0, 3);
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

// Fetch latest recipes from WordPress GraphQL at build time
async function getLatestRecipes(): Promise<Recipe[]> {
  try {
    const response = await fetch('https://jvs.org.uk/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: GET_RECIPES.loc?.source.body,
        variables: {
          first: 3, // Get 3 latest recipes
        }
      }),
    });

    if (!response.ok) {
      console.error('Failed to fetch recipes:', response.statusText);
      return [];
    }

    const result = await response.json();
    return result.data?.recipes || [];
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
}

export default async function HomePage() {
  const [homepageData, events, heroContent, aboutContent, recipes] = await Promise.all([
    getHomepageData(),
    getUpcomingEvents(),
    getHeroContent(),
    getAboutPageContent(),
    getLatestRecipes(),
  ]);

  const posts = homepageData?.posts?.nodes || [];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-[#E1F0D1] text-gray-900">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="mb-8">
            <div className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              {/* Use WordPress title */}
              <h1 className="text-3xl md:text-4xl font-bold mb-6">
                {heroContent?.title || 'JVS – Jewish, Vegan & Sustainable'}
              </h1>
              {/* Description */}
              <div className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                {heroContent?.excerpt ? (
                  <div dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(heroContent.excerpt) }} />
                ) : (
                  <p>JVS is the UK Jewish community&apos;s non-profit dedicated to promoting food ethics, sustainability, and concern for all living creatures.</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/events/"
              className="bg-white text-[#2E7D32] px-8 py-3 rounded-lg font-semibold hover:bg-neutral-100 transition-colors"
            >
              View Events
            </Link>
            <Link
              href="/articles/"
              className="bg-[#E1F0D1] text-[#2E7D32] px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#2E7D32] transition-colors border-2 border-[#2E7D32]"
            >
              Read Articles
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      {events.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-neutral-900">Upcoming Events</h2>
              <Link
                href="/events"
                className="text-[#4FC3F7] hover:text-[#558B2F] font-semibold"
              >
                View All Events →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
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
              <h2 className="text-3xl font-bold text-neutral-900">Latest Articles</h2>
              <Link
                href="/articles"
                className="text-[#4FC3F7] hover:text-[#558B2F] font-semibold"
              >
                View All Articles →
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
              <h2 className="text-3xl font-bold text-neutral-900">Latest Recipes</h2>
              <Link
                href="/recipes"
                className="text-[#4FC3F7] hover:text-[#558B2F] font-semibold"
              >
                View All Recipes →
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
              {aboutContent?.title || 'About the Jewish Vegetarian Society'}
            </h2>
            <div 
              className="text-lg text-neutral-700 mb-8 prose prose-lg mx-auto"
            >
              {aboutContent?.content ? (
                <div dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(aboutContent.content) }} />
              ) : (
                <p>We are a community dedicated to exploring the intersection of Jewish values and vegetarianism. Through events, education, and advocacy, we promote ethical eating, environmental stewardship, and compassionate living in line with Jewish traditions.</p>
              )}
            </div>
            <Link
              href="/about"
              className="bg-[#8BC34A] hover:bg-[#558B2F] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
