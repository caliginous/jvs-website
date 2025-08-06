'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { wpClient } from '@/lib/wpClient';
import { ADD_TO_CART } from '@/lib/queries';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TestMutationPage() {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [addToCart] = useMutation(ADD_TO_CART, {
    client: wpClient,
  });

  const testMutation = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Test with minimal data
      const testInput = {
        items: [
          {
            productId: 11667, // Try a different product ID
            quantity: 1
          }
        ],
        customer: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          phone: '1234567890',
          address: '123 Test St',
          city: 'Test City',
          postcode: 'TE1 1ST',
          country: 'United Kingdom'
        },
        paymentMethod: 'bacs',
        paymentMethodTitle: 'Bank Transfer'
      };

      console.log('Testing mutation with input:', testInput);

      const response = await addToCart({
        variables: {
          input: {
            productId: 11667,
            quantity: 1
          }
        }
      });

      console.log('Mutation response:', response);
      setResult(JSON.stringify(response, null, 2));

    } catch (err: unknown) {
      console.error('Mutation error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Test GraphQL Mutation</h1>
          
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Test createEventOrder Mutation</h2>
            
            <button
              onClick={testMutation}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 mb-4"
            >
              {isLoading ? 'Testing...' : 'Test Mutation'}
            </button>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {result && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-800 mb-2">Success</h3>
                <pre className="text-sm text-green-700 overflow-auto">
                  {result}
                </pre>
              </div>
            )}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">Debug Information</h2>
            <ul className="text-yellow-700 space-y-1">
              <li>• GraphQL Endpoint: https://jvs.org.uk/graphql</li>
              <li>• Mutation: createEventOrder</li>
              <li>• Product ID: 11933 (Community Gardening Club 27th July)</li>
              <li>• Check browser console for detailed logs</li>
            </ul>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 