'use client';

import { Recipe } from '@/lib/types';
import { useState, useMemo } from 'react';
import Image from 'next/image';

interface RecipeClientProps {
  initialRecipes: Recipe[];
}

interface EnhancedRecipe extends Recipe {
  readingTime: string;
  shares: number;
}

// Function to decode HTML entities
function decodeHtmlEntities(text: string): string {
  if (!text) return '';
  return text
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
}

export default function RecipeClient({ initialRecipes }: RecipeClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [displayCount, setDisplayCount] = useState(20); // Show 20 recipes initially
  
  // Add placeholder data for enhanced features if not available and filter out recipes without slugs
  const enhancedRecipes: EnhancedRecipe[] = initialRecipes
    .filter(recipe => recipe.slug && recipe.slug.trim() !== '') // Filter out recipes without valid slugs
    .map((recipe) => {
      return {
        ...recipe,
        readingTime: `${Math.max(1, Math.ceil((recipe.content?.length || 0) / 200))} MIN`,
        views: recipe.views !== undefined ? recipe.views : Math.floor(Math.random() * 50) + 5,
        shares: Math.floor(Math.random() * 10)
      };
    });

  // Extract unique categories from all recipes
  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    enhancedRecipes.forEach(recipe => {
      if (recipe.categories) {
        recipe.categories.forEach(category => {
          if (category.trim()) {
            categories.add(category.trim());
          }
        });
      }
    });
    return Array.from(categories).sort();
  }, [enhancedRecipes]);

  // Filter recipes by search term and selected categories
  const filteredRecipes = enhancedRecipes.filter((recipe: EnhancedRecipe) => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategories = selectedCategories.length === 0 || 
      (recipe.categories && selectedCategories.some(cat => 
        recipe.categories!.includes(cat)
      ));
    
    return matchesSearch && matchesCategories;
  });

  // Get recipes to display (limited by displayCount)
  const displayedRecipes = filteredRecipes.slice(0, displayCount);
  const hasMoreRecipes = displayCount < filteredRecipes.length;

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(cat => cat !== category)
        : [...prev, category]
    );
    setDisplayCount(20); // Reset to initial count when filters change
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setDisplayCount(20); // Reset to initial count when filters are cleared
  };

  const loadMoreRecipes = () => {
    setDisplayCount(prev => Math.min(prev + 20, filteredRecipes.length));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setDisplayCount(20); // Reset to initial count when search changes
  };

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Vegan Recipes</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover delicious vegetarian and vegan recipes inspired by Jewish culinary traditions
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search recipes..."
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

        {/* Category Cloud */}
        {allCategories.length > 0 && (
          <div className="mb-8">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Filter by Category</h3>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {allCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryToggle(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                      selectedCategories.includes(category)
                        ? 'bg-green-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              {(searchTerm || selectedCategories.length > 0) && (
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

        {/* Recipe Count */}
        <div className="text-center mb-8">
          <p className="text-gray-600">
            Showing {displayedRecipes.length} of {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} found
            {(searchTerm || selectedCategories.length > 0) && (
              <span className="text-sm text-gray-500 ml-2">
                (filtered from {enhancedRecipes.length} total)
              </span>
            )}
          </p>
        </div>

        {/* Recipe Grid */}
        {displayedRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedRecipes.map((recipe: EnhancedRecipe) => (
              <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* Featured Image */}
                <div className="relative h-48 overflow-hidden">
                  {recipe.featuredImageUrl ? (
                    <Image
                      src={recipe.featuredImageUrl}
                      alt={recipe.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {decodeHtmlEntities(recipe.title)}
                  </h3>
                  
                  {/* Categories */}
                  {recipe.categories && recipe.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {recipe.categories.slice(0, 3).map((category, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
                        >
                          {category}
                        </span>
                      ))}
                      {recipe.categories.length > 3 && (
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                          +{recipe.categories.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Excerpt */}
                  {recipe.excerpt && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {recipe.excerpt}
                    </p>
                  )}
                  
                  {/* Recipe Details */}
                  <div className="mb-4 space-y-2">
                    {recipe.servings && (
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>{recipe.servings}</span>
                      </div>
                    )}
                    {recipe.preparationTime && (
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Prep: {recipe.preparationTime}</span>
                      </div>
                    )}
                    {recipe.cookTime && (
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Cook: {recipe.cookTime}</span>
                      </div>
                    )}
                    {recipe.difficulty && (
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span>{recipe.difficulty}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Metadata Row */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">
                      {new Date(recipe.date).toLocaleDateString()}
                    </span>
                    <span className="text-sm text-gray-500">
                      {recipe.readingTime}
                    </span>
                  </div>
                  
                  {/* Engagement Metrics */}
                  <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>{recipe.views}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                      <span>{recipe.shares}</span>
                    </div>
                  </div>
                  
                  {/* View Recipe Button */}
                  <a
                    href={`/recipes/${recipe.slug}`}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                  >
                    View Recipe
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {searchTerm || selectedCategories.length > 0 
                ? 'No recipes found matching your filters.' 
                : 'No recipes available.'
              }
            </p>
            {(searchTerm || selectedCategories.length > 0) && (
              <button
                onClick={clearAllFilters}
                className="mt-4 text-green-600 hover:text-green-700 font-medium underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {hasMoreRecipes && (
          <div className="text-center mt-12">
            <button
              onClick={loadMoreRecipes}
              className="text-green-600 hover:text-green-700 text-sm font-medium underline"
            >
              Load More Recipes
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 