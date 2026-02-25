// Feature flags for the article system
// These control whether Sanity articles are enabled and aggregated with WordPress articles

// Enable article aggregation (combining WordPress and Sanity articles)
export const AGGREGATION_ENABLED = true;

// Enable Sanity articles (derived from environment variables)
export const SANITY_ENABLED = !!(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
  process.env.NEXT_PUBLIC_SANITY_DATASET &&
  process.env.SANITY_API_TOKEN
);

// Enable article revalidation endpoint
export const REVALIDATION_ENABLED = !!process.env.REVALIDATE_ARTICLES_SECRET;

// Enable article search functionality
export const SEARCH_ENABLED = true;

// Enable article category filtering
export const CATEGORY_FILTERING_ENABLED = true;

// Enable article tags
export const TAGS_ENABLED = true;

// Enable article SEO metadata
export const SEO_ENABLED = true;

// Enable article reading time calculation
export const READING_TIME_ENABLED = true;

// Enable article view/share tracking (placeholder data)
export const ANALYTICS_ENABLED = false; // Set to true when real analytics are implemented

// Enable article author profiles
export const AUTHOR_PROFILES_ENABLED = true;

// Enable article featured images
export const FEATURED_IMAGES_ENABLED = true;

// Enable article excerpts
export const EXCERPTS_ENABLED = true;

// Enable article content blocks (Portable Text)
export const CONTENT_BLOCKS_ENABLED = true;
