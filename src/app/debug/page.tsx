'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { wpClient } from '@/lib/wpClient';
import { INTROSPECTION_QUERY } from '@/lib/queries';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function DebugPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mutations, setMutations] = useState<Array<{name: string; description?: string}>>([]);

  const { data, error: queryError } = useQuery(INTROSPECTION_QUERY, {
    client: wpClient,
  });

  useEffect(() => {
    if (data?.__schema?.mutationType?.fields) {
      setMutations(data.__schema.mutationType.fields);
      setIsLoading(false);
    }
    if (queryError) {
      setError(queryError.message);
      setIsLoading(false);
    }
  }, [data, queryError]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">GraphQL Debug</h1>
          
          {isLoading && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Loading GraphQL schema...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          {mutations.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Available Mutations ({mutations.length})</h2>
              
              <div className="space-y-4">
                {mutations.map((mutation, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-600">{mutation.name}</h3>
                    {mutation.description && (
                      <p className="text-gray-600 mt-1">{mutation.description}</p>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">Looking for:</h3>
                <p className="text-yellow-700">
                  <strong>createEventOrder</strong> - This mutation should be available if the WordPress plugin is properly installed and activated.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 