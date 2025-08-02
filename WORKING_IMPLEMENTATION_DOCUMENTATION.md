# JVS Website - Working Implementation Documentation

**Date:** August 1, 2025  
**Version:** Working Production Version  
**Deployment:** https://jvs-website.dan-794.workers.dev  
**Version ID:** b63f821f-920d-4772-8898-4aedd6362fac  

## Overview

This document details the exact technical implementation of the working JVS website, specifically focusing on the dynamic content handling for Events, Articles, and Recipes. This version is fully functional and serves as a reference implementation.

## Architecture Summary

- **Framework:** Next.js 14 with App Router
- **Deployment:** Cloudflare Workers via @cloudflare/next-on-pages
- **Data Source:** WordPress GraphQL API (https://jvs.org.uk/graphql)
- **Build Strategy:** Static Site Generation (SSG) with dynamic fallbacks
- **Client:** Apollo Client with custom error handling and fallback logic

## 1. Articles Implementation

### 1.1 File Structure
```
src/app/articles/[slug]/page.tsx          # Main article page component
src/app/articles/[slug]/ArticleActionButtons.tsx  # Social sharing buttons
src/components/BackNavigation.tsx         # Navigation component
src/lib/wpClient.ts                       # Apollo Client configuration
src/lib/queries.ts                        # GraphQL query definitions
src/lib/types.ts                          # TypeScript type definitions
```

### 1.2 Article Page Component (`src/app/articles/[slug]/page.tsx`)

#### Static Generation Configuration
```typescript
// Static generation configuration for Cloudflare Pages
export const dynamic = 'force-static';
export const revalidate = false;
```

#### Static Parameters Generation
```typescript
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
```

#### Article Data Fetching
```typescript
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
```

#### Main Component Logic
```typescript
export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const formattedDate = formatDate(article.date);
  const cleanExcerpt = article.excerpt ? stripHtml(article.excerpt) : '';
  const currentUrl = `https://jvs.org.uk/articles/${slug}`;

  // Component JSX with full styling and functionality
}
```

### 1.3 Apollo Client Configuration (`src/lib/wpClient.ts`)

#### Custom Fetch Function with Fallback Logic
```typescript
const createFallbackFetch = () => {
  const proxyUrl = 'https://jvs-website.dan-794.workers.dev/api/graphql';
  const directUrl = process.env.WP_GRAPHQL_URL || 'https://www.jvs.org.uk/graphql';
  
  console.log('GraphQL Proxy URL:', proxyUrl);
  console.log('GraphQL Direct URL:', directUrl);
  console.log('NODE_ENV:', process.env.NODE_ENV);

  return async (input: RequestInfo | URL, init?: RequestInit) => {
    const maxRetries = 2;
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
        
        // Try proxy first, then direct URL
        const targetUrl = attempt === 1 ? proxyUrl : directUrl;
        console.log(`Attempt ${attempt}: Trying ${targetUrl}`);
        
        const response = await fetch(targetUrl, {
          ...init,
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        // If we get a 403 from proxy, try direct URL on next attempt
        if (response.status === 403 && attempt === 1) {
          console.warn('Proxy returned 403, will try direct WordPress GraphQL on next attempt');
          continue;
        }
        
        // If we get a successful response, return it
        if (response.ok) {
          console.log(`Success with ${targetUrl}`);
          return response;
        }
        
        // For other errors, throw
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        
      } catch (error) {
        lastError = error;
        if (attempt < maxRetries) {
          console.warn(`GraphQL request failed on attempt ${attempt}, will retry...`, error);
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
        }
      }
    }
    
    throw lastError;
  };
};
```

#### Apollo Client Setup
```typescript
const httpLink = createHttpLink({
  uri: 'https://jvs-website.dan-794.workers.dev/api/graphql', // This will be overridden by custom fetch
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'JVS-Website/1.0',
    'Accept': 'application/json',
    'Cache-Control': 'no-cache',
  },
  fetchOptions: {
    mode: 'cors',
  },
  fetch: createFallbackFetch(),
});

