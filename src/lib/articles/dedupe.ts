import type { Post } from '@/lib/types';
import type { SanityArticle } from './clients/sanity';

// Unified article interface that works with both WordPress and Sanity data
export interface UnifiedArticle {
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
  source: 'wordpress' | 'sanity';
  createdAt?: string;
  updatedAt?: string;
}

// Normalize WordPress article to unified format
export function normalizeWordPressArticle(wordpressArticle: Post): UnifiedArticle {
  return {
    id: wordpressArticle.id,
    title: wordpressArticle.title,
    slug: wordpressArticle.slug,
    excerpt: wordpressArticle.excerpt,
    content: wordpressArticle.content,
    date: wordpressArticle.date,
    author: wordpressArticle.author,
    featuredImage: wordpressArticle.featuredImage,
    categories: wordpressArticle.categories,
    tags: wordpressArticle.tags,
    source: 'wordpress',
    createdAt: wordpressArticle.date,
    updatedAt: wordpressArticle.date,
  };
}

// Normalize Sanity article to unified format
export function normalizeSanityArticle(sanityArticle: SanityArticle): UnifiedArticle {
  // Convert Portable Text content to HTML string
  const contentHtml = sanityArticle.content ? convertPortableTextToHtml(sanityArticle.content) : '';
  
  // Convert Sanity categories to WordPress format
  const categories = sanityArticle.categories ? {
    nodes: sanityArticle.categories.map(cat => ({
      name: cat.name,
      slug: cat.slug.current,
    }))
  } : undefined;

  // Convert Sanity tags to WordPress format
  const tags = sanityArticle.tags ? {
    nodes: sanityArticle.tags.map(tag => ({
      name: tag,
      slug: tag.toLowerCase().replace(/\s+/g, '-'),
    }))
  } : undefined;

  // Convert Sanity author to WordPress format
  const author = sanityArticle.author ? {
    node: {
      name: sanityArticle.author.name,
    }
  } : undefined;

  // Convert Sanity featured image to WordPress format
  const featuredImage = sanityArticle.featuredImage ? {
    node: {
      sourceUrl: sanityArticle.externalImageUrl || sanityArticle.featuredImage.asset.url,
      altText: sanityArticle.featuredImage.alt || sanityArticle.title,
    }
  } : undefined;

  return {
    id: sanityArticle._id,
    title: sanityArticle.title,
    slug: sanityArticle.slug.current,
    excerpt: sanityArticle.excerpt,
    content: contentHtml,
    date: sanityArticle.publishedAt,
    author,
    featuredImage,
    categories,
    tags,
    source: 'sanity',
    createdAt: sanityArticle.publishedAt || sanityArticle._createdAt,
    updatedAt: sanityArticle._updatedAt,
  };
}

// Convert Sanity Portable Text to HTML
export function convertPortableTextToHtml(blocks: any[]): string {
  if (!Array.isArray(blocks)) return '';
  
  return blocks.map(block => {
    // Handle different block types
    if (block._type === 'block') {
      const text = block.children?.map((child: any) => {
        let textContent = child.text || '';
        
        // Apply marks (bold, italic, etc.)
        if (child.marks) {
          child.marks.forEach((mark: string) => {
            switch (mark) {
              case 'strong':
                textContent = `<strong>${textContent}</strong>`;
                break;
              case 'em':
                textContent = `<em>${textContent}</em>`;
                break;
              case 'code':
                textContent = `<code>${textContent}</code>`;
                break;
            }
          });
        }
        
        // Handle links
        if (block.markDefs) {
          block.markDefs.forEach((markDef: any) => {
            if (markDef._type === 'link' && child.marks?.includes(markDef._key)) {
              textContent = `<a href="${markDef.href}" target="_blank" rel="noopener noreferrer">${textContent}</a>`;
            }
          });
        }
        
        return textContent;
      }).join('') || '';
      
      // Wrap in appropriate HTML tag based on style
      switch (block.style) {
        case 'h1':
          return `<h1>${text}</h1>`;
        case 'h2':
          return `<h2>${text}</h2>`;
        case 'h3':
          return `<h3>${text}</h3>`;
        case 'h4':
          return `<h4>${text}</h4>`;
        case 'blockquote':
          return `<blockquote>${text}</blockquote>`;
        default:
          return `<p>${text}</p>`;
      }
    }
    
    // Handle images
    if (block._type === 'image') {
      const src = block.asset?.url || '';
      const alt = block.alt || '';
      const caption = block.caption ? `<figcaption>${block.caption}</figcaption>` : '';
      return `<figure><img src="${src}" alt="${alt}" />${caption}</figure>`;
    }
    
    // Handle code blocks
    if (block._type === 'code') {
      const code = block.code || '';
      const language = block.language || '';
      return `<pre><code class="language-${language}">${code}</code></pre>`;
    }
    
    return '';
  }).join('');
}

// Deduplicate articles from WordPress and Sanity
export function deduplicateArticles(wordpressArticles: Post[], sanityArticles: SanityArticle[]): UnifiedArticle[] {
  const normalizedWordPress = wordpressArticles.map(normalizeWordPressArticle);
  const normalizedSanity = sanityArticles.map(normalizeSanityArticle);
  
  // Create a map to track articles by slug
  const articleMap = new Map<string, UnifiedArticle>();
  
  // Add WordPress articles first (they have priority)
  normalizedWordPress.forEach(article => {
    articleMap.set(article.slug, article);
  });
  
  // Add Sanity articles, but only if they don't conflict with WordPress articles
  normalizedSanity.forEach(article => {
    if (!articleMap.has(article.slug)) {
      articleMap.set(article.slug, article);
    } else {
      // If there's a conflict, check if the Sanity article is newer
      const existing = articleMap.get(article.slug)!;
      const existingDate = new Date(existing.updatedAt || existing.date);
      const sanityDate = new Date(article.updatedAt || article.date);
      
      if (sanityDate > existingDate) {
        articleMap.set(article.slug, article);
      }
    }
  });
  
  // Convert map back to array and sort by date (newest first)
  const deduplicatedArticles = Array.from(articleMap.values());
  deduplicatedArticles.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });
  
  return deduplicatedArticles;
}

// Get unique categories from all articles
export function getUniqueCategories(articles: UnifiedArticle[]): string[] {
  const categorySet = new Set<string>();
  
  articles.forEach(article => {
    if (article.categories?.nodes) {
      article.categories.nodes.forEach(category => {
        categorySet.add(category.name);
      });
    }
  });
  
  return Array.from(categorySet).sort();
}

// Filter articles by category
export function filterArticlesByCategory(articles: UnifiedArticle[], categoryName: string): UnifiedArticle[] {
  return articles.filter(article => 
    article.categories?.nodes?.some(category => 
      category.name.toLowerCase() === categoryName.toLowerCase()
    )
  );
}

// Search articles by title or excerpt
export function searchArticles(articles: UnifiedArticle[], searchTerm: string): UnifiedArticle[] {
  const term = searchTerm.toLowerCase();
  
  return articles.filter(article => 
    article.title.toLowerCase().includes(term) ||
    (article.excerpt && article.excerpt.toLowerCase().includes(term))
  );
}
