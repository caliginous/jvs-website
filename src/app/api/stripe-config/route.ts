import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  try {
    const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;

    if (!publishableKey) {
      console.error('STRIPE_PUBLISHABLE_KEY is not set in environment variables.');
      return NextResponse.json({ error: 'Stripe configuration not available' }, { status: 500 });
    }

    return NextResponse.json({ publishableKey });
  } catch (error) {
    console.error('Error fetching Stripe config:', error);
    return NextResponse.json({ error: 'Failed to load Stripe configuration' }, { status: 500 });
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