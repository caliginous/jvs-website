import { NextRequest, NextResponse } from 'next/server';
import { stripeService } from '@/lib/stripe';

export const runtime = 'edge';

export async function POST(request: NextRequest, { params }: { params: any }) {
  try {
    console.log('=== CREATE PAYMENT INTENT API START ===');
    
    // Initialize Stripe service
    await stripeService.initialize();
    
    // Parse request body
    const body = await request.json();
    const { amount, currency = 'gbp', metadata, description } = body;
    
    // Validate required fields
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      console.error('❌ [PAYMENT INTENT] Invalid amount:', amount);
      return NextResponse.json(
        { error: 'Invalid amount provided' },
        { status: 400 }
      );
    }
    
    if (!currency || typeof currency !== 'string') {
      console.error('❌ [PAYMENT INTENT] Invalid currency:', currency);
      return NextResponse.json(
        { error: 'Invalid currency provided' },
        { status: 400 }
      );
    }
    
    console.log('✅ [PAYMENT INTENT] Creating payment intent:', {
      amount,
      currency,
      metadata,
      description
    });
    
    // Create payment intent
    const paymentIntent = await stripeService.createPaymentIntent({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: metadata || {},
      description: description || 'JVS Event Ticket Purchase'
    });
    
    console.log('✅ [PAYMENT INTENT] Payment intent created successfully:', paymentIntent.id);
    
    // Return client secret (safe to send to frontend)
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
    
  } catch (error) {
    console.error('❌ [PAYMENT INTENT] Error:', error);
    
    // Handle specific Stripe errors
    if (error instanceof Error) {
      if (error.message.includes('Stripe not initialized')) {
        return NextResponse.json(
          { error: 'Payment service not configured' },
          { status: 503 }
        );
      }
      
      if (error.message.includes('Invalid API key')) {
        return NextResponse.json(
          { error: 'Payment service configuration error' },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
} 