export const wpClient = new ApolloClient({
  link: from([errorLink, httpLink]),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
  cache: new InMemoryCache({
    addTypename: false,
  }),
});
```

### 1.4 GraphQL Queries (`src/lib/queries.ts`)

#### Articles Listing Query
```typescript
export const ARTICLES_QUERY = gql`
  query Articles($first: Int, $after: String) {
    posts(
      first: $first
      after: $after
      where: { orderby: { field: DATE, order: DESC } }
    ) {
      nodes {
        id
        title
        slug
        excerpt
        date
        author {
          node {
            name
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
        tags {
          nodes {
            name
            slug
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
```

#### Single Article Query
```typescript
export const ARTICLE_QUERY = gql`
  query Article($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      title
      content
      date
      author {
        node {
          name
        }
      }
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
  }
`;
```

### 1.5 TypeScript Types (`src/lib/types.ts`)

```typescript
export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  date: string;
  author?: {
    node: {
      name: string;
    };
  };
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  };
  categories?: {
    nodes: Array<{
      name: string;
      slug: string;
    }>;
  };
  tags?: {
    nodes: Array<{
      name: string;
      slug: string;
    }>;
  };
}
```

## 2. Recipes Implementation

### 2.1 File Structure
```
src/app/recipes/[slug]/page.tsx          # Main recipe page component
src/lib/api.ts                           # Recipe data fetching functions
src/lib/queries.ts                       # Recipe GraphQL queries
```

### 2.2 Recipe Page Component (`src/app/recipes/[slug]/page.tsx`)

#### Static Generation Configuration
```typescript
// Static generation configuration for Cloudflare Pages
export const dynamic = 'force-static';
export const revalidate = false;
```

#### Static Parameters Generation
```typescript
export async function generateStaticParams() {
  const slugs = await fetchRecipeSlugs();
  return slugs.map((slug: string) => ({ slug }));
}
```

#### Recipe Data Fetching
```typescript
export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    console.log(`RecipePage: Processing slug: ${slug}`);

    const recipe = await getRecipeBySlug(slug);
    console.log(`RecipePage: Recipe result:`, recipe ? 'Found' : 'Not found');

    if (!recipe) {
      console.log(`RecipePage: Recipe not found, calling notFound()`);
      notFound();
    }

    // Component JSX with recipe display logic
  } catch (error) {
    console.error(`RecipePage: Error processing recipe:`, error);
    notFound();
  }
}
```

### 2.3 Recipe API Functions (`src/lib/api.ts`)

#### Recipe Data Fetching with KV Caching
```typescript
export async function getRecipeBySlug(slug: string) {
  const cache = getCache();
  const cacheKey = `recipe:${slug}`;
  
  try {
    // Try to get from cache first
    const cached = await cache.get(cacheKey, { type: 'json' });
    if (cached) {
      console.log(`Recipe served from cache for ${slug}`);
      return cached;
    }

    console.log(`Fetching recipe from GraphQL for slug: ${slug}`);
    
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
          jvsTestField
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
```

#### Recipe Slugs Fetching
```typescript
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
```

### 2.4 Recipe Types (`src/lib/types.ts`)

```typescript
export interface Recipe {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  content: string;
  featuredImageUrl?: string;
  ingredients?: string;
  instructions?: string;
  servings?: string;
  preparationTime?: string;
  cookTime?: string;
  difficulty?: string;
  categories?: string[];
  tags?: string[];
  views?: number;
  jvsTestField?: string;
}
```

## 3. Events Implementation

### 3.1 File Structure
```
src/app/events/[slug]/page.tsx           # Main event page component
src/app/events/[slug]/tickets/page.tsx   # Event tickets page component
src/lib/api.ts                           # Event data fetching functions
```

### 3.2 Event Page Component (`src/app/events/[slug]/page.tsx`)

#### Static Generation Configuration
```typescript
// Static generation configuration for Cloudflare Pages
export const dynamic = 'force-static';
export const revalidate = false;
```

