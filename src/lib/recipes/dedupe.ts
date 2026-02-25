import type { SanityRecipe } from './clients/sanity';

// Unified recipe interface that works with both WordPress and Sanity
export interface UnifiedRecipe {
  id: string;
  title: string;
  slug: string;
  content: string;
  ingredients: string[];
  instructions: string[];
  servings?: number;
  preparationTime?: number;
  cookTime?: number;
  difficulty?: string;
  categories?: string[];
  tags?: string[];
  featuredImage?: string;
  source: 'wordpress' | 'sanity';
  wpRef?: string; // WordPress reference ID
  createdAt: string;
  updatedAt: string;
}

// Convert WordPress recipe to unified format
export function normalizeWordPressRecipe(wpRecipe: any): UnifiedRecipe {
  return {
    id: wpRecipe.id,
    title: wpRecipe.title,
    slug: wpRecipe.slug,
    content: wpRecipe.content || '',
    ingredients: wpRecipe.ingredients || [],
    instructions: wpRecipe.instructions || [],
    servings: wpRecipe.servings,
    preparationTime: wpRecipe.preparationTime,
    cookTime: wpRecipe.cookTime,
    difficulty: wpRecipe.difficulty,
    categories: wpRecipe.categories || [],
    tags: wpRecipe.tags || [],
    featuredImage: wpRecipe.featuredImageUrl,
    source: 'wordpress',
    createdAt: wpRecipe.date,
    updatedAt: wpRecipe.modified || wpRecipe.date,
  };
}

// Convert Sanity recipe to unified format
export function normalizeSanityRecipe(sanityRecipe: SanityRecipe): UnifiedRecipe {
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET || 'production';
  const assetUrl = (sanityRecipe as any)?.featuredImage?.asset?.url as string | undefined;
  const assetRef = (sanityRecipe as any)?.featuredImage?.asset?._ref as string | undefined;
  let cdnUrl: string | undefined;
  if (assetRef && projectId && dataset) {
    // assetRef format: image-<id>-<dims>-<format>
    const file = assetRef.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png').replace('-webp', '.webp');
    cdnUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/${file}`;
  }
  const finalImage = sanityRecipe.externalImageUrl || assetUrl || cdnUrl;
  return {
    id: sanityRecipe._id,
    title: sanityRecipe.title,
    slug: sanityRecipe.slug.current,
    content: sanityRecipe.content ? JSON.stringify(sanityRecipe.content) : '',
    ingredients: sanityRecipe.ingredients || [],
    instructions: sanityRecipe.instructions || [],
    servings: sanityRecipe.servings,
    preparationTime: sanityRecipe.preparationTime,
    cookTime: sanityRecipe.cookTime,
    difficulty: sanityRecipe.difficulty,
    categories: sanityRecipe.categories || [],
    tags: sanityRecipe.tags || [],
    featuredImage: finalImage,
    source: 'sanity',
    wpRef: sanityRecipe.wpRef,
    createdAt: sanityRecipe.publishedAt || sanityRecipe._createdAt,
    updatedAt: sanityRecipe._updatedAt,
  };
}

// Deduplicate recipes - WordPress takes priority
export function deduplicateRecipes(wpRecipes: any[], sanityRecipes: SanityRecipe[]): UnifiedRecipe[] {
  const unifiedRecipes: UnifiedRecipe[] = [];
  const processedSlugs = new Set<string>();

  // First, add all WordPress recipes (they take priority)
  for (const wpRecipe of wpRecipes) {
    const normalized = normalizeWordPressRecipe(wpRecipe);
    unifiedRecipes.push(normalized);
    processedSlugs.add(normalized.slug);
  }

  // Then add Sanity recipes that don't have WordPress duplicates
  for (const sanityRecipe of sanityRecipes) {
    const normalized = normalizeSanityRecipe(sanityRecipe);
    
    // Skip if we already have a WordPress version of this recipe
    if (processedSlugs.has(normalized.slug)) {
      console.log(`Skipping Sanity recipe "${normalized.title}" - WordPress version exists`);
      continue;
    }

    // Skip if this Sanity recipe has a wpRef that matches a WordPress recipe
    if (normalized.wpRef) {
      const hasWordPressVersion = wpRecipes.some(wp => wp.id === normalized.wpRef);
      if (hasWordPressVersion) {
        console.log(`Skipping Sanity recipe "${normalized.title}" - has wpRef to existing WordPress recipe`);
        continue;
      }
    }

    unifiedRecipes.push(normalized);
    processedSlugs.add(normalized.slug);
  }

  // Sort by creation date (newest first)
  unifiedRecipes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  console.log(`Deduplicated recipes: ${wpRecipes.length} WordPress + ${sanityRecipes.length} Sanity = ${unifiedRecipes.length} total`);
  
  return unifiedRecipes;
}

// Check if a recipe exists in WordPress by slug
export function findWordPressRecipeBySlug(wpRecipes: any[], slug: string): any | null {
  return wpRecipes.find(recipe => recipe.slug === slug) || null;
}

// Check if a recipe exists in Sanity by slug
export function findSanityRecipeBySlug(sanityRecipes: SanityRecipe[], slug: string): SanityRecipe | null {
  return sanityRecipes.find(recipe => recipe.slug.current === slug) || null;
}

// Check if a recipe exists in Sanity by WordPress reference
export function findSanityRecipeByWpRef(sanityRecipes: SanityRecipe[], wpRef: string): SanityRecipe | null {
  return sanityRecipes.find(recipe => recipe.wpRef === wpRef) || null;
}
