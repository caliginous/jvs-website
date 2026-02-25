import Stripe from 'stripe';

interface StripeConfig {
  publishableKey: string;
  secretKey?: string;
}

interface PaymentIntentData {
  amount: number;
  currency: string;
  metadata?: Record<string, string>;
  description?: string;
}

export class StripeService {
  private stripe: Stripe | null = null;
  private config: StripeConfig | null = null;

  constructor() {
    // Initialize Stripe only when needed
  }

  async initialize(env?: any): Promise<void> {
    try {
      let secretKey: string | null = null;

      // Try to get secret key from KV store (Cloudflare Workers) or environment variable (development)
      if (env?.JVS_SECRETS) {
        try {
          secretKey = await env.JVS_SECRETS.get('STRIPE_SECRET_KEY');
          console.log('✅ [STRIPE] Retrieved secret key from KV store');
        } catch (error) {
          console.log('⚠️ [STRIPE] Could not retrieve secret key from KV store:', error);
        }
      }

      // Fallback to environment variable
      if (!secretKey) {
        secretKey = process.env.STRIPE_SECRET_KEY || null;
        if (secretKey) {
          console.log('✅ [STRIPE] Using environment variable for secret key');
        }
      }

      if (!secretKey) {
        console.error('❌ [STRIPE] No secret key found in KV store or environment');
        throw new Error('Stripe secret key not configured');
      }

      this.stripe = new Stripe(secretKey, {
        apiVersion: '2024-12-18.acacia',
        typescript: true,
      });

      console.log('✅ [STRIPE] Initialized successfully');
    } catch (error) {
      console.error('❌ [STRIPE] Initialization failed:', error);
      throw error;
    }
  }

  async createPaymentIntent(data: PaymentIntentData): Promise<Stripe.PaymentIntent> {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: data.amount,
        currency: data.currency,
        metadata: data.metadata,
        description: data.description,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      console.log('✅ [STRIPE] Payment intent created:', paymentIntent.id);
      return paymentIntent;
    } catch (error) {
      console.error('❌ [STRIPE] Failed to create payment intent:', error);
      throw error;
    }
  }

  async retrievePaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      console.log('✅ [STRIPE] Payment intent retrieved:', paymentIntent.id);
      return paymentIntent;
    } catch (error) {
      console.error('❌ [STRIPE] Failed to retrieve payment intent:', error);
      throw error;
    }
  }

  async confirmPaymentIntent(paymentIntentId: string, paymentMethodId: string): Promise<Stripe.PaymentIntent> {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    try {
      const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethodId,
      });

      console.log('✅ [STRIPE] Payment intent confirmed:', paymentIntent.id);
      return paymentIntent;
    } catch (error) {
      console.error('❌ [STRIPE] Failed to confirm payment intent:', error);
      throw error;
    }
  }

  async refundPayment(paymentIntentId: string, amount?: number): Promise<Stripe.Refund> {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount, // Optional: if not provided, refunds the full amount
      });

      console.log('✅ [STRIPE] Refund created:', refund.id);
      return refund;
    } catch (error) {
      console.error('❌ [STRIPE] Failed to create refund:', error);
      throw error;
    }
  }

  isTestMode(): boolean {
    if (!this.stripe) {
      return false;
    }
    return this.stripe.getApiField('secretKey')?.startsWith('sk_test_') || false;
  }

  getPublishableKey(env?: any): string | null {
    // Try environment variable first
    let publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
    
    if (publishableKey) {
      return publishableKey;
    }

    // For production/staging, this should be set in wrangler.toml
    return null;
  }
}

// Export singleton instance
export const stripeService = new StripeService(); 