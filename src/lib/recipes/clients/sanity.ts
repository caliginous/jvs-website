import { createClient } from '@sanity/client';
import { unstable_cache } from 'next/cache';

// Lazily create a Sanity client at runtime so env is read per-request (avoids build-time inlining)
function getSanityClient() {
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET || 'production';
  if (!projectId || !dataset) {
    return null;
  }
  return createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN || undefined,
  });
}

// Recipe schema type
export interface SanityRecipe {
  _id: string;
  _type: 'recipe';
  title: string;
  slug: { current: string };
  content: any[];
  ingredients: string[];
  instructions: string[];
  servings?: number;
  preparationTime?: number;
  cookTime?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  categories?: string[];
  tags?: string[];
  featuredImage?: {
    asset?: {
      _ref?: string;
      _id?: string;
      url?: string;
    };
  };
  externalImageUrl?: string;
  wpRef?: string; // WordPress reference ID
  publishedAt?: string;
  _createdAt: string;
  _updatedAt: string;
}

// Create a new recipe in Sanity
export async function createSanityRecipe(recipeData: Omit<SanityRecipe, '_id' | '_type' | 'createdAt' | 'updatedAt'>): Promise<SanityRecipe | null> {
  const sanityClient = getSanityClient();
  if (!sanityClient) {
    console.log('Sanity client not available');
    return null;
  }

  try {
    const doc = {
      _type: 'recipe',
      ...recipeData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await sanityClient.create(doc);
    console.log('Created Sanity recipe:', result._id);
    return result as SanityRecipe;
  } catch (error) {
    console.error('Error creating Sanity recipe:', error);
    return null;
  }
}

// Get all recipes from Sanity
export async function getSanityRecipes(): Promise<SanityRecipe[]> {
  const sanityClient = getSanityClient();
  if (!sanityClient) {
    console.log('Sanity client not available');
    return [];
  }

  try {
    const query = `*[_type == "recipe"] | order(_createdAt desc) {
      _id,
      _type,
      title,
      slug,
      content,
      ingredients,
      instructions,
      servings,
      preparationTime,
      cookTime,
      difficulty,
      categories,
      tags,
      featuredImage {
        asset-> { _id, url }
      },
      externalImageUrl,
      wpRef,
      publishedAt,
      _createdAt,
      _updatedAt
    }`;

    const recipes = await sanityClient.fetch<SanityRecipe[]>(query);
    console.log(`Fetched ${recipes.length} recipes from Sanity`);
    return recipes;
  } catch (error) {
    console.error('Error fetching Sanity recipes:', error);
    return [];
  }
}

// Get a single recipe by slug
export async function getSanityRecipeBySlug(slug: string): Promise<SanityRecipe | null> {
  const sanityClient = getSanityClient();
  if (!sanityClient) {
    console.log('Sanity client not available');
    return null;
  }

  try {
    const query = `*[_type == "recipe" && slug.current == $slug][0] {
      _id,
      _type,
      title,
      slug,
      content,
      ingredients,
      instructions,
      servings,
      preparationTime,
      cookTime,
      difficulty,
      categories,
      tags,
      featuredImage,
      externalImageUrl,
      wpRef,
      publishedAt,
      _createdAt,
      _updatedAt
    }`;

    const recipe = await sanityClient.fetch<SanityRecipe>(query, { slug });
    return recipe;
  } catch (error) {
    console.error('Error fetching Sanity recipe by slug:', error);
    return null;
  }
}

export async function getSanityRecipesByCategory(category: string): Promise<SanityRecipe[]> {
  const sanityClient = getSanityClient();
  if (!sanityClient) return [];
  try {
    const query = `*[_type == "recipe" && $category in categories] | order(_createdAt desc) {
      _id, _type, title, slug, content, ingredients, instructions, servings, preparationTime, cookTime, difficulty, categories, tags, featuredImage, externalImageUrl, wpRef, publishedAt, _createdAt, _updatedAt
    }`;
    return await sanityClient.fetch<SanityRecipe[]>(query, { category });
  } catch (e) {
    console.error('Error fetching recipes by category:', e);
    return [];
  }
}

export async function getSanityRecipesByTag(tag: string): Promise<SanityRecipe[]> {
  const sanityClient = getSanityClient();
  if (!sanityClient) return [];
  try {
    const query = `*[_type == "recipe" && $tag in tags] | order(_createdAt desc) {
      _id, _type, title, slug, content, ingredients, instructions, servings, preparationTime, cookTime, difficulty, categories, tags, featuredImage, externalImageUrl, wpRef, publishedAt, _createdAt, _updatedAt
    }`;
    return await sanityClient.fetch<SanityRecipe[]>(query, { tag });
  } catch (e) {
    console.error('Error fetching recipes by tag:', e);
    return [];
  }
}

export async function searchSanityRecipes(q: string): Promise<SanityRecipe[]> {
  const sanityClient = getSanityClient();
  if (!sanityClient) return [];
  try {
    const query = `*[_type == "recipe" && (title match $m || pt::text(ingredients) match $m || pt::text(instructions) match $m)] | order(_createdAt desc) {
      _id, _type, title, slug, content, ingredients, instructions, servings, preparationTime, cookTime, difficulty, categories, tags, featuredImage, externalImageUrl, wpRef, publishedAt, _createdAt, _updatedAt
    }`;
    return await sanityClient.fetch<SanityRecipe[]>(query, { m: `*${q}*` });
  } catch (e) {
    console.error('Error searching recipes:', e);
    return [];
  }
}

// Cached wrappers with tags
// Avoid caching the entire list; rely on page-level revalidate
export async function getSanityRecipesCached() {
  return await getSanityRecipes();
}

export async function getSanityRecipeBySlugCached(slug: string) {
  return await getSanityRecipeBySlug(slug);
}

// Update a recipe in Sanity
export async function updateSanityRecipe(id: string, updates: Partial<SanityRecipe>): Promise<SanityRecipe | null> {
  const sanityClient = getSanityClient();
  if (!sanityClient) {
    console.log('Sanity client not available');
    return null;
  }

  try {
    const result = await sanityClient
      .patch(id)
      .set({
        ...updates,
        updatedAt: new Date().toISOString(),
      })
      .commit();

    console.log('Updated Sanity recipe:', id);
    return result as SanityRecipe;
  } catch (error) {
    console.error('Error updating Sanity recipe:', error);
    return null;
  }
}

// Delete a recipe from Sanity
export async function deleteSanityRecipe(id: string): Promise<boolean> {
  const sanityClient = getSanityClient();
  if (!sanityClient) {
    console.log('Sanity client not available');
    return false;
  }

  try {
    await sanityClient.delete(id);
    console.log('Deleted Sanity recipe:', id);
    return true;
  } catch (error) {
    console.error('Error deleting Sanity recipe:', error);
    return false;
  }
}
