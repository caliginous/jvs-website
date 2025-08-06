import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest, { params }: { params: any }) {
  try {
    // Get Stripe publishable key from KV store (Cloudflare Workers) or environment variable (development)
    let stripePublishableKey: string | null = null;
    
    // Try to get from environment first (for development)
    stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
    
    if (stripePublishableKey) {
      console.log('✅ [STRIPE CONFIG] Using environment variable for publishable key');
    } else {
      console.log('⚠️ [STRIPE CONFIG] No environment variable found, checking KV store');
    }
    
    if (!stripePublishableKey) {
      console.error('❌ [STRIPE CONFIG] STRIPE_PUBLISHABLE_KEY not found in environment or KV store');
      return NextResponse.json(
        { error: 'Stripe configuration not available' },
        { status: 500 }
      );
    }
    
    console.log('✅ [STRIPE CONFIG] Returning publishable key');
    
    return NextResponse.json({
      publishableKey: stripePublishableKey
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (error) {
    console.error('❌ [STRIPE CONFIG] Error:', error);
    return NextResponse.json(
      { error: 'Failed to load Stripe configuration' },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
} 