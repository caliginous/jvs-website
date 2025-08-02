'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { wpClient } from '@/lib/wpClient';
import { gql } from '@apollo/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Basic test mutation
const BASIC_TEST_MUTATION = gql`
  mutation TestBasic($message: String!) {
    testSimple(input: { message: $message }) {
      success
      message
    }
  }
`;

export default function TestBasicPage() {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [testMutation] = useMutation(BASIC_TEST_MUTATION, {
    client: wpClient,
  });

  const runTest = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Running basic test mutation...');
      
      const response = await testMutation({
        variables: {
          message: 'Hello from frontend!'
        }
      });
      
      console.log('Basic test response:', response);
      setResult(JSON.stringify(response, null, 2));

    } catch (err: unknown) {
      console.error('Basic test error:', err);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Basic GraphQL Test</h1>
          
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Test Basic GraphQL Mutation</h2>
            
            <button
              onClick={runTest}
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 mb-4"
            >
              {isLoading ? 'Testing...' : 'Test Basic Mutation'}
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
              <li>• Whether GraphQL mutations work at all</li>
              <li>• Whether the test plugin is loaded</li>
              <li>• Basic GraphQL connectivity</li>
              <li>• No WooCommerce dependencies</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">Next Steps</h2>
            <ul className="text-yellow-700 space-y-1">
              <li>• If this works: The issue is with WooCommerce integration</li>
              <li>• If this fails: The issue is with GraphQL setup or plugin loading</li>
              <li>• Check WordPress error logs for specific PHP errors</li>
            </ul>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 