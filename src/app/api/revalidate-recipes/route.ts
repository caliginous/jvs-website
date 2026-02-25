import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 [REVALIDATE RECIPES] Starting recipe revalidation...');
    
    // Verify the request has the correct secret
    const authHeader = request.headers.get('authorization');
    const expectedSecret = process.env.REVALIDATE_RECIPES_SECRET;
    
    if (!expectedSecret) {
      console.error('🔄 [REVALIDATE RECIPES] REVALIDATE_RECIPES_SECRET not configured');
      return NextResponse.json(
        { error: 'Revalidation secret not configured' },
        { status: 500 }
      );
    }

    if (!authHeader || authHeader !== `Bearer ${expectedSecret}`) {
      console.error('🔄 [REVALIDATE RECIPES] Invalid authorization header');
      return NextResponse.json(
        { error: 'Invalid authorization' },
        { status: 401 }
      );
    }

    // Get the request body to see what triggered the revalidation
    const body = await request.json().catch(() => ({}));
    console.log('🔄 [REVALIDATE RECIPES] Revalidation triggered by:', body);

    // Try to extract a slug from common Sanity webhook payload shapes
    const bodyAny: any = body as any;
    const slugFromBody =
      bodyAny?.slug?.current ||
      bodyAny?.slug ||
      bodyAny?.doc?.slug?.current ||
      bodyAny?.document?.slug?.current ||
      undefined;

    // Revalidate the recipes cache and pages using build-time aggregation
    revalidateTag('recipes');
    revalidatePath('/recipes');
    // Also refresh homepage which surfaces latest recipes
    revalidatePath('/');
    if (slugFromBody) {
      revalidatePath(`/recipes/${slugFromBody}`);
    }
    
    console.log('🔄 [REVALIDATE RECIPES] Successfully revalidated recipes cache');

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      message: 'Recipes cache/page revalidated successfully',
      slug: slugFromBody || null,
    });

  } catch (error) {
    console.error('🔄 [REVALIDATE RECIPES] Error during revalidation:', error);
    return NextResponse.json(
      { error: 'Failed to revalidate recipes' },
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
