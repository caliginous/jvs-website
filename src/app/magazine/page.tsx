'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Magazine {
  id: string;
  title: string;
  date: string;
  r2_key: string;
  cover_image?: string;
  ocr_text?: string;
  summary?: string;
  pdf_url: string;
}

export default function MagazineArchivePage() {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMagazines();
  }, []);

  const fetchMagazines = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/list-magazines');
      
      if (!response.ok) {
        throw new Error('Failed to fetch magazines');
      }
      
      const data = await response.json();
      setMagazines(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long'
    });
  };

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
            <div className="text-red-600 text-xl mb-4">⚠️ Error</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchMagazines}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Jewish Vegetarian Society Magazine Archive
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Explore our complete collection of magazines from 1990 to present
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/magazine/search"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search Archive
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600">{magazines.length}</div>
              <div className="text-gray-600">Total Issues</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">
                {magazines.filter(m => m.ocr_text).length}
              </div>
              <div className="text-gray-600">Searchable Issues</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">
                {new Date(magazines[0]?.date || '').getFullYear()}
              </div>
              <div className="text-gray-600">Latest Issue</div>
            </div>
          </div>
        </div>

        {/* Magazine Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {magazines.map((magazine) => (
            <div key={magazine.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {magazine.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {formatDate(magazine.date)}
                </p>
                
                <div className="flex space-x-2">
                  <Link
                    href={`/magazine/${magazine.id}`}
                    className="flex-1 px-4 py-2 bg-green-600 text-white text-center rounded hover:bg-green-700 transition-colors"
                  >
                    View Details
                  </Link>
                  <a
                    href={magazine.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </a>
                </div>
                
                {magazine.ocr_text && (
                  <div className="mt-3 text-sm text-green-600">
                    ✓ Searchable content available
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-600">
          <p>
            This archive contains all issues of the Jewish Vegetarian Society magazine from 1990 to present.
          </p>
          <p className="mt-2 text-sm">
            Use the search function to find specific content across all issues.
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 