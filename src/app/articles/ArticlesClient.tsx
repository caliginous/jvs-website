'use client';

import { Post } from '@/lib/types';
import { useState, useMemo } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface ArticlesClientProps {
  initialArticles: Post[];
}

interface EnhancedArticle extends Post {
  readingTime: string;
  views: number;
  shares: number;
}

// Function to safely render text content with aggressive sanitization
function safeText(text: string | null | undefined): string {
  if (!text || typeof text !== 'string') return '';
  
  // Remove all control characters and problematic Unicode
  const cleanText = text
    .replace(/[\u0000-\u001F\u007F-\u009F\uFFFE\uFFFF]/g, '') // Remove control characters
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width characters
    .replace(/[\u2028\u2029]/g, ' ') // Replace line/paragraph separators with spaces
    .trim();
  
  // Decode HTML entities
  const decodedText = cleanText
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&nbsp;/g, ' ');
  
  // Final safety check - if still problematic, return empty string
  if (decodedText.includes('\u0000') || decodedText.includes('\uFFFE') || decodedText.includes('\uFFFF')) {
    return '';
  }
  
  return decodedText;
}

export default function ArticlesClient({ initialArticles }: ArticlesClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState<string>(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || '');
  const [displayCount, setDisplayCount] = useState(50); // Increased from 20 to 50
  
  // Debug logging
  console.log('ArticlesClient received:', initialArticles.length, 'articles');
  
  // Add placeholder data for enhanced features and filter out articles without slugs
  const enhancedArticles: EnhancedArticle[] = initialArticles
    .filter(article => article.slug && article.slug.trim() !== '') // Filter out articles without valid slugs
    .filter(article => {
      // Exclude recipe-related content and categories
      if (article.categories?.nodes) {
        const excludedCategories = [
          'recipefeature',     // Recipe-specific category
          'welcome',           // Welcome pages are not articles
          'sides and salads',  // Recipe category
          'sides and snacks',  // Recipe category
          'soups and salads',  // Recipe category
          'main courses',      // Recipe category
          'baking',           // Recipe category
          'desserts',         // Recipe category
          'recipe',           // General recipe category
          'recipes',          // General recipe category
          'cooking',          // Cooking-related content
          'food preparation', // Food prep content
          'ingredients'       // Ingredients content
        ];
        
        // Exclude if ANY category is in the excluded list (recipe content)
        const hasExcludedCategory = article.categories.nodes.some(category => 
          excludedCategories.includes(category.name.toLowerCase())
        );
        
        return !hasExcludedCategory;
      }
      return true;
    })
    .map((article) => {
      return {
        ...article,
        readingTime: `${Math.max(1, Math.ceil((article.content?.length || 0) / 200))} MIN`,
        views: Math.floor(Math.random() * 100) + 10,
        shares: Math.floor(Math.random() * 20) + 1
      };
    });

  // Debug logging
  console.log('After filtering:', enhancedArticles.length, 'articles');
  console.log('Excluded category articles removed:', initialArticles.length - enhancedArticles.length);

  // Extract unique categories from all articles (excluding recipe and non-article categories)
  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    const excludedCategories = [
      'recipefeature',     // Recipe-specific category
      'uncategorised',     // Generic/empty category
      'uncategorized',     // Generic/empty category  
      'welcome',           // Welcome pages are not articles
      'blog category #1',  // Placeholder category to remove
      'blog category #2',  // Placeholder category to remove
      'sides and salads',  // Recipe category
      'sides and snacks',  // Recipe category
      'soups and salads',  // Recipe category
      'main courses',      // Recipe category
      'baking',           // Recipe category
      'desserts',         // Recipe category
      'recipe',           // General recipe category
      'recipes',          // General recipe category
      'cooking',          // Cooking-related content
      'food preparation', // Food prep content
      'ingredients'       // Ingredients content
    ];
    
    enhancedArticles.forEach(article => {
      if (article.categories?.nodes) {
        article.categories.nodes.forEach(category => {
          if (category.name.trim() && !excludedCategories.includes(category.name.toLowerCase())) {
            categories.add(category.name.trim());
          }
        });
      }
    });
    return Array.from(categories).sort();
  }, [enhancedArticles]);

  // Filter articles by search term and selected category (client-side mirror)
  const filteredArticles = enhancedArticles.filter((article: EnhancedArticle) => {
    const matchesSearch = !searchTerm || article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (article.excerpt && article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !selectedCategory || (article.categories?.nodes?.some(c => c.name === selectedCategory));
    return matchesSearch && matchesCategory;
  });

  // Get articles to display (limited by displayCount)
  const displayedArticles = filteredArticles.slice(0, displayCount);
  const hasMoreArticles = displayCount < filteredArticles.length;

  const updateUrl = (q: string, category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (q) params.set('q', q); else params.delete('q');
    if (category) params.set('category', category); else params.delete('category');
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const handleCategoryClick = (category: string) => {
    const next = selectedCategory === category ? '' : category;
    setSelectedCategory(next);
    setDisplayCount(50);
    updateUrl(searchTerm, next);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setDisplayCount(50); // Reset to initial count when filters are cleared
    updateUrl('', '');
  };

  const loadMoreArticles = () => {
    setDisplayCount(prev => Math.min(prev + 50, filteredArticles.length));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setDisplayCount(50); // Reset to initial count when search changes
    updateUrl(e.target.value, selectedCategory);
  };

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Articles</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Insights, stories, and perspectives on Jewish veganism and sustainability
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Category Cloud (single-select) */}
        {allCategories.length > 0 && (
          <div className="mb-8">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Filter by Category</h3>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {allCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                      selectedCategory === category
                        ? 'bg-green-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              {(searchTerm || selectedCategory) && (
                <button
                  onClick={clearAllFilters}
                  className="text-green-600 hover:text-green-700 text-sm font-medium underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* Article Count */}
        <div className="text-center mb-8">
          <p className="text-gray-600">
            Showing {displayedArticles.length} of {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found
            {(searchTerm || selectedCategory) && (
              <span className="text-sm text-gray-500 ml-2">
                (filtered from {enhancedArticles.length} total)
              </span>
            )}
            {!searchTerm && !selectedCategory && (
              <span className="text-sm text-gray-500 ml-2">
                (from {initialArticles.length} total articles in database)
              </span>
            )}
          </p>
        </div>

        {/* Article Grid */}
        {displayedArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedArticles.map((article: EnhancedArticle) => (
              <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* Featured Image */}
                <div className="relative h-48 overflow-hidden">
                  {article.featuredImage?.node?.sourceUrl ? (
                    <Image
                      src={article.featuredImage.node.sourceUrl}
                      alt={article.featuredImage.node.altText || article.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {safeText(article.title)}
                  </h3>
                  
                  {/* Categories */}
                  {article.categories?.nodes && article.categories.nodes.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {article.categories.nodes.slice(0, 3).map((category, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
                        >
                          {safeText(category.name)}
                        </span>
                      ))}
                      {article.categories.nodes.length > 3 && (
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                          +{article.categories.nodes.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Excerpt */}
                  {article.excerpt && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {safeText(article.excerpt.replace(/<[^>]*>/g, ''))}
                    </p>
                  )}
                  
                  {/* Article Details */}
                  <div className="mb-4 space-y-2">
                    {article.author && (
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>{safeText(article.author.node.name)}</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{new Date(article.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {/* Metadata Row */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">
                      {new Date(article.date).toLocaleDateString()}
                    </span>
                    <span className="text-sm text-gray-500">
                      {article.readingTime}
                    </span>
                  </div>
                  
                  {/* Engagement Metrics */}
                  <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>{article.views}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                      <span>{article.shares}</span>
                    </div>
                  </div>
                  
                  {/* View Article Button */}
                  <Link
                    href={`/articles/${article.slug}`}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                  >
                    Read Article
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {searchTerm || !!selectedCategory 
                ? 'No articles found matching your filters.' 
                : 'No articles available.'
              }
            </p>
            {(searchTerm || !!selectedCategory) && (
              <button
                onClick={clearAllFilters}
                className="mt-4 text-green-600 hover:text-green-700 font-medium underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {hasMoreArticles && (
          <div className="text-center mt-12">
            <button
              onClick={loadMoreArticles}
              className="text-green-600 hover:text-green-700 text-sm font-medium underline"
            >
              Load More Articles
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 