'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Magazine {
  id: string;
  title: string;
  date: string;
  pdf_url: string;
  cover_image?: string;
  summary?: string;
  ocr_text?: string;
}

export default function MagazinePage() {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMagazines = async () => {
      try {
        const response = await fetch('/api/list-magazines');
        if (!response.ok) {
          throw new Error('Failed to fetch magazines');
        }
        const data = await response.json();
        setMagazines(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load magazines');
      } finally {
        setLoading(false);
      }
    };

    fetchMagazines();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading magazine archive...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Error Loading Magazines</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Jewish Vegetarian Magazine Archive</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our collection of Jewish Vegetarian Society magazines, featuring articles on Jewish values, 
            vegetarianism, sustainability, and community.
          </p>
        </div>

        {magazines.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-600">No magazines available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {magazines.map((magazine) => (
              <div key={magazine.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {magazine.title}
                  </h2>
                  
                  <p className="text-gray-600 mb-4">
                    {new Date(magazine.date).toLocaleDateString('en-GB', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  
                  {magazine.summary && (
                    <p className="text-gray-700 mb-4 line-clamp-3">
                      {magazine.summary}
                    </p>
                  )}
                  
                  <div className="flex flex-col space-y-2">
                    <Link 
                      href={`/magazine/${magazine.id}`}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium text-center transition-colors"
                    >
                      Read Issue
                    </Link>
                    
                    <a 
                      href={magazine.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-4 py-2 rounded-md text-sm font-medium text-center transition-colors"
                    >
                      Download PDF
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 