'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery } from '@apollo/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getEventForCheckout, convertEventToCheckoutItem, type CheckoutItem } from '@/lib/checkout';
import { ADD_TO_CART, GET_CART } from '@/lib/queries';
import { wpClient } from '@/lib/wpClient';

interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postcode: string;
  country: string;
}

function CheckoutV2Content() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEvent, setIsLoadingEvent] = useState(true);
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);
  // Form state removed as we're using WooCommerce checkout

  const [addToCart] = useMutation(ADD_TO_CART, {
    client: wpClient,
  });

  const { data: cartData, refetch: refetchCart } = useQuery(GET_CART, {
    client: wpClient,
  });

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

  // Form update function removed as we're using WooCommerce checkout

  const getTotalPrice = () => {
    return checkoutItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
      return total + (price * item.quantity);
    }, 0);
  };

  const handleAddToCart = async () => {
    setIsLoading(true);

    try {
      // Add items to cart using standard WooCommerce mutation
      for (const item of checkoutItems) {
        await addToCart({
          variables: {
            input: {
              productId: parseInt(item.id),
              quantity: item.quantity
            }
          }
        });
      }

      // Refresh cart data
      await refetchCart();

      // Redirect to WooCommerce checkout
              window.location.href = '/checkout/';

    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add items to cart. Please try again.');
    } finally {
      setIsLoading(false);
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
              Loading checkout...
            </h1>
            <p className="text-gray-600">
              Please wait while we prepare your order.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              No items in checkout
            </h1>
            <p className="text-gray-600 mb-6">
              Please return to the events page to select tickets.
            </p>
            <button
              onClick={() => router.push('/events')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Browse Events
            </button>
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="lg:order-2">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                {checkoutItems.map((item, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 mb-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(item.eventDate).toLocaleDateString('en-GB', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        <p className="text-sm text-gray-600">{item.eventVenue}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="font-semibold">£{(parseFloat(item.price) * item.quantity).toFixed(2)}</div>
                        <div className="text-sm text-gray-600">£{item.price} each</div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold text-blue-600">£{getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Cart Status */}
              {cartData?.cart && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Cart Status</h3>
                  <p className="text-green-700">
                    Items in cart: {cartData.cart.contents.nodes.length}
                  </p>
                  <p className="text-green-700">
                    Cart total: £{cartData.cart.total}
                  </p>
                </div>
              )}
            </div>

            {/* Checkout Form */}
            <div className="lg:order-1">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-6">Add to Cart</h2>
                
                <p className="text-gray-600 mb-6">
                  Click the button below to add your tickets to the cart and proceed to WooCommerce checkout.
                </p>

                <button
                  onClick={handleAddToCart}
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  {isLoading ? 'Adding to Cart...' : `Add to Cart - £${getTotalPrice().toFixed(2)}`}
                </button>

                <p className="text-sm text-gray-600 text-center mt-4">
                  You&apos;ll be redirected to WooCommerce checkout to complete your purchase
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function CheckoutV2Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Loading checkout...
          </h1>
          <p className="text-gray-600">
            Please wait while we prepare your order.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function CheckoutV2Page() {
  return (
    <Suspense fallback={<CheckoutV2Loading />}>
      <CheckoutV2Content />
    </Suspense>
  );
} 