'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Stepper } from '@/components/ui/Stepper';
import { OrderSummary, type OrderItem } from '@/components/ui/OrderSummary';
import { getEventForCheckout, convertEventToCheckoutItem, type CheckoutItem } from '@/lib/checkout';

// We'll load Stripe dynamically after fetching the key
let stripePromise: Promise<import('@stripe/stripe-js').Stripe | null> | null = null;

const checkoutSteps = [
  { id: 'tickets', title: 'Tickets' },
  { id: 'details', title: 'Details' },
  { id: 'payment', title: 'Payment' },
  { id: 'confirmation', title: 'Confirmation' }
];

export default function CheckoutPage() {
  const [stripeKey, setStripeKey] = useState<string | null>(null);
  const [stripeError, setStripeError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        // Fetch Stripe key
        const stripeResponse = await fetch('/api/stripe-config');
        if (!stripeResponse.ok) {
          throw new Error('Failed to fetch Stripe configuration');
        }
        const stripeData = await stripeResponse.json();
        if (stripeData.publishableKey) {
          setStripeKey(stripeData.publishableKey);
          // Initialize Stripe with the fetched key
          stripePromise = loadStripe(stripeData.publishableKey);
        } else {
          setStripeError('Stripe configuration not found');
        }
      } catch (error) {
        console.error('Error fetching configuration:', error);
        setStripeError('Failed to load payment configuration');
      }
    };

    fetchConfig();
  }, []);

  // Show loading while fetching Stripe key
  if (!stripeKey && !stripeError) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-4">
              Loading payment system...
            </h1>
            <p className="text-neutral-600">
              Please wait while we initialize secure payment processing.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show error if Stripe key couldn't be loaded
  if (stripeError) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-neutral-900 mb-4">
              Payment System Unavailable
            </h1>
            <p className="text-neutral-600 mb-6">
              {stripeError}. Please contact support.
            </p>
            <Button onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <Suspense fallback={<CheckoutLoading />}>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </Suspense>
  );
}

function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stripe = useStripe();
  const elements = useElements();
  
  const [isLoadingEvent, setIsLoadingEvent] = useState(true);
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);
  const [stripeError, setStripeError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postcode: '',
    country: 'GB',
  });

  // Check if Stripe is properly loaded
  useEffect(() => {
    if (!stripe) {
      setStripeError('Stripe is not loaded. Please refresh the page.');
    } else {
      setStripeError(null);
    }
  }, [stripe]);

  useEffect(() => {
    const fetchEventData = async () => {
      const eventId = searchParams.get('eventId');
      const quantity = searchParams.get('quantity');

      if (eventId && quantity) {
        setIsLoadingEvent(true);
        try {
          const event = await getEventForCheckout(eventId);
          if (event) {
            const checkoutItem = convertEventToCheckoutItem(event, parseInt(quantity));
            setCheckoutItems([checkoutItem]);
          } else {
            router.push('/events');
          }
        } catch (error) {
          console.error('Error fetching event for checkout:', error);
          router.push('/events');
        } finally {
          setIsLoadingEvent(false);
        }
      } else {
        setIsLoadingEvent(false);
      }
    };

    fetchEventData();
  }, [searchParams, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getTotalPrice = () => {
    return checkoutItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
      return total + (price * item.quantity);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) {
      setStripeError('Stripe is not loaded. Please refresh the page.');
      return;
    }

    setIsProcessing(true);
    setStripeError(null);

    try {
      // Here you would typically:
      // 1. Create a payment intent on your backend
      // 2. Confirm the payment with Stripe
      // 3. Handle success/error responses
      
      // For now, we'll simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Move to confirmation step
      setCurrentStep(3);
    } catch (error) {
      console.error('Payment error:', error);
      setStripeError('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoadingEvent) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-4">
              Loading event details...
            </h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Convert checkout items to order summary format
  const orderItems: OrderItem[] = checkoutItems.map(item => ({
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    price: parseFloat(item.price.replace(/[^0-9.]/g, '')),
    description: `${new Date(item.eventDate).toLocaleDateString('en-GB')} at ${item.eventVenue}`
  }));

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Stepper */}
        <div className="max-w-4xl mx-auto mb-8">
          <Stepper currentStep={currentStep} steps={checkoutSteps} />
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Complete Your Purchase</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Customer Details */}
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Customer Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-2">
                            First Name *
                          </label>
                          <Input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={form.firstName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-2">
                            Last Name *
                          </label>
                          <Input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={form.lastName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                            Email Address *
                          </label>
                          <Input
                            type="email"
                            id="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
                            Phone Number
                          </label>
                          <Input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Billing Address</h3>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="address" className="block text-sm font-medium text-neutral-700 mb-2">
                            Address *
                          </label>
                          <Input
                            type="text"
                            id="address"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-2">
                              City *
                            </label>
                            <Input
                              type="text"
                              id="city"
                              name="city"
                              value={form.city}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="postcode" className="block text-sm font-medium text-neutral-700 mb-2">
                              Postcode *
                            </label>
                            <Input
                              type="text"
                              id="postcode"
                              name="postcode"
                              value={form.postcode}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="country" className="block text-sm font-medium text-neutral-700 mb-2">
                              Country *
                            </label>
                            <select
                              id="country"
                              name="country"
                              value={form.country}
                              onChange={handleChange}
                              className="block w-full rounded-xl border-neutral-300 focus:border-primary-600 focus:ring-primary-600 text-neutral-800 px-4 py-3"
                              required
                            >
                              <option value="GB">United Kingdom</option>
                              <option value="US">United States</option>
                              <option value="CA">Canada</option>
                              <option value="AU">Australia</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment */}
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Payment Information</h3>
                      <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50">
                        <CardElement
                          options={{
                            style: {
                              base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': {
                                  color: '#aab7c4',
                                },
                              },
                              invalid: {
                                color: '#9e2146',
                              },
                            },
                          }}
                        />
                      </div>
                    </div>

                    {/* Error Display */}
                    {stripeError && (
                      <div className="bg-error-50 border border-error-200 rounded-xl p-4">
                        <p className="text-error-600">{stripeError}</p>
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isProcessing || !stripe}
                      size="lg"
                      className="w-full"
                    >
                      {isProcessing ? 'Processing Payment...' : `Pay £${getTotalPrice().toFixed(2)}`}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <OrderSummary
                items={orderItems}
                subtotal={getTotalPrice()}
                total={getTotalPrice()}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">
            Loading checkout...
          </h1>
        </div>
      </main>
      <Footer />
    </div>
  );
}