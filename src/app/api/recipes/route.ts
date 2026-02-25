import { NextRequest, NextResponse } from 'next/server';
import { getSanityRecipes } from '@/lib/recipes/clients/sanity';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    console.log('🍳 [RECIPES API] Fetching recipes from Sanity...');
    const unifiedRecipes = await getSanityRecipes();
    console.log(`🍳 [RECIPES API] Returning ${unifiedRecipes.length} recipes (Sanity)`);

    // Add cache headers for short-term caching
    const response = NextResponse.json(unifiedRecipes);
    response.headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    response.headers.set('X-Recipes-Source', `sanity:${unifiedRecipes.length}`);
    
    return response;

  } catch (error) {
    console.error('🍳 [RECIPES API] Error fetching recipes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recipes' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