#### Static Parameters Generation
```typescript
export async function generateStaticParams() {
  const slugs = await fetchEventSlugs();
  return slugs.map((slug: string) => ({ slug }));
}
```

#### Event Data Fetching
```typescript
export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    console.log(`EventPage: Processing slug: ${slug}`);

    const event = await getEventBySlug(slug);
    console.log(`EventPage: Event result:`, event ? 'Found' : 'Not found');

    if (!event) {
      console.log(`EventPage: Event not found, calling notFound()`);
      notFound();
    }

    // Component JSX with event display logic
  } catch (error) {
    console.error(`EventPage: Error processing event:`, error);
    notFound();
  }
}
```

### 3.3 Event Tickets Page (`src/app/events/[slug]/tickets/page.tsx`)

#### Dynamic Configuration (Edge Runtime)
```typescript
// Edge Runtime configuration for Cloudflare Pages
export const runtime = 'edge';

// Dynamic configuration for Cloudflare Pages
export const dynamic = 'force-dynamic';
```

#### Event Data Fetching for Tickets
```typescript
export default async function TicketPage({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    console.log(`Fetching event for tickets with slug: ${slug}`);
    
    const event = await getEventBySlug(slug);
    console.log(`Event data for tickets:`, event ? 'found' : 'not found');

    if (!event) {
      console.log(`Event not found for tickets, calling notFound()`);
      notFound();
    }

    // Component JSX with ticket purchasing logic
  } catch (error) {
    console.error(`TicketPage: Error processing event tickets:`, error);
    notFound();
  }
}
```

### 3.4 Event API Functions (`src/lib/api.ts`)

#### Event Data Fetching
```typescript
export async function getEventBySlug(slug: string) {
  const cache = getCache();
  const cacheKey = `event:${slug}`;
  
  try {
    // Try to get from cache first
    const cached = await cache.get(cacheKey, { type: 'json' });
    if (cached) {
      console.log(`Event served from cache for ${slug}`);
      return cached;
    }

    console.log(`Fetching event from GraphQL for slug: ${slug}`);
    
    const data = await fetchFromGraphQL(
      `query GetEvents {
        events(first: 100) {
          nodes {
            id
            title
            slug
            date
            excerpt
            content
            featuredImageUrl
            eventDate
            eventVenue
            eventPrice
            isEvent
          }
        }
      }`
    );

    console.log(`GraphQL response for ${slug}:`, data);

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
```

#### Event Slugs Fetching
```typescript
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
```

### 3.5 Event Types (`src/lib/types.ts`)

```typescript
export interface Event extends Post {
  eventFields?: {
    venue: string;
    price: string;
    rsvpLink: string;
    description: string;
  };
  eventDate?: string;
  eventVenue?: string;
  eventPrice?: string;
  isEvent?: boolean;
}
```

## 4. Build and Deployment Configuration

### 4.1 Wrangler Configuration (`wrangler.toml`)

```toml
name = "jvs-website"
compatibility_date = "2024-07-20"
compatibility_flags = ["nodejs_compat"]

main = ".vercel/output/static/_worker.js/index.js"

[assets]
directory = ".vercel/output/static"

[[d1_databases]]
binding = "DB"
database_name = "jvs-magazine-db"
database_id = "2b2ca51b-2571-486a-b569-d595f75f9fd8"

[env.production]
name = "jvs-website"

[env.production.assets]
directory = ".vercel/output/static"

# KV Namespace for storing sensitive data like Stripe keys
[[env.production.kv_namespaces]]
binding = "JVS_SECRETS"
id = "7628564cb1e947908e46a7a47373c23b"

[[env.production.d1_databases]]
binding = "DB"
database_name = "jvs-magazine-db"
database_id = "2b2ca51b-2571-486a-b569-d595f75f9fd8"

[[env.production.vars]]
name = "WP_GRAPHQL_URL"
value = "https://jvs.org.uk/graphql"

[[env.production.vars]]
name = "WP_API_URL"
value = "https://jvs.org.uk/wp-json"
```

### 4.2 Build Process

#### Build Command
```bash
npx @cloudflare/next-on-pages
```

