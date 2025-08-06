import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
    
    if (!publishableKey) {
      console.error('❌ [STRIPE CONFIG] STRIPE_PUBLISHABLE_KEY not found in environment');
      return NextResponse.json(
        { error: 'Stripe configuration not available' },
        { status: 500 }
      );
    }
    
    console.log('✅ [STRIPE CONFIG] Returning publishable key');
    
    return NextResponse.json({
      publishableKey: publishableKey
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