'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { wpClient } from '@/lib/wpClient';
import { gql } from '@apollo/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Very simple test mutation
const SIMPLE_TEST_MUTATION = gql`
  mutation TestSimple {
    createEventOrder(input: {
      items: [{ productId: 1, quantity: 1 }]
      customer: {
        firstName: "Test"
        lastName: "User"
        email: "test@test.com"
        phone: "123"
        address: "123 Test"
        city: "Test"
        postcode: "TE1 1ST"
        country: "UK"
      }
      paymentMethod: "bacs"
      paymentMethodTitle: "Test"
    }) {
      success
      message
    }
  }
`;

export default function TestSimplePage() {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [testMutation] = useMutation(SIMPLE_TEST_MUTATION, {
    client: wpClient,
  });

  const runTest = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Running simple test mutation...');
      
      const response = await testMutation();
      
      console.log('Simple test response:', response);
      setResult(JSON.stringify(response, null, 2));

    } catch (err: unknown) {
      console.error('Simple test error:', err);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Simple GraphQL Test</h1>
          
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Test Basic Mutation</h2>
            
            <button
              onClick={runTest}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 mb-4"
            >
              {isLoading ? 'Testing...' : 'Run Simple Test'}
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

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">What This Tests</h2>
            <ul className="text-blue-700 space-y-1">
              <li>• Whether the createEventOrder mutation exists</li>
              <li>• Whether the GraphQL schema is properly registered</li>
              <li>• Whether the plugin is loading correctly</li>
              <li>• Basic input validation</li>
            </ul>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 