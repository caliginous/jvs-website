'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface OrderDetails {
  orderId: string;
  orderNumber: string;
  total: string;
  eventName: string;
}

export default function CheckoutSuccessPage() {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [orderWarning, setOrderWarning] = useState<string | null>(null);

  useEffect(() => {
    // Get order details from session storage
    const stored = sessionStorage.getItem('orderDetails');
    const warning = sessionStorage.getItem('orderWarning');
    
    if (stored) {
      try {
        setOrderDetails(JSON.parse(stored));
        // Clear from session storage
        sessionStorage.removeItem('orderDetails');
      } catch (error) {
        console.error('Error parsing order details:', error);
      }
    }
    
    if (warning) {
      setOrderWarning(warning);
      sessionStorage.removeItem('orderWarning');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Success Icon */}
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

                                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                          {orderWarning ? 'Test Order Created!' : 'Payment Successful!'}
                        </h1>

                        <p className="text-lg text-gray-600 mb-6">
                          {orderWarning 
                            ? 'This is a test order. The WordPress plugin needs to be installed for real orders.'
                            : 'Thank you for your purchase. Your tickets have been confirmed and you will receive a confirmation email shortly.'
                          }
                        </p>

                        {orderWarning && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                            <h2 className="text-lg font-semibold text-yellow-800 mb-2">⚠️ Test Mode</h2>
                            <p className="text-yellow-700">
                              {orderWarning}
                            </p>
                          </div>
                        )}

            {/* Order Details */}
            {orderDetails && (
              <div className="bg-blue-50 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
                <div className="space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="font-medium">Order Number:</span>
                    <span className="text-blue-600 font-semibold">{orderDetails.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Event:</span>
                    <span>{orderDetails.eventName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Total:</span>
                    <span className="text-green-600 font-semibold">{orderDetails.total}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">What happens next?</h2>
              <div className="space-y-3 text-left">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-blue-600 text-sm font-semibold">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Confirmation Email</p>
                    <p className="text-sm text-gray-600">You&apos;ll receive a confirmation email with your ticket details within the next few minutes.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-blue-600 text-sm font-semibold">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Event Reminders</p>
                    <p className="text-sm text-gray-600">We&apos;ll send you reminders about the event as it approaches.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-blue-600 text-sm font-semibold">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Event Day</p>
                    <p className="text-sm text-gray-600">Please bring your confirmation email or ticket to the event for entry.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Link
                href="/events"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Browse More Events
              </Link>
              
              <div className="text-sm text-gray-600">
                <p>Having trouble? Contact us at{' '}
                  <a href="mailto:info@jvs.org.uk" className="text-blue-600 hover:text-blue-700">
                    info@jvs.org.uk
                  </a>
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