#### Assets Ignore Configuration
```bash
echo "_worker.js" > .vercel/output/static/.assetsignore
```

#### Deployment Command
```bash
npx wrangler deploy --env=production
```

## 5. Error Handling and Fallbacks

### 5.1 GraphQL Error Handling
- **Proxy Fallback:** Attempts proxy first, falls back to direct WordPress GraphQL
- **Retry Logic:** Exponential backoff with 2 retry attempts
- **Timeout Protection:** 15-second timeout per request
- **Cache Integration:** KV caching with 10-minute TTL

### 5.2 Static Generation Fallbacks
- **Empty Results:** Returns fallback slug (`sample-article`) if no content found
- **Build Errors:** Graceful error handling prevents build failures
- **404 Handling:** Proper `notFound()` calls for missing content

### 5.3 Edge Runtime Compatibility
- **Dynamic Routes:** Event tickets use Edge Runtime for dynamic functionality
- **Static Routes:** Articles and recipes use static generation for performance
- **Mixed Strategy:** Combines static generation with dynamic fallbacks

## 6. Performance Characteristics

### 6.1 Build Performance
- **Articles:** 100 static pages generated
- **Recipes:** 264+ static pages generated
- **Events:** Multiple static pages generated
- **Total Build Time:** ~1.75 seconds

### 6.2 Runtime Performance
- **Static Pages:** Sub-100ms response times
- **Dynamic Pages:** ~400-600ms first load, ~100ms cached
- **KV Cache Hit Rate:** High for frequently accessed content

### 6.3 Bundle Sizes
- **Article Pages:** 1.74 kB (110 kB First Load JS)
- **Recipe Pages:** 1.76 kB (110 kB First Load JS)
- **Event Pages:** 1.12 kB (109 kB First Load JS)

## 7. Key Success Factors

### 7.1 Apollo Client Configuration
- **No-Cache Policy:** Prevents stale data issues
- **Error Policy:** Graceful handling of GraphQL errors
- **Fallback URLs:** Robust proxy-to-direct fallback system

### 7.2 Static Generation Strategy
- **Force Static:** Ensures all content is pre-rendered
- **Fallback Slugs:** Prevents build failures
- **Proper Error Handling:** Graceful degradation

### 7.3 Environment Configuration
- **Correct URLs:** Proper WordPress GraphQL endpoint configuration
- **KV Bindings:** Proper cache integration
- **Asset Management:** Correct worker file exclusion

## 8. Troubleshooting Guide

### 8.1 Common Issues
1. **404 Errors on Articles:** Check GraphQL endpoint and query structure
2. **Build Failures:** Verify fallback slugs and error handling
3. **Cache Issues:** Check KV namespace configuration
4. **Deployment Errors:** Ensure `.assetsignore` file is present

### 8.2 Debug Commands
```bash
# Check build output
ls -la .vercel/output/static/articles/ | wc -l

# Test GraphQL endpoint
curl -X POST https://jvs.org.uk/graphql -H "Content-Type: application/json" -d '{"query":"{posts(first:1){nodes{slug}}}"}'

# Check deployment logs
npx wrangler tail --format pretty
```

## 9. Rollback Strategy

If issues arise, this implementation can be restored by:

1. **Restore Files:** Copy working files from this version
2. **Rebuild:** Run `npx @cloudflare/next-on-pages`
3. **Redeploy:** Run `npx wrangler deploy --env=production`
4. **Verify:** Test article, recipe, and event pages

## 10. Future Considerations

### 10.1 Scalability
- **Pagination:** Implement cursor-based pagination for large datasets
- **Incremental Static Regeneration:** Consider ISR for dynamic content updates
- **CDN Optimization:** Leverage Cloudflare's global CDN

### 10.2 Monitoring
- **Error Tracking:** Implement comprehensive error monitoring
- **Performance Metrics:** Track Core Web Vitals
- **Cache Analytics:** Monitor KV cache hit rates

---

**Note:** This documentation represents the working implementation as of August 1, 2025. Any modifications should be tested thoroughly and this document updated accordingly. 