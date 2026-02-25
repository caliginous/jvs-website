import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Recipe } from '@/lib/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RecipeActionButtons from './RecipeActionButtons';
import PortableTextRenderer from '@/components/PortableTextRenderer';

// Function to strip HTML tags and clean content
function stripHtmlTags(text: string): string {
  if (!text) return '';
  return text.replace(/<[^>]*>/g, '').trim();
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

// Generate static params for all recipes
export async function generateStaticParams() { return []; }

// Get individual recipe data
async function getRecipe(slug: string): Promise<Recipe | null> {
  try {
    // Sanity-first fetch
    const { getSanityRecipeBySlug } = await import('@/lib/recipes/clients/sanity');
    const sanity = await getSanityRecipeBySlug(slug);
    if (!sanity) return null;

    const imageUrl = (sanity as any).externalImageUrl || (sanity.featuredImage ? `https://cdn.sanity.io/images/${process.env.SANITY_PROJECT_ID}/${process.env.SANITY_DATASET}/${sanity.featuredImage.asset._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png')}` : undefined);

    const recipe: Recipe = {
      id: sanity._id,
      title: sanity.title,
      slug: sanity.slug.current,
      date: sanity.publishedAt || sanity._createdAt,
      excerpt: '',
      content: sanity.content ? JSON.stringify(sanity.content) : '',
      featuredImageUrl: imageUrl,
      ingredients: Array.isArray(sanity.ingredients) ? sanity.ingredients.join('\n') : '',
      instructions: Array.isArray(sanity.instructions) ? sanity.instructions.join('\n') : '',
      servings: sanity.servings?.toString(),
      preparationTime: sanity.preparationTime?.toString(),
      cookTime: sanity.cookTime?.toString(),
      difficulty: sanity.difficulty,
      categories: sanity.categories,
      tags: sanity.tags,
      source: 'sanity',
      createdAt: sanity._createdAt,
      updatedAt: sanity._updatedAt,
      views: 0,
    };
    return recipe;
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return null;
  }
}

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = await getRecipe(slug);

  if (!recipe) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Hero Section with Image */}
      <div className="relative h-96 md:h-[500px] lg:h-[600px]">
        {recipe.featuredImageUrl ? (
          <Image
            src={recipe.featuredImageUrl}
            alt={recipe.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        

      </div>

      {/* Back to Recipes Link */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link 
          href="/recipes/" 
          className="inline-flex items-center text-green-600 hover:text-green-700 font-medium transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Recipes
        </Link>
      </div>

      {/* Recipe Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {decodeHtmlEntities(recipe.title)}
              </h1>
              
              {/* Ratings */}
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">(4.8/5)</span>
                <button className="ml-4 text-sm text-green-600 hover:text-green-700 font-medium">
                  Rate this recipe
                </button>
              </div>

              {/* Recipe Meta */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 lg:mb-0">
                  {recipe.servings && (
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">Servings</p>
                        <p className="font-medium">{recipe.servings}</p>
                      </div>
                    </div>
                  )}
                  {recipe.preparationTime && (
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">Prep Time</p>
                        <p className="font-medium">{recipe.preparationTime}</p>
                      </div>
                    </div>
                  )}
                  {recipe.cookTime && (
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">Cook Time</p>
                        <p className="font-medium">{recipe.cookTime}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Action Buttons */}
                <RecipeActionButtons recipe={recipe} />
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {(recipe.featuredImage || recipe.featuredImageUrl) && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
              <img
                src={recipe.featuredImage || recipe.featuredImageUrl}
                alt={recipe.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        )}

        {/* Description (Portable Text) */}
        {recipe.content && (() => {
          try {
            const pt = JSON.parse(recipe.content);
            if (Array.isArray(pt)) {
              return (
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    About This Recipe
                  </h2>
                  <PortableTextRenderer value={pt} />
                </div>
              );
            }
          } catch {}
          return null;
        })()}

        {/* Ingredients and Instructions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ingredients */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Ingredients
            </h2>
            {recipe.ingredients ? (
              <div className="space-y-3">
                {(() => {
                  // Handle both string (WordPress) and array (Sanity) formats
                  let ingredientsList: string[] = [];
                  
                  if (Array.isArray(recipe.ingredients)) {
                    // Sanity format: ingredients is an array
                    ingredientsList = recipe.ingredients.map((ingredient: any) => {
                      if (typeof ingredient === 'string') {
                        return ingredient;
                      } else if (ingredient && typeof ingredient === 'object') {
                        // Handle Sanity ingredient objects with amount and item
                        if (ingredient.amount && ingredient.item) {
                          return `${ingredient.amount} ${ingredient.item}`;
                        } else if (ingredient.text) {
                          return ingredient.text;
                        } else if (ingredient.item) {
                          return ingredient.item;
                        }
                      }
                      return String(ingredient);
                    });
                  } else if (typeof recipe.ingredients === 'string') {
                    // WordPress format: ingredients is a string, split by newlines
                    ingredientsList = recipe.ingredients.split('\n');
                  }
                  
                  return ingredientsList.map((ingredient, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-gray-700">{stripHtmlTags(ingredient)}</p>
                    </div>
                  ));
                })()}
              </div>
            ) : (
              <p className="text-gray-500 italic">No ingredients available</p>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Instructions
            </h2>
            {recipe.instructions ? (
              <div className="space-y-6">
                {(() => {
                  // Parse the instructions content
                  const instructions = recipe.instructions;
                  
                  // Check if it contains HTML structure
                  if (instructions.includes('<strong>') || instructions.includes('<ol>')) {
                    // Split by numbered sections (1., 2., 3., etc.)
                    const sections = instructions.split(/(?=\d+\.\s*<strong>)/);
                    
                    return sections.map((section, sectionIndex) => {
                      if (!section.trim()) return null;
                      
                      // Extract section title
                      const titleMatch = section.match(/<strong>(.*?)<\/strong>/);
                      const title = titleMatch ? stripHtmlTags(titleMatch[1]) : `Step ${sectionIndex + 1}`;
                      
                      // Extract the content after the title
                      const content = section.replace(/^\d+\.\s*<strong>.*?<\/strong>/, '').trim();
                      
                      // Parse ordered list items
                      const listItems = content.match(/<li>(.*?)<\/li>/g);
                      
                      return (
                        <div key={sectionIndex} className="border-l-4 border-green-600 pl-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
                          {listItems ? (
                            <div className="space-y-2">
                              {listItems.map((item, itemIndex) => {
                                const cleanItem = stripHtmlTags(item);
                                return (
                                  <div key={itemIndex} className="flex items-start">
                                    <div className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">
                                      {itemIndex + 1}
                                    </div>
                                    <p className="text-gray-700">{cleanItem}</p>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-gray-700">{stripHtmlTags(content)}</p>
                          )}
                        </div>
                      );
                    });
                  } else {
                    // Fallback to simple line-by-line display
                    let lines: string[] = [];
                    
                    if (Array.isArray(recipe.instructions)) {
                      // Sanity format: instructions is an array
                      lines = recipe.instructions.map((instruction: any) => {
                        if (typeof instruction === 'string') {
                          return stripHtmlTags(instruction).trim();
                        } else if (instruction && typeof instruction === 'object') {
                          // Handle Sanity instruction objects with text
                          if (instruction.text) {
                            return stripHtmlTags(instruction.text).trim();
                          }
                        }
                        return stripHtmlTags(String(instruction)).trim();
                      });
                    } else if (typeof recipe.instructions === 'string') {
                      // WordPress format: instructions is a string, split by newlines
                      lines = recipe.instructions.split('\n')
                        .map(line => stripHtmlTags(line).trim());
                    }
                    
                    // Filter out empty lines
                    lines = lines.filter(line => line.length > 0);
                    
                    return lines.map((instruction, index) => (
                      <div key={index} className="flex">
                        <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-gray-700">{instruction}</p>
                      </div>
                    ));
                  }
                })()}
              </div>
            ) : (
              <p className="text-gray-500 italic">No instructions available</p>
            )}
          </div>
        </div>

        {/* Categories and Tags */}
        {((recipe.categories && recipe.categories.length > 0) || (recipe.tags && recipe.tags.length > 0)) && (
          <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Categories & Tags</h2>
            <div className="flex flex-wrap gap-2">
              {recipe.categories?.map((category, index) => (
                <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {category}
                </span>
              ))}
              {recipe.tags?.map((tag, index) => (
                <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Recipe Description */}
        {recipe.excerpt && (
          <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">About this Recipe</h2>
            <p className="text-gray-700 leading-relaxed">{recipe.excerpt}</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
} 