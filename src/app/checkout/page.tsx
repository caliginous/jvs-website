'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getEventForCheckout, convertEventToCheckoutItem, type CheckoutItem } from '@/lib/checkout';

// We'll load Stripe dynamically after fetching the key
let stripePromise: Promise<import('@stripe/stripe-js').Stripe | null> | null = null;

export default function CheckoutPage() {
  const [stripeKey, setStripeKey] = useState<string | null>(null);
  const [stripeError, setStripeError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        // Fetch Stripe key
        const stripeResponse = await fetch('/api/stripe-config-v5'); // Cache-busting endpoint
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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Loading payment system...
            </h1>
            <p className="text-gray-600">
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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Payment System Unavailable
            </h1>
            <p className="text-gray-600 mb-6">
              {stripeError}. Please contact support.
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Go Back
            </button>
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
  const [ticketSelections, setTicketSelections] = useState<Array<{ label: string; price: number | string; qty: number }>>([]);
  const [stripeError, setStripeError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postcode: '',
    country: 'GB', // Use ISO country code instead of full name
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
      const tSelRaw = searchParams.get('tSel');

      if (eventId) {
        setIsLoadingEvent(true);
        try {
          const event = await getEventForCheckout(eventId);
          let selection: Array<{ label: string; price: number | string; qty: number }> = [];
          if (tSelRaw) {
            // Robustly decode and parse tSel; tolerate single/double encoding
            let decoded = tSelRaw;
            try { decoded = decodeURIComponent(tSelRaw); } catch { /* no-op */ }
            try {
              selection = JSON.parse(decoded);
            } catch {
              try { selection = JSON.parse(tSelRaw); } catch { selection = []; }
            }
            if (!Array.isArray(selection)) selection = [];
          }

          setTicketSelections(selection);
          const totalQty = selection.length > 0 ? selection.reduce((sum, s) => sum + (Number(s.qty) || 0), 0) : Number(searchParams.get('quantity') || 0) || 0;

          if (event && totalQty > 0) {
            const checkoutItem = convertEventToCheckoutItem(event, totalQty);
            setCheckoutItems([checkoutItem]);
          } else if (event) {
            // Fallback to quantity param if provided
            const qtyParam = Number(searchParams.get('quantity') || 0) || 0;
            if (qtyParam > 0) {
              const checkoutItem = convertEventToCheckoutItem(event, qtyParam);
              setCheckoutItems([checkoutItem]);
            } else {
              router.push('/events');
            }
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
    if (ticketSelections.length > 0) {
      return ticketSelections.reduce((total, s) => {
        const price = typeof s.price === 'string' ? parseFloat(String(s.price).replace(/[^0-9.]/g, '')) : Number(s.price || 0);
        return total + (price * (Number(s.qty) || 0));
      }, 0);
    }
    return checkoutItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
      return total + (price * item.quantity);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      console.error('Stripe not loaded');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      console.error('Card element not found');
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment method with Stripe (WooNuxt approach)
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          phone: form.phone,
          address: {
            line1: form.address,
            city: form.city,
            postal_code: form.postcode,
            country: form.country,
          },
        },
      });

      if (stripeError) {
        console.error('Stripe error:', stripeError);
        alert(`Payment error: ${stripeError.message}`);
        return;
      }

      if (!paymentMethod || !paymentMethod.id) {
        console.error('No payment method ID received from Stripe');
        alert('Failed to create payment method. Please try again.');
        return;
      }

      // WooNuxt approach: Submit to WooCommerce's native checkout endpoint
      const formData = new FormData();
      
      // Payment method details
      formData.append('payment_method', 'stripe');
      formData.append('stripe_payment_method', paymentMethod.id);
      formData.append('wc-stripe-payment-method', paymentMethod.id);
      formData.append('stripe_payment_method_id', paymentMethod.id);
      
      // Customer details (WooCommerce expects these field names)
      formData.append('billing_first_name', form.firstName);
      formData.append('billing_last_name', form.lastName);
      formData.append('billing_email', form.email);
      formData.append('billing_phone', form.phone);
      formData.append('billing_address_1', form.address);
      formData.append('billing_city', form.city);
      formData.append('billing_postcode', form.postcode);
      formData.append('billing_country', form.country);
      
      // Shipping details (same as billing for events)
      formData.append('shipping_first_name', form.firstName);
      formData.append('shipping_last_name', form.lastName);
      formData.append('shipping_address_1', form.address);
      formData.append('shipping_city', form.city);
      formData.append('shipping_postcode', form.postcode);
      formData.append('shipping_country', form.country);
      
      // Order items
      const eventId = searchParams.get('eventId') || (checkoutItems[0]?.id ?? '');
      const totalQty = ticketSelections.length > 0 ? ticketSelections.reduce((sum, s) => sum + (Number(s.qty) || 0), 0) : (checkoutItems[0]?.quantity ?? 1);
      if (eventId) {
        formData.append(`cart_item_key[0]`, String(eventId));
        formData.append(`cart_item[0][product_id]`, String(eventId));
        formData.append(`cart_item[0][quantity]`, String(totalQty));
        formData.append('eventId', String(eventId));
        formData.append('quantity', String(totalQty));
      }

      // Forward ticket selections to the API/worker
      if (ticketSelections.length > 0) {
        formData.append('tSel', JSON.stringify(ticketSelections));
      }
      
      // WooCommerce nonce and other required fields
      formData.append('woocommerce-process-checkout-nonce', 'woocommerce-process-checkout-nonce');
      formData.append('_wpnonce', 'woocommerce-process-checkout-nonce');
      formData.append('action', 'woocommerce_checkout');
      formData.append('checkout', 'true');
      
      console.log('Submitting to WooCommerce checkout with payment method:', paymentMethod.id);
      console.log('Form data keys:', Array.from(formData.keys()));

      // Submit to our API route (headless flow)
      const response = await fetch('/api/checkout', { method: 'POST', body: formData });
      console.log('Checkout API status:', response.status);
      let data: any = null;
      try { data = await response.json(); } catch (_) { /* ignore */ }
      if (!response.ok) {
        console.error('Checkout failed payload:', data);
        const msg = data?.error || data?.message || 'Payment processing failed';
        alert(msg);
        return;
      }
      // Success paths
      if (data?.requires_action && data?.client_secret) {
        const actionRes = await stripe.handleCardAction(data.client_secret);
        if (actionRes.error) {
          alert(actionRes.error.message || '3D Secure authentication failed');
          return;
        }
        // If SCA succeeds, proceed to success (order already created server-side)
        router.push('/checkout/success');
        return;
      }
      if (data?.redirect) {
        router.push(data.redirect);
        return;
      }
      // Fallback
      router.push('/checkout/success');

    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoadingEvent) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Loading event details...
            </h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
          
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            {/* Customer Details */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Postcode *</label>
                  <input
                    type="text"
                    name="postcode"
                    value={form.postcode}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                  <select
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="GB">United Kingdom</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                {checkoutItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <div>
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    {/* If ticket selections exist, omit single-price display to avoid confusion */}
                    {ticketSelections.length === 0 && (
                      <span className="font-medium text-gray-900">£{item.price}</span>
                    )}
                  </div>
                ))}

                {ticketSelections.length > 0 && (
                  <div className="mt-2 border-t border-gray-200 pt-3">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Tickets</h4>
                    <div className="space-y-1">
                      {ticketSelections.map((s, idx) => {
                        const unit = typeof s.price === 'string' ? parseFloat(String(s.price).replace(/[^0-9.]/g, '')) : Number(s.price || 0);
                        const qty = Number(s.qty) || 0;
                        if (!qty || !unit) return null;
                        const line = (unit * qty).toFixed(2);
                        return (
                          <div key={idx} className="flex justify-between text-sm text-gray-700">
                            <span>{s.label} × {qty} @ £{unit.toFixed(2)}</span>
                            <span>£{line}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-semibold text-gray-900">£{getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stripe Card Element */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Card Details *</label>
              
              {stripeError ? (
                <div className="border border-red-300 rounded-md p-3 bg-red-50">
                  <p className="text-red-600 text-sm">{stripeError}</p>
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="mt-2 text-sm text-red-700 underline hover:no-underline"
                  >
                    Refresh page to try again
                  </button>
                </div>
              ) : !stripe ? (
                <div className="border border-gray-300 rounded-md p-3 bg-gray-50">
                  <p className="text-gray-600 text-sm">Loading payment form...</p>
                </div>
              ) : (
                <div className="border border-gray-300 rounded-md p-3 focus-within:ring-2 focus-within:ring-blue-500">
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
              )}
            </div>

            <button
              type="submit"
              disabled={isProcessing || !stripe}
              className={[
                'w-full font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center',
                // Use our global palette classes so the button is never white-on-white
                'bg-deep-green text-white',
                !isProcessing && 'hover:bg-primary-green',
                (isProcessing || !stripe) && 'opacity-80 cursor-not-allowed'
              ].filter(Boolean).join(' ')}
            >
              {isProcessing && (
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" aria-hidden="true" />
              )}
              {isProcessing ? 'Processing Payment…' : `Pay £${getTotalPrice().toFixed(2)} with Stripe`}
            </button>

            <p className="text-sm text-gray-600 text-center mt-4">
              Your payment is secure and encrypted by Stripe
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Loading checkout...
          </h1>
        </div>
      </main>
      <Footer />
    </div>
  );
}