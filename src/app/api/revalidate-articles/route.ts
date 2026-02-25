import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { REVALIDATION_ENABLED } from '@/lib/articles/flags';

export async function POST(request: NextRequest) {
  try {
    // Check if revalidation is enabled
    if (!REVALIDATION_ENABLED) {
      console.log('⚠️ [REVALIDATE ARTICLES] Revalidation not enabled');
      return NextResponse.json(
        { error: 'Revalidation not enabled' },
        { status: 400 }
      );
    }

    // Verify the secret
    const authHeader = request.headers.get('authorization');
    const expectedSecret = process.env.REVALIDATE_ARTICLES_SECRET;
    
    if (!authHeader || !expectedSecret) {
      console.log('❌ [REVALIDATE ARTICLES] Missing authorization header or secret');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    if (token !== expectedSecret) {
      console.log('❌ [REVALIDATE ARTICLES] Invalid token');
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Parse the request body
    const body = await request.json();
    const { source, message, slug } = body;

    console.log(`🔄 [REVALIDATE ARTICLES] Revalidating articles...`);
    console.log(`📝 [REVALIDATE ARTICLES] Source: ${source || 'unknown'}`);
    console.log(`💬 [REVALIDATE ARTICLES] Message: ${message || 'No message'}`);
    
    if (slug) {
      console.log(`🔗 [REVALIDATE ARTICLES] Specific slug: ${slug}`);
    }

    // Revalidate tags and paths
    revalidateTag('articles');
    revalidatePath('/articles');
    revalidatePath('/');
    
    // If a specific slug was provided, revalidate that article page
    if (slug) {
      revalidateTag(`article:${slug}`);
      revalidatePath(`/articles/${slug}`);
    }

    console.log('✅ [REVALIDATE ARTICLES] Revalidation completed successfully');

    return NextResponse.json({
      success: true,
      message: 'Articles revalidated successfully',
      revalidated: {
        api: '/api/articles',
        listing: '/articles',
        homepage: '/',
        ...(slug && { article: `/articles/${slug}` }),
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ [REVALIDATE ARTICLES] Error during revalidation:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to revalidate articles',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Also handle GET requests for testing
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Articles revalidation endpoint',
    enabled: REVALIDATION_ENABLED,
    timestamp: new Date().toISOString(),
  });
}
