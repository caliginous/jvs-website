import { createClient } from '@sanity/client';
import { unstable_cache } from 'next/cache';

// Sanity client configuration
const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || 'lyq4b3pa',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: false, // We want fresh data for articles
  token: process.env.SANITY_API_TOKEN,
};

const sanityClient = createClient(sanityConfig);

// TypeScript interfaces for Sanity data
export interface SanityAuthor {
  _id: string;
  name: string;
  slug: { current: string };
  bio?: string;
  avatar?: {
    asset: {
      _ref: string;
    };
  };
  email?: string;
  website?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    facebook?: string;
  };
  wpRef?: string;
}

export interface SanityCategory {
  _id: string;
  name: string;
  slug: { current: string };
  description?: string;
  color?: string;
  icon?: string;
  featured?: boolean;
  parent?: {
    _ref: string;
  };
  wpRef?: string;
}

export interface SanityArticle {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  content: any[]; // Portable Text blocks
  featuredImage?: {
    asset: {
      _ref: string;
    };
    alt?: string;
    caption?: string;
  };
  externalImageUrl?: string;
  author: {
    _ref: string;
  };
  categories: Array<{
    _ref: string;
  }>;
  tags?: string[];
  publishedAt: string;
  status: 'draft' | 'published' | 'archived';
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    ogTitle?: string;
    ogDescription?: string;
    ogImageUrl?: string;
  };
  wpRef?: string;
  _createdAt: string;
  _updatedAt: string;
}

// Fetch all published articles with expanded author and category data
export async function getSanityArticles(): Promise<SanityArticle[]> {
  try {
    const query = `*[_type == "article" && status == "published"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      content,
      featuredImage {
        asset-> {
          _id,
          url
        },
        alt,
        caption
      },
      externalImageUrl,
      author-> {
        _id,
        name,
        slug,
        bio,
        avatar {
          asset-> {
            _id,
            url
          }
        },
        email,
        website,
        social,
        wpRef
      },
      categories[]-> {
        _id,
        name,
        slug,
        description,
        color,
        icon,
        featured,
        wpRef
      },
      tags,
      publishedAt,
      status,
      seo,
      wpRef,
      _createdAt,
      _updatedAt
    }`;

    const articles = await sanityClient.fetch(query);
    return articles;
  } catch (error) {
    console.error('Error fetching Sanity articles:', error);
    return [];
  }
}

// Fetch a single article by slug
export async function getSanityArticleBySlug(slug: string): Promise<SanityArticle | null> {
  try {
    const query = `*[_type == "article" && slug.current == $slug && status == "published"][0] {
      _id,
      title,
      slug,
      excerpt,
      content,
      featuredImage {
        asset-> {
          _id,
          url
        },
        alt,
        caption
      },
      externalImageUrl,
      author-> {
        _id,
        name,
        slug,
        bio,
        avatar {
          asset-> {
            _id,
            url
          }
        },
        email,
        website,
        social,
        wpRef
      },
      categories[]-> {
        _id,
        name,
        slug,
        description,
        color,
        icon,
        featured,
        wpRef
      },
      tags,
      publishedAt,
      status,
      seo,
      wpRef,
      _createdAt,
      _updatedAt
    }`;

    const article = await sanityClient.fetch(query, { slug });
    return article;
  } catch (error) {
    console.error(`Error fetching Sanity article with slug ${slug}:`, error);
    return null;
  }
}

// Cached wrappers with tags for revalidation
// Avoid caching entire large lists to prevent 2MB cache item warnings; fetch fresh with page-level revalidate
export async function getSanityArticlesCached() {
  return await getSanityArticles();
}

export async function getSanityArticleBySlugCached(slug: string) {
  return await getSanityArticleBySlug(slug);
}

// Fetch all authors
export async function getSanityAuthors(): Promise<SanityAuthor[]> {
  try {
    const query = `*[_type == "author"] | order(name asc) {
      _id,
      name,
      slug,
      bio,
      avatar {
        asset-> {
          _id,
          url
        }
      },
      email,
      website,
      social,
      wpRef
    }`;

    const authors = await sanityClient.fetch(query);
    return authors;
  } catch (error) {
    console.error('Error fetching Sanity authors:', error);
    return [];
  }
}

// Fetch all categories
export async function getSanityCategories(): Promise<SanityCategory[]> {
  try {
    const query = `*[_type == "category"] | order(name asc) {
      _id,
      name,
      slug,
      description,
      color,
      icon,
      featured,
      parent-> {
        _id,
        name,
        slug
      },
      wpRef
    }`;

    const categories = await sanityClient.fetch(query);
    return categories;
  } catch (error) {
    console.error('Error fetching Sanity categories:', error);
    return [];
  }
}

// Fetch articles by category
export async function getSanityArticlesByCategory(categorySlug: string): Promise<SanityArticle[]> {
  try {
    const query = `*[_type == "article" && status == "published" && $categorySlug in categories[]->slug.current] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      content,
      featuredImage {
        asset-> {
          _id,
          url
        },
        alt,
        caption
      },
      author-> {
        _id,
        name,
        slug,
        bio,
        avatar {
          asset-> {
            _id,
            url
          }
        },
        email,
        website,
        social,
        wpRef
      },
      categories[]-> {
        _id,
        name,
        slug,
        description,
        color,
        icon,
        featured,
        wpRef
      },
      tags,
      publishedAt,
      status,
      seo,
      wpRef,
      _createdAt,
      _updatedAt
    }`;

    const articles = await sanityClient.fetch(query, { categorySlug });
    return articles;
  } catch (error) {
    console.error(`Error fetching Sanity articles for category ${categorySlug}:`, error);
    return [];
  }
}

// Fetch articles by tag (string tag match)
export async function getSanityArticlesByTag(tag: string): Promise<SanityArticle[]> {
  try {
    const query = `*[_type == "article" && status == "published" && $tag in tags] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      content,
      featuredImage { asset-> { _id, url }, alt, caption },
      externalImageUrl,
      author-> { _id, name, slug },
      categories[]-> { _id, name, slug },
      tags,
      publishedAt,
      status,
      seo,
      wpRef,
      _createdAt,
      _updatedAt
    }`;
    return await sanityClient.fetch(query, { tag });
  } catch (error) {
    console.error(`Error fetching Sanity articles for tag ${tag}:`, error);
    return [];
  }
}

// Search articles by title or content
export async function searchSanityArticles(searchTerm: string): Promise<SanityArticle[]> {
  try {
    const query = `*[_type == "article" && status == "published" && (title match "*${searchTerm}*" || excerpt match "*${searchTerm}*")] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      content,
      featuredImage {
        asset-> {
          _id,
          url
        },
        alt,
        caption
      },
      author-> {
        _id,
        name,
        slug,
        bio,
        avatar {
          asset-> {
            _id,
            url
          }
        },
        email,
        website,
        social,
        wpRef
      },
      categories[]-> {
        _id,
        name,
        slug,
        description,
        color,
        icon,
        featured,
        wpRef
      },
      tags,
      publishedAt,
      status,
      seo,
      wpRef,
      _createdAt,
      _updatedAt
    }`;

    const articles = await sanityClient.fetch(query);
    return articles;
  } catch (error) {
    console.error(`Error searching Sanity articles for "${searchTerm}":`, error);
    return [];
  }
}
