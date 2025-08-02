// KV namespace binding from wrangler.toml
declare const ARTICLES_CACHE: {
  get(key: string, options?: { type: 'json' }): Promise<unknown>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
};

const API_URL = process.env.WP_GRAPHQL_URL || 'https://jvs.org.uk/graphql';

async function fetchFromGraphQL(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  const json = await response.json();
  return json.data;
}

// Helper function to safely access ARTICLES_CACHE
function getCache() {
  if (typeof ARTICLES_CACHE !== 'undefined') {
    return ARTICLES_CACHE;
  }
  // Return a mock cache for build time
  return {
    get: async () => null,
    put: async () => {}
  };
}

export async function getArticleBySlug(slug: string) {
  try {
    const cache = getCache();
    const cacheKey = `article:${slug}`;
    const cached = await cache.get(cacheKey, { type: "json" });
    if (cached) return cached;

    console.log(`Fetching article for slug: ${slug}`);
    
    const data = await fetchFromGraphQL(
      `query GetArticles {
        posts(first: 100) {
          nodes {
            id
            title
            slug
            content
            date
            excerpt
            featuredImageUrl
          }
        }
      }`
    );

    console.log(`GraphQL response for article ${slug}:`, data);

    const posts = data?.posts?.nodes || [];
    const article = posts.find((p: { slug: string }) => p.slug === slug);
    
    if (article) {
      await cache.put(cacheKey, JSON.stringify(article), { expirationTtl: 600 });
      console.log(`Article cached for ${slug}`);
    } else {
      console.log(`Article not found for slug: ${slug}`);
    }

    return article;
  } catch (error) {
    console.error(`Error fetching article for slug ${slug}:`, error);
    return null;
  }
}

export async function getEventBySlug(slug: string) {
  try {
    const cache = getCache();
    const cacheKey = `event:${slug}`;
    const cached = await cache.get(cacheKey, { type: "json" });
    if (cached) return cached;

    console.log(`Fetching event for slug: ${slug}`);
    
    const data = await fetchFromGraphQL(
      `query GetEvents {
        events(first: 100) {
          nodes {
            id
            title
            slug
            content
            date
            excerpt
            featuredImageUrl
          }
        }
      }`
    );

    console.log(`GraphQL response for event ${slug}:`, data);

    const events = data?.events?.nodes || [];
    const event = events.find((e: { slug: string }) => e.slug === slug);
    
    if (event) {
      await cache.put(cacheKey, JSON.stringify(event), { expirationTtl: 600 });
      console.log(`Event cached for ${slug}`);
    } else {
      console.log(`Event not found for slug: ${slug}`);
    }

    return event;
  } catch (error) {
    console.error(`Error fetching event for slug ${slug}:`, error);
    return null;
  }
}

export async function getRecipeBySlug(slug: string) {
  try {
    const cache = getCache();
    const cacheKey = `recipe:${slug}`;
    const cached = await cache.get(cacheKey, { type: "json" });
    if (cached) return cached;

    console.log(`Fetching recipe for slug: ${slug}`);
    
    const data = await fetchFromGraphQL(
      `query GetRecipes {
        recipes(first: 100) {
          id
          title
          slug
          date
          excerpt
          content
          featuredImageUrl
          ingredients
          instructions
          servings
          preparationTime
          cookTime
          difficulty
          categories
          tags
          views
        }
      }`
    );

    console.log(`GraphQL response for ${slug}:`, data);

    const recipes = data?.recipes || [];
    const recipe = recipes.find((r: { slug: string }) => r.slug === slug);
    
    if (recipe) {
      await cache.put(cacheKey, JSON.stringify(recipe), { expirationTtl: 600 });
      console.log(`Recipe cached for ${slug}`);
    } else {
      console.log(`Recipe not found for slug: ${slug}`);
    }

    return recipe;
  } catch (error) {
    console.error(`Error fetching recipe for slug ${slug}:`, error);
    return null;
  }
}

export async function fetchRecipeSlugs() {
  try {
    console.log('Fetching recipe slugs for static generation...');
    
    const data = await fetchFromGraphQL(
      `query GetRecipeSlugs {
        recipes(first: 100) {
          slug
        }
      }`
    );

    console.log('Recipe slugs GraphQL response:', data);
    
    const recipes = data?.recipes || [];
    const slugs = recipes.map((recipe: { slug: string }) => recipe.slug);
    
    console.log(`Found ${slugs.length} recipe slugs:`, slugs);
    return slugs;
  } catch (error) {
    console.error('Error fetching recipe slugs:', error);
    return [];
  }
}

export async function fetchArticleSlugs() {
  try {
    console.log('Fetching article slugs for static generation...');
    
    const data = await fetchFromGraphQL(
      `query GetArticleSlugs {
        posts(first: 100) {
          nodes {
            slug
          }
        }
      }`
    );

    console.log('Article slugs GraphQL response:', data);
    
    const posts = data?.posts?.nodes || [];
    const slugs = posts.map((post: { slug: string }) => post.slug);
    
    console.log(`Found ${slugs.length} article slugs:`, slugs);
    return slugs;
  } catch (error) {
    console.error('Error fetching article slugs:', error);
    return [];
  }
}

export async function fetchEventSlugs() {
  try {
    console.log('Fetching event slugs for static generation...');
    
    const data = await fetchFromGraphQL(
      `query GetEventSlugs {
        events(first: 100) {
          nodes {
            slug
          }
        }
      }`
    );

    console.log('Event slugs GraphQL response:', data);
    
    const events = data?.events?.nodes || [];
    const slugs = events.map((event: { slug: string }) => event.slug);
    
    console.log(`Found ${slugs.length} event slugs:`, slugs);
    return slugs;
  } catch (error) {
    console.error('Error fetching event slugs:', error);
    return [];
  }
} 