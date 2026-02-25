import { Recipe } from '@/lib/types';
import RecipeClient from './RecipeClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getSanityRecipes, getSanityRecipesByCategory, getSanityRecipesByTag, searchSanityRecipes } from '@/lib/recipes/clients/sanity';
import { normalizeSanityRecipe } from '@/lib/recipes/dedupe';

// Build-time fetch of recipes from Sanity only with optional filters
async function getRecipes(params?: { q?: string; category?: string; tag?: string }): Promise<Recipe[]> {
  try {
    const q = params?.q || '';
    const category = params?.category || '';
    const tag = params?.tag || '';

    let sanityRecipes: Awaited<ReturnType<typeof getSanityRecipes>> = [];
    if (q) {
      sanityRecipes = await searchSanityRecipes(q);
    } else if (category) {
      sanityRecipes = await getSanityRecipesByCategory(category);
    } else if (tag) {
      sanityRecipes = await getSanityRecipesByTag(tag);
    } else {
      sanityRecipes = await getSanityRecipes();
    }
    const mapped = sanityRecipes.map((r) => {
      const u = normalizeSanityRecipe(r as any);
      const rec: Recipe = {
        id: u.id,
        title: u.title,
        slug: u.slug,
        date: u.createdAt,
        excerpt: '',
        content: u.content,
        featuredImageUrl: u.featuredImage,
        ingredients: Array.isArray(u.ingredients) ? u.ingredients.join('\n') : '',
        instructions: Array.isArray(u.instructions) ? u.instructions.join('\n') : '',
        servings: u.servings?.toString(),
        preparationTime: u.preparationTime?.toString(),
        cookTime: u.cookTime?.toString(),
        difficulty: u.difficulty,
        categories: u.categories,
        tags: u.tags,
        source: 'sanity',
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      };
      return rec;
    });
    // Newest first by createdAt fallback to date
    mapped.sort((a, b) => new Date((b as any).createdAt || b.date).getTime() - new Date((a as any).createdAt || a.date).getTime());
    return mapped;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
}

export default async function RecipesPage({ searchParams }: { searchParams?: { q?: string; category?: string; tag?: string } }) {
  let recipes = await getRecipes({
    q: searchParams?.q,
    category: searchParams?.category,
    tag: searchParams?.tag,
  });

  // Fallback to API route if direct Sanity read produced no results
  if (!recipes || recipes.length === 0) {
    try {
      const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://jvs-vercel.vercel.app';
      const res = await fetch(`${origin}/api/recipes`, { next: { revalidate: 60 } });
      if (res.ok) {
        const sanityPayload = await res.json();
        // Normalize
        recipes = (sanityPayload || []).map((r: any) => {
          const u = normalizeSanityRecipe(r);
          return {
            id: u.id,
            title: u.title,
            slug: u.slug,
            date: u.createdAt,
            excerpt: '',
            content: u.content,
            featuredImageUrl: u.featuredImage,
            ingredients: Array.isArray(u.ingredients) ? u.ingredients.join('\n') : '',
            instructions: Array.isArray(u.instructions) ? u.instructions.join('\n') : '',
            servings: u.servings?.toString(),
            preparationTime: u.preparationTime?.toString(),
            cookTime: u.cookTime?.toString(),
            difficulty: u.difficulty,
            categories: u.categories,
            tags: u.tags,
            source: 'sanity',
            createdAt: u.createdAt,
            updatedAt: u.updatedAt,
          } as Recipe;
        });
      }
    } catch {}
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <RecipeClient initialRecipes={recipes} />
      <Footer />
    </div>
  );
} 

// Ensure this page renders on-demand so runtime fallbacks and API data are used
export const dynamic = 'force-dynamic';
export const revalidate = 0;